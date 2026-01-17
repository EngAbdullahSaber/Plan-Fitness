"use client";
import React, { useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import BreadcrumbComponent from "../shared/BreadcrumbComponent";
import Link from "next/link";

import BlogTable from "./BlogTable";
import { useTranslate } from "@/config/useTranslation";
import { TableRefType } from "./types";
import { useParams } from "next/navigation";

const BlogsPage = () => {
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
              <h1 className="text-4xl font-bold text-[#25235F] dark:text-gray-100 leading-tight">
                {t("Blog Management")}
              </h1>
              <div
                className={`absolute -bottom-2 ${lang == "en" ? "left-0" : "right-0"} flex items-center gap-2 w-24 h-1 bg-gradient-to-r from-[#ED4135] to-[#ED4135]/70 rounded-full`}
              ></div>
            </div>
            <div className="mt-6">
              <BreadcrumbComponent
                header={"Content Management"}
                body={"Blog Posts"}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex sm:flex-row xs:flex-col gap-4 justify-end items-center">
            <Link href={`/${lang}/blogs/add`}>
              <Button
                variant="outline"
                className="group border-2 border-[#ED4135]/20 hover:border-[#ED4135] hover:bg-[#ED4135] hover:text-white 
                          dark:border-[#ED4135]/40 dark:hover:border-[#ED4135] dark:hover:bg-[#ED4135] 
                          transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 
                          px-6 py-3 h-auto"
              >
                <Icon
                  icon="heroicons:plus"
                  className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform duration-300"
                />
                <span className="font-semibold">{t("New Blog Post")}</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Main Content Card */}
        <Card
          className="shadow-2xl border-0 px-0 bg-white/80 dark:bg-gray-800/80 
                        backdrop-blur-sm overflow-hidden transition-colors duration-300"
        >
          {/* Card Header with Gradient */}
          <CardHeader
            className="bg-gradient-to-r from-[#25235F] to-[#25235F]/90 
                                 dark:from-gray-900 dark:to-gray-800 
                                 text-white relative overflow-hidden transition-colors duration-300"
          >
            <div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform skew-x-12
                            dark:via-white/10"
            ></div>
            <CardTitle className="relative z-10 flex items-center gap-3 text-xl font-bold">
              <div className="w-2 h-8 bg-[#ED4135] rounded-full"></div>
              {t("Blog Posts")}
              <div className="ml-auto">
                <div
                  className="w-8 h-8 rounded-full bg-[#ED4135]/20 dark:bg-[#ED4135]/30 
                                flex items-center justify-center transition-colors duration-300"
                >
                  <Icon
                    icon="heroicons:newspaper"
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
              <div
                className="absolute top-0 right-0 w-32 h-32 bg-[#25235F]/5 
                              dark:bg-[#25235F]/10 rounded-full -translate-y-16 translate-x-16
                              transition-colors duration-300"
              ></div>
              <div
                className="absolute bottom-0 left-0 w-24 h-24 bg-[#ED4135]/5 
                              dark:bg-[#ED4135]/10 rounded-full translate-y-12 -translate-x-12
                              transition-colors duration-300"
              ></div>

              {/* Table Container */}
              <div
                className="relative z-10 bg-white dark:bg-gray-800 
                              rounded-xl border border-gray-100 dark:border-gray-700 
                              shadow-lg dark:shadow-gray-900/30 overflow-hidden transition-colors duration-300"
              >
                <div
                  className="bg-gradient-to-r from-gray-50 to-white 
                                dark:from-gray-800 dark:to-gray-900 
                                p-4 border-b border-gray-200 dark:border-gray-700 transition-colors duration-300"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex gap-1 items-center">
                      <div className="w-1 h-6 bg-[#25235F] dark:bg-blue-500 rounded-full transition-colors duration-300"></div>
                      <h3 className="text-lg font-semibold text-[#25235F] dark:text-gray-200 transition-colors duration-300">
                        {t("Blog Management")}
                      </h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        className="group border-2 border-[#25235F]/20 hover:border-[#25235F] hover:bg-[#25235F] hover:text-white
                                  dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-700 dark:text-gray-300
                                  transition-all duration-300 shadow-lg hover:shadow-xl dark:hover:shadow-gray-800/50 
                                  transform hover:-translate-y-1 px-6 py-3 h-auto"
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

                <div className="p-6 bg-white dark:bg-gray-800 transition-colors duration-300">
                  <BlogTable t={t} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BlogsPage;
