import { z } from "zod";
import { base } from "../__core/app";
import { CATALOG } from "../data/catalog";
import type { Product } from "../data/catalog-types";

/**
 * Quiz olfativo. Nada de aleatório: cada resposta soma pontos em critérios
 * concretos do catálogo (gênero, família, ocasião, fixação, preço), e a
 * resposta explica ao cliente POR QUE aquele perfume apareceu.
 */

export interface QuizOption {
	value: string;
	label: string;
	hint?: string;
}

export interface QuizQuestion {
	id: string;
	title: string;
	subtitle: string;
	multiple: boolean;
	options: QuizOption[];
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
	{
		id: "gender",
		title: "Pra quem é esse perfume?",
		subtitle: "Isso só filtra a vitrine — todo mundo usa o que quiser.",
		multiple: false,
		options: [
			{ value: "Feminino", label: "Pra mim, perfil feminino" },
			{ value: "Masculino", label: "Pra mim, perfil masculino" },
			{ value: "Unissex", label: "Quero unissex" },
			{ value: "any", label: "Tanto faz, quero ver tudo" },
		],
	},
	{
		id: "moment",
		title: "Onde ele vai ser mais usado?",
		subtitle: "Escolha o momento que mais acontece na sua semana.",
		multiple: false,
		options: [
			{ value: "trabalho", label: "Trabalho e dia a dia", hint: "Algo que não incomoda ninguém no elevador" },
			{ value: "noite", label: "Noite e jantares", hint: "Mais denso, mais presente" },
			{ value: "festa", label: "Festa e balada", hint: "Pra ser lembrado" },
			{ value: "any", label: "Quero um que sirva pra tudo" },
		],
	},
	{
		id: "family",
		title: "Qual cheiro te puxa mais?",
		subtitle: "Pode marcar mais de um.",
		multiple: true,
		options: [
			{ value: "Doce", label: "Doce e gourmand", hint: "Baunilha, caramelo, fava tonka" },
			{ value: "Amadeirado", label: "Amadeirado", hint: "Cedro, sândalo, vetiver" },
			{ value: "Cítrico", label: "Fresco e cítrico", hint: "Limão, bergamota, aquático" },
			{ value: "Floral", label: "Floral", hint: "Jasmim, rosa, flor de laranjeira" },
			{ value: "Oriental", label: "Oriental especiado", hint: "Oud, incenso, açafrão" },
			{ value: "Âmbar", label: "Âmbar e resinas", hint: "Quente, envolvente, pele" },
		],
	},
	{
		id: "presence",
		title: "Quanta presença você quer?",
		subtitle: "Presença é o quanto ele se espalha no ambiente.",
		multiple: false,
		options: [
			{ value: "discreto", label: "Discreto", hint: "Só quem chega perto sente" },
			{ value: "equilibrado", label: "Equilibrado", hint: "Notado sem dominar a sala" },
			{ value: "marcante", label: "Marcante", hint: "Quero que perguntem qual é" },
		],
	},
	{
		id: "budget",
		title: "Quanto você quer investir?",
		subtitle: "Preços no Pix. Tem decant de 5 ml se quiser testar antes.",
		multiple: false,
		options: [
			{ value: "low", label: "Até R$ 280" },
			{ value: "mid", label: "R$ 280 a R$ 420" },
			{ value: "high", label: "Acima de R$ 420" },
			{ value: "any", label: "Me mostra o melhor, vejo o preço depois" },
		],
	},
	{
		id: "reference",
		title: "Quer algo parecido com um perfume de grife?",
		subtitle: "104 dos nossos 212 perfumes têm comparativo olfativo avaliado.",
		multiple: false,
		options: [
			{ value: "yes", label: "Sim, quero o comparativo" },
			{ value: "no", label: "Não, quero algo próprio" },
			{ value: "any", label: "Não faz diferença" },
		],
	},
];

const answersSchema = z.object({
	gender: z.string().optional(),
	moment: z.string().optional(),
	family: z.array(z.string()).optional(),
	presence: z.string().optional(),
	budget: z.string().optional(),
	reference: z.string().optional(),
});

type Answers = z.infer<typeof answersSchema>;

