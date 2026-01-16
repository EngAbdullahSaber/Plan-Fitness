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
        toast.error("Error", "Meal not found");
        router.back();
      } else {
        toast.error("Error", "Failed to fetch meal data");
      }
    } catch (error: any) {
      console.error("Error fetching meal data:", error);
      toast.error(
        "Error",
        error.response?.data?.message || "Failed to fetch meal data",
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
      toast.error("Error", "Failed to initialize form data");
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
        toast.error(
          "Error",
          "Please select a valid image file (JPEG, PNG, WebP)",
        );
        return;
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        toast.error("Error", "Image size should be less than 5MB");
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
          "Error",
          uploadResponse?.data?.message || "Failed to upload image",
        );
        return null;
      }
    } catch (error: any) {
      console.error("Error uploading image:", error);
      toast.error(
        "Error",
        error.response?.data?.message || "Failed to upload image",
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
        toast.error(
          "Error",
          "Please add at least one meal item with both English and Arabic descriptions",
        );
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
        let successMessage = "Meal updated successfully";
        if (typeof response.data?.message === "object") {
          successMessage = response.data.message.english || successMessage;
        } else if (response.data?.message) {
          successMessage = response.data.message;
        } else if (response.message) {
          successMessage = response.message;
        }

        toast.success("Success!", successMessage);

        if (onClose) {
          onClose();
        } else {
          // Redirect to meals list page
          router.push("/meals");
        }
      } else {
        let errorMessage = "Failed to update meal";
        if (typeof response?.data?.message === "object") {
          errorMessage = response.data.message.english || errorMessage;
        } else if (response?.data?.message) {
          errorMessage = response.data.message;
        } else if (response?.message) {
          errorMessage = response.message;
        }

        toast.error("Error", errorMessage);
      }
    } catch (error: any) {
      console.error("Error updating meal:", error);
      toast.error(
        "Error",
        error.response?.data?.message || "Failed to update meal",
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
    { value: "BREAKFAST", label: "Breakfast" },
    { value: "LAUNCH", label: "Lunch" },
    { value: "DINNER", label: "Dinner" },
    { value: "SNACK", label: "Snack" },
    { value: "OTHER", label: "Other" },
  ];

  const fields = [
    [
      {
        name: "type",
        label: "Meal Type",
        type: "select",
        required: true,
        placeholder: "Select meal type...",
        options: mealTypes,
        validation: {
          custom: (value) => {
            if (!value) return "Meal type is required";
            return null;
          },
        },
      },
      {
        name: "totalCalory",
        label: "Total Calories",
        type: "number",
        placeholder: "Enter total calories",
        required: true,
        step: "0.1",
        validation: {
          min: 0,
          max: 5000,
          custom: (value) => {
            if (!value || value === "") return "Total calories are required";
            if (value < 0) return "Calories cannot be negative";
            if (value > 5000) return "Calories seem too high";
            return null;
          },
        },
      },
    ],
    [
      {
        name: "proteins",
        label: "Proteins (g)",
        type: "number",
        placeholder: "Enter protein amount in grams",
        required: true,
        step: "0.1",
        validation: {
          min: 0,
          max: 200,
          custom: (value) => {
            if (!value || value === "") return "Protein amount is required";
            if (value < 0) return "Protein cannot be negative";
            if (value > 200) return "Protein amount seems too high";
            return null;
          },
        },
      },
      {
        name: "fat",
        label: "Fat (g)",
        type: "number",
        placeholder: "Enter fat amount in grams",
        required: true,
        step: "0.1",
        validation: {
          min: 0,
          max: 200,
          custom: (value) => {
            if (!value || value === "") return "Fat amount is required";
            if (value < 0) return "Fat cannot be negative";
            if (value > 200) return "Fat amount seems too high";
            return null;
          },
        },
      },
      {
        name: "carp",
        label: "Carbohydrates (g)",
        type: "number",
        placeholder: "Enter carbohydrate amount in grams",
        required: true,
        step: "0.1",
        validation: {
          min: 0,
          max: 500,
          custom: (value) => {
            if (!value || value === "")
              return "Carbohydrate amount is required";
            if (value < 0) return "Carbohydrates cannot be negative";
            if (value > 500) return "Carbohydrate amount seems too high";
            return null;
          },
        },
        cols: 1,
      },
    ],
    [
      {
        name: "image",
        label: "Meal Image",
        type: "image",
        required: false,
        accept: "image/*",
        description: "Supported formats: JPEG, PNG, WebP. Max size: 5MB",
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
        label: "Meal Items",
        type: "mealItem",
        required: true,
        cols: 1,
      },
    ],
  ];

  const sections = [
    {
      title: "Basic Information",
      icon: "heroicons:document-text",
      description: "Update the meal type and total calories",
    },
    {
      title: "Nutrition Facts",
      icon: "heroicons:chart-bar",
      description: "Update the protein and fat content",
    },
    {
      title: "Additional Information",
      icon: "heroicons:information-circle",
      description: "Update carbohydrates and meal image",
    },
    {
      title: "Meal Items",
      icon: "heroicons:list-bullet",
      description: "Update descriptions for each component of the meal",
    },
  ];

  // Show loading state while fetching data
  if (isFetching && !initialMealData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading meal data...</p>
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
        title="Update Meal"
        description="Update meal information and nutritional values"
        initialData={formInitialData}
        fields={fields}
        sections={sections}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        showIdField={false}
        isLoading={isLoading}
        submitButtonText={t("Update Meal") || "Update Meal"}
        cancelButtonText={t("Cancel") || "Cancel"}
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
