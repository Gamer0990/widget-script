import React, { useEffect, useState } from "react";
import {
  AlertContent,
  CloseButton,
  Message,
  RegularText,
  SignInButton,
  ToastAlert,
  ToastContainer,
} from "./Toast.styled";
import closeIcon from "../../../public/bug-detail-close.svg";

const Toast = ({ isVisible, onClose, message }) => {
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        handleClose();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 300);
  };

  if (!isVisible && !isClosing) return null;

  return (
    <ToastContainer isClosing={isClosing} id="flonnect-enterprise-toast">
      <ToastAlert>
        <AlertContent>
          <Message>
            <RegularText>{message}</RegularText>
            {/* <SignInButton onClick={()=>window.open("https://app.flonnect.com/", "_blank")}>Sign in</SignInButton> */}
          </Message>
          <CloseButton
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
          >
            <img src={closeIcon} alt="close-icon" />
          </CloseButton>
        </AlertContent>
      </ToastAlert>
    </ToastContainer>
  );
};

export default Toast;
