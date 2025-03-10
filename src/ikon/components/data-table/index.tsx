"use client";
import React, { useEffect, useState } from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  GroupingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getGroupedRowModel,
  getExpandedRowModel,
  useReactTable,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  Header,
  Row,
  PaginationState,
} from "@tanstack/react-table";
import { ArrowDown, ArrowDownToLine, ArrowUp, ArrowUpToLine, ChevronDown, ChevronLast, ChevronRight, ChevronUp, X } from "lucide-react";

import { Button } from "@/shadcn/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shadcn/ui/table";
import DataTableToolbar from "./datatable-toolbar";
import { getDataTableColumnTitle } from "./function";
import { DataTableProps, DragDropHeaderProp, DTColumnsProps } from "./type";
import { Checkbox } from "@/shadcn/ui/checkbox";
import { DataTablePagination } from "./datatable-pagination";
import ActionMenu from "../action-menu";
import { cx } from "class-variance-authority";

export function DataTable<TData, TValue>({
  columns,
  data,
  extraParams,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: extraParams?.pageIndex || 0,
    pageSize: extraParams?.pageSize || 15,
  })
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [grouping, setGrouping] = React.useState<GroupingState>([]);
  const [expanded, setExpanded] = React.useState({});
  const [rowSelection, setRowSelection] = React.useState({});

  columns = columns.map((column: any) => {
    if (!column?.filterFn) {
      column.filterFn = "arrIncludesSome";
    }
    return column;
  });

  useEffect(() => {
    if (extraParams?.checkBoxColumnCallback)
      extraParams.checkBoxColumnCallback(
        table.getFilteredSelectedRowModel().rows
      );
  }, [rowSelection]);

  if (extraParams?.checkBoxColumn) {
    columns.splice(0, 0, {
      id: "checkBoxColumn",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),

      cell: ({ row }) => (
        <>
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        </>
      ),
      enableSorting: false,
      enableHiding: false,
    });
  }

  if (extraParams?.actionMenu || extraParams?.groupActionMenu) {
    columns.push({
      id: "DTActions",
      accessorKey: "Actions",
      size: 20,
      cell: ({ row }) => {
        if (row.getIsGrouped()) {
          return extraParams?.groupActionMenu ? <div className="text-end"><ActionMenu
            actionMenus={extraParams.groupActionMenu.items}
            extraActionParams={{
              arguments: [row.original, ...(extraParams.groupActionMenu.extraArguments || [])],

            }}
          /></div>
            : null
        } else if (extraParams?.actionMenu) {
          return <div className="text-end"><ActionMenu
            actionMenus={extraParams.actionMenu.items}
            extraActionParams={{
              arguments: [row.original, ...(extraParams.actionMenu.extraArguments || [])],

            }}
          />
          </div>
        } else {
          return null
        }
      },
      enableSorting: false,
      enableHiding: false,
    });
  }

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
      columnFilters,
      columnVisibility,
      rowSelection,
      grouping,
      expanded,
      pagination
    },
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onExpandedChange: setExpanded,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onGroupingChange: setGrouping,
    onGlobalFilterChange: setGlobalFilter,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getGroupedRowModel: getGroupedRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues()
  });

  const [droppedHeaders, setDroppedHeaders] = useState<DragDropHeaderProp[]>(
    []
  );
  // Drag Event Handlers
  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    header: Header<TData, unknown>
  ) => {
    const headerObj = {
      id: header.id,
      title: getDataTableColumnTitle(header.column),
    };
    e.dataTransfer.setData("headerObj", JSON.stringify(headerObj));
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const headerObj = JSON.parse(e.dataTransfer.getData("headerObj"));
    if (!droppedHeaders.find((e) => e.id == headerObj.id)) {
      setDroppedHeaders((prevHeaders) => [...prevHeaders, headerObj]);
      const column = table.getColumn(headerObj.id);
      if (column) {
        column.getToggleGroupingHandler()();
      }
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); // Necessary to allow dropping
  };

  const handleRemoveGrouping = (groupId: string) => {
    const newDroppedHeaders = droppedHeaders.filter(
      (header) => header.id !== groupId
    );
    setDroppedHeaders(() => [...newDroppedHeaders]);
    const column = table.getColumn(groupId);
    if (column) {
      column.getToggleGroupingHandler()();
    }
  };

  const [isMount, setIsMount] = useState<boolean>(false);
  useEffect(() => {
    if (!isMount) {
      setIsMount(true);
    }
    if (extraParams?.defaultGroups) {
      table.setGrouping(extraParams?.defaultGroups);
    }
  }, []);

  return (
    isMount && (
      <div className="w-full h-full flex flex-col gap-3 justify-between">
        <div className="flex-grow flex flex-col gap-3 overflow-hidden">
          {(extraParams?.defaultTools == undefined ||
            extraParams.defaultTools ||
            extraParams.extraTools) && (
              <DataTableToolbar table={table} extraParams={extraParams} />
            )}

          <div className="flex-grow flex flex-col overflow-hidden">
            {(extraParams?.grouping == undefined || extraParams.grouping) && (
              <div
                className="w-full border-t min-h-10 px-2 py-1 flex gap-3 items-center text-sm"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
              >
                {droppedHeaders.length === 0
                  ? "Drag a column header here to group its column"
                  : droppedHeaders.map((header, index) => (
                    <div
                      key={header.id}
                      className="rounded-md px-2 py-1 bg-muted text-muted-foreground flex gap-3 items-center"
                    >
                      {header.title}
                      <span onClick={() => handleRemoveGrouping(header.id)}>
                        <X size={15} />
                      </span>
                    </div>
                  ))}
              </div>
            )}
            <div className="flex-grow overflow-hidden">
              <Table className="border-t">
                {(extraParams?.header == undefined || extraParams.header) &&
                  <TableHeader className="sticky top-0 z-10 border-t bg-background">
                    {table.getHeaderGroups().map((headerGroup) => (
                      <TableRow key={headerGroup.id}
                        className={cx(
                          ""
                        )}
                      >
                        {headerGroup.headers.map((header) => {
                          if (header.column.getIsGrouped()) {
                            if (
                              header.column.getGroupedIndex() <
                              droppedHeaders.length - 1
                            ) {
                              return null;
                            }
                            return (
                              <TableHead
                                key={header.id}
                                colSpan={droppedHeaders.length}
                                className="w-36"
                              ></TableHead>
                            );
                          } else {
                            return (
                              <TableHead
                                key={header.id}
                                {...(extraParams?.grouping == undefined ||
                                  extraParams.grouping
                                  ? {
                                    onDragStart: (e) =>
                                      handleDragStart(e, header),
                                    draggable: true,
                                  }
                                  : {})}
                              >
                                {
                                  header.isPlaceholder ? null :
                                    (extraParams?.sorting == undefined ||
                                      extraParams.sorting) && header.column.getCanSort() ?
                                      <div
                                        onClick={header.column.getToggleSortingHandler()}
                                        className={cx(
                                          "-mx-2 inline-flex cursor-pointer select-none items-center gap-2 rounded-md px-2 py-1 hover:bg-muted"
                                        )}
                                      >
                                        <div>
                                          {flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                          )}
                                        </div>
                                        {header.column.getCanSort() ? (
                                          <div className="-space-y-2">
                                            <ChevronUp
                                              className={cx(
                                                "size-3.5 text-foreground",
                                                header.column.getIsSorted() === "desc" ? "opacity-30" : "",
                                              )}
                                              aria-hidden="true"
                                            />
                                            <ChevronDown
                                              className={cx(
                                                "size-3.5 text-foreground",
                                                header.column.getIsSorted() === "asc" ? "opacity-30" : "",
                                              )}
                                              aria-hidden="true"
                                            />
                                          </div>
                                        ) : null}
                                      </div>
                                      :
                                      flexRender(
                                        header.column.columnDef.header,
                                        header.getContext(),
                                      )
                                }
                              </TableHead>
                            );
                          }
                        })}
                      </TableRow>
                    ))}
                  </TableHeader>
                }
                <TableBody>
                  {table.getRowModel().rows.length ? (
                    table.getRowModel().rows.map((row) =>
                      row.getIsGrouped() ? (
                        <TableRow key={row.id}>
                          {row.getVisibleCells().map((cell) => {
                            if (cell.column.getIndex() < row.depth) {
                              return null;
                            }
                            return (
                              // colSpan={cell.column.getIndex() == row.depth ? row.depth + 1 : undefined}
                              <TableCell
                                key={cell.id}
                                colSpan={
                                  cell.column.getIndex() == row.depth
                                    ? row.depth + 1
                                    : undefined
                                }
                                className={
                                  cell.column.getIndex() == row.depth
                                    ? "w-36"
                                    : ""
                                }
                              >
                                {cell.getIsGrouped() ? (
                                  <Button
                                    variant="link"
                                    onClick={row.getToggleExpandedHandler()}
                                    className={`text-right text-foreground`}
                                    style={{
                                      marginLeft: row.depth + "rem",
                                    }}
                                  >
                                    {row.getIsExpanded() ? (
                                      <ChevronDown />
                                    ) : (
                                      <ChevronRight />
                                    )}{" "}
                                    {flexRender(
                                      cell.column.columnDef.cell,
                                      cell.getContext()
                                    )}{" "}
                                    ({row.subRows.length})
                                  </Button>
                                ) : cell.column.id == "DTActions" ?
                                  (
                                    flexRender(
                                      cell.column.columnDef.cell,
                                      cell.getContext()
                                    )
                                  )
                                  : cell.getIsAggregated() ? (
                                    flexRender(
                                      cell.column.columnDef.aggregatedCell ??
                                      cell.column.columnDef.cell,
                                      cell.getContext()
                                    )
                                  ) :
                                    cell.getIsPlaceholder() ? null :
                                      (
                                        flexRender(
                                          cell.column.columnDef.cell,
                                          cell.getContext()
                                        )
                                      )}
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      ) : (
                        <TableRow key={row.id}
                          className={cx(
                            row.getIsSelected()
                              ? "bg-accent/10"
                              : "",

                          )}
                          {... (extraParams?.checkBoxColumn && { onClick: () => row.toggleSelected(!row.getIsSelected()) })}
                        >
                          {row.getVisibleCells().map((cell, index) => (
                            <TableCell key={cell.id}
                              className={cx(
                                row.getIsSelected()
                                  ? "relative"
                                  : "",
                                !(extraParams?.actionMenu || extraParams?.groupActionMenu) && "py-2"
                              )}

                            >
                              {index === 0 && row.getIsSelected() && (
                                <div className="absolute inset-y-0 left-0 w-0.5 bg-primary" />
                              )}
                              {cell.getIsPlaceholder()
                                ? null
                                : flexRender(
                                  cell.column.columnDef.cell,
                                  cell.getContext()
                                )}
                            </TableCell>
                          ))}
                        </TableRow>
                      )
                    )
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="h-24 text-center"
                      >
                        No results.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
                {extraParams?.footer && (
                  <TableFooter className="sticky bottom-0 bg-background">
                    {table.getFooterGroups().map((group) => (
                      <TableRow>
                        {group.headers.map((header) => (
                          <TableCell>
                            {header.isPlaceholder ? null : (
                              <div className="flex items-center">
                                {flexRender(
                                  header.column.columnDef.footer,
                                  header.getContext()
                                )}
                              </div>
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableFooter>
                )}
              </Table>
            </div>
          </div>
        </div>
        {(extraParams?.paginationBar == undefined ||
          extraParams.paginationBar) && (
            <DataTablePagination table={table} extraParams={extraParams} />
          )}
      </div>
    )
  );
}
