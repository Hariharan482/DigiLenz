import React, { useEffect, useState } from "react";
import styles from "./AssetsNotDiscovered.module.css";
import { BACKEND_BASE_URL, ROUTE_CONSTANTS } from "../../constants/ApiConstants";

const AssetsNotDiscovered = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const fetchInactiveCount = async () => {
      try {
        const response = await fetch(`${BACKEND_BASE_URL}${ROUTE_CONSTANTS.IN_ACTIVE_COUNT}`);
        const data = await response.json();
        setCount(data.inactive_count || 0);
      } catch (error) {
        console.error("Failed to fetch inactive asset count:", error);
      }
    };

    fetchInactiveCount();
  }, []);

  return (
    <div className={styles.assetsCard}>
      <div className={styles.title}>Active Assets - Not discovered</div>
      <div className={styles.count}>{count}</div>
    </div>
  );
};

export default AssetsNotDiscovered;
