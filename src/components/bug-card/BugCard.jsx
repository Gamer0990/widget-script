import React from "react";
import {
  BugCardContainer,
  CardHeader,
  BugTag,
  PriorityBadge,
  BugTitle,
  BugDescription,
  CardFooter,
  StatusBadge,
  Assignee,
  CardBody,
  AssignedUser,
  UnassignedUser,
} from "./BugCard.styled";
import { priorityOptions, statusOptions } from "../../utils/constant";
import { Tooltip } from "../embeded-bug-reportIcon/EmbededBugReportIcon.styled";
import avatarIcon from "../../../public/person.svg";

// const avatarIcon = window.chrome.runtime.getURL(
//   "./bug-report-images/person.svg"
// );

const BugCard = ({ bug }) => {
  const priority = bug?.bugPriority || "Medium";
  const bugStatus = bug?.bugStatus || "Pending";

  const priorityStyle =
    priorityOptions.find(
      (opt) => opt.value.toLowerCase() === priority.toLowerCase()
    ) || priorityOptions[1];

  const statusStyle =
    statusOptions.find(
      (opt) => opt.value.toLowerCase() === bugStatus.toLowerCase()
    ) || priorityOptions[1];
  return (
    <BugCardContainer>
      <CardBody>
        <CardHeader>
          <BugTag>Bug</BugTag>
          <PriorityBadge
            style={{
              backgroundColor: priorityStyle.backgroundColor,
              color: priorityStyle.textColor,
            }}
          >
            {bug?.bugPriority || "Medium"}
          </PriorityBadge>
        </CardHeader>
        <BugTitle>{bug?.bugTitle || "untitled"}</BugTitle>
        <BugDescription>{bug?.bugDescription || "NA"}</BugDescription>
      </CardBody>
      <CardFooter>
        <StatusBadge
          style={{
            backgroundColor: statusStyle.backgroundColor,
            color: statusStyle.textColor,
          }}
        >
          {bug?.bugStatus || "Pending"}
        </StatusBadge>

        {bug?.assigneeUsername ? (
          <AssignedUser>
            {bug?.assigneeUsername?.charAt(0)?.toUpperCase()}
            <Tooltip className="tooltip">{bug?.assigneeUsername}</Tooltip>
          </AssignedUser>
        ) : (
          <UnassignedUser>
            <img src={avatarIcon} width={22} height={22} alt="not-assign" />
          </UnassignedUser>
        )}
      </CardFooter>
    </BugCardContainer>
  );
};

export default BugCard;
