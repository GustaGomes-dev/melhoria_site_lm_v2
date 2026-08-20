import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

/**
 * Schema da loja LM Importados.
 * O catálogo de produtos NÃO fica no banco — ele é estático em
 * src/api/data/catalog.ts (212 produtos reais extraídos do site).
 * O banco guarda o que é gerado por usuários: avaliações, leads e pedidos.
 */

/** Avaliações de produto enviadas pela loja. */
export const reviews = sqliteTable(
	"reviews",
	{
		id: integer("id").primaryKey({ autoIncrement: true }),
		productSlug: text("product_slug").notNull(),
		authorName: text("author_name").notNull(),
		rating: integer("rating").notNull(),
		title: text("title"),
		body: text("body").notNull(),
		/** 1 = compra verificada (pedido encontrado com o mesmo e-mail). */
		verified: integer("verified", { mode: "boolean" }).notNull().default(false),
		createdAt: integer("created_at", { mode: "timestamp" })
			.notNull()
			.$defaultFn(() => new Date()),
	},
	(t) => [index("reviews_product_slug_idx").on(t.productSlug)],
);

/**
 * Captura de contato: quiz olfativo, recuperação de sacola e newsletter.
 * source diferencia a origem para o time de marketing.
 */
export const leads = sqliteTable(
	"leads",
	{
		id: integer("id").primaryKey({ autoIncrement: true }),
		/** "quiz" | "cart" | "newsletter" | "back_in_stock" */
		source: text("source").notNull(),
		name: text("name"),
		email: text("email"),
		whatsapp: text("whatsapp"),
		/** JSON com respostas do quiz ou snapshot da sacola. */
		payload: text("payload"),
		/** Slugs recomendados/na sacola, separados por vírgula. */
		productSlugs: text("product_slugs"),
		createdAt: integer("created_at", { mode: "timestamp" })
			.notNull()
			.$defaultFn(() => new Date()),
	},
	(t) => [index("leads_source_idx").on(t.source)],
);

/** Pedidos do checkout simulado (sem gateway de pagamento real). */
export const orders = sqliteTable(
	"orders",
	{
		id: integer("id").primaryKey({ autoIncrement: true }),
		/** Código legível mostrado ao cliente, ex. LM-2A7F4K. */
		code: text("code").notNull().unique(),
		customerName: text("customer_name").notNull(),
		email: text("email").notNull(),
		whatsapp: text("whatsapp").notNull(),
		document: text("document").notNull(),
		zip: text("zip").notNull(),
		street: text("street").notNull(),
		number: text("number").notNull(),
		complement: text("complement"),
		district: text("district").notNull(),
		city: text("city").notNull(),
		state: text("state").notNull(),
		/** "pix" | "card" | "boleto" */
		paymentMethod: text("payment_method").notNull(),
		installments: integer("installments").notNull().default(1),
		/** "standard" | "express" */
		shippingMethod: text("shipping_method").notNull(),
		couponCode: text("coupon_code"),
		/** Valores em centavos para evitar erro de ponto flutuante. */
		subtotalCents: integer("subtotal_cents").notNull(),
		discountCents: integer("discount_cents").notNull().default(0),
		shippingCents: integer("shipping_cents").notNull().default(0),
		totalCents: integer("total_cents").notNull(),
		/** Data prometida de entrega, mostrada como data concreta. */
		deliveryEstimate: integer("delivery_estimate", { mode: "timestamp" }).notNull(),
		status: text("status").notNull().default("aguardando_pagamento"),
		createdAt: integer("created_at", { mode: "timestamp" })
			.notNull()
			.$defaultFn(() => new Date()),
	},
	(t) => [index("orders_email_idx").on(t.email)],
);

/** Itens de cada pedido. Guarda snapshot de nome/preço no momento da compra. */
export const orderItems = sqliteTable(
	"order_items",
	{
		id: integer("id").primaryKey({ autoIncrement: true }),
		orderId: integer("order_id")
			.notNull()
			.references(() => orders.id, { onDelete: "cascade" }),
		productSlug: text("product_slug").notNull(),
		productName: text("product_name").notNull(),
		productBrand: text("product_brand").notNull(),
		/** "full" | "decant5" | "decant10" | "kit" */
		variant: text("variant").notNull().default("full"),
		variantLabel: text("variant_label").notNull(),
		image: text("image"),
		unitPriceCents: integer("unit_price_cents").notNull(),
		quantity: integer("quantity").notNull(),
		createdAt: integer("created_at", { mode: "timestamp" })
			.notNull()
			.$defaultFn(() => new Date()),
	},
	(t) => [index("order_items_order_id_idx").on(t.orderId)],
);

/** Cupons aceitos no checkout. Semeados na primeira requisição. */
export const coupons = sqliteTable("coupons", {
	code: text("code").primaryKey(),
	label: text("label").notNull(),
	/** Percentual de desconto (0-100). */
	percentOff: integer("percent_off").notNull(),
	/** Valor mínimo de sacola em centavos para o cupom valer. */
	minSubtotalCents: integer("min_subtotal_cents").notNull().default(0),
	active: integer("active", { mode: "boolean" }).notNull().default(true),
});
