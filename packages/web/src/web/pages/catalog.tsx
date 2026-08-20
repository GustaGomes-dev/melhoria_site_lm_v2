import { ChevronLeft, ChevronRight, SlidersHorizontal, X } from "lucide-react";
import { useMemo, useState } from "react";
import { useLocation, useSearch } from "wouter";
import { ProductCard, ProductCardSkeleton } from "../components/commerce/product-card";
import { useSeo } from "../components/site/seo";
import { Eyebrow, LmButton } from "../components/ui/bits";
import { useFacets, useProductList } from "../queries/products";
import { cn } from "../lib/utils";

const SORTS = [
	{ value: "relevancia", label: "Mais relevantes" },
	{ value: "mais-vendidos", label: "Mais vendidos" },
	{ value: "similaridade", label: "Maior similaridade" },
	{ value: "menor-preco", label: "Menor preço" },
	{ value: "maior-preco", label: "Maior preço" },
	{ value: "nome", label: "Nome A–Z" },
] as const;

const PRICE_BANDS = [
	{ id: "ate-250", label: "Até R$ 250", min: 0, max: 250 },
	{ id: "250-350", label: "R$ 250 a R$ 350", min: 250, max: 350 },
	{ id: "350-500", label: "R$ 350 a R$ 500", min: 350, max: 500 },
	{ id: "500-mais", label: "Acima de R$ 500", min: 500, max: 10_000 },
];

function useFilterState() {
	const search = useSearch();
	const [, navigate] = useLocation();
	const params = useMemo(() => new URLSearchParams(search), [search]);

	function update(mutate: (p: URLSearchParams) => void) {
		const next = new URLSearchParams(search);
		mutate(next);
		next.delete("pagina");
		const qs = next.toString();
		navigate(qs ? `/perfumes-arabes?${qs}` : "/perfumes-arabes");
	}

	function toggleMulti(key: string, value: string) {
		update((p) => {
			const current = p.getAll(key);
			p.delete(key);
			const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
			for (const v of next) p.append(key, v);
		});
	}

	return { params, update, toggleMulti, navigate, search };
}

function FilterGroup({
	title,
	options,
	selected,
	onToggle,
	limit,
}: {
	title: string;
	options: { value: string; count: number }[];
	selected: string[];
	onToggle: (value: string) => void;
	limit?: number;
}) {
	const [expanded, setExpanded] = useState(false);
	const visible = limit && !expanded ? options.slice(0, limit) : options;

	return (
		<div className="border-b border-line py-5">
			<p className="eyebrow mb-3">{title}</p>
			<ul className="space-y-1.5">
				{visible.map((option) => {
					const checked = selected.includes(option.value);
					return (
						<li key={option.value}>
							<label className="flex min-h-9 cursor-pointer items-center gap-2.5 text-sm">
								<input
									type="checkbox"
									checked={checked}
									onChange={() => onToggle(option.value)}
									className="size-4 shrink-0 accent-brass-deep"
								/>
								<span className={cn("flex-1", checked && "font-semibold")}>{option.value}</span>
								<span className="text-xs text-espresso-mute">{option.count}</span>
							</label>
						</li>
					);
				})}
			</ul>
			{limit && options.length > limit ? (
				<button
					type="button"
					onClick={() => setExpanded((v) => !v)}
					className="mt-2 text-xs font-semibold text-brass-deep underline underline-offset-4"
				>
					{expanded ? "ver menos" : `ver todas as ${options.length}`}
				</button>
			) : null}
		</div>
	);
}

