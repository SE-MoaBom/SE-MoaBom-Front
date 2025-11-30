import React, { useState, useEffect } from "react";
import { type Program } from "../api/programService";
import { useWishlist } from "../contexts/WishlistContext";
import "../styles/contentModal.css";

interface ContentModalProps {
  content: Program;
  isOpen: boolean;
  onClose: () => void;
}

// OTT ID 매핑 (MainPage와 동일하게 통일)
const OTT_MAPPING: {
  [key: number]: { name: string; className: string; displayName: string };
} = {
  1: { name: "NETFLIX", className: "netflix", displayName: "넷플릭스" },
  2: { name: "TVING", className: "tving", displayName: "티빙" },
  3: { name: "COUPANG_PLAY", className: "coupang", displayName: "쿠팡플레이" },
  4: { name: "WAVVE", className: "wavve", displayName: "웨이브" },
  5: { name: "DISNEY_PLUS", className: "disney", displayName: "디즈니+" },
  6: { name: "WATCHA", className: "watcha", displayName: "왓챠" },
  7: { name: "LAFTEL", className: "laftel", displayName: "라프텔" },
  8: {
    name: "U_PLUS_MOBILE_TV",
    className: "uplus",
    displayName: "U+모바일tv",
  },
  9: {
    name: "AMAZON_PRIME_VIDEO",
    className: "amazon",
    displayName: "Amazon Prime",
  },
  10: { name: "CINEFOX", className: "cinefox", displayName: "시네폭스" },
};

const ContentModal: React.FC<ContentModalProps> = ({
  content,
  isOpen,
  onClose,
}) => {
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [wishlistItemId, setWishlistItemId] = useState<number | null>(null);

  // 찜 목록에 있는지 확인
  useEffect(() => {
    const item = wishlist.find((w) => w.programId === content.programId);
    setIsInWishlist(!!item);
    setWishlistItemId(item?.wishlistId || null);
  }, [wishlist, content.programId]);

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // OTT ID로 정보 가져오기
  const getOttInfo = (ottId: number) => {
    return (
      OTT_MAPPING[ottId] || {
        name: "UNKNOWN",
        className: "unknown",
        displayName: "알 수 없음",
      }
    );
  };

  // 메타 정보 포맷팅 (날짜, 장르, 러닝타임)
  const formatMetaInfo = () => {
    const parts = [];

    // 날짜 정보
    const releaseDate = content.availability[0]?.releaseDate;
    const expireDate = content.availability[0]?.expireDate;

    if (releaseDate) {
      parts.push(`공개: ${releaseDate}`);
    }
    if (expireDate) {
      parts.push(`종료: ${expireDate}`);
    }

    // 장르
    if (content.genre) {
      parts.push(content.genre);
    }

    // 러닝타임
    if (content.runningTime) {
      const hours = Math.floor(content.runningTime / 60);
      const minutes = content.runningTime % 60;

      if (hours > 0) {
        parts.push(`${hours}시간 ${minutes}분`);
      } else {
        parts.push(`${minutes}분`);
      }
    }

    return parts.join(" · ");
  };

  // 찜하기/삭제 토글 핸들러
  const handleToggleWishlist = async () => {
    if (isInWishlist && wishlistItemId !== null) {
      // 이미 찜한 경우 - 삭제 확인
      const confirmed = window.confirm(
        `'${content.title}'을(를) 보고싶은 목록에서 삭제하시겠습니까?`
      );

      if (confirmed) {
        await removeFromWishlist(wishlistItemId);
      }
    } else {
      // 찜하지 않은 경우 - 추가
      await addToWishlist(
        content.programId,
        content.title,
        content.thumbnailUrl
      );
    }
  };

  // 고유한 OTT만 필터링 (중복 제거)
  const uniqueOtts = content.availability.reduce((acc, avail) => {
    if (!acc.some((item) => item.ottId === avail.ottId)) {
      acc.push(avail);
    }
    return acc;
  }, [] as typeof content.availability);

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-container">
        <button className="modal-close" onClick={onClose} aria-label="닫기">
          ×
        </button>

        <div className="modal-content">
          {/* Poster */}
          <div className="modal-poster-container">
            <div
              className="modal-poster"
              style={{
                backgroundImage: content.thumbnailUrl
                  ? `url(${content.thumbnailUrl})`
                  : undefined,
                backgroundColor: content.thumbnailUrl ? undefined : "#cbd5e0",
              }}
            >
              {!content.thumbnailUrl && (
                <span className="no-image-text">이미지 없음</span>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="modal-info-container">
            <h2 className="modal-title">{content.title}</h2>

            <div className="modal-meta">{formatMetaInfo()}</div>

            <div className="modal-description">
              {content.description || "설명이 없습니다."}
            </div>

            {/* Platforms */}
            <div className="modal-platforms-section">
              <h3 className="modal-platforms-title">
                이 작품을 볼 수 있는 OTT
              </h3>
              <div className="modal-platforms-list">
                {uniqueOtts.map((avail, index) => {
                  const ottInfo = getOttInfo(avail.ottId);
                  return (
                    <div
                      key={`${avail.ottId}-${index}`}
                      className={`modal-platform-logo ${ottInfo.className}`}
                      title={ottInfo.displayName}
                    >
                      {ottInfo.displayName}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Action Button */}
            <div className="modal-action-section">
              <button
                className={`modal-add-button ${isInWishlist ? "added" : ""}`}
                onClick={handleToggleWishlist}
              >
                {isInWishlist ? (
                  <>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path
                        d="M16.6666 5L7.49998 14.1667L3.33331 10"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span className="modal-add-button-text">추가 완료</span>
                  </>
                ) : (
                  <>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path
                        d="M10 4V16M4 10H16"
                        stroke="#FFFFFF"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                    <span className="modal-add-button-text">
                      보고싶은 목록에 추가
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentModal;
