import React, { useState, useMemo } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { Box } from "@mui/material";
import AssetDetails from "../assetDetails/AssetDetails";
import styles from "../../pages/Asset/Asset.module.css";

const AssetList = ({ assets, page, setPage, totalPages }) => {
  const [assetDetails, setAssetDetails] = useState(false);
  const [selectedSerialNumber, setSelectedSerialNumber] = useState(null);

  const columns = useMemo(
    () => [
      {
        accessorKey: "serial_number",
        header: "Asset No",
        size: 150,
        enableColumnFilter: true,
        filterFn: "contains",
      },
      {
        accessorKey: "host_name",
        header: "Asset Name",
        size: 200,
        enableColumnFilter: true,
        filterFn: "contains",
      },
      {
        accessorKey: "product_name",
        header: "Product Name",
        size: 200,
        enableColumnFilter: true,
        filterFn: "contains",
      },
      {
        accessorKey: "status",
        header: "Status",
        size: 120,
        enableColumnFilter: true,
        filterVariant: "select",
        filterSelectOptions: ["Active", "Inactive"],
        Cell: ({ cell }) => (
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                backgroundColor:
                  cell.getValue() === "Active" ? "#1ecb4f" : "#e13b3b",
              }}
            />
            <span style={{ fontSize: "0.875rem", fontWeight: "500" }}>
              {cell.getValue()}
            </span>
          </Box>
        ),
      },
      {
        id: "actions",
        header: "Actions",
        size: 100,
        enableColumnFilter: false,
        enableSorting: false,
        Cell: ({ row }) => (
          <div
            style={{
              color: "#3b8ee1",
              cursor: "pointer",
              textDecoration: "none",
              fontWeight: "500",
            }}
            onClick={() => {
              setSelectedSerialNumber(row.original.serial_number);
              setAssetDetails(true);
            }}
          >
            Manage
          </div>
        ),
      },
    ],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data: assets || [],
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
    rowCount: totalPages ? totalPages * 10 : assets?.length || 0,
    state: {
      pagination: {
        pageIndex: page - 1,
        pageSize: 10,
      },
    },
    onPaginationChange: (updater) => {
      if (typeof updater === "function") {
        const currentPagination = { pageIndex: page - 1, pageSize: 10 };
        const newPagination = updater(currentPagination);
        const newPage = newPagination.pageIndex + 1;

        if (newPage !== page) {
          setPage(newPage);
        }
      }
    },
    muiTableProps: {
      sx: {
        "& .MuiTableHead-root": {
          backgroundColor: "#F3E0DF",
        },
        "& .MuiTableHead-root .MuiTableCell-root": {
          color: "#3d2323",
          fontWeight: "bold",
          padding: "12px 12px",
        },
        "& .MuiTableBody-root .MuiTableRow-root": {
          backgroundColor: "#fff",
          border: "1px solid #f3e0e0",
          "&:hover": {
            backgroundColor: "#f9f9f9",
          },
          "&:last-child": {
            borderBottom: "none",
          },
        },
        "& .MuiTableCell-root": {
          color: "#3d2323",
          padding: "8px 12px",
          fontSize: "1rem",
          verticalAlign: "middle",
        },
      },
    },
    muiTableContainerProps: {
      sx: {
        backgroundColor: "#fff",
        boxShadow: "0 2px 8px 0 rgba(0,0,0,0.1)",
        overflow: "scroll",
      },
    },
    muiTopToolbarProps: {
      sx: {
        backgroundColor: "#F3E0DF",
        borderRadius: "16px 16px 0 0",
        "& .MuiInputBase-root": {
          backgroundColor: "#f9f9f9",
          "&:hover": {
            backgroundColor: "#f5f5f5",
          },
        },
      },
    },
    muiBottomToolbarProps: {
      sx: {
        backgroundColor: "#f3e0e0",
        borderRadius: "0 0 16px 16px",
        "& .MuiToolbar-root": {
          minHeight: "56px",
          padding: "18px 16px 10px 16px",
        },
      },
    },
    muiTablePaginationProps: {
      sx: {
        "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows":
          {
            color: "#3d2323",
            fontWeight: "500",
          },
        "& .MuiIconButton-root": {
          color: "#e13b3b",
          fontSize: "1.5rem",
          "&.Mui-disabled": {
            color: "#e0bcbc",
          },
          "&:hover": {
            backgroundColor: "rgba(225, 59, 59, 0.1)",
          },
        },
        "& .MuiSelect-select": {
          color: "#3d2323",
        },
      },
    },
    muiFilterTextFieldProps: {
      sx: {
        "& .MuiInputBase-root": {
          backgroundColor: "#fff",
          "&:hover": {
            backgroundColor: "#f9f9f9",
          },
        },
      },
    },
    muiSelectProps: {
      sx: {
        "& .MuiInputBase-root": {
          backgroundColor: "#fff",
          "&:hover": {
            backgroundColor: "#f9f9f9",
          },
        },
      },
    },
  });

  return (
    <div className={styles.assetTableWrapper}>
      <MaterialReactTable table={table} />

      {assetDetails && (
        <div className={styles["asset-details-background"]}>
          <div
            className={styles["asset-details-background"]}
            onClick={() => setAssetDetails(false)}
          ></div>
          <AssetDetails
            close={() => setAssetDetails(false)}
            serialNumber={selectedSerialNumber}
          />
        </div>
      )}
    </div>
  );
};

export default AssetList;
