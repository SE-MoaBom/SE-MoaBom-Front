import apiClient from "./client";

// 구독 정보 타입 (백엔드 MydetailSubscribeDto와 일치)
export interface Subscription {
  subscribeId: number;
  ottId: number;
  ottName: string;
  logoUrl: string;
  startDate: string; // LocalDate -> string (YYYY-MM-DD)
  endDate: string | null; // LocalDate -> string (YYYY-MM-DD) or null
}

// 구독 등록 요청 타입 (백엔드 SubScribeRequestDto와 일치)
export interface CreateSubscriptionRequest {
  ottId: number;
  startDate: string; // LocalDate -> string (YYYY-MM-DD)
  endDate: string | null; // LocalDate -> string (YYYY-MM-DD) or null
}

// 구독 수정 요청 타입 (백엔드 UpdateRequestDto와 일치)
export interface UpdateSubscriptionRequest {
  startDate: string; // LocalDate -> string (YYYY-MM-DD)
  endDate: string | null; // LocalDate -> string (YYYY-MM-DD) or null
}

/**
 * 구독 정보 조회
 * GET /subscriptions
 *
 * 백엔드 응답: List<MydetailSubscribeDto>
 * HTTP 상태: 200 OK
 */
export const getSubscriptions = async (): Promise<Subscription[]> => {
  const response = await apiClient.get<Subscription[]>("/subscriptions");
  return response.data;
};

/**
 * 구독 정보 등록
 * POST /subscriptions
 *
 * 백엔드 요청: SubScribeRequestDto
 * HTTP 상태: 201 CREATED
 */
export const createSubscription = async (
  data: CreateSubscriptionRequest
): Promise<void> => {
  await apiClient.post("/subscriptions", data);
};

/**
 * 구독 정보 수정
 * PATCH /subscriptions/{subscribeId}
 *
 * 백엔드 요청: UpdateRequestDto
 * HTTP 상태: 204 NO_CONTENT (성공)
 * HTTP 상태: 404 NOT_FOUND (구독 정보 없음)
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
 *
 * HTTP 상태: 204 NO_CONTENT (성공)
 * HTTP 상태: 404 NOT_FOUND (구독 정보 없음)
 */
export const deleteSubscription = async (
  subscribeId: number
): Promise<void> => {
  await apiClient.delete(`/subscriptions/${subscribeId}`);
};

// 유틸리티 함수: Date 객체를 YYYY-MM-DD 형식 문자열로 변환
export const formatDateToString = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// 유틸리티 함수: YYYY-MM-DD 형식 문자열을 Date 객체로 변환
export const parseStringToDate = (dateString: string): Date => {
  return new Date(dateString);
};
