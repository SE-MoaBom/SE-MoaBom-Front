// src/contexts/WishlistContext.tsx
import { createContext, useState, useContext, useEffect } from "react";
import type { ReactNode } from "react";
import {
  getWishlist,
  addToWishlist as addToWishlistAPI,
  removeFromWishlist as removeFromWishlistAPI,
  type WishlistItem,
} from "../api/wishlistService";
import { getProgramDetail } from "../api/programService"; // 상세 정보 조회를 위해 추가
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

// OTT ID 매핑 (게스트 모드용)
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

        // 서버에서 최신 위시리스트 가져오기
        const data = await getWishlist(); // getWishlist 내부에서 이미 상세정보(OTT)를 조회함
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

  // 찜 목록 불러오기 (핵심 수정 부분)
  const refreshWishlist = async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (!isLoggedIn) {
        // --- 비로그인 상태 (게스트) ---
        const localItems = loadGuestWishlist();

        // 로컬 아이템들에 대해 상세 정보를 조회해서 OTT 정보를 채워넣음
        const enrichedItems = await Promise.all(
          localItems.map(async (item) => {
            try {
              // 이미 OTT 정보가 있다면 건너뜀 (최적화)
              if (item.ottList && item.ottList.length > 0) return item;

              const detail = await getProgramDetail(item.programId);
              const otts = Array.from(
                new Set(
                  detail.availability.map((avail) => getOttName(avail.ottId))
                )
              );
              return { ...item, ottList: otts };
            } catch (e) {
              console.error(
                `게스트 아이템 ${item.programId} 상세 조회 실패`,
                e
              );
              return item; // 실패 시 기본 정보만 반환
            }
          })
        );

        setWishlist(enrichedItems);
      } else {
        // --- 로그인 상태 ---
        const data = await getWishlist();
        setWishlist(data);
      }
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
      // 로그아웃: 로컬 위시리스트 로드 (+상세 정보 조회)
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
        ottList: [], // 초기엔 비어있음
      };

      const updatedWishlist = [...wishlist, newItem];
      setWishlist(updatedWishlist);
      saveGuestWishlist(updatedWishlist);

      alert(`'${title}'이(가) 찜 목록에 추가되었습니다.`);

      // 추가 후 상세 정보(OTT)를 가져오기 위해 갱신
      refreshWishlist();
      return;
    }

    // 로그인 상태: 서버에 저장
    try {
      await addToWishlistAPI({ programId });
      await refreshWishlist();
      alert(`'${title}'이(가) 찜 목록에 추가되었습니다.`);
    } catch (err: any) {
      console.error("찜하기 실패:", err);

      // 401 에러 시 로컬 저장 처리
      if (err.response?.status === 401) {
        alert("로그인 세션이 만료되었습니다. 브라우저에 임시 저장됩니다.");
        const newItem: WishlistItem = {
          wishlistId: Date.now(),
          programId,
          title,
          thumbnailUrl,
        };
        const updatedWishlist = [...wishlist, newItem];
        setWishlist(updatedWishlist);
        saveGuestWishlist(updatedWishlist);
        refreshWishlist(); // 상세 정보 갱신
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
