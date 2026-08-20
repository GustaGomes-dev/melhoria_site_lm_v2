import { CheckCircle2, Copy, MessageCircle, Package, Truck } from "lucide-react";
import { useState } from "react";
import { Link, useLocation, useParams } from "wouter";
import { useSeo } from "../components/site/seo";
import { LmButton } from "../components/ui/bits";
import { COMPANY } from "../content/site";
import { brl, deliveryDate, fullDate } from "../lib/format";
import { useOrder } from "../queries/checkout";

const PAYMENT_LABEL: Record<string, string> = {
	pix: "Pix (5% de desconto)",
	card: "Cartão de crédito",
	boleto: "Boleto bancário",
};

const STATUS_LABEL: Record<string, string> = {
	aguardando_pix: "Aguardando o pagamento do Pix",
	aguardando_pagamento: "Aguardando a confirmação do pagamento",
	pago: "Pagamento confirmado",
	enviado: "Enviado",
	entregue: "Entregue",
};

function LookupForm() {
	const [code, setCode] = useState("");
	const [, navigate] = useLocation();
	return (
		<div className="container-lm py-16">
			<div className="mx-auto max-w-md">
				<h1 className="display-h2">Rastrear meu pedido</h1>
				<p className="mt-3 text-espresso-soft">
					Digite o código que você recebeu no e-mail de confirmação. Ele começa com{" "}
					<strong>LM-</strong>.
				</p>
				<form
					onSubmit={(e) => {
						e.preventDefault();
						if (code.trim()) navigate(`/pedido/${code.trim().toUpperCase()}`);
					}}
					className="mt-6 flex gap-2"
				>
					<label htmlFor="codigo" className="sr-only">
						Código do pedido
					</label>
					<input
						id="codigo"
						value={code}
						onChange={(e) => setCode(e.target.value.toUpperCase())}
						placeholder="LM-XXXXXX"
						className="h-12 flex-1 rounded-lg border border-line bg-paper px-3 text-sm tracking-wide uppercase outline-none"
					/>
					<button type="submit" className="h-12 rounded-lg bg-espresso px-5 text-sm font-semibold text-bone">
						Buscar
					</button>
				</form>
				<p className="mt-4 text-sm text-espresso-mute">
					Perdeu o código? Chame no WhatsApp{" "}
					<a href={COMPANY.whatsappLink.value} className="font-semibold text-brass-deep underline">
						{COMPANY.whatsapp.value}
					</a>{" "}
					com o CPF do pedido.
				</p>
			</div>
		</div>
	);
}

