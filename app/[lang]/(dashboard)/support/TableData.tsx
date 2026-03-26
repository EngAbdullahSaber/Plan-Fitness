"use client";
import React, { forwardRef, useImperativeHandle, useState, useMemo, useEffect } from "react";
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
import toast from "react-hot-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { GetPanigationMethodWithFilter, PatchMethodWithBody } from "@/app/services/apis/ApiMethod";
import TicketReplyModal from "./TicketReplyModal";
import TicketDetailsModal from "./TicketDetailsModal";

interface Ticket {
  id: number;
  userId: number;
  phone: string;
  message: string;
  status: "OPEN" | "CLOSED" | "PENDING";
  createdAt: string;
  updatedAt: string;
  user: {
    id: number;
    name: string;
    phone: string;
  };
  _count: {
    replies: number;
  };
}

interface TicketApiResponse {
  data: Ticket[];
  totalItems: number;
  totalPages: number;
  code: number;
  message: string;
}

const TicketsTable = forwardRef(({ t }: { t: any }, ref) => {
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const { lang } = useParams();
  const queryClient = useQueryClient();

  const {
    data: apiResponse,
    isLoading,
    error,
    refetch,
  } = useQuery<TicketApiResponse, Error>({
    queryKey: ["tickets", page, pageSize, searchTerm, lang],
    queryFn: async () => {
      try {
        const response = await GetPanigationMethodWithFilter(
          "support/admin/all",
          page,
          pageSize,
          lang,
          searchTerm,
          {
            page: page.toString(),
            pageSize: pageSize.toString(),
          }
        );

        if (response && response.data) {
          // Flattening the weird response structure if needed
          return response.data;
        } else if (response) {
          return response as any;
        }
        throw new Error("Invalid API response");
      } catch (err: any) {
        console.error("Error fetching tickets:", err);
        throw new Error(err.message || "Failed to fetch tickets");
      }
    },
  });

  useImperativeHandle(ref, () => ({
    refetch,
  }));

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setPage(1);
  };

  // Handle close ticket
  const handleCloseTicket = async (ticketId: number) => {
    try {
      const response = await PatchMethodWithBody("support", `${ticketId}/status`, { status: "CLOSED" }, lang);
      if (response && response.status === 200) {
        toast.success(t("Ticket closed successfully"));
        refetch();
      } else {
        toast.error(t("Failed to close ticket"));
      }
    } catch (err: any) {
      console.error("Error closing ticket:", err);
      toast.error(err.response?.data?.message || t("An error occurred"));
    }
  };

  const ticketData = useMemo(() => {
    if (!apiResponse?.data) return [];
    return apiResponse.data;
  }, [apiResponse]);

  const getStatusBadgeColor = (status: string) => {
    const statusColors: Record<string, string> = {
      OPEN: "bg-gradient-to-r from-red-500 to-red-600 text-white",
      PENDING: "bg-gradient-to-r from-yellow-500 to-yellow-600 text-white",
      CLOSED: "bg-gradient-to-r from-green-500 to-green-600 text-white",
    };
    return (
      statusColors[status] ||
      "bg-gradient-to-r from-gray-500 to-gray-600 text-white"
    );
  };

  const columns: ColumnDef<Ticket>[] = [
    {
      accessorKey: "actions",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("Actions")}
          className="text-[#25235F] dark:text-white font-bold"
        />
      ),
      cell: ({ row }) => (
        <div className="flex items-center justify-center gap-2">
          {row.original.status !== "CLOSED" && (
            <Button
              size="icon"
              variant="outline"
              className="h-10 w-10 border-red-200 dark:border-red-900/30 hover:border-red-500 hover:bg-red-500 hover:text-white text-red-500 transition-all duration-300 shadow-md transform hover:scale-105"
              onClick={() => handleCloseTicket(row.original.id)}
            >
              <Icon icon="heroicons:x-circle" className="h-5 w-5" />
            </Button>
          )}
          {row.original.status !== "CLOSED" && (
            <Button
              size="icon"
              variant="outline"
              className="h-10 w-10 border-[#25235F]/20 dark:border-gray-600 hover:border-[#25235F] hover:bg-[#25235F] hover:text-white transition-all duration-300 shadow-md transform hover:scale-105"
              onClick={() => {
                setSelectedTicket(row.original);
                setIsReplyModalOpen(true);
              }}
            >
              <Icon icon="carbon:reply" className="h-5 w-5" />
            </Button>
          )}
          <Button
            size="icon"
            variant="outline"
            className="h-10 w-10 border-[#25235F]/20 dark:border-gray-600 hover:border-[#25235F] hover:bg-[#25235F] hover:text-white transition-all duration-300 shadow-md transform hover:scale-105"
            onClick={() => {
              setSelectedTicket(row.original);
              setIsDetailsModalOpen(true);
            }}
          >
            <Icon icon="carbon:view" className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
    {
      accessorKey: "id",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("ID")}
          className="text-[#25235F] dark:text-white font-bold"
        />
      ),
      cell: ({ row }) => (
        <div className="flex items-center justify-center">
          <Badge className="bg-[#25235F]/10 text-[#25235F] dark:bg-gray-700 dark:text-gray-300 px-3 py-1 rounded-full font-semibold">
            #{row.original.id}
          </Badge>
        </div>
      ),
    },
    {
      accessorKey: "user.name",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("User")}
          className="text-[#25235F] dark:text-white font-bold"
        />
      ),
      cell: ({ row }) => (
        <div className="flex flex-col items-start gap-1">
          <span className="font-semibold text-gray-800 dark:text-gray-200 truncate max-w-[150px]">
            {row.original.user?.name || t("Unknown")}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
            <Icon icon="heroicons:phone" className="h-3 w-3" />
            {row.original.phone}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "message",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("Message")}
          className="text-[#25235F] dark:text-white font-bold"
        />
      ),
      cell: ({ row }) => (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="max-w-[300px] truncate text-sm text-gray-600 dark:text-gray-400 italic">
                "{row.original.message}"
              </div>
            </TooltipTrigger>
            <TooltipContent className="max-w-md bg-white dark:bg-gray-800 border dark:border-gray-700">
              <p className="text-gray-800 dark:text-gray-200 p-2 whitespace-pre-wrap">
                {row.original.message}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ),
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("Status")}
          className="text-[#25235F] dark:text-white font-bold"
        />
      ),
      cell: ({ row }) => (
        <div className="flex items-center justify-center">
          <Badge className={`px-3 py-1 rounded-full border-0 font-bold ${getStatusBadgeColor(row.original.status)}`}>
            {t(row.original.status)}
          </Badge>
        </div>
      ),
    },
    {
      accessorKey: "_count.replies",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("Replies")}
          className="text-[#25235F] dark:text-white font-bold"
        />
      ),
      cell: ({ row }) => (
        <div className="flex items-center justify-center gap-1.5">
          <Icon icon="heroicons:chat-bubble-left-right" className="h-4 w-4 text-[#25235F]/60" />
          <span className="font-bold text-[#25235F] dark:text-gray-300">
            {row.original._count.replies}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("Created At")}
          className="text-[#25235F] dark:text-white font-bold"
        />
      ),
      cell: ({ row }) => (
        <div className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
          {new Date(row.original.createdAt).toLocaleDateString()} {new Date(row.original.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#25235F]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-red-500 font-medium">{t("Error loading tickets")}</p>
        <Button onClick={() => refetch()} variant="outline">{t("Retry")}</Button>
      </div>
    );
  }

  const totalItems = apiResponse?.totalItems || 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 items-center justify-between p-4 bg-gradient-to-r from-[#25235F]/5 to-[#ED4135]/5 dark:from-gray-800 dark:to-gray-700 rounded-xl border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <Icon icon="heroicons:lifebuoy" className="h-5 w-5 text-[#25235F] dark:text-gray-300" />
          <h3 className="text-lg font-semibold text-[#25235F] dark:text-white">
            {t("Support Tickets")}
          </h3>
        </div>
        <Button
          onClick={() => refetch()}
          variant="ghost"
          size="sm"
          className="text-[#25235F] dark:text-gray-300 hover:bg-[#25235F]/10 transition-all"
        >
          <Icon icon="heroicons:arrow-path" className="h-4 w-4 mr-2" />
          {t("Refresh")}
        </Button>
      </div>

      <div className="rounded-xl overflow-hidden bg-white dark:bg-gray-800 border dark:border-gray-700 shadow-sm leading-0">
        <DataTable
          data={ticketData}
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
        {selectedTicket && (
          <TicketReplyModal
            isOpen={isReplyModalOpen}
            onClose={() => {
              setIsReplyModalOpen(false);
              setSelectedTicket(null);
            }}
            ticketId={selectedTicket.id}
            userName={selectedTicket.user?.name || "User"}
            onSuccess={refetch}
          />
        )}
        {selectedTicket && (
          <TicketDetailsModal
            isOpen={isDetailsModalOpen}
            onClose={() => {
              setIsDetailsModalOpen(false);
              setSelectedTicket(null);
            }}
            ticketId={selectedTicket.id}
          />
        )}
      </div>
    </div>
  );
});

TicketsTable.displayName = "TicketsTable";

export default TicketsTable;
