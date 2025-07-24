import { useState } from "react";
import { mockData } from "../../constants/AssetData";
import styles from "../../pages/Asset/Asset.module.css";

const rowsPerPage = 8;

const AssetList = () => {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(mockData.length / rowsPerPage);
  const startId = (page - 1) * rowsPerPage;
  const pageData = mockData.slice(startId, startId + rowsPerPage);

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
                  <a className={styles.actionLink}>Manage</a>
                  <a className={styles.actionLink}>Notify</a>
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
    </div>
  );
};

export default AssetList;
