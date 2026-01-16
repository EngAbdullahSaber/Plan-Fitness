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
  name: string;
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
        toast.error("Category not found");
      }
    } catch (error: any) {
      console.error("Error fetching category:", error);
      toast.error("Failed to load category data");
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
            "Category updated successfully",
        );

        // Redirect to category blogs page
        router.push("/category");
      } else {
        toast.error(
          response?.data?.message ||
            response?.message ||
            "Failed to update category",
        );
      }
    } catch (error: any) {
      console.error("Error updating category:", error);
      toast.error(error.response?.data?.message || "Failed to update category");
    } finally {
      setIsSubmitting(false);
    }
  };

  const fields = [
    [
      {
        name: "name",
        label: "Category Name (English)",
        type: "text",
        placeholder: "Enter category name in English",
        required: true,
        validation: {
          englishOnly: true,
          minLength: 2,
          maxLength: 100,
          custom: (value) => {
            if (!value || value.trim() === "")
              return "Category name is required";
            if (value.length < 2)
              return "Category name must be at least 2 characters";
            if (value.length > 100)
              return "Category name must be less than 100 characters";
            return null;
          },
        },
      },
      {
        name: "nameAr",
        label: "Category Name (Arabic)",
        type: "text",
        placeholder: "أدخل اسم الفئة بالعربية",
        required: true,
        validation: {
          arabicOnly: true,
          minLength: 2,
          maxLength: 100,
          custom: (value) => {
            if (!value || value.trim() === "")
              return "Category name in Arabic is required";
            if (value.length < 2)
              return "Category name must be at least 2 characters";
            if (value.length > 100)
              return "Category name must be less than 100 characters";
            return null;
          },
        },
      },
    ],
  ];

  const sections = [
    {
      title: "Category Information",
      icon: "heroicons:tag",
      description: "Update the category name in both English and Arabic",
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
          <p className="text-gray-600">Loading category data...</p>
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
          <p className="text-gray-600 mb-4">Failed to load category data</p>
          <Button onClick={handleCancel}>Go Back</Button>
        </div>
      </div>
    );
  }

  // Prepare initial data for the form
  const initialData = {
    id: categoryData.id || categoryId,
    name: categoryData.name.english || "",
    nameAr: categoryData.name.arabic || "",
  };

  console.log("Initial data for form:", initialData);

  return (
    <div className="space-y-4">
      {/* Back Button */}
      <div className="space-y-2">
        <Button
          onClick={handleCancel}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-gray-100 to-gray-200 border border-gray-300 rounded-xl text-gray-800 font-semibold hover:from-gray-200 hover:to-gray-300 hover:shadow-md transition-all duration-200 mb-4"
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
          {t("Back")}
        </Button>
      </div>

      <GenericUpdateForm
        title="Update Category"
        description="Update the category information"
        initialData={initialData}
        fields={fields}
        sections={sections}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        showIdField={true}
        idFieldLabel="Category ID"
        submitButtonText="Update Category"
        cancelButtonText="Cancel"
        isLoading={isSubmitting}
      />
    </div>
  );
};

export default CategoryUpdateForm;
