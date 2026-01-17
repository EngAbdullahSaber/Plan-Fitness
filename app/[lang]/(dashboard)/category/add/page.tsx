"use client";
import React from "react";
import GenericCreateForm from "../../shared/GenericCreateForm";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { CreateMethod } from "@/app/services/apis/ApiMethod";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";
import { useTranslate } from "@/config/useTranslation";

const CategoryCreateForm = ({ onClose }: { onClose?: () => void }) => {
  const router = useRouter();
  const { lang } = useParams();
  const { t } = useTranslate();

  const handleSubmit = async (data: Record<string, any>) => {
    try {
      // Prepare the data for API - only send name and nameAr
      const categoryData = {
        name: data.name,
        nameAr: data.nameAr,
      };

      // Call the API to create category
      const response = await CreateMethod(
        "category/create",
        categoryData,
        lang,
      );

      // Handle response based on your API structure
      if (response?.data?.code === 200 || response?.code === 200) {
        toast.success(
          response.data?.message ||
            response.message ||
            t("CATEGORY_CREATED_SUCCESSFULLY"),
        );

        // Redirect or close the form
        if (onClose) {
          onClose();
        } else {
          router.push("/category"); // Adjust the route as needed
        }
      } else {
        toast.error(
          response?.data?.message ||
            response?.message ||
            t("FAILED_TO_CREATE_CATEGORY"),
        );
      }
    } catch (error: any) {
      console.error("Error creating category:", error);
      toast.error(t("FAILED_TO_CREATE_CATEGORY"));
    }
  };

  const initialData = {
    name: "",
    nameAr: "",
  };

  const fields = [
    [
      {
        name: "name",
        label: t("CATEGORY_NAME_ENGLISH"),
        type: "text",
        placeholder: t("ENTER_CATEGORY_NAME_ENGLISH"),
        required: true,
        validation: {
          englishOnly: true,
          minLength: 2,
          maxLength: 100,
          custom: (value) => {
            if (!value || value.trim() === "")
              return t("CATEGORY_NAME_REQUIRED");
            if (value.length < 2) return t("CATEGORY_NAME_MIN_LENGTH");
            if (value.length > 100) return t("CATEGORY_NAME_MAX_LENGTH");
            // Check if contains Arabic characters
            const arabicRegex = /[\u0600-\u06FF]/;
            if (arabicRegex.test(value)) {
              return t("ENGLISH_ONLY_ALLOWED");
            }
            return null;
          },
        },
      },
      {
        name: "nameAr",
        label: t("CATEGORY_NAME_ARABIC"),
        type: "text",
        placeholder: t("ENTER_CATEGORY_NAME_ARABIC"),
        required: true,
        validation: {
          arabicOnly: true,
          minLength: 2,
          maxLength: 100,
          custom: (value) => {
            if (!value || value.trim() === "")
              return t("CATEGORY_NAME_ARABIC_REQUIRED");
            if (value.length < 2) return t("CATEGORY_NAME_MIN_LENGTH");
            if (value.length > 100) return t("CATEGORY_NAME_MAX_LENGTH");
            // Check if contains non-Arabic characters (English letters)
            const englishRegex = /[a-zA-Z]/;
            if (englishRegex.test(value)) {
              return t("ARABIC_ONLY_ALLOWED");
            }
            return null;
          },
        },
      },
    ],
  ];

  const sections = [
    {
      title: t("CATEGORY_INFORMATION"),
      icon: "heroicons:tag",
      description: t("CATEGORY_INFORMATION_DESCRIPTION"),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Back Button */}
      <div className="space-y-2">
        <Button
          onClick={() => router.back()}
          className="
            inline-flex items-center gap-2 px-5 py-2.5 
            bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 
            border border-gray-300 dark:border-gray-700 
            rounded-xl 
            text-gray-800 dark:text-gray-200 
            font-semibold 
            hover:from-gray-200 hover:to-gray-300 dark:hover:from-gray-700 dark:hover:to-gray-800 
            hover:shadow-md dark:hover:shadow-gray-800/50 
            transition-all duration-200 mb-4
          "
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          {t("BACK")}
        </Button>
      </div>

      <GenericCreateForm
        title={t("ADD_NEW_CATEGORY")}
        description={t("ADD_NEW_CATEGORY_DESCRIPTION")}
        initialData={initialData}
        fields={fields}
        sections={sections}
        onSubmit={handleSubmit}
        onCancel={onClose}
        submitButtonText={t("CREATE_CATEGORY_BUTTON")}
        cancelButtonText={t("CANCEL")}
      />
    </div>
  );
};

export default CategoryCreateForm;
