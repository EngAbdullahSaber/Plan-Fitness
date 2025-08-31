"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ReportsSnapshot from "./components/reports-snapshot";
import CountryMap from "./components/country-map";
import UserDeviceReport from "./components/user-device-report";
import UserStats from "./components/user-stats-chart";
import UsersStat from "./components/users-stat";
import ReportsArea from "./components/reports-area";
import DashboardSelect from "@/components/dasboard-select";
import TopTen from "./components/top-ten";
import TopPage from "./components/top-page";
import DatePickerWithRange from "@/components/date-picker-with-range";
import { useTranslate } from "@/config/useTranslation";

interface DashboardPageViewProps {}

const DashboardPageView = () => {
  const { t } = useTranslate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-red-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-purple-950/20 p-6">
      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-20 right-20 w-96 h-96 rounded-full opacity-5"
          style={{
            background: "radial-gradient(circle, #ED4135, transparent)",
          }}
        ></div>
        <div
          className="absolute bottom-20 left-20 w-80 h-80 rounded-full opacity-5"
          style={{
            background: "radial-gradient(circle, #25235F, transparent)",
          }}
        ></div>
      </div>

      <div className="relative z-10 space-y-8 max-w-[1600px] mx-auto">
        {/* Enhanced Header Section */}
        <div className="flex items-center flex-wrap justify-between gap-6 p-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl border border-gray-200/60 dark:border-gray-700/60 shadow-xl">
          <div className="flex items-center gap-4">
            <div
              className="w-1 h-12 rounded-full bg-gradient-to-b from-red-500 to-purple-600"
              style={{
                background: "linear-gradient(180deg, #ED4135, #25235F)",
              }}
            ></div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                {t("Gym Analytics Dashboard")}
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Track your fitness center's performance metrics
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2 bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl border border-gray-200 dark:border-gray-600 shadow-sm">
              <DatePickerWithRange />
            </div>
          </div>
        </div>

        {/* Enhanced Reports Section */}
        <div className="grid grid-cols-12 gap-12">
          <div className="col-span-12 lg:col-span-12">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-purple-600/5 rounded-3xl transform group-hover:scale-[1.02] transition-transform duration-300"></div>
              <Card className="relative bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-gray-200/60 dark:border-gray-700/60 shadow-xl rounded-3xl overflow-hidden">
                <div
                  className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-purple-600"
                  style={{
                    background: "linear-gradient(90deg, #ED4135, #25235F)",
                  }}
                ></div>
                <CardHeader className="border-none p-8 pb-4">
                  <CardTitle className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full bg-gradient-to-r from-red-500 to-purple-600"
                      style={{
                        background: "linear-gradient(90deg, #ED4135, #25235F)",
                      }}
                    ></div>
                    {t("Membership Overview")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 pt-0">
                  <ReportsSnapshot />
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-12">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 to-red-500/5 rounded-3xl transform group-hover:scale-[1.02] transition-transform duration-300"></div>
              <Card className="relative bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-gray-200/60 dark:border-gray-700/60 shadow-xl rounded-3xl overflow-hidden h-full">
                <div
                  className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 to-red-500"
                  style={{
                    background: "linear-gradient(90deg, #25235F, #ED4135)",
                  }}
                ></div>
                <CardHeader className="border-none p-8 pb-4">
                  <CardTitle className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-600 to-red-500"
                      style={{
                        background: "linear-gradient(90deg, #25235F, #ED4135)",
                      }}
                    ></div>
                    {t("Member Statistics")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 pt-0">
                  <UsersStat />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Enhanced Analytics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Reports Area */}
          <div className="space-y-6">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-purple-600/5 rounded-2xl transform group-hover:scale-[1.02] transition-transform duration-300"></div>
              <div className="relative bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-gray-200/60 dark:border-gray-700/60 shadow-lg rounded-2xl p-6">
                <ReportsArea />
              </div>
            </div>
          </div>

          {/* Member Activity Chart */}
          <Card className="relative bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-gray-200/60 dark:border-gray-700/60 shadow-xl rounded-3xl overflow-hidden group hover:shadow-2xl transition-all duration-300">
            <div
              className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r opacity-80"
              style={{ background: "linear-gradient(90deg, #ED4135, #25235F)" }}
            ></div>
            <CardHeader className="border-none p-8 pb-4 relative">
              <div className="absolute top-6 right-6 w-12 h-12 bg-gradient-to-br from-red-500/10 to-purple-600/10 rounded-full flex items-center justify-center">
                <div
                  className="w-6 h-6 bg-gradient-to-r from-red-500 to-purple-600 rounded-full animate-pulse"
                  style={{
                    background: "linear-gradient(45deg, #ED4135, #25235F)",
                  }}
                ></div>
              </div>
              <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
                {t("Member Activity Trends")}
              </CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                New vs returning members analysis
              </p>
            </CardHeader>
            <CardContent className="p-8 pt-0">
              <UserStats />
            </CardContent>
          </Card>

          {/* Equipment Usage */}
          <Card className="relative bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-gray-200/60 dark:border-gray-700/60 shadow-xl rounded-3xl overflow-hidden group hover:shadow-2xl transition-all duration-300">
            <div
              className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r opacity-80"
              style={{ background: "linear-gradient(90deg, #25235F, #ED4135)" }}
            ></div>
            <CardHeader className="border-none p-8 pb-4 relative">
              <div className="absolute top-6 right-6 w-12 h-12 bg-gradient-to-br from-purple-600/10 to-red-500/10 rounded-full flex items-center justify-center">
                <div
                  className="w-6 h-6 bg-gradient-to-r from-purple-600 to-red-500 rounded-full animate-pulse"
                  style={{
                    background: "linear-gradient(45deg, #25235F, #ED4135)",
                  }}
                ></div>
              </div>
              <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
                {t("Equipment Usage")}
              </CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Device and equipment breakdown
              </p>
            </CardHeader>
            <CardContent className="p-8 pt-0">
              <div className="dashtail-legend">
                <UserDeviceReport />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardPageView;
