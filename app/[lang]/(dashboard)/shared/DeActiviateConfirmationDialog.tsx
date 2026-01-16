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
  buttonClassName = "",
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

  // Colors for different states
  const activeColors = {
    primary: "#10B981", // Green
    gradientFrom: "#10B981",
    gradientTo: "#059669",
    bgLight: "#ECFDF5",
    borderLight: "#D1FAE5",
  };

  const deactiveColors = {
    primary: "#ED4135", // Red
    gradientFrom: "#ED4135",
    gradientTo: "#DC2626",
    bgLight: "#FEF2F2",
    borderLight: "#FECACA",
  };

  const neutralColors = {
    primary: "#6B7280", // Gray
    gradientFrom: "#6B7280",
    gradientTo: "#4B5563",
    bgLight: "#F9FAFB",
    borderLight: "#E5E7EB",
  };

  const colors = isActivate
    ? activeColors
    : isDeactivate
    ? deactiveColors
    : neutralColors;

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
          : "This will make the item available for use"
      );
  const finalIcon = actionType ? icon || defaultIcon : statusBasedIcon;

  const finalColors = actionType
    ? colors
    : currentStatus
    ? deactiveColors
    : activeColors;

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <Button
            size={size}
            variant={variant}
            className={`${
              isDeactivate || (!actionType && currentStatus)
                ? "border-[#ED4135]/20 hover:border-[#ED4135] hover:bg-[#ED4135] text-[#ED4135] hover:text-white"
                : isActivate || (!actionType && !currentStatus)
                ? "border-[#10B981]/20 hover:border-[#10B981] hover:bg-[#10B981] text-[#10B981] hover:text-white"
                : "border-gray-300 hover:border-gray-500 hover:bg-gray-600 text-gray-600 hover:text-white"
            } transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 group ${buttonClassName}`}
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

      <DialogContent className="p-0 !h-auto border-0 shadow-2xl bg-white rounded-2xl overflow-hidden max-w-md">
        {/* Header with gradient background */}
        <DialogHeader
          className={`bg-gradient-to-r from-[${finalColors.gradientFrom}] to-[${finalColors.gradientTo}] text-white p-6 relative overflow-hidden`}
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
                className={`w-20 h-20 rounded-full bg-[${finalColors.primary}]/10 flex items-center justify-center animate-pulse`}
              >
                <div
                  className={`w-16 h-16 rounded-full bg-[${finalColors.primary}]/20 flex items-center justify-center`}
                >
                  <Icon
                    icon={finalIcon}
                    className={`h-8 w-8 text-[${finalColors.primary}]`}
                  />
                </div>
              </div>
              {/* Decorative rings */}
              <div
                className={`absolute inset-0 rounded-full border-2 border-[${finalColors.primary}]/20 animate-ping`}
              ></div>
              <div
                className={`absolute inset-2 rounded-full border border-[${finalColors.primary}]/10`}
              ></div>
            </div>

            {/* Text Content */}
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-[#25235F]">
                {!currentStatus ? t("Activating") : t("Deactivating")}{" "}
                {t(itemName)}
              </h3>
              <div className="space-y-2">
                <p className="text-gray-600 leading-relaxed">
                  {finalDescription}
                </p>
                {showItemWarning && (
                  <div
                    className={`flex items-center justify-center gap-2 text-sm text-[${finalColors.primary}] bg-[${finalColors.primary}]/5 px-4 py-2 rounded-lg border border-[${finalColors.primary}]/10`}
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
        <DialogFooter className="p-6 bg-gray-50/50 border-t border-gray-100 flex gap-4">
          <DialogClose asChild>
            <Button
              variant="outline"
              className="flex-1 border-2 border-gray-300 hover:border-[#25235F] hover:bg-[#25235F] hover:text-white transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 py-3 h-auto font-semibold"
            >
              <Icon icon="heroicons:x-mark" className="h-4 w-4 mr-2" />
              {t(cancelText)}
            </Button>
          </DialogClose>

          <Button
            onClick={onConfirm}
            className={`flex-1 bg-gradient-to-r from-[${finalColors.gradientFrom}] to-[${finalColors.gradientTo}] hover:from-[${finalColors.gradientFrom}]/90 hover:to-[${finalColors.gradientTo}]/90 text-white border-0 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 py-3 h-auto font-semibold`}
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
