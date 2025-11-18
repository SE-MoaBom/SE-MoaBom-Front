import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../api/client";
import SimpleHeader from "../components/SimpleHeader";
import "../styles/SignupPage.css";

const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // 이메일 형식 검증
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // 비밀번호 강도 검증
  const validatePassword = (password: string): string | null => {
    if (password.length < 8) {
      return "비밀번호는 8자 이상이어야 합니다.";
    }
    if (!/[a-zA-Z]/.test(password)) {
      return "비밀번호에 영문자를 포함해야 합니다.";
    }
    if (!/[0-9]/.test(password)) {
      return "비밀번호에 숫자를 포함해야 합니다.";
    }
    return null;
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // 이메일 형식 검증
    if (!validateEmail(email)) {
      setError("올바른 이메일 형식을 입력해주세요.");
      return;
    }

    // 비밀번호 강도 검증
    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    // 비밀번호 확인
    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    setIsLoading(true);

    try {
      await apiClient.post("/auth/signup", {
        email,
        password,
      });
      alert("회원가입이 완료되었습니다! 로그인 후 구독 정보를 등록해주세요.");
      navigate("/login");
    } catch (err: any) {
      if (err.response) {
        const status = err.response.status;
        if (status === 400) {
          setError(err.response.data.message || "이미 사용중인 이메일입니다.");
        } else if (status === 500) {
          setError("서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
        } else {
          setError("회원가입 중 오류가 발생했습니다.");
        }
      } else if (err.request) {
        setError("서버에 연결할 수 없습니다. 네트워크를 확인해주세요.");
      } else {
        setError("알 수 없는 오류가 발생했습니다.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      <SimpleHeader />
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
                placeholder="8자 이상, 영문+숫자"
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

            {error && <p className="error-message">{error}</p>}

            <div>
              <button
                type="submit"
                className="submit-button"
                disabled={isLoading}
              >
                {isLoading ? "처리 중..." : "회원가입"}
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
