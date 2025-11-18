import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import apiClient from "../api/client";
import SimpleHeader from "../components/SimpleHeader";
import "../styles/SignupOttPage.css";

interface OttInfo {
  ottId: number;
  name: string;
  price: number;
  logoUrl: string;
}

interface SelectedOtt {
  ottId: number;
  startDate: string;
  endDate: string;
}

const SignupOttPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 이전 페이지에서 전달받은 토큰
  const token = location.state?.token;

  const [ottList, setOttList] = useState<OttInfo[]>([]);
  const [selectedOtts, setSelectedOtts] = useState<SelectedOtt[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingOtt, setIsLoadingOtt] = useState(true);

  // 토큰이 없으면 회원가입 페이지로 리다이렉트
  useEffect(() => {
    if (!token) {
      navigate("/signup");
      return;
    }

    // OTT 목록 불러오기
    fetchOttList();
  }, [token, navigate]);

  const fetchOttList = async () => {
    try {
      const response = await apiClient.get("/otts");
      setOttList(response.data);
    } catch (err) {
      setError("OTT 목록을 불러오는데 실패했습니다.");
    } finally {
      setIsLoadingOtt(false);
    }
  };

  // OTT 선택/해제 토글
  const toggleOttSelection = (ottId: number) => {
    const isSelected = selectedOtts.find((ott) => ott.ottId === ottId);

    if (isSelected) {
      setSelectedOtts(selectedOtts.filter((ott) => ott.ottId !== ottId));
    } else {
      // 오늘 날짜를 기본값으로 설정
      const today = new Date().toISOString().split("T")[0];
      setSelectedOtts([
        ...selectedOtts,
        {
          ottId,
          startDate: today,
          endDate: "",
        },
      ]);
    }
  };

  // 날짜 변경 핸들러
  const handleDateChange = (
    ottId: number,
    field: "startDate" | "endDate",
    value: string
  ) => {
    setSelectedOtts(
      selectedOtts.map((ott) =>
        ott.ottId === ottId ? { ...ott, [field]: value } : ott
      )
    );
  };

  // 구독 정보 저장
  const handleSubmit = async () => {
    setError("");

    // 선택된 OTT가 없어도 진행 가능 (건너뛰기)
    if (selectedOtts.length === 0) {
      alert("회원가입이 완료되었습니다!");
      navigate("/login");
      return;
    }

    // 시작일 검증
    for (const ott of selectedOtts) {
      if (!ott.startDate) {
        const ottName = ottList.find((o) => o.ottId === ott.ottId)?.name;
        setError(`${ottName}의 구독 시작일을 입력해주세요.`);
        return;
      }
    }

    setIsLoading(true);

    try {
      // 토큰을 헤더에 설정
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      // 각 OTT 구독 정보를 저장
      for (const ott of selectedOtts) {
        await apiClient.post(
          "/subscriptions",
          {
            ottId: ott.ottId,
            startDate: ott.startDate,
            endDate: ott.endDate || null,
          },
          config
        );
      }

      alert("회원가입이 완료되었습니다!");
      navigate("/login");
    } catch (err: any) {
      if (err.response) {
        setError("구독 정보 저장 중 오류가 발생했습니다.");
      } else if (err.request) {
        setError("서버에 연결할 수 없습니다.");
      } else {
        setError("알 수 없는 오류가 발생했습니다.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 건너뛰기
  const handleSkip = () => {
    alert("회원가입이 완료되었습니다! 구독 정보는 나중에 추가할 수 있습니다.");
    navigate("/login");
  };

  return (
    <div className="page-wrapper">
      <SimpleHeader />
      <main className="signup-ott-container">
        <div className="signup-ott-form-container">
          <div>
            <h2 className="signup-ott-title">구독 중인 OTT 선택</h2>
            <p className="signup-ott-subtitle">
              현재 구독 중인 OTT 서비스를 선택해주세요.
            </p>
          </div>

          {isLoadingOtt ? (
            <div className="loading-message">OTT 목록을 불러오는 중...</div>
          ) : (
            <>
              {/* OTT 선택 영역 */}
              <div className="ott-selection-area">
                {ottList.map((ott) => {
                  const isSelected = selectedOtts.find(
                    (s) => s.ottId === ott.ottId
                  );
                  return (
                    <div key={ott.ottId} className="ott-item-wrapper">
                      <div
                        className={`ott-item ${isSelected ? "selected" : ""}`}
                        onClick={() => toggleOttSelection(ott.ottId)}
                      >
                        <div className="ott-info">
                          <span className="ott-name">{ott.name}</span>
                          <span className="ott-price">
                            월 {ott.price.toLocaleString()}원
                          </span>
                        </div>
                        <div
                          className={`ott-checkbox ${
                            isSelected ? "checked" : ""
                          }`}
                        >
                          {isSelected && "✓"}
                        </div>
                      </div>

                      {/* 선택된 OTT의 날짜 입력 */}
                      {isSelected && (
                        <div className="ott-date-inputs">
                          <div className="date-input-group">
                            <label>구독 시작일</label>
                            <input
                              type="date"
                              value={isSelected.startDate}
                              onChange={(e) =>
                                handleDateChange(
                                  ott.ottId,
                                  "startDate",
                                  e.target.value
                                )
                              }
                              className="date-input"
                            />
                          </div>
                          <div className="date-input-group">
                            <label>구독 종료일 (선택)</label>
                            <input
                              type="date"
                              value={isSelected.endDate}
                              onChange={(e) =>
                                handleDateChange(
                                  ott.ottId,
                                  "endDate",
                                  e.target.value
                                )
                              }
                              className="date-input"
                              min={isSelected.startDate}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* 선택된 OTT 요약 */}
              {selectedOtts.length > 0 && (
                <div className="selected-summary">
                  <span>{selectedOtts.length}개 OTT 선택됨</span>
                  <span className="total-price">
                    월{" "}
                    {selectedOtts
                      .reduce((sum, selected) => {
                        const ott = ottList.find(
                          (o) => o.ottId === selected.ottId
                        );
                        return sum + (ott?.price || 0);
                      }, 0)
                      .toLocaleString()}
                    원
                  </span>
                </div>
              )}

              {/* 에러 메시지 */}
              {error && <p className="error-message">{error}</p>}

              {/* 버튼 영역 */}
              <div className="button-group">
                <button
                  type="button"
                  className="skip-button"
                  onClick={handleSkip}
                  disabled={isLoading}
                >
                  건너뛰기
                </button>
                <button
                  type="button"
                  className="submit-button"
                  onClick={handleSubmit}
                  disabled={isLoading}
                >
                  {isLoading ? "저장 중..." : "완료"}
                </button>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default SignupOttPage;
