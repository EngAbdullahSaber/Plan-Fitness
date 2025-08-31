"use client";
import React from "react";
import { cn } from "@/lib/utils";
import ThemeButton from "./theme-button";
import { useSidebar, useThemeStore } from "@/store";
import ProfileInfo from "./profile-info";
import VerticalHeader from "./vertical-header";
import HorizontalHeader from "./horizontal-header";
import Inbox from "./inbox";
import HorizontalMenu from "./horizontal-menu";
import NotificationMessage from "./notification-message";
import Language from "./language";
import { useMediaQuery } from "@/hooks/use-media-query";
import MobileMenuHandler from "./mobile-menu-handler";
import ClassicHeader from "./layout/classic-header";
import FullScreen from "./full-screen";

const NavTools = ({
  isDesktop,
  isMobile,
  sidebarType,
}: {
  isDesktop: boolean;
  isMobile: boolean;
  sidebarType: string;
}) => {
  return (
    <div className="nav-tools flex items-center gap-2">
      {/* Action buttons with premium styling */}
      <div className="flex items-center gap-1 bg-white/60 dark:bg-gray-800/60   rounded-xl p-1 border border-white/20 dark:border-gray-700/30  ">
        <div className="relative group">
          <div className="p-2 rounded-xl bg-gradient-to-br from-white/80 to-gray-50/80 dark:from-gray-800/80 dark:to-gray-700/80 hover:from-white dark:hover:from-gray-700 transition-all duration-300 shadow-sm hover:shadow-md border border-white/40 dark:border-gray-600/40">
            <ThemeButton />
          </div>
          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-gradient-to-r from-[#ED4135] to-[#25235F] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>

        <div className="relative group">
          <div className="p-2 rounded-xl bg-gradient-to-br from-white/80 to-gray-50/80 dark:from-gray-800/80 dark:to-gray-700/80 hover:from-white dark:hover:from-gray-700 transition-all duration-300 shadow-sm hover:shadow-md border border-white/40 dark:border-gray-600/40">
            <Language />
          </div>
          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-gradient-to-r from-[#ED4135] to-[#25235F] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>

        <div className="relative group">
          <div className="p-2 rounded-xl bg-gradient-to-br from-white/80 to-gray-50/80 dark:from-gray-800/80 dark:to-gray-700/80 hover:from-white dark:hover:from-gray-700 transition-all duration-300 shadow-sm hover:shadow-md border border-white/40 dark:border-gray-600/40">
            <FullScreen />
          </div>
          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-gradient-to-r from-[#ED4135] to-[#25235F] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
      </div>

      {/* Profile section with premium glass morphism */}
      <div className="flex items-center">
        <div className="relative group">
          {/* Animated gradient border */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-[#ED4135] to-[#25235F] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm group-hover:blur-md"></div>

          <div className="relative bg-gradient-to-br from-white/90 via-white/80 to-gray-50/70 dark:from-gray-800/90 dark:via-gray-800/80 dark:to-gray-700/70 rounded-2xl p-1.5 shadow-xl border border-white/30 dark:border-gray-600/30 backdrop-blur-xl group-hover:border-white/50 dark:group-hover:border-gray-500/50 transition-all duration-300">
            <div className="relative">
              <ProfileInfo />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu handler */}
      {!isDesktop && sidebarType !== "module" && (
        <div className="relative group">
          <div className="p-2 rounded-xl bg-gradient-to-br from-white/80 to-gray-50/80 dark:from-gray-800/80 dark:to-gray-700/80 hover:from-white dark:hover:from-gray-700 transition-all duration-300 shadow-sm hover:shadow-md border border-white/40 dark:border-gray-600/40">
            <MobileMenuHandler />
          </div>
          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-gradient-to-r from-[#ED4135] to-[#25235F] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
      )}
    </div>
  );
};

const Header = ({
  handleOpenSearch,
  trans,
}: {
  handleOpenSearch: () => void;
  trans: string;
}) => {
  const { collapsed, sidebarType, setCollapsed, subMenu, setSidebarType } =
    useSidebar();
  const { layout, navbarType, setLayout } = useThemeStore();

  const isDesktop = useMediaQuery("(min-width: 1280px)");
  const isMobile = useMediaQuery("(min-width: 768px)");

  React.useEffect(() => {
    if (!isDesktop && layout === "horizontal") {
      setSidebarType("classic");
    }
  }, [isDesktop]);

  // Enhanced header wrapper styles with glass morphism
  const getHeaderStyles = () => {
    return "relative bg-white/95 dark:bg-gray-900/95 backdrop-blur-2xl border-b border-white/20 dark:border-gray-700/30 shadow-2xl";
  };

  const getContainerStyles = () => {
    return "flex justify-end items-center h-16 transition-all duration-300 ease-in-out";
  };

  // Horizontal layout
  if (layout === "horizontal" && navbarType !== "hidden") {
    return (
      <ClassicHeader
        className={cn("group", {
          "sticky top-0 z-50": navbarType === "sticky",
        })}
      >
        <div className={cn(getHeaderStyles(), "md:px-8 px-4 py-0")}>
          {/* Subtle gradient accent line */}
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#ED4135]/30 via-30% via-[#25235F]/30 to-transparent"></div>

          <div className={getContainerStyles()}>
            <HorizontalHeader handleOpenSearch={handleOpenSearch} />
            <NavTools
              isDesktop={isDesktop}
              isMobile={isMobile}
              sidebarType={sidebarType}
            />
          </div>
        </div>

        {/* Enhanced horizontal menu with glass effect */}
        {isDesktop && (
          <div className="relative bg-white/95 dark:bg-gray-900/95 backdrop-blur-2xl w-full px-8 border-b border-white/20 dark:border-gray-700/30 shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#25235F]/5 to-transparent"></div>
            <div className="relative py-3">
              <HorizontalMenu trans={trans} />
            </div>
          </div>
        )}
      </ClassicHeader>
    );
  }

  // Semibox layout
  if (layout === "semibox" && navbarType !== "hidden") {
    return (
      <ClassicHeader
        className={cn("has-sticky-header group", {
          "ltr:xl:ml-[72px] rtl:xl:mr-[72px]": collapsed,
          "ltr:xl:ml-[272px] rtl:xl:mr-[272px]": !collapsed,
          "sticky top-6": navbarType === "sticky",
        })}
      >
        <div className="xl:mx-20 mx-4">
          <div
            className={cn(
              getHeaderStyles(),
              "md:px-8 px-6 py-0 rounded-3xl my-6 shadow-2xl border border-white/20 dark:border-gray-700/30"
            )}
          >
            {/* Floating effect background */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/40 to-transparent dark:from-gray-900/60 dark:via-gray-900/40 rounded-3xl"></div>
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-[#ED4135]/5 via-transparent to-[#25235F]/5"></div>

            <div className={cn(getContainerStyles(), "relative z-10")}>
              <NavTools
                isDesktop={isDesktop}
                isMobile={isMobile}
                sidebarType={sidebarType}
              />
            </div>
          </div>
        </div>
      </ClassicHeader>
    );
  }

  // Default vertical layout
  if (
    sidebarType !== "module" &&
    navbarType !== "floating" &&
    navbarType !== "hidden"
  ) {
    return (
      <ClassicHeader
        className={cn("group", {
          "ltr:xl:ml-[210px] rtl:xl:mr-[210px]": !collapsed,
          "ltr:xl:ml-[72px] rtl:xl:mr-[72px]": collapsed,
          "sticky top-0 z-50": navbarType === "sticky",
        })}
      >
        <div className={cn(getHeaderStyles(), "md:px-8 px-4 py-0")}>
          {/* Gradient accent line */}
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#ED4135]/30 via-40% via-[#25235F]/30 to-transparent"></div>

          <div className={getContainerStyles()}>
            <NavTools
              isDesktop={isDesktop}
              isMobile={isMobile}
              sidebarType={sidebarType}
            />
          </div>
        </div>
      </ClassicHeader>
    );
  }

  // Hidden navbar
  if (navbarType === "hidden") {
    return null;
  }

  // Floating layout
  if (navbarType === "floating") {
    return (
      <ClassicHeader
        className={cn("has-sticky-header group sticky top-6 px-8 z-50", {
          "ltr:ml-[72px] rtl:mr-[72px]": collapsed,
          "ltr:xl:ml-[300px] rtl:xl:mr-[300px]":
            !collapsed && sidebarType === "module",
          "ltr:xl:ml-[210px] rtl:xl:mr-[210px]":
            !collapsed && sidebarType !== "module",
        })}
      >
        <div
          className={cn(
            getHeaderStyles(),
            "md:px-8 px-6 py-0 rounded-3xl my-6 shadow-2xl border border-white/20 dark:border-gray-700/30"
          )}
        >
          {/* Premium floating effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-white/60 to-gray-50/40 dark:from-gray-900/80 dark:via-gray-900/60 dark:to-gray-800/40 rounded-3xl"></div>
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-[#ED4135]/10 via-transparent to-[#25235F]/10"></div>

          <div className={cn(getContainerStyles(), "relative z-10")}>
            <NavTools
              isDesktop={isDesktop}
              isMobile={isMobile}
              sidebarType={sidebarType}
            />
          </div>
        </div>
      </ClassicHeader>
    );
  }

  // Fallback layout
  return (
    <ClassicHeader
      className={cn("group", {
        "ltr:xl:ml-[300px] rtl:xl:mr-[300px]": !collapsed,
        "ltr:xl:ml-[72px] rtl:xl:mr-[72px]": collapsed,
        "sticky top-0 z-50": navbarType === "sticky",
      })}
    >
      <div className={cn(getHeaderStyles(), "md:px-8 px-4 py-0")}>
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#ED4135]/30 via-40% via-[#25235F]/30 to-transparent"></div>

        <div className={getContainerStyles()}>
          <NavTools
            isDesktop={isDesktop}
            isMobile={isMobile}
            sidebarType={sidebarType}
          />
        </div>
      </div>
    </ClassicHeader>
  );
};

export default Header;
