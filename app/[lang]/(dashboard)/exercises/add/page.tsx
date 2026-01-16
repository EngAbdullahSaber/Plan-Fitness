"use client";
import React, { useState, useMemo } from "react";
import GenericCreateForm from "../../shared/GenericCreateForm";
import { Button } from "@/components/ui/button";
import { useRouter, useParams } from "next/navigation";
import {
  CreateMethod,
  GetPanigationMethod,
} from "@/app/services/apis/ApiMethod";
import toast from "react-hot-toast";
import { useTranslate } from "@/config/useTranslation";
import { usePaginatedSelect } from "@/hooks/usePaginatedSelect";

const ExerciseCreateForm = ({ onClose }: { onClose?: () => void }) => {
  const router = useRouter();
  const { lang } = useParams();
  const { t } = useTranslate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [inputType, setInputType] = useState<"duration" | "count">("duration");
  const [formData, setFormData] = useState<any>({}); // Add formData state

  // ✅ Fetch categories for dropdown using paginated hook
  const categoriesPaginated = usePaginatedSelect({
    fetchFunction: async (page, pageSize, search = "") => {
      const response = await GetPanigationMethod(
        "category",
        page,
        pageSize,
        lang,
        search,
      );
      return response.data || response;
    },
    transformData: (data) => {
      const items = data.data || data.items || data || [];
      return items.map((category: any) => ({
        value: category.id.toString(),
        label: lang === "ar" ? category.name.arabic : category.name.english,
      }));
    },
  });

  // ✅ Handle form submission
  const handleSubmit = async (data: Record<string, any>) => {
    try {
      setIsSubmitting(true);

      const exerciseData = {
        categoryId: parseInt(data.categoryId),
        title: {
          arabic: data.arabicTitle,
          english: data.englishTitle,
        },
        description: {
          arabic: data.arabicDescription,
          english: data.englishDescription,
        },
        url: data.url,
        videoUrl: data.videoUrl,
        count: inputType === "count" ? parseInt(data.count) : null,
        duration: inputType === "duration" ? parseInt(data.duration) : null,
        difficulty: data.difficulty,
        status: data.status ? "Active" : "Inactive",
        calory: parseInt(data.calories),
      };

      const response = await CreateMethod(
        "training/create",
        exerciseData,
        lang,
      );

      if (response?.data?.code === 200 || response?.code === 200) {
        toast.success(
          response.data?.message ||
            response.message ||
            "Exercise created successfully",
        );
        if (onClose) onClose();
        else router.push("/exercises");
      } else {
        toast.error(
          response?.data?.message ||
            response?.message ||
            "Failed to create exercise",
        );
      }
    } catch (error: any) {
      console.error("Error creating exercise:", error);
      toast.error(error.response?.data?.message || "Failed to create exercise");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ✅ Handle form data changes
  const handleFormDataChange = (data: Record<string, any>) => {
    setFormData(data);

    // Update inputType when the select field changes
    if (data.inputType && data.inputType !== inputType) {
      setInputType(data.inputType as "duration" | "count");
    }
  };

  // ✅ Initial form values
  const initialData = {
    englishTitle: "",
    arabicTitle: "",
    englishDescription: "",
    arabicDescription: "",
    categoryId: "",
    videoUrl: "",
    url: "",
    count: "",
    duration: "",
    difficulty: "BEGINNER",
    status: true,
    calories: "",
    inputType: "duration",
  };

  const difficultyOptions = [
    { value: "BEGINNER", label: "Beginner" },
    { value: "INTERMEDIATE", label: "Intermediate" },
    { value: "ADVANCED", label: "Advanced" },
  ];

  // ✅ Dynamic fields — show both duration and count but disable based on inputType
  const fields = useMemo(
    () => [
      // Title Fields
      [
        {
          name: "englishTitle",
          label: "Exercise Title (English)",
          type: "text",
          placeholder: "Enter exercise title in English",
          required: true,
        },
        {
          name: "arabicTitle",
          label: "Exercise Title (Arabic)",
          type: "text",
          placeholder: "أدخل عنوان التمرين بالعربية",
          required: true,
        },
      ],

      // Description Fields
      [
        {
          name: "englishDescription",
          label: "Exercise Description (English)",
          type: "textarea",
          placeholder: "Enter exercise description in English",
          required: true,
        },
        {
          name: "arabicDescription",
          label: "Exercise Description (Arabic)",
          type: "textarea",
          placeholder: "أدخل وصف التمرين بالعربية",
          required: true,
        },
      ],

      // Category & Difficulty
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
            getOptionLabel: (c: any) => c.label,
            getOptionValue: (c: any) => c.value,
          },
        },
        {
          name: "difficulty",
          label: "Difficulty Level",
          type: "select",
          required: true,
          options: difficultyOptions,
          placeholder: "Select difficulty...",
        },
      ],

      // Video URL & Exercise Type
      [
        {
          name: "videoUrl",
          label: "Video URL",
          type: "url",
          placeholder: "https://example.com/training-video",
          required: true,
        },
        {
          name: "url",
          label: "URL Of Image",
          type: "url",
          placeholder: "https://example.com/training-image",
          required: true,
        },
      ],
      // Calories
      [
        {
          name: "calories",
          label: "Calories Burned",
          type: "number",
          placeholder: "300",
          required: true,
        },
        // Empty field to maintain grid structure
        {
          name: "inputType",
          label: "Exercise Type",
          type: "select",
          required: true,
          options: [
            { value: "duration", label: "Duration-based (seconds)" },
            { value: "count", label: "Count-based (repetitions)" },
          ],
          placeholder: "Select exercise type...",
          defaultValue: "duration",
        },
      ],

      // Duration and Count fields - both shown but one disabled
      [
        {
          name: "duration",
          label: "Duration (seconds)",
          type: "number",
          placeholder: "60",
          required: inputType === "duration", // Only required if duration-based
          disabled: inputType === "count", // Disabled if count-based
          description:
            inputType === "count"
              ? "Disabled for count-based exercises"
              : undefined,
        },
        {
          name: "count",
          label: "Repetition Count",
          type: "number",
          placeholder: "10",
          required: inputType === "count", // Only required if count-based
          disabled: inputType === "duration", // Disabled if duration-based
          description:
            inputType === "duration"
              ? "Disabled for duration-based exercises"
              : undefined,
        },
      ],

      // Status
      [
        {
          name: "status",
          label: "Status",
          type: "switch",
          required: false,
        },
      ],
    ],
    [
      inputType,
      categoriesPaginated.options,
      categoriesPaginated.isLoading,
      categoriesPaginated.hasMore,
      categoriesPaginated.searchTerm,
    ],
  );

  // ✅ Dynamic section titles
  const sections = useMemo(
    () => [
      {
        title: "Exercise Title",
        icon: "heroicons:document-text",
        description: "Enter the exercise title in both English and Arabic",
      },
      {
        title: "Exercise Description",
        icon: "heroicons:document-text",
        description:
          "Enter the exercise description in both English and Arabic",
      },
      {
        title: "Category & Difficulty",
        icon: "heroicons:tag",
        description: "Select a category and set the difficulty level",
      },
      {
        title: "Video & Exercise Type",
        icon: "heroicons:video-camera",
        description:
          "Add video URL and select exercise type (duration or count)",
      },
      {
        title: "Exercise Values & Calories",
        icon: "heroicons:clock",
        description:
          inputType === "duration"
            ? "Set duration in seconds (count is disabled for duration-based exercises)"
            : "Set repetition count (duration is disabled for count-based exercises)",
      },
      {
        title: "Status",
        icon: "heroicons:check-circle",
        description: "Set exercise status",
      },
    ],
    [inputType],
  );

  return (
    <div className="space-y-6">
      {/* ✅ Back Button */}
      <div className="space-y-2">
        <Button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-gray-100 to-gray-200 border border-gray-300 rounded-xl text-gray-800 font-semibold hover:from-gray-200 hover:to-gray-300 hover:shadow-md transition-all duration-200 mb-4"
          disabled={isSubmitting}
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

      {/* ✅ Generic Create Form */}
      <GenericCreateForm
        title="Add New Exercise"
        description="Create a new exercise by providing multilingual titles, category, type, and duration or count."
        initialData={initialData}
        fields={fields}
        sections={sections}
        onSubmit={handleSubmit}
        onFormDataChange={handleFormDataChange} // Add this prop
        onCancel={onClose}
        submitButtonText="Create Exercise"
        cancelButtonText="Cancel"
        isLoading={categoriesPaginated.isLoading || isSubmitting}
        submitButtonProps={{
          disabled: isSubmitting,
        }}
      />
    </div>
  );
};

export default ExerciseCreateForm;
