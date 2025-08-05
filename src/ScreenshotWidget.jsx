import React, { useState, useRef, useEffect } from "react";
import html2canvas from "html2canvas";

import ShadowWrapper from "./components/ShadowWrapper";
import EmbededBugReportIcon from "./components/embeded-bug-reportIcon/EmbededBugReportIcon";
import { useGlobal } from "./context/globalContext";
import { collectSystemInfo, handleApiResponse } from "./utils/constant";

// ========== Main Component ==========
const ScreenshotWidget = ({ domain, projectId }) => {
  const { state, dispatch } = useGlobal();
  console.log("state", state);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isCapture, setIsCapture] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [bugData, setBugData] = useState(null);
  const [proxyReady, setProxyReady] = useState(false);
  const [systemInfo, setSystemInfo] = useState(false);
  const iframeRef = useRef(null);
  const proxyUrl = `https://${domain}.flonnect.com/proxy.html`;
  const apiBaseUrl = `https://${domain}.flonnect.com/${domain}`;

  // const proxyUrl = `http://localhost:3000/proxy.html`;
  // const apiBaseUrl = `http://localhost:9000/fairpe`;

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
      // if (!proxyUrl.startsWith(event.origin)) {
      //   console.warn(
      //     "Received message from unauthorized origin:",
      //     event.origin
      //   );
      //   return;
      // }

      const { type, requestType, data, error } = event.data;

      if (type === "PROXY_READY") {
        setProxyReady(true);
        return;
      }

      if (type === "API_RESPONSE") {
        // Handle API response
        console.log("data", error);
        handleApiResponse(dispatch, requestType, data);
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
  const makeProxyRequest = (requestType, endpoint, options = {}, callback) => {
    if (!iframeRef.current || !proxyReady) {
      console.error("Proxy iframe not ready");
      callback(null, "Proxy not ready");
      return;
    }

    // Store the complete request with callback for response handling
    const requestWithCallback = {
      type: "API_REQUEST",
      requestType,
      endpoint,
      options: {
        method: options.method || "GET",
        headers: options.headers || {},
        body: options.body,
      },
      callback,
    };

    // Store request for response handling

    // Create request object WITHOUT callback for postMessage
    const requestForMessage = {
      type: "API_REQUEST",
      requestType,
      endpoint: `${apiBaseUrl}/${endpoint}`,
      options: {
        method: options.method || "GET",
        headers: options.headers || {},
        body: options.body,
      },
    };

    try {
      const targetOrigin = new URL(proxyUrl)?.origin;
      iframeRef.current.contentWindow.postMessage(
        requestForMessage,
        targetOrigin
      );
    } catch (error) {
      console.error("Failed to send message to proxy:", error);
    }
  };

  const fetchCurrentUser = () => {
    makeProxyRequest(
      "GETCURRENTUSER",
      `flonnect/api/enterprise/get-current-user`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
      (data, error) => {
        if (error) {
          console.error("Failed to fetch current user:", error);
        } else {
          console.log("Current user:", data);
        }
      }
    );
  };

  useEffect(() => {
    console.log("proxy ready", proxyReady, proxyUrl);
    if (proxyReady) {
      fetchCurrentUser();
    }
  }, [proxyReady, apiBaseUrl]);

  useEffect(() => {
    collectSystemInfo().then((systemInfo) => {
      setSystemInfo(systemInfo);
    });
  }, []);

  return (
    <ShadowWrapper>
      {!isCapture && !isRecording && (
        <EmbededBugReportIcon
          state={state}
          setIsCapture={setIsCapture}
          setIsRecording={setIsRecording}
          setIsFormOpen={setIsFormOpen}
          bugData={bugData}
          makeProxyRequest={makeProxyRequest}
        />
      )}
    </ShadowWrapper>
  );
};

export default ScreenshotWidget;
