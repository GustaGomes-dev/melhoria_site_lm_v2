import { useMutation, useQuery } from "@tanstack/react-query";
import { orpc } from "../lib/api";
import type { CartLine } from "../lib/cart";

export function useStoreRules() {
	return useQuery(orpc.checkout.rules.queryOptions({ staleTime: 60 * 60 * 1000 }));
}

export interface QuoteInput {
	lines: CartLine[];
	couponCode?: string | null;
	shippingMethod?: "standard" | "express";
	paymentMethod?: "pix" | "card" | "boleto";
}

/**
 * O total NUNCA é calculado no cliente — sempre vem daqui, para que sacola,
 * drawer e checkout mostrem exatamente o mesmo número.
 */
export function useQuote(input: QuoteInput) {
	return useQuery(
		orpc.checkout.quote.queryOptions({
			input: {
				lines: input.lines,
				couponCode: input.couponCode ?? null,
				shippingMethod: input.shippingMethod,
				paymentMethod: input.paymentMethod,
			},
			staleTime: 30_000,
		}),
	);
}

export function usePlaceOrder() {
	return useMutation(orpc.checkout.placeOrder.mutationOptions());
}

export function useOrder(code: string) {
	return useQuery(orpc.checkout.getOrder.queryOptions({ input: { code }, enabled: Boolean(code), retry: false }));
}
