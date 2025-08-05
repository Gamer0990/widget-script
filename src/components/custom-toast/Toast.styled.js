import styled, { keyframes } from "styled-components";

const slideIn = keyframes`
  from {
    transform: translate(-50%, -100%);
    opacity: 0;
  }
  to {
    transform: translate(-50%, 0);
    opacity: 1;
  }
`;

const slideOut = keyframes`
  from {
    transform: translate(-50%, 0);
    opacity: 1;
  }
  to {
    transform: translate(-50%, -100%);
    opacity: 0;
  }
`;

export const ToastContainer = styled.div`
  position: fixed;
  top: 1rem;
  left: 50%;
  z-index: 99999999999999999;
  animation: ${({ isClosing }) => (isClosing ? slideOut : slideIn)} 0.2s
    ease-out;
  animation-fill-mode: forwards;
`;

export const ToastAlert = styled.div`
  //   width: 20rem;
  padding: 1rem;
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: background-color 0.2s;

  //   &:hover {
  //     background-color: #f8f9fa;
  //   }
`;

export const AlertContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const Message = styled.span`
  flex: 1;
  font-size: 16px;
  font-family: inter;
  display: flex;
  gap: 0.5rem;
  color: #333;
  align-items: center;
`;

export const RegularText = styled.span`
  white-space: nowrap;
  color: red;
`;

export const SignInButton = styled.button`
  background: #7534ff;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
`;

export const CloseButton = styled.button`
  margin-left: 0.5rem;
  padding: 0.25rem;
  border-radius: 9999px;
  border: none;
  background: transparent;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #e9ecef;
  }
`;
