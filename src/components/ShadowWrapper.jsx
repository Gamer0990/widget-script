// ShadowWrapper.jsx - For styled-components
import React, { useEffect, useRef } from "react";
import ReactDOM from "react-dom/client";
import { StyleSheetManager } from "styled-components";

const ShadowWrapper = ({ children }) => {
  const hostRef = useRef(null);
  const shadowRootRef = useRef(null);
  const rootRef = useRef(null);

  useEffect(() => {
    if (hostRef.current && !shadowRootRef.current) {
      // Create shadow root
      const shadowRoot = hostRef.current.attachShadow({ mode: "open" });
      shadowRootRef.current = shadowRoot;

      // Create mount point
      const mountPoint = document.createElement("div");
      shadowRoot.appendChild(mountPoint);

      // Mount React content with StyleSheetManager
      const root = ReactDOM.createRoot(mountPoint);
      rootRef.current = root;

      root.render(
        <StyleSheetManager target={shadowRoot}>{children}</StyleSheetManager>
      );
    }
  }, []);

  useEffect(() => {
    if (rootRef.current && shadowRootRef.current) {
      rootRef.current.render(
        <StyleSheetManager target={shadowRootRef.current}>
          {children}
        </StyleSheetManager>
      );
    }
  }, [children]);

  return <div ref={hostRef} />;
};

export default ShadowWrapper;
