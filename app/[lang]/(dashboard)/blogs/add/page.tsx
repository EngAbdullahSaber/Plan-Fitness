"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter, useParams } from "next/navigation";
import {
  GetSpecifiedMethod,
  CreateMethodFormData,
  GetPanigationMethod,
} from "@/app/services/apis/ApiMethod";
import toast from "react-hot-toast";
import { useTranslate } from "@/config/useTranslation";
import { usePaginatedSelect } from "@/hooks/usePaginatedSelect";
import GenericCreateForm from "../../shared/GenericCreateForm";

interface Blog {
  id: string;
  title: string;
  description: string;
  image: string;
  categoryId: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
  Category?: {
    id: string;
    name: string;
    nameAr: string;
  };
}

const BlogsCreateForm = () => {
  const router = useRouter();
  const { lang, blogId } = useParams(); // Get blogId from params
  const { t } = useTranslate();
  const [blogData, setBlogData] = useState<Blog | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch categories for dropdown using usePaginatedSelect hook
  const categoriesPaginated = usePaginatedSelect({
    fetchFunction: async (page, pageSize, search = "") => {
      console.log(
        `Fetching categories page ${page}, size ${pageSize}, search: "${search}"`,
      );
      const response = await GetPanigationMethod(
        "category",
        page,
        pageSize,
        lang,
        search,
      );
      console.log("Categories API response:", response);
      return response.data || response;
    },
    transformData: (data) => {
      console.log("Transforming data:", data);
      const items = data.data || data.items || data || [];
      const transformed = items.map((category: any) => ({
        value: category.id.toString(),
        label: lang === "ar" ? category.name.arabic : category.name.english,
      }));
      console.log("Transformed categories:", transformed);
      return transformed;
    },
  });

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = ["image/jpeg", "image/jpg", "image/png"];
      if (!validTypes.includes(file.type)) {
        toast.error("Please select a valid image file (JPEG, PNG )");
        return;
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        toast.error("Image size should be less than 5MB");
        return;
      }

      setSelectedImage(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (data: Record<string, any>) => {
    try {
      setIsSubmitting(true);

      // Create FormData to handle file upload
      const formData = new FormData();

      formData.append("image", selectedImage);
      formData.append("englishTitle", data.englishTitle);
      formData.append("arabicTitle", data.arabicTitle);
      formData.append("englishDescription", data.englishDescription);
      formData.append("arabicDescription", data.arabicDescription);
      formData.append("categoryId", data.categoryId);
      formData.append("status", data.status ? "ACTIVE" : "ARCHIVED");

      // Append the blog data as JSON string
      formData.append("data", JSON.stringify(blogData));

      // Call the API to Create Blog
      const response = await CreateMethodFormData(
        `blog`,
        formData,
        blogId,
        lang,
      );

      console.log("API Response:", response);

      // Handle response based on your API structure
      if (response?.data?.code === 200 || response?.code === 200) {
        toast.success(
          response.data?.message ||
            response.message ||
            "Blog created successfully",
        );

        // Redirect to blogs list page
        router.push("/blogs");
      } else {
        toast.error(
          response?.data?.message ||
            response?.message ||
            "Failed to Create blog",
        );
      }
    } catch (error: any) {
      console.error("Error updating blog:", error);
      toast.error(error.response?.data?.message || "Failed to Create blog");
    } finally {
      setIsSubmitting(false);
    }
  };

  const fields = [
    [
      {
        name: "englishTitle",
        label: "Blog Title (English)",
        type: "text",
        placeholder: "Enter blog title in English",
        required: true,
        validation: {
          minLength: 2,
          maxLength: 200,
          custom: (value) => {
            if (!value || value.trim() === "") return "Blog title is required";
            if (value.length < 2)
              return "Blog title must be at least 2 characters";
            if (value.length > 200)
              return "Blog title must be less than 200 characters";
            return null;
          },
        },
      },
      {
        name: "arabicTitle",
        label: "Blog Title (Arabic)",
        type: "text",
        placeholder: "أدخل عنوان المدونة بالعربية",
        required: true,
        validation: {
          minLength: 2,
          maxLength: 200,
          custom: (value) => {
            if (!value || value.trim() === "")
              return "Blog title in Arabic is required";
            if (value.length < 2)
              return "Blog title must be at least 2 characters";
            if (value.length > 200)
              return "Blog title must be less than 200 characters";
            return null;
          },
        },
      },
    ],
    [
      {
        name: "englishDescription",
        label: "Blog Description (English)",
        type: "textarea",
        placeholder: "Enter blog description in English",
        required: true,
        rows: 4,
        validation: {
          minLength: 10,
          maxLength: 1000,
          custom: (value) => {
            if (!value || value.trim() === "")
              return "Blog description is required";
            if (value.length < 10)
              return "Blog description must be at least 10 characters";
            if (value.length > 1000)
              return "Blog description must be less than 1000 characters";
            return null;
          },
        },
      },
      {
        name: "arabicDescription",
        label: "Blog Description (Arabic)",
        type: "textarea",
        placeholder: "أدخل وصف المدونة بالعربية",
        required: true,
        rows: 4,
        validation: {
          minLength: 10,
          maxLength: 1000,
          custom: (value) => {
            if (!value || value.trim() === "")
              return "Blog description in Arabic is required";
            if (value.length < 10)
              return "Blog description must be at least 10 characters";
            if (value.length > 1000)
              return "Blog description must be less than 1000 characters";
            return null;
          },
        },
      },
    ],
    [
      {
        name: "categoryId",
        label: "Category",
        type: "selectPagination",
        required: true,
        placeholder: "Select category...",
        paginationOptions: {
          data: categoriesPaginated.options || [],
          isLoading: categoriesPaginated.isLoading,
          hasMore: categoriesPaginated.hasMore,
          searchTerm: categoriesPaginated.searchTerm,
          onLoadMore: categoriesPaginated.loadMore,
          onSearch: categoriesPaginated.handleSearch,
          onOpen: categoriesPaginated.loadInitial,
          getOptionLabel: (category: any) => category.label,
          getOptionValue: (category: any) => category.value,
          searchPlaceholder: "Search categories...",
        },
      },
      {
        name: "status",
        label: "Status",
        type: "switch",
        required: true,
        validation: {
          custom: (value) => {
            // Switch always returns a boolean, so no need for validation
            return null;
          },
        },
      },
    ],
    [
      {
        name: "image",
        label: "Blog Image",
        type: "image",
        required: false, // Not required for Create since we might keep the existing image
        accept: "image/jpeg,image/jpg,image/png", // Dynamic accept
        description:
          "Supported formats: JPEG, PNG, WebP. Max size: 5MB. Leave empty to keep current image.",
        onChange: handleImageChange,
        validation: {
          maxFileSize: 5 * 1024 * 1024, // 5MB
          allowedTypes: ["image/jpeg", "image/jpg", "image/png"],
          custom: (value) => {
            // No validation needed since image is optional for Create
            return null;
          },
        },
      },
    ],
  ];

  const sections = [
    {
      title: "Blog Title",
      icon: "heroicons:document-text",
      description: "Create the blog title in both English and Arabic",
    },
    {
      title: "Blog Description",
      icon: "heroicons:document-text",
      description: "Create the blog description in both English and Arabic",
    },
    {
      title: "Category & Status",
      icon: "heroicons:tag",
      description: "Create the category and blog status",
    },
    {
      title: "Blog Image",
      icon: "heroicons:photograph",
      description: "Create the featured image for the blog (optional)",
    },
  ];

  const handleCancel = () => {
    router.back();
  };

  // Prepare initial data for the form
  const initialData = {
    id: "",
    englishTitle: "",
    image: "",
    arabicTitle: "",
    englishDescription: "",
    arabicDescription: "",
    categoryId: "",
    status: "ACTIVE", // Convert string to boolean for switch
  };

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

      <GenericCreateForm
        title="Create Blog"
        description="Create the blog information"
        initialData={initialData}
        fields={fields}
        sections={sections}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        showIdField={true}
        idFieldLabel="Blog ID"
        submitButtonText="Create Blog"
        cancelButtonText="Cancel"
        isLoading={categoriesPaginated.isLoading || isSubmitting}
        submitButtonProps={{
          disabled: isSubmitting,
        }}
      />
    </div>
  );
};

export default BlogsCreateForm;
