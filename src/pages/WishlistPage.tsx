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

  // 삭제 버튼 클릭 시 (수정됨: 확인 팝업 추가)
  const handleDeleteItem = async (wishlistId: number, title: string) => {
    // 1. 확인 팝업
    const confirmed = window.confirm(
      `'${title}'을(를) 찜 목록에서 삭제하시겠습니까?`
    );

    if (confirmed) {
      await removeFromWishlist(wishlistId);
    }
  };

  // 스케줄러 페이지로 이동 (수정됨: 알림 팝업 추가)
  const handleRecommendClick = () => {
    // 1. 알림 팝업
    alert("이 리스트를 기반으로 최적의 시청 스케줄을 계산합니다!");

    // 2. 페이지 이동
    navigate("/scheduler");
  };

  // 콘텐츠 둘러보기 버튼 (홈으로 이동)
  const handleBrowseClick = () => {
    navigate("/");
  };

  if (isLoading) {
    return (
      <div className="page-wrapper">
        <Header />
        <main className="wishlist-container">
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
        {/* 에러 메시지 */}
        {error && <p className="error-message">{error}</p>}

        {wishlist.length === 0 ? (
          // 빈 화면일 때
          <div className="wishlist-empty-state">
            <h3>찜한 콘텐츠가 없습니다.</h3>
            <p>
              아직 찜한 작품이 없네요.
              <br />
              홈으로 가서 보고 싶은 콘텐츠를 찾아보세요!
            </p>
            <button className="browse-button" onClick={handleBrowseClick}>
              콘텐츠 둘러보기
            </button>
          </div>
        ) : (
          // 목록이 있을 때
          <>
            <div className="wishlist-list">
              {wishlist.map((item) => (
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
                      <span className="item-platform">
                        {item.ottList && item.ottList.length > 0
                          ? item.ottList.join(", ")
                          : "OTT 정보 없음"}
                      </span>
                    </div>
                  </div>
                  <button
                    // 수정됨: title도 함께 전달
                    onClick={() =>
                      handleDeleteItem(item.wishlistId, item.title)
                    }
                    className="delete-button"
                  >
                    <TrashIcon />
                  </button>
                </div>
              ))}
            </div>

            <div className="recommend-button-container">
              <button
                className="recommend-button"
                onClick={handleRecommendClick}
              >
                이 리스트로 시청 스케줄 추천받기
              </button>
            </div>
          </>
        )}
      </main>
      <BottomNavigation />
    </div>
  );
};

export default WishlistPage;
