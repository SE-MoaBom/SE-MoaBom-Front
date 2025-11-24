import React from "react";
import { type Program } from "../api/programService";
import "../styles/ContentModal.css";

interface ContentModalProps {
  content: Program; // ← Content 대신 Program 사용
  isOpen: boolean;
  onClose: () => void;
  onAddToWishlist: () => void;
}

const ContentModal: React.FC<ContentModalProps> = ({
  content,
  isOpen,
  onClose,
  onAddToWishlist,
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
      case "DISNEY+":
        return "disney";
      default:
        return "";
    }
  };

  // OTT ID로 이름 변환
  const getOttName = (ottId: number): string => {
    const ottNames: { [key: number]: string } = {
      1: "NETFLIX",
      2: "WAVVE",
      3: "DISNEY_PLUS",
    };
    return ottNames[ottId] || "UNKNOWN";
  };

  const formatMetaInfo = () => {
    const parts = [];

    // 날짜 정보
    const releaseDate = content.availability[0]?.releaseDate;
    const expireDate = content.availability[0]?.expireDate;
    if (releaseDate) parts.push(releaseDate);
    else if (expireDate) parts.push(`${expireDate}까지`);

    // 장르
    if (content.genre) parts.push(content.genre);

    // 러닝타임
    if (content.runningTime) parts.push(`${content.runningTime}분`);

    return parts.join(" · ");
  };

  const handleAddClick = () => {
    onAddToWishlist();
    onClose();
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
                backgroundImage: content.thumbnailUrl
                  ? `url(${content.thumbnailUrl})`
                  : undefined,
                backgroundColor: content.thumbnailUrl ? undefined : "#cbd5e0",
              }}
            >
              {!content.thumbnailUrl && (
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
                {content.availability.map(
                  (
                    avail: { ottId: number },
                    index: React.Key | null | undefined
                  ) => {
                    const platformName = getOttName(avail.ottId);
                    return (
                      <div
                        key={index}
                        className={`modal-platform-logo ${getPlatformLogoClass(
                          platformName
                        )}`}
                      >
                        {platformName.replace("_", " ").toUpperCase()}
                      </div>
                    );
                  }
                )}
              </div>
            </div>

            {/* Action Button */}
            <div className="modal-action-section">
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
