// ============================================
// ImageCell Component - Simplified
// ============================================

import React from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { useTranslate } from "@/config/useTranslation";

interface ImageCellProps {
  image?: string;
  alt?: string;
  size?: "sm" | "md" | "lg";
  shape?: "circle" | "square" | "rounded";
  baseUrl?: string;
  className?: string;
}

export const ImageCell: React.FC<ImageCellProps> = ({
  image,
  alt = "Image",
  size = "md",
  shape = "circle",
  baseUrl = "/",
  className = "",
}) => {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-14 h-14",
    lg: "w-16 h-16",
  };
  const { t } = useTranslate();

  const shapeClasses = {
    circle: "rounded-full",
    square: "rounded-none",
    rounded: "rounded-lg",
  };

  if (!image) {
    return (
      <div className="flex items-center justify-center">
        <div
          className={`
            ${sizeClasses[size]} 
            ${shapeClasses[shape]} 
            bg-gray-100 dark:bg-gray-800 
            flex items-center justify-center
            border border-gray-200 dark:border-gray-700
          `}
        >
          <Icon
            icon="heroicons:photo"
            className="h-5 w-5 text-gray-400 dark:text-gray-500"
          />
        </div>
      </div>
    );
  }

  const imageSrc = image.startsWith("http") ? image : `${baseUrl}${image}`;

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = imageSrc;
    link.download = alt || "image";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex items-center justify-center">
      <Dialog>
        <DialogTrigger asChild>
          <button
            className={`
              group relative 
              ${sizeClasses[size]} 
              ${shapeClasses[shape]} 
              ${shape === "circle" ? "rounded-full" : shapeClasses[shape]}
              overflow-hidden
              hover:scale-105 transition-all duration-200 
              cursor-pointer focus:outline-none
              focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900
              ${className}
            `}
          >
            <img
              src={imageSrc}
              alt={alt}
              className="w-full h-full object-cover"
              style={{
                borderRadius:
                  shape === "circle"
                    ? "50%"
                    : shape === "rounded"
                      ? "0.5rem"
                      : "0",
              }}
            />

            {/* Hover overlay */}
            <div
              className="
                absolute inset-0 
                bg-black/0 group-hover:bg-black/20 
                dark:group-hover:bg-black/40
                transition-all duration-200 
                flex items-center justify-center
              "
              style={{
                borderRadius:
                  shape === "circle"
                    ? "50%"
                    : shape === "rounded"
                      ? "0.5rem"
                      : "0",
              }}
            >
              <Icon
                icon="heroicons:eye"
                className="
                  h-4 w-4 
                  text-white 
                  opacity-0 group-hover:opacity-100 
                  transition-opacity duration-200
                "
              />
            </div>
          </button>
        </DialogTrigger>

        <DialogContent
          className="
            max-w-4xl max-h-[90vh] p-6 
            bg-white dark:bg-gray-900 
            border dark:border-gray-700
            rounded-xl
          "
        >
          <div className="flex flex-col items-center gap-6">
            {/* Title */}
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 text-center">
              {alt}
            </h3>

            {/* Image Container */}
            <div
              className="
              flex-1 flex items-center justify-center 
              bg-gray-50 dark:bg-gray-800 
              rounded-lg p-4
              w-full
            "
            >
              <img
                src={imageSrc}
                alt={alt}
                className="
                  max-w-full max-h-[60vh] 
                  object-contain 
                  rounded-lg
                "
              />
            </div>

            {/* Download Button */}
            <Button
              onClick={handleDownload}
              className="
                bg-blue-600 hover:bg-blue-700 
                dark:bg-blue-700 dark:hover:bg-blue-600
                text-white px-6 py-2
              "
            >
              <Icon icon="heroicons:arrow-down-tray" className="h-4 w-4 mr-2" />
              {t("Download Image")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
