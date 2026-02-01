"use client";
import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslate } from "@/config/useTranslation";
import { Icon } from "@iconify/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { SearchablePaginatedSelectContent } from "./SearchablePaginatedSelectContent";
import { SearchablePaginatedSelectContentUpdated } from "./SearchablePaginatedSelectContentUpdated";
import { useParams } from "next/navigation";

interface MealItem {
  description: {
    english: string;
    arabic: string;
  };
}

interface FormField {
  name: string;
  label: string;
  type:
    | "text"
    | "email"
    | "password"
    | "number"
    | "date"
    | "textarea"
    | "select"
    | "selectPagination"
    | "url"
    | "radio"
    | "switch"
    | "image"
    | "mealItem"; // Added mealItem type
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  options?: string[] | { value: string; label: string }[];
  step?: number;
  cols?: number;
  rows?: number;
  // Image specific props
  accept?: string;
  description?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  // Select Pagination specific props
  paginationOptions?: {
    data: any[];
    isLoading: boolean;
    hasMore?: boolean;
    searchTerm: string;
    onSearch: (search: string) => void;
    onLoadMore?: () => void;
    onOpen?: () => void;
    getOptionLabel: (item: any) => string;
    getOptionValue: (item: any) => string;
    searchPlaceholder?: string;
  };
  validation?: {
    pattern?: RegExp;
    min?: number;
    max?: number;
    minLength?: number;
    maxLength?: number;
    custom?: (value: any) => string | null;
    patternMessage?: string;
    // New validation options
    englishOnly?: boolean;
    arabicOnly?: boolean;
    // Image validation
    maxFileSize?: number; // in bytes
    allowedTypes?: string[];
  };
}

interface ValidationError {
  field: string;
  message: string;
}

interface GenericUpdateFormProps {
  title: string;
  description?: string;
  initialData: Record<string, any>;
  fields: FormField[][];
  onSubmit: (data: Record<string, any>) => void;
  onFormDataChange?: (data: Record<string, any>) => void;
  onCancel?: () => void;
  submitButtonText?: string;
  cancelButtonText?: string;
  sections?: {
    title: string;
    icon: string;
    description?: string;
  }[];
  validateForm?: (data: Record<string, any>) => ValidationError[];
  isLoading?: boolean;
  showIdField?: boolean;
  idFieldLabel?: string;
  submitButtonProps?: any;
  // New props for meal items management
  mealItems?: MealItem[];
  onMealItemsChange?: (items: MealItem[]) => void;
  onAddMealItem?: () => void;
  onRemoveMealItem?: (index: number) => void;
  onUpdateMealItem?: (
    index: number,
    field: "english" | "arabic",
    value: string,
  ) => void;
  imagePreview?: string;
}

