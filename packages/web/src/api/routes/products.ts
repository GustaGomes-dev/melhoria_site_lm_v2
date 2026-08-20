import { z } from "zod";
import { CATALOG } from "../data/catalog";
import type { Product } from "../data/catalog-types";
import { base } from "../__core/app";
import { toCents, VARIANTS, variantPriceCents, pixPriceCents } from "../data/commerce";

/** Card enxuto: só o que a vitrine precisa, para não trafegar 212 descrições. */
export interface ProductCard {
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
	/** Até 3 notas para o card sem comparativo. */
	highlightNotes: string[];
	imageBottle: string | null;
	bestSellerRank: number | null;
	/** Preço no Pix dos decants, em centavos — mesma regra do checkout. */
	decant5PixCents: number;
	decant10PixCents: number;
	demoRating: number;
	demoReviewCount: number;
	demoSold: number;
}

function highlightNotes(p: Product): string[] {
	const pool = [...p.topNotes, ...p.heartNotes, ...p.baseNotes, ...p.notes];
	return [...new Set(pool)].slice(0, 3);
}

function toCard(p: Product): ProductCard {
	return {
		slug: p.slug,
		name: p.name,
		brand: p.brand,
		volume: p.volume,
		gender: p.gender,
		family: p.family,
		price: p.price,
		pixPrice: p.pixPrice,
		fixation: p.fixation,
		fixationLabel: p.fixationLabel,
		projection: p.projection,
		projectionLabel: p.projectionLabel,
		occasionLabel: p.occasionLabel,
		similarity: p.similarity,
		referenceName: p.reference?.name ?? null,
		referenceBrand: p.reference?.brand ?? null,
		highlightNotes: highlightNotes(p),
		imageBottle: p.imageBottle,
		bestSellerRank: p.bestSellerRank,
		decant5PixCents: pixPriceCents(variantPriceCents(p.price, "decant5")),
		decant10PixCents: pixPriceCents(variantPriceCents(p.price, "decant10")),
		demoRating: p.demoRating,
		demoReviewCount: p.demoReviewCount,
		demoSold: p.demoSold,
	};
}

const BY_SLUG = new Map(CATALOG.map((p) => [p.slug, p]));

function normalize(text: string): string {
	return text
		.toLowerCase()
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "");
}

const SEARCH_INDEX = new Map(
	CATALOG.map((p) => [
		p.slug,
		normalize(
			[p.name, p.brand, p.family, p.gender, p.reference?.name ?? "", p.reference?.brand ?? "", ...highlightNotes(p)].join(
				" ",
			),
		),
	]),
);

const sortSchema = z.enum(["relevancia", "mais-vendidos", "menor-preco", "maior-preco", "similaridade", "nome"]);

const filterSchema = z.object({
	q: z.string().optional(),
	gender: z.array(z.string()).optional(),
	family: z.array(z.string()).optional(),
	brand: z.array(z.string()).optional(),
	occasion: z.array(z.string()).optional(),
	minPrice: z.number().optional(),
	maxPrice: z.number().optional(),
	/** Só produtos com comparativo olfativo de grife avaliado. */
	onlyWithReference: z.boolean().optional(),
	minFixation: z.number().optional(),
	sort: sortSchema.optional(),
	page: z.number().int().min(1).optional(),
	perPage: z.number().int().min(1).max(48).optional(),
});

function applyFilters(input: z.infer<typeof filterSchema>): Product[] {
	const q = input.q?.trim() ? normalize(input.q.trim()) : null;
	const terms = q ? q.split(/\s+/).filter(Boolean) : [];

	return CATALOG.filter((p) => {
		if (input.gender?.length && !input.gender.includes(p.gender)) return false;
		if (input.family?.length && !input.family.includes(p.family)) return false;
		if (input.brand?.length && !input.brand.includes(p.brand)) return false;
		if (input.occasion?.length && !input.occasion.some((o) => p.occasions.includes(o as never))) return false;
		if (input.minPrice != null && p.pixPrice < input.minPrice) return false;
		if (input.maxPrice != null && p.pixPrice > input.maxPrice) return false;
		if (input.onlyWithReference && p.similarity == null) return false;
		if (input.minFixation != null && p.fixation < input.minFixation) return false;
		if (terms.length) {
			const hay = SEARCH_INDEX.get(p.slug) ?? "";
			if (!terms.every((t) => hay.includes(t))) return false;
		}
		return true;
	});
}

function sortProducts(list: Product[], sort: z.infer<typeof sortSchema>): Product[] {
	const out = [...list];
	switch (sort) {
		case "mais-vendidos":
			return out.sort(
				(a, b) => (a.bestSellerRank ?? 999) - (b.bestSellerRank ?? 999) || b.demoSold - a.demoSold,
			);
		case "menor-preco":
			return out.sort((a, b) => a.pixPrice - b.pixPrice);
		case "maior-preco":
			return out.sort((a, b) => b.pixPrice - a.pixPrice);
		case "similaridade":
			return out.sort((a, b) => (b.similarity ?? -1) - (a.similarity ?? -1));
		case "nome":
			return out.sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
		default:
			// Relevância: best-sellers primeiro, depois quem tem comparativo, depois vendas.
			return out.sort(
				(a, b) =>
					(a.bestSellerRank ?? 999) - (b.bestSellerRank ?? 999) ||
					(b.similarity ?? 0) - (a.similarity ?? 0) ||
					b.demoSold - a.demoSold,
			);
	}
}

