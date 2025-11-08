import React, { useState } from "react";
import "../styles/SignupPage.css";

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

const SignupPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("비밀번호가 일치하지 않습니다!");
      return;
    }
    console.log("회원가입 시도:", { email, password });
    alert("회원가입 성공!");
  };

  return (
    <div className="page-wrapper">
      <SimpleLogoHeader />
      <main className="signup-page-container">
        <div className="signup-form-container">
          <div>
            <h2 className="signup-title">회원가입</h2>
            <p className="signup-subtitle">
              회원이 되어 다양한 혜택을 경험해보세요!
            </p>
          </div>
          <form className="signup-form" onSubmit={handleSignup}>
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
              <label htmlFor="confirmPassword" className="input-label">
                비밀번호 확인
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="비밀번호 확인"
                required
                className="input-field"
              />
            </div>
            <div>
              <button type="submit" className="submit-button">
                회원가입
              </button>
            </div>
          </form>
          <p className="login-prompt">
            이미 회원이신가요?
            <a href="/login" className="login-link">
              {" "}
              로그인하기
            </a>
          </p>
        </div>
      </main>
    </div>
  );
};

export default SignupPage;
