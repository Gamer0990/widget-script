import React, { useState, useRef, useEffect, useCallback } from "react";

// Custom hook for recording functionality
export const useRecording = () => {
  const [recordingState, setRecordingState] = useState({
    isRecording: false,
    isPaused: false,
    recordedTime: 0, // in milliseconds
    recordedBlob: null,
    error: null,
  });

  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const streamRef = useRef(null);

  // Timer references
  const recordingStartTimeRef = useRef(null);
  const totalRecordedTimeRef = useRef(0);
  const timerRef = useRef(null);

  // Update recorded time
  const updateRecordedTime = useCallback(() => {
    if (recordingStartTimeRef.current) {
      const currentSessionTime = Date.now() - recordingStartTimeRef.current;
      const currentTotalTime =
        totalRecordedTimeRef.current + currentSessionTime;

      setRecordingState((prev) => ({
        ...prev,
        recordedTime: currentTotalTime,
      }));
    }
  }, []);

  // Start timer
  const startTimer = useCallback(() => {
    recordingStartTimeRef.current = Date.now();
    timerRef.current = setInterval(updateRecordedTime, 100);
  }, [updateRecordedTime]);

  // Stop timer
  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Pause timer
  const pauseTimer = useCallback(() => {
    if (recordingStartTimeRef.current) {
      totalRecordedTimeRef.current +=
        Date.now() - recordingStartTimeRef.current;
      recordingStartTimeRef.current = null;
    }
    stopTimer();
  }, [stopTimer]);

  // Start recording
  const startRecording = useCallback(
    async (options = {}) => {
      try {
        const defaultOptions = {
          video: { mediaSource: "screen" },
          audio: true,
          ...options,
        };

        const stream = await navigator.mediaDevices.getDisplayMedia(
          defaultOptions
        );
        streamRef.current = stream;

        const mediaRecorder = new MediaRecorder(stream, {
          mimeType: "video/webm;codecs=vp9",
        });

        mediaRecorderRef.current = mediaRecorder;
        chunksRef.current = [];

        // Event handlers
        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            chunksRef.current.push(event.data);
          }
        };

        mediaRecorder.onstop = () => {
          const blob = new Blob(chunksRef.current, {
            type: "video/webm",
          });

          setRecordingState((prev) => ({
            ...prev,
            recordedBlob: blob,
            isRecording: false,
            isPaused: false,
          }));

          // Cleanup stream
          if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => track.stop());
            streamRef.current = null;
          }
        };

        mediaRecorder.onerror = (event) => {
          setRecordingState((prev) => ({
            ...prev,
            error: event.error,
            isRecording: false,
            isPaused: false,
          }));
        };

        // Start recording
        mediaRecorder.start(1000); // Collect data every second

        // Reset timer states
        totalRecordedTimeRef.current = 0;
        setRecordingState((prev) => ({
          ...prev,
          isRecording: true,
          isPaused: false,
          recordedTime: 0,
          error: null,
          recordedBlob: null,
        }));

        startTimer();
      } catch (error) {
        setRecordingState((prev) => ({
          ...prev,
          error: error.message,
          isRecording: false,
        }));
      }
    },
    [startTimer]
  );

  // Stop recording
  const stopRecording = useCallback(() => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      // Add final session time
      if (recordingStartTimeRef.current) {
        totalRecordedTimeRef.current +=
          Date.now() - recordingStartTimeRef.current;
      }

      stopTimer();
      mediaRecorderRef.current.stop();

      // Final time update
      setRecordingState((prev) => ({
        ...prev,
        recordedTime: totalRecordedTimeRef.current,
      }));
    }
  }, [stopTimer]);

  // Pause recording
  const pauseRecording = useCallback(() => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "recording"
    ) {
      mediaRecorderRef.current.pause();
      pauseTimer();

      setRecordingState((prev) => ({
        ...prev,
        isPaused: true,
      }));
    }
  }, [pauseTimer]);

  // Resume recording
  const resumeRecording = useCallback(() => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "paused"
    ) {
      mediaRecorderRef.current.resume();
      startTimer();

      setRecordingState((prev) => ({
        ...prev,
        isPaused: false,
      }));
    }
  }, [startTimer]);

  // Toggle pause/resume
  const togglePauseResume = useCallback(() => {
    if (recordingState.isPaused) {
      resumeRecording();
    } else {
      pauseRecording();
    }
  }, [recordingState.isPaused, pauseRecording, resumeRecording]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopTimer();
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [stopTimer]);

  return {
    ...recordingState,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    togglePauseResume,
  };
};
