import React from "react";
import { useEffect, useState } from "react";
import {
  BACKEND_BASE_URL,
  ROUTE_CONSTANTS,
} from "../../constants/ApiConstants";
import style from "./ExpericenceScore.module.css";
import ExperienceScoreCard from "../../components/experienceScoreCard/ExperienceScoreCard";
import AssetScoreList from "../../components/assetScoreList/AssetScoreList";
export default function ExperienceScore() {
  const [devices, setDevices] = useState([]);
  const [summary, setSummary] = useState({
    excellent: 0,
    needsAttention: 0,
    unknown: 0,
  });

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const response = await fetch(
          `${BACKEND_BASE_URL}${ROUTE_CONSTANTS.ASSET_SUMMARY}`
        );
        const data = await response.json();
        if (data.assets) {
          setDevices(data.assets || []);
        }
        if (data.summary) {
          setSummary({
            excellent: data.summary["Excellent Devices"] || 0,
            needsAttention: data.summary["Need Attention"] || 0,
            unknown: data.summary["Unknown Devices"] || 0,
          });
        }
      } catch (error) {
        console.error("Failed to fetch devices:", error);
      }
    };

    fetchDevices();
  }, []);

  return (
    <div className={style["experience-score-container"]}>
      <div className={style["experience-score-heading"]}>
        Device Experience Score
      </div>
      <div className={style["experience-score"]}>
        <ExperienceScoreCard
          label="Excellent Devices"
          value={summary.excellent}
        />
        <ExperienceScoreCard
          label="Need Attention"
          value={summary.needsAttention}
        />
        <ExperienceScoreCard label="Unknown Devices" value={summary.unknown} />
      </div>
      <AssetScoreList devices={devices} />
    </div>
  );
}
