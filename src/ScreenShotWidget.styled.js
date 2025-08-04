import styled from "styled-components";

// ========== Styled Components ==========
export const WidgetWrapper = styled.div`
  position: fixed;
  z-index: 999999;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  font-size: 14px;
  display: ${({ visible }) => (visible ? "block" : "none")};
  ${({ position }) =>
    ({
      "bottom-right": "bottom: 20px; right: 20px;",
      "bottom-left": "bottom: 20px; left: 20px;",
      "top-right": "top: 20px; right: 20px;",
      "top-left": "top: 20px; left: 20px;",
    }[position])}
`;

export const WidgetContainer = styled.div`
  background-color: ${({ themeStyle }) => themeStyle.bg};
  border: 1px solid ${({ themeStyle }) => themeStyle.border};
  border-radius: 8px;
  padding: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  min-width: 200px;
  max-width: 300px;
`;

export const ScreenshotButton = styled.button`
  background-color: ${({ isCapturing, themeStyle }) =>
    isCapturing ? "#6c757d" : themeStyle.button};
  color: ${({ themeStyle }) => themeStyle.buttonText};
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  cursor: ${({ isCapturing }) => (isCapturing ? "not-allowed" : "pointer")};
  font-size: 14px;
  font-weight: 500;
  width: 100%;
  transition: background-color 0.2s;

  &:hover {
    opacity: ${({ isCapturing }) => (isCapturing ? 1 : 0.9)};
  }
`;

export const StatusText = styled.div`
  color: ${({ themeStyle }) => themeStyle.text};
  font-size: 12px;
  margin-top: ${({ status }) => (status ? "8px" : "0")};
  text-align: center;
  opacity: ${({ status }) => (status ? 1 : 0)};
  transition: opacity 0.2s;
`;
