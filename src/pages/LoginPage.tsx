import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { login as loginAPI } from "../api/authService";
import SimpleHeader from "../components/SimpleHeader";
import "../styles/LoginPage.css";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // 이메일 형식 검증
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // 빈 값 체크
    if (!email.trim()) {
      setError("이메일을 입력해주세요.");
      return;
    }

    if (!password) {
      setError("비밀번호를 입력해주세요.");
      return;
    }

    // 이메일 형식 검증
    if (!validateEmail(email)) {
      setError("올바른 이메일 형식을 입력해주세요.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await loginAPI({ email, password });
      await authLogin(response.token);

      // 신규 사용자인지 확인
      const isNewUser = localStorage.getItem("isNewUser") === "true";

      if (isNewUser) {
        // 플래그 제거 (한 번만 실행)
        localStorage.removeItem("isNewUser");
        // 구독 페이지로 이동
        navigate("/subscribe", { state: { isFirstLogin: true } });
      } else {
        // 기존 사용자는 메인 페이지로 이동
        navigate("/");
      }
    } catch (err: any) {
      if (err.response) {
        // 서버 응답이 있는 경우
        const status = err.response.status;
        if (status === 401) {
          setError(
            err.response.data.error ||
              "이메일 또는 비밀번호가 올바르지 않습니다."
          );
        } else if (status === 500) {
          setError("서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
        } else {
          setError("로그인 중 오류가 발생했습니다.");
        }
      } else if (err.request) {
        // 네트워크 에러 (서버 응답 없음)
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

            {/* 에러 메시지 표시 */}
            {error && <p className="error-message">{error}</p>}

            <div>
              <button
                type="submit"
                className="submit-button"
                disabled={isLoading}
              >
                {isLoading ? "로그인 중..." : "로그인"}
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
