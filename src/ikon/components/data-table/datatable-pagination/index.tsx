import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shadcn/ui/select";
import { DataTablePaginationProps } from "../type";
import { IconButtonWithTooltip } from "../../buttons";

const defaultPageSizeArray = [15, 20, 30, 40, 50, 100];
export function DataTablePagination<TData>({
  table,
  extraParams,
}: DataTablePaginationProps<TData>) {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
      <small className="flex-1 px-2">
        {(extraParams?.numberOfRows == undefined ||
          extraParams?.numberOfRows) &&
          extraParams?.checkBoxColumn ? (
          <>
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </>
        ) : (
          <>Total {table.getFilteredRowModel().rows.length} no(s) of rows.</>
        )}
      </small>
      <div className="flex items-start md:items-center gap-3 flex-col md:flex-row ">
        <div className="flex items-center gap-3">
          <small>Rows per page</small>
          {(extraParams?.rowsPerPage == undefined ||
            extraParams.rowsPerPage) && (
              <Select
                value={`${table.getState().pagination.pageSize}`}

                onValueChange={(value) => {
                  table.setPageSize(Number(value));
                }}
              >
                <SelectTrigger className="w-[70px] h-8">
                  <SelectValue
                    placeholder={table.getState().pagination.pageSize}
                  />
                </SelectTrigger>
                <SelectContent side="top">
                  {(extraParams?.pageSizeArray || defaultPageSizeArray).map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
        </div>
        {(extraParams?.pagination == undefined || extraParams.pagination) && (
          <>
            <small className="flex w-[100px] items-center justify-center">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </small>
            <div className="flex items-center gap-3">
              <IconButtonWithTooltip
                tooltipContent="Go to first page"
                size={"smIcon"}
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <ChevronsLeft />
              </IconButtonWithTooltip>

              <IconButtonWithTooltip
                tooltipContent="Go to previous page"
                size={"smIcon"}
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <ChevronLeft />
              </IconButtonWithTooltip>

              <IconButtonWithTooltip
                tooltipContent="Go to next page"
                size={"smIcon"}
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <ChevronRight />
              </IconButtonWithTooltip>

              <IconButtonWithTooltip
                tooltipContent="Go to last page"
                size={"smIcon"}
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                <ChevronsRight />
              </IconButtonWithTooltip>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
