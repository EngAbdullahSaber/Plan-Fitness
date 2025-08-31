"use client";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { data } from ".";
import { ColumnDef } from "@tanstack/react-table";
import DeleteButton from "../shared/DeleteConfirmationDialog";
import { DataTableColumnHeader } from "../tables/advanced/components/data-table-column-header";
import { DataTable } from "../tables/advanced/components/data-table";
import DeleteConfirmationDialog from "../shared/DeleteConfirmationDialog";
import Link from "next/link";
import MemberDetailsModal from "./MemberDetailsModal";
import { useState } from "react";

interface Member {
  id: string;
  Role?: string;
  MembershipId?: string;
  Name?: string;
  JOIN_DATE?: string;
  Email?: string;
  STATUS?: string;
  MEMBERSHIP_STATUS?: string;
  GENDER?: string;
  BIRTH?: string;
  ADDRESS?: string;
  PHONE?: string;
  LAST_CHECKIN?: string;
  TRAINER?: string;
  MEMBERSHIP_PLAN?: string;
}

const TableData = ({ t }: { t: any }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const sampleMember: Member = {
    id: "001",
    Name: "John Smith",
    Role: "Premium Member",
    MembershipId: "GYM-2024-001",
    Email: "john.smith@email.com",
    PHONE: "+1 (555) 123-4567",
    STATUS: "Active",
    MEMBERSHIP_STATUS: "Active",
    GENDER: "Male",
    BIRTH: "1990-05-15",
    ADDRESS: "123 Main St, New York, NY 10001",
    JOIN_DATE: "2024-01-15",
    LAST_CHECKIN: "2024-08-30 09:30 AM",
    TRAINER: "Mike Johnson",
    MEMBERSHIP_PLAN: "Premium Annual",
  };
  const columns: ColumnDef<Member>[] = [
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex flex-row gap-3 items-center justify-center">
          <Button
            size="icon"
            onClick={() => setIsModalOpen(!isModalOpen)}
            variant="outline"
            className="h-9 w-9 border-[#25235F]/20 hover:border-[#25235F] hover:bg-[#25235F] hover:text-white transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
          >
            <Icon icon="carbon:view" className="h-4 w-4" />
          </Button>
          <Link href={`/users/${row.original.id}/edit`}>
            <Button
              size="icon"
              variant="outline"
              className="h-9 w-9 border-[#25235F]/20 hover:border-[#25235F] hover:bg-[#25235F] hover:text-white transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
            >
              <Icon icon="heroicons:pencil" className="h-4 w-4" />
            </Button>
          </Link>
          <DeleteConfirmationDialog
            onConfirm={() => console.log("Archive item")}
            title="Archive Item"
            description="Are you sure you want to archive this item?"
            confirmText="Archive"
            itemName="document"
            destructive={true}
            icon="fluent:delete-48-filled"
          />{" "}
        </div>
      ),
    },
    {
      accessorKey: "id",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={"ID"}
          className="text-[#25235F] font-bold"
        />
      ),
      cell: ({ row }) => (
        <div className="w-[80px]">
          <span className="inline-flex items-center justify-center w-8 h-8 text-xs font-bold text-white bg-gradient-to-r from-[#25235F] to-[#25235F]/80 rounded-full">
            {row.original.id}
          </span>
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "Member Name",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={"Member Name"}
          className="text-[#25235F] font-bold"
        />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex items-center justify-start gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#25235F]/10 to-[#ED4135]/10 flex items-center justify-center">
              <Icon icon="heroicons:user" className="h-5 w-5 text-[#25235F]" />
            </div>
            <span className="max-w-[200px] truncate font-semibold text-gray-800 hover:text-[#25235F] transition-colors duration-200">
              {row.original.Name}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "Role",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={"Role"}
          className="text-[#25235F] font-bold"
        />
      ),
      cell: ({ row }) => {
        const roleColors = {
          "Premium Member":
            "bg-gradient-to-r from-[#ED4135] to-[#ED4135]/80 text-white shadow-lg",
          "Standard Member":
            "bg-gradient-to-r from-[#25235F] to-[#25235F]/80 text-white shadow-lg",
          Trainer:
            "bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg",
          Admin:
            "bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg",
        };

        return (
          <div className="flex items-center justify-center">
            <Badge
              className={`text-center font-semibold px-4 py-2 rounded-full border-0 transform hover:scale-105 transition-all duration-300 ${
                roleColors[row.original.Role as keyof typeof roleColors] ||
                "bg-gray-500 text-white"
              }`}
            >
              {row.original.Role}
            </Badge>
          </div>
        );
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    },
    {
      accessorKey: "Membership ID",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={"Membership ID"}
          className="text-[#25235F] font-bold"
        />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex items-center justify-center">
            <span className="max-w-[150px] truncate font-mono text-sm bg-gray-100 px-3 py-1 rounded-md border hover:bg-gray-200 transition-colors duration-200">
              {row.original.MembershipId}
            </span>
          </div>
        );
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    },
    {
      accessorKey: "Email",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={"Email"}
          className="text-[#25235F] font-bold"
        />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex items-center justify-start gap-2">
            <Icon
              icon="heroicons:envelope"
              className="h-4 w-4 text-[#25235F]"
            />
            <span className="max-w-[200px] truncate text-sm text-blue-700 hover:text-[#25235F] transition-colors duration-200 cursor-pointer">
              {row.original.Email}
            </span>
          </div>
        );
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    },
    {
      accessorKey: "Phone",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={"Phone"}
          className="text-[#25235F] font-bold"
        />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex items-center justify-start gap-2">
            <Icon icon="heroicons:phone" className="h-4 w-4 text-[#25235F]" />
            <span className="max-w-[150px] truncate font-medium text-gray-700 hover:text-[#25235F] transition-colors duration-200">
              {row.original.PHONE}
            </span>
          </div>
        );
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    },
    {
      accessorKey: "Membership Plan",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={"Membership Plan"}
          className="text-[#25235F] font-bold"
        />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex items-center justify-center">
            <Badge className="bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold px-3 py-1 rounded-full border-0">
              {row.original.MEMBERSHIP_PLAN}
            </Badge>
          </div>
        );
      },
    },
    {
      accessorKey: "Status",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={"Status"}
          className="text-[#25235F] font-bold"
        />
      ),
      cell: ({ row }) => {
        const isActive = row.original.STATUS === "Active";
        return (
          <div className="flex items-center justify-center">
            <Badge
              className={`text-center font-semibold px-4 py-2 rounded-full border-0 transform hover:scale-105 transition-all duration-300 flex items-center gap-2 ${
                isActive
                  ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg"
                  : "bg-gradient-to-r from-[#ED4135] to-[#ED4135]/80 text-white shadow-lg"
              }`}
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  isActive ? "bg-white" : "bg-white/80"
                } animate-pulse`}
              ></div>
              {row.original.STATUS}
            </Badge>
          </div>
        );
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    },
    {
      accessorKey: "Membership Status",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={"Membership Status"}
          className="text-[#25235F] font-bold"
        />
      ),
      cell: ({ row }) => {
        const statusColors = {
          Active: "bg-gradient-to-r from-green-500 to-green-600 text-white",
          Frozen: "bg-gradient-to-r from-blue-500 to-blue-600 text-white",
          Expired: "bg-gradient-to-r from-[#ED4135] to-[#ED4135]/80 text-white",
          Staff: "bg-gradient-to-r from-purple-500 to-purple-600 text-white",
        };

        return (
          <div className="flex items-center justify-center">
            <Badge
              className={`text-center font-semibold px-3 py-1 rounded-full border-0 ${
                statusColors[
                  row.original.MEMBERSHIP_STATUS as keyof typeof statusColors
                ] || "bg-gray-500 text-white"
              }`}
            >
              {row.original.MEMBERSHIP_STATUS}
            </Badge>
          </div>
        );
      },
    },
    {
      accessorKey: "Last Check-in",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={"Last Check-in"}
          className="text-[#25235F] font-bold"
        />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex items-center justify-start gap-2">
            <Icon icon="heroicons:clock" className="h-4 w-4 text-[#25235F]" />
            <span className="max-w-[120px] truncate text-sm font-medium text-gray-700">
              {row.original.LAST_CHECKIN}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "Trainer",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={"Assigned Trainer"}
          className="text-[#25235F] font-bold"
        />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex items-center justify-start gap-2">
            <Icon
              icon="heroicons:academic-cap"
              className="h-4 w-4 text-[#25235F]"
            />
            <span className="max-w-[120px] truncate text-sm font-medium text-gray-700">
              {row.original.TRAINER}
            </span>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      {/* Enhanced Data Table with Custom Styling */}
      <div className="flex flex-wrap gap-4 items-center justify-between p-4 bg-gradient-to-r from-[#25235F]/5 to-[#ED4135]/5 rounded-xl border border-gray-200">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm font-medium text-gray-700">
              Active Members
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-sm font-medium text-gray-700">
              Frozen Memberships
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#ED4135] rounded-full"></div>
            <span className="text-sm font-medium text-gray-700">
              Expired Memberships
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            className="text-[#25235F] hover:text-[#ED4135] hover:bg-[#25235F]/10 transition-all duration-300"
          >
            <Icon icon="heroicons:arrow-path" className="h-4 w-4 mr-2" />
            Refresh Data
          </Button>
        </div>
      </div>
      <div className="rounded-xl overflow-hidden     bg-white">
        <DataTable
          data={data}
          columns={columns}
          className="[&_table]:bg-white [&_thead]:bg-gradient-to-r [&_thead]:from-gray-50 [&_thead]:to-white [&_th]:text-[#25235F] [&_th]:font-bold [&_th]:border-gray-200 [&_td]:border-gray-100 [&_tr:hover]:bg-gradient-to-r [&_tr:hover]:from-[#25235F]/5 [&_tr:hover]:to-[#ED4135]/5 [&_tr]:transition-all [&_tr]:duration-300"
        />
        <MemberDetailsModal
          member={sampleMember}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </div>
    </div>
  );
};

export default TableData;
