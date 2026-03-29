"use client";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../tables/advanced/components/data-table-column-header";
import { DataTable } from "../tables/advanced/components/data-table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import DeleteConfirmationDialog from "../shared/DeleteConfirmationDialog";
import { useState, useMemo, useEffect } from "react";
import GenericFilter from "../shared/GenericFilter";
import React, { forwardRef, useImperativeHandle } from "react";
import toast from "react-hot-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import {
  DeleteMethod,
  GetPanigationMethodWithFilter,
  GetSpecifiedMethod,
  UpdateMethod,
} from "@/app/services/apis/ApiMethod";
import { Switch } from "@/components/ui/switch";
import Link from "next/link";
import CoachTraineeUpdateDialog from "../shared/CoachTraineeUpdateDialog";
import MemberDetailsModal from "./MemberDetailsModal";

interface CoachMembersTableProps {
  t: any;
}

// Define proper types for Coach
interface Coach {
  id: number;
  name: string;
  phone: string;
  gender: "male" | "female";
  otp: number;
  otpExpire: string;
  isVerified: boolean;
  createdAt: string;
  level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | null;
  image: string | null;
  height: string | null;
  Weight: string | null;
  goal: string | null;
  age: string | null;
  buttock: string | null;
  numberOFCoachTrainee: string | null;
  clientsCount: string | null;
  tricep: string | null;
  totalSteps: number | null;
  totalTrainingDays: number | null;
  dateOfBirth: string | null;
  sleepTime: string | null;
  injuryDescription: string | null;
  thigh: string | null;
  waist: string | null;
  lastUpdateData: string | null;
  role: "ADMIN" | "COACH" | "CLIENT";
  isActive: boolean;
  startDate: string | null;
}

