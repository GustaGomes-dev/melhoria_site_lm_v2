import { useEffect } from "react";

function setMeta(selector: string, attr: string, value: string) {
	let el = document.head.querySelector<HTMLMetaElement>(selector);
	if (!el) {
		el = document.createElement("meta");
		const [, name] = selector.match(/\[(?:name|property)="(.+)"\]/) ?? [];
		if (selector.includes("property")) el.setAttribute("property", name ?? "");
		else el.setAttribute("name", name ?? "");
		document.head.appendChild(el);
	}
	el.setAttribute(attr, value);
}

/** Título e descrição por página, e canonical. */
export function useSeo({ title, description }: { title: string; description?: string }) {
	useEffect(() => {
		document.title = title;
		if (description) {
			setMeta('meta[name="description"]', "content", description);
			setMeta('meta[property="og:description"]', "content", description);
		}
		setMeta('meta[property="og:title"]', "content", title);

		let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
		if (!link) {
			link = document.createElement("link");
			link.rel = "canonical";
			document.head.appendChild(link);
		}
		link.href = window.location.origin + window.location.pathname;
	}, [title, description]);
}

/** JSON-LD injetado no head e removido ao sair da página. */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
	useEffect(() => {
		const script = document.createElement("script");
		script.type = "application/ld+json";
		script.textContent = JSON.stringify(data);
		document.head.appendChild(script);
		return () => {
			script.remove();
		};
	}, [data]);
	return null;
}
