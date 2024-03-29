import styled from "@emotion/styled";
import { getEventDocRef } from "@firebase/clientApp";
import { dateToPattern } from "@lib/days";
import type { NewEvent } from "@newTypes";
import { Button, EventInfo, MetaOgTwitterUrl, Retention, Toast } from "@ui";
import { getDoc } from "firebase/firestore";
import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Script from "next/script";
import { useEffect, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
export default function Home({
  id,
  name,
  maxCapacity,
  endDate,
  startDate,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  //TODO 토스트 관련 더 좋은 방법 찾기
  const [isKakaoLoaded, setIsKakaoLoaded] = useState(false);
  const [showToast, setShowToast] = useState(0);
  useEffect(() => {
    if (window.Kakao?.isInitialized()) {
      return;
    }
    window.Kakao?.init(process.env.NEXT_PUBLIC_KAKAO_API_KEY);
  }, [isKakaoLoaded]);

  const shareMessage = () => {
    window?.Kakao.Share.sendCustom({
      templateId: 87342,
      templateArgs: {
        id,
      },
    });
  };

  return (
    <>
      <MetaOgTwitterUrl path={`/events/${id}`} />
      <Script
        src="https://developers.kakao.com/sdk/js/kakao.js"
        onLoad={() => {
          setIsKakaoLoaded(true);
        }}
      />
      <Layout>
        <WrapperMain>
          <Header>모임이 생성되었어요!</Header>
          <EventInfo
            name={name}
            maxCapacity={maxCapacity}
            startDate={startDate}
            endDate={endDate}
          />
          <Comment>
            <strong>카톡으로 링크를 공유하면 매칭이 시작되요</strong>
          </Comment>
          {showToast > 0 && (
            <Toast message="링크가 복사 되었습니다!" key={showToast} />
          )}
          <Wrapper>
            <LinkBox>
              <CopyToClipboard
                text={`${process.env.NEXT_PUBLIC_DOMAIN_URL}/events/${id}`}
                onCopy={() => {
                  setShowToast((prev) => prev + 1);
                }}
              >
                <TextSpan>{`${process.env.NEXT_PUBLIC_DOMAIN_URL}/events/${id}`}</TextSpan>
              </CopyToClipboard>
            </LinkBox>
            <Button onClick={shareMessage} disabled={!isKakaoLoaded}>
              공유하기
            </Button>
          </Wrapper>
        </WrapperMain>
        <Retention />
      </Layout>
    </>
  );
}

export const getServerSideProps: GetServerSideProps<
  NewEvent & { id: string }
> = async (context) => {
  const id = (context?.query?.id || "") as string;
  if (!id) {
    return {
      notFound: true,
    };
  }

  const eventSnapshot = await getDoc(getEventDocRef(id));
  if (!eventSnapshot.exists()) {
    return {
      notFound: true,
    };
  }

  const eachEvent = eventSnapshot.data();
  const { name, maxCapacity } = eachEvent;
  const startDate = dateToPattern(eachEvent.startDate.toDate());
  const endDate = dateToPattern(eachEvent.endDate.toDate());

  return {
    props: { id, name, maxCapacity, startDate, endDate },
  };
};

const Layout = styled.div`
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const WrapperMain = styled.main`
  padding: 10rem 2rem 0rem 2rem;
  max-width: 39rem;
  width: 100%;
  margin: 0 auto;
`;
const Header = styled.header`
  font-size: 3.2rem;
  font-weight: 700;
  color: ${(props) => props.theme.colors.header};
  margin-bottom: 2rem;
`;

const Comment = styled.p`
  font-size: 1.6rem;
  font-weight: 700;
  margin-top: 4rem;
`;

const Wrapper = styled.div`
  display: flex;
  height: 4rem;
  margin: 2rem 0rem 4rem 0rem;
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
  cursor: pointer;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;

  &: active {
    opacity: 0.5;
  }

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      opacity: 0.5;
      transition: all 0.1s ease-in-out;
    }
  }
`;

const TextSpan = styled.span`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;
