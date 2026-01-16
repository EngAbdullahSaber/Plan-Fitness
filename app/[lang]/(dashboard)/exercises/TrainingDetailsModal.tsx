"use client";
import React from "react";
import {
  Clock,
  Activity,
  Flame,
  Target,
  BarChart3,
  Award,
  HeartPulse,
  Gauge,
  Crown,
  Calendar,
  Eye,
  EyeOff,
} from "lucide-react";
import GenericDetailsModal from "../shared/GenericDetailsModal";

interface Training {
  id: string;
  name: string;
  category: string;
  duration: number;
  difficulty: string;
  calories: number;
  status: string;
  show: boolean;
  count?: number;
}

interface TrainingDetailsModalProps {
  training: Training;
  isOpen: boolean;
  onClose: () => void;
}

const TrainingDetailsModal: React.FC<TrainingDetailsModalProps> = ({
  training,
  isOpen,
  onClose,
}) => {
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "bg-green-500";
      case "inactive":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty?.toLowerCase()) {
      case "beginner":
        return "from-green-500 to-green-600";
      case "intermediate":
        return "from-yellow-500 to-yellow-600";
      case "advanced":
        return "from-red-500 to-red-600";
      default:
        return "from-gray-500 to-gray-600";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category?.toLowerCase()) {
      case "strength":
        return Award;
      case "cardio":
        return HeartPulse;
      case "flexibility":
        return BarChart3;
      case "endurance":
        return Target;
      case "bodyweight":
        return Crown;
      default:
        return Activity;
    }
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  const formatCalories = (calories: number) => `${calories} kcal`;

  const tabs = [
    { id: "overview", label: "Overview", icon: Activity },
    { id: "details", label: "Details", icon: Gauge },
  ];

  const sections = (record: Record<string, any>) => [
    {
      title: "Program Information",
      icon: Activity,
      fields: [
        {
          label: "Name",
          value: record.name,
          icon: Activity,
        },
        {
          label: "Category",
          value: record.category,
          icon: getCategoryIcon(record.category),
        },
        {
          label: "Difficulty",
          value: record.difficulty,
          icon: Target,
        },
        {
          label: "Status",
          value: record.status,
          icon: record.status === "active" ? Eye : EyeOff,
        },
      ],
    },
    {
      title: "Program Metrics",
      icon: Gauge,
      fields: [
        {
          label: "Duration",
          value: record.duration,
          icon: Clock,
          format: formatDuration,
        },
        {
          label: "Calories Burned",
          value: record.calories,
          icon: Flame,
          format: formatCalories,
        },
        {
          label: "Visibility",
          value: record.show ? "Visible" : "Hidden",
          icon: record.show ? Eye : EyeOff,
        },
        ...(record.count
          ? [
              {
                label: "Count",
                value: record.count,
                icon: BarChart3,
              },
            ]
          : []),
      ],
    },
  ];

  return (
    <GenericDetailsModal
      isOpen={isOpen}
      onClose={onClose}
      title={training.name}
      subtitle={
        <div className="flex items-center gap-4 text-xs text-white/80">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {training.category}
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {formatDuration(training.duration)}
          </div>
        </div>
      }
      record={training}
      type="training"
      tabs={tabs}
      sections={sections}
      statusConfig={{
        field: "status",
        getColor: getStatusColor,
      }}
      roleConfig={{
        field: "difficulty",
        getColor: getDifficultyColor,
        label: "Difficulty",
      }}
    />
  );
};

export default TrainingDetailsModal;
