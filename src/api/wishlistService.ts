import apiClient from "./client";

// 찜 목록 아이템 타입
export interface WishlistItem {
  wishlistId: number;
  programId: number;
  title: string;
  thumbnailUrl: string;
}

// 찜하기 요청 타입
export interface AddToWishlistRequest {
  programId: number;
}

/**
 * 찜 목록 조회
 * GET /wishlists
 */
export const getWishlist = async (): Promise<WishlistItem[]> => {
  const response = await apiClient.get<WishlistItem[]>("/wishlists");
  return response.data;
};

/**
 * 찜하기
 * POST /wishlists
 */
export const addToWishlist = async (
  data: AddToWishlistRequest
): Promise<void> => {
  await apiClient.post("/wishlists", data);
};

/**
 * 찜하기 취소
 * DELETE /wishlists/{wishlistId}
 */
export const removeFromWishlist = async (wishlistId: number): Promise<void> => {
  await apiClient.delete(`/wishlists/${wishlistId}`);
};
