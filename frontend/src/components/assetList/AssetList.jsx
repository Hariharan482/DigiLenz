import React, { useState, useEffect } from "react";
import AssetDetails from "../assetDetails/AssetDetails";
import styles from "../../pages/Asset/Asset.module.css";
import { BACKEND_BASE_URL } from "../../constants/ApiConstants";

const rowsPerPage = 8;

const AssetList = () => {
  const [page, setPage] = useState(1);
  const [assets, setAssets] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [assetDetails, setAssetDetails] = useState(false);
  const [selectedSerialNumber, setSelectedSerialNumber] = useState(null);

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const response = await fetch(
          `${BACKEND_BASE_URL}/assets/list?page=${page}&page_size=${rowsPerPage}`,
        );
        const data = await response.json();
        setAssets(data.assets);
        setTotalPages(data.total_pages);
      } catch (error) {
        console.error("Failed to fetch asset data:", error);
      }
    };

    fetchAssets();
  }, [page]);

  return (
    <div className={styles.assetTableWrapper}>
      <table className={styles.assetTable}>
        <thead>
          <tr>
            <th>Asset No</th>
            <th>Asset Name</th>
            <th>Product Name</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {assets.map((asset, id) => (
            <tr key={id}>
              <td>{asset.serial_number}</td>
              <td>{asset.host_name}</td>
              <td>{asset.product_name}</td>
              <td>
                <span className={styles.status}>
                  <span
                    className={
                      asset.status === "Active"
                        ? `${styles.statusDot} ${styles.active}`
                        : `${styles.statusDot} ${styles.inactive}`
                    }
                  ></span>
                  {asset.status}
                </span>
                <span className={styles.actionLinks}>
                  <div
                    className={styles.actionLink}
                    onClick={() => {
                      setSelectedSerialNumber(asset.serial_number);
                      setAssetDetails(true);
                    }}
                  >
                    Manage
                  </div>
                  <div className={styles.actionLink}>Notify</div>
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className={styles.paginationWrapper}>
        <button
          className={styles.paginationBtn}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          &#60;
        </button>
        <span className={styles.paginationDot}></span>
        <button
          className={styles.paginationBtn}
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
        >
          &#62;
        </button>
      </div>

      {/* Asset Details Modal */}
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
