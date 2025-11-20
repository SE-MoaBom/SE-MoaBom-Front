import apiClient from "./client";

// 사용자 정보 타입
export interface User {
  userId: number;
  email: string;
}

// 회원가입 요청 타입
export interface SignupRequest {
  email: string;
  password: string;
}

// 로그인 요청 타입
export interface LoginRequest {
  email: string;
  password: string;
}

// 로그인 응답 타입
export interface LoginResponse {
  token: string;
}

// 에러 응답 타입
export interface ErrorResponse {
  error: string;
  message?: string;
}

/**
 * 회원가입
 * POST /auth/signup
 */
export const signup = async (data: SignupRequest): Promise<void> => {
  await apiClient.post("/auth/signup", data);
};

/**
 * 로그인
 * POST /auth/login
 */
export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await apiClient.post<LoginResponse>("/auth/login", data);
  return response.data;
};

/**
 * 내 정보 조회
 * GET /users/me
 */
export const getMe = async (): Promise<User> => {
  const response = await apiClient.get<User>("/users/me");
  return response.data;
};
