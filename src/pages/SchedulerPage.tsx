import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { useAuth } from "../contexts/AuthContext";
import { useWishlist } from "../contexts/WishlistContext";
import {
  getRecommendedSchedule,
  type ScheduleResponse,
  type PlanAction,
  type Program,
} from "../api";
import { createSubscription } from "../api/subscriptionService";
import "../styles/SchedulerPage.css";
import BottomNavigation from "../components/BottomNavigation";

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

// OTT 이름 -> ID 변환 헬퍼
const getOttIdByName = (name: string): number => {
  const normalized = name.toUpperCase().replace(/\s/g, "");
  if (normalized.includes("NETFLIX") || normalized.includes("넷플릭스"))
    return 1;
  if (normalized.includes("TVING") || normalized.includes("티빙")) return 2;
  if (normalized.includes("COUPANG") || normalized.includes("쿠팡")) return 3;
  if (normalized.includes("WAVVE") || normalized.includes("웨이브")) return 4;
  if (normalized.includes("DISNEY") || normalized.includes("디즈니")) return 5;
  if (normalized.includes("WATCHA") || normalized.includes("왓챠")) return 6;
  if (normalized.includes("LAFTEL") || normalized.includes("라프텔")) return 7;
  if (normalized.includes("MOBILE") || normalized.includes("모바일")) return 8;
  if (normalized.includes("AMAZON") || normalized.includes("아마존")) return 9;
  if (normalized.includes("CINEFOX") || normalized.includes("시네폭스"))
    return 10;
  return 0;
};

const formatDate = (dateString: string) => {
  if (!dateString) return "";
  return dateString.replace(/-/g, ".");
};

