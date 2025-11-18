import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import apiClient from "../api/client";
import SimpleHeader from "../components/SimpleHeader";
import "../styles/LoginPage.css";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await apiClient.post("/auth/login", {
        email,
        password,
      });

      const { token } = response.data;
      localStorage.setItem("token", token);

      // AuthContext 업데이트
      login({ name: email.split("@")[0], email });

      navigate("/");
    } catch (err: any) {
      if (err.response?.status === 401) {
        setError(
          err.response.data.error || "이메일 또는 비밀번호가 올바르지 않습니다."
        );
      } else {
        setError("로그인 중 오류가 발생했습니다.");
      }
    }
  };
  // --- 렌더링 ---
  return (
    <div className="page-wrapper">
      <SimpleHeader />

      <main className="login-page-container">
        <div className="login-form-container">
          <div>
            <h2 className="login-title">로그인</h2>
            <p className="login-subtitle">모아봄에 오신 것을 환영합니다!</p>
          </div>

          <form className="login-form" onSubmit={handleLogin}>
            <div>
              <label htmlFor="email" className="input-label">
                이메일
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                required
                className="input-field"
              />
            </div>

            <div>
              <label htmlFor="password" className="input-label">
                비밀번호
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호"
                required
                className="input-field"
              />
            </div>

            <div>
              <button type="submit" className="submit-button">
                로그인
              </button>
            </div>
          </form>

          <p className="signup-prompt">
            계정이 없으신가요?
            <a href="/signup" className="signup-link">
              {" "}
              회원가입
            </a>
          </p>
        </div>
      </main>
    </div>
  );
};

export default LoginPage;
