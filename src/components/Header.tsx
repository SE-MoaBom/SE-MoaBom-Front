import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import moabomLogo from "../assets/moabom.svg";

const Header: React.FC = () => {
  const { isLoggedIn, logout } = useAuth();

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo-container">
          <div className="logo-icon">
            <img src={moabomLogo} width="32" height="32" />
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
