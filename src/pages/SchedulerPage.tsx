import React, { useState, useEffect } from "react";
import Header from "../components/Header";
// index.ts를 통해 필요한 함수와 타입을 한번에 가져옵니다.
import { getRecommendedSchedule, type ScheduleResponse } from "../api";
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
  // <--- 이 '{'
  const [scheduleData, setScheduleData] = useState<ScheduleResponse | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        setLoading(true);
        const responseData = await getRecommendedSchedule();
        setScheduleData(responseData);

        if (responseData.actions && responseData.actions.length > 0) {
          setOpenAccordion(responseData.actions[0].ottName);
        }
      } catch (err: any) {
        console.error("스케줄 데이터 로딩 실패:", err);
        if (err.response) {
          setError(
            err.response.data?.error || "스케줄을 불러오는 데 실패했습니다."
          );
        } else {
          setError(err.message || "알 수 없는 오류가 발생했습니다.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, []);

  const toggleAccordion = (ottName: string) => {
    setOpenAccordion(openAccordion === ottName ? null : ottName);
  };

  const getPlatformRow = (platform: string, allPlatforms: string[]) => {
    const index = allPlatforms.indexOf(platform);
    return index !== -1 ? index + 2 : 2;
  };

  // 로딩 중일 때 보여줄 화면
  if (loading) {
    return (
      <div className="page-wrapper">
        <Header />
        <main className="scheduler-container">
          <p>로딩 중...</p>
        </main>
      </div>
    );
  }

  // 에러 발생 시 보여줄 화면
  if (error) {
    return (
      <div className="page-wrapper">
        <Header />
        <main className="scheduler-container">
          <p style={{ color: "red" }}>오류: {error}</p>
        </main>
      </div>
    );
  }

  // 데이터가 없을 때 보여줄 화면
  if (
    !scheduleData ||
    !scheduleData.actions ||
    scheduleData.actions.length === 0
  ) {
    // 1. 여기에 return 구문을 추가합니다.
    return (
      <div className="page-wrapper">
        <Header />
        <main className="scheduler-container">
          <p>추천할 스케줄이 없습니다. 찜 목록을 확인해주세요.</p>
        </main>
      </div>
    );
  }

  const allPlatforms = [
    ...new Set(scheduleData.actions.map((plan) => plan.ottName)),
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
              (sum, plan) => sum + plan.programs.length,
              0
            )}
            개의 작품을 보기 위한 최적의 플랜입니다. 예상 절약 비용: ₩{" "}
            {scheduleData.totalCostSavings.toLocaleString()}
          </p>
        </section>

        {/* 타임라인 뷰 */}
        <section className="timeline-section">
          <h2 className="section-title">타임라인</h2>
          <div
            className="timeline-grid"
            style={{
              gridTemplateColumns: `100px repeat(${allPlatforms.length}, 1fr)`,
              gridTemplateRows: `40px repeat(${allPlatforms.length}, 1fr)`,
            }}
          >
            {allPlatforms.map((platform, index) => (
              <div
                key={platform}
                className="timeline-platform"
                style={{ gridRow: index + 2 }}
              >
                {platform}
              </div>
            ))}

            {allPlatforms.map((platform, index) => (
              <div
                key={platform}
                className="timeline-month"
                style={{ gridColumn: index + 2 }}
              >
                {new Date(
                  scheduleData.actions[index].dateRange.start
                ).getMonth() + 1}
                월
              </div>
            ))}

            {scheduleData.actions.map((plan, index) => (
              <div
                key={plan.ottName}
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
                  {plan.programs.map((program) => (
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
          {scheduleData.actions.map((plan) => (
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
                  {plan.programs.map((p) => p.title).join(", ")}
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
          <button className="action-button secondary">다시 계산하기</button>
        </section>
      </main>
    </div>
  );
}; // <--- 2. 이 닫는 중괄호가 빠져있었습니다.

export default SchedulerPage;
