import apiClient from "./client";
// programService에서 Program 타입을 가져옵니다.
import { type Program } from "./programService";

// 나머지 타입들은 여기에 정의합니다.
export interface PlanAction {
  ottName: string;
  dateRange: {
    start: string;
    end: string;
  };
  programs: Program[];
}

export interface ScheduleResponse {
  totalCostSavings: number;
  actions: PlanAction[];
}

/**
 * 구독 일정 추천 조회
 * GET /recommendations/schedule
 */
export const getRecommendedSchedule = async (): Promise<ScheduleResponse> => {
  const response = await apiClient.get<ScheduleResponse>(
    "/recommendations/schedule"
  );
  return response.data;
};
