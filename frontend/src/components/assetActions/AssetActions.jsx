import React, { useState } from "react";
import styles from "../../pages/Asset/Asset.module.css";
import downloadExcel from "../../services/DownloadExcel";
import { BACKEND_BASE_URL,ROUTE_CONSTANTS } from "../../constants/ApiConstants";

const AssetActions = ({active,inactive}) => {
  const [loading, setLoading] = useState(false);

  const fetchAllAssetsAndDownload = async () => {
    const baseUrl = `${BACKEND_BASE_URL}${ROUTE_CONSTANTS.ASSET_LIST}`;
    const pageSize = 10;
    let allAssets = [];
    let page = 1;
    let totalPages = 1;

    try {
      setLoading(true);

      do {
        const response = await fetch(`${baseUrl}?page=${page}&page_size=${pageSize}`);
        const result = await response.json();

        if (Array.isArray(result.assets)) {
          allAssets = [...allAssets, ...result.assets];
        }

        totalPages = result.total_pages;
        page++;
      } while (page <= totalPages);

      downloadExcel(allAssets);
    } catch (error) {
      console.error("Failed to download asset report:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.assetSummaryContainer}>
      <div className={styles.assetCard}>
        <span>ACTIVE ASSETS</span>
        <span>{active}</span>
      </div>
      <div className={`${styles.assetCard} ${styles.inactive}`}>
        <span>IN ACTIVE ASSETS</span>
        <span>{inactive}</span>
      </div>
      <div
        className={`${styles.assetCard} ${styles.download}`}
        onClick={fetchAllAssetsAndDownload}
      >
        <span>{loading ? "DOWNLOADING..." : "DOWNLOAD REPORT (.XLS)"}</span>
      </div>
    </div>
  );
};

export default AssetActions;
