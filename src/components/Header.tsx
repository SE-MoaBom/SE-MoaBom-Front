import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Header: React.FC = () => {
  const { isLoggedIn, logout } = useAuth();

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo-container">
          <div className="logo-icon">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <path
                d="M16 2.66667C8.63621 2.66667 2.66667 8.63621 2.66667 16C2.66667 23.3638 8.63621 29.3333 16 29.3333C23.3638 29.3333 29.3333 23.3638 29.3333 16C29.3333 8.63621 23.3638 2.66667 16 2.66667Z"
                fill="#000000"
              />
            </svg>
          </div>
          <h1 className="logo-text">모아봄</h1>
        </Link>

        <nav className="nav-container">
          <div className="nav">
            <Link to="/scheduler" className="nav-item">
              스케줄러
            </Link>
            <Link to="/subscribe" className="nav-item">
              나의 구독
            </Link>
            <Link to="/wishlist" className="nav-item">
              내가 찜한 리스트
            </Link>
          </div>

          <div className="auth-buttons">
            {isLoggedIn ? (
              <Link to="/profile" className="profile-button">
                <div className="profile-icon">{/* SVG 아이콘 */}</div>
              </Link>
            ) : (
              <Link to="/login" className="login-button">
                로그인
              </Link>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
