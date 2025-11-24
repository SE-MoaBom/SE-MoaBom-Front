import apiClient from "./client";

// 프로그램 상태 타입
export type ProgramStatus = "UPCOMING" | "EXPIRING" | null;

// 프로그램 정렬 타입
export type ProgramSort = "ID" | "RANKING";

// 프로그램 상태 필터 타입
export type ProgramStatusFilter = "ALL" | "UPCOMING" | "EXPIRING";

// OTT 제공 정보 타입
export interface ProgramAvailability {
  ottId: number;
  logoUrl: string;
  releaseDate: string | null;
  expireDate: string | null;
}

// 프로그램 목록 아이템 타입
export interface Program {
  availability: any;
  programId: number;
  title: string;
  description: string;
  thumbnailUrl: string;
  backdropUrl: string;
  genre: string;
  runningTime: number | null;
  ranking: number | null;
  status: ProgramStatus;
  wishlistId: number | null;
}

// 프로그램 상세 타입
export interface ProgramDetail extends Program {
  availability: ProgramAvailability[];
}

// 프로그램 검색 결과 타입
export interface ProgramSearchResult {
  page: number;
  size: number;
  totalPages: number;
  results: Program[];
}

// 프로그램 검색 파라미터 타입
export interface ProgramSearchParams {
  keyword?: string;
  status?: ProgramStatusFilter;
  sort?: ProgramSort;
  page?: number;
  size?: number;
}

/**
 * 콘텐츠 검색
 * GET /programs
 */
export const searchPrograms = async (
  params: ProgramSearchParams = {}
): Promise<ProgramSearchResult> => {
  const response = await apiClient.get<ProgramSearchResult>("/programs", {
    params: {
      keyword: params.keyword,
      status: params.status || "ALL",
      sort: params.sort || "ID",
      page: params.page || 1,
      size: params.size || 10,
    },
  });
  return response.data;
};

/**
 * 콘텐츠 상세 조회
 * GET /programs/{programId}
 */
export const getProgramDetail = async (
  programId: number
): Promise<ProgramDetail> => {
  const response = await apiClient.get<ProgramDetail>(`/programs/${programId}`);
  return response.data;
};

/**
 * 인기 콘텐츠 조회 (랭킹순)
 */
export const getPopularPrograms = async (
  size: number = 10
): Promise<Program[]> => {
  const result = await searchPrograms({
    sort: "RANKING",
    size,
  });
  return result.results;
};

/**
 * 공개 예정 콘텐츠 조회
 */
export const getUpcomingPrograms = async (
  size: number = 10
): Promise<Program[]> => {
  const result = await searchPrograms({
    status: "UPCOMING",
    size,
  });
  return result.results;
};

/**
 * 종료 예정 콘텐츠 조회
 */
export const getExpiringPrograms = async (
  size: number = 10
): Promise<Program[]> => {
  const result = await searchPrograms({
    status: "EXPIRING",
    size,
  });
  return result.results;
};
