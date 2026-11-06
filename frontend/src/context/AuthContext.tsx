"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

interface AuthContextType {
  user: string | null;
  isAdmin: boolean;
  loginUser: (username: string, token: string, admin: boolean) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedAdmin = localStorage.getItem("is_admin") === "true";
    if (storedUser) {
      setUser(storedUser);
      setIsAdmin(storedAdmin);
    }
  }, []);

  const loginUser = (username: string, token: string, admin: boolean) => {
    localStorage.setItem("user", username);
    localStorage.setItem("access", token);
    localStorage.setItem("is_admin", String(admin));
    setUser(username);
    setIsAdmin(admin);
  };

  const logout = () => {
    localStorage.clear();
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