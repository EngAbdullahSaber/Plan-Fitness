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
  Globe,
  TrendingUp,
  CheckCircle,
  XCircle,
  Image as ImageIcon,
  Video,
  Hash,
  Type,
} from "lucide-react";
import GenericDetailsModal from "../shared/GenericDetailsModal";

interface Training {
  id: number;
  categoryId: number;
  title: {
    arabic: string;
    english: string;
  };
  description: {
    arabic: string;
    english: string;
  };
  url: string;
  videoUrl: string;
  count: number | null;
  duration: string | number;
  isRecommended: boolean;
  status: string;
  difficulty: string;
  calory: number;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  CreatedBy: number;
  Category: {
    id: number;
    name: {
      arabic: string;
      english: string;
    };
  };
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

  const getCategoryIcon = (categoryName: string) => {
    switch (categoryName?.toLowerCase()) {
      case "strength":
        return Award;
      case "cardio":
        return HeartPulse;
      case "flexibility":
        return BarChart3;
      case "endurance":
        return Target;
      case "fitness":
      case "اللياقة البدنية":
        return Activity;
      case "bodyweight":
        return Crown;
      default:
        return Activity;
    }
  };

  const formatDuration = (seconds: string | number) => {
    const secondsNum =
      typeof seconds === "string" ? parseInt(seconds) : seconds;
    if (secondsNum < 60) return `${secondsNum} seconds`;
    const minutes = Math.floor(secondsNum / 60);
    const remainingSeconds = secondsNum % 60;

    if (minutes < 60) {
      return remainingSeconds > 0
        ? `${minutes}m ${remainingSeconds}s`
        : `${minutes}m`;
    }

    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0
      ? `${hours}h ${remainingMinutes}m`
      : `${hours}h`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatBoolean = (value: boolean) => (value ? "Yes" : "No");

  const getRecommendedIcon = (isRecommended: boolean) =>
    isRecommended ? CheckCircle : XCircle;

  const tabs = [{ id: "overview", label: "Overview", icon: Activity }];

  const sections = (record: Training) => [
    {
      title: "Basic Information",
      icon: Activity,
      fields: [
        {
          label: "ID",
          value: record.id,
          icon: Hash,
        },
        {
          label: "English Title",
          value: record.title?.english || "N/A",
          icon: Type,
        },
        {
          label: "Arabic Title",
          value: record.title?.arabic || "N/A",
          icon: Type,
        },
        {
          label: "Category",
          value: record.Category?.name?.english || "N/A",
          subtitle: record.Category?.name?.arabic,
          icon: getCategoryIcon(record.Category?.name?.english),
        },
        {
          label: "Status",
          value: record.status,
          icon:
            record.status?.toLowerCase() === "active" ? CheckCircle : XCircle,
        },
      ],
    },
    {
      title: "Content Details",
      icon: Gauge,
      fields: [
        {
          label: "English Description",
          value: record.description?.english || "N/A",
          icon: Globe,
          isMultiline: true,
        },
        {
          label: "Arabic Description",
          value: record.description?.arabic || "N/A",
          icon: Globe,
          isMultiline: true,
        },
      ],
    },
    {
      title: "Media Content",
      icon: ImageIcon,
      fields: [
        {
          label: "Exercise Image",
          value: record.url,
          icon: ImageIcon,
          isImage: true,
        },
        {
          label: "Exercise Video",
          value: record.videoUrl,
          icon: Video,
          isVideo: true,
        },
      ],
    },
    {
      title: "Exercise Metrics",
      icon: TrendingUp,
      fields: [
        {
          label: "Difficulty",
          value: record.difficulty,
          icon: Target,
        },
        {
          label: "Calories",
          value: record.calory,
          format: (value: number) => `${value} kcal`,
          icon: Flame,
        },
        {
          label: "Duration",
          value: record.duration,
          format: formatDuration,
          icon: Clock,
        },
        ...(record.count !== null
          ? [
              {
                label: "Repetition Count",
                value: record.count,
                icon: BarChart3,
              },
            ]
          : []),
        {
          label: "Recommended",
          value: record.isRecommended,
          format: formatBoolean,
          icon: getRecommendedIcon(record.isRecommended),
        },
      ],
    },
    {
      title: "Metadata",
      icon: Calendar,
      fields: [
        {
          label: "Created By User ID",
          value: record.CreatedBy,
          icon: Hash,
        },
        {
          label: "Created At",
          value: record.createdAt,
          format: formatDate,
          icon: Calendar,
        },
        {
          label: "Updated At",
          value: record.updatedAt,
          format: formatDate,
          icon: Calendar,
        },
        {
          label: "Category ID",
          value: record.categoryId,
          icon: Hash,
        },
      ],
    },
  ];

  return (
    <GenericDetailsModal
      isOpen={isOpen}
      onClose={onClose}
      title={training.title?.english || "Training Details"}
      subtitle={
        <div className="flex items-center gap-4 text-xs text-white/80">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>
              {training.Category?.name?.english || "Uncategorized"}
              {training.Category?.name?.arabic && (
                <span className="ml-1 text-white/60">
                  ({training.Category.name.arabic})
                </span>
              )}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{formatDuration(training.duration)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Flame className="w-3 h-3" />
            <span>{training.calory} kcal</span>
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
      customHeaderContent={
        training.isRecommended && (
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30">
            <CheckCircle className="w-3.5 h-3.5 text-yellow-400 mr-1.5" />
            <span className="text-xs font-medium text-yellow-300">
              Recommended
            </span>
          </div>
        )
      }
    />
  );
};

export default TrainingDetailsModal;
