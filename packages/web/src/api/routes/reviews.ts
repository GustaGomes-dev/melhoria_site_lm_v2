import { desc, eq } from "drizzle-orm";
import { z } from "zod";
import { base } from "../__core/app";
import { CATALOG } from "../data/catalog";
import { db } from "../database";
import * as schema from "../database/schema";

const DEMO_BY_SLUG = new Map(CATALOG.map((p) => [p.slug, p]));

export const reviews = {
	/**
	 * Avaliações reais de um produto + o resumo de demonstração do catálogo.
	 * `demo: true` sinaliza que a nota agregada ainda é conteúdo de exemplo —
	 * o front precisa marcar isso visivelmente.
	 */
	byProduct: base.input(z.object({ slug: z.string() })).handler(async ({ input }) => {
		const rows = await db
			.select()
			.from(schema.reviews)
			.where(eq(schema.reviews.productSlug, input.slug))
			.orderBy(desc(schema.reviews.createdAt))
			.limit(30);

		const product = DEMO_BY_SLUG.get(input.slug);
		const realAverage = rows.length ? rows.reduce((s, r) => s + r.rating, 0) / rows.length : null;

		return {
			items: rows,
			realCount: rows.length,
			realAverage: realAverage != null ? Math.round(realAverage * 10) / 10 : null,
			demoRating: product?.demoRating ?? 0,
			demoReviewCount: product?.demoReviewCount ?? 0,
			demoSold: product?.demoSold ?? 0,
		};
	}),

	create: base
		.input(
			z.object({
				productSlug: z.string(),
				authorName: z.string().min(2, "Diga como quer aparecer."),
				rating: z.number().int().min(1).max(5),
				title: z.string().max(80).optional(),
				body: z.string().min(10, "Escreva pelo menos uma frase sobre o perfume."),
				email: z.string().email().optional(),
			}),
		)
		.handler(async ({ input }) => {
			let verified = false;
			if (input.email) {
				const [order] = await db
					.select({ id: schema.orders.id })
					.from(schema.orders)
					.where(eq(schema.orders.email, input.email.toLowerCase()))
					.limit(1);
				verified = Boolean(order);
			}
			const [row] = await db
				.insert(schema.reviews)
				.values({
					productSlug: input.productSlug,
					authorName: input.authorName,
					rating: input.rating,
					title: input.title ?? null,
					body: input.body,
					verified,
				})
				.returning();
			return row;
		}),
};
