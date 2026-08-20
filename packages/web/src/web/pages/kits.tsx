import { Check, Droplets, Package, ShoppingBag } from "lucide-react";
import { Link } from "wouter";
import { TrustStrip } from "../components/commerce/blocks";
import { useSeo } from "../components/site/seo";
import { Eyebrow, Reveal, SectionHeading } from "../components/ui/bits";
import { DECANT_EXPLAINER } from "../content/site";
import { useCart } from "../lib/cart";
import { brl, brlFromReais } from "../lib/format";
import { useShowcase } from "../queries/products";

/** Kits prontos: combinações fechadas de decants, montadas com os mais vendidos. */
const KITS = [
	{
		id: "kit-descoberta",
		title: "Kit Descoberta",
		subtitle: "3 decants de 5 ml",
		body: "Os três perfumes que mais saem da loja, em 5 ml cada. Duas semanas de uso por frasco — dá tempo de sentir como cada um se comporta na sua pele antes de escolher o frasco cheio.",
		slugs: ["armaf-club-de-nuit-intense-man", "lattafa-asad", "lattafa-yara"],
		variant: "decant5" as const,
	},
	{
		id: "kit-noite",
		title: "Kit Noite",
		subtitle: "2 decants de 10 ml",
		body: "Para jantar, festa e balada: os dois com maior fixação e projeção entre os mais vendidos, em 10 ml. Cerca de um mês de uso diário em cada.",
		slugs: ["armaf-club-de-nuit-intense-man", "lattafa-asad"],
		variant: "decant10" as const,
	},
];

