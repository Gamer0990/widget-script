import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { generateUUID, isMicrophoneAvailable } from "../../utils/constant";
import {
  BugDetailBackgroundBlurCont,
  BugFormContainer,
  BugFormSubContainer,
  BugFormHeaderCont,
  BugFormHeaderAndRemoveWrapper,
  BugFormHeaderSubTitle,
  BugFormBodyCont,
  DropDownAlignCont,
  CustomDropDownCont,
  TotalOptionCont,
  DropDownOptionCont,
  DotDiv,
  BugRecordFormFooterCont,
  StartRecordingText,
  ErrorTextCont,
  BugRecordGuideCont,
  BugRecordGuideSubCont,
  BugRecordGuideCloseCont,
  BugRecordGuideImgCont,
  GuideContTitle,
  GuideContDesc,
} from "./BugReportForm-styled";
import closeIcon from "../../../public/bug-detail-close.svg";
import bugReportIcon from "../../../public/bug-report-icon.svg";

const BugDetailForm = ({
  setIsFormOpen,
  isFormOpen,
  makeProxyRequest,
  dispatch,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [guideShow, setGuideShow] = useState(() => {
    const storedValue = localStorage.getItem("guideShow");
    return storedValue !== null ? JSON.parse(storedValue) : true;
  });
  const [selectedPriority, setSelectedPriority] = useState("");
  const inputRef = useRef(null);
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
    clearErrors,
    setFocus,
  } = useForm({
    defaultValues: {
      bugId: "",
      bugType: "Bug",
      bugTitle: "",
      bugDescription: "",
      priority: "Low",
      captureType: "VIDEO",
    },
  });

  useEffect(() => {
    // window.chrome.storage.local.get(["bugRecordingDetails"], (res) => {
    //   setGuideShow(!res?.bugRecordingDetails?.guideContClosed);
    // });
    setFocus("bugTitle");
  }, []);

  const onSubmit = async (data) => {
    const result = await isMicrophoneAvailable();
    const generatedBugId = generateUUID();
    const payload = {
      ...data,
      bugId: generatedBugId,
      title: document?.title || "",
    };

    dispatch({ type: "FORMDETAILS", data: payload });
    makeProxyRequest(
      "API_REQUEST",
      "ADDBUGREPORTBEFORERECORDING",
      `flonnect/api/bugreports/add-bug-report`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: payload,
      }
    );

    setIsFormOpen(false);
  };

  const handlePrioritySelect = (priority) => {
    setValue("priority", priority);
    setSelectedPriority(priority);
    setIsDropdownOpen(false);
    clearErrors("priority");
  };

  const handleCloseGuide = () => {
    setGuideShow(false);
    localStorage.setItem("guideShow", JSON.stringify(false));
  };

  return (
    <BugDetailBackgroundBlurCont>
      <BugFormContainer>
        <form onSubmit={handleSubmit(onSubmit)}>
          <BugFormSubContainer>
            <BugFormHeaderCont>
              <BugFormHeaderAndRemoveWrapper>
                <div>Video Bug Title</div>
                <img
                  src={closeIcon}
                  draggable={false}
                  onClick={() => setIsFormOpen(!isFormOpen)}
                  alt="close "
                />
              </BugFormHeaderAndRemoveWrapper>
              <BugFormHeaderSubTitle>
                Enter the Video Bug Title here. This title will act as the
                "Video Bug Group Title", and each bug you report during
                recording will be logged as a sub-task under this group.
              </BugFormHeaderSubTitle>
            </BugFormHeaderCont>

            <BugFormBodyCont>
              <input
                ref={inputRef}
                type="text"
                placeholder="Video Bug Title"
                {...register("bugTitle", {
                  required: "Bug Title is required*",
                })}
              />

              <ErrorTextCont>
                {(errors.bugTitle ||
                  errors.bugDescription ||
                  errors.priority) && (
                  <span>
                    {errors.bugTitle?.message ||
                      errors.bugDescription?.message ||
                      errors.priority?.message}
                  </span>
                )}
              </ErrorTextCont>
            </BugFormBodyCont>

            <BugRecordFormFooterCont>
              <StartRecordingText as="button" type="submit">
                Start Recording
              </StartRecordingText>
            </BugRecordFormFooterCont>
          </BugFormSubContainer>
        </form>
      </BugFormContainer>

      {guideShow && (
        <BugRecordGuideCont>
          <BugRecordGuideSubCont>
            <BugRecordGuideCloseCont>
              <img
                src={closeIcon}
                draggable={false}
                onClick={handleCloseGuide}
                alt="close-icon"
              />
            </BugRecordGuideCloseCont>
            <BugRecordGuideImgCont>
              <img
                src={bugReportIcon}
                draggable={false}
                alt="bug-report-icon"
              />
            </BugRecordGuideImgCont>
            <GuideContTitle>Find Bug while Recording!</GuideContTitle>
            <GuideContDesc>
              Tap the "Find Bug" button to mark bugs you encounter while
              recording. Each will be logged as a subtask under the main
              'Primary Bug.'
            </GuideContDesc>
          </BugRecordGuideSubCont>
        </BugRecordGuideCont>
      )}
    </BugDetailBackgroundBlurCont>
  );
};

export default BugDetailForm;
