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

  return (
    <li className="relative w-full">
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
                        "text-white hover:bg-[#eef1f9]": !isActive,
                      }
                    )}
                  >
                    <item.icon className="w-6 h-6" />
                  </div>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Content
                    side="right"
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
              <div className="absolute inset-0 bg-[#eef1f9] rounded-l-3xl"></div>
            )}

            <div className="relative z-10 flex items-center w-full">
              {/* Icon */}
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300",
                  {
                    "bg-blue-100 text-blue-600": isActive,
                    "text-white": !isActive,
                  }
                )}
              >
                <item.icon className="w-5 h-5" />
              </div>

              {/* Title */}
              {!collapsed && (
                <span
                  className={cn(
                    "ml-4 font-medium transition-all duration-300 whitespace-nowrap",
                    {
                      "text-blue-600": isActive,
                      "text-white": !isActive,
                    }
                  )}
                >
                  {t(title)}
                </span>
              )}

              {/* Badge */}
              {badge && !collapsed && (
                <Badge
                  className={cn(
                    "ml-auto px-2 py-1 text-xs font-medium rounded-full",
                    {
                      "bg-blue-100 text-blue-600": isActive,
                      "bg-[#eef1f9] text-white": !isActive,
                    }
                  )}
                >
                  {badge}
                </Badge>
              )}
            </div>

            {/* Curved indicators for active state */}
            {isActive && (
              <>
                <div className="absolute -top-4 right-0 w-4 h-4 bg-transparent rounded-br-full shadow-[5px_5px_0_5px_rgba(238,241,249)]"></div>
                <div className="absolute -bottom-4 right-0 w-4 h-4 bg-transparent rounded-tr-full shadow-[5px_-5px_0_5px_rgba(238,241,249)]"></div>
              </>
            )}
          </div>
        )}
      </Link>

      {/* Hover effects for non-active items */}
      {!isActive && !collapsed && (
        <div className="absolute inset-0 rounded-l-3xl hover:bg-[#eef1f9] transition-all duration-300"></div>
      )}
    </li>
  );
};

export default SingleMenuItem;
