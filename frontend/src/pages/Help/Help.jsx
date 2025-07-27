import React from "react";
import styles from "./Help.module.css";

const Help = () => {
  return (
    <div className={styles.helpContainer}>
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Welcome to DigiLenz Help Center</h2>
        <p>
          DigiLenz is your comprehensive device monitoring and management
          solution. Here's everything you need to know about using our platform.
        </p>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Key Features</h3>
        <ul className={styles.featureList}>
          <li className={styles.featureItem}>
            <div className={styles.featureContent}>
              <h4>Dashboard Overview</h4>
              <p>
                Get a birds-eye view of all your devices, including active and
                inactive assets, device health scores, and critical metrics.
              </p>
            </div>
          </li>
          <li className={styles.featureItem}>
            <div className={styles.featureContent}>
              <h4>Asset Management</h4>
              <p>
                View and manage all your devices in one place. Monitor device
                status, health scores, and detailed system specifications.
              </p>
            </div>
          </li>
          <li className={styles.featureItem}>
            <div className={styles.featureContent}>
              <h4>Experience Score</h4>
              <p>
                Track device performance through our unique Experience Score,
                which considers CPU usage, memory utilization, and battery
                health.
              </p>
            </div>
          </li>
          <li className={styles.featureItem}>
            <div className={styles.featureContent}>
              <h4>Reports</h4>
              <p>
                Generate comprehensive reports about your device fleet,
                including health trends, usage patterns, and performance
                metrics.
              </p>
            </div>
          </li>
        </ul>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Understanding Device Health</h3>
        <ul className={styles.featureList}>
          <li className={styles.featureItem}>
            <div className={styles.featureContent}>
              <h4>Health Score Categories</h4>
              <p>
                - Excellent (85-100): Device is performing optimally
                <br />
                - Moderate (70-85): Device needs attention
                <br />- Critical (Below 70): Immediate attention required
              </p>
            </div>
          </li>
        </ul>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Need More Help?</h3>
        <p>
          If you need additional assistance or have specific questions, please
          contact our support team:
        </p>
        <ul className={styles.featureList}>
          <li className={styles.featureItem}>
            <div className={styles.featureContent}>
              <h4>Contact Support</h4>
              <p>rubesh.udayakumar@cdw.com</p>
              <p>charanraj.thiyagarajan@cdw.com</p>
              <p>ashok.natarajan@cdw.com</p>
              <p>saikishore.saravanan@cdw.com</p>
              <p>hariharan.muralidharan@cdw.com</p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Help;
