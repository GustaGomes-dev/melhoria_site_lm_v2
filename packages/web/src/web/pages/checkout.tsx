import { ArrowLeft, Check, CreditCard, FileText, Loader2, Lock, QrCode, Truck } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { useSeo } from "../components/site/seo";
import { LmButton } from "../components/ui/bits";
import { useCart } from "../lib/cart";
import { brl, deliveryDate } from "../lib/format";
import { track } from "../lib/track";
import { cn } from "../lib/utils";
import { usePlaceOrder, useQuote, useStoreRules } from "../queries/checkout";

type Step = 2 | 3;
type Payment = "pix" | "card" | "boleto";
type Shipping = "standard" | "express";

interface AddressForm {
	customerName: string;
	email: string;
	whatsapp: string;
	document: string;
	zip: string;
	street: string;
	number: string;
	complement: string;
	district: string;
	city: string;
	state: string;
}

const EMPTY_ADDRESS: AddressForm = {
	customerName: "",
	email: "",
	whatsapp: "",
	document: "",
	zip: "",
	street: "",
	number: "",
	complement: "",
	district: "",
	city: "",
	state: "",
};

function Field({
	id,
	label,
	value,
	onChange,
	type = "text",
	placeholder,
	required = true,
	hint,
	error,
	className,
	inputMode,
	maxLength,
	onBlur,
}: {
	id: string;
	label: string;
	value: string;
	onChange: (value: string) => void;
	type?: string;
	placeholder?: string;
	required?: boolean;
	hint?: string;
	error?: string;
	className?: string;
	inputMode?: "text" | "numeric" | "tel" | "email";
	maxLength?: number;
	onBlur?: () => void;
}) {
	return (
		<div className={className}>
			<label htmlFor={id} className="block text-sm font-medium">
				{label}
				{!required ? <span className="ml-1 text-espresso-mute">(opcional)</span> : null}
			</label>
			<input
				id={id}
				type={type}
				value={value}
				required={required}
				placeholder={placeholder}
				inputMode={inputMode}
				maxLength={maxLength}
				onBlur={onBlur}
				onChange={(e) => onChange(e.target.value)}
				aria-invalid={error ? true : undefined}
				aria-describedby={error ? `${id}-erro` : hint ? `${id}-dica` : undefined}
				className={cn(
					"mt-1.5 h-12 w-full rounded-lg border bg-bone px-3 text-sm outline-none focus-visible:border-brass",
					error ? "border-berry" : "border-line",
				)}
			/>
			{error ? (
				<p id={`${id}-erro`} className="mt-1 text-xs text-berry">
					{error}
				</p>
			) : hint ? (
				<p id={`${id}-dica`} className="mt-1 text-xs text-espresso-mute">
					{hint}
				</p>
			) : null}
		</div>
	);
}

const PAYMENTS: { id: Payment; label: string; icon: typeof QrCode; detail: string }[] = [
	{ id: "pix", label: "Pix", icon: QrCode, detail: "5% de desconto e aprovação na hora" },
	{ id: "card", label: "Cartão de crédito", icon: CreditCard, detail: "até 10x sem juros" },
	{ id: "boleto", label: "Boleto bancário", icon: FileText, detail: "compensa em 1 a 2 dias úteis" },
];

