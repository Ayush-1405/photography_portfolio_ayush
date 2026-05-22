import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { ThemeProvider } from "./context/ThemeContext";
import "./index.css";
import App from "./App";

gsap.registerPlugin(ScrollTrigger);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>
);
