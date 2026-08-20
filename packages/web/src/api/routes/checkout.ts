import { ORPCError } from "@orpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { base } from "../__core/app";
import { CATALOG } from "../data/catalog";
import {
	addBusinessDays,
	COUPONS,
	FREE_SHIPPING_THRESHOLD_CENTS,
	MAX_INSTALLMENTS,
	PIX_DISCOUNT_PERCENT,
	quote,
	SHIPPING_METHODS,
	VARIANTS,
	variantPriceCents,
	type CartVariant,
} from "../data/commerce";
import { db } from "../database";
import * as schema from "../database/schema";

const BY_SLUG = new Map(CATALOG.map((p) => [p.slug, p]));

const lineSchema = z.object({
	slug: z.string(),
	variant: z.enum(["full", "decant5", "decant10"]),
	quantity: z.number().int().min(1).max(20),
});

const cartSchema = z.object({
	lines: z.array(lineSchema),
	couponCode: z.string().nullish(),
	shippingMethod: z.enum(["standard", "express"]).optional(),
	paymentMethod: z.enum(["pix", "card", "boleto"]).optional(),
});

const addressShape = {
	customerName: z.string().min(3, "Escreva seu nome completo."),
	email: z.string().email("E-mail inválido."),
	whatsapp: z.string().min(10, "Informe o WhatsApp com DDD."),
	document: z.string().min(11, "CPF inválido."),
	zip: z.string().min(8, "CEP inválido."),
	street: z.string().min(3, "Informe a rua."),
	number: z.string().min(1, "Informe o número."),
	complement: z.string().optional(),
	district: z.string().min(2, "Informe o bairro."),
	city: z.string().min(2, "Informe a cidade."),
	state: z.string().length(2, "Use a sigla do estado."),
	installments: z.number().int().min(1).max(MAX_INSTALLMENTS).optional(),
};

interface ResolvedLine {
	slug: string;
	name: string;
	brand: string;
	variant: CartVariant;
	variantLabel: string;
	image: string | null;
	unitPriceCents: number;
	quantity: number;
	lineTotalCents: number;
	volume: string | null;
}

function resolveLines(lines: z.infer<typeof lineSchema>[]): ResolvedLine[] {
	const out: ResolvedLine[] = [];
	for (const line of lines) {
		const product = BY_SLUG.get(line.slug);
		if (!product) continue;
		const spec = VARIANTS.find((v) => v.id === line.variant) ?? VARIANTS[0];
		const unitPriceCents = variantPriceCents(product.price, line.variant);
		out.push({
			slug: product.slug,
			name: product.name,
			brand: product.brand,
			variant: line.variant,
			variantLabel:
				spec.id === "full" ? `${spec.label}${product.volume ? ` ${product.volume}` : ""}` : spec.label,
			image: product.imageBottle,
			unitPriceCents,
			quantity: line.quantity,
			lineTotalCents: unitPriceCents * line.quantity,
			volume: product.volume,
		});
	}
	return out;
}

function shippingMethod(id?: "standard" | "express") {
	return SHIPPING_METHODS.find((m) => m.id === (id ?? "standard")) ?? SHIPPING_METHODS[0];
}

function orderCode(): string {
	const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
	let out = "";
	for (let i = 0; i < 6; i++) out += chars[Math.floor(Math.random() * chars.length)];
	return `LM-${out}`;
}

export const checkout = {
	/**
	 * Regras públicas da loja. O front lê daqui para nunca anunciar um cupom,
	 * um prazo ou um desconto que o servidor não aplica de verdade.
	 */
	rules: base.handler(() => ({
		freeShippingThresholdCents: FREE_SHIPPING_THRESHOLD_CENTS,
		pixDiscountPercent: PIX_DISCOUNT_PERCENT,
		maxInstallments: MAX_INSTALLMENTS,
		shippingMethods: SHIPPING_METHODS.map((m) => ({
			...m,
			estimatedDate: addBusinessDays(new Date(), m.businessDays + 1).toISOString(),
		})),
		coupons: COUPONS.map((c) => ({ code: c.code, label: c.label, minSubtotalCents: c.minSubtotalCents })),
		variants: VARIANTS,
	})),

	/** Recalcula a sacola no servidor — fonte única dos totais mostrados na tela. */
	quote: base.input(cartSchema).handler(({ input }) => {
		const lines = resolveLines(input.lines);
		const subtotalCents = lines.reduce((sum, l) => sum + l.lineTotalCents, 0);
		const result = quote({
			subtotalCents,
			couponCode: input.couponCode ?? null,
			shippingMethod: input.shippingMethod,
			paymentMethod: input.paymentMethod,
		});
		const method = shippingMethod(input.shippingMethod);
		return {
			lines,
			itemCount: lines.reduce((sum, l) => sum + l.quantity, 0),
			...result,
			deliveryEstimate: addBusinessDays(new Date(), method.businessDays + 1).toISOString(),
			shippingLabel: method.label,
		};
	}),

	placeOrder: base.input(cartSchema.extend(addressShape)).handler(async ({ input }) => {
		const lines = resolveLines(input.lines);
		if (!lines.length) throw new ORPCError("BAD_REQUEST", { message: "Sua sacola está vazia." });

		const subtotalCents = lines.reduce((sum, l) => sum + l.lineTotalCents, 0);
		const paymentMethod = input.paymentMethod ?? "pix";
		const result = quote({
			subtotalCents,
			couponCode: input.couponCode ?? null,
			shippingMethod: input.shippingMethod,
			paymentMethod,
		});
		const method = shippingMethod(input.shippingMethod);
		const deliveryEstimate = addBusinessDays(new Date(), method.businessDays + 1);

		const [order] = await db
			.insert(schema.orders)
			.values({
				code: orderCode(),
				customerName: input.customerName,
				email: input.email.toLowerCase(),
				whatsapp: input.whatsapp,
				document: input.document,
				zip: input.zip,
				street: input.street,
				number: input.number,
				complement: input.complement ?? null,
				district: input.district,
				city: input.city,
				state: input.state.toUpperCase(),
				paymentMethod,
				installments: paymentMethod === "card" ? (input.installments ?? result.installments.count) : 1,
				shippingMethod: method.id,
				couponCode: result.coupon?.code ?? null,
				subtotalCents: result.subtotalCents,
				discountCents: result.discountCents,
				shippingCents: result.shippingCents,
				totalCents: result.totalCents,
				deliveryEstimate,
				status: paymentMethod === "pix" ? "aguardando_pix" : "aguardando_pagamento",
			})
			.returning();

		await db.insert(schema.orderItems).values(
			lines.map((l) => ({
				orderId: order.id,
				productSlug: l.slug,
				productName: l.name,
				productBrand: l.brand,
				variant: l.variant,
				variantLabel: l.variantLabel,
				image: l.image,
				unitPriceCents: l.unitPriceCents,
				quantity: l.quantity,
			})),
		);

		return { code: order.code };
	}),

	getOrder: base.input(z.object({ code: z.string() })).handler(async ({ input }) => {
		const [order] = await db.select().from(schema.orders).where(eq(schema.orders.code, input.code.toUpperCase()));
		if (!order) throw new ORPCError("NOT_FOUND", { message: "Pedido não encontrado." });
		const items = await db.select().from(schema.orderItems).where(eq(schema.orderItems.orderId, order.id));
		return { order, items };
	}),
};