const GenericUpdateForm: React.FC<GenericUpdateFormProps> = ({
  title,
  description,
  initialData,
  fields,
  onSubmit,
  onFormDataChange,
  onCancel,
  submitButtonText = "Update",
  cancelButtonText = "Cancel",
  sections = [],
  validateForm,
  isLoading = false,
  showIdField = true,
  idFieldLabel = "ID",
  submitButtonProps = {},
  // New props for meal items management
  mealItems = [],
  onMealItemsChange,
  onAddMealItem,
  onRemoveMealItem,
  onUpdateMealItem,
  imagePreview,
}) => {
  const { t, loading: translationLoading } = useTranslate();
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [showAllErrors, setShowAllErrors] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [imagePreviews, setImagePreviews] = useState<Record<string, string>>(
    {},
  );
  const [searchTerms, setSearchTerms] = useState<Record<string, string>>({});
  const { lang } = useParams();

  // Track changes to form data
  useEffect(() => {
    const hasChanged = Object.keys(initialData).some(
      (key) => formData[key] !== initialData[key],
    );
    setHasChanges(hasChanged);
  }, [formData, initialData]);

  // Initialize image previews from initial data and props
  useEffect(() => {
    const previews: Record<string, string> = {};
    fields.flat().forEach((field) => {
      if (field.type === "image" && formData[field.name]) {
        if (typeof formData[field.name] === "string") {
          previews[field.name] = formData[field.name];
        } else if (formData[field.name] instanceof File) {
          const reader = new FileReader();
          reader.onload = (e) => {
            setImagePreviews((prev) => ({
              ...prev,
              [field.name]: e.target?.result as string,
            }));
          };
          reader.readAsDataURL(formData[field.name]);
        }
      }
    });

    // Set image preview from props if provided
    if (imagePreview) {
      const imageField = fields.flat().find((field) => field.type === "image");
      if (imageField) {
        previews[imageField.name] = imagePreview;
      }
    }

    setImagePreviews(previews);
  }, [fields, formData, imagePreview]);

  // Validation functions for different character sets
  const validateEnglishCharacters = (value: string): boolean => {
    const englishRegex = /^[a-zA-Z0-9\s\-_.,!?@#$%^&*()+=<>[\]{}|\\:;"'`~]*$/;
    return englishRegex.test(value);
  };

  const validateArabicCharacters = (value: string): boolean => {
    const arabicRegex =
      /^[\u0600-\u06FF\s0-9\-_.,!?@#$%^&*()+=<>[\]{}|\\:;"'`~]*$/;
    return arabicRegex.test(value);
  };

  const validateImageFile = (field: FormField, file: File): string | null => {
    if (
      field.validation?.allowedTypes &&
      !field.validation.allowedTypes.includes(file.type)
    ) {
      const allowedTypes = field.validation.allowedTypes
        .map((type) => type.split("/")[1])
        .join(", ");
      return `Please select a valid image file (${allowedTypes})`;
    }

    if (
      field.validation?.maxFileSize &&
      file.size > field.validation.maxFileSize
    ) {
      const maxSizeMB = field.validation.maxFileSize / (1024 * 1024);
      return `Image size should be less than ${maxSizeMB}MB`;
    }

    return null;
  };

  const validateField = (field: FormField, value: any): string | null => {
    if (field.disabled) return null;

    if (field.required && (!value || value.toString().trim() === "")) {
      return `${field.label} is required`;
    }

    if (!value && !field.required) return null;

    const stringValue = value.toString();

    if (field.validation?.englishOnly && stringValue) {
      if (!validateEnglishCharacters(stringValue)) {
        return `${field.label} can only contain English characters, numbers, and common punctuation`;
      }
    }

    if (field.validation?.arabicOnly && stringValue) {
      if (!validateArabicCharacters(stringValue)) {
        return `${field.label} يمكن أن يحتوي فقط على أحرف عربية وأرقام وعلامات ترقيم شائعة`;
      }
    }

    if (field.type === "email" && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return "Please enter a valid email address";
      }
    }

    if (field.type === "number" && value) {
      const numValue = Number(value);
      if (isNaN(numValue)) {
        return "Please enter a valid number";
      }
      if (
        field.validation?.min !== undefined &&
        numValue < field.validation.min
      ) {
        return `Value must be at least ${field.validation.min}`;
      }
      if (
        field.validation?.max !== undefined &&
        numValue > field.validation.max
      ) {
        return `Value must be at most ${field.validation.max}`;
      }
    }

    if (field.validation?.pattern && value) {
      if (!field.validation.pattern.test(value)) {
        return field.validation.patternMessage || "Invalid format";
      }
    }

    if (
      field.validation?.minLength &&
      stringValue.length < field.validation.minLength
    ) {
      return `Must be at least ${field.validation.minLength} characters`;
    }

    if (
      field.validation?.maxLength &&
      stringValue.length > field.validation.maxLength
    ) {
      return `Must be at most ${field.validation.maxLength} characters`;
    }

    if (field.validation?.custom) {
      return field.validation.custom(value);
    }

    return null;
  };

  const validateAllFields = (): ValidationError[] => {
    const validationErrors: ValidationError[] = [];

    // Check if this form has meal item fields
    const hasMealItemField = fields
      .flat()
      .some((field) => field.type === "mealItem");
    const hasMealItemFunctionality = onMealItemsChange !== undefined;

    fields.flat().forEach((field) => {
      if (field.disabled) return;

      // Only skip validation for mealItem type if we're actually handling it separately
      if (field.type === "mealItem") return;

      const error = validateField(field, formData[field.name]);
      if (error) {
        validationErrors.push({ field: field.name, message: error });
      }
    });

    // Validate meal items ONLY if the form has meal item fields or meal item functionality
    if (hasMealItemField || hasMealItemFunctionality) {
      if (mealItems.length === 0) {
        validationErrors.push({
          field: "mealItems",
          message: "At least one meal item is required",
        });
      } else {
        mealItems.forEach((item, index) => {
          if (!item.description.english.trim()) {
            validationErrors.push({
              field: `mealItem_${index}_english`,
              message: `Meal item ${index + 1} English description is required`,
            });
          }
          if (!item.description.arabic.trim()) {
            validationErrors.push({
              field: `mealItem_${index}_arabic`,
              message: `Meal item ${index + 1} Arabic description is required`,
            });
          }
        });
      }
    }

    if (validateForm) {
      const customErrors = validateForm(formData);
      validationErrors.push(...customErrors);
    }

    return validationErrors;
  };

  const getFieldError = (fieldName: string): string | null => {
    const error = errors.find((err) => err.field === fieldName);
    return error ? error.message : null;
  };

  // Meal Items Handlers
  const handleAddMealItem = () => {
    if (onAddMealItem) {
      onAddMealItem();
    } else {
      const newItems = [
        ...mealItems,
        { description: { english: "", arabic: "" } },
      ];
      onMealItemsChange?.(newItems);
    }
  };

  const handleRemoveMealItem = (index: number) => {
    if (onRemoveMealItem) {
      onRemoveMealItem(index);
    } else {
      if (mealItems.length > 1) {
        const newItems = mealItems.filter((_, i) => i !== index);
        onMealItemsChange?.(newItems);

        // Clear errors for removed meal item
        setErrors((prev) =>
          prev.filter(
            (err) =>
              !err.field.startsWith(`mealItem_${index}_`) &&
              err.field !== `mealItem_${index}_english` &&
              err.field !== `mealItem_${index}_arabic`,
          ),
        );
      }
    }
  };

  const handleUpdateMealItem = (
    index: number,
    field: "english" | "arabic",
    value: string,
  ) => {
    if (onUpdateMealItem) {
      onUpdateMealItem(index, field, value);
    } else {
      const newItems = [...mealItems];
      newItems[index].description[field] = value;
      onMealItemsChange?.(newItems);

      // Clear error for this specific field when user starts typing
      const fieldName = `mealItem_${index}_${field}`;
      setErrors((prev) => prev.filter((err) => err.field !== fieldName));
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target;

    const currentField = fields.flat().find((f) => f.name === name);
    if (currentField?.disabled) return;

    if (type === "file") {
      const fileInput = e.target as HTMLInputElement;
      const file = fileInput.files?.[0];

      if (file) {
        if (currentField?.type === "image") {
          const validationError = validateImageFile(currentField, file);
          if (validationError) {
            setErrors((prev) => [
              ...prev.filter((err) => err.field !== name),
              { field: name, message: validationError },
            ]);
            return;
          }

          const reader = new FileReader();
          reader.onload = (e) => {
            setImagePreviews((prev) => ({
              ...prev,
              [name]: e.target?.result as string,
            }));
          };
          reader.readAsDataURL(file);
        }

        setFormData((prev) => ({ ...prev, [name]: file }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    if (touched[name] || showAllErrors) {
      if (currentField) {
        const error =
          type === "file" ? null : validateField(currentField, value);
        setErrors((prev) => {
          const newErrors = prev.filter((err) => err.field !== name);
          return error
            ? [...newErrors, { field: name, message: error }]
            : newErrors;
        });
      }
    }

    if (onFormDataChange) {
      const updatedData =
        type === "file"
          ? { ...formData, [name]: (e.target as HTMLInputElement).files?.[0] }
          : { ...formData, [name]: value };
      onFormDataChange(updatedData);
    }

    if (currentField?.onChange && type === "file") {
      currentField.onChange(e as React.ChangeEvent<HTMLInputElement>);
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    const currentField = fields.flat().find((f) => f.name === name);
    if (currentField?.disabled) return;

    setFormData((prev) => ({ ...prev, [name]: value }));

    if (touched[name] || showAllErrors) {
      if (currentField) {
        const error = validateField(currentField, value);
        setErrors((prev) => {
          const newErrors = prev.filter((err) => err.field !== name);
          return error
            ? [...newErrors, { field: name, message: error }]
            : newErrors;
        });
      }
    }

    if (onFormDataChange) {
      onFormDataChange({ ...formData, [name]: value });
    }
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    const currentField = fields.flat().find((f) => f.name === name);
    if (currentField?.disabled) return;

    setFormData((prev) => ({ ...prev, [name]: checked }));

    if (onFormDataChange) {
      onFormDataChange({ ...formData, [name]: checked });
    }
  };

  const handleRadioChange = (name: string, value: string) => {
    const currentField = fields.flat().find((f) => f.name === name);
    if (currentField?.disabled) return;

    setFormData((prev) => ({ ...prev, [name]: value }));

    if (onFormDataChange) {
      onFormDataChange({ ...formData, [name]: value });
    }

    if (touched[name] || showAllErrors) {
      if (currentField) {
        const error = validateField(currentField, value);
        setErrors((prev) => {
          const newErrors = prev.filter((err) => err.field !== name);
          return error
            ? [...newErrors, { field: name, message: error }]
            : newErrors;
        });
      }
    }
  };

  const handleSearchChange = (fieldName: string, search: string) => {
    setSearchTerms((prev) => ({ ...prev, [fieldName]: search }));

    const field = fields.flat().find((f) => f.name === fieldName);
    if (field?.paginationOptions?.onSearch) {
      field.paginationOptions.onSearch(search);
    }
  };

  const handleSelectOpen = (fieldName: string) => {
    const field = fields.flat().find((f) => f.name === fieldName);
    if (field?.paginationOptions?.onOpen) {
      field.paginationOptions.onOpen();
    }
  };

  const removeImage = (fieldName: string) => {
    const currentField = fields.flat().find((f) => f.name === fieldName);
    if (currentField?.disabled) return;

    setFormData((prev) => ({ ...prev, [fieldName]: null }));
    setImagePreviews((prev) => {
      const newPreviews = { ...prev };
      delete newPreviews[fieldName];
      return newPreviews;
    });

    const fileInput = document.getElementById(fieldName) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const handleBlur = (fieldName: string) => {
    setTouched((prev) => ({ ...prev, [fieldName]: true }));

    const field = fields.flat().find((f) => f.name === fieldName);
    if (field && field.type !== "image" && !field.disabled) {
      const error = validateField(field, formData[fieldName]);
      setErrors((prev) => {
        const newErrors = prev.filter((err) => err.field !== fieldName);
        return error
          ? [...newErrors, { field: fieldName, message: error }]
          : newErrors;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const allTouched: Record<string, boolean> = {};
    fields.flat().forEach((field) => {
      allTouched[field.name] = true;
    });
    setTouched(allTouched);
    setShowAllErrors(true);

    const validationErrors = validateAllFields();
    setErrors(validationErrors);

    if (validationErrors.length === 0) {
      onSubmit(formData);
    }
  };

  const handleReset = () => {
    setFormData(initialData);
    setErrors([]);
    setTouched({});
    setShowAllErrors(false);
    setHasChanges(false);
    setImagePreviews({});
  };

  // Render meal item field
  const renderMealItemField = (field: FormField) => {
    return (
      <div className="w-full space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-lg font-semibold text-[#25235F] dark:text-blue-300">
              {t(field.label)}
            </Label>
            {field.required && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {t(
                  "Add at least one meal item with descriptions in both English and Arabic",
                )}
              </p>
            )}
          </div>
          <Button
            type="button"
            onClick={handleAddMealItem}
            className="bg-green-600 dark:bg-green-700 hover:bg-green-700 dark:hover:bg-green-600 text-white"
          >
            <Icon icon="heroicons:plus" className="h-4 w-4 mr-2" />
            {t("Add Meal Item")}
          </Button>
        </div>

        {/* Meal Items List */}
        <div className="space-y-4">
          {mealItems.map((item, index) => (
            <Card
              key={index}
              className="border-2 border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-500 transition-colors relative overflow-hidden bg-white dark:bg-gray-800"
            >
              {/* Background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/20 to-purple-50/20 dark:from-blue-900/10 dark:to-purple-900/10 pointer-events-none" />

              <CardContent className="p-6 relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                    <Icon
                      icon="heroicons:list-bullet"
                      className="h-5 w-5 text-blue-600 dark:text-blue-400"
                    />
                    {t("Meal Item")} {index + 1}
                  </h4>
                  {mealItems.length > 1 && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => handleRemoveMealItem(index)}
                      className="hover:scale-105 transition-transform"
                    >
                      <Icon icon="heroicons:trash" className="h-4 w-4 mr-1" />
                      {t("Remove")}
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* English Description */}
                  <div className="space-y-3">
                    <Label
                      htmlFor={`mealItem_${index}_english`}
                      className="text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      {t("English Description")} *
                    </Label>
                    <Textarea
                      id={`mealItem_${index}_english`}
                      value={item.description.english}
                      onChange={(e) =>
                        handleUpdateMealItem(index, "english", e.target.value)
                      }
                      placeholder="Enter meal item description in English"
                      className="min-h-[100px] resize-none border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-900/30 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                      dir="ltr"
                    />
                    {errors.some(
                      (err) => err.field === `mealItem_${index}_english`,
                    ) && (
                      <p className="text-red-500 dark:text-red-400 text-sm flex items-center gap-1">
                        <Icon
                          icon="heroicons:exclamation-triangle"
                          className="h-4 w-4"
                        />
                        {
                          errors.find(
                            (err) => err.field === `mealItem_${index}_english`,
                          )?.message
                        }
                      </p>
                    )}
                  </div>

                  {/* Arabic Description */}
                  <div className="space-y-3">
                    <Label
                      htmlFor={`mealItem_${index}_arabic`}
                      className="text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      {t("Arabic Description")} *
                    </Label>
                    <Textarea
                      id={`mealItem_${index}_arabic`}
                      value={item.description.arabic}
                      onChange={(e) =>
                        handleUpdateMealItem(index, "arabic", e.target.value)
                      }
                      placeholder="أدخل وصف عنصر الوجبة بالعربية"
                      className="min-h-[100px] resize-none border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-900/30 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-right"
                      dir="rtl"
                    />
                    {errors.some(
                      (err) => err.field === `mealItem_${index}_arabic`,
                    ) && (
                      <p className="text-red-500 dark:text-red-400 text-sm flex items-center gap-1">
                        <Icon
                          icon="heroicons:exclamation-triangle"
                          className="h-4 w-4"
                        />
                        {
                          errors.find(
                            (err) => err.field === `mealItem_${index}_arabic`,
                          )?.message
                        }
                      </p>
                    )}
                  </div>
                </div>

                {/* Character counts */}
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
                  <span>English: {item.description.english.length}/500</span>
                  <span>العربية: {item.description.arabic.length}/500</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {mealItems.length === 0 && (
          <Card className="border-2 border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/50 text-center">
            <CardContent className="p-8">
              <Icon
                icon="heroicons:clipboard-document-list"
                className="h-16 w-16 text-gray-400 dark:text-gray-500 mx-auto mb-4"
              />
              <h4 className="text-lg font-semibold text-gray-600 dark:text-gray-300 mb-2">
                {t("No Meal Items Added")}
              </h4>
              <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
                {t(
                  "Add meal items to describe the components of this meal. Each item should have descriptions in both English and Arabic languages",
                )}
              </p>
              <Button
                type="button"
                onClick={handleAddMealItem}
                className="bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-600 px-6 py-3"
              >
                <Icon icon="heroicons:plus" className="h-5 w-5 mr-2" />
                {t("Add Your First Meal Item")}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Validation error for empty meal items */}
        {errors.some((err) => err.field === "mealItems") &&
          mealItems.length === 0 && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-600 dark:text-red-400 text-sm flex items-center gap-2">
                <Icon
                  icon="heroicons:exclamation-triangle"
                  className="h-4 w-4"
                />
                {errors.find((err) => err.field === "mealItems")?.message}
              </p>
            </div>
          )}
      </div>
    );
  };

  const renderField = (field: FormField) => {
    // Handle mealItem type separately
    if (field.type === "mealItem") {
      return renderMealItemField(field);
    }

    const error = getFieldError(field.name);
    const showError = (touched[field.name] || showAllErrors) && error;
    const inputDirection = field.validation?.arabicOnly ? "rtl" : "ltr";
    const textAlignment = field.validation?.arabicOnly
      ? "text-right"
      : "text-left";
    const disabledStyles = field.disabled
      ? "opacity-60 cursor-not-allowed bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
      : "";

    // Move hooks to the top level
    const [isFocused, setIsFocused] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const hasValue =
      formData[field.name] && formData[field.name].toString().length > 0;
    const isFloating = isFocused || hasValue;
    const hasImage = imagePreviews[field.name] || formData[field.name];

    // Drag handlers for image field
    const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const files = e.dataTransfer.files;
      if (files && files[0]) {
        const syntheticEvent = {
          target: {
            name: field.name,
            files: files,
          },
        } as any;
        handleInputChange(syntheticEvent);
      }
    };

    switch (field.type) {
      case "text":
      case "email":
      case "password":
      case "url":
      case "date":
        return (
          <div className="w-full group">
            <div className="relative">
              <div className="relative">
                <Input
                  id={field.name}
                  name={field.name}
                  type={field.type}
                  value={formData[field.name] || ""}
                  onChange={handleInputChange}
                  onFocus={() => !field.disabled && setIsFocused(true)}
                  onBlur={(e) => {
                    setIsFocused(false);
                    handleBlur(field.name);
                  }}
                  required={field.required && !field.disabled}
                  placeholder={isFloating ? field.placeholder : ""}
                  step={field.step}
                  disabled={field.disabled || isLoading}
                  className={`
                    peer w-full h-14 px-4 pt-6 pb-2 rounded-xl border-2 transition-all duration-300
                    ${
                      showError
                        ? "border-red-400 dark:border-red-500 focus:border-red-500 dark:focus:border-red-400 focus:ring-4 focus:ring-red-100 dark:focus:ring-red-900/30 bg-red-50/30 dark:bg-red-900/20"
                        : field.disabled
                          ? "border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
                          : "border-gray-300 dark:border-gray-600 focus:border-[#25235F] dark:focus:border-blue-500 focus:ring-4 focus:ring-[#25235F]/20 dark:focus:ring-blue-900/30 hover:border-gray-400 dark:hover:border-gray-500 bg-white dark:bg-gray-900"
                    }
                    ${disabledStyles}
                    placeholder:text-gray-400 dark:placeholder:text-gray-500 
                    text-gray-700 dark:text-gray-200 font-medium
                  `}
                />

                <Label
                  htmlFor={field.name}
                  className={`
                    absolute ${lang == "en" ? "left-4" : "right-4"} transition-all duration-200 pointer-events-none 
                    ${
                      field.disabled
                        ? "text-gray-500 dark:text-gray-400"
                        : "text-gray-700 dark:text-gray-300"
                    } 
                    ${
                      isFloating
                        ? "top-1.5 text-xs font-semibold text-[#25235F] dark:text-blue-400"
                        : "top-1/2 -translate-y-1/2 text-base text-gray-500 dark:text-gray-400"
                    }
                  `}
                >
                  {t(field.label)}{" "}
                  {field.required && !field.disabled && (
                    <span className="text-red-500 dark:text-red-400">*</span>
                  )}
                  {field.disabled && (
                    <span className="text-gray-400 dark:text-gray-500 ml-1">
                      (Disabled)
                    </span>
                  )}
                </Label>

                <div
                  className={`
                    absolute ${lang == "en" ? "right-4" : "left-4"} top-1/2 -translate-y-1/2 transition-all duration-300 
                    ${
                      field.disabled
                        ? "text-gray-400 dark:text-gray-500"
                        : hasValue && !showError
                          ? "text-emerald-500 dark:text-emerald-400"
                          : showError
                            ? "text-red-500 dark:text-red-400"
                            : "text-gray-400 dark:text-gray-500"
                    }
                  `}
                >
                  {field.disabled ? (
                    <Icon icon="heroicons:lock-closed" className="h-5 w-5" />
                  ) : hasValue && !showError ? (
                    <Icon icon="heroicons:check-circle" className="h-5 w-5" />
                  ) : showError ? (
                    <Icon
                      icon="heroicons:exclamation-circle"
                      className="h-5 w-5"
                    />
                  ) : null}
                </div>
              </div>

              {showError && (
                <p className="mt-2 text-red-500 dark:text-red-400 text-sm flex items-center gap-1.5">
                  <Icon
                    icon="heroicons:exclamation-triangle"
                    className="h-4 w-4"
                  />
                  {t(error)}
                </p>
              )}
            </div>
          </div>
        );

      case "textarea":
        const charCount = formData[field.name]?.length || 0;
        const maxLength = field.validation?.maxLength || 1000;

        return (
          <div className="w-full space-y-2">
            <div className="flex items-center justify-between">
              <Label
                htmlFor={field.name}
                className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300"
              >
                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500" />
                {t(field.label)}
                {field.required && !field.disabled && (
                  <span className="text-red-500 dark:text-red-400">*</span>
                )}
                {field.disabled && (
                  <span className="text-gray-400 dark:text-gray-500 text-xs ml-1">
                    (Disabled)
                  </span>
                )}
              </Label>
              <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                {charCount}/{maxLength}
              </span>
            </div>

            <div className="relative group">
              <Textarea
                id={field.name}
                name={field.name}
                value={formData[field.name] || ""}
                onChange={handleInputChange}
                onBlur={() => handleBlur(field.name)}
                placeholder={field.placeholder}
                dir={inputDirection}
                maxLength={maxLength}
                rows={field.rows || 4}
                disabled={field.disabled || isLoading}
                className={`
                  w-full min-h-[100px] px-4 py-3 rounded-xl border-2 transition-all duration-300 resize-none ${textAlignment}
                  ${
                    showError
                      ? "border-red-400 dark:border-red-500 focus:border-red-500 dark:focus:border-red-400 focus:ring-2 focus:ring-red-200 dark:focus:ring-red-900/30 bg-red-50/30 dark:bg-red-900/20"
                      : field.disabled
                        ? "border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
                        : "border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900/30 hover:border-gray-400 dark:hover:border-gray-500 bg-white dark:bg-gray-900"
                  }
                  ${disabledStyles}
                  placeholder:text-gray-400 dark:placeholder:text-gray-500
                  focus:shadow-lg focus:shadow-blue-100/50 dark:focus:shadow-blue-900/20
                  text-gray-700 dark:text-gray-200
                `}
              />

              {!field.disabled && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 scale-x-0 group-focus-within:scale-x-100 transition-transform duration-300" />
              )}
            </div>

            {showError && (
              <p className="text-red-500 dark:text-red-400 text-sm flex items-center gap-1.5">
                <Icon
                  icon="heroicons:exclamation-triangle"
                  className="h-4 w-4"
                />
                {error}
              </p>
            )}
          </div>
        );

      case "number":
        return (
          <div className="w-full group">
            <div className="relative">
              <div className="relative">
                <Input
                  id={field.name}
                  name={field.name}
                  type={field.type}
                  value={formData[field.name] || ""}
                  onChange={handleInputChange}
                  onFocus={() => !field.disabled && setIsFocused(true)}
                  onBlur={(e) => {
                    setIsFocused(false);
                    handleBlur(field.name);
                  }}
                  required={field.required && !field.disabled}
                  placeholder={isFloating ? field.placeholder : ""}
                  step={field.step}
                  disabled={field.disabled || isLoading}
                  className={`
                    peer w-full h-14 px-4 pt-6 pb-2 rounded-xl border-2 transition-all duration-300
                    ${
                      showError
                        ? "border-red-400 dark:border-red-500 focus:border-red-500 dark:focus:border-red-400 focus:ring-4 focus:ring-red-100 dark:focus:ring-red-900/30 bg-red-50/30 dark:bg-red-900/20"
                        : field.disabled
                          ? "border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                          : "border-gray-300 dark:border-gray-600 focus:border-[#25235F] dark:focus:border-blue-500 focus:ring-4 focus:ring-[#25235F]/20 dark:focus:ring-blue-900/30 hover:border-gray-400 dark:hover:border-gray-500 bg-white dark:bg-gray-900"
                    }
                    ${disabledStyles}
                    placeholder:text-gray-400 dark:placeholder:text-gray-500 
                    text-gray-700 dark:text-gray-200 font-medium
                  `}
                />

                <Label
                  htmlFor={field.name}
                  className={`
                    absolute left-4 transition-all duration-200 pointer-events-none 
                    ${
                      field.disabled
                        ? "text-gray-500 dark:text-gray-400"
                        : "text-gray-700 dark:text-gray-300"
                    } 
                    ${
                      isFloating
                        ? "top-1.5 text-xs font-semibold text-[#25235F] dark:text-blue-400"
                        : "top-1/2 -translate-y-1/2 text-base text-gray-500 dark:text-gray-400"
                    }
                  `}
                >
                  {t(field.label)}{" "}
                  {field.required && !field.disabled && (
                    <span className="text-red-500 dark:text-red-400">*</span>
                  )}
                  {field.disabled && (
                    <span className="text-gray-400 dark:text-gray-500 ml-1">
                      (Disabled)
                    </span>
                  )}
                </Label>

                <div
                  className={`
                    absolute right-4 top-1/2 -translate-y-1/2 transition-all duration-300 
                    ${
                      field.disabled
                        ? "text-gray-400 dark:text-gray-500"
                        : hasValue && !showError
                          ? "text-emerald-500 dark:text-emerald-400"
                          : showError
                            ? "text-red-500 dark:text-red-400"
                            : "text-gray-400 dark:text-gray-500"
                    }
                  `}
                >
                  {field.disabled ? (
                    <Icon icon="heroicons:lock-closed" className="h-5 w-5" />
                  ) : hasValue && !showError ? (
                    <Icon icon="heroicons:check-circle" className="h-5 w-5" />
                  ) : showError ? (
                    <Icon
                      icon="heroicons:exclamation-circle"
                      className="h-5 w-5"
                    />
                  ) : null}
                </div>
              </div>

              {field.disabled && field.description && (
                <p className="mt-2 text-gray-500 dark:text-gray-400 text-sm flex items-center gap-1.5">
                  <Icon
                    icon="heroicons:information-circle"
                    className="w-4 h-4 text-gray-400 dark:text-gray-500"
                  />
                  {field.description}
                </p>
              )}

              {showError && (
                <p className="mt-2 text-red-500 dark:text-red-400 text-sm flex items-center gap-1.5">
                  <Icon
                    icon="heroicons:exclamation-triangle"
                    className="h-4 w-4"
                  />
                  {t(error)}
                </p>
              )}
            </div>
          </div>
        );

      case "select":
        return (
          <div className="w-full">
            <Label
              htmlFor={field.name}
              className="text-[#25235F] dark:text-blue-300 font-medium"
            >
              {t(field.label)} {field.required && !field.disabled && "*"}
              {field.disabled && (
                <span className="text-gray-400 dark:text-gray-500 text-sm ml-1">
                  (Disabled)
                </span>
              )}
            </Label>
            <Select
              value={formData[field.name] || ""}
              onValueChange={(value) => handleSelectChange(field.name, value)}
              onBlur={() => handleBlur(field.name)}
              disabled={field.disabled || isLoading}
            >
              <SelectTrigger
                className={`
                  h-14 border-2 transition-all duration-300 ${textAlignment}
                  ${
                    showError
                      ? "border-red-500 dark:border-red-400 focus:border-red-500 dark:focus:border-red-400 focus:ring-red-500 dark:focus:ring-red-900/30"
                      : field.disabled
                        ? "border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                        : "border-gray-300 dark:border-gray-600 focus:border-[#25235F] dark:focus:border-blue-500 focus:ring-[#25235F] dark:focus:ring-blue-900/30"
                  }
                  ${disabledStyles}
                  bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100
                `}
              >
                <SelectValue
                  placeholder={
                    field.placeholder || `Select ${field.label.toLowerCase()}`
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map((option) => {
                  const value =
                    typeof option === "string" ? option : option.value;
                  const label =
                    typeof option === "string" ? option : option.label;
                  return (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
            {showError && (
              <p className="text-red-500 dark:text-red-400 text-sm mt-1">
                {t(error)}
              </p>
            )}
          </div>
        );

      case "selectPagination":
        const selectedOption = field.paginationOptions?.data?.find(
          (item) => item.value == formData[field.name],
        );

        return (
          <div className="w-full">
            <Label
              htmlFor={field.name}
              className="text-[#25235F] dark:text-blue-300 font-medium"
            >
              {t(field.label)} {field.required && "*"}
            </Label>

            <Select
              value={formData[field.name] || ""}
              onValueChange={(value) => handleSelectChange(field.name, value)}
              onOpenChange={(open) => {
                if (open) {
                  handleSelectOpen(field.name);
                }
              }}
            >
              <SelectTrigger
                className="
                h-14 group relative border-2 border-gray-200 dark:border-gray-700 
                focus:border-purple-500 dark:focus:border-purple-400 
                focus:ring-4 focus:ring-purple-100 dark:focus:ring-purple-900/30 
                bg-gradient-to-br from-white dark:from-gray-900 via-purple-50/30 dark:via-purple-900/10 to-white dark:to-gray-900 
                backdrop-blur-sm transition-all duration-300 
                hover:shadow-lg hover:shadow-purple-100/50 dark:hover:shadow-purple-900/30 
                hover:-translate-y-0.5 py-3 px-4 rounded-xl font-medium
              "
              >
                <div className="flex items-center gap-3 w-full">
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse delay-100" />
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse delay-200" />
                  </div>
                  <SelectValue
                    placeholder={
                      <span className="text-gray-500 dark:text-gray-400 font-normal flex items-center gap-2">
                        <span className="text-lg">🔍</span>
                        {field.placeholder ||
                          `Select ${field.label.toLowerCase()}`}
                      </span>
                    }
                  >
                    {selectedOption ? (
                      <span className="text-gray-900 dark:text-gray-100 font-medium">
                        {field.paginationOptions?.getOptionLabel(
                          selectedOption,
                        )}
                      </span>
                    ) : null}
                  </SelectValue>
                </div>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-400/0 via-blue-400/0 to-purple-400/0 group-hover:from-purple-400/5 group-hover:via-blue-400/5 group-hover:to-purple-400/5 dark:group-hover:from-purple-500/10 dark:group-hover:via-blue-500/10 dark:group-hover:to-purple-500/10 transition-all duration-500 pointer-events-none" />
              </SelectTrigger>

              <SearchablePaginatedSelectContent
                onLoadMore={field.paginationOptions?.onLoadMore}
                onSearch={(search) => handleSearchChange(field.name, search)}
                isLoading={field.paginationOptions?.isLoading || false}
                hasMore={field.paginationOptions?.hasMore}
                placeholder={
                  field.paginationOptions?.searchPlaceholder || "Search..."
                }
              >
                <div className="sticky top-0 z-10 px-4 py-3 bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 bg-size-200 animate-gradient">
                  <p className="text-xs font-semibold text-white/90 uppercase tracking-wider">
                    {field.label}
                  </p>
                </div>

                <SelectItem
                  value=""
                  className="
                    mx-2 my-2 rounded-xl 
                    hover:bg-gradient-to-r 
                    hover:from-purple-50 dark:hover:from-purple-900/30 
                    hover:to-blue-50 dark:hover:to-blue-900/30 
                    transition-all duration-200 
                    border-b-2 border-gray-100 dark:border-gray-800 
                    pb-3 font-semibold 
                    text-gray-700 dark:text-gray-300 
                    hover:text-purple-600 dark:hover:text-purple-400 
                    hover:shadow-sm dark:hover:shadow-gray-900/50
                    bg-white dark:bg-gray-900
                  "
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 to-blue-500" />
                    {t("All")} {field.label}
                  </div>
                </SelectItem>

                <div className="px-2 space-y-1">
                  {field.paginationOptions?.data?.map((item, index) => (
                    <SelectItem
                      key={`${field.paginationOptions?.getOptionValue(
                        item,
                      )}-${index}`}
                      value={field.paginationOptions?.getOptionValue(item)}
                      className="
                        rounded-xl 
                        hover:bg-gradient-to-r 
                        hover:from-purple-50 dark:hover:from-purple-900/30 
                        hover:via-blue-50/50 dark:hover:via-blue-900/20 
                        hover:to-purple-50 dark:hover:to-purple-900/30 
                        transition-all duration-200 
                        hover:shadow-sm dark:hover:shadow-gray-900/50 
                        hover:scale-[1.02] 
                        py-3 px-3 cursor-pointer 
                        group border border-transparent hover:border-purple-100 dark:hover:border-purple-800
                        bg-white dark:bg-gray-900
                      "
                      style={{
                        animationDelay: `${index * 30}ms`,
                      }}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="font-medium text-gray-700 dark:text-gray-300 group-hover:text-purple-700 dark:group-hover:text-purple-400 transition-colors">
                          {field.paginationOptions?.getOptionLabel(item)}
                        </span>
                        <div className="w-1.5 h-1.5 rounded-full bg-purple-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </SelectItem>
                  ))}
                </div>
              </SearchablePaginatedSelectContent>
            </Select>

            {showError && (
              <p className="text-red-500 dark:text-red-400 text-sm mt-1">
                {error}
              </p>
            )}
          </div>
        );

      case "image":
        return (
          <div className="w-full group">
            <Label
              htmlFor={field.name}
              className="flex items-center gap-2 mb-3 text-sm font-semibold text-[#25235F] dark:text-blue-300 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors"
            >
              <Icon
                icon="heroicons:photo"
                className="h-5 w-5 text-blue-600 dark:text-blue-400"
              />
              <span>{t(field.label)}</span>
            </Label>

            {hasImage && (
              <div className="mb-4 p-5 rounded-2xl bg-gradient-to-br from-white dark:from-gray-900 via-blue-50/30 dark:via-blue-900/10 to-purple-50/30 dark:to-purple-900/10 border-2 border-blue-200 dark:border-blue-800 shadow-lg dark:shadow-gray-900/50 animate-in slide-in-from-top-2">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                    <Icon
                      icon="heroicons:check-circle"
                      className="h-4 w-4 text-emerald-600 dark:text-emerald-500"
                    />
                    {t("Image Uploaded")}
                  </h4>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeImage(field.name)}
                    className="
                      text-red-600 dark:text-red-400 
                      hover:text-white hover:bg-gradient-to-r 
                      hover:from-red-500 hover:to-pink-500 
                      border-red-300 dark:border-red-700 
                      hover:border-red-500 
                      transition-all duration-300 
                      font-semibold shadow-sm hover:shadow-md
                      bg-white dark:bg-gray-800
                    "
                  >
                    <Icon icon="heroicons:trash" className="h-4 w-4 mr-1" />
                    {t("Remove")}
                  </Button>
                </div>

                <div className="flex flex-col md:flex-row gap-6">
                  <div className="relative group/img">
                    <div className="w-full md:w-48 h-48 rounded-xl overflow-hidden border-2 border-gray-200 dark:border-gray-700 shadow-md dark:shadow-gray-900/50 hover:shadow-xl transition-shadow">
                      <img
                        src={imagePreviews[field.name]}
                        alt="Preview"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-110"
                      />
                    </div>
                  </div>

                  {formData[field.name] && (
                    <div className="flex-1 space-y-3">
                      <div className="p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-500 transition-colors">
                        <div className="flex items-center gap-2 mb-1">
                          <Icon
                            icon="heroicons:document-text"
                            className="w-4 h-4 text-blue-600 dark:text-blue-400"
                          />
                          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                            {t("File Name")}
                          </span>
                        </div>
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                          {(formData[field.name] as File)?.name || field.label}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-500 transition-colors">
                          <div className="flex items-center gap-2 mb-1">
                            <Icon
                              icon="heroicons:archive-box"
                              className="w-4 h-4 text-purple-600 dark:text-purple-400"
                            />
                            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                              {t("Size")}
                            </span>
                          </div>
                          <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                            {(
                              ((formData[field.name] as File)?.size || 0) /
                              1024 /
                              1024
                            ).toFixed(2)}{" "}
                            {t("MB")}
                          </p>
                        </div>

                        <div className="p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-emerald-300 dark:hover:border-emerald-500 transition-colors">
                          <div className="flex items-center gap-2 mb-1">
                            <Icon
                              icon="heroicons:photo"
                              className="w-4 h-4 text-emerald-600 dark:text-emerald-400"
                            />
                            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                              {t("Type")}
                            </span>
                          </div>
                          <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                            {formData[field.name] &&
                            (formData[field.name] as File)?.type
                              ? (formData[field.name] as File)?.type
                                  .split("/")[1]
                                  ?.toUpperCase() || "IMAGE"
                              : "IMAGE"}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative cursor-pointer transition-all duration-300 ${
                hasImage ? "opacity-50 hover:opacity-100" : ""
              }`}
            >
              <div
                className={`absolute -inset-0.5 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 rounded-2xl opacity-0 blur transition-all duration-500 ${
                  isDragging
                    ? "opacity-50"
                    : "group-hover:opacity-20 dark:group-hover:opacity-10"
                }`}
              />

              <div
                className={`
                  relative p-8 rounded-2xl border-2 border-dashed transition-all duration-300 
                  ${
                    isDragging
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 scale-105"
                      : showError
                        ? "border-red-400 dark:border-red-500 bg-red-50/30 dark:bg-red-900/20"
                        : "border-gray-300 dark:border-gray-600 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-gradient-to-br hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-900/20 dark:hover:to-purple-900/20"
                  }
                `}
              >
                <div className="flex flex-col items-center gap-4">
                  <div
                    className={`relative transition-all duration-500 ${
                      isDragging
                        ? "scale-110 rotate-6"
                        : "group-hover:scale-110"
                    }`}
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-20 h-20 bg-blue-400/20 dark:bg-blue-500/20 rounded-full blur-xl animate-pulse" />
                    </div>

                    <div className="relative w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <Icon
                        icon="heroicons:cloud-arrow-up"
                        className="w-8 h-8 text-white"
                      />
                    </div>
                  </div>

                  <div className="text-center">
                    <p className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-2">
                      {isDragging ? (
                        <span className="text-blue-600 dark:text-blue-400 flex items-center gap-2">
                          <Icon
                            icon="heroicons:arrow-down-tray"
                            className="w-5 h-5 animate-bounce"
                          />
                          {t("Drop your image here")}
                        </span>
                      ) : hasImage ? (
                        t("Upload a different image")
                      ) : (
                        t("Drop your image here, or browse")
                      )}
                    </p>

                    {/* Dynamic format display */}
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {field.validation?.allowedTypes ? (
                        <>
                          {t("Supports:")}{" "}
                          {field.validation.allowedTypes
                            .map((type) => {
                              const ext = type.split("/")[1]?.toUpperCase();
                              // Handle jpeg/jpg
                              if (ext === "JPEG" || ext === "JPG") {
                                return "JPEG/JPG";
                              }
                              return ext || type;
                            })
                            .filter(
                              (value, index, self) =>
                                self.indexOf(value) === index,
                            ) // Remove duplicates
                            .join(", ")}{" "}
                          {t("(Max")}{" "}
                          {field.validation.maxFileSize
                            ? `${
                                field.validation.maxFileSize / (1024 * 1024)
                              }MB`
                            : "10MB"}
                          {t(")")}
                        </>
                      ) : (
                        // Fallback to default if no allowedTypes specified
                        t("Supports: JPEG, PNG, GIF (Max 10MB)")
                      )}
                    </p>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    className="
                      mt-2 px-6 py-2 
                      bg-white dark:bg-gray-800 
                      hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 
                      hover:text-white 
                      border-2 border-gray-300 dark:border-gray-600 
                      hover:border-transparent 
                      transition-all duration-300 
                      font-semibold shadow-sm hover:shadow-lg
                      text-gray-800 dark:text-gray-200
                    "
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                  >
                    <Icon
                      icon="heroicons:folder-open"
                      className="w-4 h-4 mr-2"
                    />
                    {t("Browse Files")}
                  </Button>
                </div>

                {/* Dynamic accept attribute */}
                <Input
                  ref={fileInputRef}
                  id={field.name}
                  name={field.name}
                  type="file"
                  accept={
                    field.accept ||
                    (field.validation?.allowedTypes
                      ? field.validation.allowedTypes.join(",")
                      : "image/*")
                  }
                  onChange={handleInputChange}
                  onBlur={() => handleBlur(field.name)}
                  required={field.required && !formData[field.name]}
                  className="hidden"
                />
              </div>
            </div>

            {field.description && !showError && (
              <div className="mt-3 flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-100 dark:border-blue-800">
                <Icon
                  icon="heroicons:information-circle"
                  className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0"
                />
                <span>{field.description}</span>
              </div>
            )}

            {showError && (
              <div className="mt-3 flex items-start gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg animate-in slide-in-from-top-2">
                <Icon
                  icon="heroicons:exclamation-triangle"
                  className="w-5 h-5 text-red-500 dark:text-red-400 flex-shrink-0 mt-0.5"
                />
                <p className="text-red-600 dark:text-red-400 text-sm font-medium">
                  {error}
                </p>
              </div>
            )}
          </div>
        );

      case "radio":
        return (
          <div className="w-full">
            <Label className="text-[#25235F] dark:text-blue-300 font-medium">
              {t(field.label)} {field.required && "*"}
            </Label>
            <RadioGroup
              value={formData[field.name] || ""}
              onValueChange={(value) => handleRadioChange(field.name, value)}
              onBlur={() => handleBlur(field.name)}
              className="flex space-x-4"
            >
              {field.options?.map((option) => {
                const value =
                  typeof option === "string" ? option : option.value;
                const label =
                  typeof option === "string" ? option : option.label;
                return (
                  <div key={value} className="flex items-center space-x-2">
                    <RadioGroupItem
                      value={value}
                      id={`${field.name}-${value}`}
                    />
                    <Label
                      htmlFor={`${field.name}-${value}`}
                      className="cursor-pointer text-gray-700 dark:text-gray-300"
                    >
                      {label}
                    </Label>
                  </div>
                );
              })}
            </RadioGroup>
            {showError && (
              <p className="text-red-500 dark:text-red-400 text-sm mt-1">
                {error}
              </p>
            )}
          </div>
        );

      case "switch":
        return (
          <div className="group  h-14 relative w-full p-2 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 transition-all duration-300 hover:bg-blue-50/30 dark:hover:bg-blue-900/20">
            <div className="flex h-[2.3rem] items-center justify-between">
              <Label
                htmlFor={field.name}
                className="cursor-pointer flex items-center gap-3 text-base font-medium text-gray-700 dark:text-gray-300 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors"
              >
                <div
                  className={`
                    w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-300 
                    ${
                      formData[field.name]
                        ? "border-blue-600 dark:border-blue-500 bg-gradient-to-br from-blue-600 to-purple-600 rotate-6 scale-110"
                        : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                    }
                  `}
                >
                  {formData[field.name] && (
                    <Icon
                      icon="heroicons:check"
                      className="w-4 w-4 text-white animate-in zoom-in-50"
                    />
                  )}
                </div>

                <span className="flex items-center gap-2">
                  {t(field.label)}
                  {field.required && (
                    <span className="px-1.5 py-0.5 bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400 text-xs font-bold rounded">
                      !
                    </span>
                  )}
                </span>
              </Label>

              <Switch
                id={field.name}
                checked={formData[field.name] || false}
                onCheckedChange={(checked) =>
                  handleSwitchChange(field.name, checked)
                }
                required={field.required}
                className="
                  data-[state=checked]:bg-gradient-to-r 
                  data-[state=checked]:from-blue-600 
                  data-[state=checked]:to-purple-600 
                  shadow-md hover:shadow-lg 
                  transition-all duration-300
                  bg-gray-200 dark:bg-gray-700
                "
              />
            </div>
          </div>
        );

      default:
        return (
          <div className="w-full">
            <Label
              htmlFor={field.name}
              className="text-[#25235F] dark:text-blue-300 font-medium"
            >
              {t(field.label)} {field.required && !field.disabled && "*"}
              {field.disabled && (
                <span className="text-gray-400 dark:text-gray-500 text-sm ml-1">
                  (Disabled)
                </span>
              )}
            </Label>
            <Input
              id={field.name}
              name={field.name}
              type={field.type}
              value={formData[field.name] || ""}
              onChange={handleInputChange}
              onBlur={() => handleBlur(field.name)}
              placeholder={field.placeholder}
              disabled={field.disabled || isLoading}
              className={`
                border-2 transition-all duration-300 
                ${
                  showError
                    ? "border-red-500 dark:border-red-400 focus:border-red-500 dark:focus:border-red-400 focus:ring-red-500 dark:focus:ring-red-900/30"
                    : field.disabled
                      ? "border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                      : "border-gray-300 dark:border-gray-600 focus:border-[#25235F] dark:focus:border-blue-500 focus:ring-[#25235F] dark:focus:ring-blue-900/30"
                } 
                ${disabledStyles}
                bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100
              `}
            />
            {showError && (
              <p className="text-red-500 dark:text-red-400 text-sm mt-1">
                {error}
              </p>
            )}
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen p-6 overflow-y-auto">
      <div className="">
        <Card className="shadow-2xl dark:shadow-gray-950/50 border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-[#25235F] to-[#25235F]/90 dark:from-gray-800 dark:to-gray-900 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform skew-x-12"></div>
            <CardTitle className="relative z-10 flex items-center gap-3 text-xl font-bold">
              <div className="w-2 h-8 bg-[#ED4135] rounded-full"></div>
              {t(title)}
              <div className="ml-auto flex items-center gap-3">
                {hasChanges && (
                  <Badge className="bg-amber-500 dark:bg-amber-600 hover:bg-amber-600 dark:hover:bg-amber-700">
                    <Icon icon="heroicons:pencil" className="h-3 w-3 mr-1" />
                    Unsaved Changes
                  </Badge>
                )}
                <div className="w-8 h-8 rounded-full bg-[#ED4135]/20 flex items-center justify-center">
                  <Icon
                    icon="heroicons:document-text"
                    className="h-5 w-5 text-[#ED4135]"
                  />
                </div>
              </div>
            </CardTitle>
          </CardHeader>

          <CardContent className="p-8">
            {errors.length > 0 && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <h3 className="text-red-800 dark:text-red-300 font-semibold mb-2 flex items-center">
                  <Icon
                    icon="heroicons:exclamation-triangle"
                    className="h-5 w-5 mr-2"
                  />
                  Please fix the following errors:
                </h3>
                <ul className="list-disc list-inside text-red-700 dark:text-red-300 space-y-1">
                  {errors.map((error, index) => (
                    <li key={index}>{error.message}</li>
                  ))}
                </ul>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              {showIdField && initialData.id && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="w-full">
                    <Label
                      htmlFor="id"
                      className="text-[#25235F] dark:text-blue-300 font-medium"
                    >
                      {idFieldLabel}
                    </Label>
                    <Input
                      id="id"
                      name="id"
                      value={formData.id || ""}
                      readOnly
                      className="border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 cursor-not-allowed text-gray-700 dark:text-gray-300"
                    />
                  </div>
                </div>
              )}

              {fields.map((row, rowIndex) => (
                <div key={rowIndex} className="space-y-6">
                  {sections[rowIndex] && (
                    <div className="border-b pb-2 border-gray-200 dark:border-gray-700">
                      <h3 className="text-xl font-semibold text-[#25235F] dark:text-white">
                        <Icon
                          icon={sections[rowIndex].icon}
                          className="h-5 w-5 inline mr-2 text-[#25235F] dark:text-blue-400"
                        />
                        {t(sections[rowIndex].title)}
                      </h3>
                      {sections[rowIndex].description && (
                        <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                          {t(sections[rowIndex].description)}
                        </p>
                      )}
                    </div>
                  )}

                  <div
                    className={`grid grid-cols-1 md:grid-cols-${
                      row[0]?.cols || 2
                    } gap-6`}
                  >
                    {row.map((field) => (
                      <div
                        key={field.name}
                        className={`flex flex-col justify-end items-end w-full ${
                          field.type === "image" || field.type === "mealItem"
                            ? `md:col-span-full` // Changed from md:col-span-${row[0]?.cols || 2}
                            : ""
                        }`}
                      >
                        {renderField(field)}
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <div className="flex justify-between items-center pt-8 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  {hasChanges && (
                    <>
                      <Icon
                        icon="heroicons:information-circle"
                        className="h-4 w-4 text-amber-500 dark:text-amber-400"
                      />
                      <span>You have unsaved changes</span>
                    </>
                  )}
                </div>

                <div className="flex space-x-4">
                  {hasChanges && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleReset}
                      className="
                        border-gray-300 dark:border-gray-600 
                        text-gray-700 dark:text-gray-300 
                        hover:bg-gray-100 dark:hover:bg-gray-800 
                        px-6 py-3
                        bg-white dark:bg-gray-900
                      "
                      disabled={isLoading}
                    >
                      <Icon
                        icon="heroicons:arrow-path"
                        className="h-4 w-4 mr-2"
                      />
                      Reset
                    </Button>
                  )}
                  {onCancel && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={onCancel}
                      className="
                        border-gray-300 dark:border-gray-600 
                        text-gray-700 dark:text-gray-300 
                        hover:bg-gray-100 dark:hover:bg-gray-800 
                        px-6 py-3
                        bg-white dark:bg-gray-900
                      "
                      disabled={isLoading}
                    >
                      {cancelButtonText}
                    </Button>
                  )}
                  <Button
                    type="submit"
                    className="
                      bg-gradient-to-r 
                      from-[#25235F] to-[#25235F]/90 
                      dark:from-blue-600 dark:to-blue-700
                      hover:from-[#25235F]/90 hover:to-[#25235F]
                      dark:hover:from-blue-700 dark:hover:to-blue-600
                      text-white px-6 py-3 
                      shadow-lg hover:shadow-xl 
                      transition-all duration-300
                      disabled:opacity-50 disabled:cursor-not-allowed
                    "
                    disabled={isLoading || !hasChanges}
                    {...submitButtonProps}
                  >
                    {isLoading ? (
                      <>
                        <Icon
                          icon="heroicons:arrow-path"
                          className="h-5 w-5 mr-2 animate-spin"
                        />
                        Updating...
                      </>
                    ) : (
                      <>
                        <Icon icon="heroicons:check" className="h-5 w-5 mr-2" />
                        {submitButtonText}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GenericUpdateForm;
