import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import ContentModal from "../components/ContentModal";
import { type Content } from "../api/contentService";
import "../styles/searchResults.css";

const SearchResultsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get("q") || "";

  const [searchResults] = useState<Content[]>([]);
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // TODO: API 호출로 변경
    // 임시: localStorage나 전역 상태에서 데이터 가져오기
    const mockSearch = () => {
      // 여기서는 MainPage의 DEMO_DATA를 사용할 수 없으므로
      // 실제로는 API 호출이나 전역 상태 관리 필요
    };

    mockSearch();
  }, [query]);

  const handleContentClick = (content: Content) => {
    setSelectedContent(content);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedContent(null);
  };

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

          {searchResults.length > 0 ? (
            <div className="search-results-grid">
              {searchResults.map((show) => (
                <div key={show.id} className="content-card">
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
                  <h4 className="content-title">
                    {highlightMatch(show.title, query)}
                  </h4>
                  <div className="content-date">{show.releaseDate}</div>
                  <button className="add-button">
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

      {selectedContent && (
        <ContentModal
          content={selectedContent}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default SearchResultsPage;
