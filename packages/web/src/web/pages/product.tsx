import {
	BadgeCheck,
	Box,
	ChevronRight,
	Minus,
	Plus,
	RotateCcw,
	ShieldCheck,
	Truck,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "wouter";
import { PriceBlock, StatBars } from "../components/commerce/blocks";
import { ProductCard } from "../components/commerce/product-card";
import { SimilarityPanel } from "../components/commerce/similarity";
import { JsonLd, useSeo } from "../components/site/seo";
import { DemoBadge, Eyebrow, Pill, Skeleton, Stars } from "../components/ui/bits";
import { useCart, type CartVariant } from "../lib/cart";
import { brl, deliveryDate } from "../lib/format";
import { track } from "../lib/track";
import { cn } from "../lib/utils";
import { useStoreRules } from "../queries/checkout";
import { useProduct } from "../queries/products";
import { ReviewsSection } from "../components/commerce/reviews";

function NotesPyramid({
	top,
	heart,
	base,
}: {
	top: string[];
	heart: string[];
	base: string[];
}) {
	const rows = [
		{ label: "Saída", notes: top, help: "os primeiros 15 minutos" },
		{ label: "Corpo", notes: heart, help: "da primeira à terceira hora" },
		{ label: "Fundo", notes: base, help: "o que fica na pele e na roupa" },
	].filter((row) => row.notes.length > 0);

	if (!rows.length) return null;

	return (
		<div className="rounded-xl border border-line bg-paper p-5">
			<h3 className="text-sm font-semibold tracking-[0.08em] uppercase">Pirâmide olfativa</h3>
			<div className="mt-4 space-y-4">
				{rows.map((row) => (
					<div key={row.label} className="border-b border-line pb-4 last:border-0 last:pb-0">
						<div className="flex items-baseline gap-2">
							<span className="text-sm font-semibold">{row.label}</span>
							<span className="text-xs text-espresso-mute">{row.help}</span>
						</div>
						<ul className="mt-2 flex flex-wrap gap-1.5">
							{row.notes.map((note) => (
								<li
									key={note}
									className="rounded-full border border-line bg-bone px-2.5 py-1 text-xs"
								>
									{note}
								</li>
							))}
						</ul>
					</div>
				))}
			</div>
		</div>
	);
}

export default function ProductPage() {
	const { slug = "" } = useParams<{ slug: string }>();
	const query = useProduct(slug);
	const rules = useStoreRules();
	const cart = useCart();
	const [variant, setVariant] = useState<CartVariant>("full");
	const [quantity, setQuantity] = useState(1);
	const [activeImage, setActiveImage] = useState(0);

	const data = query.data;
	const product = data?.product;

	useSeo({
		title: product
			? `${product.brand} ${product.name}${product.volume ? ` ${product.volume}` : ""} — LM Importados`
			: "Perfume — LM Importados",
		description: product
			? `${product.name}, da ${product.brand}. ${
					product.similarity ? `${product.similarity}% parecido com ${product.reference?.name}. ` : ""
				}Fixação ${product.fixationLabel.toLowerCase()}, projeção ${product.projectionLabel.toLowerCase()}. ${brl(
					Math.round(product.pixPrice * 100),
				)} no Pix.`
			: undefined,
	});

	useEffect(() => {
		setVariant("full");
		setQuantity(1);
		setActiveImage(0);
	}, [slug]);

	useEffect(() => {
		if (!product) return;
		track.viewItem({
			item_id: product.slug,
			item_name: product.name,
			item_brand: product.brand,
			item_category: product.family,
			price: product.pixPrice,
			quantity: 1,
		});
	}, [product]);

	if (query.isLoading) {
		return (
			<div className="container-lm grid gap-10 py-12 lg:grid-cols-2">
				<Skeleton className="aspect-square" />
				<div className="space-y-4">
					<Skeleton className="h-4 w-24" />
					<Skeleton className="h-10 w-3/4" />
					<Skeleton className="h-28" />
					<Skeleton className="h-14 w-full" />
				</div>
			</div>
		);
	}

	if (!data || !product) {
		return (
			<div className="container-lm py-20 text-center">
				<h1 className="display-h2">Perfume não encontrado</h1>
				<p className="mt-3 text-espresso-soft">
					Esse endereço não existe mais, ou o produto saiu do catálogo.
				</p>
				<Link
					to="/perfumes-arabes"
					className="mt-6 inline-flex min-h-12 items-center rounded-full bg-espresso px-6 text-sm font-semibold text-bone"
				>
					Ver todos os perfumes
				</Link>
			</div>
		);
	}

	const images = [product.imageBottle, product.imageBox].filter((src): src is string => Boolean(src));
	const selected = data.variants.find((v) => v.id === variant) ?? data.variants[0];
	const shipping = rules.data?.shippingMethods[0];
	const freeShippingThreshold = rules.data?.freeShippingThresholdCents ?? 34_900;
	const lineTotalPix = selected.pixPriceCents * quantity;
	const missingForFree = Math.max(0, freeShippingThreshold - lineTotalPix);

	return (
		<>
			<JsonLd
				data={{
					"@context": "https://schema.org",
					"@type": "Product",
					name: `${product.brand} ${product.name}`,
					brand: { "@type": "Brand", name: product.brand },
					category: product.family,
					description: product.description,
					image: product.imageBottle ? [window.location.origin + product.imageBottle] : undefined,
					offers: {
						"@type": "Offer",
						priceCurrency: "BRL",
						price: product.pixPrice.toFixed(2),
						availability: "https://schema.org/InStock",
						itemCondition: "https://schema.org/NewCondition",
						url: window.location.href,
						priceValidUntil: new Date(Date.now() + 30 * 864e5).toISOString().slice(0, 10),
					},
				}}
			/>

			<nav aria-label="Você está em" className="border-b border-line bg-bone-deep">
				<ol className="container-lm flex flex-wrap items-center gap-1.5 py-3 text-xs text-espresso-mute">
					<li>
						<Link to="/" className="hover:text-espresso">
							Início
						</Link>
					</li>
					<ChevronRight className="size-3" aria-hidden />
					<li>
						<Link to="/perfumes-arabes" className="hover:text-espresso">
							Perfumes
						</Link>
					</li>
					<ChevronRight className="size-3" aria-hidden />
					<li>
						<Link
							to={`/perfumes-arabes?marca=${encodeURIComponent(product.brand)}`}
							className="hover:text-espresso"
						>
							{product.brand}
						</Link>
					</li>
					<ChevronRight className="size-3" aria-hidden />
					<li aria-current="page" className="text-espresso">
						{product.name}
					</li>
				</ol>
			</nav>

			<div className="container-lm grid gap-10 py-10 lg:grid-cols-[1fr_460px] lg:gap-14">
				{/* GALERIA */}
				<div className="lg:sticky lg:top-24 lg:self-start">
					<div className="overflow-hidden rounded-xl border border-line bg-bone-deep">
						{images.length ? (
							<img
								src={images[activeImage]}
								alt={`${product.name} — ${product.brand}`}
								width={900}
								height={900}
								className="aspect-square w-full object-contain p-8"
							/>
						) : (
							<div className="flex aspect-square items-center justify-center text-espresso-mute">
								{product.brand}
							</div>
						)}
					</div>
					{images.length > 1 ? (
						<div className="mt-3 flex gap-3">
							{images.map((src, i) => (
								<button
									key={src}
									type="button"
									onClick={() => setActiveImage(i)}
									aria-label={`Ver imagem ${i + 1}`}
									className={cn(
										"size-20 overflow-hidden rounded-lg border bg-bone-deep p-1",
										i === activeImage ? "border-espresso" : "border-line",
									)}
								>
									<img src={src} alt="" className="h-full w-full object-contain" />
								</button>
							))}
						</div>
					) : null}

					<div className="mt-6 hidden gap-4 lg:grid">
						{product.similarity != null && product.reference ? (
							<SimilarityPanel
								similarity={product.similarity}
								productName={`${product.brand} ${product.name}`}
								productImage={product.imageBottle}
								reference={product.reference}
							/>
						) : (
							<div className="rounded-xl border border-line bg-paper p-5">
								<Eyebrow>Perfil olfativo</Eyebrow>
								<h2 className="mt-2 text-lg font-semibold">
									{product.family} · {product.gender}
								</h2>
								<p className="mt-2 text-sm leading-relaxed text-espresso-soft">
									Este perfume ainda não passou pela nossa avaliação de similaridade com um perfume
									de grife — por isso não mostramos porcentagem aqui. O que descrevemos abaixo é o
									comportamento dele: como abre, quanto dura e quanto projeta.
								</p>
								<Link
									to="/perfumes-arabes?comparativo=1"
									className="mt-3 inline-block text-sm font-semibold text-brass-deep underline underline-offset-4"
								>
									ver os perfumes que já têm comparativo
								</Link>
							</div>
						)}
					</div>
				</div>

				{/* COMPRA */}
				<div>
					<Eyebrow>{product.brand}</Eyebrow>
					<h1 className="mt-2 text-3xl leading-tight font-semibold sm:text-4xl">{product.name}</h1>
					<div className="mt-3 flex flex-wrap items-center gap-2">
						<Pill>{product.gender}</Pill>
						<Pill>{product.family}</Pill>
						{product.volume ? <Pill>{product.volume}</Pill> : null}
						{product.bestSellerRank ? (
							<Pill tone="dark">#{product.bestSellerRank} mais vendido</Pill>
						) : null}
					</div>

					<div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-espresso-soft">
						<span className="inline-flex items-center gap-1.5">
							<Stars rating={product.demoRating} />
							{product.demoRating.toFixed(1)} · {product.demoReviewCount} avaliações
						</span>
						<span className="text-espresso-mute">{product.demoSold} vendidos</span>
						<DemoBadge label="dados de exemplo" />
					</div>

					<p className="mt-5 leading-relaxed text-espresso-soft">{product.description}</p>

					{/* VARIANTES */}
					<fieldset className="mt-7">
						<legend className="eyebrow mb-3">Escolha o tamanho</legend>
						<div className="space-y-2">
							{data.variants.map((option) => (
								<label
									key={option.id}
									className={cn(
										"flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors",
										variant === option.id
											? "border-espresso bg-paper"
											: "border-line bg-bone hover:border-espresso/40",
									)}
								>
									<input
										type="radio"
										name="variante"
										checked={variant === option.id}
										onChange={() => setVariant(option.id as CartVariant)}
										className="mt-1 size-4 shrink-0 accent-brass-deep"
									/>
									<span className="flex-1">
										<span className="flex flex-wrap items-baseline justify-between gap-2">
											<span className="text-sm font-semibold">{option.label}</span>
											<span className="num-display text-sm font-semibold">
												{brl(option.pixPriceCents)}
												<span className="ml-1 font-sans text-[11px] font-medium text-brass-deep">
													no Pix
												</span>
											</span>
										</span>
										<span className="mt-1 block text-xs leading-relaxed text-espresso-mute">
											{option.description}
										</span>
									</span>
								</label>
							))}
						</div>
					</fieldset>

					{/* PREÇO E CTA */}
					<div className="mt-7 rounded-xl border border-line bg-paper p-5">
						<PriceBlock
							pixCents={selected.pixPriceCents * quantity}
							cardCents={selected.priceCents * quantity}
							installments={{
								count: Math.max(1, Math.min(10, Math.floor((selected.priceCents * quantity) / 3000))),
								valueCents: Math.ceil(
									(selected.priceCents * quantity) /
										Math.max(1, Math.min(10, Math.floor((selected.priceCents * quantity) / 3000))),
								),
							}}
						/>

						<div className="mt-5 flex flex-wrap items-center gap-3">
							<div className="flex items-center rounded-full border border-line">
								<button
									type="button"
									aria-label="Diminuir quantidade"
									onClick={() => setQuantity((q) => Math.max(1, q - 1))}
									className="flex size-12 items-center justify-center rounded-full"
								>
									<Minus className="size-4" />
								</button>
								<span className="num-display w-8 text-center text-base font-semibold">{quantity}</span>
								<button
									type="button"
									aria-label="Aumentar quantidade"
									onClick={() => setQuantity((q) => Math.min(20, q + 1))}
									className="flex size-12 items-center justify-center rounded-full"
								>
									<Plus className="size-4" />
								</button>
							</div>
							<button
								type="button"
								onClick={() =>
									cart.add(
										{ slug: product.slug, variant, quantity },
										{
											item_id: product.slug,
											item_name: product.name,
											item_brand: product.brand,
											item_category: product.family,
											item_variant: selected.label,
											price: selected.pixPriceCents / 100,
											quantity,
										},
									)
								}
								className="h-14 flex-1 rounded-full bg-brass px-6 text-sm font-semibold text-espresso transition-colors hover:bg-brass-deep hover:text-bone"
							>
								Adicionar à sacola
							</button>
						</div>

						<ul className="mt-5 space-y-2.5 border-t border-line pt-4 text-sm">
							<li className="flex gap-2.5">
								<Truck className="mt-0.5 size-4 shrink-0 text-brass-deep" aria-hidden />
								<span>
									{missingForFree > 0 ? (
										<>
											Frete grátis faltando <strong>{brl(missingForFree)}</strong>. No envio
											padrão, chega{" "}
											{shipping ? deliveryDate(shipping.estimatedDate) : "em cerca de 6 dias úteis"}
											.
										</>
									) : (
										<>
											<strong>Frete grátis</strong> neste pedido. Chega{" "}
											{shipping ? deliveryDate(shipping.estimatedDate) : "em cerca de 6 dias úteis"}
											.
										</>
									)}
								</span>
							</li>
							<li className="flex gap-2.5">
								<RotateCcw className="mt-0.5 size-4 shrink-0 text-brass-deep" aria-hidden />
								<span>
									30 dias para devolver, <strong>mesmo com o frasco aberto</strong> (mínimo 80% do
									conteúdo). Frete da devolução por nossa conta.
								</span>
							</li>
							<li className="flex gap-2.5">
								<BadgeCheck className="mt-0.5 size-4 shrink-0 text-brass-deep" aria-hidden />
								<span>Original lacrado, com nota fiscal eletrônica no seu nome.</span>
							</li>
						</ul>
					</div>

					{/* MOBILE: comparativo */}
					<div className="mt-6 lg:hidden">
						{product.similarity != null && product.reference ? (
							<SimilarityPanel
								similarity={product.similarity}
								productName={`${product.brand} ${product.name}`}
								productImage={product.imageBottle}
								reference={product.reference}
							/>
						) : (
							<div className="rounded-xl border border-line bg-paper p-5">
								<Eyebrow>Perfil olfativo</Eyebrow>
								<h2 className="mt-2 text-lg font-semibold">
									{product.family} · {product.gender}
								</h2>
								<p className="mt-2 text-sm leading-relaxed text-espresso-soft">
									Este perfume ainda não passou pela nossa avaliação de similaridade com um perfume
									de grife. Abaixo está como ele se comporta na pele.
								</p>
							</div>
						)}
					</div>

					<div className="mt-6 grid gap-4">
						<StatBars
							fixation={product.fixation}
							fixationLabel={product.fixationLabel}
							projection={product.projection}
							projectionLabel={product.projectionLabel}
							occasions={product.occasions}
							occasionLabel={product.occasionLabel}
						/>
						<NotesPyramid
							top={product.topNotes}
							heart={product.heartNotes}
							base={product.baseNotes}
						/>

						<div className="rounded-xl border border-line bg-paper p-5">
							<h3 className="flex items-center gap-2 text-sm font-semibold tracking-[0.08em] uppercase">
								<Box className="size-4 text-brass-deep" aria-hidden />
								O que vem na caixa
							</h3>
							<ul className="mt-3 space-y-2 text-sm text-espresso-soft">
								<li>
									1 frasco de {product.name}
									{product.volume ? ` de ${product.volume}` : ""}, lacrado, na caixa original da{" "}
									{product.brand}.
								</li>
								<li>Nota fiscal eletrônica emitida no seu nome.</li>
								<li>Embalagem externa neutra, sem indicação do conteúdo ou do valor.</li>
								<li>
									Se você escolher decant, o envio é em atomizador de vidro etiquetado com nome, lote
									e data do fracionamento — sem a caixa da marca.
								</li>
							</ul>
						</div>

						<div className="rounded-xl border border-brass-deep/25 bg-brass-wash/40 p-5">
							<h3 className="flex items-center gap-2 text-sm font-semibold tracking-[0.08em] uppercase">
								<ShieldCheck className="size-4 text-brass-deep" aria-hidden />
								E se você não gostar do cheiro
							</h3>
							<p className="mt-2 text-sm leading-relaxed text-espresso-soft">
								Você tem 30 dias corridos para devolver, mesmo tendo usado. A única condição é sobrar
								pelo menos 80% do conteúdo (50% em decants). Devolvemos o valor integral, incluindo o
								frete que você pagou, ou trocamos por outro perfume.{" "}
								<Link
									to="/trocas-e-devolucoes"
									className="font-semibold text-brass-deep underline underline-offset-4"
								>
									ler a política completa
								</Link>
							</p>
						</div>
					</div>
				</div>
			</div>

			<ReviewsSection slug={product.slug} productName={product.name} />

			{data.related.length ? (
				<section className="container-lm py-16">
					<h2 className="display-h2">Quem viu este, viu também</h2>
					<p className="mt-2 text-espresso-soft">
						Mesma família olfativa, ou a mesma referência de grife.
					</p>
					<div className="mt-8 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
						{data.related.map((related) => (
							<ProductCard key={related.slug} product={related} />
						))}
					</div>
				</section>
			) : null}
		</>
	);
}