export default function KitsPage() {
	useSeo({
		title: "Decants de 5 ml e kits de amostra — LM Importados",
		description:
			"Teste o perfume antes de comprar o frasco inteiro. Decants de 5 ml e 10 ml fracionados do frasco original, e kits prontos com os mais vendidos.",
	});

	const cart = useCart();
	const showcase = useShowcase();
	const candidates = [
		...(showcase.data?.bestSellers ?? []),
		...(showcase.data?.closestMatches ?? []),
	]
		.filter((p, i, arr) => arr.findIndex((x) => x.slug === p.slug) === i)
		.slice(0, 8);

	function addKit(kit: (typeof KITS)[number]) {
		for (const slug of kit.slugs) {
			cart.add({ slug, variant: kit.variant, quantity: 1 });
		}
	}

	return (
		<>
			<section className="border-b border-line bg-bone-deep">
				<div className="container-lm grid gap-10 py-14 lg:grid-cols-[1fr_1fr]">
					<div>
						<Eyebrow>Testar antes de gastar</Eyebrow>
						<h1 className="display-h2 mt-3">Decants e kits de amostra</h1>
						<p className="mt-4 max-w-xl text-espresso-soft">{DECANT_EXPLAINER.body}</p>
						<ul className="mt-6 space-y-2.5">
							{DECANT_EXPLAINER.points.map((point) => (
								<li key={point} className="flex gap-2.5 text-sm text-espresso-soft">
									<Check className="mt-0.5 size-4 shrink-0 text-brass-deep" aria-hidden />
									{point}
								</li>
							))}
						</ul>
					</div>
					<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 lg:content-start">
						{[
							{
								icon: Droplets,
								title: "5 ml — R$ 36 a R$ 110",
								body: "~50 borrifadas. Duas semanas de uso diário. Ideal para decidir sobre um frasco cheio.",
							},
							{
								icon: Package,
								title: "10 ml — R$ 62 a R$ 190",
								body: "~100 borrifadas. Um mês de uso, ou o tamanho certo para levar na viagem.",
							},
						].map((card) => (
							<div key={card.title} className="rounded-xl border border-line bg-paper p-5">
								<card.icon className="size-5 text-brass-deep" aria-hidden />
								<h2 className="mt-3 text-base font-semibold">{card.title}</h2>
								<p className="mt-1.5 text-sm leading-relaxed text-espresso-soft">{card.body}</p>
							</div>
						))}
						<p className="text-xs text-espresso-mute">
							O preço do decant varia com o preço do frasco cheio. Cada página de produto mostra os três
							valores exatos.
						</p>
					</div>
				</div>
			</section>

			<TrustStrip />

			{/* KITS PRONTOS */}
			<section className="container-lm py-16">
				<SectionHeading
					eyebrow="Combinações fechadas"
					title="Kits prontos"
					description="Montados com os perfumes que mais saem. Um clique adiciona todos os decants à sacola."
				/>
				<div className="mt-8 grid gap-5 lg:grid-cols-2">
					{KITS.map((kit, i) => (
						<Reveal key={kit.id} delay={i * 0.06}>
							<div className="flex h-full flex-col rounded-xl border border-line bg-paper p-6">
								<Eyebrow>{kit.subtitle}</Eyebrow>
								<h3 className="mt-2 text-xl font-semibold">{kit.title}</h3>
								<p className="mt-2 flex-1 text-sm leading-relaxed text-espresso-soft">{kit.body}</p>
								<ul className="mt-4 space-y-1.5 border-t border-line pt-4 text-sm">
									{kit.slugs.map((slug) => {
										const product = candidates.find((p) => p.slug === slug);
										const priceCents =
											kit.variant === "decant5"
												? product?.decant5PixCents
												: product?.decant10PixCents;
										return (
											<li key={slug} className="flex justify-between gap-2">
												<Link
													to={`/produto/${slug}`}
													className="text-espresso-soft hover:text-brass-deep"
												>
													{product ? `${product.brand} ${product.name}` : slug}
												</Link>
												<span className="whitespace-nowrap text-espresso-mute">
													{kit.variant === "decant5" ? "5 ml" : "10 ml"}
													{priceCents ? ` · ${brl(priceCents)}` : ""}
												</span>
											</li>
										);
									})}
									{(() => {
										const total = kit.slugs.reduce((sum, slug) => {
											const product = candidates.find((p) => p.slug === slug);
											return (
												sum +
												(kit.variant === "decant5"
													? (product?.decant5PixCents ?? 0)
													: (product?.decant10PixCents ?? 0))
											);
										}, 0);
										return total > 0 ? (
											<li className="flex justify-between gap-2 border-t border-line pt-2 font-semibold">
												<span>Total do kit no Pix</span>
												<span className="num-display">{brl(total)}</span>
											</li>
										) : null;
									})()}
								</ul>
								<button
									type="button"
									onClick={() => addKit(kit)}
									className="mt-5 inline-flex min-h-13 items-center justify-center gap-2 rounded-full bg-brass px-6 text-sm font-semibold text-espresso transition-colors hover:bg-brass-deep hover:text-bone"
								>
									<ShoppingBag className="size-4" aria-hidden />
									Adicionar o {kit.title} à sacola
								</button>
							</div>
						</Reveal>
					))}
				</div>
			</section>

			{/* MONTAR O SEU */}
			<section className="border-y border-line bg-bone-deep py-16">
				<div className="container-lm">
					<SectionHeading
						eyebrow="Monte o seu"
						title="Escolha decant por decant"
						description="Os mais pedidos, com opção de 5 ml e 10 ml direto na sacola."
					/>
					<ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
						{showcase.isLoading
							? Array.from({ length: 4 }, (_, i) => (
									<li key={i} className="h-64 animate-pulse rounded-xl bg-bone" />
								))
							: candidates.map((product) => (
									<li
										key={product.slug}
										className="flex flex-col rounded-xl border border-line bg-paper p-4"
									>
										<Link
											to={`/produto/${product.slug}`}
											className="aspect-square overflow-hidden rounded-lg bg-bone-deep"
										>
											{product.imageBottle ? (
												<img
													src={product.imageBottle}
													alt={product.name}
													loading="lazy"
													className="h-full w-full object-contain p-3"
												/>
											) : null}
										</Link>
										<p className="eyebrow mt-3">{product.brand}</p>
										<h3 className="text-sm font-semibold">
											<Link to={`/produto/${product.slug}`} className="hover:text-brass-deep">
												{product.name}
											</Link>
										</h3>
										{product.similarity != null ? (
											<p className="mt-1 text-xs text-emerald">
												{product.similarity}% igual a {product.referenceName}
											</p>
										) : (
											<p className="mt-1 text-xs text-espresso-mute">{product.family}</p>
										)}
										<p className="mt-2 text-xs text-espresso-mute">
											frasco cheio: {brlFromReais(product.pixPrice)} no Pix
										</p>
										<div className="mt-3 flex flex-1 flex-col justify-end gap-2">
											<button
												type="button"
												onClick={() =>
													cart.add({
														slug: product.slug,
														variant: "decant5",
														quantity: 1,
													})
												}
												className="min-h-11 rounded-full border border-espresso/25 text-xs font-semibold hover:bg-espresso hover:text-bone"
											>
												5 ml — {brl(product.decant5PixCents)}
											</button>
											<button
												type="button"
												onClick={() =>
													cart.add({
														slug: product.slug,
														variant: "decant10",
														quantity: 1,
													})
												}
												className="min-h-11 rounded-full border border-espresso/25 text-xs font-semibold hover:bg-espresso hover:text-bone"
											>
												10 ml — {brl(product.decant10PixCents)}
											</button>
										</div>
									</li>
								))}
					</ul>
					<p className="mt-8 text-sm text-espresso-mute">
						Qualquer um dos 212 perfumes pode ser comprado em decant — a opção aparece na página do
						produto.{" "}
						<Link
							to="/perfumes-arabes"
							className="font-semibold text-brass-deep underline underline-offset-4"
						>
							ver o catálogo completo
						</Link>
					</p>
				</div>
			</section>
		</>
	);
}
