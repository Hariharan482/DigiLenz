import React from "react";
import style from "./AssetScoreList.module.css";

export default function AssetScoreList({ devices }) {
  const getScoreStyle = (score) => {
    if (score >= 85) {
      return { backgroundColor: "#10b98149", color: "#0b8059ff" }; // Green for excellent
    } else if (score >= 70) {
      return { backgroundColor: "#f59f0b69", color: "#996408ff" }; // Yellow for good
    } else {
      return { backgroundColor: "#ef444461", color: "#731f1fff" }; // Red for poor
    }
  };

  return (
    <div className={style["list-table-container"]}>
      <div className={style["list-table"]}>
        <div
          className={`${style["list-table-header"]} ${style["wide-column"]}`}
        >
          Device ID
        </div>
        <div className={style["list-table-header"]}>Device Name</div>
        <div className={style["list-table-header"]}>Host Name</div>
        <div className={style["list-table-header"]}>CPU Score</div>
        <div className={style["list-table-header"]}>RAM Score</div>
        <div className={style["list-table-header"]}>Disk Score</div>
        <div className={style["list-table-header"]}>Overall Score</div>
        <div className={style["list-table-header"]}>Last Active</div>
      </div>

      {devices.length &&
        devices.map((device, index) => (
          <div className={style["table-row"]} key={index}>
            <div
              className={`${style["row-device-data"]} ${style["wide-column"]}`}
            >
              {device.serial_number}
            </div>
            <div className={style["row-device-data"]}>
              {device.product_name}
            </div>
            <div className={style["row-device-data"]}>{device.host_name}</div>
            <div className={style["row-score-data"]}>
              <span
                className={style["score"]}
                style={getScoreStyle(device.average_cpu)}
              >
                {Math.round(device.average_cpu)}
              </span>
            </div>
            <div className={style["row-score-data"]}>
              <span
                className={style["score"]}
                style={getScoreStyle(device.average_memory)}
              >
                {Math.round(device.average_memory)}
              </span>
            </div>
            <div className={style["row-score-data"]}>
              <span
                className={style["score"]}
                style={getScoreStyle(device.average_battery)}
              >
                {Math.round(device.average_battery)}
              </span>
            </div>
            <div className={style["row-score-data"]}>
              <span
                className={style["score"]}
                style={getScoreStyle(device.health_score)}
              >
                {Math.round(device.health_score)}
              </span>
            </div>
            <div className={style["row-device-data"]}>
              {device.last_active
                ? new Date(device.last_active).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  })
                : "N/A"}
            </div>
          </div>
        ))}
    </div>
  );
}
