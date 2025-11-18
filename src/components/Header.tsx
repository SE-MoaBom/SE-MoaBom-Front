import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import moabomLogo from "../assets/moabom.svg";

const Header: React.FC = () => {
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
    navigate("/");
  };

  const handleProfileClick = () => {
    setShowDropdown(!showDropdown);
  };

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
              <div className="profile-dropdown-container" ref={dropdownRef}>
                <button
                  className="profile-button"
                  onClick={handleProfileClick}
                  aria-label="프로필 메뉴"
                >
                  <div className="profile-icon">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z"
                        fill="#374151"
                      />
                    </svg>
                  </div>
                </button>

                {showDropdown && (
                  <div className="profile-dropdown">
                    <Link
                      to="/profile"
                      className="dropdown-item"
                      onClick={() => setShowDropdown(false)}
                    >
                      프로필
                    </Link>
                    <button
                      className="dropdown-item logout-item"
                      onClick={handleLogout}
                    >
                      로그아웃
                    </button>
                  </div>
                )}
              </div>
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
