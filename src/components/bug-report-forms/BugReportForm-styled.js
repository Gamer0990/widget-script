import styled, { keyframes } from "styled-components";

export const BugDetailBackgroundBlurCont = styled.div`
  background: rgba(30, 33, 38, 0.6);
  display: flex;
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 99999999999;
`;

export const BugFormContainer = styled.div`
  width: 684px;
  height: 300px;
  flex-shrink: 0;
  border-radius: 4px;
  background: #fff;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 999;
`;

export const BugFormSubContainer = styled.div`
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const BugFormHeaderCont = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const BugFormHeaderAndRemoveWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  div {
    font-family: Inter;
    font-size: 16px;
    font-weight: 500;
    line-height: 24px;
    letter-spacing: 0.30000001192092896px;
    text-align: left;
    color: #404b59;
  }
  img {
    cursor: pointer;
    width: 20px;
    height: 20px;
  }
`;

export const BugFormHeaderSubTitle = styled.div`
  color: #667085;
  font-feature-settings: "liga" off, "clig" off;
  font-family: Inter;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 150%;
`;

export const BugFormBodyCont = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;

  input {
    display: flex;
    width: 634px;
    height: 40px;
    padding: 0px 8px;
    align-items: center;
    gap: 10px;
    flex-shrink: 0;
    border-radius: 4px;
    background: #f7f8fa;
    outline: none;
    box-sizing: border-box;
    color: #404b59;
    font-feature-settings: "liga" off, "clig" off;
    font-family: Inter;
    font-size: 14px;
    font-style: normal;
    font-weight: 500;
    line-height: 17.194px;
    /* 122.814% */
    letter-spacing: 0.3px;
    border: 1px solid transparent; /* <-- Add this */

    &:focus {
      border-color: #6528f7; /* <-- Now this works */
    }
  }

  textarea {
    display: flex;
    height: 110px;
    padding: 10px 8px;
    align-items: flex-start;
    gap: 10px;
    flex-shrink: 0;
    align-self: stretch;
    border-radius: 4px;
    background: #f7f8fa;
    resize: none;
    outline: none;
    color: #667085;
    font-feature-settings: "liga" off, "clig" off;
    font-family: Inter;
    font-size: 14px;
    font-style: normal;
    font-weight: 500;
    line-height: 17.194px;
    /* 122.814% */
    letter-spacing: 0.3px;
    border: none;
  }
`;
export const DropDownAlignCont = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
`;
export const CustomDropDownCont = styled.div`
  height: 40px;
  border-radius: 4px;
  background: #f7f8fa;
  padding-left: 12px;
  padding-right: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: Inter;
  font-size: 14px;
  font-weight: 400;
  line-height: 17.19px;
  letter-spacing: 0.30000001192092896px;
  text-align: left;
  color: #667085;
  cursor: pointer;
`;
export const TotalOptionCont = styled.div`
  background: #ffffff;
  position: absolute;
  border-radius: 4px;
  width: 100%;
  /* top: 41px; */
  z-index: 9999999999;
  top: 41px;
  height: 110px;
`;
export const DropDownOptionCont = styled.div`
  height: 37px;
  align-items: center;
  cursor: pointer;
  &:hover {
    background: #f7f4ff;
  }

  display: flex;
  gap: 10px;
  padding-left: 12px;
  span {
    font-family: Inter;
    font-size: 14px;
    font-weight: 400;
    line-height: 21px;
    letter-spacing: 0.30000001192092896px;
    text-align: left;
    color: #667085;
  }
`;

export const DotDiv = styled.div`
  width: 8px;
  height: 8px;
  background: ${(props) =>
    props?.condition === "High"
      ? "#FF4060"
      : props?.condition === "Medium"
      ? "#FF8040"
      : "#6080A0"};
  border-radius: 50%;
`;

export const BugRecordFormFooterCont = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: Inter;
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
  letter-spacing: 0.005em;
  text-align: left;
`;

export const StartRecordingText = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 396px;
  height: 48px;
  padding: 10px;
  background-color: #6528f7;
  color: #ffffff;
  font-size: 16px;
  font-weight: 600;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  user-select: none;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #4908e2;
  }

  color: #fff;

  font-family: Inter;
  font-style: normal;
  line-height: 150%; /* 24px */
  letter-spacing: 0.08px;
`;

export const ErrorTextCont = styled.div`
  width: 100%;
  height: 10px;
  font-family: Inter;
  font-style: normal;
  font-weight: 400;
  font-size: 11.8443px;
  line-height: 13px;
  letter-spacing: 0.323026px;
  color: rgb(255, 59, 48);
  display: flex;
  -webkit-box-pack: start;
  justify-content: flex-start;
`;

