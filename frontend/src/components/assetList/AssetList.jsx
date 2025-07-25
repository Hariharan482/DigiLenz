import React, { use } from "react";
import { useState, useEffect } from "react";
import { mockData } from "../../constants/AssetData";
import AssetDetails from "../assetDetails/AssetDetails";
import styles from "../../pages/Asset/Asset.module.css";
import getData from "../../services/GetData";
import { assetListAPI } from "../../constants/ApiConstants";

const rowsPerPage = 8;

const AssetList = () => {
  const [page, setPage] = useState(1);
  const [assetDetails, setAssetDetails] = useState(false);
  const [assetList, setAssetList] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const totalPages = Math.ceil(mockData.length / rowsPerPage);
  const startId = (page - 1) * rowsPerPage;
  const pageData = mockData.slice(startId, startId + rowsPerPage);

  useEffect(() => {
    setLoading(true);
    getData(assetListAPI + "page=1&page_size=10")
      .then((APIdata) => {
        if (!APIdata.ok) {
          throw new Error("HTTP error");
        } else {
          return APIdata.json();
        }
      })
      .then((res_data) => {
        setAssetList(res_data);
        setLoading(false);
        setError(false);
      })
      .catch((error) => {
        console.log(error);
        console.error("Error fetching asset data:", error);
        setLoading(false);
        setError(true);
      });
  }, []);

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
          {pageData.map((row, id) => (
            <tr key={id}>
              <td>{row.assetNo}</td>
              <td>{row.assetName}</td>
              <td>{row.productName}</td>
              <td>
                <span className={styles.status}>
                  <span
                    className={
                      row.status === "Active"
                        ? `${styles.statusDot} ${styles.active}`
                        : `${styles.statusDot} ${styles.inactive}`
                    }
                  ></span>
                  {row.status}
                </span>
                <span className={styles.actionLinks}>
                  <div
                    className={styles.actionLink}
                    onClick={() => setAssetDetails(true)}
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
      {assetDetails && (
        <div className={styles["asset-details-background"]}>
          <div
            className={styles["asset-details-background"]}
            onClick={() => setAssetDetails(false)}
          ></div>{" "}
          <AssetDetails close={() => setAssetDetails(false)} />{" "}
        </div>
      )}
    </div>
  );
};

export default AssetList;
