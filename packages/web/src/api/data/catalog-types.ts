/** Tipos do catálogo. Compartilhados entre API e front (o front importa via oRPC). */

export type Gender = "Feminino" | "Masculino" | "Unissex";

export type OccasionTag = "dia" | "noite" | "trabalho" | "festa" | "jantar" | "balada";

export interface ProductReference {
	/** Nome do perfume de grife usado como referência olfativa. */
	name: string;
	brand: string;
	image: string | null;
	facets: string[];
}

export interface Product {
	id: string;
	slug: string;
	name: string;
	brand: string;
	volume: string | null;
	gender: string;
	family: string;
	/** Preço no cartão (até 10x sem juros). */
	price: number;
	/** Preço no Pix (5% off). */
	pixPrice: number;
	description: string;
	fixationLabel: string;
	/** Fixação normalizada de 1 a 5, para as barras. */
	fixation: number;
	projectionLabel: string;
	projection: number;
	occasionLabel: string;
	occasions: OccasionTag[];
	topNotes: string[];
	heartNotes: string[];
	baseNotes: string[];
	notes: string[];
	/** % de similaridade com a referência de grife. null = ainda não avaliado. */
	similarity: number | null;
	reference: ProductReference | null;
	bestSellerRank: number | null;
	imageBottle: string | null;
	imageBox: string | null;
	/**
	 * CONTEÚDO DE DEMONSTRAÇÃO — gerado, não é dado real.
	 * Substituir por avaliações e vendas reais antes de publicar.
	 */
	demoRating: number;
	demoReviewCount: number;
	demoSold: number;
}
