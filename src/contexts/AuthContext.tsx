import React, { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

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