function counter(values: string[]): { value: string; count: number }[] {
	const map = new Map<string, number>();
	for (const v of values) map.set(v, (map.get(v) ?? 0) + 1);
	return [...map.entries()]
		.map(([value, count]) => ({ value, count }))
		.sort((a, b) => b.count - a.count || a.value.localeCompare(b.value, "pt-BR"));
}

const FACETS = {
	genders: counter(CATALOG.map((p) => p.gender)),
	families: counter(CATALOG.map((p) => p.family)),
	brands: counter(CATALOG.map((p) => p.brand)),
	occasions: counter(CATALOG.flatMap((p) => p.occasions)),
	priceMin: Math.floor(Math.min(...CATALOG.map((p) => p.pixPrice))),
	priceMax: Math.ceil(Math.max(...CATALOG.map((p) => p.pixPrice))),
	total: CATALOG.length,
	withReference: CATALOG.filter((p) => p.similarity != null).length,
};

export const products = {
	/** Facetas para montar os filtros — contagens reais do catálogo. */
	facets: base.handler(() => FACETS),

	list: base.input(filterSchema).handler(({ input }) => {
		const filtered = applyFilters(input);
		const sorted = sortProducts(filtered, input.sort ?? "relevancia");
		const perPage = input.perPage ?? 24;
		const page = input.page ?? 1;
		const start = (page - 1) * perPage;
		return {
			items: sorted.slice(start, start + perPage).map(toCard),
			total: sorted.length,
			page,
			perPage,
			totalPages: Math.max(1, Math.ceil(sorted.length / perPage)),
		};
	}),

	/** Vitrines da home: mais vendidos, novidades e maiores similaridades. */
	showcase: base.handler(() => {
		// Os 3 ranqueados primeiro; o resto da vitrine completa por vendas.
		const ranked = CATALOG.filter((p) => p.bestSellerRank != null).sort(
			(a, b) => (a.bestSellerRank ?? 0) - (b.bestSellerRank ?? 0),
		);
		const filler = CATALOG.filter((p) => p.bestSellerRank == null && p.similarity != null).sort(
			(a, b) => b.demoSold - a.demoSold,
		);
		const bestSellers = [...ranked, ...filler].slice(0, 8).map(toCard);
		const closestMatches = CATALOG.filter((p) => (p.similarity ?? 0) >= 90)
			.sort((a, b) => (b.similarity ?? 0) - (a.similarity ?? 0) || b.demoSold - a.demoSold)
			.slice(0, 8)
			.map(toCard);
		const under = CATALOG.filter((p) => p.pixPrice <= 300)
			.sort((a, b) => b.demoSold - a.demoSold)
			.slice(0, 8)
			.map(toCard);
		const feminine = CATALOG.filter((p) => p.gender === "Feminino")
			.sort((a, b) => b.demoSold - a.demoSold)
			.slice(0, 8)
			.map(toCard);
		return { bestSellers, closestMatches, under, feminine };
	}),

	get: base.input(z.object({ slug: z.string() })).handler(({ input }) => {
		const product = BY_SLUG.get(input.slug);
		if (!product) return null;

		const variants = VARIANTS.map((v) => {
			const cardCents = variantPriceCents(product.price, v.id);
			return {
				id: v.id,
				label: v.id === "full" ? `${v.label}${product.volume ? ` ${product.volume}` : ""}` : v.label,
				description: v.description,
				priceCents: cardCents,
				pixPriceCents: pixPriceCents(cardCents),
			};
		});

		// Relacionados: mesma referência de grife > mesma família e gênero.
		const related = CATALOG.filter((p) => p.slug !== product.slug)
			.map((p) => {
				let score = 0;
				if (product.reference && p.reference?.name === product.reference.name) score += 10;
				if (p.family === product.family) score += 4;
				if (p.gender === product.gender) score += 2;
				if (p.brand === product.brand) score += 1;
				if (Math.abs(p.pixPrice - product.pixPrice) < 60) score += 1;
				return { p, score };
			})
			.filter((x) => x.score > 0)
			.sort((a, b) => b.score - a.score || b.p.demoSold - a.p.demoSold)
			.slice(0, 4)
			.map((x) => toCard(x.p));

		return {
			product,
			priceCents: toCents(product.price),
			pixPriceCents: toCents(product.pixPrice),
			variants,
			related,
		};
	}),

	/** Todos os slugs — usado no sitemap e nos links de rodapé por marca. */
	brands: base.handler(() =>
		FACETS.brands.map((b) => ({
			brand: b.value,
			count: b.count,
			topSlug:
				CATALOG.filter((p) => p.brand === b.value).sort((a, b2) => b2.demoSold - a.demoSold)[0]?.slug ?? null,
		})),
	),
};
