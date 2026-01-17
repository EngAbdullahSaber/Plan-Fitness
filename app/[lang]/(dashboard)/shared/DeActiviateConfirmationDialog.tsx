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

const ActivationConfirmationDialog = ({
  trigger = null,
  onConfirm,
  title = "Confirm Action",
  description = "Are you sure you want to perform this action?",
  confirmText = "Agree",
  cancelText = "Disagree",
  itemName = "item",
  warningText = "This action can be reversed",
  size = "icon",
  variant = "outline",
  className = "",
  buttonClassName = "w-10 h-10",
  icon = "heroicons:power",
  showItemWarning = true,
  destructive = false,
  actionType = "deactivate", // 'activate' or 'deactivate'
  currentStatus = false, // current status of the item (true for active, false for inactive)
}) => {
  const { t, loading, error } = useTranslate();

  // Determine colors and texts based on action type
  const isActivate = actionType === "activate";
  const isDeactivate = actionType === "deactivate";

  // Color classes for different states
  const activeClasses = {
    primary: "text-emerald-600 dark:text-emerald-400",
    border: "border-emerald-200 dark:border-emerald-800",
    bgLight: "bg-emerald-50 dark:bg-emerald-900/20",
    gradientFrom: "from-emerald-500 dark:from-emerald-600",
    gradientTo: "to-emerald-600 dark:to-emerald-700",
    bgFull: "bg-emerald-500 dark:bg-emerald-600",
    bgHover: "hover:bg-emerald-500 dark:hover:bg-emerald-600",
    borderHover: "hover:border-emerald-500 dark:hover:border-emerald-400",
    textHover: "hover:text-white",
    shadow: "shadow-emerald-100/50 dark:shadow-emerald-900/30",
  };

  const deactiveClasses = {
    primary: "text-red-600 dark:text-red-400",
    border: "border-red-200 dark:border-red-800",
    bgLight: "bg-red-50 dark:bg-red-900/20",
    gradientFrom: "from-red-500 dark:from-red-600",
    gradientTo: "to-red-600 dark:to-red-700",
    bgFull: "bg-red-500 dark:bg-red-600",
    bgHover: "hover:bg-red-500 dark:hover:bg-red-600",
    borderHover: "hover:border-red-500 dark:hover:border-red-400",
    textHover: "hover:text-white",
    shadow: "shadow-red-100/50 dark:shadow-red-900/30",
  };

  const neutralClasses = {
    primary: "text-gray-600 dark:text-gray-400",
    border: "border-gray-300 dark:border-gray-700",
    bgLight: "bg-gray-50 dark:bg-gray-800/50",
    gradientFrom: "from-gray-500 dark:from-gray-600",
    gradientTo: "to-gray-600 dark:to-gray-700",
    bgFull: "bg-gray-500 dark:bg-gray-600",
    bgHover: "hover:bg-gray-500 dark:hover:bg-gray-600",
    borderHover: "hover:border-gray-500 dark:hover:border-gray-400",
    textHover: "hover:text-white",
    shadow: "shadow-gray-100/50 dark:shadow-gray-900/30",
  };

  const classes = isActivate
    ? activeClasses
    : isDeactivate
      ? deactiveClasses
      : neutralClasses;

  // Default texts based on action type
  const defaultTitle = isActivate
    ? "Confirm Activation"
    : isDeactivate
      ? "Confirm Deactivation"
      : "Confirm Action";

  const defaultDescription = isActivate
    ? "Are you sure you want to activate this item?"
    : isDeactivate
      ? "Are you sure you want to deactivate this item?"
      : "Are you sure you want to perform this action?";

  const defaultConfirmText = isActivate
    ? "Activate"
    : isDeactivate
      ? "Deactivate"
      : "Confirm";

  const defaultWarningText = isActivate
    ? "This will make the item available for use"
    : isDeactivate
      ? "This will make the item unavailable for use"
      : "This action can be reversed";

  const defaultIcon = isActivate
    ? "heroicons:check-circle"
    : isDeactivate
      ? "heroicons:power"
      : "heroicons:exclamation-triangle";

  // Status-based dynamic content
  const statusBasedTitle = currentStatus
    ? "Confirm Deactivation"
    : "Confirm Activation";

  const statusBasedDescription = currentStatus
    ? "Are you sure you want to deactivate this item? It will become unavailable."
    : "Are you sure you want to activate this item? It will become available for use.";

  const statusBasedConfirmText = currentStatus ? "Deactivate" : "Activate";
  const statusBasedIcon = currentStatus
    ? "heroicons:power"
    : "heroicons:check-circle";

  // Determine which classes to use based on status/actionType
  const finalClasses = actionType
    ? classes
    : currentStatus
      ? deactiveClasses
      : activeClasses;

  // Use status-based content if no explicit actionType is provided
  const finalTitle = actionType
    ? t(title || defaultTitle)
    : t(statusBasedTitle);
  const finalDescription = actionType
    ? t(description || defaultDescription)
    : t(statusBasedDescription);
  const finalConfirmText = actionType
    ? t(confirmText || defaultConfirmText)
    : t(statusBasedConfirmText);
  const finalWarningText = actionType
    ? t(warningText || defaultWarningText)
    : t(
        currentStatus
          ? "This will make the item unavailable for use"
          : "This will make the item available for use",
      );
  const finalIcon = actionType ? icon || defaultIcon : statusBasedIcon;

  // Determine button variant classes
  const buttonVariantClasses = () => {
    if (isDeactivate || (!actionType && currentStatus)) {
      return `border-red-200 dark:border-red-800 hover:border-red-500 dark:hover:border-red-400 hover:bg-red-500 dark:hover:bg-red-600 text-red-600 dark:text-red-400 hover:text-white`;
    }
    if (isActivate || (!actionType && !currentStatus)) {
      return `border-emerald-200 dark:border-emerald-800 hover:border-emerald-500 dark:hover:border-emerald-400 hover:bg-emerald-500 dark:hover:bg-emerald-600 text-emerald-600 dark:text-emerald-400 hover:text-white`;
    }
    return `border-gray-300 dark:border-gray-700 hover:border-gray-500 dark:hover:border-gray-400 hover:bg-gray-500 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-400 hover:text-white`;
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <Button
            size={size}
            variant={variant}
            className={`
              ${buttonVariantClasses()}
              transition-all duration-300 
              shadow-md hover:shadow-lg 
              transform hover:scale-105 
              group ${buttonClassName}
            `}
          >
            <Icon
              icon={finalIcon}
              className={`h-4 w-4 group-hover:scale-110 transition-transform duration-300 ${
                size === "icon" ? "" : "mr-2"
              }`}
            />
            {size !== "icon" &&
              (isDeactivate || (!actionType && currentStatus)
                ? t("Deactivate")
                : isActivate || (!actionType && !currentStatus)
                  ? t("Activate")
                  : t("Toggle"))}
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="p-0 !h-auto border-0 shadow-2xl dark:shadow-gray-900/30 bg-white dark:bg-gray-900 rounded-2xl overflow-hidden max-w-md">
        {/* Header with gradient background */}
        <DialogHeader
          className={`bg-gradient-to-r ${finalClasses.gradientFrom} ${finalClasses.gradientTo} text-white p-6 relative overflow-hidden`}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform skew-x-12"></div>
          <DialogTitle className="relative z-10 flex items-center gap-3 text-xl font-bold">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <Icon icon={finalIcon} className="h-5 w-5 text-white" />
            </div>
            {finalTitle}
          </DialogTitle>
        </DialogHeader>

        {/* Content */}
        <div className="p-8">
          <div className="flex flex-col items-center text-center space-y-6">
            {/* Icon with Animation */}
            <div className="relative">
              <div
                className={`w-20 h-20 rounded-full ${finalClasses.bgLight} flex items-center justify-center`}
              >
                <div
                  className={`w-16 h-16 rounded-full ${finalClasses.bgLight.replace("50", "100").replace("20", "30")} flex items-center justify-center`}
                >
                  <Icon
                    icon={finalIcon}
                    className={`h-8 w-8 ${finalClasses.primary}`}
                  />
                </div>
              </div>
              {/* Decorative rings */}
              <div
                className={`absolute inset-0 rounded-full border-2 ${finalClasses.border} animate-ping`}
              ></div>
              <div
                className={`absolute inset-2 rounded-full border ${finalClasses.border} opacity-30`}
              ></div>
            </div>

            {/* Text Content */}
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {!currentStatus ? t("Activating") : t("Deactivating")}{" "}
                {t(itemName)}
              </h3>
              <div className="space-y-2">
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {finalDescription}
                </p>
                {showItemWarning && (
                  <div
                    className={`flex items-center justify-center gap-2 text-sm ${finalClasses.primary} ${finalClasses.bgLight} px-4 py-2 rounded-lg border ${finalClasses.border}`}
                  >
                    <Icon
                      icon="heroicons:information-circle"
                      className="h-4 w-4"
                    />
                    <span className="font-medium">{finalWarningText}</span>
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
              className="flex-1 border-2 border-gray-300 dark:border-gray-600 hover:border-gray-900 dark:hover:border-gray-300 hover:bg-gray-900 dark:hover:bg-gray-300 hover:text-white dark:hover:text-gray-900 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 py-3 h-auto font-semibold"
            >
              <Icon icon="heroicons:x-mark" className="h-4 w-4 mr-2" />
              {t(cancelText)}
            </Button>
          </DialogClose>

          <Button
            onClick={onConfirm}
            className={`flex-1 bg-gradient-to-r ${finalClasses.gradientFrom} ${finalClasses.gradientTo} hover:opacity-90 text-white border-0 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 py-3 h-auto font-semibold`}
          >
            <Icon icon={finalIcon} className="h-4 w-4 mr-2" />
            {finalConfirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ActivationConfirmationDialog;
