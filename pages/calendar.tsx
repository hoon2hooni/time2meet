import { Arrow } from "@components/icons";
import TimeTableInfo from "@components/timetables/TimeTableInfo";
import styled from "@emotion/styled";
import { db } from "@firebase/clientApp";
import { collection, onSnapshot, query } from "firebase/firestore";
import { useEffect, useState } from "react";

import data from "../data.schema.json";
import type { NextPageWithLayout } from "./_app";

type Times = number[];
function getDay(d: number) {
  const dayNames = ["일", "월", "화", "수", "목", "금", "토"];
  return dayNames[d % 7];
}
const New: NextPageWithLayout = () => {
  const [pageIndex, setPageIndex] = useState(0);
  const timeObj: Record<string, number> = {};
  data.attendees.forEach(({ availableDates }) => {
    availableDates.forEach((time) => {
      timeObj[time] = (timeObj[time] ?? 0) + 1;
    });
  });

  const startDay = new Date(data.startDate).getDate();
  const endDay = new Date(data.endDate).getDate();
  const startDayOfWeek = new Date(data.startDate).getDay();

  const dayTimeArray = new Array(7).fill(
    new Array(24 - 8).fill(0).map((_, i) => i + 8)
  ) as Times[];

  useEffect(() => {
    const collectionRef = collection(db, "events");
    const q = query(collectionRef);
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        console.log(doc.id, " => ", doc.data());
      });
    });
    return unsubscribe;
  }, []);
  return (
    <>
      <Container>
        <Header>가능한 시간을 입력하세요!</Header>
        <TimeTableInfo />
      </Container>
      <CurrentDay>
        <div style={{ transform: "rotate(-180deg)" }}>
          <Arrow />
        </div>
        15일 월요일
        <div>
          <Arrow />
        </div>
      </CurrentDay>
      <Wrapper>
        <Days>
          {new Array(7).fill(0).map((_, i) => {
            return (
              <EachDay key={i}>
                <div>{i + 7 * pageIndex + 11}일</div>
                <div>{getDay(startDayOfWeek + i)}</div>
              </EachDay>
            );
          })}
        </Days>
        <CalendarWrapper>
          {dayTimeArray.map((times, i) => {
            if (i === 0) {
              return (
                <EachTime key={i}>
                  {times.map((time, j) => (
                    <EachSmallTime key={i}>
                      <TimeUnit>{j + 8}:00</TimeUnit>
                      {
                        timeObj[
                          `2022/12/${i + 7 * pageIndex + startDay}/${j + 8}`
                        ]
                      }
                    </EachSmallTime>
                  ))}
                </EachTime>
              );
            } else {
              return (
                <EachTime key={i}>
                  {times.map((time, j) => (
                    <EachSmallTime
                      key={j}
                      onClick={() => {
                        console.log(`2022/12/${i + startDay}/${j + 8}`);
                      }}
                    >
                      {timeObj[`2022/12/${i + startDay}/${j + 8}`]}
                    </EachSmallTime>
                  ))}
                </EachTime>
              );
            }
          })}
        </CalendarWrapper>
      </Wrapper>
    </>
  );
};

export default New;

const Container = styled.div`
  padding: 2rem 4rem;
  width: 100%;
  height: 100%;
`;

const Header = styled.header`
  color: ${(props) => props.theme.colors.primary};
  display: flex;
  align-items: center;
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 2rem;
`;

const CurrentDay = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0rem 4rem;
  font-size: 1.5rem;
  font-weight: 700;
`;
const Wrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  padding: 1rem 4rem 2rem 4rem;
  margin-top: 2rem;
  background-color: ${(props) => props.theme.colors.secondary};
`;

const Days = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.3rem;
  width: 100%;
  margin-bottom: 1rem;
`;

const EachDay = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 1.2rem;
  gap: 0.3rem;
  height: 5.2rem;
  background-color: ${(props) => props.theme.colors.white};
`;

const CalendarWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.2rem;
`;

const EachTime = styled.div`
  border-radius: 0.3rem;
  display: grid;
  grid-template-rows: repeat(32, 2rem);
  gap: 0.2rem;
  height: 34rem;
`;
const TimeUnit = styled.div`
  position: absolute;
  top: -0.5rem;
  left: -3rem;

  font-size: 0.5rem;
  color: #585858;
`;

const EachSmallTime = styled.div`
  position: relative;
  height: 100%;
  background-color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${(props) => props.theme.colors.primary};
  font-size: 1.5rem;
`;
