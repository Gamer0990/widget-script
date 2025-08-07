// src/embed.js
import React from "react";
import { createRoot } from "react-dom/client";
import ScreenshotWidget from "./ScreenshotWidget.jsx";
import { GlobalProvider } from "./context/globalContext.jsx";

// Global function to initialize the widget
window.initScreenshotWidget = function (config = {}) {
  // Prevent multiple initializations
  if (document.getElementById("screenshot-widget-root")) {
    console.warn("Screenshot widget already initialized");
    return;
  }

  const existingFontLink = document.querySelector(
    "link[href*='fonts.googleapis.com/css2?family=Inter']"
  );
  if (!existingFontLink) {
    const fontLink = document.createElement("link");
    fontLink.rel = "stylesheet";
    fontLink.href =
      "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap";
    document.head.appendChild(fontLink);
  }

  // Default configuration
  const defaultConfig = {
    domain: "",
    projectId: "",
    containerId: "screenshot-widget-root",
  };

  const finalConfig = { ...defaultConfig, ...config };

  // Create container
  const container = document.createElement("div");
  container.id = finalConfig.containerId;
  document.body.appendChild(container);

  // Create React root and render
  const root = createRoot(container);
  root.render(
    <GlobalProvider>
      <ScreenshotWidget
        domain={finalConfig.domain}
        projectId={finalConfig.projectId}
      />
    </GlobalProvider>
  );

  console.log("Screenshot widget initialized successfully");

  // Return cleanup function
  return () => {
    root.unmount();
    document.body.removeChild(container);
  };
};

// Auto-initialize if data attributes are present on script tag
document.addEventListener("DOMContentLoaded", () => {
  const scriptTag = document.querySelector("script[data-screenshot-widget]");
  if (scriptTag) {
    const config = {
      domain: scriptTag.dataset.domain,
      projectId: scriptTag.dataset.projectId,
    };

    // Remove undefined values
    Object.keys(config).forEach((key) => {
      if (config[key] === undefined) {
        delete config[key];
      }
    });

    window.initScreenshotWidget(config);
  }
});

// Export for module usage
export { ScreenshotWidget };
export default window.initScreenshotWidget;
