import React, { useMemo } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";

export default function AssetScoreList({ devices, page, setPage, totalPages }) {
  const getScoreStyle = (score) => {
    if (score >= 85) {
      return {
        backgroundColor: "#10b98149",
        color: "#0b8059ff",
        padding: "4px 8px",
        borderRadius: "4px",
        fontWeight: "500",
      }; // Green
    } else if (score >= 70) {
      return {
        backgroundColor: "#f59f0b69",
        color: "#996408ff",
        padding: "4px 8px",
        borderRadius: "4px",
        fontWeight: "500",
      }; // Yellow
    } else {
      return {
        backgroundColor: "#ef444461",
        color: "#731f1fff",
        padding: "4px 8px",
        borderRadius: "4px",
        fontWeight: "500",
      }; // Red
    }
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "serial_number",
        header: "Device ID",
        size: 120,
        enableColumnFilter: true,
        filterFn: "contains",
      },
      {
        accessorKey: "product_name",
        header: "Device Name",
        size: 150,
        enableColumnFilter: true,
        filterFn: "contains",
      },
      {
        accessorKey: "host_name",
        header: "Host Name",
        size: 150,
        enableColumnFilter: true,
        filterFn: "contains",
      },
      {
        accessorKey: "average_cpu",
        header: "CPU Score",
        size: 120,
        enableColumnFilter: true,
        filterVariant: "range",
        Cell: ({ cell }) => (
          <span
            style={{
              ...getScoreStyle(cell.getValue() || 0),
              fontSize: "0.75rem",
            }}
          >
            {Math.round(cell.getValue() || 0)}
          </span>
        ),
      },
      {
        accessorKey: "average_memory",
        header: "RAM Score",
        size: 120,
        enableColumnFilter: true,
        filterVariant: "range",
        Cell: ({ cell }) => (
          <span
            style={{
              ...getScoreStyle(cell.getValue() || 0),
              fontSize: "0.75rem",
            }}
          >
            {Math.round(cell.getValue() || 0)}
          </span>
        ),
      },
      {
        accessorKey: "average_battery",
        header: "Disk Score",
        size: 120,
        enableColumnFilter: true,
        filterVariant: "range",
        Cell: ({ cell }) => (
          <span
            style={{
              ...getScoreStyle(cell.getValue() || 0),
              fontSize: "0.75rem",
            }}
          >
            {Math.round(cell.getValue() || 0)}
          </span>
        ),
      },
      {
        accessorKey: "health_score",
        header: "Overall Score",
        size: 130,
        enableColumnFilter: true,
        filterVariant: "range",
        Cell: ({ cell }) => (
          <span style={getScoreStyle(cell.getValue() || 0)}>
            {Math.round(cell.getValue() || 0)}
          </span>
        ),
      },
      {
        accessorKey: "last_active",
        header: "Last Active",
        size: 160,
        enableColumnFilter: true,
        filterVariant: "date-range",
        Cell: ({ cell }) => {
          const value = cell.getValue();
          return value
            ? new Date(value).toLocaleDateString("en-US", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              })
            : "N/A";
        },
      },
    ],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data: devices || [],
    enableColumnFilters: true,
    enableGlobalFilter: true,
    enableSorting: true,
    enablePagination: true,
    enableRowSelection: false,
    enableColumnActions: true,
    enableColumnFilterModes: true,
    enableDensityToggle: false,
    enableFullScreenToggle: false,
    enableHiding: true,
    initialState: {
      showColumnFilters: false,
      showGlobalFilter: true,
    },
    manualPagination: true,
    pageCount: Math.max(totalPages || 1, 1),
    rowCount: totalPages ? totalPages * 10 : devices?.length || 0,
    state: {
      pagination: {
        pageIndex: page - 1,
        pageSize: 10,
      },
    },
    onPaginationChange: (updater) => {
      const currentPagination = { pageIndex: page - 1, pageSize: 10 };

      let newPagination;
      if (typeof updater === "function") {
        newPagination = updater(currentPagination);
      } else {
        newPagination = updater;
      }

      const newPage = newPagination.pageIndex + 1;
      if (newPage !== page && newPage >= 1) {
        setPage(newPage);
      }
    },
    muiTableProps: {
      sx: {
        "& .MuiTableHead-root": {
          backgroundColor: "#f8fafc",
        },
        "& .MuiTableHead-root .MuiTableCell-root": {
          color: "#374151",
          fontWeight: "bold",
          padding: "12px 8px",
        },
        "& .MuiTableBody-root .MuiTableRow-root": {
          backgroundColor: "#fff",
          borderBottom: "1px solid #e5e7eb",
          "&:hover": {
            backgroundColor: "#f9fafb",
          },
          "&:last-child": {
            borderBottom: "none",
          },
        },
        "& .MuiTableCell-root": {
          color: "#374151",
          padding: "8px 8px",
          fontSize: "0.875rem",
          verticalAlign: "middle",
        },
      },
    },
    muiTableContainerProps: {
      sx: {
        backgroundColor: "#fff",
        borderRadius: "12px",
        boxShadow:
          "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
        overflow: "hidden",
        maxHeight: "450px",
        height: "450px",
      },
    },
    muiTopToolbarProps: {
      sx: {
        backgroundColor: "#fff",
        borderRadius: "12px 12px 0 0",
        "& .MuiInputBase-root": {
          backgroundColor: "#f9fafb",
          "&:hover": {
            backgroundColor: "#f3f4f6",
          },
        },
      },
    },
    muiBottomToolbarProps: {
      sx: {
        backgroundColor: "#f8fafc",
        borderRadius: "0 0 12px 12px",
        "& .MuiToolbar-root": {
          minHeight: "56px",
          padding: "16px",
        },
      },
    },
    muiTablePaginationProps: {
      rowsPerPageOptions: [2, 5, 10],
      sx: {
        "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows":
          {
            color: "#374151",
            fontWeight: "500",
          },
        "& .MuiIconButton-root": {
          color: "#6366f1",
          fontSize: "1.25rem",
          "&.Mui-disabled": {
            color: "#d1d5db",
          },
          "&:hover": {
            backgroundColor: "rgba(99, 102, 241, 0.1)",
          },
        },
        "& .MuiSelect-select": {
          color: "#374151",
        },
      },
    },
    muiFilterTextFieldProps: {
      sx: {
        "& .MuiInputBase-root": {
          backgroundColor: "#fff",
          "&:hover": {
            backgroundColor: "#f9fafb",
          },
        },
      },
    },
    muiSelectProps: {
      sx: {
        "& .MuiInputBase-root": {
          backgroundColor: "#fff",
          "&:hover": {
            backgroundColor: "#f9fafb",
          },
        },
      },
    },
  });

  return <MaterialReactTable table={table} />;
}
