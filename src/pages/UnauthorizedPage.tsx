// UnauthorizedPage.tsx
import React from "react";
import { Link } from "react-router-dom";

/**
 * UnauthorizedPage
 *
 * This page is displayed when a user attempts to access a protected route
 * without the necessary permissions (e.g., role-based access control).
 */
const UnauthorizedPage: React.FC = () => {
  return (
    <div className=" w-full flex items-center justify-center h-screen bg-gray-100">
      <div className="text-center p-6 bg-white shadow-lg rounded-lg">
        <h1 className="text-3xl font-bold text-red-600">Access Denied</h1>
        <p className="mt-2 text-lg text-gray-600">
          You do not have permission to view this page.
        </p>
        <div className="mt-4">
          <Link to="/" className="text-blue-500 hover:underline">
            Go back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
