import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { getAllContents, type Content } from "../api/contentService";
import "../styles/mainPage.css";

type ContentTab = "popular" | "upcoming" | "ending";

const MainPage: React.FC = () => {
  const DEMO_DATA = {
    popular: [
      {
        id: 1,
        title: "더 글로리",
        releaseDate: "현재 방영중",
        image: "",
        platform: "NETFLIX",
        rank: 1,
        description: "asdfsdf",
      },
      {
        id: 2,
        title: "피지컬: 100",
        releaseDate: "현재 방영중",
        image: "",
        platform: "NETFLIX",
        rank: 2,
        description: "as23123f",
      },
      {
        id: 3,
        title: "환승연애3",
        releaseDate: "현재 방영중",
        image: "",
        platform: "WAVVE",
        rank: 1,
        description: "ass1231231",
      },
      {
        id: 4,
        title: "이재, 곧 죽습니다",
        releaseDate: "현재 방영중",
        image: "",
        platform: "NETFLIX",
        rank: 3,
        description: "14121241",
      },
      {
        id: 5,
        title: "오징어 게임 시즌2",
        releaseDate: "현재 방영중",
        image: "",
        platform: "NETFLIX",
        rank: 4,
        description: "asdfsdf",
      },
    ],
    upcoming: [
      {
        id: 6,
        title: "킹덤 시즌3",
        releaseDate: "2025-04-15",
        image: "",
        platform: "NETFLIX",
        description: "asdfsdf",
      },
      {
        id: 7,
        title: "수리남 시즌2",
        releaseDate: "2025-05-20",
        image: "",
        platform: "NETFLIX",
        description: "asdfsdf",
      },
      {
        id: 8,
        title: "무빙 시즌2",
        releaseDate: "2025-06-10",
        image: "",
        platform: "DISNEY_PLUS",
        description: "asdfsdf",
      },
      {
        id: 9,
        title: "카지노",
        releaseDate: "2025-04-25",
        image: "",
        platform: "WAVVE",
        description: "asdfsdf",
      },
      {
        id: 10,
        title: "재벌집 막내아들 시즌2",
        releaseDate: "2025-07-01",
        image: "",
        platform: "WAVVE",
        description: "asdfsdf",
      },
    ],
    ending: [
      {
        id: 11,
        title: "스위트홈 시즌3",
        releaseDate: "2025-12-15",
        image: "",
        platform: "NETFLIX",
        description: "asdfsdf",
      },
      {
        id: 12,
        title: "이상한 변호사 우영우",
        releaseDate: "2025-12-20",
        image: "",
        platform: "NETFLIX",
        description: "asdfsdf",
      },
      {
        id: 13,
        title: "술꾼도시여자들 시즌2",
        releaseDate: "2025-12-10",
        image: "",
        platform: "WAVVE",
        description: "asdfsdf",
      },
      {
        id: 14,
        title: "D.P. 시즌2",
        releaseDate: "2025-11-30",
        image: "",
        platform: "NETFLIX",
        description: "asdfsdf",
      },
      {
        id: 15,
        title: "나의 해방일지",
        releaseDate: "2025-12-05",
        image: "",
        platform: "NETFLIX",
        description: "asdfsdf",
      },
    ],
  };

  const [activeTab, setActiveTab] = useState<ContentTab>("popular");
  const [popularShows, setPopularShows] = useState<Content[]>([]);
  const [upcomingShows, setUpcomingShows] = useState<Content[]>([]);
  const [endingShows, setEndingShows] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContents = async () => {
      try {
        setLoading(true);
        // const { popular, upcoming, ending } = await getAllContents();
        // setPopularShows(popular);
        // setUpcomingShows(upcoming);
        // setEndingShows(ending);
        await new Promise((resolve) => setTimeout(resolve, 500)); // 로딩 시뮬레이션
        setPopularShows(DEMO_DATA.popular);
        setUpcomingShows(DEMO_DATA.upcoming);
        setEndingShows(DEMO_DATA.ending);
        setError(null);
      } catch (err) {
        console.error("콘텐츠 로딩 실패:", err);
        setError("콘텐츠를 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchContents();
  }, []);

  const getCurrentShows = () => {
    let shows: Content[] = [];

    switch (activeTab) {
      case "popular":
        shows = [...popularShows];
        // 순위 기준 오름차순 정렬 (rank가 있는 경우)
        shows.sort((a, b) => {
          const rankA = a.rank || 999;
          const rankB = b.rank || 999;
          return rankA - rankB;
        });
        break;

      case "upcoming":
        shows = [...upcomingShows];
        // 공개일 기준 오름차순 정렬 (빠른 날짜 먼저)
        shows.sort((a, b) => {
          const dateA = new Date(a.releaseDate.replace(/\./g, "-"));
          const dateB = new Date(b.releaseDate.replace(/\./g, "-"));
          return dateA.getTime() - dateB.getTime();
        });
        break;

      case "ending":
        shows = [...endingShows];
        // 종료일 기준 오름차순 정렬 (임박한 날짜 먼저)
        shows.sort((a, b) => {
          const dateA = new Date(a.releaseDate.replace(/\./g, "-"));
          const dateB = new Date(b.releaseDate.replace(/\./g, "-"));
          return dateA.getTime() - dateB.getTime();
        });
        break;

      default:
        shows = popularShows;
    }

    return shows;
  };

  if (loading) {
    return (
      <div className="main-page">
        <Header />
        <div className="loading-container">
          <div className="loading-spinner">로딩 중...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="main-page">
        <Header />
        <div className="error-container">
          <p className="error-message">{error}</p>
          <button onClick={() => window.location.reload()}>다시 시도</button>
        </div>
      </div>
    );
  }

  const currentShows = getCurrentShows();

  return (
    <div className="main-page">
      <Header />

      {/* Search Section */}
      <section className="search-section">
        <div className="search-container">
          <div className="search-input-wrapper">
            <svg
              className="search-icon"
              width="24"
              height="28"
              viewBox="0 0 24 28"
              fill="none"
            >
              <path
                d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z"
                stroke="#9CA3AF"
                strokeWidth="2"
              />
              <path
                d="M21 21L16.65 16.65"
                stroke="#9CA3AF"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            <input
              type="text"
              className="search-input"
              placeholder="시리즈, 영화를 검색해 보세요..."
            />
          </div>
        </div>
      </section>

      <main className="main">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-background" />
          <div className="hero-gradient" />
          <div className="hero-content">
            <h3 className="hero-title">극장판 주술회전: 회옥・옥절</h3>
            <div className="hero-buttons">
              <button className="play-button">
                <svg width="24" height="28" viewBox="0 0 24 28" fill="none">
                  <path
                    d="M8 6.82843V21.1716C8 22.7337 9.79086 23.6213 11.0503 22.6423L20.4214 15.4707C21.4625 14.6525 21.4625 13.3475 20.4214 12.5293L11.0503 5.35774C9.79086 4.37868 8 5.26631 8 6.82843Z"
                    fill="white"
                  />
                </svg>
                <span>재생</span>
              </button>
              <button className="info-button">
                <svg width="24" height="28" viewBox="0 0 24 28" fill="none">
                  <path
                    d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V11H13V17ZM13 9H11V7H13V9Z"
                    fill="white"
                  />
                </svg>
                <span>상세 정보</span>
              </button>
            </div>
          </div>
        </section>

        {/* Tab Navigation */}
        <section className="tab-navigation">
          <div className="tab-nav-container">
            <button
              className={`tab-nav-button ${
                activeTab === "popular" ? "active" : ""
              }`}
              onClick={() => setActiveTab("popular")}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M10 1L12.5 6.5L18.5 7.5L14.25 11.75L15.5 18L10 15L4.5 18L5.75 11.75L1.5 7.5L7.5 6.5L10 1Z"
                  fill="currentColor"
                />
              </svg>
              <span>현재 인기작</span>
            </button>
            <button
              className={`tab-nav-button ${
                activeTab === "upcoming" ? "active" : ""
              }`}
              onClick={() => setActiveTab("upcoming")}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18Z"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  d="M10 6V10L13 13"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              <span>공개 예정</span>
            </button>
            <button
              className={`tab-nav-button ${
                activeTab === "ending" ? "active" : ""
              }`}
              onClick={() => setActiveTab("ending")}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M6 2V6M14 2V6M3 10H17M5 4H15C16.1046 4 17 4.89543 17 6V16C17 17.1046 16.1046 18 15 18H5C3.89543 18 3 17.1046 3 16V6C3 4.89543 3.89543 4 5 4Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              <span>종료 예정</span>
            </button>
          </div>
        </section>

        {/* Content Section - Platform Separated */}
        <section className="content-section">
          {/* Netflix Row */}
          <div className="platform-row">
            <h3 className="platform-title">
              <span className="platform-logo">NETFLIX</span>
            </h3>
            <div className="content-scroll">
              {currentShows
                .filter((show) => show.platform === "NETFLIX")
                .slice(0, 10)
                .map((show, index) => (
                  <div key={index} className="content-card">
                    <div className="poster-container">
                      <div
                        className="poster-image"
                        style={{
                          backgroundImage: show.image
                            ? `url(${show.image})`
                            : undefined,
                          backgroundColor: show.image ? undefined : "#ccc",
                        }}
                      >
                        {!show.image && <span>이미지 없음</span>}
                      </div>
                    </div>
                    <h4 className="content-title">{show.title}</h4>
                    <div className="content-date">{show.releaseDate}</div>
                    <button className="add-button">
                      <svg
                        width="16"
                        height="20"
                        viewBox="0 0 16 20"
                        fill="none"
                      >
                        <path
                          d="M8 4V16M2 10H14"
                          stroke="#1F2937"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>
                      <span>보고싶은 목록에 추가</span>
                    </button>
                  </div>
                ))}
            </div>
          </div>

          {/* Wavve Row */}
          <div className="platform-row">
            <h3 className="platform-title">
              <span className="platform-logo wavve">WAVVE</span>
            </h3>
            <div className="content-scroll">
              {currentShows
                .filter((show) => show.platform === "WAVVE")
                .slice(0, 10)
                .map((show, index) => (
                  <div key={index} className="content-card">
                    <div className="poster-container">
                      <div
                        className="poster-image"
                        style={{
                          backgroundImage: show.image
                            ? `url(${show.image})`
                            : undefined,
                          backgroundColor: show.image ? undefined : "#ccc",
                        }}
                      >
                        {!show.image && <span>이미지 없음</span>}
                      </div>
                    </div>
                    <h4 className="content-title">{show.title}</h4>
                    <div className="content-date">{show.releaseDate}</div>
                    <button className="add-button">
                      <svg
                        width="16"
                        height="20"
                        viewBox="0 0 16 20"
                        fill="none"
                      >
                        <path
                          d="M8 4V16M2 10H14"
                          stroke="#1F2937"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>
                      <span>보고싶은 목록에 추가</span>
                    </button>
                  </div>
                ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default MainPage;
