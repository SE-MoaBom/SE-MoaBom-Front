import { createContext, useState, useContext } from "react";
import type { ReactNode } from "react";
// MainPage에서 사용하는 Content 타입을 그대로 가져오기
import { type Content } from "../api/contentService";

// Context에 담길 데이터와 함수의 타입 정의
interface WishlistContextType {
  wishlist: Content[]; // 찜한 목록 배열
  addToWishlist: (content: Content) => void; // 목록에 추가하는 함수
  removeFromWishlist: (contentId: number) => void; // 목록에서 삭제하는 함수
}

// Context 생성. 처음에는 아무 값도 없음
const WishlistContext = createContext<WishlistContextType | undefined>(
  undefined
);

// 다른 컴포넌트들이 이 Context를 쉽게 사용할 수 있도록 도와주는 커스텀 훅
export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error(
      "useWishlist는 반드시 WishlistProvider 안에서 사용해야 합니다."
    );
  }
  return context;
};

// 앱 전체에 찜 목록 데이터를 제공할 Provider 컴포넌트
export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  // useState를 이용해 실제 찜 목록 데이터를 저장하고 관리
  const [wishlist, setWishlist] = useState<Content[]>([]);

  // 찜 목록에 아이템을 추가하는 함수
  const addToWishlist = (contentToAdd: Content) => {
    // 이미 목록에 있는지 확인해서 중복 추가를 방지
    if (!wishlist.some((item) => item.id === contentToAdd.id)) {
      setWishlist((prevWishlist) => [...prevWishlist, contentToAdd]);
      alert(`'${contentToAdd.title}'이(가) 보고싶은 목록에 추가되었습니다.`);
    } else {
      alert(`'${contentToAdd.title}'은(는) 이미 목록에 있습니다.`);
    }
  };

  // 찜 목록에서 아이템을 삭제하는 함수
  const removeFromWishlist = (contentId: number) => {
    setWishlist((prevWishlist) =>
      prevWishlist.filter((item) => item.id !== contentId)
    );
  };

  // Provider는 value를 통해 찜 목록 데이터와 함수들을 하위 컴포넌트에게 전달
  const value = { wishlist, addToWishlist, removeFromWishlist };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};
