import apiClient from "./client";

// OTT 정보 타입
export interface OTT {
  ottId: number;
  name: string;
  price: number;
  logoUrl: string;
}

/**
 * 서비스에서 지원하는 OTT 목록 조회
 * GET /otts
 */
export const getOTTList = async (): Promise<OTT[]> => {
  const response = await apiClient.get<OTT[]>("/otts");
  return response.data;
};