interface CoachApiResponse {
  data: Coach[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  totalItems?: number;
}

const CoachMembersTable = forwardRef(({ t }: CoachMembersTableProps, ref) => {
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [selectedCoach, setSelectedCoach] = useState<Coach | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const { lang } = useParams();
  const queryClient = useQueryClient();

  // Status options based on isVerified
  const statusOptions = [t("Verified"), t("Not_Verified")];

  // Level options based on your API data
  const levelOptions = [t("BEGINNER"), t("INTERMEDIATE"), t("ADVANCED")];

  // Gender options
  const genderOptions = [t("MALE"), t("FEMALE")];

  // React Query for coaches data fetching
  const {
    data: apiResponse,
    isLoading,
    error,
    refetch,
  } = useQuery<CoachApiResponse, Error>({
    queryKey: ["coaches", page, pageSize, searchTerm, lang, filters],
    queryFn: async () => {
      try {
        // Build query parameters based on filters
        const queryParams: any = {
          page: page.toString(),
          pageSize: pageSize.toString(),
        };

        // Add search term to name filter
        if (searchTerm) {
          queryParams.name = searchTerm;
        }

        // Add role filter
        queryParams.role = "COACH";

        // Add gender filter
        if (filters.gender) {
          queryParams.gender = filters.gender;
        }

        // Add level filter
        if (filters.level) {
          queryParams.level = filters.level;
        }

        // Add status filter (based on isVerified)
        if (filters.status) {
          queryParams.isVerified =
            filters.status === t("Verified") ? "true" : "false";
        }

        const response = await GetPanigationMethodWithFilter(
          "user/users",
          page,
          pageSize,
          lang,
          searchTerm,
          queryParams,
        );

        // Handle different response structures with proper type checking
        let finalData;

        if (response && typeof response === "object") {
          const responseObj = response as any;

          if ("data" in responseObj) {
            finalData = responseObj.data;
          } else if (
            "response" in responseObj &&
            responseObj.response &&
            typeof responseObj.response === "object" &&
            "data" in responseObj.response
          ) {
            finalData = responseObj.response.data;
          } else {
            finalData = responseObj;
          }
        } else {
          throw new Error("Invalid API response");
        }

        // Ensure the response has the expected structure
        return {
          data: finalData.data || finalData.items || finalData || [],
          total: finalData.total || finalData.totalCount || 0,
          totalItems: finalData.totalItems || finalData.total || 0,
          page: finalData.page || page,
          pageSize: finalData.pageSize || pageSize,
          totalPages:
            finalData.totalPages ||
            Math.ceil((finalData.total || 0) / pageSize),
        };
      } catch (error: any) {
        console.error("Error fetching coaches:", error);
        throw new Error(error.message || "Failed to fetch coaches");
      }
    },
  });

  // Listen for refresh events from parent component
  useEffect(() => {
    const handleRefresh = () => {
      refetch();
    };

    window.addEventListener("refreshTableData", handleRefresh);

    return () => {
      window.removeEventListener("refreshTableData", handleRefresh);
    };
  }, [refetch]);

  // View coach details
  const handleViewCoach = async (coach: Coach) => {
    try {
      // Show loading state
      setIsModalOpen(true);
      setSelectedCoach({ ...coach, _isLoading: true } as any);

      // Fetch using GetSpecifiedMethod
      const response = await GetSpecifiedMethod(`users/${coach.id}`, lang);

      // Extract coach data with helper function
      const extractCoachData = (responseData: any): Coach | null => {
        if (!responseData) return null;

        // Handle axios response structure
        const data = responseData.data || responseData;

        // Check common response patterns
        if (data?.id) return data; // Direct coach object
        if (data?.data?.id) return data.data; // Nested data
        if (data?.coach?.id) return data.coach; // Nested coach
        if (Array.isArray(data) && data[0]?.id) return data[0]; // Array response
        if (data?.code === 200 && data?.data?.id) return data.data; // Code/data pattern

        return null;
      };

      const fullCoachData = extractCoachData(response);

      if (fullCoachData) {
        setSelectedCoach(fullCoachData);
      } else {
        // Use table data as fallback
        setSelectedCoach(coach);
        console.log("Using table data for coach details");
      }
    } catch (error: any) {
      console.error("Failed to fetch coach details:", error);

      // Use table data as fallback
      setSelectedCoach(coach);

      // User-friendly error message
      const errorMsg =
        error.response?.data?.message ||
        error.message ||
        t("failed_to_load_details") ||
        "Failed to load coach details";

      // Show error toast but keep modal open with basic info
      toast.error(errorMsg, {
        duration: 4000,
        icon: "⚠️",
      });
    }
  };

  // Delete coach function
  const handleDeleteCoach = async (coachId: number, coachName: string) => {
    try {
      const response = await DeleteMethod("user", coachId, lang);

      if (response?.code === 200) {
        toast.success(
          response.message ||
            t("coach_deleted_successfully") ||
            "Coach deleted successfully",
        );

        // Invalidate and refetch coaches to update the table
        queryClient.invalidateQueries({ queryKey: ["coaches"] });
      } else {
        toast.error(
          response?.message ||
            t("failed_to_delete_coach") ||
            "Failed to delete coach",
        );
      }
    } catch (error: any) {
      console.error("Error deleting coach:", error);
      // Handle error response
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.message) {
        toast.error(error.message);
      } else {
        toast.error(t("failed_to_delete_coach") || "Failed to delete coach");
      }
    }
  };

  const handleToggleStatus = async (coachId: number, currentStatus: boolean) => {
    try {
      const response = await UpdateMethod(
        "user/coach",
        { isActive: !currentStatus },
        coachId,
        lang,
      );

      if (response && (response.code === 200 || response.status === 200)) {
        toast.success(t("status_updated_successfully") || "Status updated successfully");
        queryClient.invalidateQueries({ queryKey: ["coaches"] });
      } else {
        toast.error(t("failed_to_update_status") || "Failed to update status");
      }
    } catch (error: any) {
      console.error("Error updating status:", error);
      toast.error(error.response?.data?.message || t("failed_to_update_status") || "Failed to update status");
    }
  };

  useImperativeHandle(ref, () => ({
    refetch,
  }));

  const handleFilterChange = (newFilters: Record<string, string>) => {
    setFilters(newFilters);
    setPage(1); // Reset to first page when filtering
  };

  const handleClearFilters = () => {
    setFilters({});
    setPage(1);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setPage(1); // Reset to first page when searching
  };

  // Transform API data to table data
  const coachData = useMemo(() => {
    if (!apiResponse?.data) return [];
    return apiResponse.data;
  }, [apiResponse]);

  // Define filter configuration
  const filterConfig: any[] = [
    {
      key: "gender",
      label: t("gender") || "Gender",
      type: "select",
      placeholder: t("all_genders") || "All Genders",
      options: genderOptions.map((gender) => ({
        value: gender,
        label: gender.charAt(0).toUpperCase() + gender.slice(1),
      })),
    },
  ];

  // Helper function to get role badge colors
  const getRoleBadgeColor = (role: string) => {
    const roleColors: Record<string, string> = {
      ADMIN: "bg-gradient-to-r from-purple-600 to-purple-700 text-white",
      COACH: "bg-gradient-to-r from-blue-600 to-blue-700 text-white",
      CLIENT: "bg-gradient-to-r from-green-600 to-green-700 text-white",
    };
    return (
      roleColors[role] ||
      "bg-gradient-to-r from-gray-600 to-gray-700 text-white"
    );
  };

  // Helper function to get level badge colors
  const getLevelBadgeColor = (level: string | null) => {
    const levelColors: Record<string, string> = {
      BEGINNER: "bg-gradient-to-r from-green-500 to-green-600 text-white",
      INTERMEDIATE: "bg-gradient-to-r from-yellow-500 to-yellow-600 text-white",
      ADVANCED: "bg-gradient-to-r from-red-500 to-red-600 text-white",
    };
    return (
      levelColors[level || ""] ||
      "bg-gradient-to-r from-gray-500 to-gray-600 text-white"
    );
  };

  // Helper function to get gender icon
  const getGenderIcon = (gender: string) => {
    return gender === "male" ? "heroicons:user" : "heroicons:user-circle";
  };

  // Helper function to format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString();
  };

