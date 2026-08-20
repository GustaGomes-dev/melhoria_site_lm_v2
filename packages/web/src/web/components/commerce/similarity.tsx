import { ArrowLeftRight } from "lucide-react";
import { cn } from "../../lib/utils";

/**
 * Comparativo olfativo — o ativo único da loja.
 * É o ÚNICO componente autorizado a usar verde-fumo (--color-emerald).
 */

export function SimilarityBadge({
	similarity,
	referenceName,
	referenceBrand,
	className,
}: {
	similarity: number;
	referenceName: string | null;
	referenceBrand: string | null;
	className?: string;
}) {
	return (
		<div
			className={cn(
				"flex items-center gap-2 rounded-full border border-emerald/20 bg-emerald-wash px-2.5 py-1",
				className,
			)}
		>
			<span className="num-display text-[13px] leading-none font-semibold text-emerald">{similarity}%</span>
			<span className="truncate text-[11px] leading-tight font-medium text-emerald/80">
				igual a {referenceName}
				{referenceBrand ? ` · ${referenceBrand}` : ""}
			</span>
		</div>
	);
}

/** Barra compacta usada no card do catálogo. */
export function SimilarityBar({
	similarity,
	referenceName,
	referenceBrand,
}: {
	similarity: number;
	referenceName: string | null;
	referenceBrand: string | null;
}) {
	return (
		<div className="rounded-lg border border-emerald/15 bg-emerald-wash px-3 py-2.5">
			<div className="flex items-baseline gap-1.5">
				<span className="num-display shrink-0 text-lg leading-none font-semibold text-emerald">
					{similarity}%
				</span>
				<span className="truncate text-[11px] leading-tight text-emerald/80">
					igual a <span className="font-semibold text-emerald">{referenceName}</span>
				</span>
			</div>
			<div className="mt-2 h-[5px] overflow-hidden rounded-full bg-emerald/15">
				<div className="h-full rounded-full bg-emerald" style={{ width: `${similarity}%` }} />
			</div>
			<p className="mt-1.5 truncate text-[10px] tracking-[0.08em] text-emerald/60 uppercase">
				comparativo olfativo{referenceBrand ? ` · ${referenceBrand}` : ""}
			</p>
		</div>
	);
}

/** Bloco completo da página de produto: os dois frascos, o % e as facetas. */
export function SimilarityPanel({
	similarity,
	productName,
	productImage,
	reference,
}: {
	similarity: number;
	productName: string;
	productImage: string | null;
	reference: { name: string; brand: string; image: string | null; facets: string[] };
}) {
	return (
		<section
			aria-labelledby="comparativo-olfativo"
			className="overflow-hidden rounded-xl border border-emerald/20 bg-emerald-wash"
		>
			<div className="flex flex-wrap items-center justify-between gap-3 border-b border-emerald/15 px-5 py-4">
				<div>
					<p className="text-[10px] font-semibold tracking-[0.16em] text-emerald/70 uppercase">
						Comparativo olfativo
					</p>
					<h2 id="comparativo-olfativo" className="mt-1 text-lg font-semibold text-emerald">
						{similarity}% parecido com {reference.name}
					</h2>
				</div>
				<div className="num-display text-4xl leading-none font-semibold text-emerald">{similarity}%</div>
			</div>

			<div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 px-5 py-5 sm:gap-4">
				<figure className="text-center">
					<div className="mx-auto flex aspect-square w-full max-w-[124px] items-center justify-center rounded-lg bg-paper/70 p-2">
						{productImage ? (
							<img
								src={productImage}
								alt={productName}
								loading="lazy"
								className="max-h-full max-w-full object-contain"
							/>
						) : null}
					</div>
					<figcaption className="mt-2 text-xs leading-tight font-semibold text-emerald">
						{productName}
						<span className="block font-normal text-emerald/60">o que você leva</span>
					</figcaption>
				</figure>

				<div className="flex flex-col items-center gap-1 text-emerald/60">
					<ArrowLeftRight className="size-5" aria-hidden />
					<span className="text-[10px] tracking-[0.1em] uppercase">vs</span>
				</div>

				<figure className="text-center">
					<div className="mx-auto flex aspect-square w-full max-w-[124px] items-center justify-center rounded-lg bg-paper/70 p-2">
						{reference.image ? (
							<img
								src={reference.image}
								alt={`${reference.name} — ${reference.brand}`}
								loading="lazy"
								className="max-h-full max-w-full object-contain"
							/>
						) : (
							<span className="px-2 text-xs text-emerald/60">{reference.brand}</span>
						)}
					</div>
					<figcaption className="mt-2 text-xs leading-tight font-semibold text-emerald">
						{reference.name}
						<span className="block font-normal text-emerald/60">{reference.brand}</span>
					</figcaption>
				</figure>
			</div>

			<div className="h-[6px] bg-emerald/15">
				<div className="h-full bg-emerald" style={{ width: `${similarity}%` }} />
			</div>

			{reference.facets.length ? (
				<div className="px-5 py-4">
					<p className="text-[10px] font-semibold tracking-[0.14em] text-emerald/70 uppercase">
						O que os dois têm em comum
					</p>
					<ul className="mt-2 flex flex-wrap gap-1.5">
						{reference.facets.map((facet) => (
							<li
								key={facet}
								className="rounded-full border border-emerald/20 bg-paper/60 px-2.5 py-1 text-xs text-emerald"
							>
								{facet}
							</li>
						))}
					</ul>
				</div>
			) : null}

			<p className="border-t border-emerald/15 px-5 py-3 text-xs leading-relaxed text-emerald/70">
				Avaliação sensorial da nossa equipe, feita comparando as duas fragrâncias na pele. Não é análise
				laboratorial e não temos vínculo com a grife citada.
			</p>
		</section>
	);
}
