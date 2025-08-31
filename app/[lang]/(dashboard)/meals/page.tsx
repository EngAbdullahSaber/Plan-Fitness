"use client";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import BreadcrumbComponent from "../shared/BreadcrumbComponent";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import MealTable from "./MealTable";

const MealsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex sm:flex-row xs:gap-6 xs:flex-col justify-between items-start sm:items-center">
          <div className="space-y-4">
            <div className="relative">
              <h1 className="text-4xl font-bold text-[#25235F] leading-tight">
                Meal Management
              </h1>
              <div className="absolute -bottom-2 left-0 w-24 h-1 bg-gradient-to-r from-[#ED4135] to-[#ED4135]/70 rounded-full"></div>
            </div>
            <div className="mt-6">
              <BreadcrumbComponent
                header={"Nutrition Management"}
                body={"Meal Plans"}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex sm:flex-row xs:flex-col gap-4 justify-end items-center">
            <Button
              variant="outline"
              className="group border-2 border-[#25235F]/20 hover:border-[#25235F] hover:bg-[#25235F] hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 px-6 py-3 h-auto"
            >
              <Icon
                icon="lets-icons:export"
                className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform duration-300"
              />
              <span className="font-semibold">Export Meals</span>
            </Button>

            <Link href={"/meals/add"}>
              <Button
                variant="outline"
                className="group border-2 border-[#ED4135]/20 hover:border-[#ED4135] hover:bg-[#ED4135] hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 px-6 py-3 h-auto"
              >
                <Icon
                  icon="heroicons:plus"
                  className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform duration-300"
                />
                <span className="font-semibold">Add New Meal</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Filters Section */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm overflow-hidden">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label className="text-[#25235F] font-medium">Search</Label>
                <Input
                  placeholder="Search meals..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border-gray-300 focus:border-[#25235F]"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[#25235F] font-medium">Status</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="border-gray-300 focus:border-[#25235F]">
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-[#25235F] font-medium">Category</Label>
                <Select
                  value={categoryFilter}
                  onValueChange={setCategoryFilter}
                >
                  <SelectTrigger className="border-gray-300 focus:border-[#25235F]">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="breakfast">Breakfast</SelectItem>
                    <SelectItem value="lunch">Lunch</SelectItem>
                    <SelectItem value="dinner">Dinner</SelectItem>
                    <SelectItem value="snacks">Snacks</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-[#25235F] font-medium">Actions</Label>
                <Button
                  variant="outline"
                  className="w-full border-gray-300 text-gray-700 hover:bg-gray-100"
                  onClick={() => {
                    setSearchTerm("");
                    setStatusFilter("all");
                    setCategoryFilter("all");
                  }}
                >
                  <Icon icon="heroicons:arrow-path" className="h-4 w-4 mr-2" />
                  Reset Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-l-4 border-l-[#25235F]">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#25235F]/10 flex items-center justify-center group-hover:bg-[#25235F]/20 transition-colors duration-300">
                  <Icon
                    icon="heroicons:clipboard-document-list"
                    className="h-6 w-6 text-[#25235F]"
                  />
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#25235F]">48</p>
                  <p className="text-sm text-gray-600">Total Meals</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-l-4 border-l-green-500">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center group-hover:bg-green-200 transition-colors duration-300">
                  <Icon
                    icon="heroicons:fire"
                    className="h-6 w-6 text-green-600"
                  />
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#25235F]">15.2K</p>
                  <p className="text-sm text-gray-600">Total Calories</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-l-4 border-l-blue-500">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors duration-300">
                  <Icon
                    icon="heroicons:muscle"
                    className="h-6 w-6 text-blue-600"
                  />
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#25235F]">1.8K</p>
                  <p className="text-sm text-gray-600">Total Protein (g)</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-l-4 border-l-[#ED4135]">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#ED4135]/10 flex items-center justify-center group-hover:bg-[#ED4135]/20 transition-colors duration-300">
                  <Icon
                    icon="heroicons:clock"
                    className="h-6 w-6 text-[#ED4135]"
                  />
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#25235F]">12</p>
                  <p className="text-sm text-gray-600">Inactive Meals</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Card */}
        <Card className="shadow-2xl border-0 px-0 bg-white/80 backdrop-blur-sm overflow-hidden">
          {/* Card Header with Gradient */}
          <CardHeader className="bg-gradient-to-r from-[#25235F] to-[#25235F]/90 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform skew-x-12"></div>
            <CardTitle className="relative z-10 flex items-center gap-3 text-xl font-bold">
              <div className="w-2 h-8 bg-[#ED4135] rounded-full"></div>
              Meal Plans
              <div className="ml-auto">
                <div className="w-8 h-8 rounded-full bg-[#ED4135]/20 flex items-center justify-center">
                  <Icon
                    icon="heroicons:heart"
                    className="h-5 w-5 text-[#ED4135]"
                  />
                </div>
              </div>
            </CardTitle>
          </CardHeader>

          {/* Card Content */}
          <CardContent className="p-8 px-0">
            <div className="relative">
              {/* Decorative Background Elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#25235F]/5 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#ED4135]/5 rounded-full translate-y-12 -translate-x-12"></div>

              {/* Table Container */}
              <div className="relative z-10 bg-white rounded-xl border border-gray-100 shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-gray-50 to-white p-4 border-b border-gray-200">
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-6 bg-[#25235F] rounded-full"></div>
                    <h3 className="text-lg font-semibold text-[#25235F]">
                      Meal Management
                    </h3>
                    <div className="ml-auto flex items-center gap-2">
                      <div className="w-2 h-2 bg-[#ED4135] rounded-full animate-pulse"></div>
                      <span className="text-sm text-gray-600">Live Data</span>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <MealTable
                    searchTerm={searchTerm}
                    statusFilter={statusFilter}
                    categoryFilter={categoryFilter}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MealsPage;

// Label component
const Label = ({ children, className, ...props }: any) => {
  return (
    <label className={`text-sm font-medium ${className}`} {...props}>
      {children}
    </label>
  );
};
