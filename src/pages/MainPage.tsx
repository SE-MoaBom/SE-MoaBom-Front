import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import ContentModal from "../components/ContentModal";
import { type Content } from "../api/contentService";
import "../styles/mainPage.css";
import { useNavigate } from "react-router-dom";
import { useWishlist } from "../contexts/WishlistContext"; // useWishlist 훅 불러오기

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
        genres: ["애니메이션", "액션", "판타지", "스릴러"],
        availablePlatforms: ["NETFLIX"],
      },
      {
        id: 2,
        title: "피지컬: 100",
        releaseDate: "현재 방영중",
        image: "",
        platform: "NETFLIX",
        rank: 2,
        description: "as23123f",
        genres: ["애니메이션", "액션", "판타지", "스릴러"],
        availablePlatforms: ["NETFLIX"],
      },
      {
        id: 3,
        title: "환승연애3",
        releaseDate: "현재 방영중",
        image: "",
        platform: "WAVVE",
        rank: 1,
        description: "ass1231231",
        genres: ["애니메이션", "액션", "판타지", "스릴러"],
        availablePlatforms: ["NETFLIX"],
      },
      {
        id: 4,
        title: "이재, 곧 죽습니다",
        releaseDate: "현재 방영중",
        image: "",
        platform: "NETFLIX",
        rank: 3,
        description: "14121241",
        genres: ["애니메이션", "액션", "판타지", "스릴러"],
        availablePlatforms: ["NETFLIX"],
      },
      {
        id: 5,
        title: "오징어 게임 시즌2",
        releaseDate: "현재 방영중",
        image: "",
        platform: "NETFLIX",
        rank: 4,
        description: "asdfsdf",
        genres: ["애니메이션", "액션", "판타지", "스릴러"],
        availablePlatforms: ["NETFLIX"],
      },
    ],
    upcoming: [
      {
        id: 6,
        title: "킹덤 시즌3",
        releaseDate: "2025.04.15",
        image: "",
        platform: "NETFLIX",
        description: "asdfsdf",
        genres: ["애니메이션", "액션", "판타지", "스릴러"],
        availablePlatforms: ["NETFLIX"],
      },
      {
        id: 7,
        title: "수리남 시즌2",
        releaseDate: "2025.05.20",
        image: "",
        platform: "NETFLIX",
        description: "asdfsdf",
        genres: ["애니메이션", "액션", "판타지", "스릴러"],
        availablePlatforms: ["NETFLIX"],
      },
      {
        id: 8,
        title: "무빙 시즌2",
        releaseDate: "2025.06.10",
        image: "",
        platform: "DISNEY_PLUS",
        description: "asdfsdf",
        genres: ["애니메이션", "액션", "판타지", "스릴러"],
        availablePlatforms: ["NETFLIX"],
      },
      {
        id: 9,
        title: "카지노",
        releaseDate: "2025.04.25",
        image: "",
        platform: "WAVVE",
        description: "asdfsdf",
        genres: ["애니메이션", "액션", "판타지", "스릴러"],
        availablePlatforms: ["NETFLIX"],
      },
      {
        id: 10,
        title: "재벌집 막내아들 시즌2",
        releaseDate: "2025.07.01",
        image: "",
        platform: "WAVVE",
        description: "asdfsdf",
        genres: ["애니메이션", "액션", "판타지", "스릴러"],
        availablePlatforms: ["NETFLIX"],
      },
    ],
    ending: [
      {
        id: 11,
        title: "스위트홈 시즌3",
        releaseDate: "2025.12.15",
        image: "",
        platform: "NETFLIX",
        description: "asdfsdf",
        genres: ["애니메이션", "액션", "판타지", "스릴러"],
        availablePlatforms: ["NETFLIX"],
      },
      {
        id: 12,
        title: "이상한 변호사 우영우",
        releaseDate: "2025.12.20",
        image: "",
        platform: "NETFLIX",
        description: "asdfsdf",
        genres: ["애니메이션", "액션", "판타지", "스릴러"],
        availablePlatforms: ["NETFLIX"],
      },
      {
        id: 13,
        title: "술꾼도시여자들 시즌2",
        releaseDate: "2025.12.10",
        image: "",
        platform: "WAVVE",
        description: "asdfsdf",
        genres: ["애니메이션", "액션", "판타지", "스릴러"],
        availablePlatforms: ["NETFLIX"],
      },
      {
        id: 14,
        title: "D.P. 시즌2",
        releaseDate: "2025.11.30",
        image: "",
        platform: "NETFLIX",
        description: "asdfsdf",
        genres: ["애니메이션", "액션", "판타지", "스릴러"],
        availablePlatforms: ["NETFLIX"],
      },
      {
        id: 15,
        title: "나의 해방일지",
        releaseDate: "2025.12.05",
        image: "",
        platform: "NETFLIX",
        description: "asdfsdf",
        genres: ["애니메이션", "액션", "판타지", "스릴러"],
        availablePlatforms: ["NETFLIX"],
      },
    ],
  };

  const { addToWishlist } = useWishlist(); // useWishlist 훅을 호출하여 addToWishlist 함수 가져오기
  const [activeTab, setActiveTab] = useState<ContentTab>("popular");
  const [heroIndex, setHeroIndex] = useState(0);
  const [popularShows, setPopularShows] = useState<Content[]>([]);
  const [upcomingShows, setUpcomingShows] = useState<Content[]>([]);
  const [endingShows, setEndingShows] = useState<Content[]>([]);

  //로딩
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 모달
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleContentClick = (content: Content) => {
    setSelectedContent(content);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedContent(null);
  };

  // 검색
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Content[]>([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const navigate = useNavigate();

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

  useEffect(() => {
    const timer = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % getCurrentShows().length);
    }, 7000);

    return () => clearInterval(timer);
  }, [activeTab, popularShows, upcomingShows, endingShows]);

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
          const dateA = new Date(a.releaseDate.replace(/\./g, "."));
          const dateB = new Date(b.releaseDate.replace(/\./g, "."));
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

  const getHeroContent = () => {
    const shows = getCurrentShows();
    return shows[heroIndex] || shows[0];
  };

  const getHeroShortInfo = () => {
    const content = getHeroContent();
    switch (activeTab) {
      case "popular":
        return `${content.platform} ${content.rank}위`;
      case "upcoming":
        return `${content.releaseDate} 공개`;
      case "ending":
        return `${content.releaseDate} 종료`;
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim()) {
      const allContents = [...popularShows, ...upcomingShows, ...endingShows];
      const filtered = allContents.filter((content) =>
        content.title.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(filtered.slice(0, 5));
      setShowSearchDropdown(true);
    } else {
      setSearchResults([]);
      setShowSearchDropdown(false);
    }
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const highlightMatch = (text: string, query: string) => {
    if (!query.trim()) return text;

    const parts = text.split(new RegExp(`(${query})`, "gi"));
    return parts.map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <span key={index} style={{ color: "#3B82F6", fontWeight: 600 }}>
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  const handleDropdownItemClick = (content: Content) => {
    setShowSearchDropdown(false);
    handleContentClick(content);
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
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyDown={handleSearchKeyDown}
              onFocus={() => searchQuery && setShowSearchDropdown(true)}
            />

            {/* 검색 드롭다운 */}
            {showSearchDropdown && searchResults.length > 0 && (
              <div className="search-dropdown">
                {searchResults.slice(0, 5).map((content) => (
                  <div
                    key={content.id}
                    className="search-dropdown-item"
                    onClick={() => handleDropdownItemClick(content)}
                  >
                    <div className="search-item-title">
                      {highlightMatch(content.title, searchQuery)}
                    </div>
                    <button className="search-add-button">
                      <svg
                        width="10"
                        height="10"
                        viewBox="0 0 10 10"
                        fill="none"
                      >
                        <path
                          d="M5 2V8M2 5H8"
                          stroke="#FFFFFF"
                          strokeWidth="1"
                          strokeLinecap="round"
                        />
                      </svg>
                      <span className="search-add-button-text">
                        보고싶은 목록에 추가
                      </span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <main className="main">
        {/* Hero Section */}
        <section className="hero-section">
          <div
            className="hero-background"
            style={{
              backgroundImage: getHeroContent().image
                ? `url(${getHeroContent().image})`
                : undefined,
            }}
          />
          <div className="hero-gradient" />
          <div className="hero-content">
            <h5 className="hero-shortInfo">{getHeroShortInfo()}</h5>
            <h3 className="hero-title">{getHeroContent().title}</h3>
            <div className="hero-buttons">{/* 기존 버튼들 */}</div>
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
                    <div
                      className="poster-container"
                      onClick={() => handleContentClick(show)}
                      style={{ cursor: "pointer" }}
                    >
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
                    {/* 버튼에 onClick 이벤트를 추가하고, addToWishlist 함수 연결 */}
                    <button
                      className="add-button"
                      onClick={() => addToWishlist(show)}
                    >
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
                    <div
                      className="poster-container"
                      onClick={() => handleContentClick(show)}
                    >
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
                    {/* 버튼에 onClick 이벤트를 추가하고, addToWishlist 함수 연결 */}
                    <button
                      className="add-button"
                      onClick={() => addToWishlist(show)}
                    >
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
      {/* Modal */}

      {selectedContent && (
        <ContentModal
          content={selectedContent}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onAddToWishlist={addToWishlist} // 모달에도 addToWishlist 함수를 prop으로 전달
        />
      )}
    </div>
  );
};

export default MainPage;
