import { AnimatePresence, motion } from "motion/react";
import { BookmarkPlus, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useCart } from "../../lib/cart";
import { useCaptureLead } from "../../queries/leads";

/**
 * Recuperação de sacola. Aparece quando a pessoa tem itens na sacola e está
 * saindo (mouse pra fora, ou 45s de inatividade), oferecendo guardar a sacola
 * por e-mail ou WhatsApp. Só aparece uma vez por sessão e nunca no checkout.
 */
export function CartRecovery({ disabled }: { disabled?: boolean }) {
	const cart = useCart();
	const capture = useCaptureLead();
	const [visible, setVisible] = useState(false);
	const [dismissed, setDismissed] = useState(false);
	const [contact, setContact] = useState("");

	const eligible = !disabled && !dismissed && !cart.leadCaptured && cart.lines.length > 0;

	useEffect(() => {
		if (!eligible) return;
		let timer: ReturnType<typeof setTimeout>;

		function show() {
			setVisible(true);
		}
		function onLeave(event: MouseEvent) {
			if (event.clientY <= 0) show();
		}

		timer = setTimeout(show, 45_000);
		document.addEventListener("mouseleave", onLeave);
		return () => {
			clearTimeout(timer);
			document.removeEventListener("mouseleave", onLeave);
		};
	}, [eligible]);

	function close() {
		setVisible(false);
		setDismissed(true);
	}

	function submit(event: React.FormEvent) {
		event.preventDefault();
		const value = contact.trim();
		if (!value) return;
		const isEmail = value.includes("@");
		capture.mutate(
			{
				source: "cart",
				email: isEmail ? value : undefined,
				whatsapp: isEmail ? undefined : value,
				productSlugs: cart.lines.map((l) => l.slug),
				payload: { lines: cart.lines },
			},
			{
				onSuccess: (data) => {
					if (data.ok) cart.markLeadCaptured();
				},
			},
		);
	}

	const done = capture.isSuccess && capture.data?.ok;

	return (
		<AnimatePresence>
			{eligible && visible ? (
				<motion.div
					initial={{ y: 120, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					exit={{ y: 120, opacity: 0 }}
					transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
					role="dialog"
					aria-label="Guardar sua sacola"
					className="fixed inset-x-3 bottom-3 z-40 rounded-xl border border-line bg-paper p-4 shadow-warm-lg sm:right-5 sm:left-auto sm:w-[400px]"
				>
					<button
						type="button"
						onClick={close}
						aria-label="Fechar"
						className="absolute top-2 right-2 flex size-9 items-center justify-center rounded-full text-espresso-mute hover:bg-espresso/5"
					>
						<X className="size-4" />
					</button>
					{done ? (
						<p className="pr-8 text-sm">
							Guardado. Se você fechar a página, mandamos o link da sua sacola com os itens intactos.
						</p>
					) : (
						<>
							<div className="flex items-start gap-3 pr-8">
								<BookmarkPlus className="mt-0.5 size-5 shrink-0 text-brass-deep" aria-hidden />
								<div>
									<p className="text-sm font-semibold">Guardo sua sacola pra depois?</p>
									<p className="mt-1 text-xs text-espresso-mute">
										Mandamos o link com os itens salvos e avisamos se algum sair de estoque. Sem
										spam.
									</p>
								</div>
							</div>
							<form onSubmit={submit} className="mt-3 flex flex-col gap-2 sm:flex-row">
								<label htmlFor="recovery-contact" className="sr-only">
									E-mail ou WhatsApp
								</label>
								<input
									id="recovery-contact"
									value={contact}
									onChange={(e) => setContact(e.target.value)}
									placeholder="E-mail ou WhatsApp"
									className="h-11 flex-1 rounded-full border border-line bg-bone px-4 text-sm outline-none"
								/>
								<button
									type="submit"
									disabled={capture.isPending}
									className="h-11 rounded-full bg-espresso px-5 text-sm font-semibold text-bone disabled:opacity-60"
								>
									{capture.isPending ? "Salvando…" : "Guardar"}
								</button>
							</form>
							{capture.isSuccess && !capture.data?.ok ? (
								<p className="mt-2 text-xs text-berry">{capture.data?.message}</p>
							) : null}
						</>
					)}
				</motion.div>
			) : null}
		</AnimatePresence>
	);
}
