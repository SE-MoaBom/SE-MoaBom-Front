import apiClient from "./client";
import { getProgramDetail } from "./programService";

// 찜 목록 아이템 타입
export interface WishlistItem {
  wishlistId: number;
  programId: number;
  title: string;
  thumbnailUrl: string;
  ottList?: string[]; // OTT 이름 목록
}

// 찜하기 요청 타입
export interface AddToWishlistRequest {
  programId: number;
}

// --- 수정된 부분: OTT 이름을 한글로 변경 (MainPage.tsx 기준) ---
const getOttName = (ottId: number): string => {
  const ottNames: { [key: number]: string } = {
    1: "넷플릭스",
    2: "티빙",
    3: "쿠팡플레이",
    4: "웨이브",
    5: "디즈니+",
    6: "왓챠",
    7: "라프텔",
    8: "U+모바일tv",
    9: "아마존 프라임",
    10: "시네폭스",
  };
  return ottNames[ottId] || "기타";
};
// -----------------------------------------------------------

/**
 * 찜 목록 조회 (상세 정보 병합 포함)
 * GET /wishlists
 */
export const getWishlist = async (): Promise<WishlistItem[]> => {
  const response = await apiClient.get<WishlistItem[]>("/wishlists");
  const items = response.data;

  // 백엔드에서 OTT 정보를 주지 않을 경우를 대비해,
  // 각 프로그램의 상세 정보를 조회하여 OTT 정보를 채워넣습니다.
  const itemsWithOtt = await Promise.all(
    items.map(async (item) => {
      try {
        const detail = await getProgramDetail(item.programId);
        // availability 배열에서 ottId를 추출하여 이름으로 변환 및 중복 제거
        const otts = Array.from(
          new Set(detail.availability.map((avail) => getOttName(avail.ottId)))
        );
        return { ...item, ottList: otts };
      } catch (e) {
        console.error(`프로그램 ${item.programId} 상세 조회 실패`, e);
        return { ...item, ottList: [] };
      }
    })
  );

  return itemsWithOtt;
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
