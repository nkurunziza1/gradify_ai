import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/authContexts";

const restrictedRoutes = ["/", "/login"];

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (isAuthenticated && restrictedRoutes.includes(location.pathname)) {
    return <Navigate to="/portal" replace />;
  }

  return <>{children}</>;
};

export default PublicRoute;
