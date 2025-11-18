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

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다!");
      return;
    }

    try {
      await apiClient.post("/auth/signup", {
        email,
        password,
      });
      alert("회원가입 성공!");
      navigate("/login");
    } catch (err: any) {
      if (err.response?.status === 400) {
        setError(err.response.data.message || "이미 사용중인 이메일입니다.");
      } else {
        setError("회원가입 중 오류가 발생했습니다.");
      }
    }
  };

  // --- 렌더링 ---
  // 화면에 어떻게 보일지 정의하는 부분
  return (
    <div className="page-wrapper">
      <SimpleHeader />
      <main className="signup-page-container">
        {/* 흰색 카드 모양의 폼 영역 */}
        <div className="signup-form-container">
          <div>
            <h2 className="signup-title">회원가입</h2>
            <p className="signup-subtitle">
              회원이 되어 다양한 혜택을 경험해보세요!
            </p>
          </div>
          {/* onSubmit 이벤트에 위에서 만든 handleSignup 함수를 연결 */}
          <form className="signup-form" onSubmit={handleSignup}>
            {/* 이메일 입력 섹션 */}
            <div>
              <label htmlFor="email" className="input-label">
                이메일
              </label>
              <input
                id="email"
                type="email" // 이메일 형식만 입력받도록 설정
                value={email} // 입력창의 값은 email 상태 변수와 항상 동일하게 유지
                // onChange 이벤트는 입력창의 내용이 변경될 때마다 실행
                // e.target.value는 사용자가 입력한 최신 텍스트 값
                // 이 값으로 setEmail 함수를 호출하여 email 상태를 업데이트
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com" // 입력창에 아무것도 없을 때 보이는 안내 문구
                required
                className="input-field"
              />
            </div>

            {/* 비밀번호 입력 섹션 */}
            <div>
              <label htmlFor="password" className="input-label">
                비밀번호
              </label>
              <input
                id="password"
                type="password" // 입력 내용을 점(●)으로 표시
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호"
                required
                className="input-field"
              />
            </div>

            {/* 비밀번호 확인 입력 섹션 */}
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

            {/* 회원가입 버튼 */}
            <div>
              <button type="submit" className="submit-button">
                회원가입
              </button>
            </div>
          </form>

          {/* 로그인 페이지로 이동하는 링크 */}
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

// SignupPage 컴포넌트를 다른 파일에서도 사용할 수 있도록 내보내기
export default SignupPage;
