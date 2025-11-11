import apiClient from "./client";

export interface Content {
  id: number;
  title: string;
  image: string;
  platform: string;
  description: string;
  releaseDate: string;
  rank?: number;
  endDate?: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

// 현재 인기작 조회
export const getPopularContents = async (): Promise<Content[]> => {
  try {
    const response = await apiClient.get<Content[]>("/contents/popular");
    return response.data;
  } catch (error) {
    console.error("인기 콘텐츠 조회 실패:", error);
    throw error;
  }
};

// 공개 예정 콘텐츠 조회
export const getUpcomingContents = async (): Promise<Content[]> => {
  try {
    const response = await apiClient.get<Content[]>("/contents/upcoming");
    return response.data;
  } catch (error) {
    console.error("공개 예정 콘텐츠 조회 실패:", error);
    throw error;
  }
};

// 종료 예정 콘텐츠 조회
export const getEndingContents = async (): Promise<Content[]> => {
  try {
    const response = await apiClient.get<Content[]>("/contents/ending");
    return response.data;
  } catch (error) {
    console.error("종료 예정 콘텐츠 조회 실패:", error);
    throw error;
  }
};

// 모든 콘텐츠 조회 (탭별)
export const getAllContents = async (): Promise<{
  popular: Content[];
  upcoming: Content[];
  ending: Content[];
}> => {
  try {
    const [popular, upcoming, ending] = await Promise.all([
      getPopularContents(),
      getUpcomingContents(),
      getEndingContents(),
    ]);
    return { popular, upcoming, ending };
  } catch (error) {
    console.error("콘텐츠 조회 실패:", error);
    throw error;
  }
};

// Netflix 공개 예정 콘텐츠 조회
export const getNetflixUpcoming = async (): Promise<Content[]> => {
  try {
    const response = await apiClient.get<Content[]>(
      "/contents/netflix/upcoming"
    );
    return response.data;
  } catch (error) {
    console.error("Netflix 콘텐츠 조회 실패:", error);
    throw error;
  }
};

// Wavve 공개 예정 콘텐츠 조회
export const getWavveUpcoming = async (): Promise<Content[]> => {
  try {
    const response = await apiClient.get<Content[]>("/contents/wavve/upcoming");
    return response.data;
  } catch (error) {
    console.error("Wavve 콘텐츠 조회 실패:", error);
    throw error;
  }
};

// 콘텐츠 검색
export const searchContents = async (query: string): Promise<Content[]> => {
  try {
    const response = await apiClient.get<Content[]>("/contents/search", {
      params: { q: query },
    });
    return response.data;
  } catch (error) {
    console.error("콘텐츠 검색 실패:", error);
    throw error;
  }
};
