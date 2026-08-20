import { useMutation, useQuery } from "@tanstack/react-query";
import { orpc } from "../lib/api";

export function useQuizQuestions() {
	return useQuery(orpc.quiz.questions.queryOptions({ staleTime: 60 * 60 * 1000 }));
}

export function useQuizRecommend() {
	return useMutation(orpc.quiz.recommend.mutationOptions());
}
