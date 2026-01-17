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
import { useParams } from "next/navigation";

const CategoryPage = () => {
  const { t } = useTranslate();
  const tableRef = useRef<TableRefType | null>(null); // ✅ fixed typing
  const { lang } = useParams();

  const handleRefresh = () => {
    tableRef.current?.refetch(); // ✅ no more TypeScript error
  };

  return (
    <div className="min-h-screen  p-6">
      <div className="mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex sm:flex-row xs:gap-6 xs:flex-col justify-between items-start sm:items-center">
          <div className="space-y-4">
            <div className="relative">
              <h1 className="text-4xl font-bold text-[#25235F] dark:text-white leading-tight">
                {t("Category Management")}
              </h1>
              <div
                className={`absolute -bottom-2 ${lang == "en" ? "left-0" : "right-0"} w-24 h-1 bg-gradient-to-r from-[#ED4135] to-[#ED4135]/70 dark:from-[#ED4135] dark:to-[#ED4135]/90 rounded-full`}
              ></div>
            </div>
            <div className="mt-6">
              <BreadcrumbComponent
                header={"Category Management"}
                body={"Category Management"}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex sm:flex-row xs:flex-col gap-4 justify-end items-center">
            <Link href={`/${lang}/category/add`}>
              <Button
                variant="outline"
                className="group border-2 border-[#ED4135]/20 dark:border-[#ED4135]/40 hover:border-[#ED4135] dark:hover:border-[#ED4135] hover:bg-[#ED4135] dark:hover:bg-[#ED4135] hover:text-white dark:hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl dark:hover:shadow-[#ED4135]/20 transform hover:-translate-y-1 px-6 py-3 h-auto"
              >
                <Icon
                  icon="heroicons:plus"
                  className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform duration-300"
                />
                <span className="font-semibold">{t("Add Category")} </span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Main Content Card */}
        <Card className="shadow-2xl border-0 px-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm overflow-hidden">
          {/* Card Header with Gradient */}
          <CardHeader className="bg-gradient-to-r from-[#25235F] to-[#25235F]/90 dark:from-gray-800 dark:to-gray-900 text-white dark:text-gray-100 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent dark:via-gray-700/10 transform skew-x-12"></div>
            <CardTitle className="relative z-10 flex items-center gap-3 text-xl font-bold">
              <div className="w-2 h-8 bg-[#ED4135] dark:bg-[#ED4135] rounded-full"></div>
              {t("Category Details")}
              <div className="ml-auto">
                <div className="w-8 h-8 rounded-full bg-[#ED4135]/20 dark:bg-[#ED4135]/30 flex items-center justify-center">
                  <Icon
                    icon="heroicons:user-group"
                    className="h-5 w-5 text-[#ED4135] dark:text-[#ED4135]"
                  />
                </div>
              </div>
            </CardTitle>
          </CardHeader>

          {/* Card Content */}
          <CardContent className="p-8 px-0 dark:bg-gray-800">
            <div className="relative">
              {/* Decorative Background Elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#25235F]/5 dark:bg-gray-700/30 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#ED4135]/5 dark:bg-[#ED4135]/10 rounded-full translate-y-12 -translate-x-12"></div>

              {/* Table Container */}
              <div className="relative z-10 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-700 shadow-lg dark:shadow-gray-900/50 overflow-hidden">
                <div className="bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 p-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="w-1 h-6 bg-[#25235F] dark:bg-gray-300 rounded-full"></div>
                    <h3 className="text-lg font-semibold text-[#25235F] dark:text-white">
                      {t("Category Overview")}
                    </h3>
                    <div
                      className={`${lang == "en" ? "ml-auto" : "mr-auto"} flex items-center gap-2`}
                    >
                      <Button
                        variant="outline"
                        className="group border-2 border-[#25235F]/20 dark:border-gray-600 hover:border-[#25235F] dark:hover:border-white hover:bg-[#25235F] dark:hover:bg-white hover:text-white dark:hover:text-gray-900 transition-all duration-300 shadow-lg hover:shadow-xl dark:hover:shadow-gray-700 transform hover:-translate-y-1 px-6 py-3 h-auto"
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

                <div className="p-6 dark:bg-gray-900">
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
