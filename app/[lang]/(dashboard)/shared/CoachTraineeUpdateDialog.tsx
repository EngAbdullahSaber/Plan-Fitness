"use client";
import React, { useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";
import { UpdateMethod } from "@/app/services/apis/ApiMethod";

interface CoachTraineeUpdateDialogProps {
  trigger?: React.ReactNode;
  coachId: number;
  coachName: string;
  currentTrainees?: number | null;
  onSuccess?: () => void;
  size?: "icon" | "default" | "sm" | "lg";
  variant?: "outline" | "default" | "secondary" | "ghost" | "link";
  className?: string;
  buttonClassName?: string;
  icon?: string;
}

const CoachTraineeUpdateDialog = ({
  trigger = null,
  coachId,
  coachName,
  currentTrainees = 0,
  onSuccess,
  size = "icon",
  variant = "outline",
  className = "",
  buttonClassName = "",
  icon = "heroicons:user-group",
}: CoachTraineeUpdateDialogProps) => {
  const { t, lang } = useTranslate();
  const [isOpen, setIsOpen] = useState(false);
  const [traineeCount, setTraineeCount] = useState<string>(
    currentTrainees?.toString() || "0",
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      setTraineeCount(currentTrainees?.toString() || "0");
    }
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);

      // Validate input
      const count = parseInt(traineeCount);
      if (isNaN(count) || count < 0) {
        toast.error(t("INVALID_TRAINEE_COUNT") || "Invalid trainee count");
        return;
      }

      const response = await UpdateMethod(
        "user/coach",
        {
          numberOFCoachTrainee: count,
        },
        coachId.toString(),
        lang,
      );

      console.log("API Response:", response);

      if (response?.data?.code === 200 || response?.code === 200) {
        toast.success(
          response.data?.message ||
            response.message ||
            t("TRAINEE_COUNT_UPDATED_SUCCESSFULLY") ||
            "Trainee count updated successfully",
        );
        setIsOpen(false);
        if (onSuccess) {
          onSuccess();
        }
      } else {
        toast.error(
          response?.data?.message ||
            response?.message ||
            t("FAILED_TO_UPDATE_TRAINEE_COUNT") ||
            "Failed to update trainee count",
        );
      }
    } catch (error: any) {
      console.error("Error updating trainee count:", error);
      toast.error(
        error.response?.data?.message ||
          t("FAILED_TO_UPDATE_TRAINEE_COUNT") ||
          "Failed to update trainee count",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleIncrement = () => {
    const current = parseInt(traineeCount) || 0;
    setTraineeCount((current + 1).toString());
  };

  const handleDecrement = () => {
    const current = parseInt(traineeCount) || 0;
    if (current > 0) {
      setTraineeCount((current - 1).toString());
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger || (
          <Button
            size={size}
            variant={variant}
            className={`
              border-[#25235F]/20 dark:border-blue-400/30 
              hover:border-[#25235F] dark:hover:border-blue-500 
              hover:bg-[#25235F] dark:hover:bg-blue-600 
              text-[#25235F] dark:text-blue-400
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
                hover:scale-110 
                transition-transform duration-300 
                text-[#25235F] dark:text-blue-400
                hover:text-white
                ${size === "icon" ? "" : "mr-2"}
              `}
            />
            {size !== "icon" && t("update_trainees")}
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="p-0 !h-auto border-0 shadow-2xl dark:shadow-gray-900/30 bg-white dark:bg-gray-900 rounded-2xl overflow-hidden max-w-md">
        {/* Header with gradient background */}
        <DialogHeader
          className={`
            bg-gradient-to-r from-blue-500 to-blue-600 
            text-white p-6 relative overflow-hidden
          `}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform skew-x-12"></div>
          <DialogTitle className="relative z-10 flex items-center gap-3 text-xl font-bold">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <Icon
                icon="heroicons:user-group"
                className="h-5 w-5 text-white"
              />
            </div>
            {t("update_trainee_count") || "Update Trainee Count"}
          </DialogTitle>
        </DialogHeader>

        {/* Content */}
        <div className="p-8">
          <div className="flex flex-col items-center text-center space-y-6">
            {/* Coach Info */}
            <div className="text-center space-y-2">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 flex items-center justify-center mx-auto mb-3">
                <Icon
                  icon="heroicons:academic-cap"
                  className="h-8 w-8 text-blue-600 dark:text-blue-400"
                />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {coachName}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t("current_trainees")}: {currentTrainees || 0}
              </p>
            </div>

            {/* Trainee Count Input */}
            <div className="space-y-4 w-full">
              <Label htmlFor="traineeCount" className="text-left block">
                {t("new_trainee_count") || "New Trainee Count"}
              </Label>

              <div className="flex items-center gap-4">
                {/* Decrement Button */}
                <Button
                  type="button"
                  size="icon"
                  variant="outline"
                  onClick={handleDecrement}
                  disabled={parseInt(traineeCount) <= 0}
                  className="h-12 w-12 rounded-full border-2 border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400"
                >
                  <Icon icon="heroicons:minus" className="h-5 w-5" />
                </Button>

                {/* Input */}
                <div className="flex-1">
                  <Input
                    id="traineeCount"
                    type="number"
                    min="0"
                    value={traineeCount}
                    onChange={(e) => setTraineeCount(e.target.value)}
                    className="h-12 text-center text-xl font-semibold border-2 border-blue-300 dark:border-blue-600 focus:border-blue-500 dark:focus:border-blue-400"
                  />
                </div>

                {/* Increment Button */}
                <Button
                  type="button"
                  size="icon"
                  variant="outline"
                  onClick={handleIncrement}
                  className="h-12 w-12 rounded-full border-2 border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400"
                >
                  <Icon icon="heroicons:plus" className="h-5 w-5" />
                </Button>
              </div>

              <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <Icon icon="heroicons:information-circle" className="h-4 w-4" />
                <span>
                  {t("trainee_count_description") ||
                    "Enter the number of trainees assigned to this coach"}
                </span>
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
              disabled={isSubmitting}
            >
              <Icon icon="heroicons:x-mark" className="h-4 w-4 mr-2" />
              {t("cancel") || "Cancel"}
            </Button>
          </DialogClose>

          <Button
            onClick={handleSubmit}
            disabled={
              isSubmitting ||
              traineeCount === (currentTrainees?.toString() || "0")
            }
            className={`
              flex-1 
              bg-gradient-to-r 
              from-blue-500 to-blue-600
              hover:from-blue-600 hover:to-blue-700
              disabled:from-gray-400 disabled:to-gray-500
              disabled:cursor-not-allowed
              text-white border-0 
              shadow-lg hover:shadow-xl 
              transform hover:-translate-y-0.5 
              transition-all duration-300 
              py-3 h-auto font-semibold
            `}
          >
            {isSubmitting ? (
              <>
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                {t("updating") || "Updating..."}
              </>
            ) : (
              <>
                <Icon icon="heroicons:check" className="h-4 w-4 mr-2" />
                {t("update") || "Update"}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CoachTraineeUpdateDialog;
