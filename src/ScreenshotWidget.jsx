import React, { useState, useRef, useEffect, useCallback } from "react";
import html2canvas from "html2canvas";
import { v4 as uuidv4 } from "uuid";

import ShadowWrapper from "./components/ShadowWrapper";
import EmbededBugReportIcon from "./components/embeded-bug-reportIcon/EmbededBugReportIcon";
import { useGlobal } from "./context/globalContext";
import {
  collectSystemInfo,
  generateUUID,
  handleApiResponse,
  uploadImageUsingPresignedUrlForBugReport,
} from "./utils/constant";
import BugDetailForm from "./components/bug-report-forms/BugReportForm";
import BugSubtask from "./components/bug-report-forms/BugSubTaskForm";
import RecordingControlWidget from "./components/recording-controal-widget/RecordingControlWidget";

// ========== Main Component ==========
let stoped = false;
let videoId = null;

const ScreenshotWidget = ({ domain, projectId }) => {
  const { state, dispatch } = useGlobal();
  const {
    user,
    videoRecordPrsignedUrls,
    fileDetails,
    videoCaptureDetails,
    videoFormDetails,
    openSubTaskForm,
    loader,
  } = state;
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isCapture, setIsCapture] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [bugData, setBugData] = useState(null);
  const [proxyReady, setProxyReady] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  // const [openSubTaskForm, setOpenSubtaskForm] = useState(false);
  // const [loader, setLoader] = useState(false);
  const [isPaused, setIspaused] = useState(false);
  const [loadedPrecent, setLoadedPercent] = useState(0);
  const [recordingTime, setRecordingTime] = useState(0);
  const [timerInterval, setTimerInterval] = useState(null);

  const [systemInfo, setSystemInfo] = useState(false);

  const preSignedUrlRef = useRef(null);
  const properChunksRef = useRef([]);
  const base64Ref = useRef(null);
  const iframeRef = useRef(null);
  const isCancelledRef = useRef(false);

  const proxyUrl = `https://${domain}.flonnect.com/proxy.html`;
  const apiBaseUrl = `https://${domain}.flonnect.com/${domain}`;

  // const proxyUrl = `http://localhost:3000/proxy.html`;
  // const apiBaseUrl = `http://localhost:9000/fairpe`;

  // Function to make API calls through iframe proxy
  const makeProxyRequest = (type, requestType, endpoint, options = {}) => {
    let requestForMessage;
    // if (!iframeRef.current) {
    //   console.error("Proxy iframe not ready");
    //   return;
    // }
    const apiEndPoint =
      requestType === "UPLOADIMAGEUSINGPRSIGN"
        ? endpoint
        : `${apiBaseUrl}/${endpoint}`;
    // Create request object WITHOUT callback for postMessage
    if (type === "RECORDING_API_REQUEST") {
      requestForMessage = {
        type,
        requestType,
        options,
      };
    } else {
      requestForMessage = {
        type,
        requestType,
        endpoint: apiEndPoint,
        options: {
          method: options.method || "GET",
          headers: options.headers || {},
          body: options.body,
        },
      };
    }

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
      "API_REQUEST",
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

  // recding functions

  const startRecording = async (preSignedUrls) => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { mediaSource: "screen" },
        audio: true,
      });

      const recorder = new MediaRecorder(stream);
      let chunks = [];

      setRecordingTime(0);
      const interval = setInterval(() => {
        if (!isPaused) {
          setRecordingTime((prev) => prev + 1);
        }
      }, 1000);
      setTimerInterval(interval);

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);

          const accumulatedSize = chunks.reduce(
            (size, chunk) => size + chunk.size,
            0
          );
          if (accumulatedSize >= 6 * 1024 * 1024 || stoped) {
            stoped = false;
            const combinedBlob = new Blob(chunks, {
              type: "video/mp4",
            });

            // let partnumber = properChunks.length + 1;
            // properChunks.push({
            //   chunk: combinedBlob,
            //   status: "initiated",
            //   PartNumber: partnumber,
            // });

            let partnumber = properChunksRef.current.length + 1;
            properChunksRef.current.push({
              chunk: combinedBlob,
              status: "initiated",
              PartNumber: partnumber,
            });
            const payload = {
              chunkIndex: properChunksRef.current.length - 1,
              properChunks: properChunksRef.current,
              preSignedUrls: preSignedUrls,
              instantFileDetails: fileDetails,
            };
            makeProxyRequest("RECORDING_API_REQUEST", "UPLOADCHUNCKS", `NA`, {
              baseUrl: apiBaseUrl,
              body: payload,
            });

            chunks = [];
          }
        }
      };

      recorder.onstop = () => {
        clearInterval(interval);
        setRecordingTime(0);
        setTimeout(() => {
          stream.getTracks().forEach((track) => track.stop());

          // ✅ only finalize if not cancelled
          if (!isCancelledRef.current) {
            const payload = {
              fileDetails,
              properChunks: properChunksRef.current,
              title: document?.title || "",
            };
            makeProxyRequest("RECORDING_API_REQUEST", "FINALISEUPLOAD", "NA", {
              baseUrl: apiBaseUrl,
              body: payload,
            });
          }

          // Reset all
          chunks = [];
          properChunksRef.current = [];
          isCancelledRef.current = false; // reset cancel flag
        }, 500);
      };

      recorder.start(1000);
      setMediaRecorder(recorder);
      setIsRecording(true);
      // button.title = "Stop Recording"; // Change tooltip
    } catch (error) {
      // console.error("Error starting screen recording:", error);
      properChunksRef.current = [];
      const payload = {
        bugId: videoFormDetails?.bugId,
        bugCaptureId: videoCaptureDetails?.bugCaptureId,
      };
      makeProxyRequest("RECORDING_API_REQUEST", "CANCELRECORDING", `NA`, {
        baseUrl: apiBaseUrl,
        body: payload,
      });
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      stoped = true;
      clearInterval(timerInterval);
      setTimeout(() => {
        mediaRecorder.stop();
        setMediaRecorder(null);
        setIsRecording(false);
      }, 500);
    }
  };

  const pauseRecording = () => {
    if (!mediaRecorder) return;
    if (mediaRecorder.state === "recording") {
      mediaRecorder.pause();
      setIspaused(true);
    }
  };

  const resumeRecording = () => {
    if (!mediaRecorder) return;
    if (mediaRecorder.state === "paused") {
      mediaRecorder.resume();
      dispatch({ type: "HANDLESUBTASKFORM", data: false });
      dispatch({ type: "HANDLELOADER", data: false });
      // setLoader(false);
      // setOpenSubtaskForm(false);
      setIspaused(false);
    }
  };

  const cancelRecording = () => {
    if (mediaRecorder) {
      // Stop the recorder if still running
      if (mediaRecorder.state !== "inactive") {
        const payload = {
          bugId: videoFormDetails?.bugId,
          bugCaptureId: videoCaptureDetails?.bugCaptureId,
        };

        isCancelledRef.current = true;
        makeProxyRequest("RECORDING_API_REQUEST", "CANCELRECORDING", "NA", {
          baseUrl: apiBaseUrl,
          body: payload,
        });

        mediaRecorder.stop();
      }

      // Stop all tracks to release the screen/audio stream
      mediaRecorder.stream.getTracks().forEach((track) => track.stop());

      clearInterval(timerInterval); // stop timer
      setRecordingTime(0);

      // Clear media recorder and recording states
      setMediaRecorder(null);
      setIsRecording(false);
      setIspaused(false);
    }
  };

  // Listen for messages from proxy iframe
  const handleMessage = useCallback(
    (event) => {
      // Verify origin for security
      // if (!event.origin.endsWith(".flonnect.com")) {
      //   console.warn("Blocked message from unauthorized origin:", event.origin);
      //   return;
      // }

      const { type, requestType, data, error } = event.data;

      if (requestType === "GETCURRENTUSER" && error) {
        dispatch({ type: requestType, data: null });
      }

      if (error) return;

      if (type === "PROXY_READY") {
        setProxyReady(true);
        return;
      }

      if (type === "API_RESPONSE") {
        // Handle API response

        if (requestType === "GETCURRENTUSER" && data) {
          dispatch({ type: requestType, data: data?.user });
        }

        // screen shot related mesages
        if (requestType === "GETPRSIGNURL" && data) {
          try {
            const parsedData = JSON.parse(data); // Convert text to object

            if (parsedData?.signedUrl) {
              // setPreSignedUrl(parsedData.signedUrl.split("?")?.[0]);
              preSignedUrlRef.current = parsedData.signedUrl.split("?")?.[0];

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
            bugUrl: preSignedUrlRef.current,
            captureType: "SCREENSHOT",
            deviceInfo: systemInfo || {},
            consoleLogs: [],
            networkLogs: [],
            title: document?.title || "",
          };
          makeProxyRequest(
            "API_REQUEST",
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
          // base64Ref.current = null;
          // preSignedUrl.current = null;
          const redirectUrl = `https://${domain}.flonnect.com/dashboard/homepage/bug/${data?.data?.id}}`;
          // const redirectUrl = `http://localhost:3000/dashboard/homepage/bug/${data?.data?.id}`;
          window.open(redirectUrl, "_blank");
        }

        // recording related messages
        if (requestType === "ADDBUGREPORTBEFORERECORDING" && data) {
          const fileUuid = uuidv4();
          const fileId = `Flonnect_${new Date()
            .toJSON()
            .slice(0, 10)}_${fileUuid}`;
          let payload = {
            videoId: fileId,
            username: user?.email.split("@")[0],
            contentType: "video/mp4",
            recordType: "OTHER",
          };

          makeProxyRequest("RECORDING_API_REQUEST", "STARTUPLOADING", `NA`, {
            baseUrl: apiBaseUrl,
            body: payload,
          });
          dispatch({ type: requestType, data: data?.bugReport });
          // startRecording();
        }

        if (requestType === "STARTUPLOADING" && data) {
          const payload = {
            endChunk: 5,
            fileId: data?.fileId,
            fileKey: data?.fileKey,
            startChunk: 0,
          };
          makeProxyRequest("RECORDING_API_REQUEST", "GETPRESIGNEDURLS", `NA`, {
            baseUrl: apiBaseUrl,
            body: payload,
          });
          dispatch({ type: requestType, data: data });
        }

        if (requestType === "GETPRESIGNEDURLS" && data) {
          dispatch({ type: requestType, data: data?.parts });
          startRecording(data?.parts);
        }

        if (requestType === "ADDSUBTASK" && data) {
          resumeRecording();
        }

        if (requestType === "CANCELRECORDING" && data) {
          const initialState = {
            videoRecordPrsignedUrls: [],
            fileDetails: null,
          };
          dispatch({ type: requestType, data: initialState });
        }

        if (requestType === "UPLOADCHUNCKS" && data) {
          const index = properChunksRef.current.findIndex(
            (chunk) => chunk.PartNumber === data.PartNumber
          );

          if (index !== -1) {
            properChunksRef.current[index] = data;
          }
        }
        if (requestType === "FINALISEUPLOAD" && data) {
          videoId = data?.video?.id;
          const payloads = {
            netWorkCallpayLoad: {
              bugCaptureId: videoCaptureDetails?.bugCaptureId,
              tabNetworkRequests: [
                {
                  deviceInfo: systemInfo ?? {},
                  consoleLogs: [],
                  networkLogs: [],
                },
              ],
            },
            updateUrlPayLoad: {
              bugCaptureId: videoCaptureDetails?.bugCaptureId,
              bugVideoId: data?.video?.id,
              uploadFrom: "bugreport",
            },
          };
          makeProxyRequest(
            "RECORDING_API_REQUEST",
            "NETORKANDUPDATEURL",
            `NA`,
            {
              baseUrl: apiBaseUrl,
              body: payloads,
            }
          );
        }

        if (requestType === "NETORKANDUPDATEURL" && data) {
          // const redirectUrl = `http://localhost:3000/dashboard/homepage/bug/${videoCaptureDetails?.bugCaptureId}`;
          const redirectUrl = `https://${domain}.flonnect.com/dashboard/homepage/bug/${videoCaptureDetails?.bugCaptureId}`;

          window.open(redirectUrl, "_blank");
          dispatch({ type: requestType, data: null });
        }
      }
    },
    [state]
  );

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

    // Cleanup
    return () => {
      if (iframe && iframe.parentNode) {
        iframe.parentNode.removeChild(iframe);
      }
    };
  }, [proxyUrl]);

  useEffect(() => {
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [handleMessage]);

  useEffect(() => {
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
      {!isCapture && !isRecording && !isFormOpen && (
        <EmbededBugReportIcon
          state={state}
          setIsCapture={setIsCapture}
          setIsRecording={setIsRecording}
          setIsFormOpen={setIsFormOpen}
          bugData={bugData}
          makeProxyRequest={makeProxyRequest}
          base64Ref={base64Ref}
          startRecording={startRecording}
          domain={domain}
        />
      )}
      {isFormOpen && (
        <BugDetailForm
          isFormOpen={isFormOpen}
          setIsFormOpen={setIsFormOpen}
          makeProxyRequest={makeProxyRequest}
          dispatch={dispatch}
        />
      )}
      {isRecording && (
        <BugSubtask
          // openSubTaskForm={openSubTaskForm}
          // setOpenSubtaskForm={setOpenSubtaskForm}
          // loader={loader}
          // setLoader={setLoader}
          makeProxyRequest={makeProxyRequest}
          pauseRecording={pauseRecording}
          resumeRecording={resumeRecording}
          recordedTime={recordingTime}
          state={state}
          dispatch={dispatch}
        />
      )}

      {isRecording && (
        <RecordingControlWidget
          isPaused={isPaused}
          isRecording={isRecording}
          recordedTime={recordingTime}
          pauseRecording={pauseRecording}
          resumeRecording={resumeRecording}
          onStop={stopRecording}
          onCancel={cancelRecording}
        />
      )}
    </ShadowWrapper>
  );
};

export default ScreenshotWidget;
