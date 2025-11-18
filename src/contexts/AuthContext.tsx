import React, { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import apiClient from "../api/client";

interface AuthContextType {
  isLoggedIn: boolean;
  user: { name: string; email: string } | null;
  login: (userData: { name: string; email: string }) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string } | null>(
    null
  );

  // 앱 시작 시 토큰 확인
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // 토큰이 있으면 사용자 정보 가져오기
      apiClient
        .get("/users/me")
        .then((response) => {
          setIsLoggedIn(true);
          setUser({
            name: response.data.email.split("@")[0],
            email: response.data.email,
          });
        })
        .catch(() => {
          localStorage.removeItem("token");
        });
    }
  }, []);

  const login = (userData: { name: string; email: string }) => {
    setIsLoggedIn(true);
    setUser(userData);
    // TODO: 실제로는 토큰을 localStorage에 저장
    localStorage.setItem("token", "your-jwt-token");
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
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
