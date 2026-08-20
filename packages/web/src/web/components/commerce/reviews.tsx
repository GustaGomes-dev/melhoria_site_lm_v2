import { BadgeCheck, PenLine, Star } from "lucide-react";
import { useState } from "react";
import { DemoBadge, LmButton, Stars } from "../ui/bits";
import { fullDate } from "../../lib/format";
import { useCreateReview, useProductReviews } from "../../queries/reviews";

export function ReviewsSection({ slug, productName }: { slug: string; productName: string }) {
	const reviews = useProductReviews(slug);
	const create = useCreateReview();
	const [formOpen, setFormOpen] = useState(false);
	const [rating, setRating] = useState(5);
	const [form, setForm] = useState({ authorName: "", title: "", body: "", email: "" });

	const data = reviews.data;
	const hasReal = (data?.realCount ?? 0) > 0;

	return (
		<section className="border-y border-line bg-bone-deep py-16">
			<div className="container-lm grid gap-10 lg:grid-cols-[340px_1fr]">
				<div>
					<h2 className="display-h2">Avaliações</h2>
					{reviews.isLoading ? (
						<div className="mt-4 h-24 animate-pulse rounded-lg bg-bone" />
					) : (
						<>
							<div className="mt-4 flex items-end gap-4">
								<p className="num-display text-5xl leading-none font-semibold">
									{(hasReal ? (data?.realAverage ?? 0) : (data?.demoRating ?? 0)).toFixed(1)}
								</p>
								<div className="pb-1">
									<Stars rating={hasReal ? (data?.realAverage ?? 0) : (data?.demoRating ?? 0)} size={16} />
									<p className="mt-1 text-xs text-espresso-mute">
										{hasReal
											? `${data?.realCount} avaliações de clientes`
											: `${data?.demoReviewCount} avaliações`}
									</p>
								</div>
							</div>
							{!hasReal ? (
								<div className="mt-3 flex items-center gap-2">
									<DemoBadge label="nota de exemplo" />
									<span className="text-xs text-espresso-mute">
										Ainda não há avaliação real deste produto.
									</span>
								</div>
							) : null}
							<p className="mt-4 text-sm text-espresso-soft">
								Avaliação de compra verificada aparece com o selo. Quem comprou recebe o link por
								e-mail depois da entrega.
							</p>
							<LmButton
								variant="outline"
								className="mt-5"
								onClick={() => setFormOpen((v) => !v)}
							>
								<PenLine className="size-4" aria-hidden />
								Avaliar {productName}
							</LmButton>
						</>
					)}
				</div>

				<div>
					{formOpen ? (
						<form
							onSubmit={(e) => {
								e.preventDefault();
								create.mutate(
									{
										productSlug: slug,
										authorName: form.authorName,
										rating,
										title: form.title || undefined,
										body: form.body,
										email: form.email || undefined,
									},
									{
										onSuccess: () => {
											setForm({ authorName: "", title: "", body: "", email: "" });
											setRating(5);
											setFormOpen(false);
										},
									},
								);
							}}
							className="mb-8 space-y-4 rounded-xl border border-line bg-paper p-5"
						>
							<div>
								<span className="eyebrow">Sua nota</span>
								<div className="mt-2 flex gap-1">
									{[1, 2, 3, 4, 5].map((value) => (
										<button
											key={value}
											type="button"
											onClick={() => setRating(value)}
											aria-label={`${value} estrela${value > 1 ? "s" : ""}`}
											className="p-1"
										>
											<Star
												className={
													value <= rating
														? "size-6 fill-brass stroke-brass"
														: "size-6 fill-transparent stroke-line"
												}
											/>
										</button>
									))}
								</div>
								<p className="mt-1 text-xs text-espresso-mute">{rating} de 5</p>
							</div>
							<div className="grid gap-4 sm:grid-cols-2">
								<div>
									<label htmlFor="review-name" className="block text-sm font-medium">
										Como quer aparecer
									</label>
									<input
										id="review-name"
										required
										value={form.authorName}
										onChange={(e) => setForm({ ...form, authorName: e.target.value })}
										className="mt-1.5 h-12 w-full rounded-lg border border-line bg-bone px-3 text-sm outline-none"
									/>
								</div>
								<div>
									<label htmlFor="review-email" className="block text-sm font-medium">
										E-mail do pedido <span className="text-espresso-mute">(opcional)</span>
									</label>
									<input
										id="review-email"
										type="email"
										value={form.email}
										onChange={(e) => setForm({ ...form, email: e.target.value })}
										placeholder="para validar a compra"
										className="mt-1.5 h-12 w-full rounded-lg border border-line bg-bone px-3 text-sm outline-none"
									/>
								</div>
							</div>
							<div>
								<label htmlFor="review-body" className="block text-sm font-medium">
									O que achou do cheiro, da fixação e da entrega
								</label>
								<textarea
									id="review-body"
									required
									rows={4}
									value={form.body}
									onChange={(e) => setForm({ ...form, body: e.target.value })}
									className="mt-1.5 w-full rounded-lg border border-line bg-bone px-3 py-2.5 text-sm outline-none"
								/>
							</div>
							<div className="flex flex-wrap gap-2">
								<LmButton
									variant="dark"
									type="submit"
									disabled={create.isPending}
								>
									{create.isPending ? "Enviando…" : "Publicar avaliação"}
								</LmButton>
								<LmButton variant="ghost" onClick={() => setFormOpen(false)}>
									Cancelar
								</LmButton>
							</div>
							{create.isError ? (
								<p className="text-sm text-berry">
									Não conseguimos enviar. Revise os campos e tente de novo.
								</p>
							) : null}
						</form>
					) : null}

					{reviews.isLoading ? (
						<div className="space-y-3">
							<div className="h-24 animate-pulse rounded-xl bg-bone" />
							<div className="h-24 animate-pulse rounded-xl bg-bone" />
						</div>
					) : hasReal ? (
						<ul className="space-y-4">
							{data?.items.map((review) => (
								<li key={review.id} className="rounded-xl border border-line bg-paper p-5">
									<div className="flex flex-wrap items-center gap-2">
										<Stars rating={review.rating} />
										<span className="text-sm font-semibold">{review.authorName}</span>
										{review.verified ? (
											<span className="inline-flex items-center gap-1 rounded-full bg-brass-wash px-2 py-0.5 text-[10px] font-semibold tracking-[0.08em] text-brass-deep uppercase">
												<BadgeCheck className="size-3" aria-hidden />
												compra verificada
											</span>
										) : null}
										<span className="text-xs text-espresso-mute">
											{fullDate(review.createdAt)}
										</span>
									</div>
									{review.title ? <p className="mt-2 font-semibold">{review.title}</p> : null}
									<p className="mt-1.5 text-sm leading-relaxed text-espresso-soft">{review.body}</p>
								</li>
							))}
						</ul>
					) : (
						<div className="rounded-xl border border-dashed border-line bg-paper p-8 text-center">
							<p className="font-semibold">Nenhuma avaliação real ainda</p>
							<p className="mx-auto mt-2 max-w-md text-sm text-espresso-soft">
								A nota exibida ao lado é conteúdo de demonstração. Assim que seus clientes avaliarem,
								as avaliações reais aparecem aqui e substituem a nota de exemplo automaticamente.
							</p>
						</div>
					)}
				</div>
			</div>
		</section>
	);
}
