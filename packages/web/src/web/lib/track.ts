/**
 * Camada única de eventos de e-commerce.
 * Já no formato GA4 / Meta Pixel: quando o dono da loja colar o script do
 * GA4 (`window.dataLayer`) ou do Pixel (`window.fbq`), tudo aqui começa a
 * reportar sozinho. Sem script instalado, só loga em dev.
 */

type Currency = "BRL";

export interface TrackItem {
	item_id: string;
	item_name: string;
	item_brand: string;
	item_category: string;
	item_variant?: string;
	price: number;
	quantity: number;
}

interface DataLayerWindow {
	dataLayer?: unknown[];
	fbq?: (...args: unknown[]) => void;
}

const PIXEL_EVENT: Record<string, string> = {
	view_item: "ViewContent",
	add_to_cart: "AddToCart",
	begin_checkout: "InitiateCheckout",
	purchase: "Purchase",
	generate_lead: "Lead",
	search: "Search",
};

function push(event: string, params: Record<string, unknown>) {
	const w = window as unknown as DataLayerWindow;
	w.dataLayer = w.dataLayer ?? [];
	w.dataLayer.push({ event, ...params });
	const pixelEvent = PIXEL_EVENT[event];
	if (pixelEvent && typeof w.fbq === "function") {
		w.fbq("track", pixelEvent, {
			value: params.value,
			currency: params.currency,
			content_ids: Array.isArray(params.items)
				? (params.items as TrackItem[]).map((i) => i.item_id)
				: undefined,
			content_type: "product",
		});
	}
	if (import.meta.env.DEV) console.debug("[track]", event, params);
}

export const track = {
	viewItem(item: TrackItem) {
		push("view_item", { currency: "BRL" satisfies Currency, value: item.price, items: [item] });
	},
	addToCart(item: TrackItem) {
		push("add_to_cart", {
			currency: "BRL" satisfies Currency,
			value: item.price * item.quantity,
			items: [item],
		});
	},
	removeFromCart(item: TrackItem) {
		push("remove_from_cart", { currency: "BRL", value: item.price * item.quantity, items: [item] });
	},
	viewCart(items: TrackItem[], value: number) {
		push("view_cart", { currency: "BRL", value, items });
	},
	beginCheckout(items: TrackItem[], value: number, coupon?: string | null) {
		push("begin_checkout", { currency: "BRL", value, coupon: coupon ?? undefined, items });
	},
	addShippingInfo(value: number, tier: string) {
		push("add_shipping_info", { currency: "BRL", value, shipping_tier: tier });
	},
	addPaymentInfo(value: number, type: string) {
		push("add_payment_info", { currency: "BRL", value, payment_type: type });
	},
	purchase(transactionId: string, items: TrackItem[], value: number, shipping: number) {
		push("purchase", {
			transaction_id: transactionId,
			currency: "BRL",
			value,
			shipping,
			items,
		});
	},
	generateLead(source: string) {
		push("generate_lead", { currency: "BRL", value: 0, lead_source: source });
	},
	search(term: string) {
		push("search", { search_term: term });
	},
	selectPromotion(name: string) {
		push("select_promotion", { promotion_name: name });
	},
};
