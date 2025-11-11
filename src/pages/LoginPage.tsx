import React, { useState } from "react";
import "../styles/LoginPage.css";

const SimpleLogoHeader = () => {
  return (
    <header className="simple-header">
      <div className="logo-container">
        <div className="logo-icon"></div>
        <span className="logo-text">모아봄</span>
      </div>
    </header>
  );
};

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    console.log("로그인 시도:");
    console.log("이메일:", email);
    console.log("비밀번호:", password);
    alert("로그인 성공!");
  };

  return (
    <div className="page-wrapper">
      <SimpleLogoHeader />

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
