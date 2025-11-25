import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import BottomNavigation from "../components/BottomNavigation";
import { useAuth } from "../contexts/AuthContext";
import { getMe, type User } from "../api/authService";
import "../styles/profilePage.css";

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { isLoggedIn, logout } = useAuth();
  const [userInfo, setUserInfo] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    const fetchUserInfo = async () => {
      try {
        const data = await getMe();
        setUserInfo(data);
      } catch (error) {
        console.error("사용자 정보 조회 실패:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserInfo();
  }, [isLoggedIn, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (isLoading) {
    return (
      <div className="page-wrapper">
        <Header />
        <main className="profile-container">
          <div className="loading-state">로딩 중...</div>
        </main>
        <BottomNavigation />
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <Header />
      <main className="profile-container">
        <section className="profile-section">
          <h2 className="profile-section-title">나의 정보</h2>

          <div className="profile-info-container">
            <div className="profile-field">
              <label className="profile-label">닉네임</label>
              <div className="profile-input">
                <div className="profile-value">
                  {userInfo?.email.split("@")[0] || "사용자"}
                </div>
              </div>
            </div>

            <div className="profile-field">
              <label className="profile-label">이메일</label>
              <div className="profile-input">
                <div className="profile-value">{userInfo?.email || ""}</div>
              </div>
            </div>
          </div>
        </section>

        <section className="profile-actions">
          <button className="logout-button" onClick={handleLogout}>
            로그아웃
          </button>
        </section>
      </main>
      <BottomNavigation />
    </div>
  );
};

export default ProfilePage;
