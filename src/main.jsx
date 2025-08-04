import { StrictMode } from "react";
import { createRoot, ReactDOM } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

// Expose a global init method on window
window.FlonnectWidget = {
  init: (config) => {
    const container = document.createElement("div");
    container.style.zIndex = "99999";
    container.style.position = "fixed";
    container.style.top = "0";
    container.style.left = "0";
    container.style.width = "100vw";
    container.style.height = "100vh";
    container.style.pointerEvents = "none";

    // Shadow DOM to isolate styles
    const shadow = container.attachShadow({ mode: "open" });
    document.body.appendChild(container);

    const root = document.createElement("div");
    root.style.pointerEvents = "auto";
    shadow.appendChild(root);

    ReactDOM.createRoot(root).render(<App iframeUrl={config.iframeUrl} />);
  },
};
