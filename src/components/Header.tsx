import React from "react";
import { Link } from "react-router-dom";

const Header: React.FC = () => {
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
            <Link to="/features" className="nav-item">
              주요 기능
            </Link>
            <Link to="/benefits" className="nav-item">
              서비스 혜택
            </Link>
            <Link to="/how-it-works" className="nav-item">
              이용 방법
            </Link>
          </div>

          <div className="auth-buttons">
            <Link to="/profile" className="profile-button">
              <div className="profile-icon">
                <svg width="24" height="28" viewBox="0 0 24 28" fill="none">
                  <path
                    d="M12 14C15.3137 14 18 11.3137 18 8C18 4.68629 15.3137 2 12 2C8.68629 2 6 4.68629 6 8C6 11.3137 8.68629 14 12 14ZM12 17C7.58172 17 4 20.5817 4 25C4 25.5523 4.44772 26 5 26H19C19.5523 26 20 25.5523 20 25C20 20.5817 16.4183 17 12 17Z"
                    fill="#1F2937"
                  />
                </svg>
              </div>
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
