import React from "react";
import Header from "../components/Header";
import { useWishlist } from "../contexts/WishlistContext"; // useWishlist 훅 불러오기

import "../styles/WishlistPage.css";

const TrashIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24"
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
  // 더미 데이터와 useState를 삭제하고, useWishlist 훅으로 데이터 가져오기
  const { wishlist, removeFromWishlist } = useWishlist();

  // 삭제 버튼 클릭 시, Context의 removeFromWishlist 함수 호출
  const handleDeleteItem = (idToDelete: number) => {
    removeFromWishlist(idToDelete);
    console.log(`${idToDelete}번 아이템 삭제됨`);
  };

  return (
    <div className="page-wrapper">
      <Header />
      <main className="wishlist-container">
        <h1 className="wishlist-title">내가 찜한 리스트</h1>

        <div className="wishlist-list">
          {/* wishlist 배열이 비어있는 경우 메시지 표시 */}
          {wishlist.length === 0 ? (
            <p>찜한 콘텐츠가 없습니다.</p>
          ) : (
            // Context에서 가져온 wishlist 데이터를 화면에 그리기
            wishlist.map((item) => (
              <div key={item.id} className="wishlist-item">
                <div className="item-details">
                  {/* posterUrl -> image로 속성 이름 맞추기 */}
                  <img
                    src={
                      item.image ||
                      "https://via.placeholder.com/60x90/ccc/FFFFFF?text=No+Image"
                    }
                    alt={`${item.title} 포스터`}
                    className="item-poster"
                  />
                  <div className="item-info">
                    <span className="item-title">{item.title}</span>
                    <span className="item-platform">{item.platform}</span>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteItem(item.id)}
                  className="delete-button"
                >
                  <TrashIcon />
                </button>
              </div>
            ))
          )}
        </div>

        {/* 찜한 목록이 있을 때만 버튼이 보이도록 조건부 렌더링 */}
        {wishlist.length > 0 && (
          <div className="recommend-button-container">
            <button className="recommend-button">
              이 리스트로 구독 일정 추천받기
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default WishlistPage;
