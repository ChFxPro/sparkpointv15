
  import { createRoot } from "react-dom/client";
  import App from "./App.tsx";
  import "@fontsource/manrope/400.css";
  import "@fontsource/manrope/500.css";
  import "@fontsource/manrope/600.css";
  import "@fontsource/manrope/700.css";
  import "@fontsource/manrope/800.css";
  import "./index.css";
  import { reloadForNewDeploy } from "./components/RouteErrorBoundary";

  // A deploy replaced a code file this tab still asks for: reload once to get the new
  // version, instead of failing (see RouteErrorBoundary).
  window.addEventListener("vite:preloadError", (event) => {
    if (reloadForNewDeploy()) event.preventDefault();
  });

  createRoot(document.getElementById("root")!).render(<App />);
  