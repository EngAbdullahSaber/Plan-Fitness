// ============================================
// DescriptionCell Component - Reusable
// ============================================

import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Icon } from "@iconify/react";

interface DescriptionCellProps {
  description: string;
  icon?: string;
  maxLength?: number;
  maxWidth?: string;
  showIcon?: boolean;
  iconGradient?: string;
  variant?: "default" | "compact" | "card";
  className?: string;
}

export const DescriptionCell: React.FC<DescriptionCellProps> = ({
  description,
  icon = "heroicons:document-text",
  maxLength = 60,
  maxWidth = "250px",
  showIcon = true,
  iconGradient = "from-blue-500 to-purple-500",
  variant = "default",
  className = "",
}) => {
  const truncatedText =
    description?.length > maxLength
      ? `${description.substring(0, maxLength)}...`
      : description;

  const shouldShowTooltip = description?.length > maxLength;

  if (variant === "compact") {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className={`group flex items-center gap-2 ${className}`}>
              {showIcon && (
                <div
                  className={`w-8 h-8 rounded-lg bg-gradient-to-br ${iconGradient} bg-opacity-10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}
                >
                  <Icon
                    icon={icon}
                    className="h-4 w-4 text-gray-600 group-hover:text-blue-600 transition-colors"
                  />
                </div>
              )}
              <span
                className="truncate font-medium text-gray-700 group-hover:text-blue-600 transition-colors text-sm"
                style={{ maxWidth }}
              >
                {truncatedText || "No description"}
              </span>
            </div>
          </TooltipTrigger>
          {shouldShowTooltip && (
            <TooltipContent className="max-w-md bg-gray-900 text-white p-4 rounded-xl shadow-2xl">
              <p className="text-sm leading-relaxed">{description}</p>
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
    );
  }

  if (variant === "card") {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              className={`group relative p-4 rounded-xl bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 border-2 border-gray-200 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-100/50 transition-all duration-300 cursor-pointer ${className}`}
            >
              {/* Decorative gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 rounded-xl transition-opacity duration-300" />

              <div className="relative flex items-start gap-3">
                {showIcon && (
                  <div
                    className={`w-10 h-10 rounded-xl bg-gradient-to-br ${iconGradient} flex items-center justify-center flex-shrink-0 shadow-md group-hover:shadow-lg group-hover:scale-110 transition-all duration-300`}
                  >
                    <Icon icon={icon} className="h-5 w-5 text-white" />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <p
                    className="text-sm font-medium text-gray-800 group-hover:text-blue-700 transition-colors line-clamp-2"
                    style={{ maxWidth }}
                  >
                    {description || "No description available"}
                  </p>

                  {shouldShowTooltip && (
                    <div className="flex items-center gap-1 mt-2 text-xs text-gray-500 group-hover:text-blue-600 transition-colors">
                      <Icon icon="heroicons:eye" className="h-3 w-3" />
                      <span>Hover to view full</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TooltipTrigger>
          {shouldShowTooltip && (
            <TooltipContent className="max-w-lg bg-gradient-to-br from-gray-900 to-gray-800 text-white p-5 rounded-2xl shadow-2xl border border-gray-700">
              <div className="flex items-start gap-3">
                <Icon
                  icon={icon}
                  className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5"
                />
                <p className="text-sm leading-relaxed">{description}</p>
              </div>
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
    );
  }

  // Default variant
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={`group flex items-center gap-3 cursor-pointer ${className}`}
          >
            {showIcon && (
              <div
                className={`relative w-11 h-11 rounded-xl   bg-opacity-10 flex items-center justify-center flex-shrink-0 overflow-hidden transition-all duration-300 group-hover:shadow-lg group-hover:shadow-blue-200/50 group-hover:scale-110`}
              >
                {/* Animated background */}
                <div
                  className={`absolute inset-0   opacity-0 group-hover:opacity-20 transition-opacity duration-300`}
                />

                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#25235F]/10 to-[#ED4135]/10 flex items-center justify-center">
                  <Icon icon={icon} className="h-5 w-5 text-[#25235F]" />
                </div>

                {/* Ring animation */}
                <div className="absolute inset-0 rounded-xl border-2 border-blue-500 scale-100 opacity-0 group-hover:scale-150 group-hover:opacity-0 transition-all duration-500" />
              </div>
            )}

            <div className="flex flex-col flex-1 min-w-0">
              <span
                className="truncate font-semibold text-gray-800 group-hover:text-blue-600 transition-colors duration-300 text-sm"
                style={{ maxWidth }}
              >
                {truncatedText || "No description"}
              </span>
            </div>
          </div>
        </TooltipTrigger>

        {shouldShowTooltip && (
          <TooltipContent className="max-w-xl bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white p-6 rounded-2xl shadow-2xl border-2 border-blue-500/30">
            <div className="space-y-3">
              <div className="flex items-center gap-2 pb-3 border-b border-white/20">
                <div
                  className={`w-8 h-8 rounded-lg bg-gradient-to-br ${iconGradient} flex items-center justify-center`}
                >
                  <Icon icon={icon} className="h-4 w-4 text-white" />
                </div>
                <h4 className="font-semibold text-sm">Full Description</h4>
              </div>
              <p className="text-sm leading-relaxed text-gray-100">
                {description}
              </p>
            </div>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
};
