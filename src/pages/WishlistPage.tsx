import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { useWishlist } from "../contexts/WishlistContext";

import "../styles/wishlistPage.css";
import BottomNavigation from "../components/BottomNavigation";

const TrashIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
  </svg>
);

const WishlistPage: React.FC = () => {
  const navigate = useNavigate();
  const { wishlist, removeFromWishlist, isLoading, error } = useWishlist();

  // 삭제 버튼 클릭 시
  const handleDeleteItem = async (wishlistId: number) => {
    await removeFromWishlist(wishlistId);
  };

  // 구독 일정 추천 페이지로 이동
  const handleRecommendClick = () => {
    navigate("/scheduler");
  };

  if (isLoading) {
    return (
      <div className="page-wrapper">
        <Header />
        <main className="wishlist-container">
          <h1 className="wishlist-title">내가 찜한 리스트</h1>
          <div className="loading-state">
            <p>로딩 중...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <Header />
      <main className="wishlist-container">
        <h1 className="wishlist-title">내가 찜한 리스트</h1>

        {error && <p className="error-message">{error}</p>}

        <div className="wishlist-list">
          {wishlist.length === 0 ? (
            <p className="empty-message">찜한 콘텐츠가 없습니다.</p>
          ) : (
            wishlist.map((item) => (
              <div key={item.wishlistId} className="wishlist-item">
                <div className="item-details">
                  <img
                    src={
                      item.thumbnailUrl ||
                      "https://via.placeholder.com/60x90/ccc/FFFFFF?text=No+Image"
                    }
                    alt={`${item.title} 포스터`}
                    className="item-poster"
                  />
                  <div className="item-info">
                    <span className="item-title">{item.title}</span>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteItem(item.wishlistId)}
                  className="delete-button"
                >
                  <TrashIcon />
                </button>
              </div>
            ))
          )}
        </div>

        {wishlist.length > 0 && (
          <div className="recommend-button-container">
            <button className="recommend-button" onClick={handleRecommendClick}>
              이 리스트로 구독 일정 추천받기
            </button>
          </div>
        )}
      </main>
      <BottomNavigation />
    </div>
  );
};

export default WishlistPage;
