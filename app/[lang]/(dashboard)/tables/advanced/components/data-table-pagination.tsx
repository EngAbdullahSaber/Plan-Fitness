import {
  ChevronsLeft,
  ChevronRight,
  ChevronLeft,
  ChevronsRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table } from "@tanstack/react-table";
import { useTranslate } from "@/config/useTranslation";

interface DataTablePaginationProps {
  table: Table<any>;
  page?: number;
  pageSize?: number;
  totalItems?: number;
}

export function DataTablePagination({
  table,
  page = 1,
  pageSize = 10,
  totalItems = 0,
}: DataTablePaginationProps) {
  const { t } = useTranslate();

  const totalPages = Math.ceil(totalItems / pageSize);

  return (
    <div className="flex items-center flex-wrap gap-2 justify-between px-2">
      <div className="flex-1 text-sm text-muted-foreground whitespace-nowrap">
        {t("total")}: {totalItems} {t("items")}
      </div>
      <div className="flex flex-wrap items-center gap-6 lg:gap-8">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-muted-foreground whitespace-nowrap">
            {t("rows_per_page")}
          </p>
          <Select
            value={`${pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex w-[100px] items-center justify-center text-sm font-medium text-muted-foreground">
          {t("page")} {page} {t("of")} {totalPages}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => table.setPageIndex(0)}
            disabled={page <= 1}
          >
            <span className="sr-only">{t("go_to_first_page")}</span>
            <ChevronsLeft className="h-4 w-4 rtl:rotate-180" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.previousPage()}
            disabled={page <= 1}
          >
            <span className="sr-only">{t("go_to_previous_page")}</span>
            <ChevronLeft className="h-4 w-4 rtl:rotate-180" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.nextPage()}
            disabled={page >= totalPages}
          >
            <span className="sr-only">{t("go_to_next_page")}</span>
            <ChevronRight className="h-4 w-4 rtl:rotate-180" />
          </Button>
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => table.setPageIndex(totalPages - 1)}
            disabled={page >= totalPages}
          >
            <span className="sr-only">{t("go_to_last_page")}</span>
            <ChevronsRight className="h-4 w-4 rtl:rotate-180" />
          </Button>
        </div>
      </div>
    </div>
  );
}
