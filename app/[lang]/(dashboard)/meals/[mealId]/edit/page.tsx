"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useRouter, useParams } from "next/navigation";
import {
  UpdateMethod,
  CreateMethodFormData,
  GetSpecifiedMethod,
} from "@/app/services/apis/ApiMethod";
import { toast } from "../../../shared/toast";
import { useTranslate } from "@/config/useTranslation";
import GenericUpdateForm from "../../../shared/GenericUpdateForm";
import { baseUrl } from "@/app/services/app.config";

interface MealItem {
  id?: number;
  description: {
    english: string;
    arabic: string;
  };
}

interface MealData {
  id?: number;
  image: string;
  type: string;
  totalCalory: number;
  proteins: number;
  fat: number;
  carp: number;
  status?: string;
  isRequest?: boolean;
  createdAt?: string;
  updatedAt?: string;
  mealItem?: MealItem[]; // Note: singular 'mealItem' from API
}

interface ApiResponse {
  data?: {
    code?: number;
    message?: string | { arabic: string; english: string };
    data?: MealData;
  };
  code?: number;
  message?: string | { arabic: string; english: string };
}

const MealUpdateForm = ({
  onClose,
  initialMealData,
}: {
  onClose?: () => void;
  initialMealData?: MealData;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [mealItems, setMealItems] = useState<MealItem[]>([]);
  const [formInitialData, setFormInitialData] = useState({
    type: "",
    totalCalory: "",
    proteins: "",
    fat: "",
    carp: "",
  });

  const router = useRouter();
  const params = useParams();
  const mealId = params.mealId as string;
  const { lang } = useParams();
  const { t } = useTranslate();

  // Fetch meal data if mealId is provided and no initial data
  useEffect(() => {
    if (mealId && !initialMealData) {
      fetchMealData(mealId);
    } else if (initialMealData) {
      // Use provided initial data
      initializeFormWithData(initialMealData);
    }
  }, [mealId, initialMealData]);

  const fetchMealData = async (id: string) => {
    try {
      setIsFetching(true);
      console.log("Fetching meal data for ID:", id);

      const response: ApiResponse = await GetSpecifiedMethod(
        `meals/${id}`,
        lang,
      );
      console.log("Full API Response:", response);

      // Handle different response structures
      if (response?.data?.data) {
        // Response with nested data structure
        const mealData = response.data.data;
        initializeFormWithData(mealData);
      } else if (response?.data) {
        // Direct data structure
        initializeFormWithData(response.data as MealData);
      } else if (response?.code === 404) {
        toast.error(t("ERROR"), t("MEAL_NOT_FOUND"));
        router.back();
      } else {
        toast.error(t("ERROR"), t("FAILED_TO_FETCH_MEAL_DATA"));
      }
    } catch (error: any) {
      console.error("Error fetching meal data:", error);
      toast.error(
        t("ERROR"),
        error.response?.data?.message || t("FAILED_TO_FETCH_MEAL_DATA"),
      );
    } finally {
      setIsFetching(false);
    }
  };

  const initializeFormWithData = (mealData: MealData) => {
    try {
      console.log("Initializing form with data:", mealData);

      // Set meal items - FIXED: use mealItem (singular) from API response
      if (mealData.mealItem && Array.isArray(mealData.mealItem)) {
        console.log("Setting meal items from mealItem:", mealData.mealItem);
        setMealItems(mealData.mealItem);
      } else {
        console.log("No meal items found, setting empty array");
        setMealItems([]);
      }

      // Set image preview
      if (mealData.image) {
        // Check if the image URL already has baseUrl to avoid duplication
        const fullImageUrl = mealData.image.startsWith("http")
          ? mealData.image
          : baseUrl + mealData.image;
        setImagePreview(fullImageUrl);
        console.log("Setting image preview:", fullImageUrl);
      }

      // Set form initial data
      const transformedData = {
        name: mealData.name || "",
        type: mealData.type || "",
        totalCalory: mealData.totalCalory?.toString() || "",
        proteins: mealData.proteins?.toString() || "",
        fat: mealData.fat?.toString() || "",
        carp: mealData.carp?.toString() || "",
      };

      setFormInitialData(transformedData);
      console.log("Form initialized with:", transformedData);
      console.log("Final meal items state:", mealData.mealItem);
    } catch (error) {
      console.error("Error initializing form data:", error);
      toast.error(t("ERROR"), t("FAILED_TO_INITIALIZE_FORM_DATA"));
    }
  };

  // Add new meal item
  const addMealItem = () => {
    setMealItems([...mealItems, { description: { english: "", arabic: "" } }]);
  };

  // Remove meal item
  const removeMealItem = (index: number) => {
    if (mealItems.length > 1) {
      const updatedItems = mealItems.filter((_, i) => i !== index);
      setMealItems(updatedItems);
    }
  };

  // Update meal item
  const updateMealItem = (
    index: number,
    field: "english" | "arabic",
    value: string,
  ) => {
    const updatedItems = [...mealItems];
    updatedItems[index].description[field] = value;
    setMealItems(updatedItems);
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
      if (!validTypes.includes(file.type)) {
        toast.error(t("ERROR"), t("INVALID_IMAGE_FILE"));
        return;
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        toast.error(t("ERROR"), t("IMAGE_SIZE_LIMIT"));
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
          t("ERROR"),
          uploadResponse?.data?.message || t("FAILED_TO_UPLOAD_IMAGE"),
        );
        return null;
      }
    } catch (error: any) {
      console.error("Error uploading image:", error);
      toast.error(
        t("ERROR"),
        error.response?.data?.message || t("FAILED_TO_UPLOAD_IMAGE"),
      );
      return null;
    }
  };

  const handleSubmit = async (data: Record<string, any>) => {
    try {
      setIsLoading(true);

      // Validate meal items
      const validMealItems = mealItems.filter(
        (item) =>
          item.description.english.trim() !== "" &&
          item.description.arabic.trim() !== "",
      );

      if (validMealItems.length === 0) {
        toast.error(t("ERROR"), t("MEAL_ITEMS_VALIDATION"));
        return;
      }

      let imageUrl = imagePreview || "";

      // Upload new image if selected
      if (selectedImage) {
        const uploadedUrl = await uploadImage(selectedImage);
        if (!uploadedUrl) {
          // Stop submission if image upload failed
          return;
        }
        imageUrl = uploadedUrl;
      }

      // Create meal data object - FIXED: use mealItem (singular) for API
      const mealData = {
        name: data.name,
        type: data.type,
        totalCalory: Number(data.totalCalory),
        proteins: Number(data.proteins),
        fat: Number(data.fat),
        carp: Number(data.carp),
        mealItems: validMealItems, // Changed from mealItems to mealItem
        ...(imageUrl &&
          typeof imageUrl === "string" &&
          imageUrl.trim() !== "" && { image: imageUrl }),
      };

      // Call the API to update Meal
      const response = await UpdateMethod(`meals`, mealData, mealId, lang);

      console.log("Update meal API Response:", response);

      // Handle response based on your API structure
      if (
        response?.data?.code === 200 ||
        response?.code === 200 ||
        response?.status === 200
      ) {
        // Handle message which could be string or object
        let successMessage = t("MEAL_UPDATED_SUCCESSFULLY");
        if (typeof response.data?.message === "object") {
          successMessage = response.data.message.english || successMessage;
        } else if (response.data?.message) {
          successMessage = response.data.message;
        } else if (response.message) {
          successMessage = response.message;
        }

        toast.success(t("SUCCESS"), successMessage);

        if (onClose) {
          onClose();
        } else {
          // Redirect to meals list page
          router.push("/meals");
        }
      } else {
        let errorMessage = t("FAILED_TO_UPDATE_MEAL");
        if (typeof response?.data?.message === "object") {
          errorMessage = response.data.message.english || errorMessage;
        } else if (response?.data?.message) {
          errorMessage = response.data.message;
        } else if (response?.message) {
          errorMessage = response.message;
        }

        toast.error(t("ERROR"), errorMessage);
      }
    } catch (error: any) {
      console.error("Error updating meal:", error);
      toast.error(
        t("ERROR"),
        error.response?.data?.message || t("FAILED_TO_UPDATE_MEAL"),
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (onClose) {
      onClose();
    } else {
      router.back();
    }
  };

  const mealTypes = [
    { value: "BREAKFAST", label: t("BREAKFAST") },
    { value: "LAUNCH", label: t("LUNCH") },
    { value: "DINNER", label: t("DINNER") },
    { value: "SNACK", label: t("SNACK") },
    { value: "OTHER", label: t("OTHER") },
  ];

  const fields = [
    [
      {
        name: "name",
        label: t("MEAL_TITLE"),
        type: "text",
        placeholder: t("ENTER_MEAL_TITLE"),
        required: true,
      },
      {
        name: "type",
        label: t("MEAL_TYPE"),
        type: "select",
        required: true,
        placeholder: t("SELECT_MEAL_TYPE"),
        options: mealTypes,
        validation: {
          custom: (value) => {
            if (!value) return t("MEAL_TYPE_REQUIRED");
            return null;
          },
        },
      },
    ],
    [
      {
        name: "totalCalory",
        label: t("TOTAL_CALORIES"),
        type: "number",
        placeholder: t("ENTER_TOTAL_CALORIES"),
        required: true,
        step: "0.1",
        validation: {
          min: 0,
          max: 5000,
          custom: (value) => {
            if (!value || value === "") return t("TOTAL_CALORIES_REQUIRED");
            if (value < 0) return t("CALORIES_NEGATIVE_ERROR");
            if (value > 5000) return t("CALORIES_TOO_HIGH_ERROR");
            return null;
          },
        },
      },
      {
        name: "proteins",
        label: t("PROTEINS_G"),
        type: "number",
        placeholder: t("ENTER_PROTEIN_AMOUNT"),
        required: true,
        step: "0.1",
        validation: {
          min: 0,
          max: 200,
          custom: (value) => {
            if (!value || value === "") return t("PROTEIN_AMOUNT_REQUIRED");
            if (value < 0) return t("PROTEIN_NEGATIVE_ERROR");
            if (value > 200) return t("PROTEIN_TOO_HIGH_ERROR");
            return null;
          },
        },
      },
      {
        name: "fat",
        label: t("FAT_G"),
        type: "number",
        placeholder: t("ENTER_FAT_AMOUNT"),
        required: true,
        step: "0.1",
        validation: {
          min: 0,
          max: 200,
          custom: (value) => {
            if (!value || value === "") return t("FAT_AMOUNT_REQUIRED");
            if (value < 0) return t("FAT_NEGATIVE_ERROR");
            if (value > 200) return t("FAT_TOO_HIGH_ERROR");
            return null;
          },
        },
      },
      {
        name: "carp",
        label: t("CARBOHYDRATES_G"),
        type: "number",
        placeholder: t("ENTER_CARBOHYDRATE_AMOUNT"),
        required: true,
        step: "0.1",
        validation: {
          min: 0,
          max: 500,
          custom: (value) => {
            if (!value || value === "")
              return t("CARBOHYDRATE_AMOUNT_REQUIRED");
            if (value < 0) return t("CARBOHYDRATE_NEGATIVE_ERROR");
            if (value > 500) return t("CARBOHYDRATE_TOO_HIGH_ERROR");
            return null;
          },
        },
        cols: 1,
      },
    ],
    [
      {
        name: "image",
        label: t("MEAL_IMAGE"),
        type: "image",
        required: false,
        accept: "image/*",
        description: t("IMAGE_UPLOAD_DESCRIPTION"),
        onChange: handleImageChange,
        preview: imagePreview,
        validation: {
          maxFileSize: 5 * 1024 * 1024,
          allowedTypes: ["image/jpeg", "image/jpg", "image/png", "image/webp"],
          custom: (value) => {
            return null;
          },
        },
        cols: 1,
      },
    ],
    [
      {
        name: "mealItems",
        label: t("MEAL_ITEMS"),
        type: "mealItem",
        required: true,
        cols: 1,
      },
    ],
  ];

  const sections = [
    {
      title: t("BASIC_INFORMATION"),
      icon: "heroicons:document-text",
      description: t("BASIC_INFORMATION_UPDATE_DESCRIPTION"),
    },
    {
      title: t("NUTRITION_FACTS"),
      icon: "heroicons:chart-bar",
      description: t("NUTRITION_FACTS_UPDATE_DESCRIPTION"),
    },
    {
      title: t("ADDITIONAL_INFORMATION"),
      icon: "heroicons:information-circle",
      description: t("ADDITIONAL_INFORMATION_UPDATE_DESCRIPTION"),
    },
    {
      title: t("MEAL_ITEMS"),
      icon: "heroicons:list-bullet",
      description: t("MEAL_ITEMS_UPDATE_DESCRIPTION"),
    },
  ];

  // Show loading state while fetching data
  if (isFetching && !initialMealData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">{t("LOADING_MEAL_DATA")}</p>
        </div>
      </div>
    );
  }

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
        title={t("UPDATE_MEAL")}
        description={t("UPDATE_MEAL_DESCRIPTION")}
        initialData={formInitialData}
        fields={fields}
        sections={sections}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        showIdField={false}
        isLoading={isLoading}
        submitButtonText={t("UPDATE_MEAL_BUTTON")}
        cancelButtonText={t("CANCEL")}
        submitButtonProps={{
          disabled: isLoading,
        }}
        // Pass meal items state and handlers
        mealItems={mealItems}
        onMealItemsChange={setMealItems}
        onAddMealItem={addMealItem}
        onRemoveMealItem={removeMealItem}
        onUpdateMealItem={updateMealItem}
        // Pass image preview
        imagePreview={imagePreview}
      />
    </div>
  );
};

export default MealUpdateForm;
