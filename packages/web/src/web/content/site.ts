/**
 * Dados da loja.
 * Tudo marcado com `placeholder: true` precisa ser trocado pelo dono antes de
 * publicar — na tela esses valores aparecem com fundo e borda tracejada.
 */

export interface PlaceholderValue {
	value: string;
	placeholder: boolean;
}

export const ph = (value: string): PlaceholderValue => ({ value, placeholder: true });
export const real = (value: string): PlaceholderValue => ({ value, placeholder: false });

export const COMPANY = {
	name: real("LM Importados"),
	legalName: ph("LM IMPORTADOS COMERCIO DE COSMETICOS LTDA"),
	cnpj: ph("00.000.000/0001-00"),
	address: ph("Rua Exemplo, 123 — Sala 4, Centro"),
	cityState: ph("São Paulo — SP"),
	zip: ph("00000-000"),
	whatsapp: ph("(11) 90000-0000"),
	whatsappLink: ph("https://wa.me/5511900000000"),
	email: ph("contato@lmimportados.net"),
	instagram: ph("@lmimportados"),
	instagramLink: ph("https://instagram.com/lmimportados"),
	hours: real("Atendimento de segunda a sexta, 9h às 18h"),
};

export const STORE_FACTS = {
	catalogSize: 212,
	withComparison: 104,
	brands: 24,
	freeShippingFrom: "R$ 349",
	pixDiscount: "5%",
	returnDays: 30,
	dispatchHours: 24,
};

export interface TrustItem {
	icon: "seal" | "return" | "truck" | "pix";
	title: string;
	detail: string;
}

export const TRUST_ITEMS: TrustItem[] = [
	{
		icon: "seal",
		title: "Original lacrado com nota fiscal",
		detail: "Importação própria. Nota fiscal eletrônica em todo pedido.",
	},
	{
		icon: "return",
		title: "30 dias para devolver",
		detail: "Não gostou do cheiro? Devolvemos o valor, mesmo com o frasco aberto.",
	},
	{
		icon: "truck",
		title: "Postado em até 24h úteis",
		detail: "Código de rastreio no WhatsApp e no e-mail.",
	},
	{
		icon: "pix",
		title: "5% off no Pix",
		detail: "Ou até 10x sem juros no cartão. Desconto já calculado na sacola.",
	},
];

/** Como funcionam os decants — explicado porque quase ninguém sabe. */
export const DECANT_EXPLAINER = {
	title: "O que é um decant",
	body: "É o perfume original fracionado do frasco grande para um atomizador de vidro de 5 ml ou 10 ml. Mesmo líquido, mesma concentração, mesmo lote. Serve para você usar duas semanas antes de decidir sobre um frasco inteiro.",
	points: [
		"5 ml rende cerca de 50 borrifadas — duas semanas de uso diário.",
		"10 ml rende cerca de 100 borrifadas — um mês de uso diário.",
		"Fracionado no dia do envio, com luva e seringa de vidro.",
		"Etiqueta com nome, lote e data do fracionamento.",
	],
};

export const NAV_LINKS = [
	{ label: "Todos os perfumes", href: "/perfumes-arabes" },
	{ label: "Masculinos", href: "/perfumes-arabes?genero=Masculino" },
	{ label: "Femininos", href: "/perfumes-arabes?genero=Feminino" },
	{ label: "Unissex", href: "/perfumes-arabes?genero=Unissex" },
	{ label: "Decants e kits", href: "/kits-e-amostras" },
	{ label: "Quiz olfativo", href: "/quiz" },
];

export const FOOTER_LINKS = {
	loja: [
		{ label: "Todos os perfumes", href: "/perfumes-arabes" },
		{ label: "Mais vendidos", href: "/perfumes-arabes?ordem=mais-vendidos" },
		{ label: "Com comparativo olfativo", href: "/perfumes-arabes?comparativo=1" },
		{ label: "Decants e kit de amostras", href: "/kits-e-amostras" },
		{ label: "Quiz olfativo", href: "/quiz" },
	],
	ajuda: [
		{ label: "Perguntas frequentes", href: "/faq" },
		{ label: "Prazos e entregas", href: "/prazos-e-entregas" },
		{ label: "Trocas e devoluções", href: "/trocas-e-devolucoes" },
		{ label: "Rastrear meu pedido", href: "/pedido" },
	],
	empresa: [
		{ label: "Sobre a LM Importados", href: "/sobre" },
		{ label: "Política de privacidade", href: "/privacidade" },
		{ label: "Termos de uso", href: "/termos" },
	],
};
