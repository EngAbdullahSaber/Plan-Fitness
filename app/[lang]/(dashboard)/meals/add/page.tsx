"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter, useParams } from "next/navigation";
import {
  CreateMethod,
  CreateMethodFormData,
} from "@/app/services/apis/ApiMethod";
import { toast } from "../../shared/toast";
import { useTranslate } from "@/config/useTranslation";
import GenericCreateForm from "../../shared/GenericCreateForm";

interface MealItem {
  description: {
    english: string;
    arabic: string;
  };
}

interface MealFormData {
  image: string;
  type: string;
  totalCalory: number;
  proteins: number;
  fat: number;
  carp: number;
  mealItems: MealItem[];
}

const MealsCreateForm = () => {
  const router = useRouter();
  const { lang } = useParams();
  const { t } = useTranslate();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mealItems, setMealItems] = useState<MealItem[]>([
    { description: { english: "", arabic: "" } },
  ]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
      if (!validTypes.includes(file.type)) {
        toast.error(
          "Error",
          "Please select a valid image file (JPEG, PNG, WebP)"
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

  // Upload image first and get the URL
  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      const imageFormData = new FormData();
      imageFormData.append("file", file);

      const uploadResponse = await CreateMethodFormData(
        "upload",
        imageFormData,
        lang
      );

      if (
        uploadResponse?.data?.code === 200 &&
        uploadResponse?.data?.data?.url
      ) {
        return uploadResponse.data.data.url;
      } else {
        toast.error(
          "Error",
          uploadResponse?.data?.message || "Failed to upload image"
        );
        return null;
      }
    } catch (error: any) {
      console.error("Error uploading image:", error);
      toast.error(
        "Error",
        error.response?.data?.message || "Failed to upload image"
      );
      return null;
    }
  };

  const handleSubmit = async (data: Record<string, any>) => {
    try {
      setIsSubmitting(true);

      // Validate meal items
      const validMealItems = mealItems.filter(
        (item) =>
          item.description.english.trim() !== "" &&
          item.description.arabic.trim() !== ""
      );

      if (validMealItems.length === 0) {
        toast.error(
          "Error",
          "Please add at least one meal item with both English and Arabic descriptions"
        );
        return;
      }

      let imageUrl = "";

      // Upload image first if selected
      if (selectedImage) {
        const uploadedUrl = await uploadImage(selectedImage);
        if (!uploadedUrl) {
          // Stop submission if image upload failed
          return;
        }
        imageUrl = uploadedUrl;
      }

      // Create meal data object
      const mealData = {
        type: data.type,
        totalCalory: Number(data.totalCalory),
        proteins: Number(data.proteins),
        fat: Number(data.fat),
        carp: Number(data.carp),
        mealItems: validMealItems,
        ...(imageUrl && { image: imageUrl }), // Only include image if URL exists
      };

      console.log("Meal data to create:", mealData);

      // Call the API to create Meal (without FormData since image is now a URL)
      const response = await CreateMethod("meals", mealData, lang);

      console.log("Create meal API Response:", response);

      // Handle response based on your API structure
      if (
        response?.data?.code === 200 ||
        response?.code === 200 ||
        response?.status === 201
      ) {
        toast.success(
          "Success!",
          response.data?.message ||
            response.message ||
            "Meal created successfully"
        );

        // Redirect to meals list page
        router.push("/meals");
      } else {
        toast.error(
          "Error",
          response?.data?.message ||
            response?.message ||
            "Failed to create meal"
        );
      }
    } catch (error: any) {
      console.error("Error creating meal:", error);
      toast.error(
        "Error",
        error.response?.data?.message || "Failed to create meal"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const fields = [
    [
      {
        name: "type",
        label: "Meal Type",
        type: "select",
        required: true,
        placeholder: "Select meal type...",
        options: [
          { value: "BREAKFAST", label: "Breakfast" },
          { value: "LAUNCH", label: "Lunch" },
          { value: "DINNER", label: "Dinner" },
          { value: "SNACK", label: "Snack" },
          { value: "OTHER", label: "Other" },
        ],
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
        cols: 1, // Full width
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
        validation: {
          maxFileSize: 5 * 1024 * 1024, // 5MB
          allowedTypes: ["image/jpeg", "image/jpg", "image/png", "image/webp"],
          custom: (value) => {
            return null;
          },
        },
        cols: 1, // Full width
      },
    ],
    [
      {
        name: "mealItems",
        label: "Meal Items",
        type: "mealItem",
        required: true,
        cols: 1, // Full width
      },
    ],
  ];

  const sections = [
    {
      title: "Basic Information",
      icon: "heroicons:document-text",
      description: "Enter the meal type and total calories",
    },
    {
      title: "Nutrition Facts",
      icon: "heroicons:chart-bar",
      description: "Enter the protein and fat content",
    },
    {
      title: "Additional Information",
      icon: "heroicons:information-circle",
      description: "Enter carbohydrates and upload meal image",
    },
    {
      title: "Meal Items",
      icon: "heroicons:list-bullet",
      description: "Add descriptions for each component of the meal",
    },
  ];

  const handleCancel = () => {
    router.back();
  };

  const initialData = {
    type: "",
    totalCalory: "",
    proteins: "",
    fat: "",
    carp: "",
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
        title="Create New Meal"
        description="Add a new meal to the system"
        initialData={initialData}
        fields={fields}
        sections={sections}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        showIdField={false}
        submitButtonText={t("Create Meal")}
        cancelButtonText={"Cancel"}
        isLoading={isSubmitting}
        submitButtonProps={{
          disabled: isSubmitting,
        }}
        // Pass meal items state and handlers
        mealItems={mealItems}
        onMealItemsChange={setMealItems}
      />
    </div>
  );
};

export default MealsCreateForm;
