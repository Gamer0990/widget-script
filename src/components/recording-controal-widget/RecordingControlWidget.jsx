import React from "react";
import styled from "styled-components";
import { formatTime } from "../../utils/constant";

// Styled Components
const WidgetContainer = styled.div`
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 50px;
  padding: 12px 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  z-index: 9999;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;

  &:hover {
    transform: translateX(-50%) translateY(-2px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
  }
`;

const ControlButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 16px;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }

  &::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    height: 100%;
    border-radius: 50%;
    transition: all 0.3s ease;
    z-index: -1;
  }
`;

const PauseResumeButton = styled(ControlButton)`
  background: ${(props) => (props.$isPaused ? "#10B981" : "#F59E0B")};
  color: white;

  &:hover::before {
    background: ${(props) =>
      props.$isPaused ? "rgba(16, 185, 129, 0.2)" : "rgba(245, 158, 11, 0.2)"};
    width: 120%;
    height: 120%;
  }
`;

const StopButton = styled(ControlButton)`
  background: #ef4444;
  color: white;

  &:hover::before {
    background: rgba(239, 68, 68, 0.2);
    width: 120%;
    height: 120%;
  }
`;

const CancelButton = styled(ControlButton)`
  background: #6b7280; /* gray-500 */
  color: white;

  &:hover::before {
    background: rgba(107, 114, 128, 0.2);
    width: 120%;
    height: 120%;
  }
`;

const ButtonText = styled.span`
  color: white;
  font-size: 12px;
  font-weight: 600;
  margin-left: 8px;
  letter-spacing: 0.5px;
  text-transform: uppercase;
`;

const RecordingIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  color: white;
  font-size: 12px;
  font-weight: 500;
`;

const RecordingDot = styled.div`
  width: 8px;
  height: 8px;
  background: #ef4444;
  border-radius: 50%;
  animation: ${(props) =>
    props.$isRecording && !props.$isPaused ? "pulse 1.5s infinite" : "none"};

  @keyframes pulse {
    0% {
      transform: scale(1);
      opacity: 1;
    }
    50% {
      transform: scale(1.2);
      opacity: 0.7;
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  }
`;

const TimeDisplay = styled.div`
  color: white;
  font-family: "Courier New", monospace;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 1px;
  min-width: 50px;
  text-align: center;
`;

// Icons as React components
const PauseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
  </svg>
);

const PlayIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M8 5v14l11-7L8 5z" />
  </svg>
);

const StopIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 6h12v12H6V6z" />
  </svg>
);

const CancelIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.3 5.71L12 12l6.3 6.29-1.41 1.42L10.17 12l6.72-6.71 1.41 1.42zM5.7 18.29L12 12 5.7 5.71 7.11 4.3 13.83 11l-6.72 6.71-1.41-1.42z" />
  </svg>
);

// Main Component
const RecordingControlWidget = ({
  isPaused = false,
  isRecording = true,
  recordedTime = "00:00",
  pauseRecording,
  resumeRecording,
  onStop,
  onCancel, // new prop
}) => {
  const handlePauseAndResume = () => {
    if (isPaused) {
      resumeRecording();
    } else {
      pauseRecording();
    }
  };

  return (
    <WidgetContainer>
      <RecordingIndicator>
        <RecordingDot $isRecording={isRecording} $isPaused={isPaused} />
        <span>{isPaused ? "PAUSED" : "REC"}</span>
      </RecordingIndicator>

      <TimeDisplay>{formatTime(recordedTime)}</TimeDisplay>

      <PauseResumeButton
        $isPaused={isPaused}
        onClick={handlePauseAndResume}
        title={isPaused ? "Resume Recording" : "Pause Recording"}
      >
        {isPaused ? <PlayIcon /> : <PauseIcon />}
      </PauseResumeButton>

      <StopButton onClick={onStop} title="Stop Recording">
        <StopIcon />
      </StopButton>

      <CancelButton onClick={onCancel} title="Cancel Recording">
        <CancelIcon />
      </CancelButton>

      <ButtonText>{isPaused ? "Resume" : "Pause"} | Stop | Cancel</ButtonText>
    </WidgetContainer>
  );
};

export default RecordingControlWidget;
