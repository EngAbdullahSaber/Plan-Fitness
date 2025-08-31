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

const AddNewTraining = ({ onClose }: { onClose?: () => void }) => {
  const { t, loading, error } = useTranslate();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    duration: "",
    difficulty: "intermediate",
    calories: "",
    status: "active",
    price: "",
    equipment: "",
    targetMuscles: "",
    isFeatured: false,
    imageUrl: "",
    workoutNotes: "",
    exercises: "",
    restPeriods: "",
    sets: "",
    reps: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Training program form submitted:", formData);
    // Here you would typically send the data to your API
    if (onClose) onClose();
  };

  // Sample data for dropdowns
  const categories = [
    "Strength",
    "Cardio",
    "Flexibility",
    "Endurance",
    "Bodyweight",
    "HIIT",
    "Yoga",
    "Pilates",
  ];

  const difficultyLevels = [
    { value: "beginner", label: "Beginner" },
    { value: "intermediate", label: "Intermediate" },
    { value: "advanced", label: "Advanced" },
  ];

  const statusOptions = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
  ];

  const equipmentOptions = [
    "Bodyweight Only",
    "Dumbbells",
    "Barbell",
    "Kettlebells",
    "Resistance Bands",
    "Machine Weights",
    "Yoga Mat",
    "No Equipment",
    "Mixed Equipment",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 p-6">
      <div className=" ">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-[#25235F]">
              Add New Training Program
            </h1>
            <p className="text-gray-600">
              Create a new training program for your fitness offerings
            </p>
          </div>
          {onClose && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
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
              Training Program Information
              <div className="ml-auto">
                <div className="w-8 h-8 rounded-full bg-[#ED4135]/20 flex items-center justify-center">
                  <Icon
                    icon="heroicons:academic-cap"
                    className="h-5 w-5 text-[#ED4135]"
                  />
                </div>
              </div>
            </CardTitle>
          </CardHeader>

          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Information Section */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-[#25235F] border-b pb-2">
                  <Icon
                    icon="heroicons:information-circle"
                    className="h-5 w-5 inline mr-2"
                  />
                  Basic Information
                </h3>

                <div className="space-y-2">
                  <Label htmlFor="name" className="text-[#25235F] font-medium">
                    Program Name *
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter program name"
                    className="border-gray-300 focus:border-[#25235F] focus:ring-[#25235F]"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="description"
                    className="text-[#25235F] font-medium"
                  >
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Brief description of the training program"
                    className="border-gray-300 focus:border-[#25235F] focus:ring-[#25235F] min-h-[80px]"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="category"
                      className="text-[#25235F] font-medium"
                    >
                      Category *
                    </Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) =>
                        handleSelectChange("category", value)
                      }
                    >
                      <SelectTrigger className="border-gray-300 focus:border-[#25235F] focus:ring-[#25235F]">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem
                            key={category}
                            value={category.toLowerCase()}
                          >
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="duration"
                      className="text-[#25235F] font-medium"
                    >
                      Duration (minutes) *
                    </Label>
                    <Input
                      id="duration"
                      name="duration"
                      type="number"
                      value={formData.duration}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g., 45"
                      className="border-gray-300 focus:border-[#25235F] focus:ring-[#25235F]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="status"
                      className="text-[#25235F] font-medium"
                    >
                      Status
                    </Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) =>
                        handleSelectChange("status", value)
                      }
                    >
                      <SelectTrigger className="border-gray-300 focus:border-[#25235F] focus:ring-[#25235F]">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map((status) => (
                          <SelectItem key={status.value} value={status.value}>
                            {status.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Training Details Section */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-[#25235F] border-b pb-2">
                  <Icon
                    icon="heroicons:clipboard-document-list"
                    className="h-5 w-5 inline mr-2"
                  />
                  Training Details
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="difficulty"
                      className="text-[#25235F] font-medium"
                    >
                      Difficulty Level
                    </Label>
                    <Select
                      value={formData.difficulty}
                      onValueChange={(value) =>
                        handleSelectChange("difficulty", value)
                      }
                    >
                      <SelectTrigger className="border-gray-300 focus:border-[#25235F] focus:ring-[#25235F]">
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                      <SelectContent>
                        {difficultyLevels.map((level) => (
                          <SelectItem key={level.value} value={level.value}>
                            {level.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="calories"
                      className="text-[#25235F] font-medium"
                    >
                      Estimated Calories Burned
                    </Label>
                    <Input
                      id="calories"
                      name="calories"
                      type="number"
                      value={formData.calories}
                      onChange={handleInputChange}
                      placeholder="e.g., 350"
                      className="border-gray-300 focus:border-[#25235F] focus:ring-[#25235F]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="equipment"
                      className="text-[#25235F] font-medium"
                    >
                      Equipment Needed
                    </Label>
                    <Select
                      value={formData.equipment}
                      onValueChange={(value) =>
                        handleSelectChange("equipment", value)
                      }
                    >
                      <SelectTrigger className="border-gray-300 focus:border-[#25235F] focus:ring-[#25235F]">
                        <SelectValue placeholder="Select equipment" />
                      </SelectTrigger>
                      <SelectContent>
                        {equipmentOptions.map((equipment) => (
                          <SelectItem
                            key={equipment}
                            value={equipment.toLowerCase()}
                          >
                            {equipment}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="targetMuscles"
                      className="text-[#25235F] font-medium"
                    >
                      Target Muscles/Groups
                    </Label>
                    <Input
                      id="targetMuscles"
                      name="targetMuscles"
                      value={formData.targetMuscles}
                      onChange={handleInputChange}
                      placeholder="e.g., Legs, Core, Upper Body"
                      className="border-gray-300 focus:border-[#25235F] focus:ring-[#25235F]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="price"
                      className="text-[#25235F] font-medium"
                    >
                      Price ($)
                    </Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="0.00"
                      className="border-gray-300 focus:border-[#25235F] focus:ring-[#25235F]"
                    />
                  </div>
                </div>
              </div>

              {/* Exercise Details Section */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-[#25235F] border-b pb-2">
                  <Icon
                    icon="heroicons:clock"
                    className="h-5 w-5 inline mr-2"
                  />
                  Exercise Details
                </h3>

                <div className="space-y-2">
                  <Label
                    htmlFor="exercises"
                    className="text-[#25235F] font-medium"
                  >
                    Exercises *
                  </Label>
                  <Textarea
                    id="exercises"
                    name="exercises"
                    value={formData.exercises}
                    onChange={handleInputChange}
                    required
                    placeholder="List exercises included in this program (one per line)"
                    className="border-gray-300 focus:border-[#25235F] focus:ring-[#25235F] min-h-[100px]"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="sets"
                      className="text-[#25235F] font-medium"
                    >
                      Sets (if applicable)
                    </Label>
                    <Input
                      id="sets"
                      name="sets"
                      value={formData.sets}
                      onChange={handleInputChange}
                      placeholder="e.g., 3-4"
                      className="border-gray-300 focus:border-[#25235F] focus:ring-[#25235F]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="reps"
                      className="text-[#25235F] font-medium"
                    >
                      Reps (if applicable)
                    </Label>
                    <Input
                      id="reps"
                      name="reps"
                      value={formData.reps}
                      onChange={handleInputChange}
                      placeholder="e.g., 8-12"
                      className="border-gray-300 focus:border-[#25235F] focus:ring-[#25235F]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="restPeriods"
                      className="text-[#25235F] font-medium"
                    >
                      Rest Periods
                    </Label>
                    <Input
                      id="restPeriods"
                      name="restPeriods"
                      value={formData.restPeriods}
                      onChange={handleInputChange}
                      placeholder="e.g., 60s between sets"
                      className="border-gray-300 focus:border-[#25235F] focus:ring-[#25235F]"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="workoutNotes"
                    className="text-[#25235F] font-medium"
                  >
                    Workout Notes
                  </Label>
                  <Textarea
                    id="workoutNotes"
                    name="workoutNotes"
                    value={formData.workoutNotes}
                    onChange={handleInputChange}
                    placeholder="Any special instructions, tips, or modifications"
                    className="border-gray-300 focus:border-[#25235F] focus:ring-[#25235F] min-h-[80px]"
                  />
                </div>
              </div>

              {/* Additional Information Section */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-[#25235F] border-b pb-2">
                  <Icon
                    icon="heroicons:photo"
                    className="h-5 w-5 inline mr-2"
                  />
                  Additional Information
                </h3>

                <div className="space-y-2">
                  <Label
                    htmlFor="imageUrl"
                    className="text-[#25235F] font-medium"
                  >
                    Image URL
                  </Label>
                  <Input
                    id="imageUrl"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleInputChange}
                    placeholder="https://example.com/training-image.jpg"
                    className="border-gray-300 focus:border-[#25235F] focus:ring-[#25235F]"
                  />
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="isFeatured"
                      checked={formData.isFeatured}
                      onCheckedChange={(checked) =>
                        handleSwitchChange("isFeatured", checked)
                      }
                    />
                    <Label htmlFor="isFeatured" className="cursor-pointer">
                      Featured Program
                    </Label>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-4 pt-8 border-t border-gray-200">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="border-gray-300 text-gray-700 hover:bg-gray-100 px-6 py-3"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-[#ED4135] to-[#ED4135]/90 hover:from-[#ED4135]/90 hover:to-[#ED4135] text-white px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Icon icon="heroicons:plus" className="h-5 w-5 mr-2" />
                  Create Training Program
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AddNewTraining;
