import styled, { keyframes } from "styled-components";

export const scaleUp = keyframes`
  0% { transform: scale(0); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
`;

export const Tooltip = styled.div`
  position: absolute;
  top: 50%;
  right: 100%;
  transform: translateY(-50%);
  z-index: 10;
  padding: 4px 8px;
  background: #404b59;
  color: #fff;
  font-size: 12px;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  display: none;
  white-space: nowrap;
  margin-right: 8px;

  &::after {
    content: "";
    position: absolute;
    top: 50%;
    left: 100%;
    transform: translateY(-50%);
    width: 0;
    height: 0;
    border-top: 6px solid transparent;
    border-left: 8px solid #404b59;
    border-bottom: 6px solid transparent;
  }
`;

export const BugButtonContainer = styled.div`
  position: fixed;
  right: 1%;
  bottom: 143px;
  z-index: 99999999;
`;

export const TooltipContainer = styled.div`
  position: absolute;
  top: 50%;
  right: 110%; /* changed from left to right */
  transform: translateY(-50%);
  margin-right: 8px; /* use margin-right instead of margin-left */
  padding: 4px 8px;
  background: #ffe6ea;
  color: #f0648c;
  font-size: 13px;
  font-weight: 500;
  font-family: Inter, sans-serif;
  white-space: nowrap;
  border-radius: 4px;
  z-index: 10;

  &::after {
    content: "";
    position: absolute;
    right: -6px; /* position arrow on right */
    top: 50%;
    transform: translateY(-50%);
    width: 0;
    height: 0;
    border-top: 6px solid transparent;
    border-bottom: 6px solid transparent;
    border-left: 8px solid #ffe6ea; /* point arrow to the left */
  }
`;

export const BugButton = styled.button`
  width: 70px;
  height: 70px;
  position: relative;
  background-color: #f43f5e;
  border: none;
  border-radius: 50%;
  padding: 12px;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  color: white;
  transition: transform 0.2s;

  &::before {
    content: "";
    position: absolute;
    inset: -3px;
    border-radius: 50%;
    transition: filter 0.2s;
    z-index: 0;
  }

  &:hover {
    transform: scale(1.1);

    &::before {
      border: 2px solid #ff89ab;
      filter: blur(2.6px);
    }
  }
`;

export const PopupPanel = styled.div`
  position: fixed;
  right: 0.8%;
  bottom: 205px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  transform: scale(${(props) => (props.visible ? 1 : 0)});
  opacity: ${(props) => (props.visible ? 1 : 0)};
  transform-origin: right bottom;
  transition: transform 0.3s ease, opacity 0.3s ease;
  padding: 16px;
`;

export const ActionBtnContainer = styled.div`
  position: relative;
`;

export const ActionBtn = styled.div`
  width: 50px;
  height: 50px;
  flex-shrink: 0;
  background: #f9fcff;
  stroke-width: 1px;
  stroke: rgba(0, 0, 0, 0.1);
  filter: drop-shadow(0px 2.5px 2.5px rgba(0, 0, 0, 0.1));
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  position: relative;
  border: 1px solid rgba(0, 0, 0, 0.1);
  z-index: 9999;

  &::before {
    content: "";
    position: absolute;
    inset: -3px;
    border-radius: 50%;
    transition: filter 0.2s;
    z-index: 0;
  }

  &:hover {
    transform: scale(1.01);
    background: #fff9fa; /* custom hover background */
    border: 1px solid #f0648c;

    &::before {
      border: 1px solid #ff89ab;
      filter: blur(2.6px);
    }
  }
`;

export const ToolTipForReport = styled.div`
  position: absolute;
  top: 50%;
  right: 92%; /* changed from left to right */
  transform: translateY(-50%);
  padding: 4px 8px;
  background: #ffe6ea;
  color: #c92121;
  font-size: 13px;
  font-weight: 500;
  font-family: Inter, sans-serif;
  white-space: nowrap;
  border-radius: 4px;
  border-radius: 8px 0px 0px 8px;
  // border: 1px solid rgba(0, 0, 0, 0.1);
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  border-left: 1px solid rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  background: #fff9fa;
  box-shadow: 0px 1px 1px 0px rgba(0, 0, 0, 0.05);
`;

export const TooltipForActionBtn = styled.div`
  position: absolute;
  top: 50%;
  right: 110%; /* changed from left to right */
  transform: translateY(-50%);
  margin-right: 8px; /* use margin-right instead of margin-left */
  padding: 4px 8px;
  background: #667085;
  color: #fff;
  font-size: 13px;
  font-weight: 500;
  font-family: Inter, sans-serif;
  white-space: nowrap;
  border-radius: 4px;
  z-index: 10;

  &::after {
    content: "";
    position: absolute;
    right: -6px; /* position arrow on right */
    top: 50%;
    transform: translateY(-50%);
    width: 0;
    height: 0;
    border-top: 6px solid transparent;
    border-bottom: 6px solid transparent;
    border-left: 8px solid #667085; /* point arrow to the left */
  }
`;

export const BugCardsContainer = styled.div`
  position: fixed;
  right: 1%;
  bottom: 184px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 280px;
  height: 416px;
  border-radius: 4px;
  border: 1px solid #6528f7;
  background: #fff9fa;
  z-index: 99999999;
`;
export const BugCardsContainerHeader = styled.div`
  display: flex;
  padding: 12px 12px 0 12px; /* top: 12px, right: 12px, bottom: 0, left: 12px */
  align-items: center;
  gap: 3px;
  color: #404b59;

  font-family: Inter;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 150%;
`;

export const BugListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 7px;
  flex: 1;
  overflow-x: hidden;
  overflow-y: auto;
  padding: 12px;
`;

export const CloseIconContainer = styled.div`
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  border: 1px solid rgba(0, 0, 0, 0.1);
  background: #fff;
  position: fixed;
  right: 6.5%;
  bottom: 135px;
  display:flex;
  justify-content:center: 
  align-items:center;
  cursor:pointer;
  border-radius:50%;
  z-index: 99999999;

`;

export const EmptyStateMessage = styled.div`
  flex: 1;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #a0a0a0; /* light gray */
  font-size: 14px;
  font-weight: 500;
`;
