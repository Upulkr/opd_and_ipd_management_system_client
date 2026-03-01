import UnauthorizedPage from "@/pages/UnauthorizedPage";
import { useAuthStore } from "@/stores/useAuth";
import { isTokenExpired } from "@/utils/token";
import React from "react";
import { Navigate, Outlet } from "react-router-dom";

/**
 * Props for the RoleProtectedRoute component.
 * @property allowedRoles - Array of roles that are permitted to access the route.
 * @property children - Optional child components to render if unauthorized.
 */
interface RoleProtectedRouteProps {
  allowedRoles: string[];
  children?: React.ReactNode; // Adding this to handle children
}

/**
 * A wrapper component that protects routes based on user authentication and roles.
 * It checks if the user is logged in and has the necessary permissions.
 */
const RoleProtectedRoute: React.FC<RoleProtectedRouteProps> = ({
  allowedRoles,
  children, // Accepting children explicitly
}) => {
  // Retrieve token and role from the authentication store
  const { token, role } = useAuthStore((state) => state);

  console.log(token, role);

  /**
   * Check if the user is authenticated.
   * Redirects to the login page if:
   * 1. Both token and role are missing.
   * 2. Role is undefined.
   * 3. The token has expired.
   */
  if ((!token && !role) || role === undefined || isTokenExpired(token)) {
    // Redirect to login page if no token (not logged in) or token is invalid
    return <Navigate to="/log-in" />;
  }

  /**
   * Check if the authenticated user has permission to access the route.
   * If the user's role is not in the allowedRoles list, show the Unauthorized page.
   */
  if (role && !allowedRoles.includes(role)) {
    return <UnauthorizedPage />;
  }

  // If the user is authenticated and authorized, render the protected content.
  // If children are provided, render them; otherwise, render the Outlet for nested routes.
  return children ? <>{children}</> : <Outlet />;
};

export default RoleProtectedRoute;
