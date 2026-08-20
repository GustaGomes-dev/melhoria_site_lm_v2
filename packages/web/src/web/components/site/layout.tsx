import { useEffect } from "react";
import { useLocation } from "wouter";
import { CartDrawer } from "./cart-drawer";
import { CartRecovery } from "./cart-recovery";
import { SiteFooter } from "./footer";
import { CheckoutHeader, SiteHeader } from "./header";

/** Sobe a página a cada troca de rota (Wouter não faz isso sozinho). */
function useScrollTop() {
	const [location] = useLocation();
	useEffect(() => {
		window.scrollTo({ top: 0, behavior: "instant" });
	}, [location]);
}

export function SiteLayout({ children }: { children: React.ReactNode }) {
	const [location] = useLocation();
	useScrollTop();
	const isCheckout = location.startsWith("/checkout");

	if (isCheckout) {
		return (
			<div className="flex min-h-dvh flex-col bg-bone">
				<CheckoutHeader />
				<main className="flex-1">{children}</main>
				<footer className="border-t border-line py-6">
					<div className="container-lm flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-espresso-mute">
						<span>Compra 100% protegida</span>
						<span>Nota fiscal em todo pedido</span>
						<span>30 dias para devolver</span>
					</div>
				</footer>
			</div>
		);
	}

	return (
		<div className="flex min-h-dvh flex-col bg-bone">
			<a
				href="#conteudo"
				className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-full focus:bg-espresso focus:px-4 focus:py-2 focus:text-sm focus:text-bone"
			>
				Ir para o conteúdo
			</a>
			<SiteHeader />
			<main id="conteudo" className="flex-1">
				{children}
			</main>
			<SiteFooter />
			<CartDrawer />
			<CartRecovery />
		</div>
	);
}
