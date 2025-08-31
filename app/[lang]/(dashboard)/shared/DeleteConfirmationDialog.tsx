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

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <Button
            size={size}
            color={variant}
            className={`${
              destructive
                ? "border-[#ED4135]/20 hover:border-[#ED4135] hover:bg-[#ED4135]"
                : "border-gray-300 hover:border-gray-500 hover:bg-red-600"
            } hover:text-white transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 group ${buttonClassName}`}
          >
            <Icon
              icon={icon}
              className={`h-4 w-4 group-hover:scale-110 text-[#ED4135] hover:text-[#fff] transition-transform duration-300 ${
                size === "icon" ? "" : "mr-2"
              }`}
            />
            {size !== "icon" && t("Delete")}
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="p-0 !h-auto border-0 shadow-2xl bg-white rounded-2xl overflow-hidden max-w-md">
        {/* Header with gradient background */}
        <DialogHeader
          className={`bg-gradient-to-r ${
            destructive
              ? "from-[#ED4135] to-[#ED4135]/90"
              : "from-gray-600 to-gray-500"
          } text-white p-6 relative overflow-hidden`}
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
                className={`w-20 h-20 rounded-full ${
                  destructive ? "bg-[#ED4135]/10" : "bg-gray-200"
                } flex items-center justify-center animate-pulse`}
              >
                <div
                  className={`w-16 h-16 rounded-full ${
                    destructive ? "bg-[#ED4135]/20" : "bg-gray-300"
                  } flex items-center justify-center`}
                >
                  <Icon
                    icon={icon}
                    className={`h-8 w-8 ${
                      destructive ? "text-[#ED4135]" : "text-gray-600"
                    }`}
                  />
                </div>
              </div>
              {/* Decorative rings */}
              <div
                className={`absolute inset-0 rounded-full border-2 ${
                  destructive ? "border-[#ED4135]/20" : "border-gray-300"
                } animate-ping`}
              ></div>
              <div
                className={`absolute inset-2 rounded-full border ${
                  destructive ? "border-[#ED4135]/10" : "border-gray-200"
                }`}
              ></div>
            </div>

            {/* Warning Text */}
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-[#25235F]">
                {t("Deleting")} {t(itemName)}
              </h3>
              <div className="space-y-2">
                <p className="text-gray-600 leading-relaxed">
                  {t(description)}
                </p>
                {showItemWarning && (
                  <div
                    className={`flex items-center justify-center gap-2 text-sm ${
                      destructive
                        ? "text-[#ED4135] bg-[#ED4135]/5"
                        : "text-gray-600 bg-gray-100"
                    } px-4 py-2 rounded-lg border ${
                      destructive ? "border-[#ED4135]/10" : "border-gray-200"
                    }`}
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
            className={`flex-1 bg-gradient-to-r ${
              destructive
                ? "from-[#ED4135] to-[#ED4135]/90 hover:from-[#ED4135]/90 hover:to-[#ED4135]"
                : "from-gray-600 to-gray-500 hover:from-gray-500 hover:to-gray-600"
            } text-white border-0 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 py-3 h-auto font-semibold`}
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