export default function CatalogPage() {
	const { params, update, toggleMulti, navigate } = useFilterState();
	const facets = useFacets();
	const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

	const genders = params.getAll("genero");
	const families = params.getAll("familia");
	const brands = params.getAll("marca");
	const band = params.get("preco");
	const onlyWithReference = params.get("comparativo") === "1";
	const query = params.get("busca") ?? "";
	const sort = (params.get("ordem") ?? "relevancia") as (typeof SORTS)[number]["value"];
	const page = Number(params.get("pagina") ?? 1);
	const priceBand = PRICE_BANDS.find((b) => b.id === band);

	const list = useProductList({
		q: query || undefined,
		gender: genders.length ? genders : undefined,
		family: families.length ? families : undefined,
		brand: brands.length ? brands : undefined,
		minPrice: priceBand?.min,
		maxPrice: priceBand?.max,
		onlyWithReference: onlyWithReference || undefined,
		sort,
		page,
		perPage: 24,
	});

	const activeCount =
		genders.length + families.length + brands.length + (band ? 1 : 0) + (onlyWithReference ? 1 : 0) + (query ? 1 : 0);

	const title = query
		? `Busca por “${query}”`
		: genders.length === 1
			? `Perfumes árabes ${genders[0].toLowerCase()}s`
			: "Todos os perfumes árabes";

	useSeo({
		title: `${title} — LM Importados`,
		description:
			"Filtre 212 perfumes árabes por gênero, família olfativa, marca e faixa de preço. Veja a % de similaridade com o perfume de grife, fixação e projeção antes de comprar.",
	});

	function goToPage(next: number) {
		const p = new URLSearchParams(params);
		p.set("pagina", String(next));
		navigate(`/perfumes-arabes?${p.toString()}`);
	}

	const filtersPanel = facets.data ? (
		<>
			<div className="border-b border-line py-5">
				<label className="flex min-h-11 cursor-pointer items-start gap-2.5">
					<input
						type="checkbox"
						checked={onlyWithReference}
						onChange={() =>
							update((p) => {
								if (onlyWithReference) p.delete("comparativo");
								else p.set("comparativo", "1");
							})
						}
						className="mt-0.5 size-4 shrink-0 accent-emerald"
					/>
					<span>
						<span className="block text-sm font-semibold">Só com comparativo olfativo</span>
						<span className="block text-xs text-espresso-mute">
							{facets.data.withReference} dos {facets.data.total} perfumes têm a % de similaridade
							avaliada.
						</span>
					</span>
				</label>
			</div>
			<FilterGroup
				title="Gênero"
				options={facets.data.genders}
				selected={genders}
				onToggle={(v) => toggleMulti("genero", v)}
			/>
			<FilterGroup
				title="Família olfativa"
				options={facets.data.families}
				selected={families}
				onToggle={(v) => toggleMulti("familia", v)}
			/>
			<div className="border-b border-line py-5">
				<p className="eyebrow mb-3">Faixa de preço (Pix)</p>
				<ul className="space-y-1.5">
					{PRICE_BANDS.map((option) => (
						<li key={option.id}>
							<label className="flex min-h-9 cursor-pointer items-center gap-2.5 text-sm">
								<input
									type="radio"
									name="preco"
									checked={band === option.id}
									onChange={() => update((p) => p.set("preco", option.id))}
									className="size-4 accent-brass-deep"
								/>
								{option.label}
							</label>
						</li>
					))}
				</ul>
				{band ? (
					<button
						type="button"
						onClick={() => update((p) => p.delete("preco"))}
						className="mt-2 text-xs font-semibold text-brass-deep underline underline-offset-4"
					>
						limpar faixa
					</button>
				) : null}
			</div>
			<FilterGroup
				title="Marca"
				options={facets.data.brands}
				selected={brands}
				onToggle={(v) => toggleMulti("marca", v)}
				limit={8}
			/>
		</>
	) : (
		<div className="space-y-3 py-5">
			{Array.from({ length: 5 }, (_, i) => (
				<div key={i} className="h-4 animate-pulse rounded bg-bone-deep" />
			))}
		</div>
	);

	return (
		<>
			<div className="border-b border-line bg-bone-deep">
				<div className="container-lm py-10">
					<Eyebrow>Catálogo</Eyebrow>
					<h1 className="display-h2 mt-2">{title}</h1>
					<p className="mt-3 max-w-2xl text-espresso-soft">
						{facets.data
							? `${facets.data.total} perfumes de ${facets.data.brands.length} marcas árabes. ${facets.data.withReference} com a porcentagem de similaridade avaliada na pele.`
							: "Carregando catálogo…"}
					</p>
				</div>
			</div>

			<div className="container-lm grid gap-8 py-10 lg:grid-cols-[260px_1fr]">
				<aside className="hidden lg:block">
					<div className="sticky top-24">
						<div className="flex items-center justify-between">
							<h2 className="text-sm font-semibold">Filtros</h2>
							{activeCount > 0 ? (
								<button
									type="button"
									onClick={() => navigate("/perfumes-arabes")}
									className="text-xs font-semibold text-brass-deep underline underline-offset-4"
								>
									limpar ({activeCount})
								</button>
							) : null}
						</div>
						<div className="mt-2 max-h-[calc(100dvh-160px)] overflow-y-auto pr-1">{filtersPanel}</div>
					</div>
				</aside>

				<div>
					<div className="flex flex-wrap items-center justify-between gap-3">
						<p className="text-sm text-espresso-soft">
							{list.isLoading ? (
								"Carregando…"
							) : (
								<>
									<span className="font-semibold text-espresso">{list.data?.total ?? 0}</span>{" "}
									{list.data?.total === 1 ? "perfume" : "perfumes"}
									{query ? (
										<>
											{" "}
											para “{query}”{" "}
											<button
												type="button"
												onClick={() => update((p) => p.delete("busca"))}
												className="ml-1 inline-flex items-center gap-1 text-xs text-brass-deep underline underline-offset-4"
											>
												limpar busca
											</button>
										</>
									) : null}
								</>
							)}
						</p>
						<div className="flex items-center gap-2">
							<button
								type="button"
								onClick={() => setMobileFiltersOpen(true)}
								className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line bg-paper px-4 text-sm font-semibold lg:hidden"
							>
								<SlidersHorizontal className="size-4" aria-hidden />
								Filtros{activeCount ? ` (${activeCount})` : ""}
							</button>
							<label htmlFor="ordem" className="sr-only">
								Ordenar por
							</label>
							<select
								id="ordem"
								value={sort}
								onChange={(e) => update((p) => p.set("ordem", e.target.value))}
								className="h-11 rounded-full border border-line bg-paper px-4 text-sm font-medium"
							>
								{SORTS.map((option) => (
									<option key={option.value} value={option.value}>
										{option.label}
									</option>
								))}
							</select>
						</div>
					</div>

					{activeCount > 0 ? (
						<ul className="mt-4 flex flex-wrap gap-2">
							{[
								...genders.map((v) => ({ key: "genero", value: v })),
								...families.map((v) => ({ key: "familia", value: v })),
								...brands.map((v) => ({ key: "marca", value: v })),
							].map((chip) => (
								<li key={`${chip.key}-${chip.value}`}>
									<button
										type="button"
										onClick={() => toggleMulti(chip.key, chip.value)}
										className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-line bg-paper px-3 text-xs font-medium"
									>
										{chip.value}
										<X className="size-3" aria-hidden />
									</button>
								</li>
							))}
							{onlyWithReference ? (
								<li>
									<button
										type="button"
										onClick={() => update((p) => p.delete("comparativo"))}
										className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-emerald/25 bg-emerald-wash px-3 text-xs font-medium text-emerald"
									>
										com comparativo
										<X className="size-3" aria-hidden />
									</button>
								</li>
							) : null}
							{priceBand ? (
								<li>
									<button
										type="button"
										onClick={() => update((p) => p.delete("preco"))}
										className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-line bg-paper px-3 text-xs font-medium"
									>
										{priceBand.label}
										<X className="size-3" aria-hidden />
									</button>
								</li>
							) : null}
						</ul>
					) : null}

					{list.isLoading ? (
						<div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
							{Array.from({ length: 8 }, (_, i) => (
								<ProductCardSkeleton key={i} />
							))}
						</div>
					) : list.data && list.data.items.length > 0 ? (
						<>
							<div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
								{list.data.items.map((product, i) => (
									<ProductCard key={product.slug} product={product} priority={i < 4} />
								))}
							</div>

							{list.data.totalPages > 1 ? (
								<nav
									aria-label="Paginação"
									className="mt-10 flex items-center justify-center gap-2"
								>
									<button
										type="button"
										disabled={page <= 1}
										onClick={() => goToPage(page - 1)}
										aria-label="Página anterior"
										className="flex size-11 items-center justify-center rounded-full border border-line bg-paper disabled:opacity-40"
									>
										<ChevronLeft className="size-4" />
									</button>
									{Array.from({ length: list.data.totalPages }, (_, i) => i + 1)
										.filter(
											(n) =>
												n === 1 ||
												n === list.data.totalPages ||
												Math.abs(n - page) <= 1,
										)
										.map((n, idx, arr) => (
											<span key={n} className="flex items-center gap-2">
												{idx > 0 && n - arr[idx - 1] > 1 ? (
													<span className="text-espresso-mute">…</span>
												) : null}
												<button
													type="button"
													onClick={() => goToPage(n)}
													aria-current={n === page ? "page" : undefined}
													className={cn(
														"flex size-11 items-center justify-center rounded-full border text-sm font-semibold",
														n === page
															? "border-espresso bg-espresso text-bone"
															: "border-line bg-paper",
													)}
												>
													{n}
												</button>
											</span>
										))}
									<button
										type="button"
										disabled={page >= list.data.totalPages}
										onClick={() => goToPage(page + 1)}
										aria-label="Próxima página"
										className="flex size-11 items-center justify-center rounded-full border border-line bg-paper disabled:opacity-40"
									>
										<ChevronRight className="size-4" />
									</button>
								</nav>
							) : null}
						</>
					) : (
						<div className="mt-10 rounded-xl border border-line bg-paper p-10 text-center">
							<h2 className="text-lg font-semibold">Nenhum perfume com esses filtros</h2>
							<p className="mx-auto mt-2 max-w-md text-sm text-espresso-soft">
								Tente remover um filtro, ou faça o quiz olfativo para receber indicações a partir do
								que você quer sentir.
							</p>
							<div className="mt-5 flex flex-wrap justify-center gap-3">
								<LmButton variant="dark" onClick={() => navigate("/perfumes-arabes")}>
									Limpar filtros
								</LmButton>
								<LmButton variant="outline" onClick={() => navigate("/quiz")}>
									Fazer o quiz olfativo
								</LmButton>
							</div>
						</div>
					)}
				</div>
			</div>

			{mobileFiltersOpen ? (
				<div className="fixed inset-0 z-50 flex lg:hidden">
					<button
						type="button"
						aria-label="Fechar filtros"
						onClick={() => setMobileFiltersOpen(false)}
						className="flex-1 bg-espresso/40"
					/>
					<div className="flex w-[86%] max-w-[360px] flex-col bg-bone">
						<div className="flex items-center justify-between border-b border-line px-5 py-4">
							<h2 className="text-base font-semibold">Filtros</h2>
							<button
								type="button"
								onClick={() => setMobileFiltersOpen(false)}
								aria-label="Fechar"
								className="flex size-11 items-center justify-center rounded-full"
							>
								<X className="size-5" />
							</button>
						</div>
						<div className="flex-1 overflow-y-auto px-5">{filtersPanel}</div>
						<div className="flex gap-2 border-t border-line px-5 py-4">
							<LmButton
								variant="outline"
								className="flex-1"
								onClick={() => {
									navigate("/perfumes-arabes");
									setMobileFiltersOpen(false);
								}}
							>
								Limpar
							</LmButton>
							<LmButton variant="dark" className="flex-1" onClick={() => setMobileFiltersOpen(false)}>
								Ver {list.data?.total ?? 0} perfumes
							</LmButton>
						</div>
					</div>
				</div>
			) : null}
		</>
	);
}
