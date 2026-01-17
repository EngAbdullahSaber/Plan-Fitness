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
  ExternalLink,
} from "lucide-react";

interface TabConfig {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
}

interface FieldConfig {
  label: string;
  value: any;
  icon: React.ComponentType<any>;
  format?: (value: any) => string;
  render?: (value: any) => React.ReactNode;
  isLink?: boolean;
  isMultiline?: boolean;
  isImage?: boolean;
  isVideo?: boolean;
  subtitle?: string;
}

interface SectionConfig {
  title: string;
  icon: React.ComponentType<any>;
  fields: FieldConfig[];
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
    <div className="w-20 h-20 rounded-full bg-white/20 dark:bg-gray-800/40 backdrop-blur-sm border-4 border-white/30 dark:border-gray-700/50 flex items-center justify-center">
      {type === "training" && <Target className="w-10 h-10 text-white" />}
      {type === "blog" && <BookOpen className="w-10 h-10 text-white" />}
      {type === "meal" && <Utensils className="w-10 h-10 text-white" />}
      {(type === "member" || type === "generic") && (
        <User className="w-10 h-10 text-white" />
      )}
    </div>
  );

  // Render field value based on configuration
  const renderFieldValue = (field: FieldConfig) => {
    if (field.render) {
      return field.render(field.value);
    }

    if (field.isImage) {
      return (
        <div className="space-y-2">
          <div className="relative w-full h-48 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
            <img
              src={field.value}
              alt={field.label}
              className="w-full h-full object-cover"
            />
          </div>
          <a
            href={field.value}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            View original <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      );
    }

    if (field.isVideo) {
      return (
        <div className="space-y-2">
          <div className="relative w-full h-48 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800">
            {field.value.includes("youtube") ||
            field.value.includes("youtu.be") ? (
              // YouTube video
              <iframe
                src={field.value.replace("watch?v=", "embed/")}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={field.label}
              />
            ) : field.value.includes("vimeo") ? (
              // Vimeo video
              <iframe
                src={field.value.replace("vimeo.com", "player.vimeo.com/video")}
                className="w-full h-full"
                allowFullScreen
                title={field.label}
              />
            ) : (
              // Direct video
              <video
                src={field.value}
                className="w-full h-full"
                controls
                controlsList="nodownload"
              >
                Your browser does not support the video tag.
              </video>
            )}
          </div>
          <a
            href={field.value}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            Open in new tab <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      );
    }

    if (field.isLink) {
      return (
        <a
          href={field.value}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline truncate"
        >
          {field.value}
          <ExternalLink className="w-3 h-3 flex-shrink-0" />
        </a>
      );
    }

    if (field.isMultiline) {
      return (
        <div className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
          {field.value}
        </div>
      );
    }

    if (field.format) {
      return field.format(field.value);
    }

    if (Array.isArray(field.value)) {
      return (
        <ul className="list-disc list-inside text-sm space-y-1">
          {field.value.map((item: any, index: number) => (
            <li key={index} className="text-gray-700 dark:text-gray-300">
              {item}
            </li>
          ))}
        </ul>
      );
    }

    return field.value?.toString() || "N/A";
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl dark:shadow-gray-950/50 w-full max-w-3xl max-h-[90vh] overflow-hidden">
        {/* Header Section */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#25235F] via-[#3A38A0] to-[#25235F]/90">
          <div className="p-6 text-white">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                {/* Avatar */}
                <div className="relative">
                  {avatar || defaultAvatar}
                  {statusConfig && record[statusConfig.field] && (
                    <div
                      className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full ${statusConfig.getColor(
                        record[statusConfig.field],
                      )} border-3 border-white dark:border-gray-900 flex items-center justify-center`}
                    >
                      <div className="w-1.5 h-1.5 bg-white dark:bg-gray-100 rounded-full" />
                    </div>
                  )}
                </div>

                {/* Basic Info */}
                <div>
                  <h1 className="text-2xl font-bold mb-1 dark:text-white">
                    {title}
                  </h1>
                  <div className="flex items-center gap-2 mb-2">
                    {record.id && (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-white/20 dark:bg-gray-800/60 backdrop-blur-sm">
                        ID: {record.id}
                      </span>
                    )}
                    {record.category && (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-white/20 dark:bg-gray-800/60 backdrop-blur-sm capitalize">
                        {record.category}
                      </span>
                    )}
                    {record.difficulty && (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-white/20 dark:bg-gray-800/60 backdrop-blur-sm capitalize">
                        {record.difficulty}
                      </span>
                    )}
                  </div>
                  {subtitle && (
                    <div className="dark:text-gray-300">{subtitle}</div>
                  )}
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={onClose}
                className="p-2 bg-white/20 dark:bg-gray-800/40 backdrop-blur-sm rounded-lg transition-all duration-200 hover:bg-white/30 dark:hover:bg-gray-800/60"
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
                    className={`
                      flex items-center gap-2 px-4 py-2 rounded-t-lg text-sm font-medium transition-all duration-200
                      ${
                        activeTab === tab.id
                          ? "bg-[#25235F] dark:bg-[#3A38A0] text-white"
                          : "text-gray-600 dark:text-gray-400 hover:text-[#25235F] dark:hover:text-blue-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                      }
                    `}
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
                  field.value !== "",
              ),
            )
            .map((section, index) => (
              <div key={index} className="space-y-4 mb-6 last:mb-0">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <section.icon className="w-4 h-4 text-[#25235F] dark:text-blue-400" />
                  {section.title}
                </h3>

                <div className="grid grid-cols-1 gap-4">
                  {section.fields
                    .filter(
                      (field) =>
                        field.value !== undefined &&
                        field.value !== null &&
                        field.value !== "",
                    )
                    .map((field, fieldIndex) => (
                      <div
                        key={fieldIndex}
                        className={`
                          flex items-start gap-3 p-3 rounded-lg 
                          ${field.isImage || field.isVideo ? "flex-col" : "flex-row"}
                          bg-gray-50 dark:bg-gray-800/50
                          border border-gray-100 dark:border-gray-700/50
                        `}
                      >
                        <div className="flex items-start gap-3 w-full">
                          <field.icon className="w-4 h-4 text-gray-500 dark:text-gray-400 flex-shrink-0 mt-1" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {field.label}
                              </p>
                              {field.subtitle && (
                                <span className="text-xs text-gray-400 dark:text-gray-500">
                                  ({field.subtitle})
                                </span>
                              )}
                            </div>
                            <div className="font-medium text-gray-900 dark:text-gray-100">
                              {renderFieldValue(field)}
                            </div>
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
