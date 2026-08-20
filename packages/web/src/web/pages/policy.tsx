import { AlertTriangle } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useSeo } from "../components/site/seo";
import { Eyebrow } from "../components/ui/bits";
import { getPolicy, POLICIES } from "../content/policies";

export default function PolicyPage() {
	const [location] = useLocation();
	const slug = location.replace(/^\//, "");
	const doc = getPolicy(slug);

	useSeo({
		title: doc ? `${doc.title} — LM Importados` : "Política — LM Importados",
		description: doc?.intro,
	});

	if (!doc) {
		return (
			<div className="container-lm py-20 text-center">
				<h1 className="display-h2">Página não encontrada</h1>
				<Link
					to="/faq"
					className="mt-6 inline-flex min-h-12 items-center rounded-full bg-espresso px-6 text-sm font-semibold text-bone"
				>
					Ir para as perguntas frequentes
				</Link>
			</div>
		);
	}

	return (
		<>
			<section className="border-b border-line bg-bone-deep">
				<div className="container-lm max-w-3xl py-14">
					<Eyebrow>Políticas da loja</Eyebrow>
					<h1 className="display-h2 mt-3">{doc.title}</h1>
					<p className="mt-4 text-espresso-soft">{doc.intro}</p>
					<p className="mt-4 text-xs text-espresso-mute">Última atualização: {doc.updatedAt}</p>
				</div>
			</section>

			<div className="container-lm grid gap-10 py-12 lg:grid-cols-[220px_1fr]">
				<nav aria-label="Outras políticas">
					<ul className="space-y-2 lg:sticky lg:top-24">
						{POLICIES.map((item) => (
							<li key={item.slug}>
								<Link
									to={`/${item.slug}`}
									className={
										item.slug === doc.slug
											? "block rounded-lg border border-espresso bg-espresso px-4 py-3 text-sm font-semibold text-bone"
											: "block rounded-lg border border-line bg-paper px-4 py-3 text-sm hover:border-espresso/40"
									}
								>
									{item.title}
								</Link>
							</li>
						))}
						<li>
							<Link
								to="/faq"
								className="block rounded-lg border border-line bg-paper px-4 py-3 text-sm hover:border-espresso/40"
							>
								Perguntas frequentes
							</Link>
						</li>
					</ul>
				</nav>

				<article className="max-w-3xl">
					{doc.blocks.map((block, i) => (
						<section
							key={block.heading ?? i}
							className={
								block.placeholder
									? "mb-6 rounded-xl border border-dashed border-brass-deep bg-brass-wash/50 p-5"
									: "mb-8"
							}
						>
							{block.heading ? (
								<h2 className="text-xl font-semibold">{block.heading}</h2>
							) : null}
							{block.placeholder ? (
								<p className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.1em] text-brass-deep uppercase">
									<AlertTriangle className="size-3.5" aria-hidden />
									revisar antes de publicar
								</p>
							) : null}
							{block.paragraphs?.map((paragraph) => (
								<p key={paragraph} className="mt-3 leading-relaxed text-espresso-soft">
									{paragraph}
								</p>
							))}
							{block.list ? (
								<ul className="mt-3 space-y-2">
									{block.list.map((item) => (
										<li key={item} className="flex gap-2.5 leading-relaxed text-espresso-soft">
											<span className="mt-2 size-1.5 shrink-0 rounded-full bg-brass" />
											{item}
										</li>
									))}
								</ul>
							) : null}
						</section>
					))}

					<div className="rounded-xl border border-line bg-paper p-5 text-sm text-espresso-soft">
						Dúvida sobre esta política? Fale com o atendimento antes de tomar qualquer decisão — a gente
						resolve por WhatsApp, sem formulário e sem protocolo.
					</div>
				</article>
			</div>
		</>
	);
}
