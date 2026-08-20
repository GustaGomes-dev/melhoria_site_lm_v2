import { AnimatePresence, motion } from "motion/react";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { Link } from "wouter";
import { useCart } from "../../lib/cart";
import { brl, deliveryDate } from "../../lib/format";
import { track } from "../../lib/track";
import { useQuote, useStoreRules } from "../../queries/checkout";
import { FreeShippingBar } from "../commerce/blocks";
import { Skeleton } from "../ui/bits";

export function CartDrawer() {
	const cart = useCart();
	const rules = useStoreRules();
	const quote = useQuote({ lines: cart.lines, couponCode: cart.couponCode, paymentMethod: "pix" });
	const data = quote.data;

	return (
		<AnimatePresence>
			{cart.drawerOpen ? (
				<>
					<motion.button
						type="button"
						aria-label="Fechar sacola"
						onClick={cart.closeDrawer}
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.15 }}
						className="fixed inset-0 z-50 bg-espresso/40"
					/>
					<motion.aside
						role="dialog"
						aria-label="Sua sacola"
						initial={{ x: "100%" }}
						animate={{ x: 0 }}
						exit={{ x: "100%" }}
						transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
						className="fixed inset-y-0 right-0 z-50 flex w-full max-w-[420px] flex-col bg-bone shadow-warm-lg"
					>
						<div className="flex items-center justify-between border-b border-line px-5 py-4">
							<h2 className="flex items-center gap-2 text-lg font-semibold">
								<ShoppingBag className="size-5" aria-hidden />
								Sua sacola
								{cart.itemCount > 0 ? (
									<span className="text-sm font-normal text-espresso-mute">
										({cart.itemCount})
									</span>
								) : null}
							</h2>
							<button
								type="button"
								onClick={cart.closeDrawer}
								aria-label="Fechar"
								className="flex size-11 items-center justify-center rounded-full hover:bg-espresso/5"
							>
								<X className="size-5" />
							</button>
						</div>

						{cart.lines.length === 0 ? (
							<div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
								<ShoppingBag className="size-10 text-line" aria-hidden />
								<p className="text-espresso-soft">
									Sua sacola está vazia. Comece pelo quiz olfativo se ainda não sabe o que quer.
								</p>
								<div className="flex flex-col gap-2">
									<Link
										to="/quiz"
										onClick={cart.closeDrawer}
										className="flex h-12 items-center justify-center rounded-full bg-brass px-6 text-sm font-semibold text-espresso"
									>
										Fazer o quiz olfativo
									</Link>
									<Link
										to="/perfumes-arabes"
										onClick={cart.closeDrawer}
										className="flex h-12 items-center justify-center rounded-full border border-espresso/25 px-6 text-sm font-semibold"
									>
										Ver os 212 perfumes
									</Link>
								</div>
							</div>
						) : (
							<>
								<div className="flex-1 overflow-y-auto px-5 py-4">
									{quote.isLoading ? (
										<div className="space-y-3">
											<Skeleton className="h-20" />
											<Skeleton className="h-20" />
										</div>
									) : (
										<ul className="space-y-4">
											{data?.lines.map((line) => (
												<li
													key={`${line.slug}-${line.variant}`}
													className="flex gap-3 border-b border-line/70 pb-4 last:border-0"
												>
													<Link
														to={`/produto/${line.slug}`}
														onClick={cart.closeDrawer}
														className="size-20 shrink-0 overflow-hidden rounded-lg bg-bone-deep"
													>
														{line.image ? (
															<img
																src={line.image}
																alt={line.name}
																loading="lazy"
																className="h-full w-full object-contain p-1.5"
															/>
														) : null}
													</Link>
													<div className="min-w-0 flex-1">
														<p className="truncate text-sm font-semibold">{line.name}</p>
														<p className="text-xs text-espresso-mute">
															{line.brand} · {line.variantLabel}
														</p>
														<div className="mt-2 flex items-center justify-between gap-2">
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
																	className="flex size-9 items-center justify-center rounded-full"
																>
																	<Minus className="size-3.5" />
																</button>
																<span className="w-6 text-center text-sm font-semibold">
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
																	className="flex size-9 items-center justify-center rounded-full"
																>
																	<Plus className="size-3.5" />
																</button>
															</div>
															<div className="text-right">
																<p className="num-display text-sm font-semibold">
																	{brl(line.lineTotalCents)}
																</p>
																<button
																	type="button"
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
																	className="mt-0.5 inline-flex items-center gap-1 text-[11px] text-espresso-mute hover:text-berry"
																>
																	<Trash2 className="size-3" aria-hidden />
																	remover
																</button>
															</div>
														</div>
													</div>
												</li>
											))}
										</ul>
									)}
								</div>

								<div className="space-y-3 border-t border-line bg-paper px-5 pt-4 pb-12">
									{data && rules.data ? (
										<FreeShippingBar
											missingCents={data.missingForFreeShippingCents}
											thresholdCents={rules.data.freeShippingThresholdCents}
											subtotalCents={data.subtotalCents - data.discountCents}
										/>
									) : null}

									{data ? (
										<>
											<div className="space-y-1 text-sm">
												<div className="flex justify-between text-espresso-soft">
													<span>Subtotal ({data.itemCount} itens)</span>
													<span className="num-display">{brl(data.subtotalCents)}</span>
												</div>
												{data.discountCents > 0 ? (
													<div className="flex justify-between text-brass-deep">
														<span>Cupom {data.coupon?.code}</span>
														<span className="num-display">
															−{brl(data.discountCents)}
														</span>
													</div>
												) : null}
												<div className="flex justify-between border-t border-line pt-2">
													<span className="font-semibold">Total no Pix (5% off)</span>
													<span className="num-display text-lg font-semibold">
														{brl(data.pixTotalCents)}
													</span>
												</div>
												<p className="text-xs text-espresso-mute">
													No cartão: {brl(data.cardTotalCents)} em até{" "}
													{data.installments.count}x de {brl(data.installments.valueCents)}
												</p>
												<p className="text-xs text-espresso-mute">
													Frete calculado no checkout. Chega até{" "}
													{deliveryDate(data.deliveryEstimate)} no envio padrão.
												</p>
											</div>

											<Link
												to="/checkout"
												onClick={() => {
													cart.closeDrawer();
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
													);
												}}
												className="flex h-13 min-h-12 items-center justify-center rounded-full bg-brass text-sm font-semibold text-espresso transition-colors hover:bg-brass-deep hover:text-bone"
											>
												Finalizar compra
											</Link>
											<Link
												to="/sacola"
												onClick={cart.closeDrawer}
												className="block text-center text-xs text-espresso-mute underline underline-offset-4"
											>
												ver sacola completa e aplicar cupom
											</Link>
										</>
									) : null}
								</div>
							</>
						)}
					</motion.aside>
				</>
			) : null}
		</AnimatePresence>
	);
}
