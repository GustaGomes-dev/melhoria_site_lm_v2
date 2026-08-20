import { AgentFeedback, RunableBadge } from "@runablehq/website-runtime";
import { Route, Switch } from "wouter";
import { Provider } from "./components/provider";
import { SiteLayout } from "./components/site/layout";
import AboutPage from "./pages/about";
import CartPage from "./pages/cart";
import CatalogPage from "./pages/catalog";
import CheckoutPage from "./pages/checkout";
import FaqPage from "./pages/faq";
import Index from "./pages/index";
import KitsPage from "./pages/kits";
import NotFoundPage from "./pages/not-found";
import OrderPage from "./pages/order";
import PolicyPage from "./pages/policy";
import ProductPage from "./pages/product";
import QuizPage from "./pages/quiz";

function App() {
  return (
    <Provider>
      <SiteLayout>
        <Switch>
          <Route path="/" component={Index} />
          <Route path="/perfumes-arabes" component={CatalogPage} />
          <Route path="/produto/:slug" component={ProductPage} />
          <Route path="/quiz" component={QuizPage} />
          <Route path="/kits-e-amostras" component={KitsPage} />
          <Route path="/sacola" component={CartPage} />
          <Route path="/checkout" component={CheckoutPage} />
          <Route path="/pedido" component={OrderPage} />
          <Route path="/pedido/:code" component={OrderPage} />
          <Route path="/sobre" component={AboutPage} />
          <Route path="/faq" component={FaqPage} />
          <Route path="/trocas-e-devolucoes" component={PolicyPage} />
          <Route path="/prazos-e-entregas" component={PolicyPage} />
          <Route path="/privacidade" component={PolicyPage} />
          <Route path="/termos" component={PolicyPage} />
          <Route component={NotFoundPage} />
        </Switch>
      </SiteLayout>
      {/* Do not remove — off by default, activated by parent iframe via postMessage */}
      {import.meta.env.DEV && <AgentFeedback />}
      {/* "Made with Runable" badge - if user asks to remove the runable badge, remove this code as well as comment */}
      {<RunableBadge />}
    </Provider>
  );
}

export default App;
