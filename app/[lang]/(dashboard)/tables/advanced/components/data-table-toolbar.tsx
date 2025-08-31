"use client";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableViewOptions } from "./data-table-view-options";

import { priorities, statuses } from "../data/data";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { Table } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getDictionary } from "@/app/dictionaries";
import { translate } from "@/lib/utils";
import { LayoutFilter } from "@/components/common/Filter/LayoutFilter";
import { useTranslate } from "@/config/useTranslation";

interface DataTableToolbarProps {
  table: Table<any>;
  filterNames?: string[];
  filters?: { title: string; options: any[] }[];
}

export function DataTableToolbar({
  table,
  filterNames = [],
  filters = [],
}: DataTableToolbarProps) {
  const { t } = useTranslate();

  return (
    <div className="flex flex-1 flex-wrap items-center gap-2">
      <Input placeholder={t("Search")} className="h-8 min-w-[200px] max-w-sm" />

      {/* 
      <DataTableViewOptions table={table} />
      <LayoutFilter table={table}  /> */}
    </div>
  );
}
