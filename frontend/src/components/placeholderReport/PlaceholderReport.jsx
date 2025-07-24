import React from "react";
import styles from "./PlaceholderReport.module.css";

const PlaceholderReport = () => {
  return (
    <div className={styles.placeholderCard}>
      <div className={styles.title}>Placeholder</div>
      <div className={styles.pieChart}></div>
      <div className={styles.legendRow}>
        <div className={styles.legendItem}>
          <span className={styles.legendColor} style={{ background: "#F9C74F" }}></span>
          <span className={styles.legendLabel}>a</span>
          <span className={styles.legendValue}>12,423</span>
        </div>
        <div className={styles.legendItem}>
          <span className={styles.legendColor} style={{ background: "#F8961E" }}></span>
          <span className={styles.legendLabel}>b</span>
          <span className={styles.legendValue}>12,423</span>
        </div>
        <div className={styles.legendItem}>
          <span className={styles.legendColor} style={{ background: "#14293D" }}></span>
          <span className={styles.legendLabel}>c</span>
          <span className={styles.legendValue}>12,423</span>
        </div>
        <div className={styles.legendItem}>
          <span className={styles.legendColor} style={{ background: "#5991DB" }}></span>
          <span className={styles.legendLabel}>d</span>
          <span className={styles.legendValue}>12,423</span>
        </div>
      </div>
    </div>
  );
};

export default PlaceholderReport;