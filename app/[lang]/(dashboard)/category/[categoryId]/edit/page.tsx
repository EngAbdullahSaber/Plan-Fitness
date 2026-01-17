"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter, useParams } from "next/navigation";
import {
  GetSpecifiedMethod,
  UpdateMethod,
} from "@/app/services/apis/ApiMethod";
import toast from "react-hot-toast";
import { useTranslate } from "@/config/useTranslation";
import GenericUpdateForm from "../../../shared/GenericUpdateForm";

interface Category {
  id: string;
  name: {
    english: string;
    arabic: string;
  };
  nameAr: string;
  createdAt?: string;
  updatedAt?: string;
}

const CategoryUpdateForm = () => {
  const router = useRouter();
  const { lang, categoryId } = useParams(); // Get categoryId from params
  const { t } = useTranslate();
  const [categoryData, setCategoryData] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch category data from API
  const fetchCategory = async () => {
    try {
      setIsLoading(true);

      const response = await GetSpecifiedMethod(`category/${categoryId}`, lang);

      if (response.data) {
        setCategoryData(response.data.data);
      } else {
        toast.error(t("CATEGORY_NOT_FOUND"));
      }
    } catch (error: any) {
      console.error("Error fetching category:", error);
      toast.error(t("FAILED_TO_LOAD_CATEGORY_DATA"));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (categoryId) {
      fetchCategory();
    }
  }, [categoryId, lang]);

  const handleSubmit = async (data: Record<string, any>) => {
    try {
      setIsSubmitting(true);

      // Prepare the data for API - only send name and nameAr
      const updateData = {
        name: data.name,
        nameAr: data.nameAr,
      };

      // Call the API to update category
      const response = await UpdateMethod(
        `category`,
        updateData,
        categoryId,
        lang,
      );

      // Handle response based on your API structure
      if (response?.data?.code === 200 || response?.code === 200) {
        toast.success(
          response.data?.message ||
            response.message ||
            t("CATEGORY_UPDATED_SUCCESSFULLY"),
        );

        // Redirect to category blogs page
        router.push("/category");
      } else {
        toast.error(
          response?.data?.message ||
            response?.message ||
            t("FAILED_TO_UPDATE_CATEGORY"),
        );
      }
    } catch (error: any) {
      console.error("Error updating category:", error);
      toast.error(
        error.response?.data?.message || t("FAILED_TO_UPDATE_CATEGORY"),
      );
    } finally {
      setIsSubmitting(false);
    }
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
      description: t("CATEGORY_INFORMATION_UPDATE_DESCRIPTION"),
    },
  ];

  const handleCancel = () => {
    router.back();
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#25235F] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">{t("LOADING_CATEGORY_DATA")}</p>
        </div>
      </div>
    );
  }

  // Show error state if no data
  if (!categoryData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <p className="text-gray-600 mb-4">
            {t("FAILED_TO_LOAD_CATEGORY_DATA")}
          </p>
          <Button onClick={handleCancel}>{t("GO_BACK")}</Button>
        </div>
      </div>
    );
  }

  // Prepare initial data for the form
  const initialData = {
    id: categoryData.id || categoryId,
    name: categoryData.name?.english || "",
    nameAr: categoryData.name?.arabic || "",
  };

  console.log("Initial data for form:", initialData);

  return (
    <div className="space-y-4">
      {/* Back Button */}
      <div className="space-y-2">
        <Button
          onClick={handleCancel}
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

      <GenericUpdateForm
        title={t("UPDATE_CATEGORY")}
        description={t("UPDATE_CATEGORY_DESCRIPTION")}
        initialData={initialData}
        fields={fields}
        sections={sections}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        showIdField={true}
        idFieldLabel={t("CATEGORY_ID")}
        submitButtonText={t("UPDATE_CATEGORY_BUTTON")}
        cancelButtonText={t("CANCEL")}
        isLoading={isSubmitting}
      />
    </div>
  );
};

export default CategoryUpdateForm;
