import React, { useEffect, useState } from "react";
import styles from "./DeviceHealthSummary.module.css";
import { BACKEND_BASE_URL, ROUTE_CONSTANTS } from "../../constants/ApiConstants";

const DeviceHealthSummary = () => {
  const [summaryData, setSummaryData] = useState({
    avgAge: 0,
    avgScore: 0,
    avgCpu: 0,
    belowThreshold: 0,
  });

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await fetch(`${BACKEND_BASE_URL}${ROUTE_CONSTANTS.ASSET_HEALTH_SUMMARY}?score_threshold=25`);
        const data = await response.json();

        setSummaryData({
          avgAge: data.AvgAgeYears || 0,
          avgScore: data.AvgHealthScore || 0,
          avgCpu: data.AvgCPUUtilizationPercent || 0,
          belowThreshold: data.PercentDevicesBelowScoreThreshold || 0,
        });
      } catch (error) {
        console.error("Error fetching health summary:", error);
      }
    };

    fetchSummary();
  }, []);

  return (
    <div className={styles.summaryCard}>
      <h2 className={styles.title}>&nbsp;&nbsp; Device Health Summary</h2>
      <div className={styles.gridContainer}>
        <div className={styles.metric}>
          <span className={styles.label}>Avg. Age of Devices</span>
          <span className={styles.underlineBlue}></span>
          <span className={styles.value}>{summaryData.avgAge.toFixed(1)} Years</span>
        </div>
        <div className={styles.metric}>
          <span className={styles.label}>Avg. Score for Devices</span>
          <span className={styles.underlineGreen}></span>
          <span className={styles.value}>{Math.round(summaryData.avgScore)}</span>
        </div>
        <div className={styles.metric}>
          <span className={styles.label}>Avg. CPU Utilization</span>
          <span className={styles.underlineRed}></span>
          <span className={styles.value}>{summaryData.avgCpu.toFixed(1)}%</span>
        </div>
        <div className={styles.metric}>
          <span className={styles.label}>% of Devices Below Score Threshold</span>
          <span className={styles.underlineYellow}></span>
          <span className={styles.value}>{summaryData.belowThreshold.toFixed(1)}%</span>
        </div>
        <div className={styles.centerRing}></div>
      </div>
    </div>
  );
};

export default DeviceHealthSummary;
