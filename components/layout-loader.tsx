"use client";
import React from "react";
import { Loader2 } from "lucide-react";
import SidebarLogo from "./partials/sidebar/common/logo";

const LayoutLoader = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-[#4844af] via-[#36338a] to-[#25235F] dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 z-50">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute -top-40 -right-40 w-80 h-80 rounded-full opacity-50 animate-pulse"
          style={{ backgroundColor: "#ED4135", opacity: "0.1" }}
        ></div>
        <div
          className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full opacity-30 animate-pulse delay-1000"
          style={{ backgroundColor: "#25235F", opacity: "0.15" }}
        ></div>
      </div>

      {/* Main loader content */}
      <div className="relative flex flex-col items-center space-y-8 p-8">
        {/* Logo container with glow effect */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full opacity-20 group-hover:opacity-30 blur-xl transition-opacity duration-1000 animate-pulse"></div>
          <div className="relative w-20 h-20 bg-[#0600c2] dark:bg-gray-800 rounded-2xl shadow-2xl flex items-center justify-center transform hover:scale-105 transition-transform duration-300">
            <SidebarLogo className="w-12 h-12 filter drop-shadow-lg" />
          </div>
        </div>

        {/* Enhanced loading section */}
        <div className="flex flex-col items-center space-y-4">
          {/* Spinner with enhanced styling */}
          <div className="relative">
            <div
              className="absolute inset-0 rounded-full opacity-20 blur-md animate-pulse"
              style={{ background: "linear-gradient(45deg, #ED4135, #25235F)" }}
            ></div>
            <Loader2
              className="relative h-8 w-8 animate-spin filter drop-shadow-sm"
              style={{ color: "#ED4135" }}
            />
          </div>

          {/* Loading text with animation */}
          <div className="text-center">
            <span className="text-xl font-semibold bg-gradient-to-r from-gray-200 to-gray-400 dark:from-gray-200 dark:to-gray-400 bg-clip-text text-transparent">
              Loading...
            </span>

            {/* Progress dots animation */}
            <div className="flex justify-center space-x-1 mt-3">
              <div
                className="w-2 h-2 rounded-full animate-bounce"
                style={{ backgroundColor: "#ED4135" }}
              ></div>
              <div
                className="w-2 h-2 rounded-full animate-bounce delay-100"
                style={{ backgroundColor: "#25235F" }}
              ></div>
              <div
                className="w-2 h-2 rounded-full animate-bounce delay-200"
                style={{ backgroundColor: "#ED4135" }}
              ></div>
            </div>
          </div>
        </div>

        {/* Subtle loading bar */}
        <div className="w-64 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default LayoutLoader;
