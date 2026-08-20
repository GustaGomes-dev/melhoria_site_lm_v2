import { BadgeCheck, PackageCheck, RotateCcw, Truck, Zap } from "lucide-react";
import { brl } from "../../lib/format";
import { cn } from "../../lib/utils";
import { TRUST_ITEMS } from "../../content/site";

/**
 * PriceBlock — todo total tem rótulo dizendo a forma de pagamento.
 * (O site antigo mostrava dois valores grandes soltos, R$ 284,06 e R$ 297,70,
 * sem dizer qual era qual. Isso não pode voltar a acontecer.)
 */
export function PriceBlock({
	pixCents,
	cardCents,
	installments,
	size = "md",
	className,
}: {
	pixCents: number;
	cardCents: number;
	installments?: { count: number; valueCents: number };
	size?: "sm" | "md" | "lg";
	className?: string;
}) {
	const sizes = {
		sm: "text-xl",
		md: "text-3xl",
		lg: "text-[2.6rem]",
	} as const;
	const saved = cardCents - pixCents;

	return (
		<div className={cn("space-y-1", className)}>
			<p className="eyebrow">Total no Pix · 5% off</p>
			<p className={cn("num-display leading-none font-semibold text-espresso", sizes[size])}>
				{brl(pixCents)}
			</p>
			<p className="text-sm text-espresso-soft">
				<span className="font-semibold text-espresso">No cartão:</span> {brl(cardCents)}
				{installments ? (
					<>
						{" "}
						em até {installments.count}x de {brl(installments.valueCents)} sem juros
					</>
				) : null}
			</p>
			{saved > 0 ? (
				<p className="text-xs text-brass-deep">Você economiza {brl(saved)} pagando no Pix.</p>
			) : null}
		</div>
	);
}

/** Fixação e projeção em blocos de 1 a 5, com a leitura em texto ao lado. */
export function StatBars({
	fixation,
	fixationLabel,
	projection,
	projectionLabel,
	occasions,
	occasionLabel,
}: {
	fixation: number;
	fixationLabel: string;
	projection: number;
	projectionLabel: string;
	occasions: string[];
	occasionLabel: string;
}) {
	const rows = [
		{
			label: "Fixação",
			value: fixation,
			text: fixationLabel,
			help: "Quanto tempo o perfume permanece na pele.",
		},
		{
			label: "Projeção",
			value: projection,
			text: projectionLabel,
			help: "Quanto ele se espalha no ambiente ao redor.",
		},
	];

	return (
		<div className="rounded-xl border border-line bg-paper p-5">
			<h3 className="text-sm font-semibold tracking-[0.08em] uppercase">Como ele se comporta</h3>
			<div className="mt-4 space-y-4">
				{rows.map((row) => (
					<div key={row.label}>
						<div className="flex items-baseline justify-between gap-3">
							<span className="text-sm font-semibold">{row.label}</span>
							<span className="text-sm text-espresso-soft">{row.text}</span>
						</div>
						<div className="mt-2 flex gap-1.5" aria-label={`${row.label}: ${row.value} de 5`}>
							{[1, 2, 3, 4, 5].map((i) => (
								<span
									key={i}
									className={cn(
										"h-2.5 flex-1 rounded-[3px]",
										i <= row.value ? "bg-brass" : "bg-line",
									)}
								/>
							))}
						</div>
						<p className="mt-1.5 text-xs text-espresso-mute">{row.help}</p>
					</div>
				))}
			</div>
			<div className="mt-5 border-t border-line pt-4">
				<p className="eyebrow mb-2">Melhor ocasião</p>
				{occasions.length ? (
					<ul className="flex flex-wrap gap-1.5">
						{occasions.map((o) => (
							<li
								key={o}
								className="rounded-full border border-line bg-bone px-3 py-1 text-xs capitalize"
							>
								{o}
							</li>
						))}
					</ul>
				) : (
					<p className="text-sm text-espresso-soft">{occasionLabel}</p>
				)}
			</div>
		</div>
	);
}

/** Barra de progresso do frete grátis. Aparece na sacola e no drawer. */
export function FreeShippingBar({
	missingCents,
	thresholdCents,
	subtotalCents,
	className,
}: {
	missingCents: number;
	thresholdCents: number;
	subtotalCents: number;
	className?: string;
}) {
	const pct = Math.min(100, Math.round((subtotalCents / thresholdCents) * 100));
	const done = missingCents <= 0;

	return (
		<div className={cn("rounded-lg border border-line bg-bone px-4 py-3", className)}>
			<div className="flex items-center gap-2">
				<Truck className={cn("size-4 shrink-0", done ? "text-brass-deep" : "text-espresso-mute")} aria-hidden />
				<p className="text-sm">
					{done ? (
						<span className="font-semibold text-brass-deep">Frete grátis liberado.</span>
					) : (
						<>
							Faltam <span className="font-semibold">{brl(missingCents)}</span> para o frete grátis
						</>
					)}
				</p>
			</div>
			<div className="mt-2 h-1.5 overflow-hidden rounded-full bg-line">
				<div
					className={cn("h-full rounded-full transition-all duration-300", done ? "bg-brass-deep" : "bg-brass")}
					style={{ width: `${pct}%` }}
				/>
			</div>
			{!done ? (
				<p className="mt-1.5 text-xs text-espresso-mute">
					Frete grátis no envio padrão a partir de {brl(thresholdCents)}.
				</p>
			) : null}
		</div>
	);
}

const TRUST_ICONS = {
	seal: BadgeCheck,
	return: RotateCcw,
	truck: PackageCheck,
	pix: Zap,
} as const;

export function TrustStrip({ variant = "light" }: { variant?: "light" | "dark" }) {
	const dark = variant === "dark";
	return (
		<div
			className={cn(
				"grid gap-px sm:grid-cols-2 lg:grid-cols-4",
				dark ? "bg-bone/15" : "border-y border-line bg-line",
			)}
		>
			{TRUST_ITEMS.map((item) => {
				const Icon = TRUST_ICONS[item.icon];
				return (
					<div
						key={item.title}
						className={cn("flex gap-3 px-5 py-6", dark ? "bg-espresso" : "bg-bone")}
					>
						<Icon
							className={cn("mt-0.5 size-5 shrink-0", dark ? "text-brass" : "text-brass-deep")}
							aria-hidden
						/>
						<div>
							<p className={cn("text-sm font-semibold", dark && "text-bone")}>{item.title}</p>
							<p className={cn("mt-1 text-xs leading-relaxed", dark ? "text-bone/65" : "text-espresso-mute")}>
								{item.detail}
							</p>
						</div>
					</div>
				);
			})}
		</div>
	);
}
