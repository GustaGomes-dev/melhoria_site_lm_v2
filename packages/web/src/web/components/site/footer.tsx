import { Instagram, Mail, MessageCircle } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";
import { COMPANY, FOOTER_LINKS, STORE_FACTS } from "../../content/site";
import { useCaptureLead } from "../../queries/leads";
import { PlaceholderMark } from "../ui/bits";

function Ph({ value, placeholder }: { value: string; placeholder: boolean }) {
	return placeholder ? <PlaceholderMark>{value}</PlaceholderMark> : <>{value}</>;
}

function NewsletterForm() {
	const [email, setEmail] = useState("");
	const capture = useCaptureLead();

	if (capture.isSuccess && capture.data?.ok) {
		return (
			<p className="rounded-lg border border-brass/30 bg-brass-wash/20 px-4 py-3 text-sm text-bone">
				Pronto. Você recebe as novidades e os lançamentos antes de todo mundo.
			</p>
		);
	}

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				if (!email.trim()) return;
				capture.mutate({ source: "newsletter", email: email.trim() });
			}}
			className="space-y-2"
		>
			<label htmlFor="newsletter-email" className="block text-sm text-bone/70">
				Lançamentos e restock por e-mail. Sem spam.
			</label>
			<div className="flex flex-col gap-2 sm:flex-row">
				<input
					id="newsletter-email"
					type="email"
					required
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					placeholder="seu@email.com"
					className="h-12 flex-1 rounded-full border border-bone/25 bg-transparent px-4 text-sm text-bone outline-none placeholder:text-bone/40 focus-visible:border-brass"
				/>
				<button
					type="submit"
					disabled={capture.isPending}
					className="h-12 rounded-full bg-brass px-6 text-sm font-semibold text-espresso transition-colors hover:bg-bone disabled:opacity-60"
				>
					{capture.isPending ? "Enviando…" : "Quero receber"}
				</button>
			</div>
			{capture.isSuccess && !capture.data?.ok ? (
				<p className="text-sm text-brass">{capture.data?.message}</p>
			) : null}
			{capture.isError ? (
				<p className="text-sm text-brass">Confira o e-mail digitado e tente de novo.</p>
			) : null}
		</form>
	);
}

export function SiteFooter() {
	return (
		<footer className="mt-20 bg-espresso text-bone">
			<div className="container-lm grid gap-12 py-16 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
				<div className="space-y-5">
					<p className="font-display text-2xl leading-none font-semibold">
						LM<span className="text-brass"> Importados</span>
					</p>
					<p className="max-w-sm text-sm leading-relaxed text-bone/70">
						{STORE_FACTS.catalogSize} perfumes árabes originais, {STORE_FACTS.withComparison} deles com
						comparativo olfativo avaliado na pele. Importação própria, nota fiscal em todo pedido.
					</p>
					<NewsletterForm />
					<div className="flex flex-wrap gap-3 pt-2">
						<a
							href={COMPANY.whatsappLink.value}
							className="inline-flex min-h-11 items-center gap-2 rounded-full border border-bone/25 px-4 text-sm hover:border-brass hover:text-brass"
						>
							<MessageCircle className="size-4" aria-hidden />
							WhatsApp
						</a>
						<a
							href={COMPANY.instagramLink.value}
							className="inline-flex min-h-11 items-center gap-2 rounded-full border border-bone/25 px-4 text-sm hover:border-brass hover:text-brass"
						>
							<Instagram className="size-4" aria-hidden />
							<Ph {...COMPANY.instagram} />
						</a>
					</div>
				</div>

				{(
					[
						["Loja", FOOTER_LINKS.loja],
						["Ajuda", FOOTER_LINKS.ajuda],
						["Empresa", FOOTER_LINKS.empresa],
					] as const
				).map(([title, links]) => (
					<nav key={title} aria-label={title}>
						<p className="text-[11px] font-semibold tracking-[0.18em] text-bone/45 uppercase">{title}</p>
						<ul className="mt-4 space-y-3">
							{links.map((link) => (
								<li key={link.href}>
									<Link to={link.href} className="text-sm text-bone/75 hover:text-brass">
										{link.label}
									</Link>
								</li>
							))}
						</ul>
					</nav>
				))}
			</div>

			<div className="border-t border-bone/12">
				<div className="container-lm space-y-4 py-8 text-xs leading-relaxed text-bone/55">
					<div className="flex flex-wrap gap-x-6 gap-y-2">
						<span>
							<Ph {...COMPANY.legalName} />
						</span>
						<span>
							CNPJ <Ph {...COMPANY.cnpj} />
						</span>
						<span>
							<Ph {...COMPANY.address} /> — <Ph {...COMPANY.cityState} />, CEP{" "}
							<Ph {...COMPANY.zip} />
						</span>
					</div>
					<div className="flex flex-wrap gap-x-6 gap-y-2">
						<span className="inline-flex items-center gap-1.5">
							<Mail className="size-3.5" aria-hidden />
							<Ph {...COMPANY.email} />
						</span>
						<span className="inline-flex items-center gap-1.5">
							<MessageCircle className="size-3.5" aria-hidden />
							<Ph {...COMPANY.whatsapp} />
						</span>
						<span>{COMPANY.hours.value}</span>
					</div>
					<p className="border-t border-bone/10 pt-4">
						Os nomes e marcas de perfumes de grife citados no comparativo olfativo pertencem aos seus
						respectivos titulares. A LM Importados não é representante dessas marcas — a menção serve
						apenas como referência de perfil de cheiro. Imagens ilustrativas.
					</p>
					<p className="text-bone/40">
						Os campos destacados acima são dados de exemplo e precisam ser substituídos pelas informações
						reais da empresa antes de publicar a loja.
					</p>
				</div>
			</div>
		</footer>
	);
}
