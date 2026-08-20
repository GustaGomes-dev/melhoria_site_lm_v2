import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { track, type TrackItem } from "./track";

export type CartVariant = "full" | "decant5" | "decant10";

export interface CartLine {
	slug: string;
	variant: CartVariant;
	quantity: number;
}

const STORAGE_KEY = "lm-cart-v1";
const COUPON_KEY = "lm-coupon-v1";
const LEAD_KEY = "lm-lead-v1";

interface CartApi {
	lines: CartLine[];
	/** false até o localStorage ser lido — evita redirecionar uma sacola cheia. */
	hydrated: boolean;
	itemCount: number;
	couponCode: string | null;
	drawerOpen: boolean;
	/** Contato já capturado — evita pedir o e-mail de novo na recuperação. */
	leadCaptured: boolean;
	add(line: CartLine, meta?: TrackItem): void;
	setQuantity(slug: string, variant: CartVariant, quantity: number): void;
	remove(slug: string, variant: CartVariant, meta?: TrackItem): void;
	clear(): void;
	setCoupon(code: string | null): void;
	openDrawer(): void;
	closeDrawer(): void;
	markLeadCaptured(): void;
}

const CartContext = createContext<CartApi | null>(null);

function read(): CartLine[] {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return [];
		const parsed = JSON.parse(raw);
		if (!Array.isArray(parsed)) return [];
		return parsed.filter(
			(l): l is CartLine =>
				typeof l?.slug === "string" && typeof l?.variant === "string" && typeof l?.quantity === "number",
		);
	} catch {
		return [];
	}
}

export function CartProvider({ children }: { children: React.ReactNode }) {
	const [lines, setLines] = useState<CartLine[]>([]);
	const [couponCode, setCouponCode] = useState<string | null>(null);
	const [drawerOpen, setDrawerOpen] = useState(false);
	const [leadCaptured, setLeadCaptured] = useState(false);
	const [hydrated, setHydrated] = useState(false);

	// Hidrata do localStorage só no cliente, depois do primeiro render.
	useEffect(() => {
		setLines(read());
		setCouponCode(localStorage.getItem(COUPON_KEY));
		setLeadCaptured(localStorage.getItem(LEAD_KEY) === "1");
		setHydrated(true);
	}, []);

	const persist = useCallback((next: CartLine[]) => {
		setLines(next);
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
		} catch {
			/* storage cheio ou bloqueado — a sacola segue só em memória */
		}
	}, []);

	const add = useCallback<CartApi["add"]>(
		(line, meta) => {
			const next = [...read()];
			const existing = next.find((l) => l.slug === line.slug && l.variant === line.variant);
			if (existing) existing.quantity = Math.min(20, existing.quantity + line.quantity);
			else next.push(line);
			persist(next);
			setDrawerOpen(true);
			if (meta) track.addToCart(meta);
		},
		[persist],
	);

	const setQuantity = useCallback<CartApi["setQuantity"]>(
		(slug, variant, quantity) => {
			const next = read()
				.map((l) => (l.slug === slug && l.variant === variant ? { ...l, quantity } : l))
				.filter((l) => l.quantity > 0);
			persist(next);
		},
		[persist],
	);

	const remove = useCallback<CartApi["remove"]>(
		(slug, variant, meta) => {
			persist(read().filter((l) => !(l.slug === slug && l.variant === variant)));
			if (meta) track.removeFromCart(meta);
		},
		[persist],
	);

	const clear = useCallback(() => {
		persist([]);
		setCouponCode(null);
		localStorage.removeItem(COUPON_KEY);
	}, [persist]);

	const setCoupon = useCallback((code: string | null) => {
		setCouponCode(code);
		if (code) localStorage.setItem(COUPON_KEY, code);
		else localStorage.removeItem(COUPON_KEY);
	}, []);

	const markLeadCaptured = useCallback(() => {
		setLeadCaptured(true);
		localStorage.setItem(LEAD_KEY, "1");
	}, []);

	const value = useMemo<CartApi>(
		() => ({
			lines,
			hydrated,
			itemCount: lines.reduce((sum, l) => sum + l.quantity, 0),
			couponCode,
			drawerOpen,
			leadCaptured,
			add,
			setQuantity,
			remove,
			clear,
			setCoupon,
			openDrawer: () => setDrawerOpen(true),
			closeDrawer: () => setDrawerOpen(false),
			markLeadCaptured,
		}),
		[lines, hydrated, couponCode, drawerOpen, leadCaptured, add, setQuantity, remove, clear, setCoupon, markLeadCaptured],
	);

	return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartApi {
	const ctx = useContext(CartContext);
	if (!ctx) throw new Error("useCart precisa estar dentro de <CartProvider>");
	return ctx;
}
