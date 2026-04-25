import * as React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useCheckAuth } from "@/hooks/use-check-auth";
import { getLandingPage } from "@/lib/auth-utils";

type ProtectedRouteProps = {
  allowedRoles?: string[];
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const location = useLocation();
  const { checkAuth, isLoading, isAuthenticated } = useCheckAuth();

  React.useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isLoading || isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm text-slate-500">
        Checking session...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const userRole = localStorage.getItem("userRole");
    if (!userRole || !allowedRoles.includes(userRole)) {
      return <Navigate to={getLandingPage(userRole)} replace />;
    }
  }

  return <Outlet />;
};

export default ProtectedRoute;
