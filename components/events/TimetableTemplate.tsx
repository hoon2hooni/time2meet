import { Days, Pagination, Timetable } from "@components/events";
import { Eraser } from "@components/icons";
import styled from "@emotion/styled";
import type { Attendees } from "@eventsTypes";
import type { FC } from "react";
import { useRef, useState } from "react";
import type { Id } from "react-toastify";
import { toast } from "react-toastify";
type Props = {
  startDate: Date;
  endDate: Date;
  maxCapacity: number;
  attendees: Attendees;
  currentAttendee: string;
};

type EraserProps = {
  isEraseMode: boolean;
};
const TimetableTemplate: FC<Props> = ({
  startDate,
  endDate,
  maxCapacity,
  attendees,
  currentAttendee,
}) => {
  const [pageIndex, setPageIndex] = useState(0);
  const [isEraseMode, setIsEraseMode] = useState(false);
  const toastId = useRef<Id>("");
  const handleClickPageUp = () => {
    setPageIndex((index) => index + 1);
  };

  const handleClickPageDown = () => {
    setPageIndex((index) => index - 1);
  };

  return (
    <Container>
      <Pagination
        startDate={startDate}
        endDate={endDate}
        onClickPageUp={handleClickPageUp}
        onClickPageDown={handleClickPageDown}
        pageIndex={pageIndex}
      />
      <Wrapper>
        <EraserWrapper>
          <Text isEraseMode={isEraseMode}>지우개</Text>
          <EraserIconWrapper
            onClick={() => {
              setIsEraseMode((prev) => !prev);
              if (toast.isActive(toastId.current)) {
                toast.dismiss(toastId.current);
              }
              toastId.current = toast.success(
                `${isEraseMode ? "지우개 모드 해제!" : "지우개 모드 활성화!"}`
              );
            }}
          >
            <Eraser isEraseMode={isEraseMode} />
          </EraserIconWrapper>
        </EraserWrapper>
        <Days startDate={startDate} pageIndex={pageIndex} />
        <Timetable
          pageIndex={pageIndex}
          startDate={startDate}
          endDate={endDate}
          maxCapacity={maxCapacity}
          attendees={attendees}
          currentAttendee={currentAttendee}
          isEraseMode={isEraseMode}
        />
      </Wrapper>
    </Container>
  );
};

export default TimetableTemplate;

const EraserWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: auto;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;
const Text = styled.span<EraserProps>`
  font-size: 1.2rem;
`;
const Wrapper = styled.div`
  width: 100%;
  padding: 1rem 4rem;
  margin-top: 2rem;
  background-color: ${(props) => props.theme.colors.secondary};
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const Container = styled.div`
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const EraserIconWrapper = styled.div`
  @media (hover: hover) and (pointer: fine) {
    &:hover {
      opacity: 0.5;
      transition: all 0.2s ease-in-out;
    }
  }

  &:active {
    scale: 1.1;
  }
`;