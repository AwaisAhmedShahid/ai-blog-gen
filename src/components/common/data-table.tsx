import { Table as TableType, flexRender } from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui";
import LoaderBody from "./table-loader";
import { PaginationsParams } from "../ui/table-paginationt";

interface DataTableProps<TData> {
  loading?: boolean;
  table: TableType<TData>;
  total: number;
}

export function DataTable<TData>({ loading = false, total, table }: DataTableProps<TData>) {
  const renderNoData = () => (
    <TableRow>
      <TableCell colSpan={table.getHeaderGroups()[0].headers.length}>
        <div className="flex h-32 flex-col items-center justify-center text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="45"
            height="45"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-grid-2x2-x"
          >
            <path d="M12 3v17a1 1 0 0 1-1 1H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6a1 1 0 0 1-1 1H3" />
            <path d="m16 16 5 5" />
            <path d="m16 21 5-5" />
          </svg>
          <span className="text-xs font-semibold dark:text-slate-200 text-slate-500">No Data</span>
        </div>
      </TableCell>
    </TableRow>
  );

  const renderData = () => {
    if (loading) {
      return <LoaderBody columnsLength={table.getHeaderGroups()[0].headers.length} />;
    }
    if (table.getRowModel().rows.length === 0) {
      return renderNoData();
    }
    return (
      <>
        {table.getRowModel().rows.map((row) => (
          <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
            {row.getVisibleCells().map((cell) => (
              <TableCell key={cell.id} className="px-4 text-left">
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </>
    );
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-md border">
        <Table className="border-y border-border">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    style={{ width: header.column.getSize() }} // Apply the column width dynamically
                  >
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>{renderData()}</TableBody>
        </Table>
      </div>

      <span className="flex items-center justify-between space-x-2 py-4 mx-4">
        <div>
          <div className="text-xs text-muted-foreground">
            Total <strong>{table.getFilteredRowModel().rows.length}</strong> of <strong>{total}</strong> records
          </div>
        </div>
        <div>
          <PaginationsParams count={total} />
        </div>
      </span>
    </div>
  );
}
