import { ArrowRight, MessageCircle, PackageCheck, ScanSearch, Truck } from "lucide-react";
import { Link } from "wouter";
import { TrustStrip } from "../components/commerce/blocks";
import { useSeo } from "../components/site/seo";
import { Eyebrow, PlaceholderMark, Reveal } from "../components/ui/bits";
import { COMPANY, STORE_FACTS } from "../content/site";

const PILLARS = [
	{
		icon: ScanSearch,
		title: "A gente testa antes de vender",
		body: "Todo perfume que ganha porcentagem de similaridade passou por comparação lado a lado com o de grife, na pele, num intervalo de 8 horas. Se a comparação não foi feita, o produto entra sem porcentagem — não inventamos número.",
	},
	{
		icon: PackageCheck,
		title: "Importação própria, nota fiscal sempre",
		body: "Compramos direto de distribuidor autorizado nos Emirados. Todo pedido sai com nota fiscal eletrônica no seu nome, frasco lacrado e caixa original da marca.",
	},
	{
		icon: Truck,
		title: "Prazo dito como data, não como promessa",
		body: "No checkout você vê a data prevista de entrega antes de pagar. Se atrasar, a gente avisa por WhatsApp sem você precisar perguntar.",
	},
];

export default function AboutPage() {
	useSeo({
		title: "Sobre a LM Importados",
		description:
			"Quem está atrás da loja, como avaliamos a similaridade de cada perfume árabe e o que garantimos em cada pedido.",
	});

	return (
		<>
			<section className="border-b border-line bg-bone-deep">
				<div className="container-lm max-w-3xl py-16">
					<Eyebrow>Sobre a loja</Eyebrow>
					<h1 className="display-h2 mt-3">
						Perfume árabe deixou de ser aposta quando alguém resolveu publicar o comparativo.
					</h1>
					<p className="mt-5 text-lg leading-relaxed text-espresso-soft">
						A LM Importados nasceu de um problema simples: comprar perfume online é comprar no escuro. As
						lojas descrevem cheiro com adjetivo — "sofisticado", "marcante", "envolvente" — e ninguém
						consegue decidir com isso. Nós resolvemos publicar a única informação que importa: quanto
						aquele perfume árabe se parece com o de grife que você já conhece, com a porcentagem na
						frente, testada na pele.
					</p>
					<p className="mt-4 leading-relaxed text-espresso-soft">
						Hoje são {STORE_FACTS.catalogSize} perfumes de {STORE_FACTS.brands} marcas árabes no catálogo,{" "}
						{STORE_FACTS.withComparison} deles com o comparativo já avaliado. Os outros entram no processo
						conforme conseguimos comparar cada um com a referência — e enquanto isso, eles ficam no site
						sem porcentagem, com a descrição de fixação, projeção e ocasião.
					</p>
				</div>
			</section>

			<TrustStrip />

			<section className="container-lm py-16">
				<div className="grid gap-5 lg:grid-cols-3">
					{PILLARS.map((pillar, i) => (
						<Reveal key={pillar.title} delay={i * 0.06}>
							<div className="h-full rounded-xl border border-line bg-paper p-6">
								<pillar.icon className="size-6 text-brass-deep" aria-hidden />
								<h2 className="mt-4 text-lg font-semibold">{pillar.title}</h2>
								<p className="mt-2 text-sm leading-relaxed text-espresso-soft">{pillar.body}</p>
							</div>
						</Reveal>
					))}
				</div>
			</section>

			<section className="border-y border-line bg-bone-deep py-16">
				<div className="container-lm grid gap-10 lg:grid-cols-2">
					<div>
						<Eyebrow>Marcas que trabalhamos</Eyebrow>
						<h2 className="display-h2 mt-3">Fabricantes reais, não falsificação</h2>
						<p className="mt-4 text-espresso-soft">
							Lattafa, Armaf, Afnan, Rasasi, Orientica, Khadlaj, Rayhaan e French Avenue são casas de
							perfumaria dos Emirados Árabes e da Índia, com fábrica e linha própria. Elas criam
							fragrâncias inspiradas em perfumes de grife — o que é legal e comum na indústria — e é
							isso que nosso comparativo mede. Nada aqui é falsificação de grife.
						</p>
						<Link
							to="/perfumes-arabes"
							className="mt-6 inline-flex min-h-12 items-center gap-2 rounded-full bg-espresso px-6 text-sm font-semibold text-bone"
						>
							Ver o catálogo
							<ArrowRight className="size-4" aria-hidden />
						</Link>
					</div>

					<div className="rounded-xl border border-line bg-paper p-6">
						<h2 className="text-lg font-semibold">Dados da empresa</h2>
						<p className="mt-1 text-sm text-espresso-mute">
							Os campos destacados são exemplos e precisam ser substituídos pelos dados reais antes de
							publicar a loja.
						</p>
						<dl className="mt-5 space-y-3 text-sm">
							{[
								["Razão social", COMPANY.legalName],
								["CNPJ", COMPANY.cnpj],
								["Endereço", COMPANY.address],
								["Cidade", COMPANY.cityState],
								["CEP", COMPANY.zip],
								["E-mail", COMPANY.email],
								["WhatsApp", COMPANY.whatsapp],
								["Instagram", COMPANY.instagram],
							].map(([label, field]) => (
								<div key={label as string} className="flex flex-wrap justify-between gap-2 border-b border-line pb-2">
									<dt className="text-espresso-mute">{label as string}</dt>
									<dd className="font-medium">
										{typeof field === "object" && field.placeholder ? (
											<PlaceholderMark>{field.value}</PlaceholderMark>
										) : (
											(field as { value: string }).value
										)}
									</dd>
								</div>
							))}
						</dl>
						<p className="mt-4 text-sm text-espresso-soft">{COMPANY.hours.value}</p>
						<a
							href={COMPANY.whatsappLink.value}
							className="mt-5 inline-flex min-h-12 items-center gap-2 rounded-full border border-espresso/25 px-5 text-sm font-semibold hover:bg-espresso hover:text-bone"
						>
							<MessageCircle className="size-4" aria-hidden />
							Falar no WhatsApp
						</a>
					</div>
				</div>
			</section>

			<section className="container-lm py-16">
				<div className="mx-auto max-w-2xl text-center">
					<h2 className="display-h2">Ainda com dúvida?</h2>
					<p className="mt-3 text-espresso-soft">
						As 10 perguntas que mais chegam estão respondidas por extenso — inclusive as
						desconfortáveis, tipo "é original mesmo?" e "e se eu não gostar do cheiro?".
					</p>
					<div className="mt-7 flex flex-wrap justify-center gap-3">
						<Link
							to="/faq"
							className="inline-flex min-h-13 items-center rounded-full bg-brass px-6 text-sm font-semibold text-espresso"
						>
							Ler as perguntas frequentes
						</Link>
						<Link
							to="/quiz"
							className="inline-flex min-h-13 items-center rounded-full border border-espresso/25 px-6 text-sm font-semibold"
						>
							Fazer o quiz olfativo
						</Link>
					</div>
				</div>
			</section>
		</>
	);
}
