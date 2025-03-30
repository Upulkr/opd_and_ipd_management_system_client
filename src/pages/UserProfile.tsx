// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.

import { useUserProfileData } from "@/stores/useUserProfileData";
import React from "react";

const UserProfile: React.FC = () => {
  const user = useUserProfileData((state) => state.user);

  if (!user) {
    return (
      <div className="w-full bg-gray-50 flex items-center justify-center p-4">
        <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-white">NA</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  User Not Found
                </h1>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  const { username, email, role, id } = user;
  //   const copyToClipboard = async () => {
  //     try {
  //       await navigator.clipboard.writeText(userData.token);
  //       setCopied(true);
  //       setTimeout(() => setCopied(false), 2000);
  //     } catch (err) {
  //       console.error("Failed to copy text: ", err);
  //     }
  //   };

  return (
    <div className="w-full bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-white">
                {username.substring(0, 2).toUpperCase()}
              </span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{username}</h1>
              <p className="text-gray-600">{email}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full font-medium">
              {role}
            </span>
            <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full font-medium">
              ID: {id}
            </span>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gray-50 rounded-lg p-6">
            {/* <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Authentication Token
              </h2>
              <button
                onClick={() => setShowToken(!showToken)}
                className="!rounded-button text-sm px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded cursor-pointer whitespace-nowrap"
              >
                {showToken ? "Hide Token" : "Show Token"}
              </button>
            </div> */}
            {/* {showToken && (
              <div className="relative">
                <div className="bg-gray-100 p-4 rounded-lg break-all font-mono text-sm">
                  {userData.token}
                </div>
                <button
                  onClick={copyToClipboard}
                  className="!rounded-button absolute right-2 top-2 p-2 bg-white hover:bg-gray-50 rounded cursor-pointer whitespace-nowrap"
                >
                  <i
                    className={`fas ${
                      copied
                        ? "fa-check text-green-500"
                        : "fa-copy text-gray-500"
                    }`}
                  ></i>
                </button>
              </div>
            )} */}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Account Details
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-600">Username</label>
                  <p className="font-medium">{username}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Email</label>
                  <p className="font-medium">{email}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Role</label>
                  <p className="font-medium">{role}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Security Settings
              </h2>
              <div className="space-y-4">
                <button className="!rounded-button w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded cursor-pointer whitespace-nowrap">
                  Change Password
                </button>
                <button className="!rounded-button w-full py-2 bg-red-600 hover:bg-red-700 text-white rounded cursor-pointer whitespace-nowrap">
                  Enable Two-Factor Auth
                </button>
              </div>
            </div>
          </div>

          {/* <div className="bg-gray-50 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Recent Activity
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <i className="fas fa-sign-in-alt text-green-500"></i>
                  <span>Last login</span>
                </div>
                <span className="text-gray-600">March 30, 2025 09:45 AM</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <i className="fas fa-key text-yellow-500"></i>
                  <span>Password changed</span>
                </div>
                <span className="text-gray-600">March 25, 2025 02:30 PM</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center space-x-3">
                  <i className="fas fa-shield-alt text-blue-500"></i>
                  <span>Security check completed</span>
                </div>
                <span className="text-gray-600">March 20, 2025 11:15 AM</span>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
