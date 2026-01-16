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
            "Category created successfully",
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
            "Failed to create category",
        );
      }
    } catch (error: any) {
      console.error("Error creating category:", error);
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
        label: "Category Name (English)",
        type: "text",
        placeholder: "Enter category name in English",
        required: true,

        validation: {
          englishOnly: true, // New validation
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
          arabicOnly: true, // New validation
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
      description: "Enter the category name in both English and Arabic",
    },
  ];

  return (
    <div className="space-y-4">
      {/* Back Button */}
      <div className="space-y-2">
        <Button
          onClick={() => router.back()}
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

      <GenericCreateForm
        title="Add New Category"
        description="Create a new category by providing names in both English and Arabic"
        initialData={initialData}
        fields={fields}
        sections={sections}
        onSubmit={handleSubmit}
        onCancel={onClose}
        submitButtonText="Create Category"
        cancelButtonText="Cancel"
      />
    </div>
  );
};

export default CategoryCreateForm;
