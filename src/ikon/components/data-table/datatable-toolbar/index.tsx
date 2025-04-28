import { Fragment } from "react";
import { DTToolBarProps } from "../type";
import DataTableFilterMenu from "../datatable-filter-menu";
import DataTableColumnFilter from "../datatable-column-filter";
import SearchInput from "../../search-input";

function DataTableToolbar<TData>({
  table,
  extraParams,
}: DTToolBarProps<TData>) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex-grow flex items-center justify-between gap-3 overflow-hidden">
        {(extraParams?.defaultTools == undefined ||
          extraParams?.defaultTools == true ||
          (Array.isArray(extraParams?.defaultTools) &&
            extraParams?.defaultTools?.includes("search"))) && (
          <SearchInput
            placeholder="Search ..."
            onChange={(event: any) => table.setGlobalFilter(event.target.value)}
            className="max-w-sm"
          />
        )}
        {(extraParams?.defaultTools == undefined ||
          extraParams?.defaultTools == true ||
          (Array.isArray(extraParams?.defaultTools) &&
            extraParams?.defaultTools?.includes("filter"))) && (
          <DataTableFilterMenu table={table} />
        )}
      </div>
      <div className="flex gap-3">
        {extraParams?.extraTools?.map((tool: any, index: number) => (
          <Fragment key={index}>{tool}</Fragment>
        ))}
        {(extraParams?.defaultTools == undefined ||
          extraParams?.defaultTools == true ||
          (Array.isArray(extraParams?.defaultTools) &&
            extraParams?.defaultTools?.includes("columnFilter"))) && (
          <DataTableColumnFilter table={table} />
        )}
      </div>
    </div>
  );
}

export default DataTableToolbar;
