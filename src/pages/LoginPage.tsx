import React, { useState } from "react";
import SimpleHeader from "../components/SimpleHeader";
import "../styles/LoginPage.css";

const LoginPage: React.FC = () => {
  // --- 상태 관리 ---
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // --- 이벤트 핸들러 ---
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    console.log("로그인 시도:");
    console.log("이메일:", email);
    console.log("비밀번호:", password);
    alert("로그인 성공!");
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
