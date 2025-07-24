import React from "react";
import styles from "./DeviceHealthSummary.module.css";

const DeviceHealthSummary = ({
  avgAge = 3.5,
  avgScore = 92,
  avgCpu = 47,
  belowThreshold = 25,
}) => {
  return (
    <div className={styles.summaryCard}>
      <h2 className={styles.title}>&nbsp;&nbsp;  Device Health Summary</h2>
      <div className={styles.gridContainer}>
        <div className={styles.metric}>
          <span className={styles.label}>Avg. Age of Devices</span>
          <span className={styles.underlineBlue}></span>
          <span className={styles.value}>{avgAge} Years</span>
        </div>
        <div className={styles.metric}>
          <span className={styles.label}>Avg. Score for Devices</span>
          <span className={styles.underlineGreen}></span>
          <span className={styles.value}>{avgScore}</span>
        </div>
        <div className={styles.metric}>
          <span className={styles.label}>Avg. CPU Utilization</span>
          <span className={styles.underlineRed}></span>
          <span className={styles.value}>{avgCpu}%</span>
        </div>
        <div className={styles.metric}>
          <span className={styles.label}>% of Devices Below Score Threshold</span>
          <span className={styles.underlineYellow}></span>
          <span className={styles.value}>{belowThreshold}%</span>
        </div>
        <div className={styles.centerRing}></div>
      </div>
    </div>
  );
};

export default DeviceHealthSummary;
