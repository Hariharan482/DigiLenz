import React, { useState, useEffect } from "react";
import style from "./AssetDetails.module.css";
import {
  BACKEND_BASE_URL,
  ROUTE_CONSTANTS,
} from "../../constants/ApiConstants";
import { formatToHumanReadable } from "../../utils/Utils";

export default function AssetDetails({ close, serialNumber }) {
  const [activeTab, setActiveTab] = useState("Details");
  const [assetData, setAssetData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openAccordionIndex, setOpenAccordionIndex] = useState(null);

  const tabs = ["Details", "Fetch History"];

  useEffect(() => {
    async function fetchAssetDetails() {
      try {
        setLoading(true);
        const response = await fetch(
          `${BACKEND_BASE_URL}${ROUTE_CONSTANTS.ASSETS}/${serialNumber}`
        );
        if (!response.ok) throw new Error("Failed to fetch asset details");
        const data = await response.json();
        setAssetData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchAssetDetails();
  }, [serialNumber]);

  if (loading) return <div className={style["asset-details"]}>Loading...</div>;
  if (error)
    return <div className={style["asset-details"]}>Error: {error}</div>;
  if (!assetData) return null;

  const {
    device_name,
    hostname,
    average_cpu,
    average_battery,
    average_memory,
    health_score,
    metrics_history = [],
    system_specs,
    uptime,
    ...rest
  } = assetData;

  return (
    <div className={style["asset-details"]}>
      {/* Header */}
      <div className={style["header"]}>
        <div className={style["header-content"]}>
          <div className={style["device-icon"]}>
            <svg width="48" height="32" viewBox="0 0 48 32" fill="none">
              <rect
                x="6"
                y="2"
                width="36"
                height="22"
                rx="2"
                fill="none"
                stroke="white"
                strokeWidth="2"
              />
              <rect x="0" y="26" width="48" height="4" rx="2" fill="white" />
              <circle cx="24" cy="28" r="1.5" fill="#374151" />
            </svg>
          </div>
          <div className={style["device-info"]}>
            <div className={style["device-name"]}>{device_name}</div>
            <p className={style["mac-address"]}>{hostname}</p>
          </div>
          <span className={style["material-symbols-outlined"]} onClick={close}>
            close
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className={style["tab-container"]}>
        <div className={style["tab-navigation"]}>
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={style["tab-button"]}
              style={{
                backgroundColor: activeTab === tab ? "#DC2626" : "transparent",
                color: activeTab === tab ? "#ffffff" : "#6B7280",
                borderBottom:
                  activeTab === tab
                    ? "3px solid #DC2626"
                    : "3px solid transparent",
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className={style["content-area"]}>
        {activeTab === "Details" && (
          <div>
            {/* Metrics Row */}
            <div className={style["metrics-row"]}>
              <div className={style["metrics-left"]}>
                <div className={style["metrics-container"]}>
                  <div className={style["metrics-icon"]}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <rect
                        x="3"
                        y="3"
                        width="18"
                        height="18"
                        rx="2"
                        stroke="white"
                        strokeWidth="2"
                      />
                      <rect
                        x="7"
                        y="7"
                        width="10"
                        height="10"
                        rx="1"
                        fill="white"
                      />
                      <path
                        d="M9 1v2M15 1v2M9 21v2M15 21v2M1 9h2M1 15h2M21 9h2M21 15h2"
                        stroke="white"
                        strokeWidth="1.5"
                      />
                    </svg>
                  </div>
                  <div className={style["metrics-value"]}>
                    Average CPU Usage - {Math.round(average_cpu) ?? "N/A"}%
                  </div>
                </div>
                <div className={style["metrics-container"]}>
                  <div className={style["metrics-icon"]}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <rect
                        x="2"
                        y="6"
                        width="16"
                        height="12"
                        rx="2"
                        stroke="white"
                        strokeWidth="2"
                      />
                      <rect
                        x="4"
                        y="8"
                        width="10"
                        height="8"
                        rx="1"
                        fill="white"
                      />
                      <rect
                        x="20"
                        y="9"
                        width="2"
                        height="6"
                        rx="1"
                        fill="white"
                      />
                      <path
                        d="M6 10h6M6 12h4"
                        stroke="#1F2937"
                        strokeWidth="1.5"
                      />
                    </svg>
                  </div>
                  <div className={style["metrics-value"]}>
                    Average Battery - {Math.round(average_battery) ?? "N/A"}%
                  </div>
                </div>
                <div className={style["metrics-container"]}>
                  <div className={style["metrics-icon"]}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <rect
                        x="3"
                        y="3"
                        width="18"
                        height="18"
                        rx="2"
                        stroke="white"
                        strokeWidth="2"
                      />
                      <rect
                        x="7"
                        y="7"
                        width="10"
                        height="10"
                        rx="1"
                        fill="white"
                      />
                      <path
                        d="M12 7v6M9 10h6"
                        stroke="#1F2937"
                        strokeWidth="1.5"
                      />
                    </svg>
                  </div>
                  <div className={style["metrics-value"]}>
                    Average Memory - {Math.round(average_memory) ?? "N/A"}%
                  </div>
                </div>
              </div>
              <div className={style["metrics-right"]}>
                <div className={style["health-score-container"]}>
                  <div className={style["health-score-title"]}>
                    Health Score
                  </div>
                  <div className={style["score-meter-1"]}>
                    <div className={style["scorer-1-inner-div"]}>
                      <div className={style["scorer-1-inner-div-5"]}>
                        <div
                          className={style["scorer-1-tick"]}
                          style={{
                            transform: `rotate(${
                              ((health_score || 0) / 100) * 180
                            }deg)`,
                            transformOrigin: "right center",
                          }}
                        ></div>
                      </div>
                    </div>
                    <div className={style["scorer-1-inner-div-2"]}></div>
                    <div className={style["scorer-1-inner-div-3"]}></div>
                    <div className={style["scorer-1-inner-div-4"]}></div>
                  </div>
                  <div className={style["health-score-value"]}>
                    {Math.round(health_score) || 0}%
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Details */}
            <div className={style["additional-details-container"]}>
              <div className={style["additional-details-table"]}>
                {Object.entries(rest).map(([key, value]) => (
                  <div className={style["additional-details-row"]} key={key}>
                    <div className={style["additional-details-label"]}>
                      {key
                        .replace(/_/g, " ")
                        .replace(/\b\w/g, (c) => c.toUpperCase())}
                    </div>
                    <div className={style["additional-details-value"]}>
                      {typeof value === "object" && value !== null
                        ? Object.entries(value).map(([subKey, subValue]) => (
                            <div key={subKey}>
                              <strong>{subKey.replace(/_/g, " ")}:</strong>{" "}
                              {subValue?.toString()}
                            </div>
                          ))
                        : value?.toString()}
                    </div>
                  </div>
                ))}

                {/* System Specs */}
                {system_specs &&
                  Object.entries(system_specs).map(([key, value]) => (
                    <div className={style["additional-details-row"]} key={key}>
                      <div className={style["additional-details-label"]}>
                        {key
                          .replace(/_/g, " ")
                          .replace(/\b\w/g, (c) => c.toUpperCase())}
                      </div>
                      <div className={style["additional-details-value"]}>
                        {typeof value === "object" && value !== null
                          ? Object.entries(value).map(([subKey, subValue]) => (
                              <div key={subKey}>
                                <strong>{subKey.replace(/_/g, " ")}:</strong>{" "}
                                {subValue?.toString()}
                              </div>
                            ))
                          : value?.toString()}
                      </div>
                    </div>
                  ))}

                {/* Uptime */}
                {uptime &&
                  Object.entries(uptime).map(([key, value]) => (
                    <div className={style["additional-details-row"]} key={key}>
                      <div className={style["additional-details-label"]}>
                        {key
                          .replace(/_/g, " ")
                          .replace(/\b\w/g, (c) => c.toUpperCase())}
                      </div>
                      <div className={style["additional-details-value"]}>
                        {value?.toString()}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "Fetch History" && (
          <div className={style["fetch-history"]}>
            {metrics_history.length === 0 ? (
              <div>No fetch history available.</div>
            ) : (
              <div>
                {metrics_history.map((metric, idx) => {
                  const isOpen = openAccordionIndex === idx;

                  return (
                    <div
                      key={idx}
                      className={style["accordion-item"]}
                      style={{
                        marginBottom: 16,
                        borderRadius: 8,
                        background: "#fff",
                        border: "1px solid #E5E7EB",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        className={style["accordion-header"]}
                        style={{
                          padding: "16px",
                          cursor: "pointer",
                          backgroundColor: "#F3F4F6",
                          fontWeight: 600,
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                        onClick={() =>
                          setOpenAccordionIndex(isOpen ? null : idx)
                        }
                      >
                        <span id={idx}>
                          {metric.serial_number} - Fetched on{" "}
                          {formatToHumanReadable(metric.timestamp)}
                        </span>
                        <span
                          style={{
                            transform: isOpen
                              ? "rotate(90deg)"
                              : "rotate(0deg)",
                            transition: "transform 0.2s",
                          }}
                        >
                          ▶
                        </span>
                      </div>

                      {isOpen && (
                        <div
                          className={style["accordion-content"]}
                          style={{ padding: "16px" }}
                        >
                          <div className={style["additional-details-table"]}>
                            {Object.entries(metric).map(([key, value]) => (
                              <div
                                className={style["additional-details-row"]}
                                key={key}
                              >
                                <div
                                  className={style["additional-details-label"]}
                                >
                                  {key
                                    .replace(/_/g, " ")
                                    .replace(/\b\w/g, (c) => c.toUpperCase())}
                                </div>
                                <div
                                  className={style["additional-details-value"]}
                                >
                                  {value?.toString()}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
