/* global chrome */
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import {
  TotalBugIconCont,
  SubTaskBugIconCont,
  TotalSubtaskFormCont,
  SubtaskHeader,
  SubtaskHeading,
  SubtaskCloseIconCont,
  SubtaskBodyCont,
  BugTimeCont,
  BugTimeIconCont,
  TimerText,
  SubtaskFooterCont,
  CancelButtonCont,
  SaveButtonCont,
  DropDownAlignCont,
  CustomDropDownCont,
  DropDownOptionCont,
  TotalOptionCont,
  DotDiv,
  ErrorTextCont,
  ScreenShotLoaderDiv,
  ScreenShotText,
  ScreenShotLoader,
  LoaderChild,
  WithOutAnimationIconCont,
  PulseWrapper,
  TooltipContainer,
} from "./BugReportForm-styled";
import closeIcon from "../../../public/bug-detail-close.svg";
import bugReportIcon from "../../../public/bug-report-icon.svg";
import draggableDotIcon from "../../../public/dragable-icons.svg";
import SubTaskReportIcon from "../../../public/report-bug-icon.svg";
import subTaskReportHovericon from "../../../public/report-bug-hover-icon.svg";
import { formatTime } from "../../utils/constant";

const priorityOptions = ["High", "Medium", "Low"];

