import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWishlist } from "../contexts/WishlistContext";
import "../styles/searchBar.css";

interface Program {
  programId: number;
  title: string;
  thumbnailUrl: string;
  backdropUrl: string;
  availability: Array<{
    ottId: number;
    logoUrl: string;
    releaseDate: string | null;
    expireDate: string | null;
  }>;
  ranking: number | null;
  status: "UPCOMING" | "EXPIRING" | null;
}

interface SearchBarProps {
  programs: Program[];
}

const SearchBar: React.FC<SearchBarProps> = ({ programs }) => {
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Program[]>([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const navigate = useNavigate();

  // 위시리스트에 있는지 확인
  const isInWishlist = (programId: number): boolean => {
    return wishlist.some((item) => item.programId === programId);
  };

  // 위시리스트 토글 핸들러
  const handleToggleWishlist = async (program: Program) => {
    const item = wishlist.find((w) => w.programId === program.programId);

    if (item) {
      // 이미 찜한 경우 - 삭제
      await removeFromWishlist(item.wishlistId);
    } else {
      // 찜하지 않은 경우 - 추가
      await addToWishlist(
        program.programId,
        program.title,
        program.thumbnailUrl
      );
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
      setShowSearchDropdown(false);
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleDropdownItemClick = (program: Program) => {
    setSearchQuery(program.title);
    setShowSearchDropdown(false);
    navigate(`/search?q=${encodeURIComponent(program.title)}`);
  };

  const highlightMatch = (text: string, query: string) => {
    if (!query) return text;
    const parts = text.split(new RegExp(`(${query})`, "gi"));
    return (
      <>
        {parts.map((part, i) =>
          part.toLowerCase() === query.toLowerCase() ? (
            <span key={i} className="highlight">
              {part}
            </span>
          ) : (
            part
          )
        )}
      </>
    );
  };

  return (
    <div className="search-bar-container">
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
          {searchResults.map((program) => {
            const inWishlist = isInWishlist(program.programId);
            return (
              <div
                key={program.programId}
                className="search-dropdown-item"
                onClick={() => handleDropdownItemClick(program)}
              >
                <div className="search-item-title">
                  {highlightMatch(program.title, searchQuery)}
                </div>
                <button
                  className={`search-add-button ${inWishlist ? "added" : ""}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleWishlist(program);
                  }}
                >
                  {inWishlist ? (
                    <>
                      <svg
                        width="16"
                        height="16"
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
                      <span className="search-add-button-text">추가 완료</span>
                    </>
                  ) : (
                    <>
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
                        보고 싶은 목록에 추가
                      </span>
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
