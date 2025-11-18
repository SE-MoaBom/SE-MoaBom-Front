import React from "react";
import { type Content } from "../api/contentService";
import "../styles/contentModal.css";

// props 타입 정의에 onAddToWishlist 추가
interface ContentModalProps {
  content: Content;
  isOpen: boolean;
  onClose: () => void;
  onAddToWishlist: (content: Content) => void; // 찜 목록에 추가하는 함수
}

const ContentModal: React.FC<ContentModalProps> = ({
  content,
  isOpen,
  onClose,
  onAddToWishlist, // props로부터 onAddToWishlist 함수 받기
}) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const getPlatformLogoClass = (platform: string) => {
    switch (platform.toUpperCase()) {
      case "NETFLIX":
        return "netflix";
      case "WAVVE":
        return "wavve";
      case "DISNEY_PLUS":
        return "disney";
      default:
        return "";
    }
  };

  const formatMetaInfo = () => {
    const parts = [];
    if (content.releaseDate) parts.push(content.releaseDate);
    if (content.genres && content.genres.length > 0)
      parts.push(content.genres.join(", "));
    if (content.runtime) parts.push(content.runtime);
    return parts.join(" · ");
  };

  // 추가 버튼 클릭 시 실행될 핸들러 함수
  const handleAddClick = () => {
    onAddToWishlist(content); // Context의 함수를 호출하여 아이템 추가
    onClose(); // 아이템을 추가한 후 모달 닫기
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-container">
        <button className="modal-close" onClick={onClose}>
          ×
        </button>

        <div className="modal-content">
          {/* Poster */}
          <div className="modal-poster-container">
            <div
              className="modal-poster"
              style={{
                backgroundImage: content.image
                  ? `url(${content.image})`
                  : undefined,
                backgroundColor: content.image ? undefined : "#cbd5e0",
              }}
            >
              {!content.image && (
                <span style={{ color: "#6b7280" }}>이미지 없음</span>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="modal-info-container">
            <h2 className="modal-title">{content.title}</h2>

            <div className="modal-meta">{formatMetaInfo()}</div>

            <div className="modal-description">{content.description}</div>

            {/* Platforms */}
            <div className="modal-platforms-section">
              <h3 className="modal-platforms-title">
                이 작품을 볼 수 있는 OTT
              </h3>
              <div className="modal-platforms-list">
                {content.availablePlatforms &&
                content.availablePlatforms.length > 0 ? (
                  content.availablePlatforms.map((platform, index) => (
                    <div
                      key={index}
                      className={`modal-platform-logo ${getPlatformLogoClass(
                        platform
                      )}`}
                    >
                      {platform.toUpperCase()}
                    </div>
                  ))
                ) : (
                  <div
                    className={`modal-platform-logo ${getPlatformLogoClass(
                      content.platform
                    )}`}
                  >
                    {content.platform.toUpperCase()}
                  </div>
                )}
              </div>
            </div>

            {/* Action Button */}
            <div className="modal-action-section">
              {/* 버튼에 onClick 이벤트 연결 */}
              <button className="modal-add-button" onClick={handleAddClick}>
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
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentModal;
