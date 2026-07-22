
  import { createRoot } from "react-dom/client";
  import App from "./App.tsx";
  import "@fontsource/manrope/400.css";
  import "@fontsource/manrope/500.css";
  import "@fontsource/manrope/600.css";
  import "@fontsource/manrope/700.css";
  import "@fontsource/manrope/800.css";
  import "./index.css";

  createRoot(document.getElementById("root")!).render(<App />);
  