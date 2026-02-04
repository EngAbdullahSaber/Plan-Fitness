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

  // Upload image first and get the URL
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
      setIsSubmitting(true);

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
        name: data.name,
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
          t("SUCCESS"),
          response.data?.message ||
            response.message ||
            t("MEAL_CREATED_SUCCESSFULLY"),
        );

        // Redirect to meals list page
        router.push("/meals");
      } else {
        toast.error(
          t("ERROR"),
          response?.data?.message ||
            response?.message ||
            t("FAILED_TO_CREATE_MEAL"),
        );
      }
    } catch (error: any) {
      console.error("Error creating meal:", error);
      toast.error(
        t("ERROR"),
        error.response?.data?.message || t("FAILED_TO_CREATE_MEAL"),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

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
        options: [
          { value: "BREAKFAST", label: t("BREAKFAST") },
          { value: "LAUNCH", label: t("LUNCH") },
          { value: "DINNER", label: t("DINNER") },
          { value: "SNACK", label: t("SNACK") },
          { value: "OTHER", label: t("OTHER") },
        ],
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
        cols: 1, // Full width
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
        label: t("MEAL_ITEMS"),
        type: "mealItem",
        required: true,
        cols: 1, // Full width
      },
    ],
  ];

  const sections = [
    {
      title: t("BASIC_INFORMATION"),
      icon: "heroicons:document-text",
      description: t("BASIC_INFORMATION_DESCRIPTION_MEAL"),
    },
    {
      title: t("NUTRITION_FACTS"),
      icon: "heroicons:chart-bar",
      description: t("NUTRITION_FACTS_DESCRIPTION"),
    },
    {
      title: t("ADDITIONAL_INFORMATION"),
      icon: "heroicons:information-circle",
      description: t("ADDITIONAL_INFORMATION_DESCRIPTION"),
    },
    {
      title: t("MEAL_ITEMS"),
      icon: "heroicons:list-bullet",
      description: t("MEAL_ITEMS_DESCRIPTION"),
    },
  ];

  const handleCancel = () => {
    router.back();
  };

  const initialData = {
    type: "",
    name: "",
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
        title={t("CREATE_NEW_MEAL")}
        description={t("CREATE_NEW_MEAL_DESCRIPTION")}
        initialData={initialData}
        fields={fields}
        sections={sections}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        showIdField={false}
        submitButtonText={t("CREATE_MEAL")}
        cancelButtonText={t("CANCEL")}
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
