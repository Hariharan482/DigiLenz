import React from "react";
import styles from "./AssetsNotDiscovered.module.css";

const AssetsNotDiscovered = ({ count = 5 }) => {
  return (
    <div className={styles.assetsCard}>
      <div className={styles.title}>Active Assets - Not discovered</div>
      <div className={styles.count}>{count}</div>
    </div>
  );
};

export default AssetsNotDiscovered;