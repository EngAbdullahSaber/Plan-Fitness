"use client";
import React, { useState } from "react";
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
    | "radio"
    | "switch";
  placeholder?: string;
  required?: boolean;
  options?: string[] | { value: string; label: string }[];
  step?: number;
  cols?: number;
  validation?: {
    pattern?: RegExp;
    min?: number;
    max?: number;
    minLength?: number;
    maxLength?: number;
    custom?: (value: any) => string | null;
    patternMessage?: string;
  };
}

interface ValidationError {
  field: string;
  message: string;
}

interface GenericCreateFormProps {
  title: string;
  description?: string;
  initialData: Record<string, any>;
  fields: FormField[][];
  onSubmit: (data: Record<string, any>) => void;
  onCancel?: () => void;
  submitButtonText?: string;
  cancelButtonText?: string;
  sections?: {
    title: string;
    icon: string;
  }[];
  validateForm?: (data: Record<string, any>) => ValidationError[];
}

const GenericCreateForm: React.FC<GenericCreateFormProps> = ({
  title,
  description,
  initialData,
  fields,
  onSubmit,
  onCancel,
  submitButtonText = "Submit",
  cancelButtonText = "Cancel",
  sections = [],
  validateForm,
}) => {
  const { t, loading, error } = useTranslate();
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [showAllErrors, setShowAllErrors] = useState(false);

  const validateField = (field: FormField, value: any): string | null => {
    // Check if field is required and empty
    if (field.required && (!value || value.toString().trim() === "")) {
      return `${field.label} is required`;
    }

    // Skip further validation if field is empty and not required
    if (!value && !field.required) return null;

    // Type-specific validation
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

    // Pattern validation
    if (field.validation?.pattern && value) {
      if (!field.validation.pattern.test(value)) {
        return field.validation.patternMessage || "Invalid format";
      }
    }

    // Length validation
    if (
      field.validation?.minLength &&
      value.length < field.validation.minLength
    ) {
      return `Must be at least ${field.validation.minLength} characters`;
    }

    if (
      field.validation?.maxLength &&
      value.length > field.validation.maxLength
    ) {
      return `Must be at most ${field.validation.maxLength} characters`;
    }

    // Custom validation
    if (field.validation?.custom) {
      return field.validation.custom(value);
    }

    return null;
  };

  const validateAllFields = (): ValidationError[] => {
    const validationErrors: ValidationError[] = [];

    fields.flat().forEach((field) => {
      const error = validateField(field, formData[field.name]);
      if (error) {
        validationErrors.push({ field: field.name, message: error });
      }
    });

    // Custom form validation if provided
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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Validate field on change if it's been touched or we're showing all errors
    if (touched[name] || showAllErrors) {
      const field = fields.flat().find((f) => f.name === name);
      if (field) {
        const error = validateField(field, value);
        setErrors((prev) => {
          const newErrors = prev.filter((err) => err.field !== name);
          return error
            ? [...newErrors, { field: name, message: error }]
            : newErrors;
        });
      }
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (touched[name] || showAllErrors) {
      const field = fields.flat().find((f) => f.name === name);
      if (field) {
        const error = validateField(field, value);
        setErrors((prev) => {
          const newErrors = prev.filter((err) => err.field !== name);
          return error
            ? [...newErrors, { field: name, message: error }]
            : newErrors;
        });
      }
    }
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleRadioChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (touched[name] || showAllErrors) {
      const field = fields.flat().find((f) => f.name === name);
      if (field) {
        const error = validateField(field, value);
        setErrors((prev) => {
          const newErrors = prev.filter((err) => err.field !== name);
          return error
            ? [...newErrors, { field: name, message: error }]
            : newErrors;
        });
      }
    }
  };

  const handleBlur = (fieldName: string) => {
    setTouched((prev) => ({ ...prev, [fieldName]: true }));

    const field = fields.flat().find((f) => f.name === fieldName);
    if (field) {
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

    // Mark all fields as touched and show all errors
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

  const renderField = (field: FormField) => {
    const error = getFieldError(field.name);
    const showError = (touched[field.name] || showAllErrors) && error;

    switch (field.type) {
      case "text":
      case "email":
      case "password":
      case "number":
      case "date":
        return (
          <div className="space-y-2">
            <Label htmlFor={field.name} className="text-[#25235F] font-medium">
              {t(field.label)} {field.required && "*"}
            </Label>
            <Input
              id={field.name}
              name={field.name}
              type={field.type}
              value={formData[field.name] || ""}
              onChange={handleInputChange}
              onBlur={() => handleBlur(field.name)}
              required={field.required}
              placeholder={field.placeholder}
              step={field.step}
              className={`border-gray-300 focus:border-[#25235F] focus:ring-[#25235F] ${
                showError
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                  : ""
              }`}
            />
            {showError && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>
        );

      case "textarea":
        return (
          <div className="space-y-2">
            <Label htmlFor={field.name} className="text-[#25235F] font-medium">
              {t(field.label)} {field.required && "*"}
            </Label>
            <Textarea
              id={field.name}
              name={field.name}
              value={formData[field.name] || ""}
              onChange={handleInputChange}
              onBlur={() => handleBlur(field.name)}
              placeholder={field.placeholder}
              className={`border-gray-300 focus:border-[#25235F] focus:ring-[#25235F] min-h-[80px] ${
                showError
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                  : ""
              }`}
            />
            {showError && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>
        );

      case "select":
        return (
          <div className="space-y-2">
            <Label htmlFor={field.name} className="text-[#25235F] font-medium">
              {t(field.label)} {field.required && "*"}
            </Label>
            <Select
              value={formData[field.name] || ""}
              onValueChange={(value) => handleSelectChange(field.name, value)}
              onBlur={() => handleBlur(field.name)}
            >
              <SelectTrigger
                className={`border-gray-300 focus:border-[#25235F] focus:ring-[#25235F] ${
                  showError
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                    : ""
                }`}
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
            {showError && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>
        );

      case "radio":
        return (
          <div className="space-y-2">
            <Label className="text-[#25235F] font-medium">
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
                      className="cursor-pointer"
                    >
                      {label}
                    </Label>
                  </div>
                );
              })}
            </RadioGroup>
            {showError && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>
        );

      case "switch":
        return (
          <div className="flex items-center space-x-2">
            <Switch
              id={field.name}
              checked={formData[field.name] || false}
              onCheckedChange={(checked) =>
                handleSwitchChange(field.name, checked)
              }
              required={field.required}
            />
            <Label htmlFor={field.name} className="cursor-pointer">
              {t(field.label)} {field.required && "*"}
            </Label>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 p-6 overflow-y-auto">
      <div className="">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-[#25235F]">{t(title)}</h1>
            {description && <p className="text-gray-600">{t(description)}</p>}
          </div>
          {onCancel && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onCancel}
              className="h-10 w-10 rounded-full hover:bg-gray-200"
            >
              <Icon icon="heroicons:x-mark" className="h-5 w-5" />
            </Button>
          )}
        </div>

        {/* Main Form Card */}
        <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm overflow-hidden">
          {/* Card Header with Gradient */}
          <CardHeader className="bg-gradient-to-r from-[#25235F] to-[#25235F]/90 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform skew-x-12"></div>
            <CardTitle className="relative z-10 flex items-center gap-3 text-xl font-bold">
              <div className="w-2 h-8 bg-[#ED4135] rounded-full"></div>
              {t(title)}
              <div className="ml-auto">
                <div className="w-8 h-8 rounded-full bg-[#ED4135]/20 flex items-center justify-center">
                  <Icon
                    icon="heroicons:document-plus"
                    className="h-5 w-5 text-[#ED4135]"
                  />
                </div>
              </div>
            </CardTitle>
          </CardHeader>

          <CardContent className="p-8">
            {errors.length > 0 && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <h3 className="text-red-800 font-semibold mb-2 flex items-center">
                  <Icon
                    icon="heroicons:exclamation-triangle"
                    className="h-5 w-5 mr-2"
                  />
                  Please fix the following errors:
                </h3>
                <ul className="list-disc list-inside text-red-700 space-y-1">
                  {errors.map((error, index) => (
                    <li key={index}>{error.message}</li>
                  ))}
                </ul>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              {fields.map((row, rowIndex) => (
                <div key={rowIndex} className="space-y-6">
                  {/* Section Header */}
                  {sections[rowIndex] && (
                    <h3 className="text-xl font-semibold text-[#25235F] border-b pb-2">
                      <Icon
                        icon={sections[rowIndex].icon}
                        className="h-5 w-5 inline mr-2"
                      />
                      {t(sections[rowIndex].title)}
                    </h3>
                  )}

                  {/* Fields Grid */}
                  <div
                    className={`grid grid-cols-1 md:grid-cols-${
                      row[0]?.cols || 2
                    } gap-6`}
                  >
                    {row.map((field) => (
                      <div
                        key={field.name}
                        className={
                          field.type === "textarea" || field.type === "radio"
                            ? `md:col-span-${row[0]?.cols || 2}`
                            : ""
                        }
                      >
                        {renderField(field)}
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {/* Form Actions */}
              <div className="flex justify-end space-x-4 pt-8 border-t border-gray-200">
                {onCancel && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    className="border-gray-300 text-gray-700 hover:bg-gray-100 px-6 py-3"
                  >
                    {cancelButtonText}
                  </Button>
                )}
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-[#ED4135] to-[#ED4135]/90 hover:from-[#ED4135]/90 hover:to-[#ED4135] text-white px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Icon
                    icon="heroicons:document-plus"
                    className="h-5 w-5 mr-2"
                  />
                  {submitButtonText}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GenericCreateForm;
