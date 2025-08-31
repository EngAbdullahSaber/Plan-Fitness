import React, { useState } from "react";
import {
  TrendingUp,
  Users,
  UserPlus,
  UserCheck,
  UserMinus,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Brand colors
const brandColors = {
  red: "#EF4444",
  purple: "#8B5CF6",
  green: "#10B981",
  blue: "#3B82F6",
};

// Sample data for charts
const chartData = [
  { name: "Jan", value: 400 },
  { name: "Feb", value: 300 },
  { name: "Mar", value: 600 },
  { name: "Apr", value: 800 },
  { name: "May", value: 500 },
  { name: "Jun", value: 900 },
];

// Tab configuration
const tabsTrigger = [
  {
    value: "new-members",
    icon: UserPlus,
    text: "New Members",
    total: "2,847",
    change: "+12%",
    color: "blue",
    bgColor:
      "bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/20",
    iconBg:
      "bg-gradient-to-br from-blue-500 to-blue-600 shadow-blue-200 dark:shadow-blue-900/50",
    textColor: "text-white",
  },
  {
    value: "active-members",
    icon: Users,
    text: "Active Members",
    total: "12,459",
    change: "+8%",
    color: "green",
    bgColor:
      "bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/30 dark:to-green-900/20",
    iconBg:
      "bg-gradient-to-br from-green-500 to-green-600 shadow-green-200 dark:shadow-green-900/50",
    textColor: "text-white",
  },
  {
    value: "verified-members",
    icon: UserCheck,
    text: "Verified Members",
    total: "8,624",
    change: "+15%",
    color: "purple",
    bgColor:
      "bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/30 dark:to-purple-900/20",
    iconBg:
      "bg-gradient-to-br from-purple-500 to-purple-600 shadow-purple-200 dark:shadow-purple-900/50",
    textColor: "text-white",
  },
  {
    value: "inactive-members",
    icon: UserMinus,
    text: "Inactive Members",
    total: "1,234",
    change: "-5%",
    color: "red",
    bgColor:
      "bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950/30 dark:to-red-900/20",
    iconBg:
      "bg-gradient-to-br from-red-500 to-red-600 shadow-red-200 dark:shadow-red-900/50",
    textColor: "text-white",
  },
];

const tabsContentData = [
  { value: "new-members", color: brandColors.blue },
  { value: "active-members", color: brandColors.green },
  { value: "verified-members", color: brandColors.purple },
  { value: "inactive-members", color: brandColors.red },
];

const ReportsChart = ({ chartColor }) => (
  <div className="h-80 w-full">
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.3} />
        <XAxis
          dataKey="name"
          stroke="#6b7280"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#6b7280"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "white",
            border: "none",
            borderRadius: "12px",
            boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
          }}
        />
        <Line
          type="monotone"
          dataKey="value"
          stroke={chartColor}
          strokeWidth={3}
          dot={{ fill: chartColor, strokeWidth: 2, r: 6 }}
          activeDot={{ r: 8, stroke: chartColor, strokeWidth: 2 }}
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

export default function EnhancedMembershipTabs() {
  const [activeTab, setActiveTab] = useState("new-members");

  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Membership Analytics
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Track and analyze your membership growth and engagement
        </p>
      </div>

      {/* Tabs Navigation */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {tabsTrigger.map((item, index) => {
          const IconComponent = item.icon;
          const isActive = activeTab === item.value;

          return (
            <button
              key={`membership-trigger-${index}`}
              onClick={() => setActiveTab(item.value)}
              className={`
                relative group flex flex-col gap-4 p-6 text-left
                border-2 rounded-2xl transition-all duration-300
                hover:scale-[1.02] hover:shadow-xl
                ${
                  isActive
                    ? "border-opacity-100 shadow-xl scale-[1.02] ring-4 ring-opacity-20"
                    : "border-transparent hover:border-opacity-30"
                }
                ${item.bgColor}
              `}
              style={{
                borderColor: isActive ? brandColors[item.color] : "transparent",
                ringColor: isActive
                  ? `${brandColors[item.color]}20`
                  : "transparent",
              }}
            >
              {/* Floating Badge */}
              <div
                className={`
                  absolute -top-3 -right-3 w-10 h-10 rounded-full 
                  flex items-center justify-center shadow-lg
                  transition-all duration-300 group-hover:scale-110
                  ${isActive ? "scale-110" : ""}
                  ${item.iconBg}
                `}
              >
                <IconComponent className="w-5 h-5 text-white" />
              </div>

              {/* Main Content */}
              <div className="relative z-10 w-full">
                {/* Large Icon */}
                <div
                  className={`
                    w-14 h-14 rounded-xl flex items-center justify-center mb-4
                    transition-all duration-300 group-hover:scale-105
                    ${item.iconBg}
                  `}
                >
                  <IconComponent className="w-7 h-7 text-white" />
                </div>

                {/* Text Content */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 leading-tight">
                    {item.text}
                  </h3>

                  <div className="flex items-end justify-between">
                    <span
                      className="text-2xl font-bold"
                      style={{ color: brandColors[item.color] }}
                    >
                      {item.total}
                    </span>

                    <div
                      className={`
                      flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium
                      ${
                        item.change.startsWith("+")
                          ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400"
                          : "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400"
                      }
                    `}
                    >
                      <TrendingUp className="w-3 h-3" />
                      {item.change}
                    </div>
                  </div>
                </div>
              </div>

              {/* Active Indicator */}
              <div
                className={`
                  absolute bottom-0 left-0 right-0 h-1 rounded-b-2xl
                  transition-all duration-300
                  ${isActive ? "opacity-100" : "opacity-0"}
                `}
                style={{
                  background: `linear-gradient(90deg, ${
                    brandColors[item.color]
                  }, ${brandColors[item.color]}80)`,
                }}
              />

              {/* Glow Effect */}
              <div
                className={`
                  absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300
                  ${isActive ? "opacity-20" : "group-hover:opacity-10"}
                `}
                style={{
                  background: `radial-gradient(circle at center, ${
                    brandColors[item.color]
                  }40, transparent 70%)`,
                }}
              />
            </button>
          );
        })}
      </div>

      {/* Chart Section */}
      <div className="relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50/80 via-white/60 to-gray-100/40 dark:from-gray-800/30 dark:via-gray-900/20 dark:to-gray-800/10 rounded-3xl" />

        {/* Chart Container */}
        <div className="relative z-10 p-8 bg-white/80 dark:bg-gray-900/80 rounded-3xl border border-gray-200/60 dark:border-gray-700/40 backdrop-blur-md shadow-xl">
          {/* Chart Header */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {tabsTrigger.find((tab) => tab.value === activeTab)?.text}{" "}
              Overview
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Monthly trends and performance metrics
            </p>
          </div>

          {/* Chart */}
          <ReportsChart
            chartColor={
              tabsContentData.find((tab) => tab.value === activeTab)?.color ||
              brandColors.blue
            }
          />
        </div>

        {/* Decorative Elements */}
        <div
          className="absolute -top-4 -right-4 w-8 h-8 rounded-full opacity-60 blur-sm"
          style={{
            backgroundColor: tabsContentData.find(
              (tab) => tab.value === activeTab
            )?.color,
          }}
        />
        <div
          className="absolute -bottom-4 -left-4 w-6 h-6 rounded-full opacity-40 blur-sm"
          style={{
            backgroundColor: tabsContentData.find(
              (tab) => tab.value === activeTab
            )?.color,
          }}
        />
      </div>
    </div>
  );
}
