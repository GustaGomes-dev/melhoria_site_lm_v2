import type { RouterClient } from "@orpc/server";
import { createApp } from "./__core/app";
import { checkout } from "./routes/checkout";
import { leads } from "./routes/leads";
import { ping } from "./routes/ping";
import { products } from "./routes/products";
import { quiz } from "./routes/quiz";
import { reviews } from "./routes/reviews";

// API features are oRPC procedures, one file per feature in ./routes/,
// composed into this router — typed end-to-end via the clients
// (web: src/web/lib/api.ts, mobile: lib/api.ts).
export const router = {
  ping,
  products,
  checkout,
  reviews,
  leads,
  quiz,
};

export type AppRouter = typeof router;
/** Typed client for the router — used by the web and mobile api clients. */
export type AppRouterClient = RouterClient<AppRouter>;

const app = createApp(router);
// Rare plain-HTTP endpoints (webhooks, streaming, the Better Auth handler)
// register here with full paths, e.g. app.post("/api/webhooks/example", ...)

export default app;
