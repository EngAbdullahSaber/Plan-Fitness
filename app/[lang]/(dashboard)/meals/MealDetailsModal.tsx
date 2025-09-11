"use client";
import React from "react";
import {
  Utensils,
  Heart,
  flame,
  Egg,
  Carrot,
  Scale,
  DollarSign,
  Star,
  Clock,
  Calendar,
  ChefHat,
  List,
  PieChart,
  Target,
  Crown,
} from "lucide-react";
import GenericDetailsModal from "../shared/GenericDetailsModal";

interface Meal {
  id: string;
  name: string;
  category: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  status: string;
  price: number;
  featured: boolean;
  ingredients: string[];
  description?: string;
  preparationTime?: number;
  chef?: string;
  createdAt?: string;
  updatedAt?: string;
  allergens?: string[];
  dietaryTags?: string[];
  servingSize?: string;
}

interface MealDetailsModalProps {
  meal: Meal;
  isOpen: boolean;
  onClose: () => void;
}

const MealDetailsModal: React.FC<MealDetailsModalProps> = ({
  meal,
  isOpen,
  onClose,
}) => {
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "bg-green-500";
      case "inactive":
        return "bg-gray-500";
      case "featured":
        return "bg-amber-500";
      default:
        return "bg-gray-500";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "breakfast":
        return "from-orange-500 to-orange-600";
      case "lunch":
        return "from-blue-500 to-blue-600";
      case "dinner":
        return "from-purple-500 to-purple-600";
      case "snacks":
        return "from-green-500 to-green-600";
      default:
        return "from-gray-500 to-gray-600";
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatTime = (minutes: number) => `${minutes} min`;
  const formatPrice = (price: number) => `$${price.toFixed(2)}`;
  const formatMacros = (value: number) => `${value}g`;
  const formatList = (items: string[]) => items.join(", ");

  const tabs = [
    { id: "overview", label: "Overview", icon: Utensils },
    { id: "nutrition", label: "Nutrition", icon: PieChart },
    { id: "ingredients", label: "Ingredients", icon: List },
    { id: "details", label: "Details", icon: ChefHat },
  ];

  const sections = (record: Record<string, any>) => [
    {
      title: "Basic Information",
      icon: Utensils,
      fields: [
        {
          label: "Meal Name",
          value: record.name,
          icon: Utensils,
        },
        {
          label: "Category",
          value: record.category,
          icon: Target,
        },
        {
          label: "Description",
          value: record.description,
          icon: ChefHat,
        },
        {
          label: "Serving Size",
          value: record.servingSize,
          icon: Scale,
        },
      ],
    },
    {
      title: "Nutritional Information",
      icon: PieChart,
      fields: [
        {
          label: "Calories",
          value: record.calories,
          icon: flame,
          format: (val: number) => `${val} kcal`,
        },
        {
          label: "Protein",
          value: record.protein,
          icon: Egg,
          format: formatMacros,
        },
        {
          label: "Carbs",
          value: record.carbs,
          icon: Carrot,
          format: formatMacros,
        },
        {
          label: "Fat",
          value: record.fat,
          icon: Scale,
          format: formatMacros,
        },
      ],
    },
    {
      title: "Pricing & Status",
      icon: DollarSign,
      fields: [
        {
          label: "Price",
          value: record.price,
          icon: DollarSign,
          format: formatPrice,
        },
        {
          label: "Status",
          value: record.status,
          icon: Heart,
        },
        {
          label: "Featured",
          value: record.featured ? "Yes" : "No",
          icon: Star,
        },
      ],
    },
    {
      title: "Preparation Details",
      icon: Clock,
      fields: [
        {
          label: "Preparation Time",
          value: record.preparationTime,
          icon: Clock,
          format: formatTime,
        },
        {
          label: "Chef",
          value: record.chef,
          icon: ChefHat,
        },
        {
          label: "Created At",
          value: record.createdAt,
          icon: Calendar,
          format: formatDateTime,
        },
        {
          label: "Last Updated",
          value: record.updatedAt,
          icon: Calendar,
          format: formatDateTime,
        },
      ],
    },
    {
      title: "Ingredients & Dietary Info",
      icon: List,
      fields: [
        {
          label: "Ingredients",
          value: record.ingredients,
          icon: List,
          format: formatList,
        },
        {
          label: "Allergens",
          value: record.allergens,
          icon: Heart,
          format: formatList,
        },
        {
          label: "Dietary Tags",
          value: record.dietaryTags,
          icon: Target,
          format: formatList,
        },
      ],
    },
  ];

  return (
    <GenericDetailsModal
      isOpen={isOpen}
      onClose={onClose}
      title={meal.name}
      subtitle={
        <div className="flex items-center gap-4 text-xs text-white/80">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            Created {formatDate(meal.createdAt)}
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Updated {formatDateTime(meal.updatedAt)}
          </div>
          {meal.featured && (
            <div className="flex items-center gap-1">
              <Crown className="w-3 h-3" />
              Featured Meal
            </div>
          )}
        </div>
      }
      record={meal}
      type="meal"
      tabs={tabs}
      sections={sections}
      statusConfig={{
        field: "status",
        getColor: getStatusColor,
      }}
      roleConfig={{
        field: "category",
        getColor: getCategoryColor,
        label: "Category",
      }}
    />
  );
};

export default MealDetailsModal;
