export interface FaqItem {
	question: string;
	answer: string;
	group: "produto" | "entrega" | "pagamento" | "trocas";
}

/** 10 perguntas — as que realmente travam a compra de perfume árabe online. */
export const FAQ: FaqItem[] = [
	{
		group: "produto",
		question: "O perfume é original ou é uma imitação?",
		answer:
			"É original, lacrado, da marca que está no rótulo. Lattafa, Armaf, Afnan, Rasasi e Orientica são marcas árabes reais, com fábrica própria nos Emirados — não são falsificações de grife. Elas criam fragrâncias inspiradas em perfumes de grife, e é isso que o nosso comparativo olfativo mostra: quanto aquele perfume árabe se aproxima do cheiro de um perfume de grife. Você recebe frasco selado, caixa original e nota fiscal.",
	},
	{
		group: "produto",
		question: "O que significa a porcentagem de similaridade?",
		answer:
			"É a nossa avaliação de quanto a fragrância se aproxima da referência de grife, feita comparando os dois lado a lado na pele: abertura, coração, fundo, fixação e projeção. 90% ou mais significa que quem não conhece muito não distingue. Entre 80% e 89% o DNA é o mesmo, com diferença em uma ou duas notas. É uma avaliação sensorial, não análise laboratorial — e 108 dos nossos 212 perfumes ainda não passaram por essa avaliação, por isso aparecem sem porcentagem.",
	},
	{
		group: "produto",
		question: "Quanto tempo o perfume dura na pele?",
		answer:
			"Depende do perfume e da sua pele. Cada página de produto mostra a fixação e a projeção em uma escala de 1 a 5, com a leitura em texto. Perfumes árabes costumam ter concentração alta de óleos, então a média fica entre 6 e 12 horas — bem acima da maioria dos importados de farmácia. Pele oleosa segura mais, pele seca segura menos; borrifar em roupa e cabelo aumenta a duração.",
	},
	{
		group: "produto",
		question: "Como eu escolho sem sentir o cheiro antes?",
		answer:
			"Três caminhos. O quiz olfativo pergunta ocasião, tipo de cheiro e quanta presença você quer, e devolve 6 perfumes com o motivo de cada indicação. O comparativo olfativo mostra qual perfume de grife serve de referência — se você já conhece o de grife, você já sabe o que esperar. E o decant de 5 ml, por uma fração do preço, dá duas semanas de uso para decidir antes de comprar o frasco.",
	},
	{
		group: "produto",
		question: "O que é um decant e vem no frasco original?",
		answer:
			"Decant é o perfume original fracionado do frasco grande para um atomizador de vidro de 5 ml ou 10 ml. É o mesmo líquido, do mesmo lote — o que muda é a embalagem. O decant não vem na caixa da marca: vem em atomizador de vidro etiquetado com nome, lote e data do fracionamento. Se você quer a caixa e o frasco original para exibir ou presentear, escolha a opção de frasco lacrado.",
	},
	{
		group: "entrega",
		question: "Quanto custa e quanto demora o frete?",
		answer:
			"O envio padrão custa R$ 24,90 e é grátis em pedidos acima de R$ 349. O expresso custa R$ 49,90. No checkout, antes de pagar, você vê a data prevista de entrega — não uma faixa de dias soltos. Todo pedido aprovado até 14h é postado no mesmo dia útil, e o código de rastreio chega no e-mail e no WhatsApp.",
	},
	{
		group: "entrega",
		question: "Vocês entregam em todo o Brasil?",
		answer:
			"Sim, em todos os estados, pelos Correios e por transportadora. Endereços em áreas de risco ou de difícil acesso podem exigir retirada em agência, e nesse caso avisamos por WhatsApp antes do envio. Não fazemos entrega internacional.",
	},
	{
		group: "pagamento",
		question: "Quais formas de pagamento vocês aceitam?",
		answer:
			"Pix com 5% de desconto (aprovação na hora), cartão de crédito em até 10x sem juros e boleto bancário. O desconto do Pix já aparece calculado na sacola, e todos os totais na tela vêm com o nome da forma de pagamento ao lado — você nunca vê dois valores diferentes sem saber qual é qual.",
	},
	{
		group: "pagamento",
		question: "Tem cupom de desconto? Como uso?",
		answer:
			"Sim, e o campo de cupom fica na sacola e na etapa de pagamento — se anunciamos um cupom, ele funciona ali. PRIMEIRACOMPRA dá 10% em pedidos acima de R$ 199. QUIZ15 dá 15% acima de R$ 299 e é liberado quando você termina o quiz olfativo. Um cupom por pedido, e ele soma com o desconto do Pix.",
	},
	{
		group: "trocas",
		question: "E se eu não gostar do cheiro?",
		answer:
			"Você tem 30 dias corridos a partir do recebimento para devolver, mesmo com o frasco já aberto e usado — a única condição é sobrar pelo menos 80% do conteúdo. Devolvemos o valor integral, incluindo o frete que você pagou, ou trocamos por outro perfume da loja. O frete da devolução é por nossa conta. Pedidos com decant seguem a mesma regra, com no mínimo metade do conteúdo.",
	},
];