const PRESENCE_TARGET: Record<string, number> = { discreto: 2, equilibrado: 3.5, marcante: 5 };
const BUDGET_RANGE: Record<string, [number, number]> = {
	low: [0, 280],
	mid: [280, 420],
	high: [420, 10_000],
};

function scoreProduct(p: Product, a: Answers): { score: number; reasons: string[] } {
	let score = 0;
	const reasons: string[] = [];

	if (a.gender && a.gender !== "any") {
		if (p.gender === a.gender) {
			score += 14;
			reasons.push(`perfil ${p.gender.toLowerCase()}`);
		} else if (p.gender === "Unissex" || a.gender === "Unissex") {
			score += 7;
			reasons.push("unissex, funciona pra você");
		} else {
			score -= 22;
		}
	}

	if (a.moment && a.moment !== "any") {
		if (p.occasions.includes(a.moment as never)) {
			score += 12;
			reasons.push(`indicado pra ${a.moment}`);
		} else {
			score -= 6;
		}
	} else if (p.occasions.length >= 3) {
		score += 8;
		reasons.push("versátil pra qualquer hora");
	}

	if (a.family?.length) {
		if (a.family.includes(p.family)) {
			score += 18;
			reasons.push(`família ${p.family.toLowerCase()}`);
		} else {
			score -= 8;
		}
		const noteHit = [...p.topNotes, ...p.heartNotes, ...p.baseNotes].some((n) =>
			a.family?.some((f) => n.toLowerCase().includes(f.toLowerCase())),
		);
		if (noteHit) score += 4;
	}

	if (a.presence) {
		const target = PRESENCE_TARGET[a.presence] ?? 3.5;
		const gap = Math.abs(((p.projection + p.fixation) / 2) - target);
		score += Math.max(0, 12 - gap * 6);
		if (gap <= 0.6) reasons.push(`projeção ${p.projectionLabel.toLowerCase()}`);
	}

	if (a.budget && a.budget !== "any") {
		const [min, max] = BUDGET_RANGE[a.budget] ?? [0, 10_000];
		if (p.pixPrice >= min && p.pixPrice <= max) {
			score += 10;
			reasons.push("dentro do seu orçamento");
		} else {
			score -= 16;
		}
	}

	if (a.reference === "yes") {
		if (p.similarity != null) {
			score += 10 + (p.similarity - 80) / 2;
			reasons.push(`${p.similarity}% de similaridade com ${p.reference?.name}`);
		} else {
			score -= 20;
		}
	} else if (a.reference === "no" && p.similarity != null) {
		score -= 6;
	}

	// Empate desfeito por vendas e por ser best-seller — dado de demonstração,
	// serve só como critério de desempate.
	score += Math.min(4, p.demoSold / 60);
	if (p.bestSellerRank != null) score += 3;

	return { score, reasons: [...new Set(reasons)].slice(0, 3) };
}

export const quiz = {
	questions: base.handler(() => QUIZ_QUESTIONS),

	recommend: base.input(answersSchema).handler(({ input }) => {
		const ranked = CATALOG.map((p) => ({ p, ...scoreProduct(p, input) }))
			.sort((a, b) => b.score - a.score)
			.slice(0, 6);

		const best = ranked[0];
		return {
			matches: ranked.map((r) => ({
				slug: r.p.slug,
				name: r.p.name,
				brand: r.p.brand,
				family: r.p.family,
				gender: r.p.gender,
				volume: r.p.volume,
				price: r.p.price,
				pixPrice: r.p.pixPrice,
				similarity: r.p.similarity,
				referenceName: r.p.reference?.name ?? null,
				referenceBrand: r.p.reference?.brand ?? null,
				imageBottle: r.p.imageBottle,
				fixation: r.p.fixation,
				fixationLabel: r.p.fixationLabel,
				projection: r.p.projection,
				projectionLabel: r.p.projectionLabel,
				/** Percentual de aderência às respostas — normalizado pelo topo do ranking. */
				matchPercent: best ? Math.max(52, Math.round((r.score / best.score) * 96)) : 0,
				reasons: r.reasons,
			})),
			couponCode: "QUIZ15",
		};
	}),
};
