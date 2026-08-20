import { useMutation } from "@tanstack/react-query";
import { orpc } from "../lib/api";
import { track } from "../lib/track";

export function useCaptureLead() {
	return useMutation(
		orpc.leads.capture.mutationOptions({
			onSuccess: (_data, input) => track.generateLead(input.source),
		}),
	);
}
