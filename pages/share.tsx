import styled from "@emotion/styled";
import { Events } from "@eventsTypes";
import { useRouter } from "next/router";
import { useEffect } from "react";

const parseStringDateAndCombine = (date: string, pattern: string) => {
  const parsedDate = date.split(pattern);
  return `${parsedDate[0]}년 ${
    parsedDate[1][0] === "0" ? parsedDate[1][1] : parsedDate[1]
  }월 ${parsedDate[2][0] === "0" ? parsedDate[2][1] : parsedDate[2]}일`;
};

export default function Home() {
  const router = useRouter();
  const query = router.query as Record<keyof Events, string>;
  const { id, name, memberCount, startDate, endDate } = query || {};
  useEffect(() => {
    if (window.Kakao?.isInitialized()) {
      return;
    }
    window.Kakao?.init(process.env.NEXT_PUBLIC_KAKAO_API_KEY);
  }, []);

  const shareMessage = () => {
    window?.Kakao.Share.sendCustom({
      templateId: 87342,
      templateArgs: {
        id: id,
      },
    });
  };

  if (!id || !name || !memberCount || !startDate || !endDate) {
    return <div>잘못된 접근입니다.</div>;
  }

  return (
    <Layout>
      <WrapperMain>
        <Header>모임이 생성되었어요!</Header>
        <CalendarInfo>
          <TextHeader>{decodeURIComponent(name)}</TextHeader>

          <Text>
            참여 인원 <strong>{memberCount}</strong> 명
          </Text>
          <Text>
            <strong>{parseStringDateAndCombine(startDate, "-")}</strong> 부터
            <strong> {parseStringDateAndCombine(endDate, "-")}</strong>,
          </Text>
          <Text>
            <strong>오전 8</strong>시부터 <strong>24</strong>시 사이의
          </Text>
          <Text>일정을 매칭할게요</Text>
        </CalendarInfo>
        <Comment>
          <strong>카톡으로 링크를 공유하면 매칭이 시작되요</strong>
        </Comment>
        <Wrapper>
          <LinkBox>
            <TextSpan>{`https://timetomeet.vercel.app/events/${id}`}</TextSpan>
          </LinkBox>
          <Button onClick={shareMessage}>공유하기</Button>
        </Wrapper>
      </WrapperMain>
    </Layout>
  );
}

const Layout = styled.div`
  padding: 2rem 4rem;
  width: 100vw;
  height: calc(100vh - 20rem);
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const TextHeader = styled.div`
  color: ${(props) => props.theme.colors.primary};
  font-size: 2rem;
  font-weight: 700;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const CalendarInfo = styled.div`
  width: 100%;
  background-color: ${(props) => props.theme.colors.secondary};
  border-radius: 1rem;
  padding: 3.2rem 2rem;
  margin-bottom: 4rem;
`;

const WrapperMain = styled.main`
  max-width: 39rem;
  width: 100%;
  margin: 0 auto;
`;
const Header = styled.header`
  font-size: 3.2rem;
  font-weight: 700;
  color: ${(props) => props.theme.colors.yellow};
  margin-bottom: 2rem;
`;

const Text = styled.p`
  font-size: 1.4rem;
  line-height: 1.5;
  margin-bottom: 1rem;
  & > strong {
    font-weight: 700;
  }
`;

const Comment = styled.p`
  font-size: 1.6rem;
  font-weight: 700;
`;

const Wrapper = styled.div`
  display: flex;
  height: 4rem;
  margin-top: 2rem;
`;

const LinkBox = styled.div`
  background-color: ${(props) => props.theme.colors.secondary};
  height: 100%;
  padding: 0 1.3rem;
  font-size: 1.2rem;
  width: calc(100% - 12rem);
  display: flex;
  align-items: center;
  margin-right: 1rem;
  border-radius: 0.5rem;
`;
const TextSpan = styled.span`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const Button = styled.button`
  background-color: ${(props) => props.theme.colors.yellow};
  font-size: 1.6rem;
  font-weight: 700;
  border-radius: 0.5rem;
  width: 10rem;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 4rem;
  border: none;
`;
