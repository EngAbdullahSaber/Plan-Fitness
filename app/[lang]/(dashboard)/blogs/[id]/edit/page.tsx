"use client";
import React from "react";
import GenericUpdateForm from "../../../shared/GenericUpdateForm";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useTranslate } from "@/config/useTranslation";

const BlogUpdateForm = ({ onClose }: { onClose?: () => void }) => {
  const handleSubmit = (data: Record<string, any>) => {
    console.log("Form submitted:", data);
    // Here you would typically send the data to your API
    if (onClose) onClose();
  };
  const router = useRouter();
  const { t } = useTranslate();

  const handleCancel = () => {
    if (onClose) onClose();
  };

  const initialData = {
    id: "BLOG-004",
    title: "Advanced Strength Training Techniques",
    description: "10 Best Exercises for Weight Loss",
    author: "David Lee",
    category: "training",
    status: "published",
    publishDate: "2024-06-08",
    featured: true,
    tags: "strength training, weight loss, exercises",
    metaTitle: "Advanced Strength Training Techniques for Weight Loss",
    metaDescription:
      "Learn the best strength training techniques and exercises for effective weight loss and muscle building.",
    featuredImage: "https://example.com/images/strength-training.jpg",
    content:
      "<p>This is the full content of the blog post about advanced strength training techniques...</p>",
    views: 1250,
    comments: 23,
    likes: 45,
  };

  const categories = [
    "fitness",
    "nutrition",
    "lifestyle",
    "training",
    "wellness",
    "recipes",
    "motivation",
  ];

  const statusOptions = ["draft", "published", "archived"];
  const authors = [
    "David Lee",
    "Sarah Johnson",
    "Mike Thompson",
    "Emily Wilson",
    "Alex Rodriguez",
  ];

  const fields = [
    // Basic Information Section
    [
      {
        name: "title",
        label: "Blog Title",
        type: "text",
        placeholder: "Enter blog title",
        required: true,
        validation: {
          minLength: 5,
          maxLength: 200,
          custom: (value) => {
            if (!value || value.trim() === "") return "Blog title is required";
            if (value.length < 5) return "Title must be at least 5 characters";
            return null;
          },
        },
      },
      {
        name: "description",
        label: "Description",
        type: "textarea",
        placeholder: "Enter a brief description of the blog post",
        required: true,
        validation: {
          minLength: 20,
          maxLength: 300,
          custom: (value) => {
            if (!value || value.trim() === "") return "Description is required";
            if (value.length < 20)
              return "Description must be at least 20 characters";
            return null;
          },
        },
      },
      {
        name: "author",
        label: "Author",
        type: "select",
        options: authors,
        required: true,
        validation: {
          custom: (value) => {
            if (!value) return "Please select an author";
            return null;
          },
        },
      },
      {
        name: "category",
        label: "Category",
        type: "select",
        options: categories,
        required: true,
        validation: {
          custom: (value) => {
            if (!value) return "Please select a category";
            return null;
          },
        },
      },
    ],

    // Content & Publishing Section
    [
      {
        name: "content",
        label: "Blog Content",
        type: "richtext",
        placeholder: "Write your blog content here...",
        required: true,
        validation: {
          minLength: 100,
          custom: (value) => {
            if (!value || value.trim() === "")
              return "Blog content is required";
            if (value.length < 100)
              return "Content must be at least 100 characters";
            return null;
          },
        },
      },
      {
        name: "publishDate",
        label: "Publish Date",
        type: "date",
        required: true,
        validation: {
          custom: (value) => {
            if (!value) return "Publish date is required";
            return null;
          },
        },
      },
      {
        name: "status",
        label: "Status",
        type: "select",
        options: statusOptions,
        required: true,
        validation: {
          custom: (value) => {
            if (!value) return "Please select a status";
            return null;
          },
        },
      },
      {
        name: "featured",
        label: "Featured Post",
        type: "switch",
        description: "Show this post in featured sections",
      },
    ],

    // SEO & Metadata Section
    [
      {
        name: "metaTitle",
        label: "Meta Title",
        type: "text",
        placeholder: "SEO title for search engines",
        validation: {
          maxLength: 60,
          custom: (value) => {
            if (value && value.length > 60)
              return "Meta title must be 60 characters or less";
            return null;
          },
        },
      },
      {
        name: "metaDescription",
        label: "Meta Description",
        type: "textarea",
        placeholder: "SEO description for search engines",
        validation: {
          maxLength: 160,
          custom: (value) => {
            if (value && value.length > 160)
              return "Meta description must be 160 characters or less";
            return null;
          },
        },
      },
      {
        name: "tags",
        label: "Tags",
        type: "text",
        placeholder: "comma, separated, tags",
        description: "Separate tags with commas",
      },
      {
        name: "featuredImage",
        label: "Featured Image URL",
        type: "text",
        placeholder: "https://example.com/image.jpg",
        validation: {
          pattern: /^https?:\/\/.+/,
          patternMessage:
            "Please enter a valid URL starting with http:// or https://",
          custom: (value) => {
            if (value && !/^https?:\/\/.+/.test(value)) {
              return "Please enter a valid URL";
            }
            return null;
          },
        },
      },
    ],

    // Analytics & Engagement Section
    [
      {
        name: "views",
        label: "Views",
        type: "number",
        placeholder: "0",
        readOnly: true,
        description: "Total number of views (read-only)",
      },
      {
        name: "comments",
        label: "Comments",
        type: "number",
        placeholder: "0",
        readOnly: true,
        description: "Total number of comments (read-only)",
      },
      {
        name: "likes",
        label: "Likes",
        type: "number",
        placeholder: "0",
        readOnly: true,
        description: "Total number of likes (read-only)",
      },
    ],
  ];

  const sections = [
    { title: "Basic Information", icon: "heroicons:document-text" },
    { title: "Content & Publishing", icon: "heroicons:calendar" },
    { title: "SEO & Metadata", icon: "heroicons:magnifying-glass" },
    { title: "Analytics & Engagement", icon: "heroicons:chart-bar" },
  ];

  return (
    <div className="space-y-4">
      {/* Back Button */}
      <div className="space-y-2">
        <Button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-gray-100 to-gray-200 border border-gray-300 rounded-xl text-gray-800 font-semibold hover:from-gray-200 hover:to-gray-300 hover:shadow-md transition-all duration-200 mb-4"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          {t("Back")}
        </Button>
      </div>
      <GenericUpdateForm
        title="Update Blog Post"
        description="Update blog post information"
        initialData={initialData}
        fields={fields}
        sections={sections}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        showIdField={true}
        idFieldLabel="Blog ID"
        isLoading={false}
      />
    </div>
  );
};

export default BlogUpdateForm;
