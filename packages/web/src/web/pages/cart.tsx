import { ArrowRight, Minus, Plus, ShoppingBag, Tag, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "wouter";
import { FreeShippingBar, TrustStrip } from "../components/commerce/blocks";
import { useSeo } from "../components/site/seo";
import { Eyebrow, LmButton } from "../components/ui/bits";
import { useCart } from "../lib/cart";
import { brl, deliveryDate } from "../lib/format";
import { track } from "../lib/track";
import { useQuote, useStoreRules } from "../queries/checkout";

export default function CartPage() {
	useSeo({
		title: "Sua sacola — LM Importados",
		description: "Revise os itens, aplique seu cupom e veja o total no Pix e no cartão antes de finalizar.",
	});
	const cart = useCart();
	const rules = useStoreRules();
	const [couponInput, setCouponInput] = useState(cart.couponCode ?? "");
	const quote = useQuote({ lines: cart.lines, couponCode: cart.couponCode, paymentMethod: "pix" });
	const data = quote.data;

	useEffect(() => {
		if (!data) return;
		track.viewCart(
			data.lines.map((l) => ({
				item_id: l.slug,
				item_name: l.name,
				item_brand: l.brand,
				item_category: l.variantLabel,
				price: l.unitPriceCents / 100,
				quantity: l.quantity,
			})),
			data.pixTotalCents / 100,
		);
	}, [data]);

	if (cart.hydrated && cart.lines.length === 0) {
		return (
			<div className="container-lm py-20">
				<div className="mx-auto max-w-md text-center">
					<ShoppingBag className="mx-auto size-12 text-line" aria-hidden />
					<h1 className="display-h2 mt-5">Sua sacola está vazia</h1>
					<p className="mt-3 text-espresso-soft">
						Se você ainda não sabe qual perfume quer, o quiz olfativo resolve em 6 perguntas.
					</p>
					<div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
						<Link
							to="/quiz"
							className="inline-flex min-h-13 items-center justify-center rounded-full bg-brass px-6 text-sm font-semibold text-espresso"
						>
							Fazer o quiz olfativo
						</Link>
						<Link
							to="/perfumes-arabes"
							className="inline-flex min-h-13 items-center justify-center rounded-full border border-espresso/25 px-6 text-sm font-semibold"
						>
							Ver os 212 perfumes
						</Link>
					</div>
				</div>
			</div>
		);
	}

	return (
		<>
			<div className="container-lm py-10">
				<Eyebrow>Etapa 1 de 3</Eyebrow>
				<h1 className="display-h2 mt-2">Sua sacola</h1>

				<div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
					<div>
						{quote.isLoading ? (
							<div className="space-y-4">
								{Array.from({ length: cart.lines.length }, (_, i) => (
									<div key={i} className="h-32 animate-pulse rounded-xl bg-bone-deep" />
								))}
							</div>
						) : (
							<ul className="space-y-4">
								{data?.lines.map((line) => (
									<li
										key={`${line.slug}-${line.variant}`}
										className="flex gap-4 rounded-xl border border-line bg-paper p-4"
									>
										<Link
											to={`/produto/${line.slug}`}
											className="size-24 shrink-0 overflow-hidden rounded-lg bg-bone-deep sm:size-28"
										>
											{line.image ? (
												<img
													src={line.image}
													alt={line.name}
													loading="lazy"
													className="h-full w-full object-contain p-2"
												/>
											) : null}
										</Link>
										<div className="min-w-0 flex-1">
											<p className="eyebrow">{line.brand}</p>
											<h2 className="mt-0.5 text-base font-semibold">
												<Link to={`/produto/${line.slug}`} className="hover:text-brass-deep">
													{line.name}
												</Link>
											</h2>
											<p className="mt-0.5 text-xs text-espresso-mute">{line.variantLabel}</p>
											<div className="mt-3 flex flex-wrap items-center justify-between gap-3">
												<div className="flex items-center rounded-full border border-line">
													<button
														type="button"
														aria-label="Diminuir quantidade"
														onClick={() =>
															cart.setQuantity(
																line.slug,
																line.variant,
																line.quantity - 1,
															)
														}
														className="flex size-11 items-center justify-center rounded-full"
													>
														<Minus className="size-4" />
													</button>
													<span className="num-display w-7 text-center text-sm font-semibold">
														{line.quantity}
													</span>
													<button
														type="button"
														aria-label="Aumentar quantidade"
														onClick={() =>
															cart.setQuantity(
																line.slug,
																line.variant,
																line.quantity + 1,
															)
														}
														className="flex size-11 items-center justify-center rounded-full"
													>
														<Plus className="size-4" />
													</button>
												</div>
												<div className="text-right">
													<p className="num-display text-base font-semibold">
														{brl(line.lineTotalCents)}
													</p>
													<p className="text-[11px] text-espresso-mute">
														{brl(line.unitPriceCents)} cada, no cartão
													</p>
												</div>
											</div>
										</div>
										<button
											type="button"
											aria-label={`Remover ${line.name}`}
											onClick={() =>
												cart.remove(line.slug, line.variant, {
													item_id: line.slug,
													item_name: line.name,
													item_brand: line.brand,
													item_category: line.variantLabel,
													price: line.unitPriceCents / 100,
													quantity: line.quantity,
												})
											}
											className="self-start p-2 text-espresso-mute hover:text-berry"
										>
											<Trash2 className="size-4" />
										</button>
									</li>
								))}
							</ul>
						)}

						<Link
							to="/perfumes-arabes"
							className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brass-deep underline underline-offset-4"
						>
							continuar comprando
						</Link>
					</div>

					{/* RESUMO */}
					<aside className="lg:sticky lg:top-24 lg:self-start">
						<div className="space-y-4 rounded-xl border border-line bg-paper p-5">
							<h2 className="text-base font-semibold">Resumo do pedido</h2>

							{data && rules.data ? (
								<FreeShippingBar
									missingCents={data.missingForFreeShippingCents}
									thresholdCents={rules.data.freeShippingThresholdCents}
									subtotalCents={data.subtotalCents - data.discountCents}
								/>
							) : null}

							{/* CUPOM — o campo existe e funciona; só anunciamos o que ele aceita. */}
							<form
								onSubmit={(e) => {
									e.preventDefault();
									cart.setCoupon(couponInput.trim().toUpperCase() || null);
								}}
								className="space-y-2"
							>
								<label htmlFor="cupom" className="flex items-center gap-1.5 text-sm font-medium">
									<Tag className="size-4 text-brass-deep" aria-hidden />
									Cupom de desconto
								</label>
								<div className="flex gap-2">
									<input
										id="cupom"
										value={couponInput}
										onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
										placeholder="Digite o código"
										className="h-12 flex-1 rounded-lg border border-line bg-bone px-3 text-sm tracking-wide uppercase outline-none"
									/>
									<button
										type="submit"
										className="h-12 rounded-lg bg-espresso px-4 text-sm font-semibold text-bone"
									>
										Aplicar
									</button>
								</div>
								{data?.coupon ? (
									<p className="flex items-center justify-between rounded-lg bg-brass-wash px-3 py-2 text-xs text-brass-deep">
										<span>
											<strong>{data.coupon.code}</strong> aplicado — {data.coupon.percentOff}% off
										</span>
										<button
											type="button"
											onClick={() => {
												cart.setCoupon(null);
												setCouponInput("");
											}}
											aria-label="Remover cupom"
											className="ml-2"
										>
											<X className="size-3.5" />
										</button>
									</p>
								) : null}
								{data?.couponError ? <p className="text-xs text-berry">{data.couponError}</p> : null}
								{rules.data ? (
									<ul className="space-y-1 text-[11px] text-espresso-mute">
										{rules.data.coupons.map((coupon) => (
											<li key={coupon.code}>
												<strong className="text-espresso-soft">{coupon.code}</strong> —{" "}
												{coupon.label}
												{coupon.minSubtotalCents > 0
													? ` (pedidos acima de ${brl(coupon.minSubtotalCents)})`
													: ""}
											</li>
										))}
									</ul>
								) : null}
							</form>

							{data ? (
								<div className="space-y-2 border-t border-line pt-4 text-sm">
									<div className="flex justify-between text-espresso-soft">
										<span>Subtotal ({data.itemCount} itens)</span>
										<span className="num-display">{brl(data.subtotalCents)}</span>
									</div>
									{data.discountCents > 0 ? (
										<div className="flex justify-between text-brass-deep">
											<span>Desconto do cupom</span>
											<span className="num-display">−{brl(data.discountCents)}</span>
										</div>
									) : null}
									<div className="flex justify-between text-espresso-soft">
										<span>Frete (envio padrão)</span>
										<span className="num-display">
											{data.freeShipping ? "grátis" : brl(data.shippingCents)}
										</span>
									</div>

									<div className="mt-3 space-y-1 border-t border-line pt-3">
										<div className="flex items-baseline justify-between">
											<span className="font-semibold">Total no Pix (5% off)</span>
											<span className="num-display text-2xl font-semibold">
												{brl(data.pixTotalCents)}
											</span>
										</div>
										<div className="flex items-baseline justify-between text-espresso-soft">
											<span>Total no cartão</span>
											<span className="num-display">{brl(data.cardTotalCents)}</span>
										</div>
										<p className="text-xs text-espresso-mute">
											No cartão: até {data.installments.count}x de{" "}
											{brl(data.installments.valueCents)} sem juros.
										</p>
									</div>

									<p className="rounded-lg bg-bone px-3 py-2 text-xs text-espresso-soft">
										Chegando até <strong>{deliveryDate(data.deliveryEstimate)}</strong> no envio
										padrão, contando dias úteis a partir da aprovação do pagamento.
									</p>

									<Link
										to="/checkout"
										onClick={() =>
											track.beginCheckout(
												data.lines.map((l) => ({
													item_id: l.slug,
													item_name: l.name,
													item_brand: l.brand,
													item_category: l.variantLabel,
													price: l.unitPriceCents / 100,
													quantity: l.quantity,
												})),
												data.pixTotalCents / 100,
												data.coupon?.code,
											)
										}
										className="flex min-h-14 items-center justify-center gap-2 rounded-full bg-brass text-sm font-semibold text-espresso transition-colors hover:bg-brass-deep hover:text-bone"
									>
										Ir para o pagamento
										<ArrowRight className="size-4" aria-hidden />
									</Link>
									<LmButton
										variant="ghost"
										className="w-full"
										onClick={() => cart.clear()}
									>
										esvaziar sacola
									</LmButton>
								</div>
							) : null}
						</div>
					</aside>
				</div>
			</div>
			<TrustStrip />
		</>
	);
}
