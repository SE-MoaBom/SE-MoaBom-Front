import React, { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { getMe, type User } from "../api/authService";

interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  login: (token: string) => Promise<void>; // 토큰을 받도록 변경
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 앱 시작 시 토큰 확인
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const userData = await getMe();
          setIsLoggedIn(true);
          setUser(userData);
        } catch {
          localStorage.removeItem("token");
          setIsLoggedIn(false);
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  // 토큰을 받아서 저장하고 사용자 정보를 가져옴
  const login = async (token: string) => {
    localStorage.setItem("token", token);
    try {
      const userData = await getMe();
      setIsLoggedIn(true);
      setUser(userData);
    } catch {
      localStorage.removeItem("token");
      throw new Error("사용자 정보를 가져오는데 실패했습니다.");
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, user, login, logout, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
