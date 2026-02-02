"use client";
import React from "react";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Clock,
  Target,
  Activity,
  Dumbbell,
  Ruler,
  Flame,
  HeartPulse,
  Footprints,
  Gauge,
  Weight,
  RulerIcon as Measure,
  Bed,
  Shield,
  CheckCircle,
  XCircle,
  Cake,
  Target as TargetIcon,
  Award as AwardIcon,
  Battery,
  EyeIcon as EyeOn,
  Zap,
  PieChart,
  Hash,
  Check,
  X,
} from "lucide-react";
import GenericDetailsModal from "../shared/GenericDetailsModal";
import { useTranslate } from "@/config/useTranslation";
import { useParams } from "next/navigation";

interface User {
  id: number;
  name: string;
  phone: string;
  email?: string;
  image: string;
  role: "ADMIN" | "COACH" | "CLIENT";
  isVerified: boolean;
  height: string | null;
  weight: string | null;
  age: string | null;
  gender: "male" | "female";
  goal: string | null;
  level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | null;
  totalSteps: number | null;
  totalTrainingDays: number | null;
  measurements: {
    buttock: string | null;
    bully: string | null;
    chest: string | null;
    tricep: string | null;
    thigh: string | null;
    waist: string | null;
  };
  sleepTime: string | null;
  injuryDescription: string | null;
  dateOfBirth: string | null;
  lastUpdateData: string | null;
  createdAt: string;
  currentSubscription: any | null;
  userMeals: Array<{
    id: number;
    isAiAssign: boolean;
    mealId: number;
    mealName: string;
    mealImage: string;
    mealType: string;
    totalCalory: number;
    proteins: number;
    fat: number;
    carbs: number;
    items: Array<{
      id: number;
      description: string;
    }>;
  }>;
  trainingPlan: Array<any>;
}

interface UserDetailsModalProps {
  member: User;
  isOpen: boolean;
  onClose: () => void;
}

