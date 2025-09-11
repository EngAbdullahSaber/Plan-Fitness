"use client";
import React from "react";
import GenericCreateForm from "../../shared/GenericCreateForm";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const MealCreateForm = ({ onClose }: { onClose?: () => void }) => {
  const router = useRouter();

  const handleSubmit = (data: Record<string, any>) => {
    console.log("Form submitted:", data);
    // Here you would typically send the data to your API
    if (onClose) onClose();
  };

  const initialData = {
    id: `MEAL-${Math.floor(1000 + Math.random() * 9000)}`,
    name: "",
    category: "",
    calories: "",
    protein: "",
    carbs: "",
    fat: "",
    status: "active",
    price: "",
    featured: false,
    ingredients: "",
  };

  const categories = ["breakfast", "lunch", "dinner", "snacks"];
  const statusOptions = ["active", "inactive"];

  const fields = [
    // Basic Information Section
    [
      {
        name: "name",
        label: "Meal Name",
        type: "text",
        placeholder: "Enter meal name",
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
      {
        name: "ingredients",
        label: "Ingredients",
        type: "textarea",
        placeholder: "Enter ingredients separated by commas",
        required: true,
        validation: {
          minLength: 3,
          custom: (value) => {
            if (!value) return "Ingredients are required";
            if (value.length < 3) return "Please enter at least one ingredient";
            return null;
          },
        },
      },
    ],

    // Nutritional Information Section
    [
      {
        name: "calories",
        label: "Calories",
        type: "number",
        placeholder: "e.g., 380",
        required: true,
        validation: {
          min: 0,
          max: 2000,
          custom: (value) => {
            if (!value) return "Calories are required";
            const numValue = Number(value);
            if (isNaN(numValue)) return "Please enter a valid number";
            if (numValue < 0) return "Calories must be positive";
            if (numValue > 2000) return "Calories must be less than 2000";
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
            if (!value) return "Protein is required";
            const numValue = Number(value);
            if (isNaN(numValue)) return "Please enter a valid number";
            if (numValue < 0) return "Protein must be positive";
            if (numValue > 100) return "Protein must be less than 100g";
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
            if (!value) return "Carbs are required";
            const numValue = Number(value);
            if (isNaN(numValue)) return "Please enter a valid number";
            if (numValue < 0) return "Carbs must be positive";
            if (numValue > 200) return "Carbs must be less than 200g";
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
            if (!value) return "Fat is required";
            const numValue = Number(value);
            if (isNaN(numValue)) return "Please enter a valid number";
            if (numValue < 0) return "Fat must be positive";
            if (numValue > 100) return "Fat must be less than 100g";
            return null;
          },
        },
      },
    ],

    // Pricing & Status Section
    [
      {
        name: "price",
        label: "Price ($)",
        type: "number",
        step: 0.01,
        placeholder: "e.g., 12.99",
        required: true,
        validation: {
          min: 0,
          max: 100,
          custom: (value) => {
            if (!value) return "Price is required";
            const numValue = Number(value);
            if (isNaN(numValue)) return "Please enter a valid price";
            if (numValue < 0) return "Price must be positive";
            if (numValue > 100) return "Price must be less than $100";
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
            if (!value) return "Please select a status";
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
    { title: "Basic Information", icon: "heroicons:clipboard-document-list" },
    { title: "Nutritional Information", icon: "heroicons:chart-bar" },
    { title: "Pricing & Status", icon: "heroicons:currency-dollar" },
  ];

  return (
    <div className="space-y-4">
      {/* Back button */}
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
          Back
        </Button>
      </div>
      <GenericCreateForm
        title="Add New Meal"
        description="Fill in the details below to add a new meal"
        initialData={initialData}
        fields={fields}
        sections={sections}
        onSubmit={handleSubmit}
        onCancel={onClose}
        submitButtonText="Create Meal"
        cancelButtonText="Cancel"
      />
    </div>
  );
};

export default MealCreateForm;
