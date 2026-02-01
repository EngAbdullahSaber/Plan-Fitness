"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter, useParams } from "next/navigation";
import {
  GetSpecifiedMethod,
  UpdateMethod,
  UpdateMethodFormData,
  GetPanigationMethod,
  CreateMethodFormData,
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
  videoUrl: string;
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
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);

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
        console.log("Fetched exercise data:", exercise); // Debug log

        setExerciseData(exercise);

        // Set existing image URL if available
        if (exercise.url) {
          setExistingImageUrl(exercise.url);
          setImagePreview(exercise.url);
        }

        // Determine input type based on available data
        if (exercise.duration !== null && exercise.duration !== undefined) {
          setInputType("duration");
        } else if (exercise.count !== null && exercise.count !== undefined) {
          setInputType("count");
        }
      } else {
        toast.error(t("EXERCISE_NOT_FOUND"));
      }
    } catch (error: any) {
      console.error("Error fetching exercise:", error);
      toast.error(t("FAILED_TO_LOAD_EXERCISE_DATA"));
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

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
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

  // Remove selected image and revert to existing image
  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(existingImageUrl); // Revert to existing image URL
  };

  // Upload image and get the URL
  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      const imageFormData = new FormData();
      imageFormData.append("file", file);

      const uploadResponse = await CreateMethodFormData(
        "upload",
        imageFormData,
        lang,
      );

      if (
        uploadResponse?.data?.code === 200 &&
        uploadResponse?.data?.data?.url
      ) {
        return uploadResponse.data.data.url;
      } else {
        toast.error(
          uploadResponse?.data?.message || t("FAILED_TO_UPLOAD_IMAGE"),
        );
        return null;
      }
    } catch (error: any) {
      console.error("Error uploading image:", error);
      toast.error(error.response?.data?.message || t("FAILED_TO_UPLOAD_IMAGE"));
      return null;
    }
  };

  const handleSubmit = async (data: Record<string, any>) => {
    try {
      setIsSubmitting(true);

      let imageUrl = existingImageUrl || data.url || "";

      // Upload new image if selected
      if (selectedImage) {
        const uploadedUrl = await uploadImage(selectedImage);
        if (!uploadedUrl) {
          // Stop submission if image upload failed
          setIsSubmitting(false);
          return;
        }
        imageUrl = uploadedUrl;
      }

      // Prepare exercise data according to the required structure
      const exerciseDataToUpdate = {
        categoryId: parseInt(data.categoryId),
        title: {
          arabic: data.arabicTitle,
          english: data.englishTitle,
        },
        description: {
          arabic: data.arabicDescription,
          english: data.englishDescription,
        },
        url: imageUrl, // Use uploaded image URL or existing URL
        videoUrl: data.videoUrl,
        count: inputType === "count" ? parseInt(data.count) : null,
        duration: inputType === "duration" ? parseInt(data.duration) : null,
        difficulty: data.difficulty,
        status: data.status ? "Active" : "Inactive",
        calory: parseInt(data.calories),
      };

      console.log("Exercise data to update:", exerciseDataToUpdate);

      // Call the API to update Exercise
      const response = await UpdateMethod(
        "training",
        exerciseDataToUpdate,
        id,
        lang,
      );

      console.log("API Response:", response);

      // Handle response based on your API structure
      if (response?.data?.code === 200 || response?.code === 200) {
        toast.success(
          response.data?.message ||
            response.message ||
            t("EXERCISE_UPDATED_SUCCESSFULLY"),
        );

        // Redirect to exercises list page
        router.push("/exercises");
      } else {
        toast.error(
          response?.data?.message ||
            response?.message ||
            t("FAILED_TO_UPDATE_EXERCISE"),
        );
      }
    } catch (error: any) {
      console.error("Error updating exercise:", error);
      toast.error(
        error.response?.data?.message || t("FAILED_TO_UPDATE_EXERCISE"),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const difficultyOptions = [
    { value: "BEGINNER", label: t("BEGINNER") },
    { value: "INTERMEDIATE", label: t("INTERMEDIATE") },
    { value: "ADVANCED", label: t("ADVANCED") },
  ];

  const fields = [
    [
      {
        name: "englishTitle",
        label: t("EXERCISE_TITLE_ENGLISH"),
        type: "text",
        placeholder: t("ENTER_EXERCISE_TITLE_ENGLISH"),
        required: true,
        validation: {
          minLength: 2,
          maxLength: 100,
          custom: (value) => {
            if (!value || value.trim() === "")
              return t("EXERCISE_TITLE_REQUIRED");
            if (value.length < 2) return t("EXERCISE_TITLE_MIN_LENGTH");
            if (value.length > 100) return t("EXERCISE_TITLE_MAX_LENGTH");
            return null;
          },
        },
      },
      {
        name: "arabicTitle",
        label: t("EXERCISE_TITLE_ARABIC"),
        type: "text",
        placeholder: t("ENTER_EXERCISE_TITLE_ARABIC"),
        required: true,
        validation: {
          minLength: 2,
          maxLength: 100,
          custom: (value) => {
            if (!value || value.trim() === "")
              return t("EXERCISE_TITLE_ARABIC_REQUIRED");
            if (value.length < 2) return t("EXERCISE_TITLE_MIN_LENGTH");
            if (value.length > 100) return t("EXERCISE_TITLE_MAX_LENGTH");
            return null;
          },
        },
      },
    ],
    [
      {
        name: "englishDescription",
        label: t("EXERCISE_DESCRIPTION_ENGLISH"),
        type: "textarea",
        placeholder: t("ENTER_EXERCISE_DESCRIPTION_ENGLISH"),
        required: true,
        rows: 3,
        validation: {
          minLength: 10,
          maxLength: 500,
          custom: (value) => {
            if (!value || value.trim() === "")
              return t("EXERCISE_DESCRIPTION_REQUIRED");
            if (value.length < 10) return t("EXERCISE_DESCRIPTION_MIN_LENGTH");
            if (value.length > 500) return t("EXERCISE_DESCRIPTION_MAX_LENGTH");
            return null;
          },
        },
      },
      {
        name: "arabicDescription",
        label: t("EXERCISE_DESCRIPTION_ARABIC"),
        type: "textarea",
        placeholder: t("ENTER_EXERCISE_DESCRIPTION_ARABIC"),
        required: true,
        rows: 3,
        validation: {
          minLength: 10,
          maxLength: 500,
          custom: (value) => {
            if (!value || value.trim() === "")
              return t("EXERCISE_DESCRIPTION_ARABIC_REQUIRED");
            if (value.length < 10) return t("EXERCISE_DESCRIPTION_MIN_LENGTH");
            if (value.length > 500) return t("EXERCISE_DESCRIPTION_MAX_LENGTH");
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
        name: "difficulty",
        label: t("DIFFICULTY_LEVEL"),
        type: "select",
        required: true,
        options: difficultyOptions,
        placeholder: t("SELECT_DIFFICULTY"),
      },
    ],
    [
      {
        name: "videoUrl",
        label: t("VIDEO_URL"),
        type: "url",
        placeholder: t("VIDEO_URL_PLACEHOLDER"),
        required: true,
        validation: {
          custom: (value) => {
            if (!value || value.trim() === "") return t("VIDEO_URL_REQUIRED");
            try {
              new URL(value);
              return null;
            } catch {
              return t("VIDEO_URL_INVALID");
            }
          },
        },
      },
      {
        name: "image",
        label: t("EXERCISE_IMAGE"),
        type: "image",
        required: false,
        accept: "image/*",
        description: t("IMAGE_UPLOAD_DESCRIPTION_UPDATE"),
        onChange: handleImageChange,
        validation: {
          maxFileSize: 5 * 1024 * 1024, // 5MB
          allowedTypes: ["image/jpeg", "image/jpg", "image/png", "image/webp"],
          custom: (value) => {
            return null;
          },
        },
      },
    ],
    [
      {
        name: "calories",
        label: t("CALORIES_BURNED"),
        type: "number",
        placeholder: t("CALORIES_PLACEHOLDER"),
        required: true,
        validation: {
          custom: (value) => {
            if (!value || value === "") return t("CALORIES_REQUIRED");
            const num = parseInt(value);
            if (isNaN(num) || num < 1) return t("CALORIES_MIN_VALUE");
            if (num > 2000) return t("CALORIES_MAX_VALUE");
            return null;
          },
        },
      },
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
        label: t("DURATION_SECONDS"),
        type: "number",
        placeholder: t("DURATION_PLACEHOLDER"),
        required: inputType === "duration", // Only required if duration-based
        disabled: inputType === "count", // Disabled if count-based
        description:
          inputType === "count" ? t("DISABLED_FOR_COUNT_BASED") : undefined,
        validation: {
          custom: (value) => {
            if (inputType === "count") return null; // Skip validation if disabled
            if (!value || value === "") return t("DURATION_REQUIRED");
            const num = parseInt(value);
            if (isNaN(num) || num < 1) return t("DURATION_MIN_VALUE");
            if (num > 3600) return t("DURATION_MAX_VALUE");
            return null;
          },
        },
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
        validation: {
          custom: (value) => {
            if (inputType === "duration") return null; // Skip validation if disabled
            if (!value || value === "") return t("COUNT_REQUIRED");
            const num = parseInt(value);
            if (isNaN(num) || num < 1) return t("COUNT_MIN_VALUE");
            if (num > 1000) return t("COUNT_MAX_VALUE");
            return null;
          },
        },
      },
    ],

    [
      {
        name: "status",
        label: t("STATUS"),
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
      title: t("BASIC_INFORMATION"),
      icon: "heroicons:document-text",
      description: t("EXERCISE_TITLE_UPDATE_DESCRIPTION"),
      fieldsCount: 2,
    },
    {
      title: t("DESCRIPTION"),
      icon: "heroicons:pencil-square",
      description: t("EXERCISE_DESCRIPTION_UPDATE_DESCRIPTION"),
      fieldsCount: 2,
    },
    {
      title: t("CATEGORY_DIFFICULTY"),
      icon: "heroicons:tag",
      description: t("CATEGORY_DIFFICULTY_UPDATE_DESCRIPTION"),
      fieldsCount: 2,
    },
    {
      title: t("MEDIA"),
      icon: "heroicons:video-camera",
      description: t("MEDIA_UPDATE_DESCRIPTION"),
      fieldsCount: 2,
    },
    {
      title: t("IMAGE_SETTINGS"),
      icon: "heroicons:photograph",
      description: selectedImage
        ? t("NEW_IMAGE_UPLOADED")
        : existingImageUrl
          ? t("EXISTING_IMAGE_IN_USE")
          : t("UPLOAD_OR_ENTER_URL"),
      fieldsCount: 2,
    },
    {
      title: t("EXERCISE_TYPE_SETTINGS"),
      icon: "heroicons:cog",
      description: t("EXERCISE_TYPE_UPDATE_DESCRIPTION"),
      fieldsCount: 2,
    },
    {
      title:
        inputType === "duration" ? t("DURATION_SETTINGS") : t("COUNT_SETTINGS"),
      icon:
        inputType === "duration" ? "heroicons:clock" : "heroicons:arrow-path",
      description:
        inputType === "duration"
          ? t("DURATION_SETTINGS_UPDATE_DESCRIPTION")
          : t("COUNT_SETTINGS_UPDATE_DESCRIPTION"),
      fieldsCount: 2,
    },
    {
      title: t("STATUS"),
      icon: "heroicons:check-circle",
      description: t("STATUS_UPDATE_DESCRIPTION"),
      fieldsCount: 1,
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
          <p className="text-gray-600">{t("LOADING_EXERCISE_DATA")}</p>
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
          <p className="text-gray-600 mb-4">
            {t("FAILED_TO_LOAD_EXERCISE_DATA")}
          </p>
          <Button onClick={handleCancel}>{t("GO_BACK")}</Button>
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
    difficulty: exerciseData.difficulty || "BEGINNER",
    calories: exerciseData.calory || "",
    status: exerciseData.status === "Active", // Convert string to boolean for switch
    inputType: inputType, // Set the initial input type
  };

  return (
    <div className="space-y-6">
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
        title={t("UPDATE_EXERCISE")}
        description={t("UPDATE_EXERCISE_DESCRIPTION")}
        initialData={initialData}
        fields={fields}
        sections={sections}
        onSubmit={handleSubmit}
        onFormDataChange={handleFormDataChange}
        onCancel={handleCancel}
        showIdField={true}
        idFieldLabel={t("EXERCISE_ID")}
        submitButtonText={t("UPDATE_EXERCISE_BUTTON")}
        cancelButtonText={t("CANCEL")}
        isLoading={categoriesPaginated.isLoading || isSubmitting}
        submitButtonProps={{
          disabled: isSubmitting,
        }}
        // Pass image preview if needed by GenericUpdateForm
        imagePreview={imagePreview}
      />
    </div>
  );
};

export default ExerciseUpdateForm;
