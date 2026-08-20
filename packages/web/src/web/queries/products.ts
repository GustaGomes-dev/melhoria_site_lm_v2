import { useQuery } from "@tanstack/react-query";
import { orpc } from "../lib/api";

export type ProductFilters = Parameters<typeof orpc.products.list.queryOptions>[0] extends never
	? never
	: NonNullable<Parameters<typeof orpc.products.list.queryOptions>[0]>["input"];

const HOUR = 60 * 60 * 1000;

export function useFacets() {
	return useQuery(orpc.products.facets.queryOptions({ staleTime: HOUR }));
}

export function useProductList(input: ProductFilters) {
	return useQuery(orpc.products.list.queryOptions({ input, staleTime: HOUR }));
}

export function useShowcase() {
	return useQuery(orpc.products.showcase.queryOptions({ staleTime: HOUR }));
}

export function useProduct(slug: string) {
	return useQuery(orpc.products.get.queryOptions({ input: { slug }, staleTime: HOUR }));
}

export function useBrands() {
	return useQuery(orpc.products.brands.queryOptions({ staleTime: HOUR }));
}
