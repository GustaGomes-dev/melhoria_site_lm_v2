import { ArrowRight, Check, Droplets, FlaskConical, ScanSearch, Sparkles } from "lucide-react";
import { Link } from "wouter";
import { ProductCard, ProductCardSkeleton } from "../components/commerce/product-card";
import { PriceBlock, TrustStrip } from "../components/commerce/blocks";
import { JsonLd, useSeo } from "../components/site/seo";
import { DemoBadge, Eyebrow, Reveal, SectionHeading, Stars } from "../components/ui/bits";
import { DECANT_EXPLAINER, STORE_FACTS } from "../content/site";
import { FAQ } from "../content/faq";
import { useShowcase } from "../queries/products";

const HERO = {
	slug: "armaf-club-de-nuit-intense-man",
	name: "Club de Nuit Intense Man",
	brand: "Armaf",
	image: "/products/catalog/armaf-club-de-nuit-intense-man/bottle.webp",
	similarity: 92,
	reference: "Aventus, da Creed",
};

const STEPS = [
	{
		icon: ScanSearch,
		title: "Comparamos na pele, não no papel",
		body: "Nossa equipe usa o perfume árabe em um braço e o de grife no outro, no mesmo dia, e acompanha as 8 horas seguintes: abertura, coração, fundo, fixação e projeção.",
	},
	{
		icon: FlaskConical,
		title: "A nota vira porcentagem",
		body: "90% ou mais significa que quem não é entusiasta não distingue os dois. Entre 80% e 89%, o DNA é o mesmo e muda uma ou duas notas. Abaixo disso, a gente diz que é apenas inspirado.",
	},
	{
		icon: Droplets,
		title: "Você testa antes de decidir",
		body: "Se ainda quiser conferir no seu corpo, pegue o decant de 5 ml. É o mesmo líquido do frasco grande, por uma fração do preço, e dá duas semanas de uso.",
	},
];

/** Depoimentos são conteúdo de demonstração — marcados na tela. */
const DEMO_REVIEWS = [
	{
		name: "Camila R.",
		city: "Belo Horizonte, MG",
		rating: 5,
		text: "Comprei o decant de 5 ml do Yara pra testar e acabei voltando pro frasco de 100 ml na semana seguinte. Chegou em 4 dias, lacrado, com nota fiscal.",
		product: "Lattafa Yara",
	},
	{
		name: "Rodrigo M.",
		city: "Curitiba, PR",
		rating: 5,
		text: "Uso Aventus há anos. O Club de Nuit chega muito perto mesmo, principalmente depois da primeira hora. Pelo preço, não faz sentido pagar o original.",
		product: "Armaf Club de Nuit Intense Man",
	},
	{
		name: "Juliana P.",
		city: "Recife, PE",
		rating: 4,
		text: "O que me fez comprar foi ver a fixação e a projeção descritas antes. Chegou exatamente como no site, e a embalagem vem neutra por fora.",
		product: "Lattafa Asad",
	},
];

