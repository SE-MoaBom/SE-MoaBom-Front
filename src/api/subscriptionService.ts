import apiClient from "./client";

// 구독 정보 타입
export interface Subscription {
  subscribeId: number;
  ottId: number;
  ottName: string;
  logoUrl: string;
  startDate: string;
  endDate: string | null;
}

// 구독 등록 요청 타입
export interface CreateSubscriptionRequest {
  ottId: number;
  startDate: string;
  endDate: string | null;
}

// 구독 수정 요청 타입
export interface UpdateSubscriptionRequest {
  startDate: string;
  endDate: string | null;
}

/**
 * 구독 정보 조회
 * GET /subscriptions
 */
export const getSubscriptions = async (): Promise<Subscription[]> => {
  const response = await apiClient.get<Subscription[]>("/subscriptions");
  return response.data;
};

/**
 * 구독 정보 등록
 * POST /subscriptions
 */
export const createSubscription = async (
  data: CreateSubscriptionRequest
): Promise<void> => {
  await apiClient.post("/subscriptions", data);
};

/**
 * 구독 정보 수정
 * PATCH /subscriptions/{subscribeId}
 */
export const updateSubscription = async (
  subscribeId: number,
  data: UpdateSubscriptionRequest
): Promise<void> => {
  await apiClient.patch(`/subscriptions/${subscribeId}`, data);
};

/**
 * 구독 정보 삭제
 * DELETE /subscriptions/{subscribeId}
 */
export const deleteSubscription = async (
  subscribeId: number
): Promise<void> => {
  await apiClient.delete(`/subscriptions/${subscribeId}`);
};
