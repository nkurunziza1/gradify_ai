import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/authContexts";
import Loading from "../appUi/components/atoms/loading";

interface ProtectedRouteProps {
  children: React.ReactNode;
  path?: string;
}

const ProtectedRoute = ({ children, path }: ProtectedRouteProps) => {
  const { isAuthenticated, userData, loading } = useAuth();
  const location = useLocation();
  if (loading) {
    return <Loading />;
  }
  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }
  if (path === "/portal" && location.pathname === "/portal") {
    return <>{children}</>;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
