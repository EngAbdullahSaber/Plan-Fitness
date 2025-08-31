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

const AddNewMeal = ({ onClose }: { onClose?: () => void }) => {
  const { t, loading, error } = useTranslate();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    calories: "",
    protein: "",
    carbs: "",
    fat: "",
    ingredients: "",
    preparationTime: "",
    cookingTime: "",
    difficulty: "medium",
    status: "active",
    price: "",
    servingSize: "",
    allergens: "",
    isVegan: false,
    isGlutenFree: false,
    isFeatured: false,
    imageUrl: "",
    nutritionalNotes: "",
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
    console.log("Meal form submitted:", formData);
    // Here you would typically send the data to your API
    if (onClose) onClose();
  };

  // Sample data for dropdowns
  const categories = [
    "Breakfast",
    "Lunch",
    "Dinner",
    "Snacks",
    "Smoothies",
    "Desserts",
  ];

  const difficultyLevels = [
    { value: "easy", label: "Easy" },
    { value: "medium", label: "Medium" },
    { value: "hard", label: "Hard" },
  ];

  const statusOptions = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 p-6">
      <div className=" ">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-[#25235F]">
              Add New Meal
            </h1>
            <p className="text-gray-600">
              Create a new meal for your nutrition program
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
              Meal Information
              <div className="ml-auto">
                <div className="w-8 h-8 rounded-full bg-[#ED4135]/20 flex items-center justify-center">
                  <Icon
                    icon="heroicons:heart"
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
                    Meal Name *
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter meal name"
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
                    placeholder="Brief description of the meal"
                    className="border-gray-300 focus:border-[#25235F] focus:ring-[#25235F] min-h-[80px]"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

              {/* Nutritional Information Section */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-[#25235F] border-b pb-2">
                  <Icon
                    icon="heroicons:clipboard-document-list"
                    className="h-5 w-5 inline mr-2"
                  />
                  Nutritional Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="calories"
                      className="text-[#25235F] font-medium"
                    >
                      Calories *
                    </Label>
                    <Input
                      id="calories"
                      name="calories"
                      type="number"
                      value={formData.calories}
                      onChange={handleInputChange}
                      required
                      placeholder="0"
                      className="border-gray-300 focus:border-[#25235F] focus:ring-[#25235F]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="protein"
                      className="text-[#25235F] font-medium"
                    >
                      Protein (g) *
                    </Label>
                    <Input
                      id="protein"
                      name="protein"
                      type="number"
                      value={formData.protein}
                      onChange={handleInputChange}
                      required
                      placeholder="0"
                      className="border-gray-300 focus:border-[#25235F] focus:ring-[#25235F]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="carbs"
                      className="text-[#25235F] font-medium"
                    >
                      Carbs (g) *
                    </Label>
                    <Input
                      id="carbs"
                      name="carbs"
                      type="number"
                      value={formData.carbs}
                      onChange={handleInputChange}
                      required
                      placeholder="0"
                      className="border-gray-300 focus:border-[#25235F] focus:ring-[#25235F]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="fat"
                      className="text-[#25235F] font-medium"
                    >
                      Fat (g) *
                    </Label>
                    <Input
                      id="fat"
                      name="fat"
                      type="number"
                      value={formData.fat}
                      onChange={handleInputChange}
                      required
                      placeholder="0"
                      className="border-gray-300 focus:border-[#25235F] focus:ring-[#25235F]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="servingSize"
                      className="text-[#25235F] font-medium"
                    >
                      Serving Size
                    </Label>
                    <Input
                      id="servingSize"
                      name="servingSize"
                      value={formData.servingSize}
                      onChange={handleInputChange}
                      placeholder="e.g., 1 portion, 250g"
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

              {/* Preparation Details Section */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-[#25235F] border-b pb-2">
                  <Icon
                    icon="heroicons:clock"
                    className="h-5 w-5 inline mr-2"
                  />
                  Preparation Details
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="preparationTime"
                      className="text-[#25235F] font-medium"
                    >
                      Prep Time (min)
                    </Label>
                    <Input
                      id="preparationTime"
                      name="preparationTime"
                      type="number"
                      value={formData.preparationTime}
                      onChange={handleInputChange}
                      placeholder="0"
                      className="border-gray-300 focus:border-[#25235F] focus:ring-[#25235F]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="cookingTime"
                      className="text-[#25235F] font-medium"
                    >
                      Cook Time (min)
                    </Label>
                    <Input
                      id="cookingTime"
                      name="cookingTime"
                      type="number"
                      value={formData.cookingTime}
                      onChange={handleInputChange}
                      placeholder="0"
                      className="border-gray-300 focus:border-[#25235F] focus:ring-[#25235F]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="difficulty"
                      className="text-[#25235F] font-medium"
                    >
                      Difficulty
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
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="ingredients"
                    className="text-[#25235F] font-medium"
                  >
                    Ingredients *
                  </Label>
                  <Textarea
                    id="ingredients"
                    name="ingredients"
                    value={formData.ingredients}
                    onChange={handleInputChange}
                    required
                    placeholder="List ingredients (one per line or comma separated)"
                    className="border-gray-300 focus:border-[#25235F] focus:ring-[#25235F] min-h-[100px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="nutritionalNotes"
                    className="text-[#25235F] font-medium"
                  >
                    Nutritional Notes
                  </Label>
                  <Textarea
                    id="nutritionalNotes"
                    name="nutritionalNotes"
                    value={formData.nutritionalNotes}
                    onChange={handleInputChange}
                    placeholder="Any special nutritional information or benefits"
                    className="border-gray-300 focus:border-[#25235F] focus:ring-[#25235F] min-h-[80px]"
                  />
                </div>
              </div>

              {/* Dietary Information Section */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-[#25235F] border-b pb-2">
                  <Icon
                    icon="heroicons:shield-check"
                    className="h-5 w-5 inline mr-2"
                  />
                  Dietary Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="allergens"
                      className="text-[#25235F] font-medium"
                    >
                      Allergens
                    </Label>
                    <Input
                      id="allergens"
                      name="allergens"
                      value={formData.allergens}
                      onChange={handleInputChange}
                      placeholder="e.g., nuts, dairy, gluten"
                      className="border-gray-300 focus:border-[#25235F] focus:ring-[#25235F]"
                    />
                  </div>

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
                      placeholder="https://example.com/meal-image.jpg"
                      className="border-gray-300 focus:border-[#25235F] focus:ring-[#25235F]"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between space-x-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="isVegan"
                      checked={formData.isVegan}
                      onCheckedChange={(checked) =>
                        handleSwitchChange("isVegan", checked)
                      }
                    />
                    <Label htmlFor="isVegan" className="cursor-pointer">
                      Vegan
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="isGlutenFree"
                      checked={formData.isGlutenFree}
                      onCheckedChange={(checked) =>
                        handleSwitchChange("isGlutenFree", checked)
                      }
                    />
                    <Label htmlFor="isGlutenFree" className="cursor-pointer">
                      Gluten Free
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="isFeatured"
                      checked={formData.isFeatured}
                      onCheckedChange={(checked) =>
                        handleSwitchChange("isFeatured", checked)
                      }
                    />
                    <Label htmlFor="isFeatured" className="cursor-pointer">
                      Featured Meal
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
                  <Icon icon="heroicons:heart" className="h-5 w-5 mr-2" />
                  Create Meal
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AddNewMeal;