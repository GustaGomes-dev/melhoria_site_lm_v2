import { MessageCircle } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";
import { JsonLd, useSeo } from "../components/site/seo";
import { Eyebrow } from "../components/ui/bits";
import { FAQ } from "../content/faq";
import { COMPANY } from "../content/site";
import { cn } from "../lib/utils";

const GROUPS = [
	{ id: "todos", label: "Todas" },
	{ id: "produto", label: "Produto e cheiro" },
	{ id: "entrega", label: "Entrega" },
	{ id: "pagamento", label: "Pagamento" },
	{ id: "trocas", label: "Trocas" },
] as const;

export default function FaqPage() {
	useSeo({
		title: "Perguntas frequentes — LM Importados",
		description:
			"Original ou imitação, o que é a % de similaridade, quanto dura na pele, frete, cupons e o que acontece se você não gostar do cheiro.",
	});
	const [group, setGroup] = useState<(typeof GROUPS)[number]["id"]>("todos");
	const items = group === "todos" ? FAQ : FAQ.filter((item) => item.group === group);

	return (
		<>
			<JsonLd
				data={{
					"@context": "https://schema.org",
					"@type": "FAQPage",
					mainEntity: FAQ.map((item) => ({
						"@type": "Question",
						name: item.question,
						acceptedAnswer: { "@type": "Answer", text: item.answer },
					})),
				}}
			/>

			<section className="border-b border-line bg-bone-deep">
				<div className="container-lm max-w-3xl py-14">
					<Eyebrow>Central de ajuda</Eyebrow>
					<h1 className="display-h2 mt-3">Perguntas frequentes</h1>
					<p className="mt-4 text-espresso-soft">
						As 10 dúvidas que mais chegam no WhatsApp, respondidas por extenso. Se a sua não estiver
						aqui, fale com a gente — respondemos em horário comercial.
					</p>
				</div>
			</section>

			<div className="container-lm grid gap-10 py-12 lg:grid-cols-[240px_1fr]">
				<nav aria-label="Filtrar por assunto">
					<ul className="flex flex-wrap gap-2 lg:sticky lg:top-24 lg:flex-col">
						{GROUPS.map((option) => (
							<li key={option.id}>
								<button
									type="button"
									onClick={() => setGroup(option.id)}
									aria-current={group === option.id ? "true" : undefined}
									className={cn(
										"min-h-11 rounded-full border px-4 text-sm font-medium lg:w-full lg:text-left",
										group === option.id
											? "border-espresso bg-espresso text-bone"
											: "border-line bg-paper",
									)}
								>
									{option.label}
								</button>
							</li>
						))}
					</ul>
				</nav>

				<div>
					<ul className="divide-y divide-line border-y border-line">
						{items.map((item) => (
							<li key={item.question}>
								<details className="group py-5">
									<summary className="flex cursor-pointer items-start justify-between gap-4 text-base font-semibold marker:content-none">
										{item.question}
										<span className="mt-0.5 shrink-0 text-brass-deep transition-transform group-open:rotate-45">
											＋
										</span>
									</summary>
									<p className="mt-3 max-w-3xl text-sm leading-relaxed text-espresso-soft">
										{item.answer}
									</p>
								</details>
							</li>
						))}
					</ul>

					<div className="mt-10 rounded-xl border border-line bg-paper p-6">
						<h2 className="text-lg font-semibold">Não achou sua resposta?</h2>
						<p className="mt-2 text-sm text-espresso-soft">
							Chame no WhatsApp com o nome do perfume que você está considerando — a gente diz na hora
							se é o perfil que você procura.
						</p>
						<div className="mt-5 flex flex-wrap gap-3">
							<a
								href={COMPANY.whatsappLink.value}
								className="inline-flex min-h-12 items-center gap-2 rounded-full bg-espresso px-6 text-sm font-semibold text-bone"
							>
								<MessageCircle className="size-4" aria-hidden />
								Falar no WhatsApp
							</a>
							<Link
								to="/trocas-e-devolucoes"
								className="inline-flex min-h-12 items-center rounded-full border border-espresso/25 px-6 text-sm font-semibold"
							>
								Política de trocas
							</Link>
							<Link
								to="/prazos-e-entregas"
								className="inline-flex min-h-12 items-center rounded-full border border-espresso/25 px-6 text-sm font-semibold"
							>
								Prazos e entregas
							</Link>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
