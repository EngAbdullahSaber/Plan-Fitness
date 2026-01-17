"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter, useParams } from "next/navigation";
import {
  GetSpecifiedMethod,
  UpdateMethod,
  UpdateMethodFormData,
  GetPanigationMethod,
} from "@/app/services/apis/ApiMethod";
import toast from "react-hot-toast";
import { useTranslate } from "@/config/useTranslation";
import GenericUpdateForm from "../../../shared/GenericUpdateForm";
import { usePaginatedSelect } from "@/hooks/usePaginatedSelect";

interface Exercise {
  id: string;
  title: {
    english: string;
    arabic: string;
  };
  description: {
    english: string;
    arabic: string;
  };
  url: string;
  count: number | null;
  duration: number | null;
  difficulty: string;
  status: string;
  calory: number;
  categoryId: string;
  createdAt?: string;
  updatedAt?: string;
  Category?: {
    id: string;
    name: string;
    nameAr: string;
  };
}

const ExerciseUpdateForm = () => {
  const router = useRouter();
  const { lang, id } = useParams(); // Get id from params
  const { t } = useTranslate();
  const [exerciseData, setExerciseData] = useState<Exercise | null>(null);
  const [inputType, setInputType] = useState<"duration" | "count">("duration");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch categories for dropdown using usePaginatedSelect hook
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

  // Fetch exercise data from API
  const fetchExercise = async () => {
    try {
      setIsLoading(true);

      const response = await GetSpecifiedMethod(`training/${id}`, lang);

      if (response.data) {
        const exercise = response.data.data;

        setExerciseData(exercise);

        // Determine input type based on available data
        if (exercise.duration !== null && exercise.duration !== undefined) {
          setInputType("duration");
        } else if (exercise.count !== null && exercise.count !== undefined) {
          setInputType("count");
        }
      } else {
        toast.error("Exercise not found");
      }
    } catch (error: any) {
      console.error("Error fetching exercise:", error);
      toast.error("Failed to load exercise data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchExercise();
    }
    if (categoriesPaginated.loadInitial) {
      categoriesPaginated.loadInitial();
    }
  }, [id, lang]);

  const handleSubmit = async (data: Record<string, any>) => {
    try {
      setIsSubmitting(true);

      // Prepare exercise data according to the required structure
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

      console.log("Exercise data to update:", exerciseData);

      // Call the API to update Exercise
      const response = await UpdateMethod("training", exerciseData, id, lang);

      console.log("API Response:", response);

      // Handle response based on your API structure
      if (response?.data?.code === 200 || response?.code === 200) {
        toast.success(
          response.data?.message ||
            response.message ||
            "Exercise updated successfully",
        );

        // Redirect to exercises list page
        router.push("/exercises");
      } else {
        toast.error(
          response?.data?.message ||
            response?.message ||
            "Failed to update exercise",
        );
      }
    } catch (error: any) {
      console.error("Error updating exercise:", error);
      toast.error(error.response?.data?.message || "Failed to update exercise");
    } finally {
      setIsSubmitting(false);
    }
  };

  const difficultyOptions = [
    { value: "BEGINNER", label: "Beginner" },
    { value: "INTERMEDIATE", label: "Intermediate" },
    { value: "ADVANCED", label: "Advanced" },
  ];
  const fields = [
    [
      {
        name: "englishTitle",
        label: "Exercise Title (English)",
        type: "text",
        placeholder: "Enter exercise title in English",
        required: true,
        validation: {
          minLength: 2,
          maxLength: 100,
          custom: (value) => {
            if (!value || value.trim() === "")
              return "Exercise title is required";
            if (value.length < 2)
              return "Exercise title must be at least 2 characters";
            if (value.length > 100)
              return "Exercise title must be less than 100 characters";
            return null;
          },
        },
      },
      {
        name: "arabicTitle",
        label: "Exercise Title (Arabic)",
        type: "text",
        placeholder: "أدخل عنوان التمرين بالعربية",
        required: true,
        validation: {
          minLength: 2,
          maxLength: 100,
          custom: (value) => {
            if (!value || value.trim() === "")
              return "Exercise title in Arabic is required";
            if (value.length < 2)
              return "Exercise title must be at least 2 characters";
            if (value.length > 100)
              return "Exercise title must be less than 100 characters";
            return null;
          },
        },
      },
    ],
    [
      {
        name: "englishDescription",
        label: "Exercise Description (English)",
        type: "textarea",
        placeholder: "Enter exercise description in English",
        required: true,
        rows: 3,
        validation: {
          minLength: 10,
          maxLength: 500,
          custom: (value) => {
            if (!value || value.trim() === "")
              return "Exercise description is required";
            if (value.length < 10)
              return "Exercise description must be at least 10 characters";
            if (value.length > 500)
              return "Exercise description must be less than 500 characters";
            return null;
          },
        },
      },
      {
        name: "arabicDescription",
        label: "Exercise Description (Arabic)",
        type: "textarea",
        placeholder: "أدخل وصف التمرين بالعربية",
        required: true,
        rows: 3,
        validation: {
          minLength: 10,
          maxLength: 500,
          custom: (value) => {
            if (!value || value.trim() === "")
              return "Exercise description in Arabic is required";
            if (value.length < 10)
              return "Exercise description must be at least 10 characters";
            if (value.length > 500)
              return "Exercise description must be less than 500 characters";
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
        name: "difficulty",
        label: "Difficulty Level",
        type: "select",
        required: true,
        options: difficultyOptions,
        placeholder: "Select difficulty level...",
      },
    ],
    [
      {
        name: "videoUrl",
        label: "Video URL",
        type: "url",
        placeholder: "https://example.com/training-video",
        required: true,
        validation: {
          custom: (value) => {
            if (!value || value.trim() === "") return "Video URL is required";
            try {
              new URL(value);
              return null;
            } catch {
              return "Please enter a valid URL";
            }
          },
        },
      },
      {
        name: "url",
        label: "Image URL",
        type: "url",
        placeholder: "https://example.com/training-Image",
        required: true,
        validation: {
          custom: (value) => {
            if (!value || value.trim() === "") return "Image URL is required";
            try {
              new URL(value);
              return null;
            } catch {
              return "Please enter a valid URL";
            }
          },
        },
      },
    ],
    [
      {
        name: "calories",
        label: "Calories Burned",
        type: "number",
        placeholder: "300",
        required: true,
        validation: {
          custom: (value) => {
            if (!value || value === "") return "Calories is required";
            const num = parseInt(value);
            if (isNaN(num) || num < 1) return "Calories must be at least 1";
            if (num > 2000) return "Calories must be less than 2000";
            return null;
          },
        },
      },
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
        onChange: (value: string) => {
          console.log("Input type changed to:", value);
          setInputType(value as "duration" | "count");
        },
      },
    ],
    [
      // Duration and Count fields - both shown but one disabled
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
        validation: {
          custom: (value) => {
            if (inputType === "count") return null; // Skip validation if disabled
            if (!value || value === "") return "Duration is required";
            const num = parseInt(value);
            if (isNaN(num) || num < 1)
              return "Duration must be at least 1 second";
            if (num > 3600)
              return "Duration must be less than 3600 seconds (1 hour)";
            return null;
          },
        },
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
        validation: {
          custom: (value) => {
            if (inputType === "duration") return null; // Skip validation if disabled
            if (!value || value === "") return "Repetition count is required";
            const num = parseInt(value);
            if (isNaN(num) || num < 1) return "Count must be at least 1";
            if (num > 1000) return "Count must be less than 1000";
            return null;
          },
        },
      },
    ],

    [
      {
        name: "status",
        label: "Status",
        type: "switch",
        required: false,
        validation: {
          custom: (value) => {
            return null;
          },
        },
      },
    ],
  ];

  const sections = [
    {
      title: "Basic Information",
      icon: "heroicons:document-text",
      description: "Enter exercise title in both English and Arabic",
      fieldsCount: 2, // englishTitle, arabicTitle
    },
    {
      title: "Description",
      icon: "heroicons:pencil-square",
      description: "Enter exercise description in both English and Arabic",
      fieldsCount: 2, // englishDescription, arabicDescription
    },
    {
      title: "Category & Difficulty",
      icon: "heroicons:tag",
      description: "Select category and difficulty level for the exercise",
      fieldsCount: 2, // categoryId, difficulty
    },
    {
      title: "Media URLs",
      icon: "heroicons:video-camera",
      description: "Add video and image URLs for the exercise",
      fieldsCount: 2, // videoUrl, url (image)
    },
    {
      title: "Exercise Metrics",
      icon: "heroicons:fire",
      description: "Set calories burned and select exercise type",
      fieldsCount: 2, // calories, inputType
    },
    {
      title: inputType === "duration" ? "Duration Settings" : "Count Settings",
      icon:
        inputType === "duration" ? "heroicons:clock" : "heroicons:arrow-path",
      description:
        inputType === "duration"
          ? "Set duration in seconds (repetition count is disabled)"
          : "Set repetition count (duration is disabled)",
      fieldsCount: 2, // duration, count
    },
    {
      title: "Status",
      icon: "heroicons:check-circle",
      description: "Enable or disable this exercise",
      fieldsCount: 1, // status
    },
  ];

  const handleCancel = () => {
    router.back();
  };
  const handleFormDataChange = (data: Record<string, any>) => {
    // Update inputType when exercise type changes
    if (data.inputType && data.inputType !== inputType) {
      setInputType(data.inputType as "duration" | "count");
    }
  };
  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#25235F] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading exercise data...</p>
        </div>
      </div>
    );
  }

  // Show error state if no data
  if (!exerciseData) {
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
          <p className="text-gray-600 mb-4">Failed to load exercise data</p>
          <Button onClick={handleCancel}>Go Back</Button>
        </div>
      </div>
    );
  }

  // Prepare initial data for the form
  const initialData = {
    id: exerciseData.id || id,
    englishTitle: exerciseData.title.english || "",
    arabicTitle: exerciseData.title.arabic || "",
    englishDescription: exerciseData.description.english || "",
    arabicDescription: exerciseData.description.arabic || "",
    categoryId: exerciseData.categoryId || "",
    videoUrl: exerciseData.videoUrl || "",
    url: exerciseData.url || "",
    duration: exerciseData.duration || "",
    count: exerciseData.count || "",
    difficulty: exerciseData.difficulty || "Beginner",
    calories: exerciseData.calory || "",
    status: exerciseData.status === "Active", // Convert string to boolean for switch
    inputType: inputType, // Set the initial input type
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

      <GenericUpdateForm
        title="Update Exercise"
        description="Update the exercise information"
        initialData={initialData}
        fields={fields}
        sections={sections}
        onSubmit={handleSubmit}
        onFormDataChange={handleFormDataChange} // Add this line
        onCancel={handleCancel}
        showIdField={true}
        idFieldLabel="Exercise ID"
        submitButtonText="Update Exercise"
        cancelButtonText="Cancel"
        isLoading={categoriesPaginated.isLoading || isSubmitting}
        submitButtonProps={{
          disabled: isSubmitting,
        }}
      />
    </div>
  );
};

export default ExerciseUpdateForm;
