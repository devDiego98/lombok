// Protected route component for admin access
import React from "react";
import { useAuth } from "../contexts/AuthContext";
import AdminLogin from "./AdminLogin";
import LoadingSpinner from "./LoadingSpinner";
import { ProtectedRouteProps } from "../types";

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { loading, isAuthenticated } = useAuth();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="text-white mt-4">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  // Show login if not authenticated
  if (!isAuthenticated) {
    return <AdminLogin />;
  }

  // Show protected content if authenticated
  return children;
};

export default ProtectedRoute;
