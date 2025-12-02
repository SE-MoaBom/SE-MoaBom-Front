import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { getOTTList, type OTT } from "../api/ottService";
import {
  getSubscriptions,
  createSubscription,
  updateSubscription,
  deleteSubscription,
  type Subscription,
} from "../api/subscriptionService";
import "../styles/subscribePage.css";
import BottomNavigation from "../components/BottomNavigation";

interface NewSubscription {
  ottID: number;
  startDate: string;
  endDate: string;
}

const SubscribePage: React.FC = () => {
  const navigate = useNavigate();
  const [ottList, setOttList] = useState<OTT[]>([]);
  const [mySubscriptions, setMySubscriptions] = useState<Subscription[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSubscription, setNewSubscription] = useState<NewSubscription>({
    ottID: 0,
    startDate: new Date().toISOString().split("T")[0],
    endDate: "",
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState<{
    startDate: string;
    endDate: string;
  }>({
    startDate: "",
    endDate: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // 내 구독 정보 불러오기
  useEffect(() => {
    fetchOttList();
    fetchMySubscriptions();
  }, []);

  const fetchOttList = async () => {
    try {
      const data = await getOTTList();
      setOttList(data);
    } catch (err) {
      console.error("OTT 목록을 불러오는데 실패했습니다.", err);
    }
  };

  const fetchMySubscriptions = async () => {
    try {
      const data = await getSubscriptions();
      setMySubscriptions(data);
    } catch (err: any) {
      if (err.response?.status === 401) {
        // 로그인 필요
        navigate("/login");
      } else {
        console.error("구독 정보를 불러오는데 실패했습니다.", err);
      }
    }
  };

  // 구독 추가
  const handleAddSubscription = async () => {
    if (newSubscription.ottID === 0) {
      setError("OTT를 선택해주세요.");
      return;
    }
    if (!newSubscription.startDate) {
      setError("구독 시작일을 입력해주세요.");
      return;
    }

    // 생각해보니 OTT 중복 구독 가능성...있을지도
    // // 이미 구독 중인 OTT인지 확인
    // const alreadySubscribed = mySubscriptions.find(
    //   (sub) => sub.ottID === newSubscription.ottID
    // );
    // if (alreadySubscribed) {
    //   setError("이미 구독 중인 OTT입니다.");
    //   return;
    // }

    setIsLoading(true);
    setError("");

    try {
      await createSubscription({
        ottId: newSubscription.ottID,
        startDate: newSubscription.startDate,
        endDate: newSubscription.endDate || null,
      });

      // 목록 새로고침
      await fetchMySubscriptions();

      // 모달 닫기 및 초기화
      setShowAddModal(false);
      setNewSubscription({
        ottID: 0,
        startDate: new Date().toISOString().split("T")[0],
        endDate: "",
      });
    } catch (err: any) {
      setError("구독 추가 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  // 구독 수정
  const handleEditSubscription = async (subscribeID: number) => {
    if (!editData.startDate) {
      setError("구독 시작일을 입력해주세요.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await updateSubscription(subscribeID, {
        startDate: editData.startDate,
        endDate: editData.endDate || null,
      });

      await fetchMySubscriptions();
      setEditingId(null);
    } catch (err: any) {
      setError("구독 수정 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  // 구독 삭제
  const handleDeleteSubscription = async (subscribeID: number) => {
    if (!confirm("정말 삭제하시겠습니까?")) {
      return;
    }

    setIsLoading(true);

    try {
      await deleteSubscription(subscribeID);
      await fetchMySubscriptions();
    } catch (err: any) {
      setError("구독 삭제 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  // 수정 모드 시작
  const startEditing = (subscription: Subscription) => {
    setEditingId(subscription.subscribeId);
    setEditData({
      startDate: subscription.startDate,
      endDate: subscription.endDate || "",
    });
  };

  // 총 월 구독료 계산
  const totalMonthlyPrice = mySubscriptions.reduce((sum, sub) => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth(); // 0-11

    // 이번 달 첫날과 마지막날
    const monthStart = new Date(currentYear, currentMonth, 1);
    const monthEnd = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59);

    // 구독 날짜 파싱
    const startDate = new Date(sub.startDate);
    const endDate = sub.endDate ? new Date(sub.endDate) : null;

    // 구독이 이번 달에 활성화되어 있는지 확인
    const isActiveThisMonth =
      startDate <= monthEnd && // 시작일이 이번 달 이전 또는 이번 달
      (!endDate || endDate >= monthStart); // 종료일이 없거나 이번 달 이후

    if (isActiveThisMonth) {
      const ott = ottList.find((o) => o.ottId === sub.ottId);
      return sum + (ott?.price || 0);
    }

    return sum;
  }, 0);

  return (
    <div className="subscribe-page">
      <Header />
      <main className="subscribe-container">
        <div className="subscribe-header">
          <h1 className="subscribe-title">나의 구독</h1>
          <button className="add-button" onClick={() => setShowAddModal(true)}>
            + 구독 추가
          </button>
        </div>

        {/* 구독 요약 */}
        <div className="subscribe-summary">
          <div className="summary-item">
            <span className="summary-label">구독 중인 OTT</span>
            <span className="summary-value">{mySubscriptions.length}개</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">월 총 구독료</span>
            <span className="summary-value">
              {totalMonthlyPrice.toLocaleString()}원
            </span>
          </div>
        </div>

        {/* 구독 목록 */}
        {mySubscriptions.length === 0 ? (
          <div className="empty-state">
            <p>구독 중인 OTT가 없습니다.</p>
            <p>구독을 추가해보세요!</p>
          </div>
        ) : (
          <div className="subscription-list">
            {mySubscriptions.map((subscription) => {
              const ottInfo = ottList.find(
                (o) => o.ottId === subscription.ottId
              );
              const isEditing = editingId === subscription.subscribeId;

              return (
                <div
                  key={subscription.subscribeId}
                  className="subscription-card"
                >
                  <div className="subscription-info">
                    <h3 className="ott-name">{subscription.ottName}</h3>
                    <p className="ott-price">
                      월 {ottInfo?.price.toLocaleString()}원
                    </p>
                  </div>

                  {isEditing ? (
                    <div className="edit-form">
                      <div className="date-inputs">
                        <div className="date-input-group">
                          <label>시작일</label>
                          <input
                            type="date"
                            value={editData.startDate}
                            onChange={(e) =>
                              setEditData({
                                ...editData,
                                startDate: e.target.value,
                              })
                            }
                            className="date-input"
                          />
                        </div>
                        <div className="date-input-group">
                          <label>종료일</label>
                          <input
                            type="date"
                            value={editData.endDate}
                            onChange={(e) =>
                              setEditData({
                                ...editData,
                                endDate: e.target.value,
                              })
                            }
                            className="date-input"
                            min={editData.startDate}
                          />
                        </div>
                      </div>
                      <div className="edit-actions">
                        <button
                          className="save-btn"
                          onClick={() =>
                            handleEditSubscription(subscription.subscribeId)
                          }
                          disabled={isLoading}
                        >
                          저장
                        </button>
                        <button
                          className="cancel-btn"
                          onClick={() => setEditingId(null)}
                        >
                          취소
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="subscription-dates">
                        <span>시작: {subscription.startDate}</span>
                        {subscription.endDate && (
                          <span>종료: {subscription.endDate}</span>
                        )}
                      </div>
                      <div className="subscription-actions">
                        <button
                          className="edit-btn"
                          onClick={() => startEditing(subscription)}
                        >
                          수정
                        </button>
                        <button
                          className="delete-btn"
                          onClick={() =>
                            handleDeleteSubscription(subscription.subscribeId)
                          }
                          disabled={isLoading}
                        >
                          삭제
                        </button>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {error && <p className="error-message">{error}</p>}

        {/* 구독 추가 모달 */}
        {showAddModal && (
          <div
            className="subscribe-modal-overlay"
            onClick={() => setShowAddModal(false)}
          >
            <div
              className="subscribe-modal-content"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="subscribe-modal-title">구독 추가</h2>

              <div className="subscribe-modal-form">
                <div className="form-group">
                  <label>OTT 선택</label>
                  <select
                    value={newSubscription.ottID}
                    onChange={(e) =>
                      setNewSubscription({
                        ...newSubscription,
                        ottID: Number(e.target.value),
                      })
                    }
                    className="select-input"
                  >
                    <option value={0}>선택하세요</option>
                    {ottList.map((ott) => (
                      <option key={ott.ottId} value={ott.ottId}>
                        {ott.name} (월 {ott.price.toLocaleString()}원)
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>구독 시작일</label>
                  <input
                    type="date"
                    value={newSubscription.startDate}
                    onChange={(e) =>
                      setNewSubscription({
                        ...newSubscription,
                        startDate: e.target.value,
                      })
                    }
                    className="date-input"
                  />
                </div>

                <div className="form-group">
                  <label>구독 종료일 (선택)</label>
                  <input
                    type="date"
                    value={newSubscription.endDate}
                    onChange={(e) =>
                      setNewSubscription({
                        ...newSubscription,
                        endDate: e.target.value,
                      })
                    }
                    className="date-input"
                    min={newSubscription.startDate}
                  />
                </div>

                {error && <p className="error-message">{error}</p>}

                <div className="modal-actions">
                  <button
                    className="cancel-button"
                    onClick={() => {
                      setShowAddModal(false);
                      setError("");
                    }}
                  >
                    취소
                  </button>
                  <button
                    className="confirm-button"
                    onClick={handleAddSubscription}
                    disabled={isLoading}
                  >
                    {isLoading ? "추가 중..." : "추가"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      <BottomNavigation />
    </div>
  );
};

export default SubscribePage;
