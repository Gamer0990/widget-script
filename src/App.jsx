import React, { useRef } from "react";
import html2canvas from "html2canvas";

const App = ({ iframeUrl }) => {
  console.log("igrmae", iframeUrl);
  const iframeRef = useRef(null);

  const handleScreenshot = async () => {
    const canvas = await html2canvas(document.body);
    const dataUrl = canvas.toDataURL("image/png");

    iframeRef.current?.contentWindow?.postMessage(
      {
        type: "screenshot",
        payload: dataUrl,
      },
      new URL(iframeUrl).origin
    );
  };

  return (
    <div
      style={{ position: "fixed", bottom: "20px", right: "20px", zIndex: 9999 }}
    >
      <button
        onClick={handleScreenshot}
        style={{ padding: "10px", borderRadius: "8px" }}
      >
        📸 Screenshot
      </button>

      {/* Hidden iframe for communication */}
      <iframe ref={iframeRef} src={iframeUrl} style={{ display: "none" }} />
    </div>
  );
};

export default App;