// GuideCont

export const BugRecordGuideCont = styled.div`
  width: 388px;
  height: 252px;
  flex-shrink: 0;
  border-radius: 4px;
  background: #f7f4ff;
  position: fixed;
  bottom: 46px;
  right: 15px;
`;

export const BugRecordGuideSubCont = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
`;
export const BugRecordGuideCloseCont = styled.div`
  display: flex;
  justify-content: flex-end;
  cursor: pointer;
`;

export const BugRecordGuideImgCont = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  img {
    height: 66px;
    width: 66px;
  }
`;
export const GuideContTitle = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: #404b59;
  font-feature-settings: "liga" off, "clig" off;
  font-family: Inter;
  font-size: 18px;
  font-style: normal;
  font-weight: 600;
  line-height: 150%;
  /* 27px */
  letter-spacing: 0.3px;
`;
export const GuideContDesc = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 2px;
  text-align: center;
  padding: 0px 21px;
  color: #667085;
  text-align: center;
  font-feature-settings: "liga" off, "clig" off;
  font-family: Inter;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 150%;
  /* 21px */
  letter-spacing: 0.3px;
`;

//subtask components
export const TotalBugIconCont = styled.div`
  // width: 265px;
  height: 158px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  position: fixed;
  bottom: 100px;
  right: 1%;
  z-index: 99999999999;
`;

export const SubTaskBugIconCont = styled.div`
  width: 118px;
  height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  img {
    width: 80%;
    height: 80%;
  }
`;

export const WithOutAnimationIconCont = styled.div`
  display: flex;
  gap: 13px;
  align-items: center;
`;

export const PulseWrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 80px;
  height: 80px;
  background: white;
  border: 2px solid #f0648c;
  border-radius: 50%;
  user-select: none;
  cursor: pointer;

  img {
    width: 48px;
    height: 48px;
    z-index: 1;
    object-fit: contain;
  }

  &.ishover {
    background: #f0648c;
    border: 2px solid #fff;
  }

  &.isActive {
    transition: all 0.3s ease-out;
    background: #f0648c;
    border: 1px solid white;

    &::before {
      content: "";
      position: absolute;
      top: -6px;
      left: -6px;
      right: -6px;
      bottom: -6px;
      border-radius: 50%;
      border: 2px solid #ff89ab;
      background: #ff89ab;
      filter: blur(1.599999904632568px);
      animation: pulse 1.5s ease-in-out infinite;
      z-index: 0;
    }
  }

  @keyframes pulse {
    0% {
      transform: scale(0.9);
      opacity: 0.5;
    }
    50% {
      transform: scale(1.1);
      opacity: 0.2;
    }
    100% {
      transform: scale(0.9);
      opacity: 0.6;
    }
  }
`;

export const TooltipContainer = styled.div`
  position: absolute;
  top: 110%;
  left: 50%;
  transform: translateX(-50%);
  margin-top: 8px;
  padding: 4px 8px;
  background: #ffe6ea;
  color: #f0648c;
  font-size: 13px;
  font-weight: 500;
  font-family: Inter;
  white-space: nowrap;
  border-radius: 4px;
  z-index: 10;

  &::after {
    content: "";
    position: absolute;
    top: -6px;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-bottom: 8px solid #ffe6ea;
  }
`;

export const TotalVideoControlsCont = styled.div`
  width: 265px;
  height: 64px;
  background: #111111;
  border-radius: 8px;
  border: 0.4px solid #ffffff33;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 14px;
  input[type="color"] {
    position: absolute;
    width: 24px;
    height: 24px;
    right: 78px;
    opacity: 0;
    cursor: pointer;
  }

  position: relative;
`;

export const VideoControlOptionCont = styled.div`
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  background: white;
`;

export const TotalTimerCont = styled.div`
  width: 121px;
  height: 40px;
  border-radius: 33px;
  border: 1px solid #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
`;

export const PlayPauseAlignCont = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`;

export const PausePlayCont = styled.div`
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  cursor: pointer;
`;

export const TimerText = styled.div`
  display: flex;
  gap: 6px;
  color: #667085;

  font-family: Inter;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 150%; /* 18px */
  letter-spacing: 0.06px;

  span {
    color: #404b59;
  }
`;

// SubtaskForm

export const TotalSubtaskFormCont = styled.form`
  width: 340px;
  height: 300px;

  display: flex;
  flex-direction: column;
  position: fixed;
  z-index: 9999999999999;
  bottom: 12%;
  right: 150px;
  border-radius: 4px;
  background: #fff;
  box-shadow: 0px 2px 2px 0px rgba(0, 0, 0, 0.1);
`;

