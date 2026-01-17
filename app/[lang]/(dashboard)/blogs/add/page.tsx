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
        toast.error(t("INVALID_IMAGE_FILE"));
        return;
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        toast.error(t("IMAGE_SIZE_LIMIT"));
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
            t("BLOG_CREATED_SUCCESSFULLY"),
        );

        // Redirect to blogs list page
        router.push("/blogs");
      } else {
        toast.error(
          response?.data?.message ||
            response?.message ||
            t("FAILED_TO_CREATE_BLOG"),
        );
      }
    } catch (error: any) {
      console.error("Error updating blog:", error);
      toast.error(error.response?.data?.message || t("FAILED_TO_CREATE_BLOG"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const fields = [
    [
      {
        name: "englishTitle",
        label: t("BLOG_TITLE_ENGLISH"),
        type: "text",
        placeholder: t("ENTER_BLOG_TITLE_ENGLISH"),
        required: true,
        validation: {
          minLength: 2,
          maxLength: 200,
          custom: (value) => {
            if (!value || value.trim() === "") return t("BLOG_TITLE_REQUIRED");
            if (value.length < 2) return t("BLOG_TITLE_MIN_LENGTH");
            if (value.length > 200) return t("BLOG_TITLE_MAX_LENGTH");
            return null;
          },
        },
      },
      {
        name: "arabicTitle",
        label: t("BLOG_TITLE_ARABIC"),
        type: "text",
        placeholder: t("ENTER_BLOG_TITLE_ARABIC"),
        required: true,
        validation: {
          minLength: 2,
          maxLength: 200,
          custom: (value) => {
            if (!value || value.trim() === "")
              return t("BLOG_TITLE_ARABIC_REQUIRED");
            if (value.length < 2) return t("BLOG_TITLE_MIN_LENGTH");
            if (value.length > 200) return t("BLOG_TITLE_MAX_LENGTH");
            return null;
          },
        },
      },
    ],
    [
      {
        name: "englishDescription",
        label: t("BLOG_DESCRIPTION_ENGLISH"),
        type: "textarea",
        placeholder: t("ENTER_BLOG_DESCRIPTION_ENGLISH"),
        required: true,
        rows: 4,
        validation: {
          minLength: 10,
          maxLength: 1000,
          custom: (value) => {
            if (!value || value.trim() === "")
              return t("BLOG_DESCRIPTION_REQUIRED");
            if (value.length < 10) return t("BLOG_DESCRIPTION_MIN_LENGTH");
            if (value.length > 1000) return t("BLOG_DESCRIPTION_MAX_LENGTH");
            return null;
          },
        },
      },
      {
        name: "arabicDescription",
        label: t("BLOG_DESCRIPTION_ARABIC"),
        type: "textarea",
        placeholder: t("ENTER_BLOG_DESCRIPTION_ARABIC"),
        required: true,
        rows: 4,
        validation: {
          minLength: 10,
          maxLength: 1000,
          custom: (value) => {
            if (!value || value.trim() === "")
              return t("BLOG_DESCRIPTION_ARABIC_REQUIRED");
            if (value.length < 10) return t("BLOG_DESCRIPTION_MIN_LENGTH");
            if (value.length > 1000) return t("BLOG_DESCRIPTION_MAX_LENGTH");
            return null;
          },
        },
      },
    ],
    [
      {
        name: "categoryId",
        label: t("CATEGORY"),
        type: "selectPagination",
        required: true,
        placeholder: t("SELECT_CATEGORY"),
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
          searchPlaceholder: t("SEARCH_CATEGORIES"),
        },
      },
      {
        name: "status",
        label: t("STATUS"),
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
        label: t("BLOG_IMAGE"),
        type: "image",
        required: false, // Not required for Create since we might keep the existing image
        accept: "image/jpeg,image/jpg,image/png",
        description: t("IMAGE_UPLOAD_DESCRIPTION"),
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
      title: t("BLOG_TITLE"),
      icon: "heroicons:document-text",
      description: t("BLOG_TITLE_DESCRIPTION"),
    },
    {
      title: t("BLOG_DESCRIPTION"),
      icon: "heroicons:document-text",
      description: t("BLOG_DESCRIPTION_DESCRIPTION"),
    },
    {
      title: t("CATEGORY_STATUS"),
      icon: "heroicons:tag",
      description: t("CATEGORY_STATUS_DESCRIPTION"),
    },
    {
      title: t("BLOG_IMAGE_HEADER"),
      icon: "heroicons:photograph",
      description: t("BLOG_IMAGE_DESCRIPTION"),
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
    status: "ACTIVE",
  };

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

      <GenericCreateForm
        title={t("CREATE_BLOG")}
        description={t("CREATE_BLOG_DESCRIPTION")}
        initialData={initialData}
        fields={fields}
        sections={sections}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        showIdField={true}
        idFieldLabel={t("BLOG_ID")}
        submitButtonText={t("CREATE_BLOG_BUTTON")}
        cancelButtonText={t("CANCEL")}
        isLoading={categoriesPaginated.isLoading || isSubmitting}
        submitButtonProps={{
          disabled: isSubmitting,
        }}
      />
    </div>
  );
};

export default BlogsCreateForm;
