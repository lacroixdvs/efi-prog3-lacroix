"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { getCookie, saveAuthCookies, clearAuthCookies } from "@/lib/api";

interface AuthContextType {
  user: string | null;
  isAdmin: boolean;
  loginUser: (username: string, token: string, admin: boolean, refresh?: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    const syncAuth = () => {
      const storedUser = getCookie("user");
      const storedAdmin = getCookie("is_admin") === "true";
      setUser(storedUser && storedUser !== "null" ? storedUser : null);
      setIsAdmin(storedAdmin);
    };

    syncAuth();
    window.addEventListener("authChange", syncAuth);
    return () => window.removeEventListener("authChange", syncAuth);
  }, []);

  const loginUser = (username: string, token: string, admin: boolean, refresh = "") => {
    saveAuthCookies(token, refresh, username, admin);
    setUser(username);
    setIsAdmin(admin);
  };

  const logout = () => {
    clearAuthCookies();
    setUser(null);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, loginUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
};