"use client";
import React from "react";
import { Breadcrumbs, BreadcrumbItem } from "@/components/ui/breadcrumbs";
import { useTranslate } from "@/config/useTranslation";
import { Icon } from "@iconify/react";

const BreadcrumbComponent = ({
  header,
  body,
}: {
  header: string;
  body: string;
}) => {
  const { t } = useTranslate();

  return (
    <div className="flex items-center space-x-1">
      {/* Home Icon */}
      <div
        className="
        flex items-center justify-center 
        w-8 h-8 rounded-lg 
        bg-[#25235F]/10 dark:bg-blue-900/30 
        hover:bg-[#25235F]/20 dark:hover:bg-blue-900/50 
        transition-all duration-300 
        group cursor-pointer
      "
      >
        <Icon
          icon="heroicons:home"
          className="
            h-4 w-4 
            text-[#25235F] dark:text-blue-300 
            group-hover:scale-110 
            transition-transform duration-300
          "
        />
      </div>

      {/* Custom Breadcrumb */}
      <div className="flex items-center space-x-2">
        {/* Separator */}
        <Icon
          icon="heroicons:chevron-right"
          className="h-4 w-4 text-gray-400 dark:text-gray-500"
        />

        {/* Header Breadcrumb */}
        <div className="group cursor-pointer">
          <span
            className="
            text-sm font-medium 
            text-gray-600 dark:text-gray-400 
            hover:text-[#25235F] dark:hover:text-blue-300 
            transition-colors duration-300 
            px-3 py-2 rounded-lg 
            hover:bg-[#25235F]/5 dark:hover:bg-blue-900/30
          "
          >
            {t(header)}
          </span>
        </div>

        {/* Separator */}
        <Icon
          icon="heroicons:chevron-right"
          className="h-4 w-4 text-gray-400 dark:text-gray-500"
        />

        {/* Current Page */}
        <div className="flex items-center gap-2">
          <span
            className="
            text-sm font-semibold 
            text-[#ED4135] dark:text-red-300
            bg-gradient-to-r 
            from-[#ED4135]/10 dark:from-red-900/30 
            to-[#ED4135]/5 dark:to-red-900/20 
            px-4 py-2 rounded-lg 
            border border-[#ED4135]/20 dark:border-red-800/50 
            shadow-sm dark:shadow-gray-900/50
          "
          >
            {t(body)}
          </span>

          {/* Current page indicator */}
          <div
            className="
            w-2 h-2 
            bg-[#ED4135] dark:bg-red-400 
            rounded-full 
            animate-pulse 
            shadow-lg dark:shadow-red-900/50
          "
          ></div>
        </div>
      </div>
    </div>
  );
};

export default BreadcrumbComponent;
