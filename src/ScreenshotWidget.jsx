import React, { useState, useRef, useEffect } from "react";
import html2canvas from "html2canvas";

import ShadowWrapper from "./components/ShadowWrapper";
import EmbededBugReportIcon from "./components/embeded-bug-reportIcon/EmbededBugReportIcon";
import { useGlobal } from "./context/globalContext";
import {
  collectSystemInfo,
  generateUUID,
  handleApiResponse,
  uploadImageUsingPresignedUrlForBugReport,
} from "./utils/constant";

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
  const [preSignedUrl, setPreSignedUrl] = useState(null);

  const base64Ref = useRef(null);
  const iframeRef = useRef(null);
  const proxyUrl = `https://${domain}.flonnect.com/proxy.html`;
  const apiBaseUrl = `https://${domain}.flonnect.com/${domain}`;

  // const proxyUrl = `http://localhost:3000/proxy.html`;
  // const apiBaseUrl = `http://localhost:9000/fairpe`;

  // Function to make API calls through iframe proxy
  const makeProxyRequest = (requestType, endpoint, options = {}) => {
    if (!iframeRef.current || !proxyReady) {
      console.error("Proxy iframe not ready");
      return;
    }

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
      }
    );
  };

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
      console.log("event", event);
      const { type, requestType, data, error } = event.data;
      if (error) return;

      if (type === "PROXY_READY") {
        setProxyReady(true);
        return;
      }

      if (type === "API_RESPONSE") {
        // Handle API response
        console.log("base64", base64Ref);
        if (requestType === "GETCURRENTUSER" && data?.user) {
          dispatch({ type: type, data: data?.user });
        }
        if (requestType === "GETPRSIGNURL" && data) {
          try {
            const parsedData = JSON.parse(data); // Convert text to object

            if (parsedData?.signedUrl) {
              setPreSignedUrl(parsedData.signedUrl.split("?")?.[0]);

              uploadImageUsingPresignedUrlForBugReport(
                parsedData.signedUrl,
                base64Ref?.current,
                makeProxyRequest
              );
            }
          } catch (error) {
            console.error("Invalid JSON format in data:", error);
          }
        }

        if (requestType === "UPLOADIMAGEUSINGPRSIGN" && data) {
          const payload = {
            bugId: generateUUID(),
            bugUrl: preSignedUrl,
            captureType: "SCREENSHOT",
            deviceInfo: systemInfo || {},
            consoleLogs: [],
            networkLogs: [],
            title: document?.title || "",
          };
          makeProxyRequest(
            "ADDBUGREPORT",
            `flonnect/api/bugreports/add-bug-capture`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: payload,
            }
          );
        }

        if (requestType === "ADDBUGREPORT" && data) {
          const redirectUrl = `https://${domain}.flonnect.com/dashboard/homepage/bug/${data.id}`;
          window.open(redirectUrl, "_blank");
        }
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

  useEffect(() => {
    console.log("proxy ready", proxyReady, proxyUrl);
    if (proxyReady) {
      fetchCurrentUser();
    }
  }, [proxyReady, apiBaseUrl]);

  console.log("base", base64Ref);

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
          base64Ref={base64Ref}
        />
      )}
    </ShadowWrapper>
  );
};

export default ScreenshotWidget;