const BugSubtask = ({
  // openSubTaskForm,
  // setOpenSubtaskForm,
  // loader,
  // setLoader,
  makeProxyRequest,
  pauseRecording,
  resumeRecording,
  recordedTime,
  state,
  dispatch,
}) => {
  const { videoCaptureDetails, openSubTaskForm, loader } = state;
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [videoTime, setVideoTime] = useState(null);
  const [success, setSuccess] = useState(false);
  const [selectedPriority, setSelectedPriority] = useState("");
  const [isHover, setIsHover] = useState(false);
  const [showIntro, setShowIntro] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    setFocus,
    formState: { errors },
    clearErrors,
  } = useForm({
    defaultValues: {
      bugReportId: "",
      bugType: "Subtask",
      bugTitle: "",
      bugDescription: "",
      priority: "Low",
      bugImage: "",
      captureType: "VIDEO",
      videoTime: "",
    },
  });

  const handlePrioritySelect = (priority) => {
    setValue("priority", priority);
    setSelectedPriority(priority);
    setIsDropdownOpen(false);
    clearErrors("priority");
  };

  const onSubmit = (data) => {
    // setValue("videoTime", videoTime || "0");
    data["bugReportId"] = videoCaptureDetails?.id;
    data["videoTime"] = videoTime || "00:00";
    const payload = {
      ...data,
      bugImage: null,
    };
    dispatch({ type: "HANDLELOADER", data: true });

    // setLoader(true);

    makeProxyRequest(
      "API_REQUEST",
      "ADDSUBTASK",
      `flonnect/api/bugreports/add-bug-report`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: payload,
      }
    );
    // window.chrome.runtime.sendMessage({
    //   type: "SUB_TASK_ADDED",
    //   apiData: data,
    // });
    reset();
  };

  const renderError = () => {
    const message =
      errors.bugTitle?.message ||
      errors.bugDescription?.message ||
      errors.priority?.message;

    return message ? <ErrorTextCont>{message}</ErrorTextCont> : null;
  };

  const handleSuTaskIconClick = async (openSubTaskForm) => {
    if (!openSubTaskForm) {
      pauseRecording();
    } else {
      reset();
      setSelectedPriority("");
      resumeRecording();
    }
    dispatch({ type: "HANDLESUBTASKFORM", data: !openSubTaskForm });
    // setOpenSubtaskForm(!openSubTaskForm);
  };

  const checkShowIntro = async () => {
    if (!showIntro) {
      setShowIntro(true);

      const timer = setTimeout(() => {
        setShowIntro(false);
        // chrome.storage.local.set({ showIntro: false });
      }, 4000);

      return () => clearTimeout(timer);
    }
  };

  useEffect(() => {
    checkShowIntro();
  }, []);

  useEffect(() => {
    setFocus("bugDescription");
    setVideoTime(formatTime(recordedTime));
  }, [openSubTaskForm, setValue]);

  return (
    <>
      <TotalBugIconCont>
        <SubTaskBugIconCont
          onClick={() => handleSuTaskIconClick(openSubTaskForm)}
        >
          <WithOutAnimationIconCont>
            <img
              style={{ width: "18.08px", height: "18.08px" }}
              src={draggableDotIcon}
              alt="subtask-icon"
              draggable={false}
            />

            <div style={{ position: "relative" }}>
              <PulseWrapper
                onMouseEnter={() => !showIntro && setIsHover(true)}
                onMouseLeave={() => !showIntro && setIsHover(false)}
                className={
                  showIntro
                    ? "isActive"
                    : isHover || openSubTaskForm
                    ? "ishover"
                    : ""
                }
              >
                <img
                  src={
                    showIntro || isHover || openSubTaskForm
                      ? subTaskReportHovericon
                      : SubTaskReportIcon
                  }
                  alt="subtask-icon"
                  draggable={false}
                />
              </PulseWrapper>

              {showIntro && <TooltipContainer>Find a Bug</TooltipContainer>}
            </div>
          </WithOutAnimationIconCont>
        </SubTaskBugIconCont>
      </TotalBugIconCont>

      {openSubTaskForm && (
        <TotalSubtaskFormCont as="form" onSubmit={handleSubmit(onSubmit)}>
          <SubtaskHeader>
            <SubtaskHeading>Subtask</SubtaskHeading>
            <SubtaskCloseIconCont
              onClick={() => handleSuTaskIconClick(openSubTaskForm)}
            >
              <img src={closeIcon} alt="close" />
            </SubtaskCloseIconCont>
          </SubtaskHeader>

          <SubtaskBodyCont>
            {!loader ? (
              <>
                <BugTimeCont>
                  <BugTimeIconCont>
                    <img src={closeIcon} draggable={false} />
                  </BugTimeIconCont>
                  <TimerText>
                    Bug Time :
                    <span>
                      {""}
                      {videoTime}
                    </span>
                  </TimerText>
                </BugTimeCont>

                {/* <input
                  type="text"
                  placeholder="SubTask Title"
                  {...register("bugTitle", {
                    required: "SubTask Title is required*",
                  })}
                /> */}

                <textarea
                  placeholder="SubTask Description"
                  {...register("bugDescription", {
                    required: "Description is required*",
                  })}
                ></textarea>

                {renderError()}
              </>
            ) : (
              <>
                {success ? (
                  <ScreenShotLoaderDiv
                    style={{
                      height: "-webkit-fill-available",
                      width: "-webkit-fill-available",
                    }}
                  >
                    <ScreenShotText>Details Added Sucessfully</ScreenShotText>
                    {/* <ScreenShotLoader>
                                            <LoaderChild />
                                            <LoaderChild />
                                            <LoaderChild />
                                        </ScreenShotLoader> */}
                  </ScreenShotLoaderDiv>
                ) : (
                  <ScreenShotLoaderDiv
                    style={{
                      height: "-webkit-fill-available",
                      width: "-webkit-fill-available",
                    }}
                  >
                    <ScreenShotText>
                      Please Wait, Details are adding...
                    </ScreenShotText>
                    <ScreenShotLoader>
                      <LoaderChild />
                      <LoaderChild />
                      <LoaderChild />
                    </ScreenShotLoader>
                  </ScreenShotLoaderDiv>
                )}
              </>
            )}
          </SubtaskBodyCont>

          <SubtaskFooterCont>
            <CancelButtonCont
              type="button"
              onClick={() => handleSuTaskIconClick(openSubTaskForm)}
            >
              Cancel
            </CancelButtonCont>
            <SaveButtonCont as="button" type="submit">
              Save
            </SaveButtonCont>
          </SubtaskFooterCont>
        </TotalSubtaskFormCont>
      )}
    </>
  );
};

export default BugSubtask;
