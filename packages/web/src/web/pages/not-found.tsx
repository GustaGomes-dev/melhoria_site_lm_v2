import { Link } from "wouter";
import { useSeo } from "../components/site/seo";
import { Eyebrow } from "../components/ui/bits";

export default function NotFoundPage() {
	useSeo({ title: "Página não encontrada — LM Importados" });
	return (
		<div className="container-lm py-24">
			<div className="mx-auto max-w-lg text-center">
				<Eyebrow>Erro 404</Eyebrow>
				<h1 className="display-hero mt-3">Nada aqui.</h1>
				<p className="mt-4 text-espresso-soft">
					O endereço não existe ou o produto saiu do catálogo. Comece pelo catálogo completo, ou deixe o
					quiz escolher para você.
				</p>
				<div className="mt-8 flex flex-wrap justify-center gap-3">
					<Link
						to="/perfumes-arabes"
						className="inline-flex min-h-13 items-center rounded-full bg-espresso px-6 text-sm font-semibold text-bone"
					>
						Ver os 212 perfumes
					</Link>
					<Link
						to="/quiz"
						className="inline-flex min-h-13 items-center rounded-full border border-espresso/25 px-6 text-sm font-semibold"
					>
						Fazer o quiz olfativo
					</Link>
				</div>
			</div>
		</div>
	);
}
