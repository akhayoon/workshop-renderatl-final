import ReactDOM from "react-dom/client";
import App from "./App";
import "@shopify/polaris/build/esm/styles.css";
import { AppProvider } from "@shopify/polaris";
import enTranslations from "@shopify/polaris/locales/en.json";

const rootElement = document.getElementById("root")!;
const root = ReactDOM.createRoot(rootElement);

root.render(
  <AppProvider i18n={enTranslations}>
    <App />
  </AppProvider>
);
