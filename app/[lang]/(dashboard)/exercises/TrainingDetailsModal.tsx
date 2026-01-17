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
import { useTranslate } from "@/config/useTranslation";

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
  const { t } = useTranslate();

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
    if (secondsNum < 60) return t("SECONDS", { seconds: secondsNum });
    const minutes = Math.floor(secondsNum / 60);
    const remainingSeconds = secondsNum % 60;

    if (minutes < 60) {
      return remainingSeconds > 0
        ? t("MINUTES_SECONDS", { minutes, seconds: remainingSeconds })
        : t("MINUTES", { minutes });
    }

    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0
      ? t("HOURS_MINUTES", { hours, minutes: remainingMinutes })
      : t("HOURS", { hours });
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

  const formatBoolean = (value: boolean) => (value ? t("YES") : t("NO"));

  const getRecommendedIcon = (isRecommended: boolean) =>
    isRecommended ? CheckCircle : XCircle;

  const tabs = [{ id: "overview", label: t("OVERVIEW"), icon: Activity }];

  const sections = (record: Training) => [
    {
      title: t("BASIC_INFORMATION"),
      icon: Activity,
      fields: [
        {
          label: t("ID"),
          value: record.id,
          icon: Hash,
        },
        {
          label: t("ENGLISH_TITLE"),
          value: record.title?.english || t("NOT_AVAILABLE"),
          icon: Type,
        },
        {
          label: t("ARABIC_TITLE"),
          value: record.title?.arabic || t("NOT_AVAILABLE"),
          icon: Type,
        },
        {
          label: t("CATEGORY"),
          value: record.Category?.name?.english || t("NOT_AVAILABLE"),
          subtitle: record.Category?.name?.arabic,
          icon: getCategoryIcon(record.Category?.name?.english),
        },
        {
          label: t("STATUS"),
          value: t(record.status?.toUpperCase()),
          icon:
            record.status?.toLowerCase() === "active" ? CheckCircle : XCircle,
        },
      ],
    },
    {
      title: t("CONTENT_DETAILS"),
      icon: Gauge,
      fields: [
        {
          label: t("ENGLISH_DESCRIPTION"),
          value: record.description?.english || t("NOT_AVAILABLE"),
          icon: Globe,
          isMultiline: true,
        },
        {
          label: t("ARABIC_DESCRIPTION"),
          value: record.description?.arabic || t("NOT_AVAILABLE"),
          icon: Globe,
          isMultiline: true,
        },
      ],
    },
    {
      title: t("MEDIA_CONTENT"),
      icon: ImageIcon,
      fields: [
        {
          label: t("EXERCISE_IMAGE"),
          value: record.url,
          icon: ImageIcon,
          isImage: true,
        },
        {
          label: t("EXERCISE_VIDEO"),
          value: record.videoUrl,
          icon: Video,
          isVideo: true,
        },
      ],
    },
    {
      title: t("EXERCISE_METRICS"),
      icon: TrendingUp,
      fields: [
        {
          label: t("DIFFICULTY"),
          value: t(record.difficulty?.toUpperCase()),
          icon: Target,
        },
        {
          label: t("CALORIES"),
          value: record.calory,
          format: (value: number) => `${value} ${t("KCAL")}`,
          icon: Flame,
        },
        {
          label: t("DURATION"),
          value: record.duration,
          format: (value: number) => `${value} ${t("SECONDS")}`,
          icon: Clock,
        },
        ...(record.count !== null
          ? [
              {
                label: t("REPETITION_COUNT"),
                value: record.count,
                icon: BarChart3,
              },
            ]
          : []),
      ],
    },
    {
      title: t("METADATA"),
      icon: Calendar,
      fields: [
        {
          label: t("CREATED_AT"),
          value: record.createdAt,
          format: formatDate,
          icon: Calendar,
        },
        {
          label: t("UPDATED_AT"),
          value: record.updatedAt,
          format: formatDate,
          icon: Calendar,
        },
      ],
    },
  ];

  return (
    <GenericDetailsModal
      isOpen={isOpen}
      onClose={onClose}
      title={training.title?.english || t("TRAINING_DETAILS")}
      subtitle={
        <div className="flex items-center gap-4 text-xs text-white/80">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>
              {training.Category?.name?.english || t("UNCATEGORIZED")}
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
            <span>
              {training.calory} {t("KCAL")}
            </span>
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
        label: t("DIFFICULTY"),
      }}
      customHeaderContent={
        training.isRecommended && (
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30">
            <CheckCircle className="w-3.5 h-3.5 text-yellow-400 mr-1.5" />
            <span className="text-xs font-medium text-yellow-300">
              {t("RECOMMENDED")}
            </span>
          </div>
        )
      }
    />
  );
};

export default TrainingDetailsModal;
