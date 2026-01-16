import { Icon } from "@iconify/react";
import React from "react";
import { Badge } from "@/components/ui/badge";
import { cn, isLocationMatch, getDynamicPath } from "@/lib/utils";
import * as Tooltip from "@radix-ui/react-tooltip";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useTranslate } from "@/config/useTranslation";

const SingleMenuItem = ({
  item,
  collapsed,
  trans,
}: {
  item: any;
  collapsed: boolean;
  trans: any;
}) => {
  const { badge, href, title } = item;
  const pathname = usePathname();
  const locationName = getDynamicPath(pathname);
  const { Navigate, t } = useTranslate();
  const isActive = isLocationMatch(href, locationName);

  // Detect if we're in RTL mode (Arabic)
  const isRTL =
    document.documentElement.dir === "rtl" ||
    document.body.dir === "rtl" ||
    window.getComputedStyle(document.documentElement).direction === "rtl";

  return (
    <li className="relative w-full group">
      <Link href={Navigate(href)} className="block">
        {collapsed ? (
          <div className="relative flex items-center justify-center h-16">
            <Tooltip.Provider>
              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <div
                    className={cn(
                      "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 relative z-10",
                      {
                        "bg-[#eef1f9] text-blue-600": isActive,
                        "text-white hover:bg-[#eef1f9] hover:text-blue-600":
                          !isActive,
                      },
                    )}
                  >
                    <item.icon className="w-6 h-6" />
                  </div>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Content
                    side={isRTL ? "left" : "right"}
                    className="bg-gray-800 text-white rounded-md px-3 py-2 text-sm shadow-lg z-50"
                    sideOffset={10}
                  >
                    {t(title)}
                    <Tooltip.Arrow className="fill-gray-800" />
                  </Tooltip.Content>
                </Tooltip.Portal>
              </Tooltip.Root>
            </Tooltip.Provider>
          </div>
        ) : (
          <div className="relative flex items-center h-16 px-4">
            {/* Active background with curved edges */}
            {isActive && (
              <div
                className={cn(
                  "absolute inset-0 bg-[#eef1f9]",
                  isRTL
                    ? "rounded-r-3xl rounded-l-none"
                    : "rounded-l-3xl rounded-r-none",
                )}
              ></div>
            )}

            <div className="relative z-10 flex items-center w-full">
              {/* Icon */}
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300",
                  {
                    "bg-blue-100 text-blue-600": isActive,
                    "text-white group-hover:text-blue-600": !isActive,
                  },
                )}
              >
                <item.icon className="w-5 h-5" />
              </div>

              {/* Title */}
              {!collapsed && (
                <span
                  className={cn(
                    "font-medium transition-all duration-300 whitespace-nowrap",
                    isRTL ? "mr-4 ml-0" : "ml-4 mr-0",
                    {
                      "text-blue-600": isActive,
                      "text-white group-hover:text-blue-600": !isActive,
                    },
                  )}
                >
                  {t(title)}
                </span>
              )}

              {/* Badge */}
              {badge && !collapsed && (
                <Badge
                  className={cn(
                    "px-2 py-1 text-xs font-medium rounded-full",
                    isRTL ? "mr-auto ml-0" : "ml-auto mr-0",
                    {
                      "bg-blue-100 text-blue-600": isActive,
                      "bg-[#eef1f9]/20 text-white group-hover:text-blue-600":
                        !isActive,
                    },
                  )}
                >
                  {badge}
                </Badge>
              )}
            </div>

            {/* Curved indicators for active state */}
            {isActive && (
              <>
                {/* Top curve */}
                <div
                  className={cn(
                    "absolute -top-4 w-4 h-4 bg-transparent",
                    isRTL
                      ? "left-0 rounded-bl-full shadow-[-5px_5px_0_5px_rgba(238,241,249)]"
                      : "right-0 rounded-br-full shadow-[5px_5px_0_5px_rgba(238,241,249)]",
                  )}
                ></div>
                {/* Bottom curve */}
                <div
                  className={cn(
                    "absolute -bottom-4 w-4 h-4 bg-transparent",
                    isRTL
                      ? "left-0 rounded-tl-full shadow-[-5px_-5px_0_5px_rgba(238,241,249)]"
                      : "right-0 rounded-tr-full shadow-[5px_-5px_0_5px_rgba(238,241,249)]",
                  )}
                ></div>
              </>
            )}
          </div>
        )}
      </Link>

      {/* Hover effects for non-active items */}
      {!isActive && !collapsed && (
        <div
          className={cn(
            "absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-[#eef1f9]",
            isRTL
              ? "rounded-r-3xl rounded-l-none"
              : "rounded-l-3xl rounded-r-none",
          )}
        ></div>
      )}
    </li>
  );
};

export default SingleMenuItem;
