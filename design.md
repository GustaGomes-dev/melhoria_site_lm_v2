# LM Importados — Design System

Loja de perfumaria árabe. O ativo único da marca é o **comparativo olfativo** (% de similaridade com um perfume de grife). Todo o design existe para colocar esse comparativo no centro, e para provar que existe uma empresa real por trás.

## Princípios

1. **Editorial, não e-commerce de dourado.** O mercado de perfume árabe no Brasil é todo preto + dourado + serifada. Fugimos disso com base clara (osso), tinta espresso e latão fosco como acento — luxo por respiro e tipografia, não por brilho.
2. **O comparativo tem cor própria.** Verde-fumo (`--emerald`) é usado *exclusivamente* nos elementos de similaridade. Quando o usuário vê verde-fumo, ele sabe que está vendo o diferencial da loja. Nunca usar verde-fumo para botão comum, link ou aviso.
3. **Concreto sempre.** Número específico, nome próprio, sensação física. Nunca "fragrância sofisticada que eleva sua experiência".
4. **Confiança é estrutura, não selo.** CNPJ, políticas, avaliações com nome e cidade, garantia — em componentes reais, repetidos nos pontos de decisão (home, produto, sacola, checkout).

## Cor

Tokens em `styles.css` via `@theme`.

| Token | Hex | Uso |
| --- | --- | --- |
| `--color-bone` | `#F5F0E8` | Fundo padrão da página |
| `--color-bone-deep` | `#EBE3D7` | Fundo de seção alternada, inputs |
| `--color-paper` | `#FFFDFA` | Cards, superfícies elevadas |
| `--color-espresso` | `#151210` | Texto principal, faixas escuras, rodapé |
| `--color-espresso-soft` | `#4A423C` | Texto secundário |
| `--color-espresso-mute` | `#857A70` | Texto terciário, legendas |
| `--color-brass` | `#B8862F` | Acento primário: CTA, preço, links |
| `--color-brass-deep` | `#8E6620` | Hover de CTA, texto sobre claro |
| `--color-brass-wash` | `#F3E7CE` | Fundo de badge/pill de acento |
| `--color-emerald` | `#1E4B45` | **Só comparativo olfativo** |
| `--color-emerald-wash` | `#DDE9E5` | Fundo dos blocos de comparativo |
| `--color-line` | `#DDD3C4` | Bordas, divisores |
| `--color-berry` | `#8C2F22` | Erro, urgência (usar pouco) |

Sem gradiente roxo. Sem sombra colorida. Sombras são baixas e quentes: `0 1px 2px rgb(21 18 16 / 0.05)`.

## Tipografia

- **Display: Fraunces** (variable, `opsz` alto, peso 500–700). Títulos, preços grandes, números de similaridade. `letter-spacing: -0.02em` em tamanhos grandes.
- **Corpo: Manrope** (400/500/600/700). Texto, UI, labels.
- **Eyebrow/label**: Manrope 600, `text-[11px]`, `tracking-[0.18em]`, uppercase, cor `espresso-mute`.
- Escala: hero `clamp(2.6rem, 6vw, 5rem)` · h2 `clamp(1.9rem, 3.4vw, 2.9rem)` · h3 `1.35rem` · corpo `1rem/1.65` · small `0.875rem`.
- Ambas via Google Fonts com `display=swap`. Nunca Inter, Roboto, Space Grotesk.

## Layout

- Container: `max-w-[1240px]`, padding `px-5 sm:px-8`.
- Grid editorial assimétrico: hero em 12 colunas com texto em 5–6 e imagem sangrando à direita. Seções alternam alinhamento para não virar pilha de cards centralizados.
- Ritmo vertical: seções `py-16 sm:py-24`. Respiro generoso; densidade só no catálogo (que precisa mostrar produto).
- Raio: `rounded-none` para faixas, `rounded-xl` (12px) para cards, `rounded-full` para pills e botões primários. Nunca `rounded-3xl` em tudo.
- Cards de produto: **sem sombra**, borda `--color-line` de 1px, hover eleva 2px e escurece a borda. Imagem em `aspect-[4/5]` com fundo `bone-deep`.

## Componentes-chave

- **SimilarityMeter** — arco/barra com o % em Fraunces sobre `emerald-wash`, os dois frascos lado a lado, facetas como pills. Aparece no card (compacto), no produto (completo) e no quiz.
- **Card sem comparativo** — os 108 produtos sem % recebem variante que destaca família olfativa + notas, para não parecer card quebrado.
- **TrustStrip** — 4 itens (original lacrado + NF · troca 30 dias · postado em 24h · Pix 5% off). Abaixo do hero e acima do rodapé.
- **StatBars** — fixação e projeção em 5 blocos preenchidos, ocasião em pills. Página de produto.
- **FreeShippingBar** — progresso "faltam R$ X para frete grátis" (limite R$ 349). Sacola e drawer.
- **PriceBlock** — SEMPRE dois valores rotulados: `Total no Pix (5% off)` em destaque + `no cartão: R$ X em até 10x de R$ Y`. Nunca dois números grandes sem rótulo (era o bug do site atual).
- **CheckoutSteps** — `1 Sacola › 2 Seus dados › 3 Pagamento`. Cabeçalho enxuto no checkout: logo + cadeado + voltar. Sem busca, sem menu, sem WhatsApp flutuante.
- **PlaceholderMark** — dado a substituir (CNPJ, endereço, depoimento de exemplo) recebe `data-placeholder` com fundo `brass-wash` e borda tracejada, para o dono achar rápido.

## Motion

Uma orquestração por página com `motion/react`: reveals escalonados (`opacity 0→1`, `y 12→0`, stagger 60 ms) no carregamento. Hover de card e drawer da sacola com transição de 150–200 ms. Nada de parallax, nada de contador animado.

## UX — regras não negociáveis

1. Nunca anunciar cupom sem campo de cupom funcionando.
2. Todo total tem rótulo dizendo qual forma de pagamento.
3. O resumo do pedido está visível em todas as etapas do checkout.
4. Prazo de entrega sempre como **data** ("chega quinta, 27/08"), nunca só faixa de dias.
5. Toda página de produto responde: quanto dura, quanto projeta, para qual ocasião, o que vem na caixa, e o que acontece se não gostar.
6. Conteúdo de demonstração (avaliações, contagem de vendas, horas de fixação) é marcado visivelmente como exemplo.

## Acessibilidade

Contraste mínimo 4.5:1 no texto (`espresso` sobre `bone` = 14:1; `brass-deep` sobre `bone` = 4.6:1 — nunca usar `brass` puro para texto pequeno sobre claro). Foco visível com anel `brass`. Alvos de toque ≥ 44px. Todo campo com `<label>`.
