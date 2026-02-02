"use client";
import React from "react";
import {
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  CreditCard,
  Clock,
  UserCheck,
  Target,
  Activity,
  Dumbbell,
  Ruler,
  TrendingUp,
  Flame,
  BarChart3,
  Award,
  HeartPulse,
  Footprints,
  Gauge,
  Weight,
  RulerIcon as Measure,
  Bed,
  Crown,
} from "lucide-react";
import GenericDetailsModal from "../shared/GenericDetailsModal";

interface Member {
  id: string;
  role?: string;
  fullName?: string;
  email?: string;
  phone?: string;
  birthDate?: string;
  address?: string;
  gender?: string;
  age?: number;
  weights?: number;
  height?: number;
  membershipStatus?: string;
  membershipPlan?: string;
  trainer?: string;
  bmi?: number;
  goal?: string;
  lastCheckin?: string;
  joinDate?: string;
  totalSteps?: number;
  totalDaysTraining?: number;
  caloriesBurnedLast7Days?: number;
  timeTrainingLast7Days?: number;
  sleepTime?: number;
  chest?: number;
  biceps?: number;
  triceps?: number;
  waist?: number;
  belly?: number;
  thigh?: number;
  buttock?: number;
  status?: string;
}

interface MemberDetailsModalProps {
  member: Member;
  isOpen: boolean;
  onClose: () => void;
}

const MemberDetailsModal: React.FC<MemberDetailsModalProps> = ({
  member,
  isOpen,
  onClose,
}) => {
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "bg-green-500";
      case "frozen":
        return "bg-blue-500";
      case "expired":
        return "bg-red-500";
      case "staff":
        return "bg-purple-500";
      default:
        return "bg-gray-500";
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "Premium Member":
        return "from-red-500 to-red-600";
      case "Standard Member":
        return "from-blue-600 to-blue-700";
      case "Trainer":
        return "from-amber-500 to-amber-600";
      case "Admin":
        return "from-purple-500 to-purple-600";
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

  const formatNumber = (num: number) => num.toLocaleString();
  const formatTime = (hours: number) => `${hours} hours`;
  const formatSleep = (hours: number) => `${hours} hours/night`;
  const formatWeight = (weight: number) => `${weight} kg`;
  const formatHeight = (height: number) => `${height} cm`;
  const formatMeasurement = (measurement: number) => `${measurement} cm`;

  const tabs = [
    { id: "overview", label: "Overview", icon: User },
    { id: "membership", label: "Membership", icon: CreditCard },
    { id: "activity", label: "Activity", icon: Activity },
    { id: "measurements", label: "Measurements", icon: Ruler },
  ];

  const sections = (record: Record<string, any>) => [
    {
      title: "Personal Information",
      icon: User,
      fields: [
        {
          label: "Email",
          value: record.email,
          icon: Mail,
        },
        {
          label: "Phone",
          value: record.phone,
          icon: Phone,
        },
        {
          label: "Date of Birth",
          value: record.birthDate,
          icon: Calendar,
          format: formatDate,
        },
        {
          label: "Age",
          value: record.age,
          icon: User,
        },
        {
          label: "Gender",
          value: record.gender,
          icon: User,
        },
        {
          label: "Address",
          value: record.address,
          icon: MapPin,
        },
      ],
    },
    {
      title: "Physical Stats",
      icon: Weight,
      fields: [
        {
          label: "Weight",
          value: record.weights,
          icon: Weight,
          format: formatWeight,
        },
        {
          label: "Height",
          value: record.height,
          icon: Ruler,
          format: formatHeight,
        },
        {
          label: "BMI",
          value: record.bmi,
          icon: Gauge,
        },
        {
          label: "Sleep Time",
          value: record.sleepTime,
          icon: Bed,
          format: formatSleep,
        },
      ],
    },
    {
      title: "Membership Status",
      icon: CreditCard,
      fields: [
        {
          label: "Status",
          value: record.membershipStatus,
          icon: UserCheck,
        },
        {
          label: "Plan",
          value: record.membershipPlan,
          icon: CreditCard,
        },
        {
          label: "Trainer",
          value: record.trainer,
          icon: User,
        },
        {
          label: "Goal",
          value: record.goal,
          icon: Target,
        },
        {
          label: "Join Date",
          value: record.joinDate,
          icon: Calendar,
          format: formatDate,
        },
      ],
    },
    {
      title: "Activity & Performance",
      icon: Activity,
      fields: [
        {
          label: "Last Check-in",
          value: record.lastCheckin,
          icon: Clock,
          format: formatDateTime,
        },
        {
          label: "Total Steps",
          value: record.totalSteps,
          icon: Footprints,
          format: formatNumber,
        },
        {
          label: "Total Training Days",
          value: record.totalDaysTraining,
          icon: Activity,
          format: formatNumber,
        },
        {
          label: "Calories Burned (7 days)",
          value: record.caloriesBurnedLast7Days,
          icon: Flame,
          format: formatNumber,
        },
        {
          label: "Training Time (7 days)",
          value: record.timeTrainingLast7Days,
          icon: Clock,
          format: formatTime,
        },
      ],
    },
    {
      title: "Body Measurements",
      icon: Measure,
      fields: [
        {
          label: "Chest",
          value: record.chest,
          icon: Measure,
          format: formatMeasurement,
        },
        {
          label: "Biceps",
          value: record.biceps,
          icon: Measure,
          format: formatMeasurement,
        },
        {
          label: "Triceps",
          value: record.triceps,
          icon: Measure,
          format: formatMeasurement,
        },
        {
          label: "Waist",
          value: record.waist,
          icon: Measure,
          format: formatMeasurement,
        },
        {
          label: "Belly",
          value: record.belly,
          icon: Measure,
          format: formatMeasurement,
        },
        {
          label: "Thigh",
          value: record.thigh,
          icon: Measure,
          format: formatMeasurement,
        },
        {
          label: "Buttock",
          value: record.buttock,
          icon: Measure,
          format: formatMeasurement,
        },
      ],
    },
  ];

  return (
    <GenericDetailsModal
      isOpen={isOpen}
      onClose={onClose}
      title={member.fullName || "Member Details"}
      subtitle={
        <div className="flex items-center gap-4 text-xs text-white/80">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            Joined {formatDate(member.joinDate)}
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Last seen {formatDateTime(member.lastCheckin)}
          </div>
        </div>
      }
      record={member}
      type="member"
      tabs={tabs}
      sections={sections}
      statusConfig={{
        field: "status",
        getColor: getStatusColor,
      }}
      roleConfig={{
        field: "role",
        getColor: getRoleColor,
      }}
    />
  );
};

export default MemberDetailsModal;