const UserDetailsModal: React.FC<UserDetailsModalProps> = ({
  member,
  isOpen,
  onClose,
}) => {
  const { t } = useTranslate();
  const { language } = useParams();

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return t("not_set");
    try {
      return new Date(dateString).toLocaleDateString(
        language === "ar" ? "ar-SA" : "en-US",
        {
          year: "numeric",
          month: "short",
          day: "numeric",
        },
      );
    } catch {
      return t("invalid_date");
    }
  };

  const formatDateTime = (dateString?: string | null) => {
    if (!dateString) return t("never");
    try {
      return new Date(dateString).toLocaleString(
        language === "ar" ? "ar-SA" : "en-US",
        {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        },
      );
    } catch {
      return t("invalid_date");
    }
  };

  const formatNumber = (num: number | null) => {
    if (num === null || num === undefined) return "0";
    return num.toLocaleString(language === "ar" ? "ar-SA" : "en-US");
  };

  const formatWeight = (weight: string | null) => {
    if (!weight) return t("not_set");
    return `${weight} ${t("kg")}`;
  };

  const formatHeight = (height: string | null) => {
    if (!height) return t("not_set");
    return `${height} ${t("cm")}`;
  };

  const formatMeasurement = (measurement: string | null) => {
    if (!measurement) return t("not_measured");
    return `${measurement} ${t("cm")}`;
  };

  const formatAge = (ageString: string | null) => {
    if (!ageString) return t("not_set");
    try {
      const birthDate = new Date(ageString);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        age--;
      }
      return t("age_years", { age });
    } catch {
      return t("invalid_date");
    }
  };

  const calculateBMI = (height: string | null, weight: string | null) => {
    if (!height || !weight) return t("not_available");
    const heightM = parseFloat(height) / 100;
    const weightKg = parseFloat(weight);
    if (isNaN(heightM) || isNaN(weightKg) || heightM === 0)
      return t("not_available");
    const bmi = weightKg / (heightM * heightM);
    return bmi.toFixed(1);
  };

  const getStatusColor = (isVerified: boolean) => {
    return isVerified ? "bg-green-500" : "bg-red-500";
  };

  const formatGender = (gender: string | null) => {
    if (!gender) return t("not_set");
    return t(gender.toLowerCase());
  };

  const formatRole = (role: string) => {
    return t(role.toLowerCase());
  };

  const formatLevel = (level: string | null) => {
    if (!level) return t("not_set");
    return t(level.toLowerCase());
  };

  const userAvatar = (
    <div className="relative">
      {member.image ? (
        <img
          src={member.image}
          alt={member.name}
          className="w-20 h-20 rounded-full bg-white/20 dark:bg-gray-800/40 backdrop-blur-sm border-4 border-white/30 dark:border-gray-700/50 object-cover"
        />
      ) : (
        <div className="w-20 h-20 rounded-full bg-white/20 dark:bg-gray-800/40 backdrop-blur-sm border-4 border-white/30 dark:border-gray-700/50 flex items-center justify-center">
          <User className="w-10 h-10 text-white" />
        </div>
      )}
      <div
        className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full ${getStatusColor(
          member.isVerified,
        )} border-3 border-white dark:border-gray-900 flex items-center justify-center`}
      >
        {member.isVerified ? (
          <Check className="w-3 h-3 text-white" />
        ) : (
          <X className="w-3 h-3 text-white" />
        )}
      </div>
    </div>
  );

  const sections = (record: User) => [
    {
      title: t("personal_information"),
      icon: User,
      fields: [
        {
          label: t("id"),
          value: record.id,
          icon: Hash,
        },
        {
          label: t("name"),
          value: record.name || t("not_provided"),
          icon: User,
        },
        {
          label: t("email"),
          value: record.email || t("not_provided"),
          icon: Mail,
        },
        {
          label: t("phone"),
          value: record.phone,
          icon: Phone,
        },
        {
          label: t("date_of_birth"),
          value: record.dateOfBirth,
          format: formatDate,
          icon: Cake,
        },
        {
          label: t("age"),
          value: record.age || record.dateOfBirth,
          format: formatAge,
          icon: User,
        },
        {
          label: t("gender"),
          value: formatGender(record.gender),
          icon: User,
        },
      ],
    },
    {
      title: t("account_information"),
      icon: Shield,
      fields: [
        {
          label: t("role"),
          value: formatRole(record.role),
          icon: AwardIcon,
        },
        {
          label: t("level"),
          value: formatLevel(record.level),
          icon: TargetIcon,
        },
        {
          label: t("goal"),
          value: record.goal || t("not_set"),
          icon: Target,
        },
        {
          label: t("verification"),
          value: record.isVerified ? t("verified") : t("not_verified"),
          icon: record.isVerified ? CheckCircle : XCircle,
        },
        {
          label: t("account_created"),
          value: record.createdAt,
          format: formatDate,
          icon: Calendar,
        },
        {
          label: t("last_update"),
          value: record.lastUpdateData,
          format: formatDateTime,
          icon: Clock,
        },
      ],
    },
    {
      title: t("physical_stats"),
      icon: Weight,
      fields: [
        {
          label: t("weight"),
          value: record.weight,
          format: formatWeight,
          icon: Weight,
        },
        {
          label: t("height"),
          value: record.height,
          format: formatHeight,
          icon: Ruler,
        },
        {
          label: t("bmi"),
          value: calculateBMI(record.height, record.weight),
          icon: Gauge,
        },
        {
          label: t("sleep_time"),
          value: record.sleepTime || t("not_set"),
          icon: Bed,
        },
      ],
    },
    {
      title: t("activity_training"),
      icon: Activity,
      fields: [
        {
          label: t("total_steps"),
          value: record.totalSteps,
          format: formatNumber,
          suffix: ` ${t("steps")}`,
          icon: Footprints,
        },
        {
          label: t("total_training_days"),
          value: record.totalTrainingDays,
          format: formatNumber,
          suffix: ` ${t("days")}`,
          icon: Dumbbell,
        },
        {
          label: t("training_plans"),
          value: record.trainingPlan?.length || 0,
          suffix: ` ${t("plans")}`,
          icon: Target,
        },
        {
          label: t("injury_description"),
          value: record.injuryDescription || t("no_injuries_reported"),
          icon: HeartPulse,
          isMultiline: true,
        },
      ],
    },
    {
      title: t("body_measurements"),
      icon: Measure,
      fields: [
        {
          label: t("chest"),
          value: record.measurements?.chest,
          format: formatMeasurement,
          icon: Measure,
        },
        {
          label: t("buttock"),
          value: record.measurements?.buttock,
          format: formatMeasurement,
          icon: Measure,
        },
        {
          label: t("belly"),
          value: record.measurements?.bully,
          format: formatMeasurement,
          icon: Measure,
        },
        {
          label: t("triceps"),
          value: record.measurements?.tricep,
          format: formatMeasurement,
          icon: Measure,
        },
        {
          label: t("thigh"),
          value: record.measurements?.thigh,
          format: formatMeasurement,
          icon: Measure,
        },
        {
          label: t("waist"),
          value: record.measurements?.waist,
          format: formatMeasurement,
          icon: Measure,
        },
      ],
    },
    {
      title: t("nutrition"),
      icon: PieChart,
      fields: [
        {
          label: t("total_meals"),
          value: record.userMeals?.length || 0,
          suffix: ` ${t("meals")}`,
          icon: PieChart,
        },
        {
          label: t("ai_assigned_meals"),
          value:
            record.userMeals?.filter((meal) => meal.isAiAssign)?.length || 0,
          suffix: ` ${t("meals")}`,
          icon: Zap,
        },
        {
          label: t("total_calories_today"),
          value:
            record.userMeals?.reduce(
              (sum, meal) => sum + (meal.totalCalory || 0),
              0,
            ) || 0,
          format: formatNumber,
          suffix: ` ${t("cal")}`,
          icon: Flame,
        },
        {
          label: t("average_proteins"),
          value:
            record.userMeals?.length > 0
              ? Math.round(
                  record.userMeals.reduce(
                    (sum, meal) => sum + (meal.proteins || 0),
                    0,
                  ) / record.userMeals.length,
                )
              : 0,
          suffix: ` ${t("g")}`,
          icon: Battery,
        },
      ],
    },
  ];

  const preparedRecord = {
    ...member,
    category: member.role?.toLowerCase() || "",
    difficulty: member.level?.toLowerCase() || "",
  };

  return (
    <GenericDetailsModal
      isOpen={isOpen}
      onClose={onClose}
      title={member.name || t("user_details")}
      subtitle={
        <div className="flex items-center gap-4 text-xs text-white/80">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>
              {t("joined")} {formatDate(member.createdAt)}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <EyeOn className="w-3 h-3" />
            <span>
              {t("member_since")} {formatDate(member.createdAt)}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Zap className="w-3 h-3" />
            <span>
              {t("level")}: {formatLevel(member.level)}
            </span>
          </div>
        </div>
      }
      record={preparedRecord}
      type="member"
      tabs={[{ id: "overview", label: t("overview"), icon: User }]}
      sections={sections}
      statusConfig={{
        field: "isVerified",
        getColor: getStatusColor,
      }}
      avatar={userAvatar}
    />
  );
};

export default UserDetailsModal;