export default function CheckoutPage() {
	useSeo({ title: "Finalizar compra — LM Importados" });
	const cart = useCart();
	const rules = useStoreRules();
	const placeOrder = usePlaceOrder();
	const [, navigate] = useLocation();

	const [step, setStep] = useState<Step>(2);
	const [address, setAddress] = useState<AddressForm>(EMPTY_ADDRESS);
	const [errors, setErrors] = useState<Partial<Record<keyof AddressForm, string>>>({});
	const [shippingMethod, setShippingMethod] = useState<Shipping>("standard");
	const [payment, setPayment] = useState<Payment>("pix");
	const [installments, setInstallments] = useState(10);
	const [zipLoading, setZipLoading] = useState(false);
	const [summaryOpen, setSummaryOpen] = useState(false);

	const quote = useQuote({
		lines: cart.lines,
		couponCode: cart.couponCode,
		shippingMethod,
		paymentMethod: payment,
	});
	const data = quote.data;

	useEffect(() => {
		if (cart.hydrated && cart.lines.length === 0 && !placeOrder.isSuccess) navigate("/sacola");
	}, [cart.hydrated, cart.lines.length, placeOrder.isSuccess, navigate]);

	async function lookupZip() {
		const digits = address.zip.replace(/\D/g, "");
		if (digits.length !== 8) return;
		setZipLoading(true);
		try {
			const response = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
			const json = (await response.json()) as {
				erro?: boolean;
				logradouro?: string;
				bairro?: string;
				localidade?: string;
				uf?: string;
			};
			if (!json.erro) {
				setAddress((prev) => ({
					...prev,
					street: json.logradouro || prev.street,
					district: json.bairro || prev.district,
					city: json.localidade || prev.city,
					state: json.uf || prev.state,
				}));
				setErrors((prev) => ({ ...prev, zip: undefined }));
			} else {
				setErrors((prev) => ({ ...prev, zip: "CEP não encontrado. Preencha o endereço manualmente." }));
			}
		} catch {
			setErrors((prev) => ({ ...prev, zip: "Não conseguimos buscar o CEP. Preencha manualmente." }));
		} finally {
			setZipLoading(false);
		}
	}

	function validateAddress(): boolean {
		const next: Partial<Record<keyof AddressForm, string>> = {};
		if (address.customerName.trim().split(" ").length < 2) next.customerName = "Informe nome e sobrenome.";
		if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(address.email)) next.email = "Confira o e-mail digitado.";
		if (address.whatsapp.replace(/\D/g, "").length < 10) next.whatsapp = "Informe o WhatsApp com DDD.";
		if (address.document.replace(/\D/g, "").length !== 11) next.document = "O CPF tem 11 dígitos.";
		if (address.zip.replace(/\D/g, "").length !== 8) next.zip = "O CEP tem 8 dígitos.";
		if (address.street.trim().length < 3) next.street = "Informe a rua.";
		if (!address.number.trim()) next.number = "Informe o número.";
		if (address.district.trim().length < 2) next.district = "Informe o bairro.";
		if (address.city.trim().length < 2) next.city = "Informe a cidade.";
		if (address.state.trim().length !== 2) next.state = "Use a sigla, ex. SP.";
		setErrors(next);
		return Object.keys(next).length === 0;
	}

	function submitOrder() {
		if (!validateAddress()) {
			setStep(2);
			return;
		}
		placeOrder.mutate(
			{
				lines: cart.lines,
				couponCode: cart.couponCode,
				shippingMethod,
				paymentMethod: payment,
				installments: payment === "card" ? installments : 1,
				customerName: address.customerName,
				email: address.email,
				whatsapp: address.whatsapp,
				document: address.document,
				zip: address.zip,
				street: address.street,
				number: address.number,
				complement: address.complement || undefined,
				district: address.district,
				city: address.city,
				state: address.state,
			},
			{
				onSuccess: (order) => {
					if (data) {
						track.purchase(
							order.code,
							data.lines.map((l) => ({
								item_id: l.slug,
								item_name: l.name,
								item_brand: l.brand,
								item_category: l.variantLabel,
								price: l.unitPriceCents / 100,
								quantity: l.quantity,
							})),
							data.totalCents / 100,
							data.shippingCents / 100,
						);
					}
					cart.clear();
					navigate(`/pedido/${order.code}`);
				},
			},
		);
	}

	const summary = data ? (
		<div className="space-y-4">
			<ul className="space-y-3">
				{data.lines.map((line) => (
					<li key={`${line.slug}-${line.variant}`} className="flex gap-3">
						<div className="size-14 shrink-0 overflow-hidden rounded-lg bg-bone-deep">
							{line.image ? (
								<img src={line.image} alt="" className="h-full w-full object-contain p-1" />
							) : null}
						</div>
						<div className="min-w-0 flex-1 text-sm">
							<p className="truncate font-semibold">{line.name}</p>
							<p className="text-xs text-espresso-mute">
								{line.variantLabel} · {line.quantity}x
							</p>
						</div>
						<span className="num-display text-sm font-semibold">{brl(line.lineTotalCents)}</span>
					</li>
				))}
			</ul>

			<div className="space-y-1.5 border-t border-line pt-3 text-sm">
				<div className="flex justify-between text-espresso-soft">
					<span>Subtotal</span>
					<span className="num-display">{brl(data.subtotalCents)}</span>
				</div>
				{data.discountCents > 0 ? (
					<div className="flex justify-between text-brass-deep">
						<span>Cupom {data.coupon?.code}</span>
						<span className="num-display">−{brl(data.discountCents)}</span>
					</div>
				) : null}
				<div className="flex justify-between text-espresso-soft">
					<span>{data.shippingLabel}</span>
					<span className="num-display">
						{data.shippingCents === 0 ? "grátis" : brl(data.shippingCents)}
					</span>
				</div>
			</div>

			<div className="space-y-1 border-t border-line pt-3">
				<div className="flex items-baseline justify-between">
					<span className="text-sm font-semibold">
						{payment === "pix"
							? "Total no Pix (5% off)"
							: payment === "card"
								? "Total no cartão"
								: "Total no boleto"}
					</span>
					<span className="num-display text-2xl font-semibold">{brl(data.totalCents)}</span>
				</div>
				{payment === "pix" ? (
					<p className="text-xs text-espresso-mute">
						No cartão sairia {brl(data.cardTotalCents)} — você economiza{" "}
						{brl(data.cardTotalCents - data.pixTotalCents)} no Pix.
					</p>
				) : payment === "card" ? (
					<p className="text-xs text-espresso-mute">
						{installments}x de {brl(Math.ceil(data.cardTotalCents / installments))} sem juros. No Pix
						sairia {brl(data.pixTotalCents)}.
					</p>
				) : (
					<p className="text-xs text-espresso-mute">
						Pagamento em parcela única. No Pix sairia {brl(data.pixTotalCents)}.
					</p>
				)}
			</div>

			<p className="flex items-start gap-2 rounded-lg bg-bone px-3 py-2.5 text-xs text-espresso-soft">
				<Truck className="mt-0.5 size-3.5 shrink-0 text-brass-deep" aria-hidden />
				<span>
					Entrega prevista para <strong>{deliveryDate(data.deliveryEstimate)}</strong>, contando dias úteis
					a partir da aprovação do pagamento.
				</span>
			</p>
		</div>
	) : (
		<div className="h-48 animate-pulse rounded-lg bg-bone-deep" />
	);

	return (
		<div className="container-lm py-8">
			{/* PASSOS */}
			<ol className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm">
				{[
					{ n: 1, label: "Sacola", done: true },
					{ n: 2, label: "Seus dados", done: step > 2 },
					{ n: 3, label: "Pagamento", done: false },
				].map((item, i) => (
					<li key={item.n} className="flex items-center gap-3">
						{i > 0 ? <span className="text-line">—</span> : null}
						<span
							className={cn(
								"flex items-center gap-2",
								item.n === step ? "font-semibold text-espresso" : "text-espresso-mute",
							)}
						>
							<span
								className={cn(
									"flex size-6 items-center justify-center rounded-full text-xs font-semibold",
									item.n === step
										? "bg-espresso text-bone"
										: item.done
											? "bg-brass text-espresso"
											: "border border-line",
								)}
							>
								{item.done ? <Check className="size-3.5" /> : item.n}
							</span>
							{item.n === 1 ? (
								<Link to="/sacola" className="underline underline-offset-4">
									{item.label}
								</Link>
							) : (
								item.label
							)}
						</span>
					</li>
				))}
			</ol>

			{/* RESUMO MOBILE — sempre acessível, em todas as etapas */}
			<div className="mt-6 rounded-xl border border-line bg-paper lg:hidden">
				<button
					type="button"
					onClick={() => setSummaryOpen((v) => !v)}
					aria-expanded={summaryOpen}
					className="flex min-h-14 w-full items-center justify-between px-4 text-sm font-semibold"
				>
					<span>Resumo do pedido ({data?.itemCount ?? 0} itens)</span>
					<span className="num-display">{data ? brl(data.totalCents) : "—"}</span>
				</button>
				{summaryOpen ? <div className="border-t border-line p-4">{summary}</div> : null}
			</div>

			<div className="mt-6 grid gap-8 lg:grid-cols-[1fr_360px]">
				<div>
					{step === 2 ? (
						<section className="space-y-6">
							<div className="rounded-xl border border-line bg-paper p-5 sm:p-6">
								<h2 className="text-lg font-semibold">Quem vai receber</h2>
								<p className="mt-1 text-sm text-espresso-mute">
									Usamos o WhatsApp só para mandar o rastreio e avisar de qualquer problema no envio.
								</p>
								<div className="mt-5 grid gap-4 sm:grid-cols-2">
									<Field
										id="nome"
										label="Nome completo"
										value={address.customerName}
										onChange={(v) => setAddress({ ...address, customerName: v })}
										error={errors.customerName}
										className="sm:col-span-2"
									/>
									<Field
										id="email"
										label="E-mail"
										type="email"
										inputMode="email"
										value={address.email}
										onChange={(v) => setAddress({ ...address, email: v })}
										error={errors.email}
										hint="Enviamos a nota fiscal e o rastreio aqui."
									/>
									<Field
										id="whatsapp"
										label="WhatsApp com DDD"
										inputMode="tel"
										placeholder="(11) 90000-0000"
										value={address.whatsapp}
										onChange={(v) => setAddress({ ...address, whatsapp: v })}
										error={errors.whatsapp}
									/>
									<Field
										id="cpf"
										label="CPF"
										inputMode="numeric"
										placeholder="000.000.000-00"
										value={address.document}
										onChange={(v) => setAddress({ ...address, document: v })}
										error={errors.document}
										hint="Obrigatório para emitir a nota fiscal."
									/>
								</div>
							</div>

							<div className="rounded-xl border border-line bg-paper p-5 sm:p-6">
								<h2 className="text-lg font-semibold">Endereço de entrega</h2>
								<div className="mt-5 grid gap-4 sm:grid-cols-6">
									<div className="sm:col-span-2">
										<Field
											id="cep"
											label="CEP"
											inputMode="numeric"
											maxLength={9}
											placeholder="00000-000"
											value={address.zip}
											onChange={(v) => setAddress({ ...address, zip: v })}
											onBlur={lookupZip}
											error={errors.zip}
										/>
										{zipLoading ? (
											<p className="mt-1 flex items-center gap-1.5 text-xs text-espresso-mute">
												<Loader2 className="size-3 animate-spin" aria-hidden />
												buscando endereço…
											</p>
										) : null}
									</div>
									<Field
										id="rua"
										label="Rua"
										value={address.street}
										onChange={(v) => setAddress({ ...address, street: v })}
										error={errors.street}
										className="sm:col-span-4"
									/>
									<Field
										id="numero"
										label="Número"
										value={address.number}
										onChange={(v) => setAddress({ ...address, number: v })}
										error={errors.number}
										className="sm:col-span-2"
									/>
									<Field
										id="complemento"
										label="Complemento"
										required={false}
										value={address.complement}
										onChange={(v) => setAddress({ ...address, complement: v })}
										className="sm:col-span-4"
									/>
									<Field
										id="bairro"
										label="Bairro"
										value={address.district}
										onChange={(v) => setAddress({ ...address, district: v })}
										error={errors.district}
										className="sm:col-span-3"
									/>
									<Field
										id="cidade"
										label="Cidade"
										value={address.city}
										onChange={(v) => setAddress({ ...address, city: v })}
										error={errors.city}
										className="sm:col-span-2"
									/>
									<Field
										id="uf"
										label="UF"
										maxLength={2}
										value={address.state}
										onChange={(v) => setAddress({ ...address, state: v.toUpperCase() })}
										error={errors.state}
										className="sm:col-span-1"
									/>
								</div>
							</div>

							<div className="rounded-xl border border-line bg-paper p-5 sm:p-6">
								<h2 className="text-lg font-semibold">Forma de envio</h2>
								<div className="mt-4 space-y-2">
									{rules.data?.shippingMethods.map((method) => (
										<label
											key={method.id}
											className={cn(
												"flex cursor-pointer items-start gap-3 rounded-lg border p-4",
												shippingMethod === method.id
													? "border-espresso bg-bone"
													: "border-line",
											)}
										>
											<input
												type="radio"
												name="envio"
												checked={shippingMethod === method.id}
												onChange={() => {
													setShippingMethod(method.id as Shipping);
													if (data) track.addShippingInfo(data.totalCents / 100, method.id);
												}}
												className="mt-1 size-4 shrink-0 accent-brass-deep"
											/>
											<span className="flex-1">
												<span className="flex flex-wrap items-baseline justify-between gap-2">
													<span className="text-sm font-semibold">{method.label}</span>
													<span className="num-display text-sm font-semibold">
														{method.id === "standard" &&
														data &&
														data.subtotalCents - data.discountCents >=
															(rules.data?.freeShippingThresholdCents ?? 0)
															? "grátis"
															: brl(method.priceCents)}
													</span>
												</span>
												<span className="mt-0.5 block text-xs text-espresso-mute">
													Chega {deliveryDate(method.estimatedDate)} · {method.note}
												</span>
											</span>
										</label>
									))}
								</div>
							</div>

							<div className="flex flex-wrap gap-3">
								<LmButton
									variant="dark"
									size="lg"
									onClick={() => {
										if (validateAddress()) setStep(3);
									}}
								>
									Ir para o pagamento
								</LmButton>
								<Link
									to="/sacola"
									className="inline-flex min-h-14 items-center gap-2 rounded-full px-4 text-sm font-semibold text-espresso-soft"
								>
									<ArrowLeft className="size-4" aria-hidden />
									voltar para a sacola
								</Link>
							</div>
						</section>
					) : (
						<section className="space-y-6">
							<div className="rounded-xl border border-line bg-paper p-5 sm:p-6">
								<div className="flex flex-wrap items-start justify-between gap-3">
									<div className="text-sm">
										<p className="font-semibold">{address.customerName}</p>
										<p className="text-espresso-soft">
											{address.street}, {address.number}
											{address.complement ? ` — ${address.complement}` : ""} · {address.district}
										</p>
										<p className="text-espresso-soft">
											{address.city}/{address.state} · CEP {address.zip}
										</p>
										<p className="mt-1 text-espresso-mute">
											{address.email} · {address.whatsapp}
										</p>
									</div>
									<button
										type="button"
										onClick={() => setStep(2)}
										className="text-sm font-semibold text-brass-deep underline underline-offset-4"
									>
										editar
									</button>
								</div>
							</div>

							<div className="rounded-xl border border-line bg-paper p-5 sm:p-6">
								<h2 className="text-lg font-semibold">Como você quer pagar</h2>
								<div className="mt-4 space-y-2">
									{PAYMENTS.map((option) => (
										<label
											key={option.id}
											className={cn(
												"flex cursor-pointer items-start gap-3 rounded-lg border p-4",
												payment === option.id ? "border-espresso bg-bone" : "border-line",
											)}
										>
											<input
												type="radio"
												name="pagamento"
												checked={payment === option.id}
												onChange={() => {
													setPayment(option.id);
													if (data) track.addPaymentInfo(data.totalCents / 100, option.id);
												}}
												className="mt-1 size-4 shrink-0 accent-brass-deep"
											/>
											<span className="flex-1">
												<span className="flex items-center gap-2 text-sm font-semibold">
													<option.icon className="size-4 text-brass-deep" aria-hidden />
													{option.label}
												</span>
												<span className="mt-0.5 block text-xs text-espresso-mute">
													{option.detail}
												</span>
												{option.id === "card" && payment === "card" ? (
													<span className="mt-3 block">
														<label
															htmlFor="parcelas"
															className="block text-xs font-medium"
														>
															Parcelas
														</label>
														<select
															id="parcelas"
															value={installments}
															onChange={(e) => setInstallments(Number(e.target.value))}
															className="mt-1 h-11 w-full max-w-xs rounded-lg border border-line bg-bone px-3 text-sm"
														>
															{Array.from(
																{ length: data?.installments.count ?? 1 },
																(_, i) => i + 1,
															).map((n) => (
																<option key={n} value={n}>
																	{n}x de{" "}
																	{brl(
																		Math.ceil((data?.cardTotalCents ?? 0) / n),
																	)}{" "}
																	sem juros
																</option>
															))}
														</select>
													</span>
												) : null}
											</span>
										</label>
									))}
								</div>

								<p className="mt-4 flex items-start gap-2 rounded-lg bg-bone px-3 py-2.5 text-xs text-espresso-soft">
									<Lock className="mt-0.5 size-3.5 shrink-0 text-brass-deep" aria-hidden />
									<span>
										Esta é uma loja de demonstração: o pedido é registrado, mas nenhum pagamento
										real é processado e nenhum dado de cartão é solicitado. Conecte seu gateway
										antes de vender de verdade.
									</span>
								</p>
							</div>

							<div className="flex flex-wrap gap-3">
								<LmButton
									variant="primary"
									size="lg"
									disabled={placeOrder.isPending}
									onClick={submitOrder}
								>
									{placeOrder.isPending ? (
										<>
											<Loader2 className="size-4 animate-spin" aria-hidden />
											Registrando pedido…
										</>
									) : (
										`Finalizar — ${data ? brl(data.totalCents) : ""} ${
											payment === "pix" ? "no Pix" : payment === "card" ? "no cartão" : "no boleto"
										}`
									)}
								</LmButton>
								<button
									type="button"
									onClick={() => setStep(2)}
									className="inline-flex min-h-14 items-center gap-2 rounded-full px-4 text-sm font-semibold text-espresso-soft"
								>
									<ArrowLeft className="size-4" aria-hidden />
									voltar
								</button>
							</div>
							{placeOrder.isError ? (
								<p className="text-sm text-berry">
									Não conseguimos registrar o pedido. Revise os dados e tente novamente.
								</p>
							) : null}
						</section>
					)}
				</div>

				{/* RESUMO DESKTOP — visível nas duas etapas */}
				<aside className="hidden lg:block">
					<div className="sticky top-6 rounded-xl border border-line bg-paper p-5">
						<h2 className="mb-4 text-base font-semibold">Resumo do pedido</h2>
						{summary}
					</div>
				</aside>
			</div>
		</div>
	);
}