export default function OrderPage() {
	const { code = "" } = useParams<{ code?: string }>();
	const query = useOrder(code);
	const [copied, setCopied] = useState(false);

	useSeo({
		title: code ? `Pedido ${code} — LM Importados` : "Rastrear pedido — LM Importados",
	});

	if (!code) return <LookupForm />;

	if (query.isLoading) {
		return (
			<div className="container-lm py-16">
				<div className="mx-auto h-64 max-w-2xl animate-pulse rounded-xl bg-bone-deep" />
			</div>
		);
	}

	if (query.isError || !query.data) {
		return (
			<div className="container-lm py-16 text-center">
				<h1 className="display-h2">Pedido não encontrado</h1>
				<p className="mx-auto mt-3 max-w-md text-espresso-soft">
					Confira o código: ele tem o formato LM-XXXXXX e vem no e-mail de confirmação.
				</p>
				<Link
					to="/pedido"
					className="mt-6 inline-flex min-h-12 items-center rounded-full bg-espresso px-6 text-sm font-semibold text-bone"
				>
					Tentar outro código
				</Link>
			</div>
		);
	}

	const { order, items } = query.data;

	return (
		<div className="container-lm py-12">
			<div className="mx-auto max-w-3xl">
				<div className="rounded-xl border border-brass-deep/30 bg-brass-wash/40 p-6 sm:p-8">
					<CheckCircle2 className="size-9 text-brass-deep" aria-hidden />
					<h1 className="display-h2 mt-4">Pedido registrado</h1>
					<p className="mt-3 text-espresso-soft">
						{order.customerName.split(" ")[0]}, guardamos tudo. Enviamos a confirmação para{" "}
						<strong>{order.email}</strong> e o rastreio chega no WhatsApp {order.whatsapp} assim que o
						pedido for postado.
					</p>
					<div className="mt-5 flex flex-wrap items-center gap-3">
						<span className="num-display rounded-full border border-espresso/20 bg-paper px-4 py-2 text-sm font-semibold">
							{order.code}
						</span>
						<button
							type="button"
							onClick={() => {
								navigator.clipboard?.writeText(order.code);
								setCopied(true);
							}}
							className="inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-brass-deep underline underline-offset-4"
						>
							<Copy className="size-4" aria-hidden />
							{copied ? "copiado" : "copiar código"}
						</button>
					</div>
				</div>

				<div className="mt-6 grid gap-4 sm:grid-cols-2">
					<div className="rounded-xl border border-line bg-paper p-5">
						<h2 className="flex items-center gap-2 text-sm font-semibold tracking-[0.08em] uppercase">
							<Package className="size-4 text-brass-deep" aria-hidden />
							Situação
						</h2>
						<p className="mt-2 font-semibold">{STATUS_LABEL[order.status] ?? order.status}</p>
						<p className="mt-1 text-sm text-espresso-soft">
							Pagamento: {PAYMENT_LABEL[order.paymentMethod] ?? order.paymentMethod}
							{order.paymentMethod === "card" && order.installments > 1
								? ` em ${order.installments}x`
								: ""}
						</p>
						<p className="mt-1 text-xs text-espresso-mute">
							Pedido feito em {fullDate(order.createdAt)}
						</p>
					</div>
					<div className="rounded-xl border border-line bg-paper p-5">
						<h2 className="flex items-center gap-2 text-sm font-semibold tracking-[0.08em] uppercase">
							<Truck className="size-4 text-brass-deep" aria-hidden />
							Entrega
						</h2>
						<p className="mt-2 font-semibold">{deliveryDate(order.deliveryEstimate)}</p>
						<p className="mt-1 text-sm text-espresso-soft">
							{order.street}, {order.number}
							{order.complement ? ` — ${order.complement}` : ""} · {order.district}
						</p>
						<p className="text-sm text-espresso-soft">
							{order.city}/{order.state} · CEP {order.zip}
						</p>
					</div>
				</div>

				<div className="mt-4 rounded-xl border border-line bg-paper p-5">
					<h2 className="text-sm font-semibold tracking-[0.08em] uppercase">Itens</h2>
					<ul className="mt-4 space-y-3">
						{items.map((item) => (
							<li key={item.id} className="flex gap-3 border-b border-line pb-3 last:border-0 last:pb-0">
								<div className="size-16 shrink-0 overflow-hidden rounded-lg bg-bone-deep">
									{item.image ? (
										<img src={item.image} alt="" className="h-full w-full object-contain p-1" />
									) : null}
								</div>
								<div className="min-w-0 flex-1">
									<p className="text-sm font-semibold">
										<Link to={`/produto/${item.productSlug}`} className="hover:text-brass-deep">
											{item.productName}
										</Link>
									</p>
									<p className="text-xs text-espresso-mute">
										{item.productBrand} · {item.variantLabel} · {item.quantity}x
									</p>
								</div>
								<span className="num-display text-sm font-semibold">
									{brl(item.unitPriceCents * item.quantity)}
								</span>
							</li>
						))}
					</ul>

					<div className="mt-4 space-y-1.5 border-t border-line pt-4 text-sm">
						<div className="flex justify-between text-espresso-soft">
							<span>Subtotal</span>
							<span className="num-display">{brl(order.subtotalCents)}</span>
						</div>
						{order.discountCents > 0 ? (
							<div className="flex justify-between text-brass-deep">
								<span>Cupom {order.couponCode}</span>
								<span className="num-display">−{brl(order.discountCents)}</span>
							</div>
						) : null}
						<div className="flex justify-between text-espresso-soft">
							<span>Frete ({order.shippingMethod === "express" ? "expresso" : "padrão"})</span>
							<span className="num-display">
								{order.shippingCents === 0 ? "grátis" : brl(order.shippingCents)}
							</span>
						</div>
						<div className="flex items-baseline justify-between border-t border-line pt-2">
							<span className="font-semibold">
								Total pago em {PAYMENT_LABEL[order.paymentMethod] ?? order.paymentMethod}
							</span>
							<span className="num-display text-xl font-semibold">{brl(order.totalCents)}</span>
						</div>
					</div>
				</div>

				<div className="mt-6 flex flex-wrap gap-3">
					<a
						href={COMPANY.whatsappLink.value}
						className="inline-flex min-h-12 items-center gap-2 rounded-full bg-espresso px-6 text-sm font-semibold text-bone"
					>
						<MessageCircle className="size-4" aria-hidden />
						Falar com o atendimento
					</a>
					<Link
						to="/perfumes-arabes"
						className="inline-flex min-h-12 items-center rounded-full border border-espresso/25 px-6 text-sm font-semibold"
					>
						Continuar comprando
					</Link>
					<LmButton variant="ghost" onClick={() => window.print()}>
						imprimir pedido
					</LmButton>
				</div>

				<p className="mt-8 rounded-lg border border-dashed border-brass-deep bg-brass-wash px-4 py-3 text-xs text-espresso-soft">
					Loja de demonstração: o pedido foi registrado no banco de dados, mas nenhum pagamento real foi
					processado. Conecte um gateway (Pix e cartão) antes de vender de verdade.
				</p>
			</div>
		</div>
	);
}
