"use client";
import React, { useState, useMemo } from "react";
import GenericCreateForm from "../../shared/GenericCreateForm";
import { Button } from "@/components/ui/button";
import { useRouter, useParams } from "next/navigation";
import {
  CreateMethod,
  CreateMethodFormData,
} from "@/app/services/apis/ApiMethod";
import toast from "react-hot-toast";
import { useTranslate } from "@/config/useTranslation";
import { baseUrl } from "@/app/services/app.config";

const CoachCreateForm = ({ onClose }: { onClose?: () => void }) => {
  const router = useRouter();
  const { lang } = useParams();
  const { t } = useTranslate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

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

  // ✅ Upload image and get the URL
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

      // Prepare coach data according to API requirements
      const coachData = {
        name: data.name,
        phone: data.phone,
        password: data.password,
        role: "coach",
        image: imageUrl ? baseUrl + imageUrl : "",
      };

      // Using CreateMethod to register coach
      const response = await CreateMethod("user/register", coachData, lang);

      if (response?.data?.code === 200 || response?.code === 200) {
        toast.success(
          response.data?.message ||
            response.message ||
            t("COACH_CREATED_SUCCESSFULLY"),
        );
        if (onClose) onClose();
        else router.push("/coach");
      } else {
        toast.error(
          response?.data?.message ||
            response?.message ||
            t("FAILED_TO_CREATE_COACH"),
        );
      }
    } catch (error: any) {
      console.error("Error creating coach:", error);
      toast.error(error.response?.data?.message || t("FAILED_TO_CREATE_COACH"));
    } finally {
      setIsSubmitting(false);
    }
  };

  // ✅ Handle form data changes
  const handleFormDataChange = (data: Record<string, any>) => {
    setFormData(data);
  };

  // ✅ Initial form values
  const initialData = {
    name: "",
    phone: "",
    password: "",
    image: "",
  };

  // ✅ Password toggle function
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // ✅ Dynamic fields
  const fields = useMemo(
    () => [
      // Basic Information
      [
        {
          name: "name",
          label: t("COACH_NAME"),
          type: "text",
          placeholder: t("ENTER_COACH_NAME"),
          required: true,
          description: t("COACH_NAME_DESCRIPTION"),
        },
        {
          name: "phone",
          label: t("PHONE_NUMBER"),
          type: "number",
          placeholder: t("ENTER_PHONE_NUMBER"),
          required: true,
          description: t("PHONE_NUMBER_DESCRIPTION"),
        },
      ],

      // Password
      [
        {
          name: "password",
          label: t("PASSWORD"),
          type: showPassword ? "text" : "password",
          placeholder: t("ENTER_PASSWORD"),
          required: true,
          description: t("PASSWORD_DESCRIPTION"),

          rightElement: (
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              {showPassword ? (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.59 6.59m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              )}
            </button>
          ),
        },
        {
          name: "confirmPassword",
          label: t("CONFIRM_PASSWORD"),
          type: showPassword ? "text" : "password",
          placeholder: t("CONFIRM_PASSWORD_PLACEHOLDER"),
          required: true,
          validation: {
            validate: (value: string) =>
              value === formData.password || t("PASSWORDS_DO_NOT_MATCH"),
          },
        },
      ],

      // Image Upload
      [
        {
          name: "image",
          label: t("COACH_IMAGE"),
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
          },
        },
        // Empty field to maintain grid structure
        {},
      ],
    ],
    [t, formData.password, showPassword],
  );

  // ✅ Dynamic section titles
  const sections = [
    {
      title: t("BASIC_INFORMATION"),
      icon: "heroicons:user-circle",
      description: t("COACH_BASIC_INFO_DESCRIPTION"),
      fieldsCount: 2,
    },
    {
      title: t("SECURITY"),
      icon: "heroicons:lock-closed",
      description: t("SECURITY_DESCRIPTION"),
      fieldsCount: 2,
    },
    {
      title: t("PROFILE_IMAGE"),
      icon: "heroicons:photograph",
      description: selectedImage
        ? t("IMAGE_UPLOADED_DESCRIPTION")
        : t("PROFILE_IMAGE_DESCRIPTION"),
      fieldsCount: 2,
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

      {/* ✅ Generic Create Form */}
      <GenericCreateForm
        title={t("ADD_NEW_COACH")}
        description={t("ADD_NEW_COACH_DESCRIPTION")}
        initialData={initialData}
        fields={fields}
        sections={sections}
        onSubmit={handleSubmit}
        onFormDataChange={handleFormDataChange}
        onCancel={onClose}
        submitButtonText={t("CREATE_COACH")}
        cancelButtonText={t("CANCEL")}
        isLoading={isSubmitting}
        submitButtonProps={{
          disabled: isSubmitting,
        }}
        imagePreview={imagePreview}
      />
    </div>
  );
};

export default CoachCreateForm;
