import React, { useMemo } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";

export default function AssetScoreList({ devices }) {
  const getScoreStyle = (score) => {
    if (score >= 85) {
      return { backgroundColor: "#10b98149", color: "#0b8059ff" }; // Green
    } else if (score >= 70) {
      return { backgroundColor: "#f59f0b69", color: "#996408ff" }; // Yellow
    } else {
      return { backgroundColor: "#ef444461", color: "#731f1fff" }; // Red
    }
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "serial_number",
        header: "Device ID",
        size: 120,
      },
      {
        accessorKey: "product_name",
        header: "Device Name",
        size: 150,
      },
      {
        accessorKey: "host_name",
        header: "Host Name",
        size: 150,
      },
      {
        accessorKey: "average_cpu",
        header: "CPU Score",
        size: 20,
        Cell: ({ cell }) => (
          <span style={getScoreStyle(cell.getValue())}>
            {Math.round(cell.getValue())}
          </span>
        ),
      },
      {
        accessorKey: "average_memory",
        header: "RAM Score",
        size: 20,
        Cell: ({ cell }) => (
          <span style={getScoreStyle(cell.getValue())}>
            {Math.round(cell.getValue())}
          </span>
        ),
      },
      {
        accessorKey: "average_battery",
        header: "Disk Score",
        size: 20,
        Cell: ({ cell }) => (
          <span style={getScoreStyle(cell.getValue())}>
            {Math.round(cell.getValue())}
          </span>
        ),
      },
      {
        accessorKey: "health_score",
        header: "Overall Score",
        size: 20,
        Cell: ({ cell }) => (
          <span style={getScoreStyle(cell.getValue())}>
            {Math.round(cell.getValue())}
          </span>
        ),
      },
      {
        accessorKey: "last_active",
        header: "Last Active",
        size: 160,
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
    enableSorting: true,
    enableFiltering: true,
    enablePagination: true,
    initialState: { pagination: { pageSize: 5, pageIndex: 0 } },
    muiTablePaginationProps: {
      rowsPerPageOptions: [5],
    },
  });

  return <MaterialReactTable table={table} />;
}
