"use client";
import React from "react";
import {
  User,
  Mail,
  Calendar,
  FileText,
  Tag,
  Eye,
  Clock,
  TrendingUp,
  BarChart3,
  BookOpen,
  PenTool,
  Hash,
} from "lucide-react";
import GenericDetailsModal from "../shared/GenericDetailsModal";

interface Blog {
  id: string;
  title: string;
  description: string;
  author: string;
  category: string;
  status: "published" | "draft" | "archived";
  publishDate: string;
  featured: boolean;
  views?: number;
  comments?: number;
  likes?: number;
  readTime?: number;
  tags?: string[];
  content?: string;
}

interface BlogDetailsModalProps {
  blog: Blog;
  isOpen: boolean;
  onClose: () => void;
}

const BlogDetailsModal: React.FC<BlogDetailsModalProps> = ({
  blog,
  isOpen,
  onClose,
}) => {
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "published":
        return "bg-green-500";
      case "draft":
        return "bg-yellow-500";
      case "archived":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "fitness":
        return "from-green-500 to-green-600";
      case "nutrition":
        return "from-blue-600 to-blue-700";
      case "lifestyle":
        return "from-purple-500 to-purple-600";
      case "training":
        return "from-amber-500 to-amber-600";
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

  const formatReadTime = (minutes: number) => `${minutes} min read`;
  const formatNumber = (num: number) => num?.toLocaleString() || "0";

  const tabs = [
    { id: "overview", label: "Overview", icon: FileText },
    { id: "content", label: "Content", icon: BookOpen },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "metadata", label: "Metadata", icon: Hash },
  ];

  const sections = (record: Record<string, any>) => [
    {
      title: "Basic Information",
      icon: FileText,
      fields: [
        {
          label: "Title",
          value: record.title,
          icon: FileText,
        },
        {
          label: "Description",
          value: record.description,
          icon: PenTool,
        },
        {
          label: "Author",
          value: record.author,
          icon: User,
        },
        {
          label: "Category",
          value: record.category,
          icon: Tag,
        },
        {
          label: "Publish Date",
          value: record.publishDate,
          icon: Calendar,
          format: formatDate,
        },
        {
          label: "Read Time",
          value: record.readTime,
          icon: Clock,
          format: formatReadTime,
        },
      ],
    },
    {
      title: "Status & Visibility",
      icon: Eye,
      fields: [
        {
          label: "Status",
          value: record.status,
          icon: Eye,
        },
        {
          label: "Featured",
          value: record.featured ? "Yes" : "No",
          icon: TrendingUp,
        },
        {
          label: "Tags",
          value: record.tags?.join(", ") || "No tags",
          icon: Tag,
        },
      ],
    },
    {
      title: "Performance Metrics",
      icon: BarChart3,
      fields: [
        {
          label: "Views",
          value: record.views,
          icon: Eye,
          format: formatNumber,
        },
        {
          label: "Comments",
          value: record.comments,
          icon: BookOpen,
          format: formatNumber,
        },
        {
          label: "Likes",
          value: record.likes,
          icon: TrendingUp,
          format: formatNumber,
        },
      ],
    },
    {
      title: "Content",
      icon: BookOpen,
      fields: [
        {
          label: "Content Preview",
          value: record.content
            ? `${record.content.substring(0, 200)}...`
            : "No content available",
          icon: PenTool,
        },
      ],
    },
  ];

  return (
    <GenericDetailsModal
      isOpen={isOpen}
      onClose={onClose}
      title={blog?.title || "Blog Details"}
      subtitle={
        <div className="flex items-center gap-4 text-xs text-white/80">
          <div className="flex items-center gap-1">
            <User className="w-3 h-3" />
            By {blog.author}
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            Published {formatDate(blog.publishDate)}
          </div>
          <div className="flex items-center gap-1">
            <Tag className="w-3 h-3" />
            {blog.category}
          </div>
        </div>
      }
      record={blog}
      type="blog"
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

export default BlogDetailsModal;
