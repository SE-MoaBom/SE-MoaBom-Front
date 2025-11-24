import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import ContentModal from "../components/ContentModal";
import { searchPrograms, type Program } from "../api/programService";
import { useWishlist } from "../contexts/WishlistContext";
import "../styles/searchResults.css";

const SearchResultsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get("q") || "";

  const [searchResults, setSearchResults] = useState<Program[]>([]);
  const [selectedContent, setSelectedContent] = useState<Program | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { addToWishlist } = useWishlist();

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

  // 찜하기 핸들러
  const handleAddToWishlist = (program: Program) => {
    addToWishlist(program.programId, program.title);
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
              {searchResults.map((program) => (
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
                  <div className="content-date">{getDisplayDate(program)}</div>
                  <button
                    className="add-button"
                    onClick={() => handleAddToWishlist(program)}
                  >
                    <svg width="16" height="20" viewBox="0 0 16 20" fill="none">
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
          ) : (
            <div className="no-results">
              <p>"{query}"에 대한 검색 결과가 없습니다.</p>
            </div>
          )}
        </div>
      </main>

      {/* 변환 함수 없이 바로 전달 */}
      {selectedContent && (
        <ContentModal
          content={selectedContent}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onAddToWishlist={() => handleAddToWishlist(selectedContent)}
        />
      )}
    </div>
  );
};

export default SearchResultsPage;
