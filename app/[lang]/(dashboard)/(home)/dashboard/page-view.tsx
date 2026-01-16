"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslate } from "@/config/useTranslation";
import { useEffect, useState } from "react";
import { GetMethod } from "@/app/services/apis/ApiMethod";
import { toast } from "react-hot-toast";
import { Icon } from "@iconify/react";
import { Skeleton } from "@/components/ui/skeleton";

interface StatisticsData {
  counts: {
    totalClients: number;
    totalCoaches: number;
    totalMeals: number;
    totalTrainings: number;
    activeClients: number;
    activeCoaches: number;
  };
  clientsPerMonth: {
    [key: string]: number;
  };
}

interface DashboardPageViewProps {}

const DashboardPageView = () => {
  const { t, lang } = useTranslate();
  const [statistics, setStatistics] = useState<StatisticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch statistics data
  const fetchStatistics = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await GetMethod("/dashboard/statics", lang);
      if (response.data) {
        setStatistics(response.data);
      } else {
        setError("No data received from server");
      }
    } catch (error: any) {
      console.error("Error fetching statistics:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to load statistics";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatistics();
  }, [lang]);

  // Format number with commas
  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  // Calculate percentage of active clients
  const calculateActiveClientPercentage = () => {
    if (!statistics || statistics.counts.totalClients === 0) return 0;
    return Math.round(
      (statistics.counts.activeClients / statistics.counts.totalClients) * 100,
    );
  };

  // Calculate percentage of active coaches
  const calculateActiveCoachPercentage = () => {
    if (!statistics || statistics.counts.totalCoaches === 0) return 0;
    return Math.round(
      (statistics.counts.activeCoaches / statistics.counts.totalCoaches) * 100,
    );
  };

  // Get month name with proper translation
  const getMonthName = (monthKey: string) => {
    const monthTranslations: Record<string, string> = {
      January: t("January") || "January",
      February: t("February") || "February",
      March: t("March") || "March",
      April: t("April") || "April",
      May: t("May") || "May",
      June: t("June") || "June",
      July: t("July") || "July",
      August: t("August") || "August",
      September: t("September") || "September",
      October: t("October") || "October",
      November: t("November") || "November",
      December: t("December") || "December",
    };
    return monthTranslations[monthKey] || monthKey;
  };

  // Prepare data for clients per month chart
  const prepareClientsPerMonthData = () => {
    if (!statistics) return [];

    const monthOrder = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    return Object.entries(statistics.clientsPerMonth)
      .sort(([a], [b]) => monthOrder.indexOf(a) - monthOrder.indexOf(b))
      .map(([month, count]) => ({
        month: getMonthName(month),
        count,
      }));
  };

  // Statistics card component
  const StatCard = ({
    title,
    value,
    icon,
    color,
    trend,
    percentage,
  }: {
    title: string;
    value: number;
    icon: string;
    color: string;
    trend?: "up" | "down" | "neutral";
    percentage?: number;
  }) => (
    <Card className="relative overflow-hidden bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/60 dark:border-gray-700/60 rounded-2xl hover:shadow-lg transition-shadow duration-300">
      <div
        className="absolute top-0 left-0 right-0 h-1"
        style={{ background: color }}
      ></div>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              {title}
            </p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatNumber(value)}
              </h3>
              {percentage !== undefined && (
                <span
                  className={`text-sm font-semibold ${trend === "up" ? "text-green-600" : trend === "down" ? "text-red-600" : "text-gray-600"}`}
                >
                  {trend === "up" ? "↑" : trend === "down" ? "↓" : "→"}{" "}
                  {percentage}%
                </span>
              )}
            </div>
          </div>
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ background: `${color}15` }}
          >
            <Icon icon={icon} className="w-6 h-6" style={{ color }} />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  // Skeleton loader for statistics cards
  const StatCardSkeleton = () => (
    <Card className="relative overflow-hidden bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/60 dark:border-gray-700/60 rounded-2xl">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-16" />
          </div>
          <Skeleton className="w-12 h-12 rounded-xl" />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen p-6">
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
                {t("Track your fitness center's performance metrics")}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchStatistics}
              disabled={loading}
              className="px-4 py-2 bg-gradient-to-r from-red-500 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              style={{
                background: "linear-gradient(90deg, #ED4135, #25235F)",
              }}
            >
              <Icon
                icon={loading ? "mdi:loading" : "mdi:refresh"}
                className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
              />
              {t("Refresh Data")}
            </button>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <Card className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
            <CardContent className="p-6 flex items-center gap-4">
              <Icon
                icon="mdi:alert-circle"
                className="w-6 h-6 text-red-600 dark:text-red-400"
              />
              <div>
                <p className="font-medium text-red-800 dark:text-red-300">
                  {t("Error Loading Data")}
                </p>
                <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                  {error}
                </p>
              </div>
              <button
                onClick={fetchStatistics}
                className="ml-auto px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
              >
                {t("Retry")}
              </button>
            </CardContent>
          </Card>
        )}

        {/* Main Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Total Clients */}
          {loading ? (
            <StatCardSkeleton />
          ) : (
            <StatCard
              title={t("Total Clients")}
              value={statistics?.counts.totalClients || 0}
              icon="mdi:account-group"
              color="#ED4135"
              trend={statistics?.counts.totalClients > 0 ? "up" : "neutral"}
            />
          )}

          {/* Total Coaches */}
          {loading ? (
            <StatCardSkeleton />
          ) : (
            <StatCard
              title={t("Total Coaches")}
              value={statistics?.counts.totalCoaches || 0}
              icon="mdi:account-tie"
              color="#25235F"
              trend={statistics?.counts.totalCoaches > 0 ? "up" : "neutral"}
            />
          )}

          {/* Active Clients */}
          {loading ? (
            <StatCardSkeleton />
          ) : (
            <StatCard
              title={t("Active Clients")}
              value={statistics?.counts.activeClients || 0}
              icon="mdi:account-check"
              color="#10B981"
              trend="up"
              percentage={calculateActiveClientPercentage()}
            />
          )}

          {/* Active Coaches */}
          {loading ? (
            <StatCardSkeleton />
          ) : (
            <StatCard
              title={t("Active Coaches")}
              value={statistics?.counts.totalCoaches || 0}
              icon="mdi:account-tie-check"
              color="#3B82F6"
              trend="up"
            />
          )}

          {/* Total Trainings */}
          {loading ? (
            <StatCardSkeleton />
          ) : (
            <StatCard
              title={t("Total Trainings")}
              value={statistics?.counts.totalTrainings || 0}
              icon="mdi:dumbbell"
              color="#8B5CF6"
              trend={statistics?.counts.totalTrainings > 0 ? "up" : "neutral"}
            />
          )}

          {/* Total Meals */}
          {loading ? (
            <StatCardSkeleton />
          ) : (
            <StatCard
              title={t("Total Meals")}
              value={statistics?.counts.totalMeals || 0}
              icon="mdi:food-apple"
              color="#F59E0B"
              trend={statistics?.counts.totalMeals > 0 ? "up" : "neutral"}
            />
          )}
        </div>

        {/* Clients Per Month Chart Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Clients Per Month Chart */}
          <Card className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-gray-200/60 dark:border-gray-700/60 shadow-xl rounded-3xl overflow-hidden">
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
                {t("Clients Per Month")}
              </CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {t("Monthly client registration trend")}
              </p>
            </CardHeader>
            <CardContent className="p-8 pt-0">
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="flex items-center justify-between">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-8 w-16" />
                    </div>
                  ))}
                </div>
              ) : statistics &&
                Object.keys(statistics.clientsPerMonth).length > 0 ? (
                <div className="space-y-4">
                  {prepareClientsPerMonthData().map(({ month, count }) => {
                    const maxClients = Math.max(
                      ...Object.values(statistics.clientsPerMonth),
                    );
                    const percentage =
                      maxClients > 0 ? (count / maxClients) * 100 : 0;

                    return (
                      <div
                        key={month}
                        className="flex items-center justify-between group hover:bg-gray-50 dark:hover:bg-gray-800/50 p-3 rounded-lg transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-red-500/10 to-purple-600/10 flex items-center justify-center">
                            <Icon
                              icon="mdi:calendar-month"
                              className="w-4 h-4 text-gray-600 dark:text-gray-400"
                            />
                          </div>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {month}
                          </span>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-red-500 to-purple-600 rounded-full transition-all duration-300"
                              style={{
                                width: `${percentage}%`,
                                background:
                                  "linear-gradient(90deg, #ED4135, #25235F)",
                              }}
                            ></div>
                          </div>
                          <span className="font-bold text-gray-900 dark:text-white min-w-[2rem] text-right">
                            {count}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Icon
                    icon="mdi:chart-line"
                    className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-4"
                  />
                  <p className="text-gray-600 dark:text-gray-400">
                    {t("No monthly data available")}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Summary Statistics */}
          <Card className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-gray-200/60 dark:border-gray-700/60 shadow-xl rounded-3xl overflow-hidden">
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
                {t("Platform Summary")}
              </CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {t("Overall platform statistics and insights")}
              </p>
            </CardHeader>
            <CardContent className="p-8 pt-0">
              {loading ? (
                <div className="space-y-6">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-6 w-24" />
                    </div>
                  ))}
                </div>
              ) : statistics ? (
                <div className="space-y-6">
                  {/* Client Activity Ratio */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        {t("Client Activity Ratio")}
                      </span>
                      <span className="font-bold text-gray-900 dark:text-white">
                        {calculateActiveClientPercentage()}%
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-green-500 to-emerald-600 rounded-full"
                        style={{
                          width: `${calculateActiveClientPercentage()}%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* Coach Activity Ratio */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        {t("Coach Activity Ratio")}
                      </span>
                      <span className="font-bold text-gray-900 dark:text-white">
                        {calculateActiveCoachPercentage()}%
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
                        style={{
                          width: `${calculateActiveCoachPercentage()}%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* Total Platform Users */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        {t("Total Platform Users")}
                      </span>
                      <span className="font-bold text-gray-900 dark:text-white">
                        {formatNumber(
                          statistics.counts.totalClients +
                            statistics.counts.totalCoaches,
                        )}
                      </span>
                    </div>
                    <div className="flex gap-2 text-xs text-gray-500 dark:text-gray-400">
                      <span>
                        {t("Clients")}:{" "}
                        {formatNumber(statistics.counts.totalClients)}
                      </span>
                      <span>•</span>
                      <span>
                        {t("Coaches")}:{" "}
                        {formatNumber(statistics.counts.totalCoaches)}
                      </span>
                    </div>
                  </div>

                  {/* Content Statistics */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        {t("Total Content")}
                      </span>
                      <span className="font-bold text-gray-900 dark:text-white">
                        {formatNumber(
                          statistics.counts.totalTrainings +
                            statistics.counts.totalMeals,
                        )}
                      </span>
                    </div>
                    <div className="flex gap-2 text-xs text-gray-500 dark:text-gray-400">
                      <span>
                        {t("Trainings")}:{" "}
                        {formatNumber(statistics.counts.totalTrainings)}
                      </span>
                      <span>•</span>
                      <span>
                        {t("Meals")}:{" "}
                        {formatNumber(statistics.counts.totalMeals)}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Icon
                    icon="mdi:chart-bar"
                    className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-4"
                  />
                  <p className="text-gray-600 dark:text-gray-400">
                    {t("No summary data available")}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardPageView;
