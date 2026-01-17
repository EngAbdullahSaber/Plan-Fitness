"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useTranslate } from "@/config/useTranslation";
import { Icon } from "@iconify/react";

const DeleteConfirmationDialog = ({
  trigger = null,
  onConfirm,
  title = "Confirm Deletion",
  description = "Are You Sure For Delete This Item?",
  confirmText = "Agree",
  cancelText = "Disagree",
  itemName = "item",
  warningText = "This action cannot be undone",
  size = "icon",
  variant = "outline",
  className = "",
  buttonClassName = "",
  icon = "heroicons:trash",
  showItemWarning = true,
  destructive = true,
}) => {
  const { t, loading, error } = useTranslate();

  // Color classes for destructive vs non-destructive modes
  const destructiveClasses = {
    primary: "text-red-600 dark:text-red-400",
    border: "border-red-200 dark:border-red-800",
    bgLight: "bg-red-50 dark:bg-red-900/20",
    bgMedium: "bg-red-100 dark:bg-red-900/30",
    gradientFrom: "from-red-500 dark:from-red-600",
    gradientTo: "to-red-600 dark:to-red-700",
    bgFull: "bg-red-500 dark:bg-red-600",
    borderHover: "hover:border-red-500 dark:hover:border-red-400",
    bgHover: "hover:bg-red-500 dark:hover:bg-red-600",
    textHover: "hover:text-white",
    shadow: "shadow-red-100/50 dark:shadow-red-900/30",
  };

  const neutralClasses = {
    primary: "text-gray-600 dark:text-gray-400",
    border: "border-gray-300 dark:border-gray-700",
    bgLight: "bg-gray-100 dark:bg-gray-800",
    bgMedium: "bg-gray-200 dark:bg-gray-700",
    gradientFrom: "from-gray-500 dark:from-gray-600",
    gradientTo: "to-gray-600 dark:to-gray-700",
    bgFull: "bg-gray-500 dark:bg-gray-600",
    borderHover: "hover:border-gray-500 dark:hover:border-gray-400",
    bgHover: "hover:bg-gray-500 dark:hover:bg-gray-600",
    textHover: "hover:text-white",
    shadow: "shadow-gray-100/50 dark:shadow-gray-900/30",
  };

  const currentClasses = destructive ? destructiveClasses : neutralClasses;

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <Button
            size={size}
            variant={variant}
            className={`
              ${
                destructive
                  ? "border-red-200 dark:border-red-800 hover:border-red-500 dark:hover:border-red-400 hover:bg-red-500 dark:hover:bg-red-600"
                  : "border-gray-300 dark:border-gray-700 hover:border-gray-500 dark:hover:border-gray-400 hover:bg-gray-500 dark:hover:bg-gray-600"
              } 
              ${destructive ? "text-red-600 dark:text-red-400" : "text-gray-600 dark:text-gray-400"}
              hover:text-white 
              transition-all duration-300 
              shadow-md hover:shadow-lg 
              transform hover:scale-105 
              group ${buttonClassName}
            `}
          >
            <Icon
              icon={icon}
              className={`
                h-4 w-4 
                group-hover:scale-110 
                transition-transform duration-300 
                ${destructive ? "text-red-600 dark:text-red-400" : "text-gray-600 dark:text-gray-400"}
                group-hover:text-white
                ${size === "icon" ? "" : "mr-2"}
              `}
            />
            {size !== "icon" && t("Delete")}
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="p-0 !h-auto border-0 shadow-2xl dark:shadow-gray-900/30 bg-white dark:bg-gray-900 rounded-2xl overflow-hidden max-w-md">
        {/* Header with gradient background */}
        <DialogHeader
          className={`
            bg-gradient-to-r 
            ${currentClasses.gradientFrom} ${currentClasses.gradientTo} 
            text-white p-6 relative overflow-hidden
          `}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform skew-x-12"></div>
          <DialogTitle className="relative z-10 flex items-center gap-3 text-xl font-bold">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <Icon
                icon="heroicons:exclamation-triangle"
                className="h-5 w-5 text-white"
              />
            </div>
            {t(title)}
          </DialogTitle>
        </DialogHeader>

        {/* Content */}
        <div className="p-8">
          <div className="flex flex-col items-center text-center space-y-6">
            {/* Warning Icon with Animation */}
            <div className="relative">
              <div
                className={`
                  w-20 h-20 rounded-full 
                  ${currentClasses.bgLight} 
                  flex items-center justify-center
                `}
              >
                <div
                  className={`
                    w-16 h-16 rounded-full 
                    ${currentClasses.bgMedium} 
                    flex items-center justify-center
                  `}
                >
                  <Icon
                    icon={icon}
                    className={`h-8 w-8 ${currentClasses.primary}`}
                  />
                </div>
              </div>
              {/* Decorative rings */}
              <div
                className={`
                  absolute inset-0 rounded-full border-2 
                  ${currentClasses.border} 
                  animate-ping
                `}
              ></div>
              <div
                className={`
                  absolute inset-2 rounded-full border 
                  ${currentClasses.border} 
                  opacity-30
                `}
              ></div>
            </div>

            {/* Warning Text */}
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {t("Deleting")} {t(itemName)}
              </h3>
              <div className="space-y-2">
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {t(description)}
                </p>
                {showItemWarning && (
                  <div
                    className={`
                      flex items-center justify-center gap-2 text-sm 
                      ${currentClasses.primary} 
                      ${currentClasses.bgLight} 
                      px-4 py-2 rounded-lg border 
                      ${currentClasses.border}
                    `}
                  >
                    <Icon
                      icon="heroicons:information-circle"
                      className="h-4 w-4"
                    />
                    <span className="font-medium">{t(warningText)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer with Enhanced Buttons */}
        <DialogFooter className="p-6 bg-gray-50/50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-700 flex gap-4">
          <DialogClose asChild>
            <Button
              variant="outline"
              className="
                flex-1 border-2 
                border-gray-300 dark:border-gray-600 
                hover:border-gray-900 dark:hover:border-gray-300 
                hover:bg-gray-900 dark:hover:bg-gray-300 
                hover:text-white dark:hover:text-gray-900 
                transition-all duration-300 
                shadow-md hover:shadow-lg 
                transform hover:-translate-y-0.5 
                py-3 h-auto font-semibold
              "
            >
              <Icon icon="heroicons:x-mark" className="h-4 w-4 mr-2" />
              {t(cancelText)}
            </Button>
          </DialogClose>

          <Button
            onClick={onConfirm}
            className={`
              flex-1 
              bg-gradient-to-r 
              ${currentClasses.gradientFrom} ${currentClasses.gradientTo} 
              hover:opacity-90 
              text-white border-0 
              shadow-lg hover:shadow-xl 
              transform hover:-translate-y-0.5 
              transition-all duration-300 
              py-3 h-auto font-semibold
            `}
          >
            <Icon icon={icon} className="h-4 w-4 mr-2" />
            {t(confirmText)}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteConfirmationDialog;
