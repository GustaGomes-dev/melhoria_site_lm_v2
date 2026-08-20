/** Formatação em pt-BR. Uma fonte só, para nunca divergir entre telas. */

export function brl(cents: number): string {
	return (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

/** Aceita reais (número do catálogo) e devolve moeda. */
export function brlFromReais(value: number): string {
	return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function cents(value: number): number {
	return Math.round(value * 100);
}

const WEEKDAYS = ["domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sábado"];

/** "quinta, 27/08" — prazo sempre como data concreta, nunca faixa de dias. */
export function deliveryDate(iso: string | Date): string {
	const date = typeof iso === "string" ? new Date(iso) : iso;
	const day = String(date.getDate()).padStart(2, "0");
	const month = String(date.getMonth() + 1).padStart(2, "0");
	return `${WEEKDAYS[date.getDay()]}, ${day}/${month}`;
}

export function fullDate(iso: string | Date): string {
	const date = typeof iso === "string" ? new Date(iso) : iso;
	return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
}

export function installmentLabel(count: number, valueCents: number): string {
	return `${count}x de ${brl(valueCents)} sem juros`;
}

export function pluralize(count: number, singular: string, plural: string): string {
	return `${count} ${count === 1 ? singular : plural}`;
}
