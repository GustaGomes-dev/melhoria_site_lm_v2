import { Info, Star } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "../../lib/utils";

/**
 * Dado que o dono da loja precisa substituir (CNPJ, endereço, contato).
 * Fica visivelmente marcado para não ir ao ar por engano.
 */
export function PlaceholderMark({
	children,
	className,
	title = "Dado de exemplo — substituir pelos dados reais da empresa",
}: {
	children: React.ReactNode;
	className?: string;
	title?: string;
}) {
	return (
		<span
			data-placeholder="true"
			title={title}
			className={cn(
				"placeholder-mark decoration-brass-deep/60 underline-offset-2",
				className,
			)}
		>
			{children}
		</span>
	);
}

/** Selo de conteúdo de demonstração (avaliações, contagem de vendas). */
export function DemoBadge({ label = "exemplo", className }: { label?: string; className?: string }) {
	return (
		<span
			data-placeholder="true"
			title="Conteúdo de demonstração — substituir por dados reais da loja"
			className={cn(
				"inline-flex items-center gap-1 rounded-full border border-dashed border-brass-deep bg-brass-wash px-2 py-[2px] text-[10px] font-semibold tracking-[0.12em] text-brass-deep uppercase",
				className,
			)}
		>
			<Info className="size-3" aria-hidden />
			{label}
		</span>
	);
}

export function Stars({ rating, size = 14 }: { rating: number; size?: number }) {
	return (
		<span className="inline-flex items-center gap-[2px]" aria-label={`${rating} de 5`}>
			{[1, 2, 3, 4, 5].map((i) => (
				<Star
					key={i}
					style={{ width: size, height: size }}
					className={
						i <= Math.round(rating) ? "fill-brass stroke-brass" : "fill-transparent stroke-line"
					}
					aria-hidden
				/>
			))}
		</span>
	);
}

export function Eyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
	return <p className={cn("eyebrow", className)}>{children}</p>;
}

export function Pill({
	children,
	tone = "neutral",
	className,
}: {
	children: React.ReactNode;
	tone?: "neutral" | "brass" | "emerald" | "dark";
	className?: string;
}) {
	const tones = {
		neutral: "border-line bg-paper text-espresso-soft",
		brass: "border-brass-deep/30 bg-brass-wash text-brass-deep",
		// Verde-fumo é reservado ao comparativo olfativo.
		emerald: "border-emerald/25 bg-emerald-wash text-emerald",
		dark: "border-espresso bg-espresso text-bone",
	} as const;
	return (
		<span
			className={cn(
				"inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium",
				tones[tone],
				className,
			)}
		>
			{children}
		</span>
	);
}

/** Reveal escalonado. Respeita prefers-reduced-motion. */
export function Reveal({
	children,
	delay = 0,
	className,
	as = "div",
}: {
	children: React.ReactNode;
	delay?: number;
	className?: string;
	as?: "div" | "section" | "li" | "article";
}) {
	const reduce = useReducedMotion();
	const Comp = motion[as];
	if (reduce) return <div className={className}>{children}</div>;
	return (
		<Comp
			className={className}
			initial={{ opacity: 0, y: 12 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, margin: "-60px" }}
			transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
		>
			{children}
		</Comp>
	);
}

export function SectionHeading({
	eyebrow,
	title,
	description,
	action,
	className,
}: {
	eyebrow?: string;
	title: React.ReactNode;
	description?: React.ReactNode;
	action?: React.ReactNode;
	className?: string;
}) {
	return (
		<div className={cn("flex flex-wrap items-end justify-between gap-6", className)}>
			<div className="max-w-2xl">
				{eyebrow ? <Eyebrow className="mb-3">{eyebrow}</Eyebrow> : null}
				<h2 className="display-h2">{title}</h2>
				{description ? <p className="mt-3 text-espresso-soft">{description}</p> : null}
			</div>
			{action}
		</div>
	);
}

/** Botão do design system. Pill para primário, retangular suave para secundário. */
export function LmButton({
	children,
	variant = "primary",
	size = "md",
	className,
	...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
	variant?: "primary" | "dark" | "outline" | "ghost";
	size?: "sm" | "md" | "lg";
}) {
	const variants = {
		primary: "bg-brass text-espresso hover:bg-brass-deep hover:text-bone",
		dark: "bg-espresso text-bone hover:bg-espresso-soft",
		outline: "border border-espresso/25 bg-transparent text-espresso hover:border-espresso hover:bg-espresso/5",
		ghost: "text-espresso-soft hover:bg-espresso/5 hover:text-espresso",
	} as const;
	const sizes = {
		sm: "h-10 px-4 text-sm",
		md: "h-12 px-6 text-sm",
		lg: "h-14 px-8 text-base",
	} as const;
	return (
		<button
			type="button"
			{...rest}
			className={cn(
				"inline-flex min-h-11 items-center justify-center gap-2 rounded-full font-semibold transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-50",
				variants[variant],
				sizes[size],
				className,
			)}
		>
			{children}
		</button>
	);
}

export function Skeleton({ className }: { className?: string }) {
	return <div className={cn("animate-pulse rounded-md bg-bone-deep", className)} />;
}
