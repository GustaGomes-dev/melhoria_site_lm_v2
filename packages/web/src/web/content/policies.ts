/**
 * Páginas de política. Estrutura de documento simples (título + blocos) para
 * uma página só renderizar todas. Onde há `placeholder: true`, o dono da loja
 * precisa completar com os dados reais da empresa.
 */

export interface PolicyBlock {
	heading?: string;
	paragraphs?: string[];
	list?: string[];
	/** Marca o bloco como pendente de revisão jurídica/dados reais. */
	placeholder?: boolean;
}

export interface PolicyDoc {
	slug: string;
	title: string;
	intro: string;
	updatedAt: string;
	blocks: PolicyBlock[];
}

const UPDATED = "20 de agosto de 2026";

export const POLICIES: PolicyDoc[] = [
	{
		slug: "trocas-e-devolucoes",
		title: "Trocas e devoluções",
		intro:
			"Perfume é compra sensorial: ninguém sabe se vai gostar antes de usar na pele. Por isso nossa política vai além do que a lei exige — você pode devolver mesmo com o frasco aberto.",
		updatedAt: UPDATED,
		blocks: [
			{
				heading: "Prazo",
				paragraphs: [
					"Você tem 7 dias corridos de arrependimento garantidos pelo Código de Defesa do Consumidor (art. 49) e, além disso, damos 30 dias corridos contados da data de recebimento para devolver por qualquer motivo — inclusive por não ter gostado do cheiro.",
				],
			},
			{
				heading: "Condições",
				list: [
					"Frasco lacrado ou aberto, desde que reste pelo menos 80% do conteúdo.",
					"Decants de 5 ml e 10 ml: pelo menos 50% do conteúdo.",
					"Caixa e frasco preservados, sem quebra ou dano por mau uso.",
					"Kits de amostra podem ser devolvidos com no máximo dois frascos abertos.",
				],
			},
			{
				heading: "Como solicitar",
				list: [
					"Chame no WhatsApp ou responda o e-mail de confirmação do pedido com o número do pedido.",
					"Você recebe um código de postagem reversa em até 1 dia útil — o frete da devolução é por nossa conta.",
					"Poste na agência dos Correios sem pagar nada.",
					"Assim que o produto chega e é conferido (até 3 dias úteis), fazemos o estorno.",
				],
			},
			{
				heading: "Prazo do estorno",
				paragraphs: [
					"Pix: devolução em até 3 dias úteis na mesma chave ou em conta indicada por você. Cartão de crédito: o estorno é solicitado à operadora em até 3 dias úteis e aparece na fatura seguinte ou na subsequente, conforme o banco. Boleto: devolução por Pix em até 3 dias úteis, na conta do titular do pedido.",
				],
			},
			{
				heading: "Produto com defeito ou avaria no transporte",
				paragraphs: [
					"Vazamento, frasco trincado, válvula que não borrifa ou produto trocado: envie foto pelo WhatsApp no mesmo dia do recebimento. Reenviamos o produto correto imediatamente, sem custo, e sem esperar a devolução do primeiro.",
				],
			},
			{
				heading: "O que não aceitamos",
				list: [
					"Produto com menos de 80% do conteúdo (50% em decants).",
					"Frasco quebrado por queda ou uso indevido.",
					"Pedido recebido há mais de 30 dias.",
				],
			},
		],
	},
	{
		slug: "prazos-e-entregas",
		title: "Prazos e entregas",
		intro:
			"Aqui está exatamente o que acontece entre o seu pagamento e o perfume chegando na sua porta — com prazos que informamos como data, não como faixa vaga de dias.",
		updatedAt: UPDATED,
		blocks: [
			{
				heading: "Preparo e postagem",
				paragraphs: [
					"Pedidos com pagamento aprovado até 14h (horário de Brasília) em dia útil são postados no mesmo dia. Aprovados após 14h, ou em fim de semana e feriado, são postados no próximo dia útil. Pix aprova na hora; cartão em minutos; boleto leva de 1 a 2 dias úteis para compensar.",
				],
			},
			{
				heading: "Modalidades e valores",
				list: [
					"Envio padrão — R$ 24,90, cerca de 6 dias úteis após a postagem. Grátis em pedidos acima de R$ 349.",
					"Envio expresso — R$ 49,90, cerca de 2 dias úteis após a postagem.",
					"No checkout você vê a data prevista de entrega antes de finalizar, calculada em dias úteis.",
				],
			},
			{
				heading: "Rastreio",
				paragraphs: [
					"O código de rastreio é enviado por e-mail e por WhatsApp assim que o pedido é postado. Ele pode levar até 24h para começar a mostrar movimentação no site dos Correios — isso é normal e não indica problema.",
				],
			},
			{
				heading: "Embalagem",
				paragraphs: [
					"Todo perfume vai com plástico-bolha em volta do frasco, dentro de caixa rígida e com lacre de segurança. A embalagem externa é neutra: não há indicação do conteúdo, do valor ou da loja pelo lado de fora.",
				],
			},
			{
				heading: "Se a entrega falhar",
				list: [
					"Ausência no endereço: os Correios tentam mais duas vezes antes de encaminhar para a agência mais próxima.",
					"Objeto devolvido ao remetente: reenviamos sem custo depois de confirmar o endereço com você.",
					"Extravio: abrimos a reclamação e, se não houver localização em até 10 dias úteis, reenviamos ou devolvemos o valor — sua escolha.",
				],
			},
			{
				heading: "Áreas com restrição",
				paragraphs: [
					"Alguns CEPs de área de risco ou de difícil acesso não recebem entrega domiciliar. Nesses casos avisamos por WhatsApp antes de postar, e você escolhe entre retirar na agência ou informar outro endereço.",
				],
			},
		],
	},
	{
		slug: "privacidade",
		title: "Política de privacidade",
		intro:
			"Explicamos quais dados coletamos, por que, com quem compartilhamos e como você exerce seus direitos sob a LGPD (Lei 13.709/2018).",
		updatedAt: UPDATED,
		blocks: [
			{
				heading: "Quem é o controlador dos dados",
				placeholder: true,
				paragraphs: [
					"O controlador é a empresa indicada no rodapé deste site (razão social e CNPJ). Substitua os dados marcados por dados reais da empresa antes de publicar, e informe aqui o contato do encarregado de dados (DPO).",
				],
			},
			{
				heading: "Dados que coletamos",
				list: [
					"Cadastro e pedido: nome, e-mail, telefone/WhatsApp, CPF e endereço de entrega — necessários para faturar e enviar.",
					"Pagamento: processado pelo provedor de pagamento. Não armazenamos número completo de cartão nem CVV em nossos servidores.",
					"Navegação: páginas vistas, produtos visualizados, origem do acesso e identificadores de cookie, usados para medir a loja e melhorar a vitrine.",
					"Quiz olfativo e newsletter: respostas e contato que você mesmo informa, usados para recomendar perfumes e enviar novidades.",
				],
			},
			{
				heading: "Bases legais",
				paragraphs: [
					"Tratamos dados de pedido para executar o contrato de compra e venda; dados fiscais por obrigação legal; dados de navegação e marketing com base no seu consentimento ou no legítimo interesse de melhorar a loja, sempre com possibilidade de recusa.",
				],
			},
			{
				heading: "Com quem compartilhamos",
				list: [
					"Provedor de pagamento, para autorizar a transação.",
					"Correios e transportadoras, para entregar o pedido.",
					"Plataformas de análise e anúncio (por exemplo Google e Meta), em formato agregado ou por identificador de cookie.",
					"Autoridades, quando houver obrigação legal.",
				],
			},
			{
				heading: "Cookies",
				paragraphs: [
					"Usamos cookies essenciais (sacola e sessão), de medição (quantas pessoas visitam e o que compram) e de publicidade (para não mostrar anúncio de quem já comprou). Você pode bloquear cookies não essenciais nas configurações do navegador; os essenciais são necessários para a sacola funcionar.",
				],
			},
			{
				heading: "Por quanto tempo guardamos",
				paragraphs: [
					"Dados de pedido e nota fiscal por 5 anos, por exigência fiscal. Contato de marketing até você pedir a remoção. Dados de navegação por até 26 meses.",
				],
			},
			{
				heading: "Seus direitos",
				list: [
					"Confirmar se tratamos seus dados e pedir uma cópia.",
					"Corrigir dados incompletos ou desatualizados.",
					"Pedir anonimização, bloqueio ou exclusão de dados desnecessários.",
					"Revogar o consentimento e sair da lista de e-mails a qualquer momento.",
					"Pedir a portabilidade dos dados a outro fornecedor.",
				],
			},
			{
				heading: "Como exercer",
				placeholder: true,
				paragraphs: [
					"Escreva para o e-mail de contato informado no rodapé com o assunto \"LGPD\". Respondemos em até 15 dias. Confirme aqui o e-mail e o nome do encarregado antes de publicar.",
				],
			},
		],
	},
	{
		slug: "termos",
		title: "Termos de uso",
		intro:
			"As regras de uso do site e as condições da compra. Ao finalizar um pedido você concorda com o que está aqui.",
		updatedAt: UPDATED,
		blocks: [
			{
				heading: "Quem somos",
				placeholder: true,
				paragraphs: [
					"Este site é operado pela empresa indicada no rodapé, inscrita no CNPJ informado ali. Complete a razão social, o CNPJ e o endereço reais antes de publicar.",
				],
			},
			{
				heading: "Produtos e descrições",
				paragraphs: [
					"Vendemos perfumes importados originais das marcas descritas em cada página. As marcas árabes que comercializamos são fabricantes independentes; não somos representantes das grifes citadas no comparativo olfativo, e a menção a elas serve apenas como referência de perfil de cheiro. Fotos são ilustrativas: o frasco pode ter pequena variação de rótulo entre lotes.",
				],
			},
			{
				heading: "Comparativo olfativo",
				paragraphs: [
					"A porcentagem de similaridade é uma avaliação sensorial da nossa equipe, feita comparando as duas fragrâncias na pele. Não é análise química, não é aferida por laboratório e não implica qualquer vínculo com a grife de referência. Percepção de cheiro varia de pessoa para pessoa.",
				],
			},
			{
				heading: "Preços e pagamento",
				paragraphs: [
					"Os preços exibidos podem mudar sem aviso; vale o preço apresentado no momento em que você finaliza o pedido. Erros evidentes de preço (por exemplo, um perfume por R$ 1,00) não obrigam a venda, e nesse caso cancelamos e devolvemos o valor integralmente. Cada total exibido na loja vem acompanhado da forma de pagamento correspondente.",
				],
			},
			{
				heading: "Cupons",
				list: [
					"Um cupom por pedido, sem acumular entre cupons.",
					"Cupons somam com o desconto do Pix.",
					"Cada cupom tem valor mínimo de pedido, informado no próprio campo do checkout.",
					"Podemos encerrar uma campanha a qualquer momento, sem afetar pedidos já finalizados.",
				],
			},
			{
				heading: "Cancelamento pela loja",
				paragraphs: [
					"Podemos cancelar um pedido em caso de suspeita de fraude, divergência nos dados do titular do pagamento, indisponibilidade de estoque ou erro de sistema. Em qualquer desses casos você é avisado e recebe o valor de volta integralmente.",
				],
			},
			{
				heading: "Uso do site",
				paragraphs: [
					"Textos, fotos próprias, avaliações de similaridade e o layout deste site são nossos. Não é permitido copiar o conteúdo para uso comercial sem autorização escrita. É proibido usar robôs para raspar preços ou tentar interferir no funcionamento da loja.",
				],
			},
			{
				heading: "Foro e legislação",
				placeholder: true,
				paragraphs: [
					"Estes termos seguem a legislação brasileira, e fica eleito o foro do domicílio do consumidor para resolver qualquer controvérsia. Confirme com seu advogado antes de publicar.",
				],
			},
		],
	},
];

export function getPolicy(slug: string): PolicyDoc | undefined {
	return POLICIES.find((p) => p.slug === slug);
}
