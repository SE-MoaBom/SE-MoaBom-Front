import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import ContentModal from "../components/ContentModal";
import SearchBar from "../components/SearchBar";
import { searchPrograms, type Program } from "../api/programService";
import { useWishlist } from "../contexts/WishlistContext";
import "../styles/searchResults.css";
import BottomNavigation from "../components/BottomNavigation";

const SearchResultsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get("q") || "";

  const [searchResults, setSearchResults] = useState<Program[]>([]);
  const [allPrograms, setAllPrograms] = useState<Program[]>([]);
  const [selectedContent, setSelectedContent] = useState<Program | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();

  // 전체 프로그램 목록 로드 (SearchBar용)
  useEffect(() => {
    const fetchAllPrograms = async () => {
      try {
        const [popularRes, upcomingRes, expiringRes] = await Promise.all([
          searchPrograms({ sort: "RANKING", size: 50 }),
          searchPrograms({ status: "UPCOMING", size: 50 }),
          searchPrograms({ status: "EXPIRING", size: 50 }),
        ]);

        const combined = [
          ...popularRes.results,
          ...upcomingRes.results,
          ...expiringRes.results,
        ];
        setAllPrograms(combined);
      } catch (error) {
        console.error("프로그램 로딩 실패:", error);
      }
    };

    fetchAllPrograms();
  }, []);

  // 검색 실행
  useEffect(() => {
    const performSearch = async () => {
      if (!query.trim()) {
        setSearchResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const result = await searchPrograms({
          keyword: query,
          status: "ALL",
          size: 50,
        });
        setSearchResults(result.results);
      } catch (error) {
        console.error("검색 실패:", error);
        setSearchResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    performSearch();
  }, [query]);

  // 콘텐츠 클릭 핸들러
  const handleContentClick = (program: Program) => {
    setSelectedContent(program);
    setIsModalOpen(true);
  };

  // 모달 닫기 핸들러
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedContent(null);
  };

  // 찜 목록에 있는지 확인
  const isInWishlist = (programId: number): boolean => {
    return wishlist.some((item) => item.programId === programId);
  };

  // 찜하기 토글 핸들러
  const handleToggleWishlist = async (
    e: React.MouseEvent,
    program: Program
  ) => {
    e.stopPropagation();

    const item = wishlist.find((w) => w.programId === program.programId);

    if (item) {
      const confirmed = window.confirm(
        `'${program.title}'을(를) 보고싶은 목록에서 삭제하시겠습니까?`
      );

      if (confirmed) {
        await removeFromWishlist(item.wishlistId);
      }
    } else {
      await addToWishlist(
        program.programId,
        program.title,
        program.thumbnailUrl
      );
    }
  };

  // 검색어 하이라이트
  const highlightMatch = (text: string, query: string) => {
    if (!query.trim()) return text;
    const parts = text.split(new RegExp(`(${query})`, "gi"));
    return parts.map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <span key={index} className="highlight">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  // 날짜 표시 포맷
  const getDisplayDate = (program: Program): string => {
    if (program.status === "UPCOMING") {
      return program.availability[0]?.releaseDate || "";
    } else if (program.status === "EXPIRING") {
      return program.availability[0]?.expireDate || "";
    }
    return "현재 방영중";
  };

  return (
    <div className="search-results-page">
      <Header />

      {/* Search Section */}
      <section className="search-section">
        <div className="search-container">
          <SearchBar programs={allPrograms} />
        </div>
      </section>

      <main className="search-results-main">
        <div className="search-results-container">
          <div className="search-results-header">
            <h2>
              "{query}" 검색 결과 ({searchResults.length})
            </h2>
            <button className="back-button" onClick={() => navigate("/")}>
              메인으로
            </button>
          </div>

          {isLoading ? (
            <div className="loading-container">
              <div className="loading-spinner">검색 중...</div>
            </div>
          ) : searchResults.length > 0 ? (
            <div className="search-results-grid">
              {searchResults.map((program) => {
                const inWishlist = isInWishlist(program.programId);
                return (
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
                    <h4 className="content-title">
                      {highlightMatch(program.title, query)}
                    </h4>
                    <div className="content-date">
                      {getDisplayDate(program)}
                    </div>
                    <button
                      className={`wishlist-toggle-button ${
                        inWishlist ? "added" : ""
                      }`}
                      onClick={(e) => handleToggleWishlist(e, program)}
                    >
                      {inWishlist ? (
                        <>
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                          >
                            <path
                              d="M16.6666 5L7.49998 14.1667L3.33331 10"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          <span>추가 완료</span>
                        </>
                      ) : (
                        <>
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                          >
                            <path
                              d="M10 4V16M4 10H16"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                            />
                          </svg>
                          <span>보고 싶은 목록에 추가</span>
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="no-results">
              <p>"{query}"에 대한 검색 결과가 없습니다.</p>
            </div>
          )}
        </div>
      </main>

      {selectedContent && (
        <ContentModal
          content={selectedContent}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
      <BottomNavigation />
    </div>
  );
};

export default SearchResultsPage;
