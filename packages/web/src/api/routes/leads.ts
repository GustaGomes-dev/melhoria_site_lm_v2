import { z } from "zod";
import { base } from "../__core/app";
import { db } from "../database";
import * as schema from "../database/schema";

/**
 * Captura de contato. Uma rota só, com `source`, para quiz olfativo,
 * recuperação de sacola abandonada e newsletter do rodapé.
 */
export const leads = {
	capture: base
		.input(
			z.object({
				source: z.enum(["quiz", "cart", "newsletter", "back_in_stock"]),
				name: z.string().max(120).optional(),
				email: z.string().email("Confira o e-mail digitado.").optional(),
				whatsapp: z.string().max(30).optional(),
				/** Respostas do quiz ou snapshot da sacola. */
				payload: z.record(z.string(), z.unknown()).optional(),
				productSlugs: z.array(z.string()).optional(),
			}),
		)
		.handler(async ({ input }) => {
			if (!input.email && !input.whatsapp) {
				return { ok: false as const, message: "Informe e-mail ou WhatsApp para receber." };
			}
			await db.insert(schema.leads).values({
				source: input.source,
				name: input.name ?? null,
				email: input.email?.toLowerCase() ?? null,
				whatsapp: input.whatsapp ?? null,
				payload: input.payload ? JSON.stringify(input.payload) : null,
				productSlugs: input.productSlugs?.join(",") ?? null,
			});
			return {
				ok: true as const,
				message:
					input.source === "quiz"
						? "Enviamos seu resultado. O cupom QUIZ15 já está liberado no checkout."
						: "Pronto, guardamos seu contato.",
			};
		}),
};
