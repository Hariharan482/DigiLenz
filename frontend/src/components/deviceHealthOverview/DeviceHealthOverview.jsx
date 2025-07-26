import React, { useEffect,useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import style from "./DeviceHealthOverview.module.css";
import { BACKEND_BASE_URL,ROUTE_CONSTANTS } from "../../constants/ApiConstants";

export default function DeviceHealthOverview() {
  Chart.register(ArcElement, Tooltip, Legend, ChartDataLabels);
  const [healthCount, setHealthCount] = useState([]);

  useEffect(() => {
        const fetchAssets = async () => {
          try {
            const response = await fetch(
              `${BACKEND_BASE_URL}${ROUTE_CONSTANTS.HEALTH_COUNT}`
            );
            const data = await response.json();
            setHealthCount(data);
          } catch (error) {
            console.error("Failed to fetch asset data:", error);
          }
        };
        fetchAssets();
  },[])
  
  const data = {
    labels: ["<50%", "<75%", "<90%"],
    datasets: [
      {
        data: [healthCount.critical, healthCount.moderate, healthCount.good],
        backgroundColor: ["#FF8A50", "#4F46E5", "#FEB572"],
        borderWidth: 0,
        cutout: "65%",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
      },
      datalabels: {
        color: "white",
        font: {
          size: 16,
          weight: "bold",
        },
        formatter: (value, context) => {
          return context.chart.data.labels[context.dataIndex];
        },
        display: true,
      },
    },
  };

  const legendItems = [
    {
      color: "#FF8A50",
      label: "No of Devices < 50%",
      value: data.datasets[0].data[0],
    },
    {
      color: "#4F46E5",
      label: "No of Devices < 75%",
      value: data.datasets[0].data[1],
    },
    {
      color: "#FEB572",
      label: "No of Devices < 90%",
      value: data.datasets[0].data[2],
    },
  ];
  return (
    <div className={style["device-health-chart"]}>
      <div className={style["chart-heading"]}>Device Health Overview</div>

      <div className={style["chart-container"]}>
        <div className={style["pie-chart"]}>
          <Doughnut data={data} options={options} />
        </div>
        <div className={style["legend-container"]}>
          {legendItems.map((item, index) => (
            <div key={index} className={style["legend-item"]}>
              <div
                className={style["legend-color-indicator"]}
                style={{ backgroundColor: item.color }}
              />
              <span className={style["legend-label"]}>{item.label}</span>
              <span className={style["legend-value"]}>{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
