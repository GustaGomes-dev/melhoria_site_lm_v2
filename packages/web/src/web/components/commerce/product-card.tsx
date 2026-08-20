import { Link } from "wouter";
import { brl, brlFromReais } from "../../lib/format";
import { cn } from "../../lib/utils";
import { DemoBadge, Stars } from "../ui/bits";
import { SimilarityBar } from "./similarity";

export interface ProductCardData {
	slug: string;
	name: string;
	brand: string;
	volume: string | null;
	gender: string;
	family: string;
	price: number;
	pixPrice: number;
	fixation: number;
	fixationLabel: string;
	projection: number;
	projectionLabel: string;
	occasionLabel: string;
	similarity: number | null;
	referenceName: string | null;
	referenceBrand: string | null;
	highlightNotes: string[];
	imageBottle: string | null;
	bestSellerRank: number | null;
	decant5PixCents: number;
	decant10PixCents: number;
	demoRating: number;
	demoReviewCount: number;
	demoSold: number;
}

/** Barra pequena de 5 blocos, usada quando o produto não tem comparativo. */
function MiniStat({ label, value }: { label: string; value: number }) {
	return (
		<div className="flex items-center gap-2">
			<span className="w-[52px] shrink-0 text-[10px] tracking-[0.08em] text-espresso-mute uppercase">
				{label}
			</span>
			<span className="flex gap-[3px]" aria-label={`${label}: ${value} de 5`}>
				{[1, 2, 3, 4, 5].map((i) => (
					<span
						key={i}
						className={cn("h-[6px] w-[9px] rounded-[2px]", i <= value ? "bg-brass" : "bg-line")}
					/>
				))}
			</span>
		</div>
	);
}

export function ProductCard({ product, priority }: { product: ProductCardData; priority?: boolean }) {
	const hasComparison = product.similarity != null;

	return (
		<article className="group flex h-full flex-col overflow-hidden rounded-xl border border-line bg-paper transition-all duration-200 hover:-translate-y-0.5 hover:border-espresso/30">
			<Link
				to={`/produto/${product.slug}`}
				className="relative block aspect-4/5 overflow-hidden bg-bone-deep"
				aria-label={product.name}
			>
				{product.imageBottle ? (
					<img
						src={product.imageBottle}
						alt={`${product.name} — ${product.brand}`}
						loading={priority ? "eager" : "lazy"}
						decoding="async"
						className="h-full w-full object-contain p-4 transition-transform duration-300 group-hover:scale-[1.04]"
					/>
				) : (
					<span className="flex h-full items-center justify-center text-sm text-espresso-mute">
						{product.brand}
					</span>
				)}
				{product.bestSellerRank ? (
					<span className="absolute top-3 left-3 rounded-full bg-espresso px-2.5 py-1 text-[10px] font-semibold tracking-[0.1em] text-bone uppercase">
						#{product.bestSellerRank} mais vendido
					</span>
				) : null}
			</Link>

			<div className="flex flex-1 flex-col gap-3 p-4">
				<div>
					<p className="eyebrow">{product.brand}</p>
					<h3 className="mt-1 text-[15px] leading-snug font-semibold">
						<Link to={`/produto/${product.slug}`} className="hover:text-brass-deep">
							{product.name}
						</Link>
					</h3>
					<p className="mt-1 text-xs text-espresso-mute">
						{product.gender} · {product.family}
						{product.volume ? ` · ${product.volume}` : ""}
					</p>
				</div>

				{hasComparison ? (
					<SimilarityBar
						similarity={product.similarity as number}
						referenceName={product.referenceName}
						referenceBrand={product.referenceBrand}
					/>
				) : (
					<div className="rounded-lg border border-line bg-bone px-3 py-2.5">
						<p className="text-[10px] font-semibold tracking-[0.14em] text-espresso-mute uppercase">
							Perfil olfativo
						</p>
						{product.highlightNotes.length ? (
							<p className="mt-1.5 text-xs leading-snug text-espresso-soft">
								{product.highlightNotes.join(" · ")}
							</p>
						) : (
							<p className="mt-1.5 text-xs leading-snug text-espresso-soft">
								{product.family} · {product.occasionLabel}
							</p>
						)}
						<div className="mt-2 space-y-1">
							<MiniStat label="Fixação" value={product.fixation} />
							<MiniStat label="Projeção" value={product.projection} />
						</div>
					</div>
				)}

				<div className="mt-auto">
					<div className="flex items-center gap-1.5 text-xs text-espresso-mute">
						<Stars rating={product.demoRating} size={12} />
						<span className="whitespace-nowrap">
							{product.demoRating.toFixed(1)} ({product.demoReviewCount})
						</span>
						<DemoBadge className="ml-auto" />
					</div>
					<p className="num-display mt-2 text-xl leading-none font-semibold text-espresso">
						{brlFromReais(product.pixPrice)}
						<span className="ml-1.5 font-sans text-[11px] font-semibold tracking-normal text-brass-deep">
							no Pix
						</span>
					</p>
					<p className="mt-1 text-xs text-espresso-mute">
						ou {brlFromReais(product.price)} no cartão em até 10x
					</p>
					<p className="mt-1 text-xs text-espresso-mute">
						decant de 5 ml por {brl(product.decant5PixCents)}
					</p>
					<Link
						to={`/produto/${product.slug}`}
						className="mt-3 flex h-11 w-full items-center justify-center rounded-full border border-espresso/25 text-sm font-semibold transition-colors hover:bg-espresso hover:text-bone"
					>
						Ver detalhes
					</Link>
				</div>
			</div>
		</article>
	);
}

export function ProductCardSkeleton() {
	return (
		<div className="overflow-hidden rounded-xl border border-line bg-paper">
			<div className="aspect-4/5 animate-pulse bg-bone-deep" />
			<div className="space-y-3 p-4">
				<div className="h-3 w-16 animate-pulse rounded bg-bone-deep" />
				<div className="h-4 w-32 animate-pulse rounded bg-bone-deep" />
				<div className="h-16 animate-pulse rounded-lg bg-bone-deep" />
				<div className="h-6 w-24 animate-pulse rounded bg-bone-deep" />
			</div>
		</div>
	);
}
