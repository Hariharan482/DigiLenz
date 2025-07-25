import React from "react";
import styles from "../../pages/Asset/Asset.module.css";
import { mockData } from "../../constants/AssetData";
import downloadExcel from "../../services/DownloadExcel";

const AssetActions = () => {
  return (
    <div className={styles.assetSummaryContainer}>
      <div className={styles.assetCard}>
        <span>ACTIVE ASSETS</span>
        <span>203</span>
      </div>
      <div className={`${styles.assetCard} ${styles.inactive}`}>
        <span>IN ACTIVE ASSETS</span>
        <span>203</span>
      </div>
      <div className={`${styles.assetCard} ${styles.download}`} onClick={() => downloadExcel(mockData)}>
        <span>DOWNLOAD REPORT (.XLS)</span>
      </div>
    </div>
  );
};

export default AssetActions;
