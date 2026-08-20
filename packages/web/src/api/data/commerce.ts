/**
 * Regras comerciais da loja em um único lugar.
 * Todo cálculo de preço/frete/desconto passa por aqui para que a vitrine,
 * a sacola e o checkout nunca mostrem números diferentes entre si.
 */

/** Frete grátis a partir deste valor de sacola (em centavos). */
export const FREE_SHIPPING_THRESHOLD_CENTS = 34_900;
export const SHIPPING_STANDARD_CENTS = 2_490;
export const SHIPPING_EXPRESS_CENTS = 4_990;
/** Desconto do Pix, aplicado sobre o total já com cupom e frete. */
export const PIX_DISCOUNT_PERCENT = 5;
export const MAX_INSTALLMENTS = 10;
/** Valor mínimo por parcela (em centavos) para liberar 10x. */
export const MIN_INSTALLMENT_CENTS = 3_000;

export type CartVariant = "full" | "decant5" | "decant10";

export interface VariantSpec {
	id: CartVariant;
	label: string;
	/** Multiplicador aplicado sobre o preço do frasco cheio. */
	factor: number;
	description: string;
}

/**
 * Decants são fracionados do mesmo frasco: o preço por ml é maior que o do
 * frasco cheio, o que mantém a margem e ainda dá entrada barata pro cliente.
 */
export const VARIANTS: VariantSpec[] = [
	{
		id: "full",
		label: "Frasco lacrado",
		factor: 1,
		description: "Frasco original selado, na caixa, com a fragrância completa.",
	},
	{
		id: "decant10",
		label: "Decant 10 ml",
		factor: 0.22,
		description: "Fracionado do frasco original em atomizador de vidro. Rende ~100 borrifadas.",
	},
	{
		id: "decant5",
		label: "Decant 5 ml",
		factor: 0.13,
		description: "Fracionado do frasco original em atomizador de vidro. Rende ~50 borrifadas.",
	},
];

export function variantSpec(id: CartVariant): VariantSpec {
	return VARIANTS.find((v) => v.id === id) ?? VARIANTS[0];
}

export function toCents(value: number): number {
	return Math.round(value * 100);
}