export const SubtaskHeader = styled.div`
  width: 100%;
  height: 48px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 20px;
  padding-right: 20px;
  border-bottom: 0.5px solid #00000026;
  box-sizing: border-box;
`;

export const SubtaskHeading = styled.div`
  font-family: Inter;
  font-size: 14px;
  font-weight: 500;
  line-height: 21px;
  letter-spacing: 0.30000001192092896px;
  text-align: left;
  color: #404b59;
`;
export const SubtaskCloseIconCont = styled.div`
  width: 20px;
  height: 20px;
  cursor: pointer;
`;

export const SubtaskBodyCont = styled.div`
  width: 100%;
  flex: 1;
  padding-left: 20px;
  padding-right: 20px;
  box-sizing: border-box;
  gap: 10px;
  padding-top: 10px;
  display: flex;
  flex-direction: column;
  input {
    display: flex;
    width: 100%;
    height: 40px;
    padding: 0px 8px;
    align-items: center;
    gap: 10px;
    flex-shrink: 0;
    border-radius: 4px;
    background: #f7f8fa;
    outline: none;
    box-sizing: border-box;
    color: #667085;
    font-feature-settings: "liga" off, "clig" off;
    font-family: Inter;
    font-size: 14px;
    font-style: normal;
    font-weight: 500;
    line-height: 17.194px;
    /* 122.814% */
    letter-spacing: 0.3px;
    border: 1px solid transparent; /* <-- Add this */

    &:focus {
      border-color: #6528f7; /* <-- Now this works */
    }
  }

  textarea {
    display: flex;
    width: 100%;
    height: 90px;
    padding: 0px 8px;
    align-items: center;
    gap: 10px;
    flex-shrink: 0;
    border-radius: 4px;
    outline: none;
    box-sizing: border-box;
    color: #404b59;
    font-feature-settings: "liga" off, "clig" off;
    font-family: Inter;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 17.194px;
    /* 122.814% */
    letter-spacing: 0.3px;

    resize: unset;
    padding-top: 10px;
    border-radius: 4px;
    border: 0.5px solid rgba(0, 0, 0, 0.2);
    background: #fff;
    overflow-y: auto;

    &:focus {
      border-color: #6528f7; /* <-- Now this works */
    }
  }
`;

export const BugTimeCont = styled.div`
  border: 0.5px solid #00000033;
  display: flex;
  height: 36px;
  align-items: center;
  gap: 4px;
  padding-left: 8px;
  border-radius: 5px;
  background: #f7f8fa;
`;

export const BugTimeIconCont = styled.div`
  height: 20px;
  width: 20px;
`;

export const SubtaskFooterCont = styled.div`
  width: 100%;
  height: 74px;
  border-top: 0.5px solid #00000026;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding-right: 20px;
  box-sizing: border-box;
  gap: 14px;
`;

export const CancelButtonCont = styled.div`
  border: 1px solid #667085;
  width: 90px;
  height: 34px;
  border-radius: 4px;
  font-family: Inter;
  font-size: 12px;
  font-weight: 400;
  line-height: 18px;
  letter-spacing: 0.005em;
  text-align: left;
  color: #667085;
  display: flex;
  justify-content: center;
  align-items: center;
  background: white;
  cursor: pointer;
`;

export const SaveButtonCont = styled.button`
  background: #6528f7;
  border-radius: 4px;
  border: 1px solid #6528f7;
  font-family: Inter;
  font-size: 12px;
  font-weight: 600;
  line-height: 18px;
  letter-spacing: 0.005em;
  text-align: left;
  color: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 34px;
  width: 78px;
  cursor: pointer;
`;

export const ScreenShotLoaderDiv = styled.div`
  width: 390px;
  height: 336px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  background: #ffffff;
  gap: 30px;
  flex-direction: column;
`;

export const ScreenShotText = styled.div`
  font-family: Inter;
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
  text-align: center;
  color: #667085;
  width: 80%;
`;

export const ScreenShotLoader = styled.div`
  display: flex;
  align-items: center;
`;

const floJump = keyframes`
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-10px);
  }
`;

export const LoaderChild = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #6528f7;
  margin: 0 5px;
  animation: ${floJump} 0.6s ease-in-out infinite alternate;

  &:nth-child(2) {
    animation-delay: 0.2s;
  }

  &:nth-child(3) {
    animation-delay: 0.4s;
  }
`;
