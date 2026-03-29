"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter, useParams } from "next/navigation";
import {
  GetSpecifiedMethod,
  UpdateMethod,
  CreateMethodFormData,
} from "@/app/services/apis/ApiMethod";
import toast from "react-hot-toast";
import { useTranslate } from "@/config/useTranslation";
import GenericUpdateForm from "../../../shared/GenericUpdateForm";
import { baseUrl } from "@/app/services/app.config";

interface Coach {
  id: string;
  name: string;
  phone: string;
  image: string;
  role: string;
  createdAt?: string;
  updatedAt?: string;
}

const CoachUpdateForm = () => {
  const router = useRouter();
  const { lang, id } = useParams(); // Get id from params
  const { t } = useTranslate();
  const [coachData, setCoachData] = useState<Coach | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // Fetch coach data from API
  const fetchCoach = async () => {
    try {
      setIsLoading(true);

      const response = await GetSpecifiedMethod(`user/detailed/${id}`, lang);

      if (response && response.data) {
        const coach = response.data.data || response.data;
        console.log("Fetched coach data:", coach); // Debug log

        setCoachData(coach);

        // Set existing image URL if available
        if (coach.image) {
          setExistingImageUrl(coach.image);
          setImagePreview(coach.image);
        }
      } else {
        toast.error(t("COACH_NOT_FOUND"));
      }
    } catch (error: any) {
      console.error("Error fetching coach:", error);
      toast.error(t("FAILED_TO_LOAD_COACH_DATA"));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchCoach();
    }
  }, [id, lang]);

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

  // Remove selected image and revert to existing image
  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(existingImageUrl); // Revert to existing image URL
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
        uploadResponse &&
        uploadResponse.data?.code === 200 &&
        uploadResponse.data?.data?.url
      ) {
        return uploadResponse.data.data.url;
      } else {
        toast.error(
          (uploadResponse && uploadResponse.data?.message) || t("FAILED_TO_UPLOAD_IMAGE"),
        );
        return null;
      }
    } catch (error: any) {
      console.error("Error uploading image:", error);
      toast.error(error.response?.data?.message || t("FAILED_TO_UPLOAD_IMAGE"));
      return null;
    }
  };

  // ✅ Password toggle function
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (data: Record<string, any>) => {
    try {
      setIsSubmitting(true);

      let imageUrl = existingImageUrl || "";

      // Upload new image if selected
      if (selectedImage) {
        const uploadedUrl = await uploadImage(selectedImage);
        if (!uploadedUrl) {
          // Stop submission if image upload failed
          setIsSubmitting(false);
          return;
        }
        imageUrl = baseUrl + uploadedUrl;
      }

      // Prepare coach data according to the API requirements
      const coachDataToUpdate: any = {
        name: data.name,
      };

      // Only include password if provided
      if (data.password && data.password.trim() !== "") {
        coachDataToUpdate.password = data.password;
      }

      if (imageUrl && imageUrl.trim() !== "") {
        coachDataToUpdate.image = imageUrl;
      }
      
      if (data.numberOFCoachTrainee !== undefined && data.numberOFCoachTrainee !== "") {
        coachDataToUpdate.numberOFCoachTrainee = parseInt(data.numberOFCoachTrainee);
      }

      if (data.startDate && data.startDate !== "") {
        coachDataToUpdate.startDate = data.startDate;
      }

      console.log("Coach data to update:", coachDataToUpdate);

      const response = await UpdateMethod(
        "user/coach",
        coachDataToUpdate,
        id,
        lang,
      );

      console.log("API Response:", response);

      // Handle response - UpdateMethod returns res.data
      if (response && (response.code === 200 || (response as any).data?.code === 200)) {
        toast.success(
          response.message || (response as any).data?.message || t("COACH_UPDATED_SUCCESSFULLY"),
        );
        router.push("/coach");
      } else {
        toast.error(
          (response && response.message) || (response && (response as any).data?.message) || t("FAILED_TO_UPDATE_COACH"),
        );
      }
    } catch (error: any) {
      console.error("Error updating coach:", error);
      toast.error(error.response?.data?.message || t("FAILED_TO_UPDATE_COACH"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const fields = [
    // Basic Information
    [
      {
        name: "name",
        label: t("COACH_NAME"),
        type: "text" as any,
        placeholder: t("ENTER_COACH_NAME"),
        required: true,
        description: t("COACH_NAME_DESCRIPTION"),
        validation: {
          minLength: 2,
          maxLength: 100,
          custom: (value: any) => {
            if (!value || value.trim() === "") return t("NAME_REQUIRED");
            if (value.length < 2) return t("NAME_MIN_LENGTH");
            if (value.length > 100) return t("NAME_MAX_LENGTH");
            return null;
          },
        },
      },
      {
        name: "phone",
        label: t("PHONE_NUMBER"),
        type: "text" as any,
        placeholder: coachData?.phone || "",
        required: false,
        disabled: true,
        description: t("PHONE_NUMBER_CANNOT_CHANGE"),
      },
      {
        name: "numberOFCoachTrainee",
        label: t("COACH_TRAINEES_LIMIT") || "Trainees Limit",
        type: "number" as any,
        placeholder: t("ENTER_TRAINEES_LIMIT") || "Enter trainees limit",
        required: false,
        description:
          t("COACH_TRAINEES_LIMIT_DESCRIPTION") ||
          "The maximum number of trainees this coach can handle",
      },
      {
        name: "startDate",
        label: t("START_DATE") || "Start Date",
        type: "date" as any,
        placeholder: t("ENTER_START_DATE") || "Select start date",
        required: false,
        description: t("START_DATE_DESCRIPTION") || "The official start date of the coach",
      },
    ],
    [
      // Password Update (Optional)
      {
        name: "password",
        label: t("NEW_PASSWORD"),
        type: (showPassword ? "text" : "password") as any,
        placeholder: t("ENTER_NEW_PASSWORD"),
        required: false,
        description: t("NEW_PASSWORD_DESCRIPTION"),
      },
    ],
    [
      // Image Upload
      {
        name: "image",
        label: t("COACH_IMAGE"),
        type: "image" as any,
        required: false,
        accept: "image/jpeg,image/jpg,image/png,image/webp",
        description: t("IMAGE_UPLOAD_DESCRIPTION_UPDATE"),
        onChange: handleImageChange,
      },
    ],
  ];

  const sections = [
    {
      title: t("BASIC_INFORMATION"),
      icon: "heroicons:user-circle",
      description: t("COACH_BASIC_INFO_UPDATE_DESCRIPTION"),
      fieldsCount: 2,
    },
    {
      title: t("PASSWORD_UPDATE"),
      icon: "heroicons:lock-closed",
      description: t("PASSWORD_UPDATE_DESCRIPTION"),
      fieldsCount: 2,
    },
    {
      title: t("PROFILE_IMAGE"),
      icon: "heroicons:photograph",
      description: selectedImage
        ? t("NEW_IMAGE_UPLOADED")
        : existingImageUrl
          ? t("EXISTING_IMAGE_IN_USE")
          : t("UPLOAD_NEW_IMAGE"),
      fieldsCount: 2,
    },
  ];

  const handleCancel = () => {
    router.back();
  };

  const handleFormDataChange = (data: Record<string, any>) => {
    // Handle any form data changes if needed
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#25235F] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">{t("LOADING_COACH_DATA")}</p>
        </div>
      </div>
    );
  }

  // Show error state if no data
  if (!coachData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <p className="text-gray-600 mb-4">{t("FAILED_TO_LOAD_COACH_DATA")}</p>
          <Button onClick={handleCancel}>{t("GO_BACK")}</Button>
        </div>
      </div>
    );
  }

  // Prepare initial data for the form
  const initialData = {
    id: coachData.id || id,
    name: coachData.name || "",
    phone: coachData.phone || "",
    password: "",
    confirmPassword: "",
    image: coachData.image || "",
    numberOFCoachTrainee: (coachData as any).numberOFCoachTrainee || "",
    startDate: (coachData as any).startDate || (coachData as any).createdAt?.split("T")[0] || "",
  };

  return (
    <div className="space-y-6">
      <GenericUpdateForm
        title={t("UPDATE_COACH")}
        description={t("UPDATE_COACH_DESCRIPTION")}
        initialData={initialData}
        fields={fields}
        sections={sections}
        onSubmit={handleSubmit}
        onFormDataChange={handleFormDataChange}
        onCancel={handleCancel}
        showIdField={true}
        idFieldLabel={t("COACH_ID")}
        submitButtonText={t("UPDATE_COACH_BUTTON")}
        cancelButtonText={t("CANCEL")}
        isLoading={isSubmitting}
        submitButtonProps={{
          disabled: isSubmitting,
        }}
      />
    </div>
  );
};

export default CoachUpdateForm;
