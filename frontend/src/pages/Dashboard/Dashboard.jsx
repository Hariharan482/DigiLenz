import React from "react";
import DeviceHealthOverview from "../../components/deviceHealthOverview/DeviceHealthOverview";
import DeviceByAgeChart from "../../components/devicesByAgeChart/DevicesByAgeChart";
import DeviceHealthSummary from "../../components/deviceHealthSummary/DeviceHealthSummary";
import PlaceholderReport from "../../components/placeholderReport/PlaceholderReport";
import AssetsNotDiscovered from "../../components/assetsNotDiscovered/AssetsNotDiscovered";
import { user } from "../../constants/AppConstants";
import style from "./Dashboard.module.css";

export default function Dashboard() {
  return (
    <div className={style["dashboard"]}>
      <div className={style["greeting"]}>Good Morning, {user}</div>
      <div className={style["dashboard-charts"]}>
        <DeviceHealthOverview />
        <DeviceByAgeChart />
      </div>
      <div className={style["dashboard-second-row"]}>
        <DeviceHealthSummary />
        <PlaceholderReport />
        <AssetsNotDiscovered />
      </div>
    </div>
  );
}
