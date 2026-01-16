"use client";
import React, { useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslate } from "@/config/useTranslation";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import TableData from "./TableData";
import BreadcrumbComponent from "../shared/BreadcrumbComponent";
import Link from "next/link";
import { TableRefType } from "./types";

const CategoryPage = () => {
  const { t } = useTranslate();
  const tableRef = useRef<TableRefType | null>(null); // ✅ fixed typing

  const handleRefresh = () => {
    tableRef.current?.refetch(); // ✅ no more TypeScript error
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 p-6">
      <div className="  mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex sm:flex-row xs:gap-6 xs:flex-col justify-between items-start sm:items-center">
          <div className="space-y-4">
            <div className="relative">
              <h1 className="text-4xl font-bold text-[#25235F] leading-tight">
                {t("Blogs Management")}
              </h1>
              <div className="absolute -bottom-2 left-0 w-24 h-1 bg-gradient-to-r from-[#ED4135] to-[#ED4135]/70 rounded-full"></div>
            </div>
            <div className="mt-6">
              <BreadcrumbComponent
                header={"Blogs Management"}
                body={"Category of Blogs Management"}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex sm:flex-row xs:flex-col gap-4 justify-end items-center">
            <Link href={"/category/add"}>
              <Button
                variant="outline"
                className="group border-2 border-[#ED4135]/20 hover:border-[#ED4135] hover:bg-[#ED4135] hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 px-6 py-3 h-auto"
              >
                <Icon
                  icon="heroicons:plus"
                  className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform duration-300"
                />
                <span className="font-semibold">
                  {t("Add Category of Blogs")}{" "}
                </span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Main Content Card */}
        <Card className="shadow-2xl border-0 px-0 bg-white/80 backdrop-blur-sm overflow-hidden">
          {/* Card Header with Gradient */}
          <CardHeader className="bg-gradient-to-r from-[#25235F] to-[#25235F]/90 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform skew-x-12"></div>
            <CardTitle className="relative z-10 flex items-center gap-3 text-xl font-bold">
              <div className="w-2 h-8 bg-[#ED4135] rounded-full"></div>
              {t("Category of Blogs Details")}
              <div className="ml-auto">
                <div className="w-8 h-8 rounded-full bg-[#ED4135]/20 flex items-center justify-center">
                  <Icon
                    icon="heroicons:user-group"
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
                      {t("Category of Blogs Overview")}
                    </h3>
                    <div className="ml-auto flex items-center gap-2">
                      <Button
                        variant="outline"
                        className="group border-2 border-[#25235F]/20 hover:border-[#25235F] hover:bg-[#25235F] hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 px-6 py-3 h-auto"
                        onClick={handleRefresh}
                      >
                        <Icon
                          icon="heroicons:arrow-path"
                          className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform duration-300"
                        />
                        <span className="font-semibold">
                          {t("Refresh Data")}
                        </span>
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <TableData t={t} ref={tableRef} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CategoryPage;
