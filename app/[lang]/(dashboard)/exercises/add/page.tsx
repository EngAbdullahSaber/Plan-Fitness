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
            t("EXERCISE_CREATED_SUCCESSFULLY"),
        );
        if (onClose) onClose();
        else router.push("/exercises");
      } else {
        toast.error(
          response?.data?.message ||
            response?.message ||
            t("FAILED_TO_CREATE_EXERCISE"),
        );
      }
    } catch (error: any) {
      console.error("Error creating exercise:", error);
      toast.error(
        error.response?.data?.message || t("FAILED_TO_CREATE_EXERCISE"),
      );
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
    { value: "BEGINNER", label: t("BEGINNER") },
    { value: "INTERMEDIATE", label: t("INTERMEDIATE") },
    { value: "ADVANCED", label: t("ADVANCED") },
  ];

  // ✅ Dynamic fields — show both duration and count but disable based on inputType
  const fields = useMemo(
    () => [
      // Title Fields
      [
        {
          name: "englishTitle",
          label: t("EXERCISE_TITLE_ENGLISH"),
          type: "text",
          placeholder: t("ENTER_EXERCISE_TITLE_ENGLISH"),
          required: true,
        },
        {
          name: "arabicTitle",
          label: t("EXERCISE_TITLE_ARABIC"),
          type: "text",
          placeholder: t("ENTER_EXERCISE_TITLE_ARABIC"),
          required: true,
        },
      ],

      // Description Fields
      [
        {
          name: "englishDescription",
          label: t("EXERCISE_DESCRIPTION_ENGLISH"),
          type: "textarea",
          placeholder: t("ENTER_EXERCISE_DESCRIPTION_ENGLISH"),
          required: true,
        },
        {
          name: "arabicDescription",
          label: t("EXERCISE_DESCRIPTION_ARABIC"),
          type: "textarea",
          placeholder: t("ENTER_EXERCISE_DESCRIPTION_ARABIC"),
          required: true,
        },
      ],

      // Category & Difficulty
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
            getOptionLabel: (c: any) => c.label,
            getOptionValue: (c: any) => c.value,
          },
        },
        {
          name: "difficulty",
          label: t("DIFFICULTY_LEVEL"),
          type: "select",
          required: true,
          options: difficultyOptions,
          placeholder: t("SELECT_DIFFICULTY"),
        },
      ],

      // Video URL & Exercise Type
      [
        {
          name: "videoUrl",
          label: t("VIDEO_URL"),
          type: "url",
          placeholder: t("VIDEO_URL_PLACEHOLDER"),
          required: true,
        },
        {
          name: "url",
          label: t("IMAGE_URL"),
          type: "url",
          placeholder: t("IMAGE_URL_PLACEHOLDER"),
          required: true,
        },
      ],
      // Calories
      [
        {
          name: "calories",
          label: t("CALORIES_BURNED"),
          type: "number",
          placeholder: t("CALORIES_PLACEHOLDER"),
          required: true,
        },
        // Empty field to maintain grid structure
        {
          name: "inputType",
          label: t("EXERCISE_TYPE"),
          type: "select",
          required: true,
          options: [
            { value: "duration", label: t("DURATION_BASED") },
            { value: "count", label: t("COUNT_BASED") },
          ],
          placeholder: t("SELECT_EXERCISE_TYPE"),
          defaultValue: "duration",
        },
      ],

      // Duration and Count fields - both shown but one disabled
      [
        {
          name: "duration",
          label: t("DURATION_SECONDS"),
          type: "number",
          placeholder: t("DURATION_PLACEHOLDER"),
          required: inputType === "duration", // Only required if duration-based
          disabled: inputType === "count", // Disabled if count-based
          description:
            inputType === "count" ? t("DISABLED_FOR_COUNT_BASED") : undefined,
        },
        {
          name: "count",
          label: t("REPETITION_COUNT"),
          type: "number",
          placeholder: t("REPETITION_PLACEHOLDER"),
          required: inputType === "count", // Only required if count-based
          disabled: inputType === "duration", // Disabled if duration-based
          description:
            inputType === "duration"
              ? t("DISABLED_FOR_DURATION_BASED")
              : undefined,
        },
      ],

      // Status
      [
        {
          name: "status",
          label: t("STATUS"),
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
      t,
    ],
  );

  // ✅ Dynamic section titles
  const sections = [
    {
      title: t("BASIC_INFORMATION"),
      icon: "heroicons:document-text",
      description: t("EXERCISE_TITLE_DESCRIPTION"),
      fieldsCount: 2, // englishTitle, arabicTitle
    },
    {
      title: t("DESCRIPTION"),
      icon: "heroicons:pencil-square",
      description: t("EXERCISE_DESCRIPTION_DESCRIPTION"),
      fieldsCount: 2, // englishDescription, arabicDescription
    },
    {
      title: t("CATEGORY_DIFFICULTY"),
      icon: "heroicons:tag",
      description: t("CATEGORY_DIFFICULTY_DESCRIPTION"),
      fieldsCount: 2, // categoryId, difficulty
    },
    {
      title: t("MEDIA_URLS"),
      icon: "heroicons:video-camera",
      description: t("MEDIA_URLS_DESCRIPTION"),
      fieldsCount: 2, // videoUrl, url (image)
    },
    {
      title: t("EXERCISE_METRICS"),
      icon: "heroicons:fire",
      description: t("EXERCISE_METRICS_DESCRIPTION"),
      fieldsCount: 2, // calories, inputType
    },
    {
      title:
        inputType === "duration" ? t("DURATION_SETTINGS") : t("COUNT_SETTINGS"),
      icon:
        inputType === "duration" ? "heroicons:clock" : "heroicons:arrow-path",
      description:
        inputType === "duration"
          ? t("DURATION_SETTINGS_DESCRIPTION")
          : t("COUNT_SETTINGS_DESCRIPTION"),
      fieldsCount: 2, // duration, count
    },
    {
      title: t("STATUS"),
      icon: "heroicons:check-circle",
      description: t("STATUS_DESCRIPTION"),
      fieldsCount: 1, // status
    },
  ];

  return (
    <div className="space-y-6">
      {/* ✅ Back Button */}
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
          {t("BACK")}
        </Button>
      </div>

      {/* ✅ Generic Create Form */}
      <GenericCreateForm
        title={t("ADD_NEW_EXERCISE")}
        description={t("ADD_NEW_EXERCISE_DESCRIPTION")}
        initialData={initialData}
        fields={fields}
        sections={sections}
        onSubmit={handleSubmit}
        onFormDataChange={handleFormDataChange} // Add this prop
        onCancel={onClose}
        submitButtonText={t("CREATE_EXERCISE")}
        cancelButtonText={t("CANCEL")}
        isLoading={categoriesPaginated.isLoading || isSubmitting}
        submitButtonProps={{
          disabled: isSubmitting,
        }}
      />
    </div>
  );
};

export default ExerciseCreateForm;
