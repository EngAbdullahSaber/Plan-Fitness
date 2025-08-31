"use client";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslate } from "@/config/useTranslation";
import { Icon } from "@iconify/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

const AddNewBlog = ({ onClose }: { onClose?: () => void }) => {
  const { t, loading, error } = useTranslate();
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    category: "",
    tags: "",
    status: "draft",
    author: "",
    publishDate: new Date().toISOString().split("T")[0],
    featuredImage: "",
    metaTitle: "",
    metaDescription: "",
    allowComments: true,
    featuredPost: false,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Blog form submitted:", formData);
    // Here you would typically send the data to your API
    if (onClose) onClose();
  };

  // Sample data for dropdowns
  const categories = [
    "Fitness",
    "Nutrition",
    "Lifestyle",
    "Training",
    "Wellness",
    "Recipes",
  ];

  const authors = [
    "Sarah Johnson",
    "Mike Thompson",
    "Emma Wilson",
    "David Lee",
    "Lisa Rodriguez",
  ];

  const statusOptions = [
    { value: "draft", label: "Draft" },
    { value: "published", label: "Published" },
    { value: "archived", label: "Archived" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-[#25235F]">
              Add New Blog Post
            </h1>
            <p className="text-gray-600">
              Create a new blog post for your fitness website
            </p>
          </div>
          {onClose && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-10 w-10 rounded-full hover:bg-gray-200"
            >
              <Icon icon="heroicons:x-mark" className="h-5 w-5" />
            </Button>
          )}
        </div>

        {/* Main Form Card */}
        <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm overflow-hidden">
          {/* Card Header with Gradient */}
          <CardHeader className="bg-gradient-to-r from-[#25235F] to-[#25235F]/90 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform skew-x-12"></div>
            <CardTitle className="relative z-10 flex items-center gap-3 text-xl font-bold">
              <div className="w-2 h-8 bg-[#ED4135] rounded-full"></div>
              Blog Post Information
              <div className="ml-auto">
                <div className="w-8 h-8 rounded-full bg-[#ED4135]/20 flex items-center justify-center">
                  <Icon
                    icon="heroicons:document-plus"
                    className="h-5 w-5 text-[#ED4135]"
                  />
                </div>
              </div>
            </CardTitle>
          </CardHeader>

          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Information Section */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-[#25235F] border-b pb-2">
                  <Icon
                    icon="heroicons:document-text"
                    className="h-5 w-5 inline mr-2"
                  />
                  Basic Information
                </h3>

                <div className="space-y-2">
                  <Label htmlFor="title" className="text-[#25235F] font-medium">
                    Blog Title *
                  </Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter blog title"
                    className="border-gray-300 focus:border-[#25235F] focus:ring-[#25235F]"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="slug"
                      className="text-[#25235F] font-medium"
                    >
                      URL Slug *
                    </Label>
                    <Input
                      id="slug"
                      name="slug"
                      value={formData.slug}
                      onChange={handleInputChange}
                      required
                      placeholder="blog-post-url-slug"
                      className="border-gray-300 focus:border-[#25235F] focus:ring-[#25235F]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="category"
                      className="text-[#25235F] font-medium"
                    >
                      Category *
                    </Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) =>
                        handleSelectChange("category", value)
                      }
                    >
                      <SelectTrigger className="border-gray-300 focus:border-[#25235F] focus:ring-[#25235F]">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem
                            key={category}
                            value={category.toLowerCase()}
                          >
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="excerpt"
                    className="text-[#25235F] font-medium"
                  >
                    Excerpt
                  </Label>
                  <Textarea
                    id="excerpt"
                    name="excerpt"
                    value={formData.excerpt}
                    onChange={handleInputChange}
                    placeholder="Brief description of the blog post"
                    className="border-gray-300 focus:border-[#25235F] focus:ring-[#25235F] min-h-[80px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="content"
                    className="text-[#25235F] font-medium"
                  >
                    Content *
                  </Label>
                  <Textarea
                    id="content"
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    required
                    placeholder="Write your blog content here..."
                    className="border-gray-300 focus:border-[#25235F] focus:ring-[#25235F] min-h-[200px]"
                  />
                </div>
              </div>

              {/* Metadata Section */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-[#25235F] border-b pb-2">
                  <Icon
                    icon="heroicons:information-circle"
                    className="h-5 w-5 inline mr-2"
                  />
                  Metadata & Settings
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="author"
                      className="text-[#25235F] font-medium"
                    >
                      Author *
                    </Label>
                    <Select
                      value={formData.author}
                      onValueChange={(value) =>
                        handleSelectChange("author", value)
                      }
                    >
                      <SelectTrigger className="border-gray-300 focus:border-[#25235F] focus:ring-[#25235F]">
                        <SelectValue placeholder="Select author" />
                      </SelectTrigger>
                      <SelectContent>
                        {authors.map((author) => (
                          <SelectItem key={author} value={author}>
                            {author}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="status"
                      className="text-[#25235F] font-medium"
                    >
                      Status
                    </Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) =>
                        handleSelectChange("status", value)
                      }
                    >
                      <SelectTrigger className="border-gray-300 focus:border-[#25235F] focus:ring-[#25235F]">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map((status) => (
                          <SelectItem key={status.value} value={status.value}>
                            {status.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="publishDate"
                      className="text-[#25235F] font-medium"
                    >
                      Publish Date
                    </Label>
                    <Input
                      id="publishDate"
                      name="publishDate"
                      type="date"
                      value={formData.publishDate}
                      onChange={handleInputChange}
                      className="border-gray-300 focus:border-[#25235F] focus:ring-[#25235F]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="tags"
                      className="text-[#25235F] font-medium"
                    >
                      Tags
                    </Label>
                    <Input
                      id="tags"
                      name="tags"
                      value={formData.tags}
                      onChange={handleInputChange}
                      placeholder="fitness, nutrition, health (comma separated)"
                      className="border-gray-300 focus:border-[#25235F] focus:ring-[#25235F]"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="featuredImage"
                    className="text-[#25235F] font-medium"
                  >
                    Featured Image URL
                  </Label>
                  <Input
                    id="featuredImage"
                    name="featuredImage"
                    value={formData.featuredImage}
                    onChange={handleInputChange}
                    placeholder="https://example.com/image.jpg"
                    className="border-gray-300 focus:border-[#25235F] focus:ring-[#25235F]"
                  />
                </div>
              </div>

              {/* SEO Section */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-[#25235F] border-b pb-2">
                  <Icon
                    icon="heroicons:globe-alt"
                    className="h-5 w-5 inline mr-2"
                  />
                  SEO Settings
                </h3>

                <div className="space-y-2">
                  <Label
                    htmlFor="metaTitle"
                    className="text-[#25235F] font-medium"
                  >
                    Meta Title
                  </Label>
                  <Input
                    id="metaTitle"
                    name="metaTitle"
                    value={formData.metaTitle}
                    onChange={handleInputChange}
                    placeholder="Meta title for SEO"
                    className="border-gray-300 focus:border-[#25235F] focus:ring-[#25235F]"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="metaDescription"
                    className="text-[#25235F] font-medium"
                  >
                    Meta Description
                  </Label>
                  <Textarea
                    id="metaDescription"
                    name="metaDescription"
                    value={formData.metaDescription}
                    onChange={handleInputChange}
                    placeholder="Meta description for SEO"
                    className="border-gray-300 focus:border-[#25235F] focus:ring-[#25235F] min-h-[80px]"
                  />
                </div>
              </div>

              {/* Additional Settings Section */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-[#25235F] border-b pb-2">
                  <Icon icon="heroicons:cog" className="h-5 w-5 inline mr-2" />
                  Additional Settings
                </h3>

                <div className="flex items-center justify-between space-x-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="allowComments"
                      checked={formData.allowComments}
                      onCheckedChange={(checked) =>
                        handleSwitchChange("allowComments", checked)
                      }
                    />
                    <Label htmlFor="allowComments" className="cursor-pointer">
                      Allow Comments
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="featuredPost"
                      checked={formData.featuredPost}
                      onCheckedChange={(checked) =>
                        handleSwitchChange("featuredPost", checked)
                      }
                    />
                    <Label htmlFor="featuredPost" className="cursor-pointer">
                      Feature this post
                    </Label>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-4 pt-8 border-t border-gray-200">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="border-gray-300 text-gray-700 hover:bg-gray-100 px-6 py-3"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-[#ED4135] to-[#ED4135]/90 hover:from-[#ED4135]/90 hover:to-[#ED4135] text-white px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Icon
                    icon="heroicons:document-plus"
                    className="h-5 w-5 mr-2"
                  />
                  Create Blog Post
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AddNewBlog;
