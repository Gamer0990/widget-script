/* global chrome */

import React, { useState } from "react";
import {
  ActionBtn,
  ActionBtnContainer,
  BugButton,
  BugButtonContainer,
  BugCardsContainer,
  BugCardsContainerHeader,
  BugListContainer,
  CloseIconContainer,
  EmptyStateMessage,
  PopupPanel,
  TooltipContainer,
  TooltipForActionBtn,
  ToolTipForReport,
} from "./EmbededBugReportIcon.styled";
import closeIcon from "../../../public/bug-detail-close.svg";
import subTaskReportHovericon from "../../../public/report-bug-hover-icon.svg";
import embededCaptureIcon from "../../../public/embededCaptureIcon.svg";
import embededCaptureHoverIcon from "../../../public/embededCaptureHoverIcon.svg";
import embededRecordIcon from "../../../public/embededRecordIcon.svg";
import embededRecordHoverIcon from "../../../public/embededRecordHoverIcon.svg";
import embededReportIcon from "../../../public/embededReportIcon.svg";
import embededReportHoverIcon from "../../../public/embededReportHoverIcon.svg";
import BugCard from "../bug-card/BugCard";
import html2canvas from "html2canvas";
import { useGlobal } from "../../context/globalContext";
import { generateUUID } from "../../utils/constant";

const actinBtns = [
  {
    id: 1,
    title: "report",
    icon: embededReportIcon,
    hoverIcon: embededReportHoverIcon,
    toolTipText: "Bugs",
  },
  {
    id: 2,
    title: "record",
    icon: embededRecordIcon,
    hoverIcon: embededRecordHoverIcon,
    toolTipText: "Take Screen Record",
  },
  {
    id: 3,
    title: "capture",
    icon: embededCaptureIcon,
    hoverIcon: embededCaptureHoverIcon,
    toolTipText: "Take Screenshot",
  },
];

const EmbededBugReportIcon = ({
  state,
  setIsCapture,
  setIsRecording,
  setIsFormOpen,
  bugData,
  makeProxyRequest,
  base64Ref,
}) => {
  const { user } = state;
  const [showTooltip, setShowTooltip] = useState(false);
  const [open, setOpen] = useState(false);
  const [hoveredBtnId, setHoveredBtnId] = useState(null);
  const [isBugCardIconClicked, setIsBugCardIconClicked] = useState(false);
  const [toastShow, setToastShow] = useState(false);

  const captureScreenshot = async () => {
    console.log("came");
    try {
      await new Promise((resolve) => setTimeout(resolve, 100));

      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const scrollX = window.scrollX;
      const scrollY = window.scrollY;

      const canvas = await html2canvas(document.body, {
        width: viewportWidth,
        height: viewportHeight,
        x: scrollX,
        y: scrollY,
        windowWidth: viewportWidth,
        windowHeight: viewportHeight,
      });

      // ✅ Get base64-encoded PNG image
      const base64Image = canvas.toDataURL("image/png");

      return base64Image;
    } catch (error) {
      console.error("Error capturing screenshot:", error);
    } finally {
      setIsCapture(false);
    }
  };

  const handleActionBtnClick = async (actionType) => {
    // if (!bugData) {
    //   setToastShow(true);
    //   return;
    // }
    console.log("actionType", actionType);
    if (actionType === "capture") {
      // setHasDomainProject(false);
      setIsCapture(true);
      const name = user?.user?.email?.split("@")[0];
      const documentId = generateUUID();
      const currentTimestampInSeconds = Math.floor(Date.now() / 1000);
      const base64Url = await captureScreenshot();
      base64Ref.current = base64Url;
      // setIsCapture(false);
      let fileName = `${name}/${documentId}/${currentTimestampInSeconds}`;

      const data = {
        id: documentId,
        fileName: fileName,
      };
      console.log("data", data);
      makeProxyRequest("GETPRSIGNURL", `flonnect/api/uploads/getpresignedurl`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: data,
      });
    } else if (actionType === "record") {
      setIsFormOpen(true);
    } else if (actionType === "report") {
      setHoveredBtnId(null);
      setIsBugCardIconClicked(true);
    }
  };

  return (
    <>
      {!isBugCardIconClicked ? (
        <BugButtonContainer>
          {/* {showTooltip && <div>Report a Bug</div>} */}
          <BugButton
            onClick={() => setOpen((prev) => !prev)}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            <img
              src={subTaskReportHovericon}
              alt="subtask-icon"
              draggable={false}
            />

            {showTooltip && !open && bugData && (
              <TooltipContainer>{bugData?.bugCount} Bugs</TooltipContainer>
            )}
          </BugButton>

          <PopupPanel visible={open}>
            {actinBtns.map((btn) => (
              <ActionBtnContainer>
                <ActionBtn
                  onMouseEnter={() => setHoveredBtnId(btn?.id)}
                  onMouseLeave={() => setHoveredBtnId(null)}
                  key={btn?.id}
                  onClick={() => handleActionBtnClick(btn?.title)}
                >
                  <img
                    src={hoveredBtnId === btn?.id ? btn?.hoverIcon : btn?.icon}
                    alt={btn?.title}
                  />
                </ActionBtn>

                {/* tool tip  */}
                {btn?.title === "report" && bugData ? (
                  <ToolTipForReport>{bugData?.bugCount} Bugs</ToolTipForReport>
                ) : (
                  hoveredBtnId === btn?.id && (
                    <TooltipForActionBtn>
                      {btn?.toolTipText}
                    </TooltipForActionBtn>
                  )
                )}
              </ActionBtnContainer>
            ))}
          </PopupPanel>
        </BugButtonContainer>
      ) : (
        <>
          <BugCardsContainer>
            <BugCardsContainerHeader>
              <img src={embededReportIcon} alt="report-icon" />
              <span>{bugData?.bugCount} Bugs:</span>
            </BugCardsContainerHeader>
            <BugListContainer>
              {bugData?.bugs?.length > 0 ? (
                bugData.bugs.map((bug) => <BugCard key={bug?.id} bug={bug} />)
              ) : (
                <EmptyStateMessage>No bug reports found</EmptyStateMessage>
              )}
            </BugListContainer>
          </BugCardsContainer>
          {/* close icon  */}
          <CloseIconContainer>
            <img
              src={closeIcon}
              draggable={false}
              onClick={() => setIsBugCardIconClicked(false)}
              alt="close "
            />
          </CloseIconContainer>
        </>
      )}
      {toastShow && (
        <Toast
          isVisible={toastShow}
          onClose={() => setToastShow(false)}
          message="Sign in to continue with your organization"
        />
      )}
    </>
  );
};

export default EmbededBugReportIcon;
