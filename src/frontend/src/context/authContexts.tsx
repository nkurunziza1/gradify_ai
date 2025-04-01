import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

interface UserData {
  token: string;
  number: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  userData: UserData | null;
  login: (token: string, number: string) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const getStoredUserData = (): UserData | null => {
  const storedData = sessionStorage.getItem("userData");
  if (!storedData) return null;
  
  try {
    return JSON.parse(storedData);
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    checkAuth();
  }, []);
  
  const checkAuth = () => {
    const data = getStoredUserData();
    if (data) {
      setUserData(data);
      setIsAuthenticated(true);
    }
    setLoading(false);
  };
  
  const login = (token: string, number: string) => {
    const userData = { token, number };
    sessionStorage.setItem("userData", JSON.stringify(userData));
    setUserData(userData);
    setIsAuthenticated(true);
    toast.success("Logged in successfully");
    navigate("/portal");
  };
  
  const logout = async () => {
    sessionStorage.removeItem("userData");
    setUserData(null);
    setIsAuthenticated(false);
    toast.success("Logged out successfully");
    navigate("/");
  };
  
  const value = {
    isAuthenticated,
    userData,
    login,
    logout,
    loading,
  };
  
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};