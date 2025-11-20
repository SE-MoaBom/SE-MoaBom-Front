import { createContext, useState, useContext, useEffect } from "react";
import type { ReactNode } from "react";
import {
  getWishlist,
  addToWishlist as addToWishlistAPI,
  removeFromWishlist as removeFromWishlistAPI,
  type WishlistItem,
} from "../api/wishlistService";
import { useAuth } from "./AuthContext";

// Context에 담길 데이터와 함수의 타입 정의
interface WishlistContextType {
  wishlist: WishlistItem[];
  addToWishlist: (programId: number, title: string) => Promise<void>;
  removeFromWishlist: (wishlistId: number) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  refreshWishlist: () => Promise<void>;
}

// Context 생성
const WishlistContext = createContext<WishlistContextType | undefined>(
  undefined
);

// 커스텀 훅
export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error(
      "useWishlist는 반드시 WishlistProvider 안에서 사용해야 합니다."
    );
  }
  return context;
};

// Provider 컴포넌트
export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isLoggedIn } = useAuth();

  // 찜 목록 불러오기
  const refreshWishlist = async () => {
    if (!isLoggedIn) {
      setWishlist([]);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const data = await getWishlist();
      setWishlist(data);
    } catch (err) {
      console.error("찜 목록 조회 실패:", err);
      setError("찜 목록을 불러오는데 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  // 로그인 상태 변경 시 찜 목록 새로고침
  useEffect(() => {
    refreshWishlist();
  }, [isLoggedIn]);

  // 찜 목록에 아이템 추가
  const addToWishlist = async (programId: number, title: string) => {
    if (!isLoggedIn) {
      alert("로그인이 필요합니다.");
      return;
    }

    // 이미 목록에 있는지 확인
    if (wishlist.some((item) => item.programId === programId)) {
      alert(`'${title}'은(는) 이미 찜 목록에 있습니다.`);
      return;
    }

    try {
      await addToWishlistAPI({ programId });
      await refreshWishlist();
      alert(`'${title}'이(가) 찜 목록에 추가되었습니다.`);
    } catch (err) {
      console.error("찜하기 실패:", err);
      alert("찜하기에 실패했습니다.");
    }
  };

  // 찜 목록에서 아이템 삭제
  const removeFromWishlist = async (wishlistId: number) => {
    try {
      await removeFromWishlistAPI(wishlistId);
      setWishlist((prev) =>
        prev.filter((item) => item.wishlistId !== wishlistId)
      );
    } catch (err) {
      console.error("찜 취소 실패:", err);
      alert("찜 취소에 실패했습니다.");
    }
  };

  const value = {
    wishlist,
    addToWishlist,
    removeFromWishlist,
    isLoading,
    error,
    refreshWishlist,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};
