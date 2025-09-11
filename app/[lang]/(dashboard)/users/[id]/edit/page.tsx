"use client";
import React from "react";
import GenericUpdateForm from "../../../shared/GenericUpdateForm";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useTranslate } from "@/config/useTranslation";

const MemberUpdateForm = ({ onClose }: { onClose?: () => void }) => {
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
    id: `MEMBER-${Math.floor(1000 + Math.random() * 9000)}`,
    fullName: "",
    password: "",
    weight: "",
    age: "",
    height: "",
    chest: "",
    biceps: "",
    triceps: "",
    thigh: "",
    waist: "",
    belly: "",
    buttock: "",
    gender: "",
    totalSteps: "0",
    totalDaysTraining: "0",
    goal: "",
    sleepTime: "",
    bmi: "",
    caloriesBurnedLast7Days: "0",
    timeTrainingLast7Days: "0",
    email: "",
    phone: "",
    address: "",
    birthDate: "",
    status: "Active",
    membershipStatus: "Active",
    joinDate: new Date().toISOString().split("T")[0],
    lastCheckin: new Date().toISOString(),
    trainer: "",
    membershipPlan: "",
    role: "Standard Member",
    emergencyContact: "",
    emergencyPhone: "",
    notes: "",
    sendWelcomeEmail: true,
    agreeToTerms: false,
  };

  const membershipPlans = [
    "Premium Plus",
    "Premium",
    "Standard",
    "Basic",
    "Student",
    "Corporate",
    "Staff Membership",
  ];

  const trainers = [
    "Mike Thompson",
    "Lisa Rodriguez",
    "John Smith",
    "Emily Johnson",
    "Michael Brown",
    "Sarah Williams",
    "David Lee",
    "N/A",
  ];

  const roles = [
    "Premium Member",
    "Standard Member",
    "Trainer",
    "Admin",
    "Staff",
  ];

  const statusOptions = ["Active", "Inactive"];
  const membershipStatusOptions = ["Active", "Frozen", "Expired", "Staff"];
  const genderOptions = ["Male", "Female"];

  const fields = [
    // Personal Information Section
    [
      {
        name: "fullName",
        label: "Full Name",
        type: "text",
        placeholder: "Enter full name",
        required: true,
        validation: {
          minLength: 2,
          maxLength: 100,
          custom: (value) => {
            if (!value || value.trim() === "") return "Full name is required";
            if (value.length < 2)
              return "Full name must be at least 2 characters";
            if (!/^[a-zA-Z\s]+$/.test(value))
              return "Full name can only contain letters and spaces";
            return null;
          },
        },
      },
      {
        name: "password",
        label: "Password",
        type: "password",
        placeholder: "Set a password",
        required: true,
        validation: {
          minLength: 8,
          pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
          patternMessage:
            "Password must contain at least one lowercase letter, one uppercase letter, and one number",
          custom: (value) => {
            if (!value) return "Password is required";
            if (value.length < 8)
              return "Password must be at least 8 characters";
            if (!/(?=.*[a-z])/.test(value))
              return "Must contain at least one lowercase letter";
            if (!/(?=.*[A-Z])/.test(value))
              return "Must contain at least one uppercase letter";
            if (!/(?=.*\d)/.test(value))
              return "Must contain at least one number";
            return null;
          },
        },
      },
      {
        name: "email",
        label: "Email Address",
        type: "email",
        placeholder: "member@example.com",
        required: true,
        validation: {
          custom: (value) => {
            if (!value) return "Email address is required";
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value))
              return "Please enter a valid email address";
            return null;
          },
        },
      },
      {
        name: "phone",
        label: "Phone Number",
        type: "text",
        placeholder: "+1 (555) 123-4567",
        required: true,
        validation: {
          pattern: /^\+?[\d\s\-()]{10,}$/,
          patternMessage: "Please enter a valid phone number",
          custom: (value) => {
            if (!value) return "Phone number is required";
            const phoneRegex = /^\+?[\d\s\-()]{10,}$/;
            if (!phoneRegex.test(value))
              return "Please enter a valid phone number";
            return null;
          },
        },
      },
      {
        name: "birthDate",
        label: "Date of Birth",
        type: "date",
        required: true,
        validation: {
          custom: (value) => {
            if (!value) return "Date of birth is required";
            const birthDate = new Date(value);
            const today = new Date();
            const age = today.getFullYear() - birthDate.getFullYear();
            if (age < 16) return "Must be at least 16 years old";
            if (age > 100) return "Please enter a valid birth date";
            return null;
          },
        },
      },
      {
        name: "gender",
        label: "Gender",
        type: "radio",
        required: true,
        options: genderOptions,
        validation: {
          custom: (value) => {
            if (!value) return "Please select a gender";
            return null;
          },
        },
      },
      {
        name: "address",
        label: "Address",
        type: "textarea",
        placeholder: "Enter full address",
        cols: 2,
        required: true,
        validation: {
          minLength: 10,
          maxLength: 200,
          custom: (value) => {
            if (!value) return "Address is required";
            if (value.length < 10)
              return "Address must be at least 10 characters";
            return null;
          },
        },
      },
    ],

    // Physical Measurements Section
    [
      {
        name: "weight",
        label: "Weight (kg)",
        type: "number",
        placeholder: "e.g., 68.5",
        required: true,
        validation: {
          min: 20,
          max: 300,
          custom: (value) => {
            if (!value) return "Weight is required";
            const numValue = Number(value);
            if (isNaN(numValue)) return "Please enter a valid weight";
            if (numValue < 20) return "Weight must be at least 20 kg";
            if (numValue > 300) return "Weight must be at most 300 kg";
            return null;
          },
        },
      },
      {
        name: "height",
        label: "Height (cm)",
        type: "number",
        placeholder: "e.g., 172",
        required: true,
        validation: {
          min: 100,
          max: 250,
          custom: (value) => {
            if (!value) return "Height is required";
            const numValue = Number(value);
            if (isNaN(numValue)) return "Please enter a valid height";
            if (numValue < 100) return "Height must be at least 100 cm";
            if (numValue > 250) return "Height must be at most 250 cm";
            return null;
          },
        },
      },
      {
        name: "chest",
        label: "Chest (cm)",
        type: "number",
        placeholder: "e.g., 95",
        validation: {
          min: 50,
          max: 200,
          custom: (value) => {
            if (!value) return null;
            const numValue = Number(value);
            if (isNaN(numValue)) return "Please enter a valid measurement";
            if (numValue < 50)
              return "Chest measurement must be at least 50 cm";
            if (numValue > 200)
              return "Chest measurement must be at most 200 cm";
            return null;
          },
        },
      },
      {
        name: "biceps",
        label: "Biceps (cm)",
        type: "number",
        placeholder: "e.g., 35",
        validation: {
          min: 10,
          max: 100,
          custom: (value) => {
            if (!value) return null;
            const numValue = Number(value);
            if (isNaN(numValue)) return "Please enter a valid measurement";
            if (numValue < 10)
              return "Biceps measurement must be at least 10 cm";
            if (numValue > 100)
              return "Biceps measurement must be at most 100 cm";
            return null;
          },
        },
      },
      {
        name: "triceps",
        label: "Triceps (cm)",
        type: "number",
        placeholder: "e.g., 25",
        validation: {
          min: 10,
          max: 100,
          custom: (value) => {
            if (!value) return null;
            const numValue = Number(value);
            if (isNaN(numValue)) return "Please enter a valid measurement";
            if (numValue < 10)
              return "Triceps measurement must be at least 10 cm";
            if (numValue > 100)
              return "Triceps measurement must be at most 100 cm";
            return null;
          },
        },
      },
      {
        name: "thigh",
        label: "Thigh (cm)",
        type: "number",
        placeholder: "e.g., 55",
        validation: {
          min: 20,
          max: 150,
          custom: (value) => {
            if (!value) return null;
            const numValue = Number(value);
            if (isNaN(numValue)) return "Please enter a valid measurement";
            if (numValue < 20)
              return "Thigh measurement must be at least 20 cm";
            if (numValue > 150)
              return "Thigh measurement must be at most 150 cm";
            return null;
          },
        },
      },
      {
        name: "waist",
        label: "Waist (cm)",
        type: "number",
        placeholder: "e.g., 80",
        validation: {
          min: 40,
          max: 200,
          custom: (value) => {
            if (!value) return null;
            const numValue = Number(value);
            if (isNaN(numValue)) return "Please enter a valid measurement";
            if (numValue < 40)
              return "Waist measurement must be at least 40 cm";
            if (numValue > 200)
              return "Waist measurement must be at most 200 cm";
            return null;
          },
        },
      },
      {
        name: "belly",
        label: "Belly (cm)",
        type: "number",
        placeholder: "e.g., 85",
        validation: {
          min: 40,
          max: 200,
          custom: (value) => {
            if (!value) return null;
            const numValue = Number(value);
            if (isNaN(numValue)) return "Please enter a valid measurement";
            if (numValue < 40)
              return "Belly measurement must be at least 40 cm";
            if (numValue > 200)
              return "Belly measurement must be at most 200 cm";
            return null;
          },
        },
      },
      {
        name: "buttock",
        label: "Buttock (cm)",
        type: "number",
        placeholder: "e.g., 95",
        validation: {
          min: 40,
          max: 200,
          custom: (value) => {
            if (!value) return null;
            const numValue = Number(value);
            if (isNaN(numValue)) return "Please enter a valid measurement";
            if (numValue < 40)
              return "Buttock measurement must be at least 40 cm";
            if (numValue > 200)
              return "Buttock measurement must be at most 200 cm";
            return null;
          },
        },
      },
      {
        name: "bmi",
        label: "BMI",
        type: "number",
        step: 0.1,
        placeholder: "e.g., 23.1",
        validation: {
          min: 10,
          max: 50,
          custom: (value) => {
            if (!value) return null;
            const numValue = Number(value);
            if (isNaN(numValue)) return "Please enter a valid BMI";
            if (numValue < 10) return "BMI must be at least 10";
            if (numValue > 50) return "BMI must be at most 50";
            return null;
          },
        },
      },
      {
        name: "goal",
        label: "Fitness Goal",
        type: "textarea",
        placeholder: "e.g., Weight loss and muscle toning",
        cols: 2,
        validation: {
          maxLength: 500,
          custom: (value) => {
            if (!value) return null;
            if (value.length > 500)
              return "Goal must be less than 500 characters";
            return null;
          },
        },
      },
    ],

    // Membership Information Section
    [
      {
        name: "membershipPlan",
        label: "Membership Plan",
        type: "select",
        options: membershipPlans,
        required: true,
        validation: {
          custom: (value) => {
            if (!value) return "Please select a membership plan";
            return null;
          },
        },
      },
      {
        name: "role",
        label: "Role",
        type: "select",
        options: roles,
        required: true,
        validation: {
          custom: (value) => {
            if (!value) return "Please select a role";
            return null;
          },
        },
      },
      {
        name: "trainer",
        label: "Assigned Trainer",
        type: "select",
        options: trainers,
        validation: {
          custom: (value) => {
            if (!value) return "Please select a trainer";
            return null;
          },
        },
      },
      {
        name: "membershipStatus",
        label: "Membership Status",
        type: "select",
        options: membershipStatusOptions,
        required: true,
        validation: {
          custom: (value) => {
            if (!value) return "Please select membership status";
            return null;
          },
        },
      },
      {
        name: "joinDate",
        label: "Join Date",
        type: "date",
        required: true,
        validation: {
          custom: (value) => {
            if (!value) return "Join date is required";
            const joinDate = new Date(value);
            const today = new Date();
            if (joinDate > today) return "Join date cannot be in the future";
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
    ],

    // Emergency Contact Section
    [
      {
        name: "emergencyContact",
        label: "Emergency Contact Name",
        type: "text",
        placeholder: "Full name",
        required: true,
        validation: {
          minLength: 2,
          maxLength: 100,
          custom: (value) => {
            if (!value) return "Emergency contact name is required";
            if (value.length < 2) return "Name must be at least 2 characters";
            return null;
          },
        },
      },
      {
        name: "emergencyPhone",
        label: "Emergency Phone Number",
        type: "text",
        placeholder: "+1 (555) 123-4567",
        required: true,
        validation: {
          pattern: /^\+?[\d\s\-()]{10,}$/,
          patternMessage: "Please enter a valid phone number",
          custom: (value) => {
            if (!value) return "Emergency phone number is required";
            const phoneRegex = /^\+?[\d\s\-()]{10,}$/;
            if (!phoneRegex.test(value))
              return "Please enter a valid phone number";
            return null;
          },
        },
      },
    ],

    // Additional Information Section
    [
      {
        name: "notes",
        label: "Notes",
        type: "textarea",
        placeholder: "Any additional information about this member",
        cols: 2,
        validation: {
          maxLength: 1000,
          custom: (value) => {
            if (!value) return null;
            if (value.length > 1000)
              return "Notes must be less than 1000 characters";
            return null;
          },
        },
      },
      { name: "sendWelcomeEmail", label: "Send welcome email", type: "switch" },
      {
        name: "agreeToTerms",
        label: "I agree to terms and conditions",
        type: "switch",
        required: true,
        validation: {
          custom: (value) => {
            if (!value) return "You must agree to the terms and conditions";
            return null;
          },
        },
      },
    ],
  ];

  const sections = [
    { title: "Personal Information", icon: "heroicons:user" },
    {
      title: "Physical Measurements",
      icon: "heroicons:clipboard-document-list",
    },
    { title: "Membership Information", icon: "heroicons:identification" },
    { title: "Emergency Contact", icon: "heroicons:phone" },
    { title: "Additional Information", icon: "heroicons:clipboard-document" },
  ];

  return (
    <div className="space-y-4">
      {/* زر الرجوع */}
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
        title="Update Member"
        description="Update member information"
        initialData={initialData}
        fields={fields}
        sections={sections}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        showIdField={true}
        idFieldLabel="Member ID"
        isLoading={false}
      />
    </div>
  );
};

export default MemberUpdateForm;
