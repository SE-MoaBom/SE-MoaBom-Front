import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import ContentModal from "../components/ContentModal";
import "../styles/mainPage.css";
import { useNavigate } from "react-router-dom";
import { useWishlist } from "../contexts/WishlistContext";
import { searchPrograms, type Program } from "../api/programService";
import BottomNavigation from "../components/BottomNavigation";

type ContentTab = "popular" | "upcoming" | "ending";

// OTT ID 매핑
const OTT_MAPPING: { [key: number]: { name: string; className: string } } = {
  1: { name: "NETFLIX", className: "netflix" },
  2: { name: "TVING", className: "tving" },
  3: { name: "COUPANG_PLAY", className: "coupang" },
  4: { name: "WAVVE", className: "wavve" },
  5: { name: "DISNEY_PLUS", className: "disney" },
  6: { name: "WATCHA", className: "watcha" },
  7: { name: "LAFTEL", className: "laftel" },
  8: { name: "U_PLUS_MOBILE_TV", className: "uplus" },
  9: { name: "AMAZON_PRIME_VIDEO", className: "amazon" },
  10: { name: "CINEFOX", className: "cinefox" },
};

const MainPage: React.FC = () => {
  const { addToWishlist } = useWishlist();
  const [activeTab, setActiveTab] = useState<ContentTab>("popular");
  const [heroIndex, setHeroIndex] = useState(0);
  const [programs, setPrograms] = useState<Program[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleContentClick = (program: Program) => {
    setSelectedProgram(program);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProgram(null);
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Program[]>([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        setLoading(true);

        // 실제 API 호출
        const [popularRes, upcomingRes, expiringRes] = await Promise.all([
          searchPrograms({ sort: "RANKING", size: 20 }), // 인기작
          searchPrograms({ status: "UPCOMING", size: 20 }), // 공개 예정
          searchPrograms({ status: "EXPIRING", size: 20 }), // 종료 예정
        ]);

        // API 응답 통합
        const allPrograms = [
          ...popularRes.results,
          ...upcomingRes.results,
          ...expiringRes.results,
        ];
        setPrograms(allPrograms);
        setError(null);
      } catch (err) {
        console.error("콘텐츠 로딩 실패:", err);
        setError("콘텐츠를 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchPrograms();
  }, []);

  useEffect(() => {
    const shows = getCurrentShows();
    if (shows.length === 0) return;

    const timer = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % shows.length);
    }, 7000);

    return () => clearInterval(timer);
  }, [activeTab, programs]);

  // OTT ID로 플랫폼 이름 가져오기
  const getOttName = (ottId: number): string => {
    return OTT_MAPPING[ottId]?.name || "UNKNOWN";
  };

  // 현재 탭에 맞는 프로그램 필터링 및 정렬
  const getCurrentShows = (): Program[] => {
    let filtered: Program[] = [];

    switch (activeTab) {
      case "popular":
        // ranking이 있는 프로그램 (인기작)
        filtered = programs.filter((p) => p.ranking !== null);
        filtered.sort((a, b) => (a.ranking || 999) - (b.ranking || 999));
        break;

      case "upcoming":
        // status가 UPCOMING인 프로그램
        filtered = programs.filter((p) => p.status === "UPCOMING");
        filtered.sort((a, b) => {
          const dateA = a.availability[0]?.releaseDate || "";
          const dateB = b.availability[0]?.releaseDate || "";
          return new Date(dateA).getTime() - new Date(dateB).getTime();
        });
        break;

      case "ending":
        // status가 EXPIRING인 프로그램
        filtered = programs.filter((p) => p.status === "EXPIRING");
        filtered.sort((a, b) => {
          const dateA = a.availability[0]?.expireDate || "";
          const dateB = b.availability[0]?.expireDate || "";
          return new Date(dateA).getTime() - new Date(dateB).getTime();
        });
        break;

      default:
        filtered = programs.filter((p) => p.ranking !== null);
    }

    return filtered;
  };

  // 플랫폼별 프로그램 필터링
  const getProgramsByOtt = (ottId: number): Program[] => {
    return getCurrentShows().filter((program) =>
      program.availability.some((avail) => avail.ottId === ottId)
    );
  };

  const getHeroContent = (): Program | null => {
    const shows = getCurrentShows();
    return shows[heroIndex] || shows[0] || null;
  };

  const getHeroShortInfo = (): string => {
    const content = getHeroContent();
    if (!content) return "";

    switch (activeTab) {
      case "popular":
        const ottName = getOttName(content.availability[0]?.ottId || 0);
        return `${ottName} ${content.ranking}위`;
      case "upcoming":
        return `${content.availability[0]?.releaseDate || ""} 공개`;
      case "ending":
        return `${content.availability[0]?.expireDate || ""} 종료`;
      default:
        return "";
    }
  };

  // 날짜 표시 포맷
  const getDisplayDate = (program: Program): string => {
    if (activeTab === "popular") {
      return "현재 방영중";
    } else if (activeTab === "upcoming") {
      return program.availability[0]?.releaseDate || "";
    } else {
      return program.availability[0]?.expireDate || "";
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim()) {
      const filtered = programs.filter((program) =>
        program.title.toLowerCase().includes(query.toLowerCase())
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

  const handleDropdownItemClick = (program: Program) => {
    setShowSearchDropdown(false);
    handleContentClick(program);
  };

  // 찜하기 핸들러
  const handleAddToWishlist = (program: Program) => {
    addToWishlist(program.programId, program.title);
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

  const heroContent = getHeroContent();

  // 메인 OTT 리스트 (우선 표시할 주요 OTT)
  const mainOttIds = [1, 4, 5]; // Netflix, Wavve, Disney+

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

            {showSearchDropdown && searchResults.length > 0 && (
              <div className="search-dropdown">
                {searchResults.map((program) => (
                  <div
                    key={program.programId}
                    className="search-dropdown-item"
                    onClick={() => handleDropdownItemClick(program)}
                  >
                    <div className="search-item-title">
                      {highlightMatch(program.title, searchQuery)}
                    </div>
                    <button
                      className="search-add-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToWishlist(program);
                      }}
                    >
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
              backgroundImage: heroContent?.backdropUrl
                ? `url(${heroContent.backdropUrl})`
                : undefined,
            }}
          />
          <div className="hero-gradient" />
          <div className="hero-content">
            <h5 className="hero-shortInfo">{getHeroShortInfo()}</h5>
            <h3 className="hero-title">{heroContent?.title || ""}</h3>
            <div className="hero-buttons"></div>
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
          {mainOttIds.map((ottId) => {
            const ottInfo = OTT_MAPPING[ottId];
            const programsByOtt = getProgramsByOtt(ottId);

            if (programsByOtt.length === 0) return null;

            return (
              <div key={ottId} className="platform-row">
                <h3 className="platform-title">
                  <span className={`platform-logo ${ottInfo.className}`}>
                    {ottInfo.name.replace("_", " ").toUpperCase()}
                  </span>
                </h3>
                <div className="content-scroll">
                  {programsByOtt.slice(0, 10).map((program) => (
                    <div key={program.programId} className="content-card">
                      <div
                        className="poster-container"
                        onClick={() => handleContentClick(program)}
                        style={{ cursor: "pointer" }}
                      >
                        <div
                          className="poster-image"
                          style={{
                            backgroundImage: program.thumbnailUrl
                              ? `url(${program.thumbnailUrl})`
                              : undefined,
                            backgroundColor: program.thumbnailUrl
                              ? undefined
                              : "#ccc",
                          }}
                        >
                          {!program.thumbnailUrl && <span>이미지 없음</span>}
                        </div>
                      </div>
                      <h4 className="content-title">{program.title}</h4>
                      <div className="content-date">
                        {getDisplayDate(program)}
                      </div>
                      <button
                        className="add-button"
                        onClick={() => handleAddToWishlist(program)}
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
            );
          })}
        </section>
      </main>

      {/* Modal */}
      {selectedProgram && (
        <ContentModal
          content={selectedProgram}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onAddToWishlist={() => handleAddToWishlist(selectedProgram)}
        />
      )}
      <BottomNavigation />
    </div>
  );
};

export default MainPage;