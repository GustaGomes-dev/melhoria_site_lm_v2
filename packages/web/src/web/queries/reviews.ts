import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { orpc } from "../lib/api";

export function useProductReviews(slug: string) {
	return useQuery(orpc.reviews.byProduct.queryOptions({ input: { slug }, staleTime: 30_000 }));
}

export function useCreateReview() {
	const queryClient = useQueryClient();
	return useMutation(
		orpc.reviews.create.mutationOptions({
			onSuccess: () => queryClient.invalidateQueries({ queryKey: orpc.reviews.key() }),
		}),
	);
}
