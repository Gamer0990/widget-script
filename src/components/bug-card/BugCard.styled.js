import styled from "styled-components";

// Main card container
export const BugCardContainer = styled.div`
  box-sizing: border-box;
  width: 256px;
  height: 122px;
  flex-shrink: 0;
  border-radius: 4px;
  border: 0.4px solid rgba(0, 0, 0, 0.1);
  background: #fff;
  box-shadow: 0.8px 1.2px 4.88px -0.8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export const CardBody = styled.div`
  padding: 10px;
  display: flex;
  flex-direction: column;
`;
// Header row: Bug type and priority
export const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

// Bug tag (left)
export const BugTag = styled.div`
  color: #667085;
  font-family: Inter;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 150%;
  text-decoration: underline;
`;

// Priority badge (right)
export const PriorityBadge = styled.div`
  font-size: 12px;
  font-weight: 500;
  padding: 2px 8px;
  border-radius: 4px;
`;

// Title
export const BugTitle = styled.div`
  margin-top: 4px;
  color: #404b59;
  font-family: Inter;
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: 150%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

// Description
export const BugDescription = styled.div`
  color: #667085;
  font-family: Inter;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 150%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

// Footer row
export const CardFooter = styled.div`
  padding: 6px 10px;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

// Status badge (left)
export const StatusBadge = styled.div`
  font-size: 12px;
  font-weight: 500;
  padding: 4px 8px;
  border-radius: 4px;
`;

// Assignee avatar or icon
export const Assignee = styled.div`
  width: 17px;
  height: 17px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  border-radius: 12.364px;
  border: 0.386px solid rgba(0, 0, 0, 0.08);
  background: #fff;
  box-shadow: 0px 1.545px 1.545px 0px rgba(0, 0, 0, 0.1);
`;

export const AssigneeContainer = styled.div`
  width: 22px;
  height: 22px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  position: relative;
`;

// Styled component for when assignee exists
export const AssignedUser = styled(AssigneeContainer)`
  border: 0.5px solid white;
  background: #667085;
  color: white;
  font-size: 10.154px;
  font-weight: normal;
  line-height: 150%;

  &:hover .tooltip {
    display: block;
  }
`;

// Tooltip styled component
export const Tooltip = styled.div`
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  padding: 4px 8px;
  background: #404b59;
  color: #fff;
  font-size: 12px;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  display: none;
  white-space: nowrap;
  margin-bottom: 8px;

  &::after {
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 6px solid transparent;
    border-top: 8px solid #404b59;
    border-right: 6px solid transparent;
  }
`;

// Styled component for unassigned state
export const UnassignedUser = styled(AssigneeContainer)`
  border: 0.386px solid rgba(0, 0, 0, 0.08);
  background: #fff;
  box-shadow: 0px 1.545px 1.545px 0px rgba(0, 0, 0, 0.1);
`;
