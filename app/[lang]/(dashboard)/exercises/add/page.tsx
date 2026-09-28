"use client";
import React, { useState, useMemo } from "react";
import GenericCreateForm from "../../shared/GenericCreateForm";
import { Button } from "@/components/ui/button";
import { useRouter, useParams } from "next/navigation";
import {
  CreateMethod,
  CreateMethodFormData,
  GetPanigationMethod,
} from "@/app/services/apis/ApiMethod";
import toast from "react-hot-toast";
import { useTranslate } from "@/config/useTranslation";
import { usePaginatedSelect } from "@/hooks/usePaginatedSelect";
import { baseUrl } from "@/app/services/app.config";

const ExerciseCreateForm = ({ onClose }: { onClose?: () => void }) => {
  const router = useRouter();
  const { lang } = useParams();
  const { t } = useTranslate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [inputType, setInputType] = useState<"duration" | "count">("duration");
  const [formData, setFormData] = useState<any>({});
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

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

  // ✅ Handle image change
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

  // ✅ Upload image first and get the URL
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

  // ✅ Handle form submission
  const handleSubmit = async (data: Record<string, any>) => {
    try {
      setIsSubmitting(true);

      let imageUrl = "";

      // Upload image first if selected
      if (selectedImage) {
        const uploadedUrl = await uploadImage(selectedImage);
        if (!uploadedUrl) {
          // Stop submission if image upload failed
          setIsSubmitting(false);
          return;
        }
        imageUrl = uploadedUrl;
      }

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
        url: baseUrl + imageUrl || data.url || "", // Use uploaded image URL or existing URL
        videoUrl: data.videoUrl,
        count: inputType === "count" ? parseInt(data.count) : null,
        duration: inputType === "duration" ? parseInt(data.duration) : null,
        difficulty: data.difficulty,
        status: data.status ? "Active" : "Inactive",
        calory: parseInt(data.calories),
      };

      // If you need to send with FormData instead (if your API accepts FormData)
      // Uncomment this section if your backend requires FormData
      /*
      const formData = new FormData();
      formData.append('categoryId', parseInt(data.categoryId));
      formData.append('title[arabic]', data.arabicTitle);
      formData.append('title[english]', data.englishTitle);
      formData.append('description[arabic]', data.arabicDescription);
      formData.append('description[english]', data.englishDescription);
      formData.append('videoUrl', data.videoUrl || '');
      formData.append('difficulty', data.difficulty);
      formData.append('status', data.status ? "Active" : "Inactive");
      formData.append('calory', parseInt(data.calories));

      // Add image if selected
      if (selectedImage) {
        formData.append('image', selectedImage);
      }

      // Conditionally add count or duration
      if (inputType === "count") {
        formData.append('count', parseInt(data.count));
      } else if (inputType === "duration") {
        formData.append('duration', parseInt(data.duration));
      }

      const response = await CreateMethodFormData(
        "training/create",
        formData,
        lang,
      );
      */

      // Using regular CreateMethod (JSON data)
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

      // Video URL & Image Upload
      [
        {
          name: "videoUrl",
          label: t("VIDEO_URL"),
          type: "url",
          placeholder: t("VIDEO_URL_PLACEHOLDER"),
          required: true,
        },
        {
          name: "image",
          label: t("EXERCISE_IMAGE"),
          type: "image",
          required: false,
          accept: "image/jpeg,image/jpg,image/png,image/webp",
          description: t("IMAGE_UPLOAD_DESCRIPTION"),
          onChange: handleImageChange,
          validation: {
            maxFileSize: 5 * 1024 * 1024, // 5MB
            allowedTypes: [
              "image/jpeg",
              "image/jpg",
              "image/png",
              "image/webp",
            ],
            custom: (value) => {
              return null;
            },
          },
        },
      ],

      // URL field (optional if image is uploaded)
      [
        {
          name: "url",
          label: t("EXTERNAL_IMAGE_URL"),
          type: "url",
          placeholder: t("EXTERNAL_IMAGE_URL_PLACEHOLDER"),
          required: false,
          description: t("EXTERNAL_IMAGE_URL_DESCRIPTION"),
          disabled: selectedImage !== null, // Disable if image is uploaded
        },
        // Empty field to maintain grid structure
        {},
      ],

      // Calories & Exercise Type
      [
        {
          name: "calories",
          label: t("CALORIES_BURNED"),
          type: "number",
          placeholder: t("CALORIES_PLACEHOLDER"),
          required: true,
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
      selectedImage, // Add selectedImage to dependencies
    ],
  );

  // ✅ Dynamic section titles
  const sections = [
    {
      title: t("BASIC_INFORMATION"),
      icon: "heroicons:document-text",
      description: t("EXERCISE_TITLE_DESCRIPTION"),
      fieldsCount: 2,
    },
    {
      title: t("DESCRIPTION"),
      icon: "heroicons:pencil-square",
      description: t("EXERCISE_DESCRIPTION_DESCRIPTION"),
      fieldsCount: 2,
    },
    {
      title: t("CATEGORY_DIFFICULTY"),
      icon: "heroicons:tag",
      description: t("CATEGORY_DIFFICULTY_DESCRIPTION"),
      fieldsCount: 2,
    },
    {
      title: t("MEDIA"),
      icon: "heroicons:video-camera",
      description: t("MEDIA_DESCRIPTION"),
      fieldsCount: 2,
    },
    {
      title: t("IMAGE_URL"),
      icon: "heroicons:photograph",
      description: selectedImage
        ? t("IMAGE_UPLOADED_DESCRIPTION")
        : t("EXTERNAL_IMAGE_URL_DESCRIPTION"),
      fieldsCount: 2,
    },
    {
      title: t("EXERCISE_METRICS"),
      icon: "heroicons:fire",
      description: t("EXERCISE_METRICS_DESCRIPTION"),
      fieldsCount: 2,
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
      fieldsCount: 2,
    },
    {
      title: t("STATUS"),
      icon: "heroicons:check-circle",
      description: t("STATUS_DESCRIPTION"),
      fieldsCount: 1,
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

      {/* ✅ Image Preview */}
      {imagePreview && (
        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">{t("IMAGE_PREVIEW")}</h3>
          <div className="relative w-48 h-48 rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600">
            <img
              src={imagePreview}
              alt="Exercise preview"
              className="w-full h-full object-cover"
            />
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            {t("IMAGE_PREVIEW_DESCRIPTION")}
          </p>
        </div>
      )}

      {/* ✅ Generic Create Form */}
      <GenericCreateForm
        title={t("ADD_NEW_EXERCISE")}
        description={t("ADD_NEW_EXERCISE_DESCRIPTION")}
        initialData={initialData}
        fields={fields}
        sections={sections}
        onSubmit={handleSubmit}
        onFormDataChange={handleFormDataChange}
        onCancel={onClose}
        submitButtonText={t("CREATE_EXERCISE")}
        cancelButtonText={t("CANCEL")}
        isLoading={categoriesPaginated.isLoading || isSubmitting}
        submitButtonProps={{
          disabled: isSubmitting,
        }}
        // Pass image preview if needed by GenericCreateForm
        imagePreview={imagePreview}
      />
    </div>
  );
};

export default ExerciseCreateForm;
