import UnauthorizedPage from "@/pages/UnauthorizedPage";
import { useAuthStore } from "@/stores/useAuth";
import React from "react";
import { Navigate, Outlet } from "react-router-dom";

interface RoleProtectedRouteProps {
  allowedRoles: string[];
  children?: React.ReactNode; // Adding this to handle children
}

const RoleProtectedRoute: React.FC<RoleProtectedRouteProps> = ({
  allowedRoles,
  children, // Accepting children explicitly
}) => {
  const { token, role } = useAuthStore((state) => state);

  console.log(token, role);

  if ((!token && !role) || role === undefined) {
    // Redirect to login page if no token (not logged in)
    return <Navigate to="/log-in" />;
  }

  if (role && !allowedRoles.includes(role)) {
    return <UnauthorizedPage />;
  }

  // If the role is allowed, render the children or Outlet (if no children)
  return children ? <>{children}</> : <Outlet />;
};

export default RoleProtectedRoute;
