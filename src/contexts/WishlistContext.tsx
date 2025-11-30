// src/contexts/WishlistContext.tsx
import { createContext, useState, useContext, useEffect } from "react";
import type { ReactNode } from "react";
import {
  getWishlist,
  addToWishlist as addToWishlistAPI,
  removeFromWishlist as removeFromWishlistAPI,
  type WishlistItem,
} from "../api/wishlistService";
import { useAuth } from "./AuthContext";

const WISHLIST_STORAGE_KEY = "guestWishlist";

interface WishlistContextType {
  wishlist: WishlistItem[];
  addToWishlist: (
    programId: number,
    title: string,
    thumbnailUrl?: string
  ) => Promise<void>;
  removeFromWishlist: (wishlistId: number) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  refreshWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(
  undefined
);

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error(
      "useWishlist는 반드시 WishlistProvider 안에서 사용해야 합니다."
    );
  }
  return context;
};

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isLoggedIn } = useAuth();

  // 로컬 스토리지에서 게스트 위시리스트 불러오기
  const loadGuestWishlist = (): WishlistItem[] => {
    try {
      const stored = localStorage.getItem(WISHLIST_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (err) {
      console.error("게스트 위시리스트 로드 실패:", err);
      return [];
    }
  };

  // 로컬 스토리지에 게스트 위시리스트 저장
  const saveGuestWishlist = (items: WishlistItem[]) => {
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items));
    } catch (err) {
      console.error("게스트 위시리스트 저장 실패:", err);
    }
  };

  // 서버 위시리스트와 게스트 위시리스트 동기화
  const syncWishlist = async () => {
    if (!isLoggedIn) return;

    const guestWishlist = loadGuestWishlist();

    if (guestWishlist.length > 0) {
      setIsLoading(true);
      setError(null);

      try {
        // 게스트 위시리스트의 각 아이템을 서버에 추가
        for (const item of guestWishlist) {
          try {
            await addToWishlistAPI({ programId: item.programId });
          } catch (err) {
            console.error(`프로그램 ${item.title} 동기화 실패:`, err);
          }
        }

        // 동기화 완료 후 로컬 스토리지 정리
        localStorage.removeItem(WISHLIST_STORAGE_KEY);

        // 서버에서 최신 위시리스트 가져오기 (서버 ID 포함)
        const data = await getWishlist();
        setWishlist(data);

        console.log("위시리스트 동기화 완료:", data);
      } catch (err) {
        console.error("위시리스트 동기화 실패:", err);
        setError("위시리스트 동기화에 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    } else {
      // 게스트 위시리스트가 없어도 서버 데이터 로드
      await refreshWishlist();
    }
  };

  // 찜 목록 불러오기
  const refreshWishlist = async () => {
    if (!isLoggedIn) {
      // 비로그인 상태: 로컬 스토리지에서 로드
      setWishlist(loadGuestWishlist());
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

  // 로그인 상태 변경 시 위시리스트 처리
  useEffect(() => {
    if (isLoggedIn) {
      // 로그인: 게스트 위시리스트 동기화 후 서버 데이터 로드
      syncWishlist();
    } else {
      // 로그아웃: 로컬 위시리스트 로드
      refreshWishlist();
    }
  }, [isLoggedIn]);

  // 찜 목록에 아이템 추가
  const addToWishlist = async (
    programId: number,
    title: string,
    thumbnailUrl: string = ""
  ) => {
    // 이미 목록에 있는지 확인
    if (wishlist.some((item) => item.programId === programId)) {
      alert(`'${title}'은(는) 이미 찜 목록에 있습니다.`);
      return;
    }

    if (!isLoggedIn) {
      // 비로그인 상태: 로컬 스토리지에 저장
      const newItem: WishlistItem = {
        wishlistId: Date.now(), // 임시 ID
        programId,
        title,
        thumbnailUrl,
      };

      const updatedWishlist = [...wishlist, newItem];
      setWishlist(updatedWishlist);
      saveGuestWishlist(updatedWishlist);
      alert(`'${title}'이(가) 찜 목록에 추가되었습니다.`);
      return;
    }

    // 로그인 상태: 서버에 저장
    try {
      await addToWishlistAPI({ programId });
      await refreshWishlist();
      alert(`'${title}'이(가) 찜 목록에 추가되었습니다.`);
    } catch (err: any) {
      console.error("찜하기 실패:", err);

      // 401 에러 시 로그인 필요 안내 대신 로컬 저장
      if (err.response?.status === 401) {
        alert(
          "로그인하면 찜 목록이 저장됩니다. 현재는 브라우저에만 저장됩니다."
        );
        const newItem: WishlistItem = {
          wishlistId: Date.now(),
          programId,
          title,
          thumbnailUrl,
        };
        const updatedWishlist = [...wishlist, newItem];
        setWishlist(updatedWishlist);
        saveGuestWishlist(updatedWishlist);
      } else {
        alert("찜하기에 실패했습니다.");
      }
    }
  };

  // 찜 목록에서 아이템 삭제
  const removeFromWishlist = async (wishlistId: number) => {
    if (!isLoggedIn) {
      // 비로그인 상태: 로컬 스토리지에서 삭제
      const updatedWishlist = wishlist.filter(
        (item) => item.wishlistId !== wishlistId
      );
      setWishlist(updatedWishlist);
      saveGuestWishlist(updatedWishlist);
      return;
    }

    // 로그인 상태: 서버에서 삭제
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