export default function Index() {
	useSeo({
		title: "LM Importados — perfumaria árabe com comparativo olfativo",
		description:
			"212 perfumes árabes originais, 104 com a % de similaridade avaliada contra o perfume de grife. Fixação, projeção e ocasião em cada página. Decants de 5 ml e frete grátis acima de R$ 349.",
	});
	const showcase = useShowcase();

	return (
		<>
			<JsonLd
				data={{
					"@context": "https://schema.org",
					"@type": "Store",
					name: "LM Importados",
					description:
						"Perfumaria árabe original com comparativo olfativo: a % de similaridade com o perfume de grife.",
					currenciesAccepted: "BRL",
					paymentAccepted: "Pix, Cartão de crédito, Boleto",
					areaServed: "BR",
				}}
			/>

			{/* HERO */}
			<section className="border-b border-line bg-bone">
				<div className="container-lm grid items-center gap-10 py-14 lg:grid-cols-12 lg:gap-8 lg:py-20">
					<div className="lg:col-span-6">
						<Reveal>
							<Eyebrow>Perfumaria árabe · importação própria</Eyebrow>
							<h1 className="display-hero mt-4">
								Você não compra
								<br />
								<span className="text-brass-deep">no escuro.</span>
							</h1>
							<p className="mt-6 max-w-xl text-lg leading-relaxed text-espresso-soft">
								Cada perfume aqui mostra quanto ele se parece com o de grife que inspirou — testado na
								pele, com a porcentagem na frente. Mais fixação, projeção e ocasião, antes de você
								decidir.
							</p>
							<div className="mt-8 flex flex-wrap gap-3">
								<Link
									to="/perfumes-arabes"
									className="inline-flex min-h-14 items-center gap-2 rounded-full bg-espresso px-7 text-sm font-semibold text-bone transition-colors hover:bg-espresso-soft"
								>
									Ver os {STORE_FACTS.catalogSize} perfumes
									<ArrowRight className="size-4" aria-hidden />
								</Link>
								<Link
									to="/quiz"
									className="inline-flex min-h-14 items-center gap-2 rounded-full border border-espresso/25 px-7 text-sm font-semibold transition-colors hover:bg-brass hover:border-brass"
								>
									<Sparkles className="size-4" aria-hidden />
									Descobrir o meu em 6 perguntas
								</Link>
							</div>
							<dl className="mt-10 grid max-w-lg grid-cols-3 gap-4 border-t border-line pt-6">
								{[
									[STORE_FACTS.catalogSize, "perfumes no catálogo"],
									[STORE_FACTS.withComparison, "com comparativo olfativo"],
									[STORE_FACTS.brands, "marcas árabes"],
								].map(([value, label]) => (
									<div key={label as string}>
										<dt className="num-display text-3xl font-semibold">{value}</dt>
										<dd className="mt-1 text-xs leading-snug text-espresso-mute">{label}</dd>
									</div>
								))}
							</dl>
						</Reveal>
					</div>

					<div className="lg:col-span-6">
						<Reveal delay={0.1}>
							<div className="relative mx-auto max-w-lg">
								<div className="overflow-hidden rounded-xl border border-line bg-bone-deep">
									<img
										src={HERO.image}
										alt={`${HERO.name}, da ${HERO.brand}`}
										width={800}
										height={800}
										className="aspect-square w-full object-contain p-10"
									/>
								</div>
								<div className="absolute -bottom-6 left-4 right-4 rounded-xl border border-emerald/20 bg-emerald-wash p-4 shadow-warm-lg sm:left-8 sm:right-8">
									<p className="text-[10px] font-semibold tracking-[0.16em] text-emerald/70 uppercase">
										Comparativo olfativo
									</p>
									<div className="mt-1 flex items-end justify-between gap-3">
										<div>
											<p className="text-sm font-semibold text-emerald">
												{HERO.brand} {HERO.name}
											</p>
											<p className="text-xs text-emerald/70">
												parecido com {HERO.reference}
											</p>
										</div>
										<p className="num-display text-4xl leading-none font-semibold text-emerald">
											{HERO.similarity}%
										</p>
									</div>
									<div className="mt-3 h-[6px] overflow-hidden rounded-full bg-emerald/15">
										<div
											className="h-full rounded-full bg-emerald"
											style={{ width: `${HERO.similarity}%` }}
										/>
									</div>
									<Link
										to={`/produto/${HERO.slug}`}
										className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-emerald underline underline-offset-4"
									>
										ver o comparativo completo
										<ArrowRight className="size-3" aria-hidden />
									</Link>
								</div>
							</div>
						</Reveal>
					</div>
				</div>
			</section>

			<TrustStrip />

			{/* MAIS VENDIDOS */}
			<section className="container-lm py-16 sm:py-20">
				<SectionHeading
					eyebrow="O que mais sai"
					title="Os mais vendidos da loja"
					description="Os que não param em estoque. Todos com comparativo olfativo já avaliado na pele."
					action={
						<Link
							to="/perfumes-arabes?ordem=mais-vendidos"
							className="inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-brass-deep underline underline-offset-4"
						>
							ver ranking completo
							<ArrowRight className="size-4" aria-hidden />
						</Link>
					}
				/>
				<div className="mt-8 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
					{showcase.isLoading
						? Array.from({ length: 4 }, (_, i) => <ProductCardSkeleton key={i} />)
						: showcase.data?.bestSellers
								.slice(0, 4)
								.map((p, i) => (
									<Reveal key={p.slug} delay={i * 0.06} as="div" className="h-full">
										<ProductCard product={p} priority={i < 2} />
									</Reveal>
								))}
				</div>
			</section>

			{/* COMO FUNCIONA O COMPARATIVO */}
			<section className="border-y border-line bg-bone-deep py-16 sm:py-24">
				<div className="container-lm grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
					<div>
						<Eyebrow>O que ninguém mais te mostra</Eyebrow>
						<h2 className="display-h2 mt-3">Como funciona o comparativo olfativo</h2>
						<p className="mt-4 text-espresso-soft">
							Perfume árabe barato não é o mesmo que perfume árabe parecido com o de grife. A diferença
							entre os dois é a única informação que importa na hora de comprar — e é a única que
							ninguém publica. A gente publica.
						</p>
						<Link
							to="/perfumes-arabes?comparativo=1"
							className="mt-6 inline-flex min-h-12 items-center gap-2 rounded-full bg-espresso px-6 text-sm font-semibold text-bone"
						>
							Ver os {STORE_FACTS.withComparison} perfumes avaliados
							<ArrowRight className="size-4" aria-hidden />
						</Link>
					</div>
					<ol className="space-y-4">
						{STEPS.map((step, i) => (
							<Reveal key={step.title} delay={i * 0.06} as="li">
								<div className="flex gap-4 rounded-xl border border-line bg-paper p-5">
									<div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-emerald-wash">
										<step.icon className="size-5 text-emerald" aria-hidden />
									</div>
									<div>
										<h3 className="text-base font-semibold">
											<span className="num-display mr-2 text-espresso-mute">0{i + 1}</span>
											{step.title}
										</h3>
										<p className="mt-1.5 text-sm leading-relaxed text-espresso-soft">
											{step.body}
										</p>
									</div>
								</div>
							</Reveal>
						))}
					</ol>
				</div>
			</section>

			{/* 90%+ */}
			<section className="container-lm py-16 sm:py-20">
				<SectionHeading
					eyebrow="90% ou mais de similaridade"
					title="Os que quase ninguém distingue"
					description="Aqui estão os perfumes que passaram mais perto da referência de grife na nossa avaliação."
					action={
						<Link
							to="/perfumes-arabes?comparativo=1&ordem=similaridade"
							className="inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-brass-deep underline underline-offset-4"
						>
							ver todos por similaridade
							<ArrowRight className="size-4" aria-hidden />
						</Link>
					}
				/>
				<div className="mt-8 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
					{showcase.isLoading
						? Array.from({ length: 4 }, (_, i) => <ProductCardSkeleton key={i} />)
						: showcase.data?.closestMatches
								.slice(0, 4)
								.map((p, i) => (
									<Reveal key={p.slug} delay={i * 0.06} as="div" className="h-full">
										<ProductCard product={p} />
									</Reveal>
								))}
				</div>
			</section>

			{/* QUIZ */}
			<section className="bg-espresso py-16 text-bone sm:py-24">
				<div className="container-lm grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
					<div>
						<p className="text-[11px] font-semibold tracking-[0.18em] text-brass uppercase">
							Quiz olfativo · 6 perguntas
						</p>
						<h2 className="display-h2 mt-3">
							Não sabe qual escolher entre 212?
							<br />
							Responda 6 perguntas.
						</h2>
						<p className="mt-4 max-w-xl text-bone/70">
							Ocasião, tipo de cheiro, quanta presença você quer e quanto quer gastar. Devolvemos 6
							perfumes com o motivo de cada indicação — e um cupom de 15% para o que você escolher.
						</p>
						<Link
							to="/quiz"
							className="mt-8 inline-flex min-h-14 items-center gap-2 rounded-full bg-brass px-7 text-sm font-semibold text-espresso transition-colors hover:bg-bone"
						>
							<Sparkles className="size-4" aria-hidden />
							Começar o quiz — leva 1 minuto
						</Link>
					</div>
					<ul className="space-y-3">
						{[
							"Filtra por ocasião real: trabalho, noite, festa ou versátil.",
							"Cruza sua resposta com fixação e projeção de cada frasco.",
							"Mostra por que cada perfume apareceu, sem enrolação.",
							"Libera o cupom QUIZ15 no fim, válido no checkout.",
						].map((item) => (
							<li key={item} className="flex gap-3 rounded-lg border border-bone/15 px-4 py-3.5">
								<Check className="mt-0.5 size-4 shrink-0 text-brass" aria-hidden />
								<span className="text-sm text-bone/80">{item}</span>
							</li>
						))}
					</ul>
				</div>
			</section>

			{/* DECANTS */}
			<section className="container-lm py-16 sm:py-20">
				<div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
					<div>
						<Eyebrow>Testar antes de gastar</Eyebrow>
						<h2 className="display-h2 mt-3">{DECANT_EXPLAINER.title}</h2>
						<p className="mt-4 text-espresso-soft">{DECANT_EXPLAINER.body}</p>
						<ul className="mt-6 space-y-2.5">
							{DECANT_EXPLAINER.points.map((point) => (
								<li key={point} className="flex gap-2.5 text-sm text-espresso-soft">
									<Check className="mt-0.5 size-4 shrink-0 text-brass-deep" aria-hidden />
									{point}
								</li>
							))}
						</ul>
						<Link
							to="/kits-e-amostras"
							className="mt-7 inline-flex min-h-12 items-center gap-2 rounded-full border border-espresso/25 px-6 text-sm font-semibold hover:bg-espresso hover:text-bone"
						>
							Ver decants e kit de amostras
							<ArrowRight className="size-4" aria-hidden />
						</Link>
					</div>
					<div className="rounded-xl border border-line bg-paper p-6 sm:p-8">
						<p className="eyebrow">Exemplo com o Club de Nuit Intense Man</p>
						<div className="mt-5 space-y-4">
							{[
								{ label: "Decant 5 ml", note: "~50 borrifadas · 2 semanas de uso", pix: 3690, card: 3884 },
								{ label: "Decant 10 ml", note: "~100 borrifadas · 1 mês de uso", pix: 6290, card: 6621 },
								{
									label: "Frasco lacrado 105 ml",
									note: "na caixa original, com nota fiscal",
									pix: 30401,
									card: 32001,
								},
							].map((row) => (
								<div
									key={row.label}
									className="flex flex-wrap items-end justify-between gap-3 border-b border-line pb-4 last:border-0"
								>
									<div>
										<p className="text-sm font-semibold">{row.label}</p>
										<p className="text-xs text-espresso-mute">{row.note}</p>
									</div>
									<PriceBlock pixCents={row.pix} cardCents={row.card} size="sm" className="text-right" />
								</div>
							))}
						</div>
						<p className="mt-5 text-xs text-espresso-mute">
							Valores de referência deste modelo. Cada página de produto mostra o preço exato das três
							opções.
						</p>
					</div>
				</div>
			</section>

			{/* PROVA SOCIAL */}
			<section className="border-y border-line bg-bone-deep py-16 sm:py-20">
				<div className="container-lm">
					<SectionHeading
						eyebrow="Quem já comprou"
						title="Avaliações da loja"
						description="Nome, cidade e o perfume comprado — sem depoimento anônimo."
					/>
					<div className="mt-4 flex items-center gap-2">
						<DemoBadge label="avaliações de exemplo" />
						<span className="text-xs text-espresso-mute">
							Substituir pelas avaliações reais dos seus clientes antes de publicar.
						</span>
					</div>
					<div className="mt-8 grid gap-4 md:grid-cols-3">
						{DEMO_REVIEWS.map((review, i) => (
							<Reveal key={review.name} delay={i * 0.06} as="article">
								<figure className="flex h-full flex-col rounded-xl border border-line bg-paper p-5">
									<Stars rating={review.rating} />
									<blockquote className="mt-3 flex-1 text-sm leading-relaxed text-espresso-soft">
										“{review.text}”
									</blockquote>
									<figcaption className="mt-4 border-t border-line pt-3 text-xs">
										<span className="font-semibold">{review.name}</span>
										<span className="text-espresso-mute"> · {review.city}</span>
										<span className="mt-0.5 block text-espresso-mute">
											comprou {review.product}
										</span>
									</figcaption>
								</figure>
							</Reveal>
						))}
					</div>
				</div>
			</section>

			{/* FAQ CURTO */}
			<section className="container-lm py-16 sm:py-20">
				<SectionHeading
					eyebrow="Antes de comprar"
					title="As dúvidas que sempre chegam"
					action={
						<Link
							to="/faq"
							className="inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-brass-deep underline underline-offset-4"
						>
							ver as 10 perguntas
							<ArrowRight className="size-4" aria-hidden />
						</Link>
					}
				/>
				<div className="mt-8 divide-y divide-line border-y border-line">
					{FAQ.slice(0, 4).map((item) => (
						<details key={item.question} className="group py-5">
							<summary className="flex cursor-pointer items-start justify-between gap-4 text-base font-semibold marker:content-none">
								{item.question}
								<span className="mt-1 text-brass-deep transition-transform group-open:rotate-45">
									＋
								</span>
							</summary>
							<p className="mt-3 max-w-3xl text-sm leading-relaxed text-espresso-soft">{item.answer}</p>
						</details>
					))}
				</div>
			</section>
		</>
	);
}