  const columns: ColumnDef<Coach>[] = [
    {
      id: "actions",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("actions") || "Actions"}
          className="text-[#25235F] dark:text-white font-bold"
        />
      ),
      cell: ({ row }) => (
        <div className="flex flex-row gap-2 items-center justify-center w-full">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => handleToggleStatus(row.original.id, row.original.isActive)}
                  className={`
                    h-10 w-10 
                    transition-all duration-300 
                    shadow-md hover:shadow-lg
                    ${row.original.isActive 
                      ? "border-emerald-500/20 text-emerald-600 hover:bg-emerald-500 hover:text-white dark:border-emerald-400/30 dark:text-emerald-400 dark:hover:bg-emerald-600" 
                      : "border-gray-500/20 text-gray-400 hover:bg-gray-500 hover:text-white dark:border-gray-700/30 dark:text-gray-500 dark:hover:bg-gray-600"
                    }
                  `}
                >
                  <Icon 
                    icon={row.original.isActive ? "heroicons:check-badge" : "heroicons:no-symbol"} 
                    className="h-5 w-5 font-bold" 
                  />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{row.original.isActive ? t("DEACTIVATE") || "Deactivate" : t("ACTIVATE") || "Activate"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center">
                  <CoachTraineeUpdateDialog
                    coachId={row.original.id}
                    coachName={row.original.name}
                    currentTrainees={
                      row.original.numberOFCoachTrainee
                        ? parseInt(row.original.numberOFCoachTrainee)
                        : 0
                    }
                    onSuccess={() => {
                      queryClient.invalidateQueries({ queryKey: ["coaches"] });
                    }}
                    size="icon"
                    variant="outline"
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t("update_trainees") || "Update Trainees"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <Link href={`/${lang}/coach/${row.original.id}/edit`}>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="outline"
                    className="
                h-10 w-10 
                border-[#25235F]/20 dark:border-blue-400/30 
                hover:border-[#25235F] dark:hover:border-blue-500 
                hover:bg-[#25235F] dark:hover:bg-blue-600 
                hover:text-white 
                transition-all duration-300 
                shadow-md hover:shadow-lg
                bg-white dark:bg-gray-800
                text-gray-700 dark:text-gray-300
              "
                  >
                    <Icon icon="heroicons:pencil" className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{t("edit") || "Edit"}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </Link>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center">
                  <DeleteConfirmationDialog
                    onConfirm={() =>
                      handleDeleteCoach(row.original.id, row.original.name)
                    }
                    title={t("delete_coach") || "Delete Coach"}
                    description={
                      t("delete_coach_confirmation") ||
                      "Are you sure you want to delete this coach? This action cannot be undone."
                    }
                    confirmText={t("delete") || "Delete"}
                    itemName={t("coach") || "coach"}
                    destructive={true}
                    icon="fluent:delete-48-filled"
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t("delete") || "Delete"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      ),
    },

    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("name") || "Name"}
          className="text-[#25235F] dark:text-white font-bold"
        />
      ),
      cell: ({ row }) => {
        const coach = row.original;
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  className="flex items-center justify-start gap-3 cursor-pointer group/name"
                  onClick={() => handleViewCoach(coach)}
                >
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-r from-[#25235F]/10 to-[#ED4135]/10 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center">
                    {coach.image ? (
                      <img
                        src={coach.image}
                        alt={coach.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Icon
                        icon={getGenderIcon(coach.gender)}
                        className="h-5 w-5 text-[#25235F] dark:text-gray-300"
                      />
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="max-w-[200px] truncate font-semibold text-gray-800 dark:text-gray-200 group-hover/name:text-[#25235F] dark:group-hover/name:text-white transition-colors duration-200">
                      {coach.name}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                      <Icon icon="heroicons:phone" className="h-3 w-3" />
                      {coach.phone}
                    </span>
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent className="max-w-md bg-white dark:bg-gray-800 border dark:border-gray-700">
                <p className="font-medium text-black dark:text-white">
                  {coach.name}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {coach.phone}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      },
    },
    {
      accessorKey: "role",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("role") || "Role"}
          className="text-[#25235F] dark:text-white font-bold"
        />
      ),
      cell: ({ row }) => (
        <div className="flex items-center justify-center">
          <Badge
            className={`text-center font-semibold px-3 py-1 rounded-full border-0 ${getRoleBadgeColor(row.original.role)}`}
          >
            {t(row.original.role) || row.original.role}
          </Badge>
        </div>
      ),
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    },
    {
      accessorKey: "gender",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("gender") || "Gender"}
          className="text-[#25235F] dark:text-white font-bold"
        />
      ),
      cell: ({ row }) => {
        const genderColors: Record<string, string> = {
          male: "bg-gradient-to-r from-blue-500 to-blue-600 text-white",
          female: "bg-gradient-to-r from-pink-500 to-pink-600 text-white",
        };

        const colorClass =
          genderColors[row.original.gender] || "bg-gray-500 text-white";

        return (
          <div className="flex items-center justify-center gap-2">
            <Icon
              icon={getGenderIcon(row.original.gender)}
              className={`h-4 w-4 ${row.original.gender === "male" ? "text-blue-500" : "text-pink-500"}`}
            />
            <Badge
              className={`text-center font-semibold px-3 py-1 rounded-full border-0 ${colorClass}`}
            >
              {t(row.original.gender)}
            </Badge>
          </div>
        );
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    },
    {
      accessorKey: "clientsCount",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("clients_count") || "Clients Count"}
          className="text-[#25235F] dark:text-white font-bold"
        />
      ),
      cell: ({ row }) => (
        <div className="flex items-center justify-center">
          {row.original.clientsCount ? (
            <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold px-3 py-1 rounded-full">
              {row.original.clientsCount}
            </Badge>
          ) : (
            <span className="text-sm text-gray-500 dark:text-gray-400">0</span>
          )}
        </div>
      ),
    },
    {
      accessorKey: "numberOFCoachTrainee",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("trainees_count") || "Trainees Count"}
          className="text-[#25235F] dark:text-white font-bold"
        />
      ),
      cell: ({ row }) => {
        const coach = row.original;
        return (
          <div className="flex items-center justify-center">
            {coach.numberOFCoachTrainee ? (
              <Badge className="bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold px-3 py-1 rounded-full">
                {coach.numberOFCoachTrainee}
              </Badge>
            ) : (
              <span className="text-sm text-gray-500 dark:text-gray-400">
                0
              </span>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "startDate",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("START_DATE") || "Start Date"}
          className="text-[#25235F] dark:text-white font-bold"
        />
      ),
      cell: ({ row }) => (
        <div className="flex items-center justify-center gap-2 text-sm text-gray-700 dark:text-gray-300">
          <Icon
            icon="heroicons:calendar-days"
            className="h-4 w-4 text-blue-500"
          />
          {formatDate(row.original.startDate)}
        </div>
      ),
    },
    {
      accessorKey: "isActive",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("STATUS") || "Status"}
          className="text-[#25235F] dark:text-white font-bold"
        />
      ),
      cell: ({ row }) => (
        <div className="flex items-center justify-center">
          <Badge
            className={`
              px-3 py-1 rounded-full text-xs font-bold border-0
              ${
                row.original.isActive
                  ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
              }
            `}
          >
            <div className="flex items-center gap-1.5">
              <div
                className={`w-1.5 h-1.5 rounded-full ${row.original.isActive ? "bg-emerald-500 animate-pulse" : "bg-gray-400"}`}
              />
              {row.original.isActive
                ? t("ACTIVE") || "Active"
                : t("INACTIVE") || "Inactive"}
            </div>
          </Badge>
        </div>
      ),
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("joined_date") || "Joined Date"}
          className="text-[#25235F] dark:text-white font-bold"
        />
      ),
      cell: ({ row }) => (
        <div className="flex items-center justify-center">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-2">
                  <Icon
                    icon="heroicons:calendar"
                    className="h-4 w-4 text-[#25235F] dark:text-gray-300"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {formatDate(row.original.createdAt)}
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{new Date(row.original.createdAt).toLocaleString()}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600 dark:text-gray-400">
          {t("loading_coaches") || "Loading coaches..."}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-red-600 dark:text-red-400">
          {t("error_loading_coaches") || "Error loading coaches"}:{" "}
          {error.message}
        </div>
        <Button
          onClick={() => refetch()}
          className="ml-4 dark:bg-gray-700 dark:hover:bg-gray-600"
        >
          {t("retry") || "Retry"}
        </Button>
      </div>
    );
  }

  const totalItems = apiResponse?.totalItems || apiResponse?.total || 0;

  return (
    <div className="space-y-6">
      {/* Generic Filter Component */}
      <GenericFilter
        filters={filterConfig}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        initialFilters={filters}
        searchValue={searchTerm}
        onSearchChange={handleSearch}
        searchPlaceholder={t("search_coaches") || "Search coaches by name..."}
      />

      {/* Enhanced Data Table with Custom Styling */}
      <div className="flex flex-wrap gap-4 items-center justify-between p-4 bg-gradient-to-r from-[#25235F]/5 to-[#ED4135]/5 dark:from-gray-800 dark:to-gray-700 rounded-xl border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <Icon
            icon="heroicons:academic-cap"
            className="h-5 w-5 text-[#25235F] dark:text-gray-300"
          />
          <h3 className="text-lg font-semibold text-[#25235F] dark:text-white">
            {t("coaches_list") || "Coaches List"}
          </h3>
        </div>

        <div className="flex items-center gap-4">
          <Button
            onClick={() => refetch()}
            variant="ghost"
            size="sm"
            className="text-[#25235F] dark:text-gray-300 hover:text-[#ED4135] dark:hover:text-white hover:bg-[#25235F]/10 dark:hover:bg-gray-700 transition-all duration-300"
          >
            <Icon icon="heroicons:arrow-path" className="h-4 w-4 mr-2" />
            {t("refresh_data") || "Refresh Data"}
          </Button>
        </div>
      </div>

      <div className="rounded-xl overflow-hidden bg-white dark:bg-gray-800">
        <DataTable
          data={coachData}
          columns={columns}
          isLoading={isLoading}
          searchTerm={searchTerm}
          onSearchChange={handleSearch}
          page={page}
          pageSize={pageSize}
          totalItems={totalItems}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
        />
      </div>

      {/* Coach Details Modal */}
      {selectedCoach && (
        <MemberDetailsModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedCoach(null);
          }}
          member={{
            ...selectedCoach,
            fullName: selectedCoach.name, // Map name to fullName for the modal
            status: selectedCoach.isVerified ? "active" : "inactive",
          } as any}
        />
      )}
    </div>
  );
});

CoachMembersTable.displayName = "CoachMembersTable";

export default CoachMembersTable;
