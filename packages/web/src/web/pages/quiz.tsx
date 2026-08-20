import { ArrowLeft, ArrowRight, Check, Loader2, RotateCcw, Sparkles } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";
import { useSeo } from "../components/site/seo";
import { Eyebrow, LmButton } from "../components/ui/bits";
import { brlFromReais } from "../lib/format";
import { cn } from "../lib/utils";
import { useCaptureLead } from "../queries/leads";
import { useQuizQuestions, useQuizRecommend } from "../queries/quiz";

type Answers = Record<string, string | string[]>;

export default function QuizPage() {
	useSeo({
		title: "Quiz olfativo — descubra seu perfume árabe | LM Importados",
		description:
			"Seis perguntas sobre ocasião, tipo de cheiro, presença e orçamento. Devolvemos 6 perfumes árabes com o motivo de cada indicação e um cupom de 15%.",
	});

	const questions = useQuizQuestions();
	const recommend = useQuizRecommend();
	const capture = useCaptureLead();

	const [index, setIndex] = useState(0);
	const [answers, setAnswers] = useState<Answers>({});
	const [contact, setContact] = useState({ name: "", email: "" });

	const list = questions.data ?? [];
	const current = list[index];
	const total = list.length;
	const result = recommend.data;

	function select(value: string) {
		if (!current) return;
		if (current.multiple) {
			const currentValues = (answers[current.id] as string[] | undefined) ?? [];
			const next = currentValues.includes(value)
				? currentValues.filter((v) => v !== value)
				: [...currentValues, value];
			setAnswers({ ...answers, [current.id]: next });
		} else {
			setAnswers({ ...answers, [current.id]: value });
			if (index < total - 1) setTimeout(() => setIndex(index + 1), 180);
		}
	}

	function submit() {
		recommend.mutate({
			gender: answers.gender as string | undefined,
			moment: answers.moment as string | undefined,
			family: answers.family as string[] | undefined,
			presence: answers.presence as string | undefined,
			budget: answers.budget as string | undefined,
			reference: answers.reference as string | undefined,
		});
	}

	function restart() {
		setAnswers({});
		setIndex(0);
		recommend.reset();
		capture.reset();
	}

	const isAnswered = current
		? current.multiple
			? ((answers[current.id] as string[] | undefined)?.length ?? 0) > 0
			: Boolean(answers[current.id])
		: false;

	if (questions.isLoading) {
		return (
			<div className="container-lm py-20">
				<div className="mx-auto h-72 max-w-2xl animate-pulse rounded-xl bg-bone-deep" />
			</div>
		);
	}

	/* ---------- RESULTADO ---------- */
	if (result) {
		return (
			<div className="container-lm py-12">
				<div className="mx-auto max-w-3xl text-center">
					<Eyebrow>Resultado do quiz olfativo</Eyebrow>
					<h1 className="display-h2 mt-3">Estes são os seus 6</h1>
					<p className="mx-auto mt-3 max-w-xl text-espresso-soft">
						Ordenados por aderência às suas respostas. Cada card mostra por que apareceu — se algum não
						fizer sentido, o motivo está escrito ali.
					</p>
				</div>

				<ul className="mx-auto mt-10 grid max-w-5xl gap-4 sm:grid-cols-2">
					{result.matches.map((match, i) => (
						<li
							key={match.slug}
							className="flex gap-4 rounded-xl border border-line bg-paper p-4 sm:p-5"
						>
							<Link
								to={`/produto/${match.slug}`}
								className="size-24 shrink-0 overflow-hidden rounded-lg bg-bone-deep sm:size-28"
							>
								{match.imageBottle ? (
									<img
										src={match.imageBottle}
										alt={match.name}
										loading={i < 2 ? "eager" : "lazy"}
										className="h-full w-full object-contain p-2"
									/>
								) : null}
							</Link>
							<div className="min-w-0 flex-1">
								<div className="flex items-start justify-between gap-2">
									<div className="min-w-0">
										<p className="eyebrow">{match.brand}</p>
										<h2 className="truncate text-base font-semibold">
											<Link to={`/produto/${match.slug}`} className="hover:text-brass-deep">
												{match.name}
											</Link>
										</h2>
									</div>
									<span className="shrink-0 rounded-full bg-espresso px-2.5 py-1 text-[11px] font-semibold text-bone">
										{match.matchPercent}% match
									</span>
								</div>

								{match.similarity != null ? (
									<p className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-emerald/20 bg-emerald-wash px-2.5 py-1 text-[11px] font-medium text-emerald">
										<span className="num-display font-semibold">{match.similarity}%</span>
										igual a {match.referenceName}
									</p>
								) : (
									<p className="mt-2 text-xs text-espresso-mute">
										{match.family} · fixação {match.fixationLabel.toLowerCase()}
									</p>
								)}

								{match.reasons.length ? (
									<ul className="mt-2 space-y-1">
										{match.reasons.map((reason) => (
											<li
												key={reason}
												className="flex gap-1.5 text-xs leading-snug text-espresso-soft"
											>
												<Check className="mt-0.5 size-3 shrink-0 text-brass-deep" aria-hidden />
												{reason}
											</li>
										))}
									</ul>
								) : null}

								<p className="num-display mt-2 text-base font-semibold">
									{brlFromReais(match.pixPrice)}
									<span className="ml-1 font-sans text-[11px] font-semibold text-brass-deep">
										no Pix
									</span>
								</p>
							</div>
						</li>
					))}
				</ul>

				{/* CAPTURA DE LEAD */}
				<div className="mx-auto mt-10 max-w-2xl rounded-xl border border-line bg-paper p-6">
					{capture.isSuccess && capture.data?.ok ? (
						<div className="text-center">
							<Check className="mx-auto size-8 text-brass-deep" aria-hidden />
							<p className="mt-3 font-semibold">Resultado enviado.</p>
							<p className="mt-1 text-sm text-espresso-soft">
								Use o cupom <strong>{result.couponCode}</strong> no campo de cupom da sacola para 15%
								de desconto (pedidos acima de R$ 299).
							</p>
						</div>
					) : (
						<>
							<h2 className="text-lg font-semibold">Quer o resultado no e-mail + 15% de desconto?</h2>
							<p className="mt-1 text-sm text-espresso-soft">
								Mandamos esta lista para você comparar com calma, e liberamos o cupom{" "}
								<strong>{result.couponCode}</strong> para usar quando decidir.
							</p>
							<form
								onSubmit={(e) => {
									e.preventDefault();
									capture.mutate({
										source: "quiz",
										name: contact.name || undefined,
										email: contact.email,
										payload: { answers },
										productSlugs: result.matches.map((m) => m.slug),
									});
								}}
								className="mt-4 grid gap-3 sm:grid-cols-[1fr_1fr_auto]"
							>
								<div>
									<label htmlFor="quiz-nome" className="sr-only">
										Seu nome
									</label>
									<input
										id="quiz-nome"
										placeholder="Seu nome"
										value={contact.name}
										onChange={(e) => setContact({ ...contact, name: e.target.value })}
										className="h-12 w-full rounded-lg border border-line bg-bone px-3 text-sm outline-none"
									/>
								</div>
								<div>
									<label htmlFor="quiz-email" className="sr-only">
										Seu e-mail
									</label>
									<input
										id="quiz-email"
										type="email"
										required
										placeholder="seu@email.com"
										value={contact.email}
										onChange={(e) => setContact({ ...contact, email: e.target.value })}
										className="h-12 w-full rounded-lg border border-line bg-bone px-3 text-sm outline-none"
									/>
								</div>
								<button
									type="submit"
									disabled={capture.isPending}
									className="h-12 rounded-lg bg-brass px-5 text-sm font-semibold text-espresso disabled:opacity-60"
								>
									{capture.isPending ? "Enviando…" : "Receber"}
								</button>
							</form>
							<p className="mt-2 text-xs text-espresso-mute">
								Só o resultado e novidades da loja. Você sai da lista com um clique.
							</p>
						</>
					)}
				</div>

				<div className="mt-8 flex flex-wrap justify-center gap-3">
					<LmButton variant="outline" onClick={restart}>
						<RotateCcw className="size-4" aria-hidden />
						Refazer o quiz
					</LmButton>
					<Link
						to="/perfumes-arabes"
						className="inline-flex min-h-12 items-center gap-2 rounded-full bg-espresso px-6 text-sm font-semibold text-bone"
					>
						Ver o catálogo completo
						<ArrowRight className="size-4" aria-hidden />
					</Link>
				</div>
			</div>
		);
	}

	/* ---------- PERGUNTAS ---------- */
	return (
		<div className="container-lm py-12">
			<div className="mx-auto max-w-2xl">
				<div className="flex items-center justify-between">
					<Eyebrow>
						<span className="inline-flex items-center gap-1.5">
							<Sparkles className="size-3.5" aria-hidden />
							Quiz olfativo
						</span>
					</Eyebrow>
					<span className="num-display text-sm text-espresso-mute">
						{index + 1} de {total}
					</span>
				</div>
				<div className="mt-3 h-1.5 overflow-hidden rounded-full bg-line">
					<div
						className="h-full rounded-full bg-brass transition-all duration-300"
						style={{ width: `${((index + 1) / total) * 100}%` }}
					/>
				</div>

				{current ? (
					<div className="mt-8">
						<h1 className="text-2xl leading-tight font-semibold sm:text-3xl">{current.title}</h1>
						<p className="mt-2 text-espresso-soft">{current.subtitle}</p>

						<ul className="mt-6 space-y-2.5">
							{current.options.map((option) => {
								const selected = current.multiple
									? ((answers[current.id] as string[] | undefined) ?? []).includes(option.value)
									: answers[current.id] === option.value;
								return (
									<li key={option.value}>
										<button
											type="button"
											onClick={() => select(option.value)}
											aria-pressed={selected}
											className={cn(
												"flex w-full items-start gap-3 rounded-xl border p-4 text-left transition-colors",
												selected
													? "border-espresso bg-paper"
													: "border-line bg-paper/60 hover:border-espresso/40",
											)}
										>
											<span
												className={cn(
													"mt-0.5 flex size-5 shrink-0 items-center justify-center border",
													current.multiple ? "rounded-[5px]" : "rounded-full",
													selected ? "border-espresso bg-espresso" : "border-line",
												)}
											>
												{selected ? <Check className="size-3 text-bone" aria-hidden /> : null}
											</span>
											<span>
												<span className="block text-sm font-semibold">{option.label}</span>
												{option.hint ? (
													<span className="mt-0.5 block text-xs text-espresso-mute">
														{option.hint}
													</span>
												) : null}
											</span>
										</button>
									</li>
								);
							})}
						</ul>

						<div className="mt-8 flex items-center justify-between gap-3">
							<button
								type="button"
								disabled={index === 0}
								onClick={() => setIndex((i) => Math.max(0, i - 1))}
								className="inline-flex min-h-12 items-center gap-2 rounded-full px-4 text-sm font-semibold text-espresso-soft disabled:opacity-40"
							>
								<ArrowLeft className="size-4" aria-hidden />
								voltar
							</button>

							{index < total - 1 ? (
								<LmButton
									variant="dark"
									disabled={!isAnswered}
									onClick={() => setIndex((i) => i + 1)}
								>
									Próxima
									<ArrowRight className="size-4" aria-hidden />
								</LmButton>
							) : (
								<LmButton
									variant="primary"
									size="lg"
									disabled={!isAnswered || recommend.isPending}
									onClick={submit}
								>
									{recommend.isPending ? (
										<>
											<Loader2 className="size-4 animate-spin" aria-hidden />
											Cruzando com os 212 perfumes…
										</>
									) : (
										<>
											Ver meus perfumes
											<ArrowRight className="size-4" aria-hidden />
										</>
									)}
								</LmButton>
							)}
						</div>
					</div>
				) : null}
			</div>
		</div>
	);
}