const SchedulerPage: React.FC = () => {
  const navigate = useNavigate();
  const { isLoggedIn, isLoading: authLoading } = useAuth();
  const { wishlist } = useWishlist();

  const [scheduleData, setScheduleData] = useState<ScheduleResponse | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  const generateGuestSchedule = (): ScheduleResponse => {
    if (!wishlist || wishlist.length === 0) {
      return { totalCostSavings: 0, actions: [] };
    }

    const ottGroups: { [key: string]: any[] } = {};

    wishlist.forEach((item) => {
      const primaryOtt =
        item.ottList && item.ottList.length > 0 ? item.ottList[0] : "기타";

      if (!ottGroups[primaryOtt]) {
        ottGroups[primaryOtt] = [];
      }

      ottGroups[primaryOtt].push({
        programId: item.programId,
        title: item.title,
        thumbnailUrl: item.thumbnailUrl,
        availability: [],
        description: "",
        genre: "",
        backdropUrl: "",
        ranking: null,
        runningTime: null,
        status: null,
        wishlistId: item.wishlistId,
      });
    });

    const actions: PlanAction[] = Object.keys(ottGroups).map((ottName) => {
      const today = new Date();
      const nextMonth = new Date();
      nextMonth.setMonth(today.getMonth() + 1);

      return {
        ottName: ottName,
        dateRange: {
          start: today.toISOString().split("T")[0],
          end: nextMonth.toISOString().split("T")[0],
        },
        programs: ottGroups[ottName],
      };
    });

    return {
      totalCostSavings: 0,
      actions: actions,
    };
  };

  const fetchSchedule = async () => {
    setLoading(true);
    setError(null);

    try {
      let responseData: ScheduleResponse;

      if (isLoggedIn) {
        responseData = await getRecommendedSchedule();
      } else {
        console.log("비회원 접속: 로컬 데이터로 구독 스케줄 생성");
        responseData = generateGuestSchedule();
      }

      setScheduleData(responseData);

      if (responseData.actions && responseData.actions.length > 0) {
        setOpenAccordion(responseData.actions[0].ottName);
      }
    } catch (err: any) {
      console.error("구독 스케줄 데이터 로딩 실패:", err);
      if (isLoggedIn) {
        if (err.response) {
          setError(
            err.response.data?.error ||
              err.response.data?.message ||
              `구독 스케줄을 불러오지 못했습니다. (Code: ${err.response.status})`
          );
        } else {
          setError(err.message || "서버와 연결할 수 없습니다.");
        }
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      fetchSchedule();
    }
  }, [authLoading, isLoggedIn, wishlist]);

  const handleApplySchedule = async () => {
    if (!isLoggedIn) {
      alert("로그인이 필요한 서비스입니다.");
      return;
    }

    if (!scheduleData || !scheduleData.actions.length) return;

    const confirmed = window.confirm(
      "이 스케줄을 나의 구독에 저장하시겠습니까?"
    );

    if (!confirmed) return;

    setLoading(true);

    try {
      for (const plan of scheduleData.actions) {
        const ottId = getOttIdByName(plan.ottName);
        if (ottId === 0) continue;

        await createSubscription({
          ottID: ottId,
          startDate: plan.dateRange.start,
          endDate: plan.dateRange.end,
        });
      }
      alert("성공적으로 반영되었습니다! 나의 구독 페이지로 이동합니다.");
      navigate("/subscribe");
    } catch (err) {
      console.error("구독 스케줄 반영 실패:", err);
      alert("구독 스케줄을 반영하는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const toggleAccordion = (ottName: string) => {
    setOpenAccordion(openAccordion === ottName ? null : ottName);
  };

  const getPlatformRow = (platform: string, allPlatforms: string[]) => {
    const index = allPlatforms.indexOf(platform);
    return index !== -1 ? index + 2 : 2;
  };

  if (authLoading || loading) {
    return (
      <div className="page-wrapper">
        <Header />
        <main className="scheduler-container">
          <div className="loading-container">
            <div className="loading-spinner">잠시만 기다려주세요...</div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-wrapper">
        <Header />
        <main className="scheduler-container">
          <div className="scheduler-empty-state">
            <h3 style={{ color: "#ef4444" }}>오류가 발생했습니다</h3>
            <p>{error}</p>
            <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
              <button
                onClick={fetchSchedule}
                className="scheduler-action-button secondary"
              >
                다시 시도
              </button>
              <Link to="/wishlist" className="scheduler-action-button">
                찜 목록 확인
              </Link>
            </div>
          </div>
        </main>
        <BottomNavigation />
      </div>
    );
  }

  if (
    !scheduleData ||
    !scheduleData.actions ||
    scheduleData.actions.length === 0
  ) {
    return (
      <div className="page-wrapper">
        <Header />
        <main className="scheduler-container">
          <div className="scheduler-empty-state">
            <h3>추천할 구독 스케줄이 없습니다.</h3>
            <p>
              찜 목록이 충분하지 않을 수 있습니다.
              {!isLoggedIn && <br />}
              {!isLoggedIn && (
                <span>(찜 목록을 기반으로 구독 스케줄이 생성됩니다.)</span>
              )}
            </p>
            <Link to="/" className="scheduler-action-button">
              콘텐츠 둘러보기
            </Link>
          </div>
        </main>
        <BottomNavigation />
      </div>
    );
  }

  const allPlatforms = [
    ...new Set(scheduleData.actions.map((plan: PlanAction) => plan.ottName)),
  ];

  return (
    <div className="page-wrapper">
      <Header />
      <main className="scheduler-container">
        <section className="plan-summary">
          <h1 className="title">최적의 구독 스케줄</h1>
          <p className="subtitle">
            총{" "}
            {scheduleData.actions.reduce(
              (sum: number, plan: PlanAction) => sum + plan.programs.length,
              0
            )}
            개의 작품을 보기 위한 구독 스케줄입니다.
          </p>

          <div
            style={{
              marginTop: "12px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {isLoggedIn ? (
              // 로그인 상태: 정상 가격 표시
              <span style={{ fontSize: "16px", color: "#4b5563" }}>
                예상 절약 비용:{" "}
                <span
                  className="cost-highlight"
                  style={{ fontSize: "18px", marginLeft: "4px" }}
                >
                  ₩ {scheduleData.totalCostSavings.toLocaleString()}
                </span>
              </span>
            ) : (
              // 비회원 상태
              <div className="hidden-cost-container">
                <span className="cost-label">예상 절약 비용:</span>

                <div
                  className="login-trigger-button"
                  // 클릭 시 알림창 띄우기
                  onClick={() => alert("로그인이 필요한 서비스입니다.")}
                >
                  <span className="blurred-price">₩ 99,999</span>
                </div>
              </div>
            )}
          </div>
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
            {allPlatforms.map((platform: string, index: number) => (
              <div
                key={platform}
                className="timeline-platform"
                style={{ gridRow: index + 2 }}
              >
                {platform}
              </div>
            ))}

            {scheduleData.actions.map((plan: PlanAction, index: number) => (
              <div
                key={`month-${index}`}
                className="timeline-month"
                style={{ gridColumn: index + 2 }}
              >
                {new Date(plan.dateRange.start).getMonth() + 1}월
              </div>
            ))}

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
                  {/* 날짜 포맷 변경 적용 */}
                  {formatDate(plan.dateRange.start)} ~{" "}
                  {formatDate(plan.dateRange.end)}
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
                  {new Date(plan.dateRange.start).getMonth() + 1}월 스케줄:{" "}
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
                  <strong>구독 기간:</strong>
                  {/* 날짜 포맷 변경 적용 */}
                  {formatDate(plan.dateRange.start)} ~{" "}
                  {formatDate(plan.dateRange.end)}
                </p>
                <p>
                  <strong>시청 목록:</strong>{" "}
                  {plan.programs.map((p: Program) => p.title).join(", ")}
                </p>
              </div>
            </div>
          ))}
        </section>

        <section className="action-buttons">
          <button
            className="scheduler-action-button"
            onClick={handleApplySchedule}
          >
            나의 구독에 이 스케줄 반영하기
          </button>
          <button
            className="scheduler-action-button secondary"
            onClick={fetchSchedule}
          >
            다시 계산하기
          </button>
        </section>
      </main>
      <BottomNavigation />
    </div>
  );
};

export default SchedulerPage;
