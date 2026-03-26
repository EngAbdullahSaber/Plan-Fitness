"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslate } from "@/config/useTranslation";
import { Icon } from "@iconify/react";
import BreadcrumbComponent from "../shared/BreadcrumbComponent";
import { useParams } from "next/navigation";
import TicketsTable from "./TableData";

const SupportManagementPage = () => {
  const { t } = useTranslate();
  const { lang } = useParams();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex sm:flex-row xs:gap-6 xs:flex-col justify-between items-start sm:items-center">
          <div className="space-y-4">
            <div className="relative">
              <h1 className="text-4xl font-bold text-[#25235F] dark:text-white leading-tight">
                {t("Support Tickets")}
              </h1>
              <div
                className={`absolute -bottom-2 ${lang == "en" ? "left-0" : "right-0"} w-24 h-1 bg-gradient-to-r from-[#ED4135] to-[#ED4135]/70 rounded-full`}
              ></div>
            </div>
            <div className="mt-6">
              <BreadcrumbComponent
                header={t("Support")}
                body={t("All Tickets")}
              />
            </div>
          </div>
        </div>

        {/* Main Content Card */}
        <Card className="shadow-2xl dark:shadow-gray-950/50 border-0 px-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-[#25235F] to-[#25235F]/90 dark:from-gray-800 dark:to-gray-900 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform skew-x-12"></div>
            <CardTitle className="relative z-10 flex items-center gap-3 text-xl font-bold">
              <div className="w-2 h-8 bg-[#ED4135] rounded-full"></div>
              {t("Tickets List")}
              <div className="ml-auto">
                <div className="w-8 h-8 rounded-full bg-[#ED4135]/20 dark:bg-red-900/30 flex items-center justify-center">
                  <Icon
                    icon="heroicons:lifebuoy"
                    className="h-5 w-5 text-[#ED4135]"
                  />
                </div>
              </div>
            </CardTitle>
          </CardHeader>

          <CardContent className="p-8 px-0">
            <div className="relative min-h-[400px]">
              <div className="relative z-10 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-lg overflow-hidden">
                <div className="p-6">
                  <TicketsTable t={t} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SupportManagementPage;
