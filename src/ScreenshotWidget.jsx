import React, { useState, useRef, useEffect } from "react";
import html2canvas from "html2canvas";
import {
  ScreenshotButton,
  StatusText,
  WidgetContainer,
  WidgetWrapper,
} from "./ScreenShotWidget.styled";

// ========== Theme Definitions ==========
const themeStyles = {
  light: {
    bg: "#ffffff",
    text: "#333333",
    border: "#e1e5e9",
    button: "#007bff",
    buttonText: "#ffffff",
  },
  dark: {
    bg: "#2d3748",
    text: "#ffffff",
    border: "#4a5568",
    button: "#4299e1",
    buttonText: "#ffffff",
  },
};

// ========== Main Component ==========
const ScreenshotWidget = ({
  apiEndpoint = "https://your-api.com/api/screenshots",
  proxyUrl = "http://localhost:3000/proxy.html", // Your proxy iframe URL
  apiKey = "",
  position = "bottom-right",
  theme = "light",
}) => {
  const [isCapturing, setIsCapturing] = useState(false);
  const [status, setStatus] = useState("");
  const [isVisible, setIsVisible] = useState(true);
  const [proxyReady, setProxyReady] = useState(false);
  const iframeRef = useRef(null);
  const requestQueue = useRef(new Map()); // Changed to Map for better lookup
  const currentTheme = themeStyles[theme] || themeStyles.light;

  async function fetchCurrentUser() {
    try {
      const response = await fetch(
        "https://fairpe.flonnect.com/fairpe/flonnect/api/enterprise/get-current-user",
        {
          method: "GET",
          credentials: "include", // This ensures cookies are sent
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch user: ${response.status}`);
      }

      const data = await response.json();
      console.log("current user data", data);
      return data;
    } catch (error) {
      console.error("Error fetching current user:", error);
      throw error;
    }
  }

  // Initialize iframe proxy
  useEffect(() => {
    const iframe = document.createElement("iframe");
    iframe.src = proxyUrl;
    iframe.style.display = "none";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "none";

    document.body.appendChild(iframe);
    iframeRef.current = iframe;

    // Listen for messages from proxy iframe
    const handleMessage = (event) => {
      // Verify origin for security
      if (!proxyUrl.startsWith(event.origin)) {
        console.warn(
          "Received message from unauthorized origin:",
          event.origin
        );
        return;
      }

      const { type, requestId, data, error } = event.data;

      if (type === "PROXY_READY") {
        setProxyReady(true);
        // Process any queued requests
        requestQueue.current.forEach((request, reqId) => {
          const { callback, ...requestData } = request; // Extract callback before sending
          iframe.contentWindow.postMessage(requestData, event.origin);
        });
        return;
      }

      if (type === "API_RESPONSE") {
        // Handle API response
        console.log("data", data);
        const request = requestQueue.current.get(requestId);
        if (request && request.callback) {
          if (error) {
            request.callback(null, error);
          } else {
            request.callback(data, null);
          }
        }
        // Remove processed request
        requestQueue.current.delete(requestId);
      }
    };

    window.addEventListener("message", handleMessage);

    // Cleanup
    return () => {
      window.removeEventListener("message", handleMessage);
      if (iframe && iframe.parentNode) {
        iframe.parentNode.removeChild(iframe);
      }
    };
  }, [proxyUrl]);

  // Function to make API calls through iframe proxy
  const makeProxyRequest = (endpoint, options = {}, callback) => {
    if (!iframeRef.current || !proxyReady) {
      console.error("Proxy iframe not ready");
      callback(null, "Proxy not ready");
      return;
    }

    const requestId = Date.now() + Math.random();

    // Store the complete request with callback for response handling
    const requestWithCallback = {
      type: "API_REQUEST",
      requestId,
      endpoint,
      options: {
        method: options.method || "GET",
        headers: options.headers || {},
        body: options.body,
      },
      callback, // Keep callback for response handling
    };

    // Store request for response handling
    requestQueue.current.set(requestId, requestWithCallback);

    // Create request object WITHOUT callback for postMessage
    const requestForMessage = {
      type: "API_REQUEST",
      requestId,
      endpoint,
      options: {
        method: options.method || "GET",
        headers: options.headers || {},
        body: options.body,
      },
      // NO callback property here - this is the key fix!
    };

    // Send request to proxy iframe (without callback)
    try {
      const targetOrigin = new URL(proxyUrl).origin;
      // console.log("target Origin", targetOrigin, requestForMessage);
      iframeRef.current.contentWindow.postMessage(
        requestForMessage,
        targetOrigin
      );
    } catch (error) {
      console.error("Failed to send message to proxy:", error);
      requestQueue.current.delete(requestId); // Clean up failed request
      callback(null, error.message);
    }
  };

  const captureScreenshot = async () => {
    try {
      setIsCapturing(true);
      setStatus("Capturing screenshot...");
      setIsVisible(false);

      await new Promise((resolve) => setTimeout(resolve, 100));

      const canvas = await html2canvas(document.body, {
        useCORS: true,
        allowTaint: true,
        scale: 0.5,
        scrollX: 0,
        scrollY: 0,
        width: window.innerWidth,
        height: window.innerHeight,
        ignoreElements: (el) =>
          el.classList?.contains("screenshot-widget") ||
          el.id === "screenshot-widget-root",
      });

      const blob = await new Promise((resolve) =>
        canvas.toBlob(resolve, "image/png", 0.8)
      );

      await uploadScreenshot(blob);
      setStatus("Screenshot captured successfully!");
      setTimeout(() => setStatus(""), 3000);
    } catch (err) {
      console.error("Capture failed:", err);
      setStatus("Failed to capture screenshot");
      setTimeout(() => setStatus(""), 3000);
    } finally {
      setIsCapturing(false);
      setIsVisible(true);
    }
  };

  const uploadScreenshot = async (blob) => {
    return new Promise((resolve, reject) => {
      // Convert blob to base64 for transmission
      const reader = new FileReader();
      reader.onload = () => {
        const base64Data = reader.result.split(",")[1];

        const payload = {
          screenshot: base64Data,
          filename: "screenshot.png",
          url: window.location.href,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          viewport: JSON.stringify({
            width: window.innerWidth,
            height: window.innerHeight,
          }),
        };

        makeProxyRequest(
          apiEndpoint,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${apiKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          },
          (data, error) => {
            if (error) {
              reject(new Error(`Upload failed: ${error}`));
            } else {
              resolve(data);
            }
          }
        );
      };

      reader.onerror = () => reject(new Error("Failed to read blob"));
      reader.readAsDataURL(blob);
    });
  };

  // const fetchCurrentUser = () => {
  //   makeProxyRequest(
  //     `${apiEndpoint}flonnect/api/enterprise/get-current-user`,
  //     {
  //       method: "GET",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     },
  //     (data, error) => {
  //       if (error) {
  //         console.error("Failed to fetch current user:", error);
  //       } else {
  //         console.log("Current user:", data);
  //       }
  //     }
  //   );
  // };

  // useEffect(() => {
  //   console.log("proxy ready", proxyReady, proxyUrl);
  //   if (proxyReady) {
  //     fetchCurrentUser();
  //   }
  // }, [proxyReady, apiEndpoint, apiKey]);

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  return (
    <WidgetWrapper
      className="screenshot-widget"
      position={position}
      visible={isVisible}
    >
      <WidgetContainer themeStyle={currentTheme}>
        <ScreenshotButton
          onClick={captureScreenshot}
          disabled={isCapturing || !proxyReady}
          isCapturing={isCapturing}
          themeStyle={currentTheme}
        >
          {isCapturing
            ? "Capturing..."
            : !proxyReady
            ? "Loading..."
            : "📸 Take bug screenshot"}
        </ScreenshotButton>
        <StatusText status={status} themeStyle={currentTheme}>
          {status}
        </StatusText>
      </WidgetContainer>
    </WidgetWrapper>
  );
};

export default ScreenshotWidget;
