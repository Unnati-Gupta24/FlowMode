import React from "react";
import { Navigate, useLocation, Location } from "react-router-dom";
import { useStore } from "../store/store";

interface AuthGuardProps {
  children: React.ReactNode;
}

interface User {
  id: string;
  email: string;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { user, loading } = useStore();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ff2a6d]"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default AuthGuard;
