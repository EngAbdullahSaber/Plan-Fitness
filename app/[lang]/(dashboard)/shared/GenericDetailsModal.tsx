"use client";
import React, { useState } from "react";
import {
  X,
  User,
  Calendar,
  Clock,
  DollarSign,
  Flame,
  BarChart3,
  Target,
  BookOpen,
  Utensils,
  Award,
} from "lucide-react";

interface TabConfig {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
}

interface SectionConfig {
  title: string;
  icon: React.ComponentType<any>;
  fields: {
    label: string;
    value: any;
    icon: React.ComponentType<any>;
    format?: (value: any) => string;
    render?: (value: any) => React.ReactNode;
  }[];
}

interface GenericDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: React.ReactNode;
  record: Record<string, any>;
  type: "member" | "training" | "blog" | "meal" | "generic";
  tabs?: TabConfig[];
  sections: (record: Record<string, any>) => SectionConfig[];
  statusConfig?: {
    field: string;
    getColor: (status: string) => string;
  };
  avatar?: React.ReactNode;
}

const GenericDetailsModal: React.FC<GenericDetailsModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  record,
  type,
  tabs = [],
  sections,
  statusConfig,
  avatar,
}) => {
  const [activeTab, setActiveTab] = useState(tabs[0]?.id || "overview");

  if (!isOpen) return null;

  // Default tabs based on type if not provided
  const defaultTabs: Record<string, TabConfig[]> = {
    member: [
      { id: "overview", label: "Overview", icon: User },
      { id: "membership", label: "Membership", icon: Award },
      { id: "activity", label: "Activity", icon: BarChart3 },
    ],
    training: [
      { id: "overview", label: "Overview", icon: Target },
      { id: "exercises", label: "Exercises", icon: BookOpen },
    ],
    blog: [
      { id: "overview", label: "Overview", icon: BookOpen },
      { id: "stats", label: "Statistics", icon: BarChart3 },
    ],
    meal: [
      { id: "overview", label: "Overview", icon: Utensils },
      { id: "nutrition", label: "Nutrition", icon: Flame },
      { id: "ingredients", label: "Ingredients", icon: BookOpen },
    ],
    generic: [{ id: "overview", label: "Overview", icon: User }],
  };

  const displayTabs =
    tabs.length > 0 ? tabs : defaultTabs[type] || defaultTabs.generic;

  // Default avatar based on type
  const defaultAvatar = (
    <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm border-4 border-white/30 flex items-center justify-center">
      {type === "training" && <Target className="w-10 h-10 text-white" />}
      {type === "blog" && <BookOpen className="w-10 h-10 text-white" />}
      {type === "meal" && <Utensils className="w-10 h-10 text-white" />}
      {(type === "member" || type === "generic") && (
        <User className="w-10 h-10 text-white" />
      )}
    </div>
  );

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);
  };

  // Format array as list
  const formatList = (items: any[]) => {
    return items.join(", ");
  };

  // Render array as bullet points
  const renderList = (items: any[]) => {
    return (
      <ul className="list-disc list-inside text-sm">
        {items.map((item, index) => (
          <li key={index} className="text-gray-700 dark:text-gray-300">
            {item}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
        {/* Header Section */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#25235F] to-[#3A38A0]">
          <div className="p-6 text-white">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                {/* Avatar */}
                <div className="relative">
                  {avatar || defaultAvatar}
                  {statusConfig && record[statusConfig.field] && (
                    <div
                      className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full ${statusConfig.getColor(
                        record[statusConfig.field]
                      )} border-3 border-white flex items-center justify-center`}
                    >
                      <div className="w-1.5 h-1.5 bg-white rounded-full" />
                    </div>
                  )}
                </div>

                {/* Basic Info */}
                <div>
                  <h1 className="text-2xl font-bold mb-1">{title}</h1>
                  <div className="flex items-center gap-2 mb-2">
                    {record.id && (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-white/10">
                        ID: {record.id}
                      </span>
                    )}
                    {record.category && (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-white/10 capitalize">
                        {record.category}
                      </span>
                    )}
                    {record.difficulty && (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-white/10 capitalize">
                        {record.difficulty}
                      </span>
                    )}
                  </div>
                  {subtitle}
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={onClose}
                className="p-2 bg-white/20 backdrop-blur-sm rounded-lg transition-all duration-200 hover:bg-white/30"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        {displayTabs.length > 1 && (
          <div className="px-6 pt-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex gap-1">
              {displayTabs.map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-t-lg text-sm font-medium transition-all duration-200 ${
                      activeTab === tab.id
                        ? "bg-[#25235F] text-white"
                        : "text-gray-600 hover:text-[#25235F] hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Content Section */}
        <div className="p-6 max-h-[50vh] overflow-y-auto">
          {sections(record)
            .filter((section) =>
              section.fields.some(
                (field) =>
                  field.value !== undefined &&
                  field.value !== null &&
                  field.value !== ""
              )
            )
            .map((section, index) => (
              <div key={index} className="space-y-4 mb-6 last:mb-0">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <section.icon className="w-4 h-4 text-[#25235F]" />
                  {section.title}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {section.fields
                    .filter(
                      (field) =>
                        field.value !== undefined &&
                        field.value !== null &&
                        field.value !== ""
                    )
                    .map((field, fieldIndex) => (
                      <div
                        key={fieldIndex}
                        className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
                      >
                        <field.icon className="w-4 h-4 text-gray-500 flex-shrink-0 mt-1" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-500 mb-1">
                            {field.label}
                          </p>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {field.render
                              ? field.render(field.value)
                              : field.format
                              ? field.format(field.value)
                              : Array.isArray(field.value)
                              ? renderList(field.value)
                              : field.value.toString()}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default GenericDetailsModal;