export function formatBRL(cents: number): string {
	return (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

/** Preço no cartão, em centavos, de uma variante do produto. */
export function variantPriceCents(basePrice: number, variant: CartVariant): number {
	const spec = variantSpec(variant);
	if (spec.id === "full") return toCents(basePrice);
	// Arredonda para o real mais próximo terminando em ,90 — preço de varejo.
	const raw = basePrice * spec.factor;
	return Math.max(1_990, Math.round(raw) * 100 - 10);
}

export function pixPriceCents(cardCents: number): number {
	return Math.round(cardCents * (1 - PIX_DISCOUNT_PERCENT / 100));
}

/** Quantas parcelas sem juros cabem num total, respeitando o mínimo por parcela. */
export function installmentPlan(totalCents: number): { count: number; valueCents: number } {
	const count = Math.max(1, Math.min(MAX_INSTALLMENTS, Math.floor(totalCents / MIN_INSTALLMENT_CENTS)));
	return { count, valueCents: Math.ceil(totalCents / count) };
}

export interface CouponSpec {
	code: string;
	label: string;
	percentOff: number;
	minSubtotalCents: number;
}

/**
 * Cupons ativos. Ficam aqui (e não só no banco) para que o front possa
 * anunciar exatamente o que o campo do checkout aceita — nunca anunciamos
 * um cupom que o campo recusa.
 */
export const COUPONS: CouponSpec[] = [
	{
		code: "PRIMEIRACOMPRA",
		label: "10% off na primeira compra",
		percentOff: 10,
		minSubtotalCents: 19_900,
	},
	{ code: "VOLTA10", label: "10% off para quem voltou", percentOff: 10, minSubtotalCents: 0 },
	{ code: "QUIZ15", label: "15% off do quiz olfativo", percentOff: 15, minSubtotalCents: 29_900 },
];

export function findCoupon(code: string): CouponSpec | null {
	const normalized = code.trim().toUpperCase();
	return COUPONS.find((c) => c.code === normalized) ?? null;
}

export interface CartLineInput {
	slug: string;
	variant: CartVariant;
	quantity: number;
}

export interface QuoteRequest {
	subtotalCents: number;
	couponCode?: string | null;
	shippingMethod?: "standard" | "express";
	paymentMethod?: "pix" | "card" | "boleto";
}

export interface Quote {
	subtotalCents: number;
	discountCents: number;
	shippingCents: number;
	/** Total final na forma de pagamento escolhida. */
	totalCents: number;
	/** Total no cartão/boleto (sem o desconto do Pix), sempre exibido rotulado. */
	cardTotalCents: number;
	/** Total no Pix, sempre exibido rotulado. */
	pixTotalCents: number;
	freeShipping: boolean;
	/** Quanto falta para o frete grátis. 0 = já tem. */
	missingForFreeShippingCents: number;
	coupon: { code: string; label: string; percentOff: number } | null;
	couponError: string | null;
	installments: { count: number; valueCents: number };
}

export function quote(req: QuoteRequest): Quote {
	const subtotalCents = Math.max(0, Math.round(req.subtotalCents));
	let discountCents = 0;
	let coupon: Quote["coupon"] = null;
	let couponError: string | null = null;

	if (req.couponCode?.trim()) {
		const spec = findCoupon(req.couponCode);
		if (!spec) {
			couponError = "Cupom não encontrado. Confira as letras e tente de novo.";
		} else if (subtotalCents < spec.minSubtotalCents) {
			couponError = `O cupom ${spec.code} vale em pedidos a partir de ${formatBRL(spec.minSubtotalCents)}.`;
		} else {
			discountCents = Math.round((subtotalCents * spec.percentOff) / 100);
			coupon = { code: spec.code, label: spec.label, percentOff: spec.percentOff };
		}
	}

	const afterDiscount = subtotalCents - discountCents;
	const freeShipping = afterDiscount >= FREE_SHIPPING_THRESHOLD_CENTS;
	const method = req.shippingMethod ?? "standard";
	let shippingCents = 0;
	if (subtotalCents > 0) {
		if (method === "express") shippingCents = SHIPPING_EXPRESS_CENTS;
		else shippingCents = freeShipping ? 0 : SHIPPING_STANDARD_CENTS;
	}

	const cardTotalCents = afterDiscount + shippingCents;
	const pixTotalCents = pixPriceCents(cardTotalCents);
	const paymentMethod = req.paymentMethod ?? "pix";
	const totalCents = paymentMethod === "pix" ? pixTotalCents : cardTotalCents;

	return {
		subtotalCents,
		discountCents,
		shippingCents,
		totalCents,
		cardTotalCents,
		pixTotalCents,
		freeShipping,
		missingForFreeShippingCents: Math.max(0, FREE_SHIPPING_THRESHOLD_CENTS - afterDiscount),
		coupon,
		couponError,
		installments: installmentPlan(cardTotalCents),
	};
}

/** Dias úteis somados a uma data, para prometer uma data concreta de entrega. */
export function addBusinessDays(from: Date, days: number): Date {
	const date = new Date(from);
	let left = days;
	while (left > 0) {
		date.setDate(date.getDate() + 1);
		const day = date.getDay();
		if (day !== 0 && day !== 6) left--;
	}
	return date;
}

export const SHIPPING_METHODS = [
	{
		id: "standard" as const,
		label: "Envio padrão",
		businessDays: 6,
		priceCents: SHIPPING_STANDARD_CENTS,
		note: "Grátis em pedidos acima de R$ 349",
	},
	{
		id: "express" as const,
		label: "Envio expresso",
		businessDays: 2,
		priceCents: SHIPPING_EXPRESS_CENTS,
		note: "Postado no mesmo dia útil para pedidos até 14h",
	},
];
