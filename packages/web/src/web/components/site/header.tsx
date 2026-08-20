import { Menu, Search, ShoppingBag, Sparkles, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { NAV_LINKS, STORE_FACTS } from "../../content/site";
import { useCart } from "../../lib/cart";
import { track } from "../../lib/track";
import { cn } from "../../lib/utils";

function Logo({ className }: { className?: string }) {
	return (
		<Link to="/" className={cn("flex items-baseline gap-2", className)} aria-label="LM Importados, página inicial">
			<span className="font-display text-[22px] leading-none font-semibold tracking-[-0.03em] whitespace-nowrap">
				LM<span className="text-brass"> Importados</span>
			</span>
		</Link>
	);
}

export function AnnouncementBar() {
	return (
		<div className="bg-espresso text-bone">
			<div className="container-lm flex flex-wrap items-center justify-center gap-x-6 gap-y-1 py-2 text-center text-[12px]">
				<span>
					Frete grátis acima de <strong className="font-semibold">{STORE_FACTS.freeShippingFrom}</strong>
				</span>
				<span className="hidden text-bone/40 sm:inline">·</span>
				<span>
					<strong className="font-semibold text-brass">{STORE_FACTS.pixDiscount} off</strong> no Pix
				</span>
				<span className="hidden text-bone/40 sm:inline">·</span>
				<span>{STORE_FACTS.returnDays} dias para devolver, mesmo aberto</span>
			</div>
		</div>
	);
}

export function SiteHeader() {
	const [open, setOpen] = useState(false);
	const [query, setQuery] = useState("");
	const [searchOpen, setSearchOpen] = useState(false);
	const { itemCount, openDrawer } = useCart();
	const [location, navigate] = useLocation();

	useEffect(() => {
		setOpen(false);
		setSearchOpen(false);
	}, [location]);

	function submitSearch(event: React.FormEvent) {
		event.preventDefault();
		const term = query.trim();
		if (!term) return;
		track.search(term);
		navigate(`/perfumes-arabes?busca=${encodeURIComponent(term)}`);
		setQuery("");
	}

	return (
		<>
			<AnnouncementBar />
			<header className="sticky top-0 z-40 border-b border-line bg-bone/95 backdrop-blur-sm">
				<div className="container-lm flex h-16 items-center justify-between gap-4">
					<div className="flex items-center gap-3">
						<button
							type="button"
							onClick={() => setOpen((v) => !v)}
							aria-label={open ? "Fechar menu" : "Abrir menu"}
							aria-expanded={open}
							className="-ml-2 flex size-11 items-center justify-center rounded-full xl:hidden"
						>
							{open ? <X className="size-5" /> : <Menu className="size-5" />}
						</button>
						<Logo />
					</div>

					<nav aria-label="Navegação principal" className="hidden items-center gap-5 xl:flex">
						{NAV_LINKS.map((link) => (
							<Link
								key={link.href}
								to={link.href}
								className="text-sm font-medium whitespace-nowrap text-espresso-soft transition-colors hover:text-espresso"
							>
								{link.label}
							</Link>
						))}
					</nav>

					<div className="flex items-center gap-1">
						<form onSubmit={submitSearch} className="hidden items-center xl:flex">
							<label htmlFor="busca-header" className="sr-only">
								Buscar perfume
							</label>
							<div className="flex h-10 items-center gap-2 rounded-full border border-line bg-paper px-3">
								<Search className="size-4 text-espresso-mute" aria-hidden />
								<input
									id="busca-header"
									value={query}
									onChange={(e) => setQuery(e.target.value)}
									placeholder="Buscar marca, nome ou grife"
									className="w-44 bg-transparent text-sm outline-none placeholder:text-espresso-mute xl:w-56"
								/>
							</div>
						</form>
						<button
							type="button"
							onClick={() => setSearchOpen((v) => !v)}
							aria-label="Buscar"
							className="flex size-11 items-center justify-center rounded-full xl:hidden"
						>
							<Search className="size-5" />
						</button>
						<Link
							to="/quiz"
							className="hidden h-10 items-center gap-1.5 rounded-full bg-brass px-4 text-sm font-semibold whitespace-nowrap text-espresso transition-colors hover:bg-brass-deep hover:text-bone sm:flex"
						>
							<Sparkles className="size-4" aria-hidden />
							Quiz olfativo
						</Link>
						<button
							type="button"
							onClick={openDrawer}
							aria-label={`Abrir sacola, ${itemCount} ${itemCount === 1 ? "item" : "itens"}`}
							className="relative flex size-11 items-center justify-center rounded-full"
						>
							<ShoppingBag className="size-5" />
							{itemCount > 0 ? (
								<span className="absolute top-1 right-0.5 flex min-w-[18px] items-center justify-center rounded-full bg-espresso px-1 text-[10px] font-semibold text-bone">
									{itemCount}
								</span>
							) : null}
						</button>
					</div>
				</div>

				{searchOpen ? (
					<div className="border-t border-line bg-paper px-5 py-3 xl:hidden">
						<form onSubmit={submitSearch} className="flex items-center gap-2">
							<label htmlFor="busca-mobile" className="sr-only">
								Buscar perfume
							</label>
							<input
								id="busca-mobile"
								value={query}
								onChange={(e) => setQuery(e.target.value)}
								autoFocus
								placeholder="Buscar marca, nome ou grife"
								className="h-11 flex-1 rounded-full border border-line bg-bone px-4 text-sm outline-none"
							/>
							<button
								type="submit"
								className="h-11 rounded-full bg-espresso px-4 text-sm font-semibold text-bone"
							>
								Buscar
							</button>
						</form>
					</div>
				) : null}

				{open ? (
					<div className="border-t border-line bg-paper xl:hidden">
						<nav aria-label="Navegação" className="container-lm flex flex-col py-2">
							{NAV_LINKS.map((link) => (
								<Link
									key={link.href}
									to={link.href}
									className="flex min-h-12 items-center border-b border-line/60 text-sm font-medium last:border-0"
								>
									{link.label}
								</Link>
							))}
							<Link
								to="/faq"
								className="flex min-h-12 items-center text-sm font-medium text-espresso-soft"
							>
								Perguntas frequentes
							</Link>
						</nav>
					</div>
				) : null}
			</header>
		</>
	);
}

/** Cabeçalho enxuto do checkout: sem busca, sem menu, sem distração. */
export function CheckoutHeader() {
	return (
		<header className="border-b border-line bg-bone">
			<div className="container-lm flex h-16 items-center justify-between">
				<Logo />
				<div className="flex items-center gap-2 text-xs text-espresso-mute">
					<span className="inline-flex items-center gap-1.5">
						<svg aria-hidden viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8">
							<rect x="4" y="10" width="16" height="10" rx="2" />
							<path d="M8 10V7a4 4 0 0 1 8 0v3" />
						</svg>
						Compra protegida
					</span>
				</div>
			</div>
		</header>
	);
}
