"use client";
import React from "react";
import GenericCreateForm from "../../shared/GenericCreateForm";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const TrainingCreateForm = ({ onClose }: { onClose?: () => void }) => {
  const router = useRouter();

  const handleSubmit = (data: Record<string, any>) => {
    console.log("Form submitted:", data);
    // Here you would typically send the data to your API
    if (onClose) onClose();
  };

  const initialData = {
    id: `TRN-${Math.floor(1000 + Math.random() * 9000)}`,
    name: "",
    category: "",
    duration: "",
    difficulty: "",
    calories: "",
    status: "active",
    featured: false,
    exercises: [],
  };

  const categories = [
    "strength",
    "cardio",
    "flexibility",
    "endurance",
    "bodyweight",
  ];

  const difficulties = ["beginner", "intermediate", "advanced"];
  const statusOptions = ["active", "inactive"];

  const fields = [
    // Basic Information Section
    [
      {
        name: "name",
        label: "Training Program Name",
        type: "text",
        placeholder: "Enter program name",
        required: true,
        validation: {
          minLength: 2,
          maxLength: 100,
          custom: (value) => {
            if (!value || value.trim() === "")
              return "Program name is required";
            if (value.length < 2) return "Name must be at least 2 characters";
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
        name: "duration",
        label: "Duration (minutes)",
        type: "number",
        placeholder: "e.g., 30",
        required: true,
        validation: {
          min: 5,
          max: 180,
          custom: (value) => {
            if (!value) return "Duration is required";
            const numValue = Number(value);
            if (isNaN(numValue)) return "Please enter a valid duration";
            if (numValue < 5) return "Duration must be at least 5 minutes";
            if (numValue > 180) return "Duration must be at most 180 minutes";
            return null;
          },
        },
      },
      {
        name: "difficulty",
        label: "Difficulty Level",
        type: "select",
        options: difficulties,
        required: true,
        validation: {
          custom: (value) => {
            if (!value) return "Please select difficulty level";
            return null;
          },
        },
      },
      {
        name: "calories",
        label: "Calories Burned",
        type: "number",
        placeholder: "e.g., 420",
        required: true,
        validation: {
          min: 50,
          max: 1000,
          custom: (value) => {
            if (!value) return "Calories estimate is required";
            const numValue = Number(value);
            if (isNaN(numValue)) return "Please enter a valid number";
            if (numValue < 50) return "Must be at least 50 calories";
            if (numValue > 1000) return "Must be at most 1000 calories";
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
        label: "Featured Program",
        type: "switch",
        description: "Show this program as featured on the homepage",
      },
    ],

    // Exercises Section
    [
      {
        name: "exercises",
        label: "Exercises",
        type: "dynamic-list",
        placeholder: "Add exercise name",
        addButtonText: "Add Exercise",
        required: true,
        validation: {
          custom: (value) => {
            if (!value || value.length === 0)
              return "At least one exercise is required";
            if (value.length > 20) return "Maximum 20 exercises allowed";
            return null;
          },
        },
      },
    ],
  ];

  const sections = [
    { title: "Program Information", icon: "heroicons:academic-cap" },
    { title: "Exercises", icon: "heroicons:list-bullet" },
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
          Back
        </Button>
      </div>
      <GenericCreateForm
        title="Create Training Program"
        description="Fill in the details below to create a new training program"
        initialData={initialData}
        fields={fields}
        sections={sections}
        onSubmit={handleSubmit}
        onCancel={onClose}
        submitButtonText="Create Program"
        cancelButtonText="Cancel"
      />
    </div>
  );
};

export default TrainingCreateForm;
