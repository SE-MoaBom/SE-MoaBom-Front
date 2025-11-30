import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import { useAuth } from "../contexts/AuthContext"; // AuthContext 가져오기
// index.ts를 통해 필요한 함수와 타입을 가져옵니다.
import {
  getRecommendedSchedule,
  type ScheduleResponse,
  type PlanAction,
  type Program,
} from "../api";
import "../styles/SchedulerPage.css";

// 아코디언 화살표 아이콘
const AccordionArrow = ({ isOpen }: { isOpen: boolean }) => (
  <svg
    className={`accordion-arrow ${isOpen ? "open" : ""}`}
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
  >
    <path
      d="M5 7.5L10 12.5L15 7.5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const SchedulerPage: React.FC = () => {
  const { isLoggedIn, isLoading: authLoading } = useAuth(); // 로그인 상태 확인
  const [scheduleData, setScheduleData] = useState<ScheduleResponse | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  const fetchSchedule = async () => {
    setLoading(true);
    setError(null);

    try {
      // 실제 API 호출
      const responseData = await getRecommendedSchedule();
      setScheduleData(responseData);

      // 데이터가 있으면 첫 번째 OTT 아코디언 열기
      if (responseData.actions && responseData.actions.length > 0) {
        setOpenAccordion(responseData.actions[0].ottName);
      }
    } catch (err: any) {
      console.error("스케줄 데이터 로딩 실패:", err);
      if (err.response) {
        setError(
          err.response.data?.error ||
            err.response.data?.message ||
            `스케줄을 불러오지 못했습니다. (Code: ${err.response.status})`
        );
      } else {
        setError(err.message || "서버와 연결할 수 없습니다.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // 로그인이 되어 있을 때만 데이터 요청
    if (isLoggedIn && !authLoading) {
      fetchSchedule();
    } else if (!isLoggedIn && !authLoading) {
      // 로그인이 안 되어 있으면 로딩 끝내고 로그인 안내 화면 보여줌
      setLoading(false);
    }
  }, [isLoggedIn, authLoading]);

  const toggleAccordion = (ottName: string) => {
    setOpenAccordion(openAccordion === ottName ? null : ottName);
  };

  const getPlatformRow = (platform: string, allPlatforms: string[]) => {
    const index = allPlatforms.indexOf(platform);
    return index !== -1 ? index + 2 : 2;
  };

  // 0. 인증 상태 확인 중이거나 데이터 로딩 중일 때
  if (authLoading || (isLoggedIn && loading)) {
    return (
      <div className="page-wrapper">
        <Header />
        <main className="scheduler-container">
          <div className="loading-container">
            <div
              className="loading-spinner"
              style={{ textAlign: "center", marginTop: "50px" }}
            >
              잠시만 기다려주세요...
            </div>
          </div>
        </main>
      </div>
    );
  }

  // 1. 로그인이 되어있지 않은 경우 (수정된 부분)
  if (!isLoggedIn) {
    return (
      <div className="page-wrapper">
        <Header />
        <main className="scheduler-container">
          <div
            className="empty-state"
            style={{ textAlign: "center", padding: "80px 20px" }}
          >
            <h3 style={{ fontSize: "1.5rem", marginBottom: "10px" }}>
              로그인이 필요한 서비스입니다.
            </h3>
            <p style={{ color: "#6b7280", marginBottom: "32px" }}>
              스케줄러 기능을 이용하시려면 모아봄 회원으로 로그인해주세요.
            </p>
            <Link
              to="/login"
              className="action-button primary"
              style={{ textDecoration: "none" }}
            >
              로그인 하러 가기
            </Link>
          </div>
        </main>
      </div>
    );
  }

  // 2. 에러 발생 시
  if (error) {
    return (
      <div className="page-wrapper">
        <Header />
        <main className="scheduler-container">
          <div
            className="error-state"
            style={{ textAlign: "center", padding: "40px 20px" }}
          >
            <h3 style={{ color: "#ef4444", marginBottom: "16px" }}>
              오류가 발생했습니다
            </h3>
            <p style={{ color: "#4b5563", marginBottom: "8px" }}>{error}</p>
            <p
              style={{
                color: "#6b7280",
                fontSize: "14px",
                marginBottom: "32px",
              }}
            >
              혹시 <strong>찜 목록</strong>이 비어있지 않은지 확인해주세요.
              <br />
              스케줄러는 찜한 콘텐츠를 기반으로 작동합니다.
            </p>
            <div className="action-buttons">
              <button
                onClick={fetchSchedule}
                className="action-button secondary"
              >
                다시 시도
              </button>
              <Link
                to="/wishlist"
                className="action-button primary"
                style={{ textDecoration: "none" }}
              >
                찜 목록 확인하러 가기
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // 3. 데이터가 없을 때
  if (
    !scheduleData ||
    !scheduleData.actions ||
    scheduleData.actions.length === 0
  ) {
    return (
      <div className="page-wrapper">
        <Header />
        <main className="scheduler-container">
          <div
            className="empty-state"
            style={{ textAlign: "center", padding: "60px 20px" }}
          >
            <h3>추천할 스케줄이 없습니다.</h3>
            <p style={{ margin: "16px 0 32px", color: "#6b7280" }}>
              아직 시청 계획이 잡히지 않았거나, 찜 목록이 충분하지 않을 수
              있습니다.
            </p>
            <Link
              to="/"
              className="action-button primary"
              style={{ textDecoration: "none" }}
            >
              콘텐츠 둘러보기
            </Link>
          </div>
        </main>
      </div>
    );
  }

  // 플랫폼 목록 추출 (중복 제거)
  const allPlatforms = [
    ...new Set(scheduleData.actions.map((plan: PlanAction) => plan.ottName)),
  ];

  return (
    <div className="page-wrapper">
      <Header />
      <main className="scheduler-container">
        {/* 상단 요약 */}
        <section className="plan-summary">
          <h1 className="title">최적의 시청 플랜</h1>
          <p className="subtitle">
            총{" "}
            {scheduleData.actions.reduce(
              (sum: number, plan: PlanAction) => sum + plan.programs.length,
              0
            )}
            개의 작품을 보기 위한 플랜입니다. 예상 절약 비용: ₩{" "}
            {scheduleData.totalCostSavings.toLocaleString()}
          </p>
        </section>

        {/* 타임라인 뷰 */}
        <section className="timeline-section">
          <h2 className="section-title">타임라인</h2>
          <div
            className="timeline-grid"
            style={{
              gridTemplateColumns: `100px repeat(${scheduleData.actions.length}, 1fr)`,
              gridTemplateRows: `40px repeat(${allPlatforms.length}, 1fr)`,
            }}
          >
            {/* 플랫폼 이름 (Y축) */}
            {allPlatforms.map((platform: string, index: number) => (
              <div
                key={platform}
                className="timeline-platform"
                style={{ gridRow: index + 2 }}
              >
                {platform}
              </div>
            ))}

            {/* 월 표시 (X축) */}
            {scheduleData.actions.map((plan: PlanAction, index: number) => (
              <div
                key={`month-${index}`}
                className="timeline-month"
                style={{ gridColumn: index + 2 }}
              >
                {new Date(plan.dateRange.start).getMonth() + 1}월
              </div>
            ))}

            {/* 플랜 블록 */}
            {scheduleData.actions.map((plan: PlanAction, index: number) => (
              <div
                key={`${plan.ottName}-${index}`}
                className="plan-block"
                style={{
                  gridRow: getPlatformRow(plan.ottName, allPlatforms),
                  gridColumn: index + 2,
                }}
              >
                <div className="plan-block-title">{plan.ottName} 구독</div>
                <div className="plan-block-period">
                  {plan.dateRange.start} ~ {plan.dateRange.end}
                </div>
                <ul className="plan-block-shows">
                  {plan.programs.map((program: Program) => (
                    <li key={program.programId}>{program.title}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* 리스트 뷰 */}
        <section className="list-view-section">
          <h2 className="section-title">리스트 뷰</h2>
          {scheduleData.actions.map((plan: PlanAction) => (
            <div className="accordion-item" key={plan.ottName}>
              <div
                className="accordion-header"
                onClick={() => toggleAccordion(plan.ottName)}
              >
                <span>
                  {new Date(plan.dateRange.start).getMonth() + 1}월 플랜:{" "}
                  {plan.ottName}
                </span>
                <AccordionArrow isOpen={openAccordion === plan.ottName} />
              </div>
              <div
                className={`accordion-content ${
                  openAccordion === plan.ottName ? "open" : ""
                }`}
              >
                <p>
                  <strong>구독 기간:</strong> {plan.dateRange.start} ~{" "}
                  {plan.dateRange.end}
                </p>
                <p>
                  <strong>시청 목록:</strong>{" "}
                  {plan.programs.map((p: Program) => p.title).join(", ")}
                </p>
              </div>
            </div>
          ))}
        </section>

        {/* 액션 버튼 */}
        <section className="action-buttons">
          <button className="action-button primary">
            내 구독에 이 일정 반영하기
          </button>
          <button className="action-button secondary" onClick={fetchSchedule}>
            다시 계산하기
          </button>
        </section>
      </main>
    </div>
  );
};

export default SchedulerPage;
