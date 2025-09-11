"use client";
import React from "react";
import GenericUpdateForm from "../../../shared/GenericUpdateForm";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useTranslate } from "@/config/useTranslation";

const MealUpdateForm = ({ onClose }: { onClose?: () => void }) => {
  const handleSubmit = (data: Record<string, any>) => {
    console.log("Form submitted:", data);
    // Here you would typically send the data to your API
    if (onClose) onClose();
  };
  const router = useRouter();
  const { t } = useTranslate();

  const handleCancel = () => {
    if (onClose) onClose();
  };

  const initialData = {
    id: "MEAL-003",
    name: "Vegan Buddha Bowl",
    category: "dinner",
    calories: 380,
    protein: 22,
    carbs: 55,
    fat: 10,
    status: "active",
    featured: true,
    ingredients: ["Quinoa", "Sweet Potato", "Avocado", "Chickpeas", "Tahini"],
  };

  const categories = [
    "breakfast",
    "lunch",
    "dinner",
    "snack",
    "dessert",
    "smoothie",
  ];

  const statusOptions = ["active", "inactive"];

  const fields = [
    // Basic Information Section
    [
      {
        name: "id",
        label: "Meal ID",
        type: "text",
        placeholder: "e.g., MEAL-003",
        required: true,
        disabled: true,
        validation: {
          custom: (value) => {
            if (!value || value.trim() === "") return "Meal ID is required";
            return null;
          },
        },
      },
      {
        name: "name",
        label: "Meal Name",
        type: "text",
        placeholder: "e.g., Vegan Buddha Bowl",
        required: true,
        validation: {
          minLength: 2,
          maxLength: 100,
          custom: (value) => {
            if (!value || value.trim() === "") return "Meal name is required";
            if (value.length < 2)
              return "Meal name must be at least 2 characters";
            return null;
          },
        },
      },
      {
        name: "category",
        label: "Category",
        type: "select",
        options: categories,
        required: true,
        validation: {
          custom: (value) => {
            if (!value) return "Please select a category";
            return null;
          },
        },
      },
    ],

    // Nutritional Information Section
    [
      {
        name: "calories",
        label: "Calories (kcal)",
        type: "number",
        placeholder: "e.g., 380",
        required: true,
        validation: {
          min: 0,
          max: 2000,
          custom: (value) => {
            if (!value && value !== 0) return "Calories is required";
            const numValue = Number(value);
            if (isNaN(numValue)) return "Please enter a valid number";
            if (numValue < 0) return "Calories cannot be negative";
            if (numValue > 2000) return "Calories must be at most 2000";
            return null;
          },
        },
      },
      {
        name: "protein",
        label: "Protein (g)",
        type: "number",
        placeholder: "e.g., 22",
        required: true,
        validation: {
          min: 0,
          max: 100,
          custom: (value) => {
            if (!value && value !== 0) return "Protein is required";
            const numValue = Number(value);
            if (isNaN(numValue)) return "Please enter a valid number";
            if (numValue < 0) return "Protein cannot be negative";
            if (numValue > 100) return "Protein must be at most 100g";
            return null;
          },
        },
      },
      {
        name: "carbs",
        label: "Carbs (g)",
        type: "number",
        placeholder: "e.g., 55",
        required: true,
        validation: {
          min: 0,
          max: 200,
          custom: (value) => {
            if (!value && value !== 0) return "Carbs is required";
            const numValue = Number(value);
            if (isNaN(numValue)) return "Please enter a valid number";
            if (numValue < 0) return "Carbs cannot be negative";
            if (numValue > 200) return "Carbs must be at most 200g";
            return null;
          },
        },
      },
      {
        name: "fat",
        label: "Fat (g)",
        type: "number",
        placeholder: "e.g., 10",
        required: true,
        validation: {
          min: 0,
          max: 100,
          custom: (value) => {
            if (!value && value !== 0) return "Fat is required";
            const numValue = Number(value);
            if (isNaN(numValue)) return "Please enter a valid number";
            if (numValue < 0) return "Fat cannot be negative";
            if (numValue > 100) return "Fat must be at most 100g";
            return null;
          },
        },
      },
    ],

    // Additional Information Section
    [
      {
        name: "ingredients",
        label: "Ingredients",
        type: "textarea",
        placeholder: "Enter ingredients separated by commas",
        cols: 2,
        required: true,
        validation: {
          custom: (value) => {
            if (!value) return "Ingredients are required";
            if (typeof value === "string") {
              const ingredients = value.split(",").map((item) => item.trim());
              if (ingredients.length === 0)
                return "At least one ingredient is required";
            }
            return null;
          },
        },
      },
      {
        name: "status",
        label: "Status",
        type: "select",
        options: statusOptions,
        required: true,
        validation: {
          custom: (value) => {
            if (!value) return "Please select status";
            return null;
          },
        },
      },
      {
        name: "featured",
        label: "Featured Meal",
        type: "switch",
      },
    ],
  ];

  const sections = [
    { title: "Basic Information", icon: "heroicons:document-text" },
    {
      title: "Nutritional Information",
      icon: "heroicons:clipboard-document-list",
    },
    { title: "Additional Information", icon: "heroicons:clipboard-document" },
  ];

  return (
    <div className="space-y-4">
      {/* Back Button */}
      <div className="space-y-2">
        <Button
          onClick={() => router.back()}
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
        description="Update meal information"
        initialData={initialData}
        fields={fields}
        sections={sections}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        showIdField={true}
        idFieldLabel="Meal ID"
        isLoading={false}
      />
    </div>
  );
};

export default MealUpdateForm;
