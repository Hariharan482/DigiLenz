import React, {useEffect,useState} from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Legend,
  Tooltip,
} from "chart.js";

import style from "./DeviceByAgeChart.module.css";
import { BACKEND_BASE_URL,ROUTE_CONSTANTS } from "../../constants/ApiConstants";

export default function DeviceHealthOverview() {
    const [deviceByAge, setDeviceByAge] = useState([]);
    const [ageRanges, setAgeRanges] = useState([]);
  

    useEffect(() => {
          const fetchAssets = async () => {
            try {
              const response = await fetch(
                `${BACKEND_BASE_URL}${ROUTE_CONSTANTS.DEVICES_BY_AGE}`
              );
              const data = await response.json();
              setDeviceByAge(data);
            } catch (error) {
              console.error("Failed to fetch asset data:", error);
            }
          };
          fetchAssets();
    },[])

    useEffect(()=>{
      setAgeRanges(Object.keys(deviceByAge.good || deviceByAge.moderate || deviceByAge.critical || {}));

    },[deviceByAge]);
    
    

  ChartJS.register(BarElement, CategoryScale, LinearScale, Legend, Tooltip);
  const data = {
    labels: ageRanges,
    datasets: [
      {
        label: "Good",
        data: ageRanges.map(range => deviceByAge.good?.[range] || 0),
        backgroundColor: "#4B9A8C",
        stack: "Stack 0",
      },
      {
        label: "Moderate",
        data: ageRanges.map(range => deviceByAge.moderate?.[range] || 0),
        backgroundColor: "#82C4AC",
        stack: "Stack 0",
      },
      {
        label: "Poor",
        data: ageRanges.map(range => deviceByAge.critical?.[range] || 0),
        backgroundColor: "#F37B71",
        stack: "Stack 0",
      },
    ],
  };

  const options = {
    plugins: {
      legend: { position: "bottom" },
      title: {
        display: false,
      },
    },
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        stacked: true,
        grid: { display: false },
      },
      y: {
        stacked: true,
        beginAtZero: true,
        grid: { color: "#eee" },
        ticks: {
          stepSize: 10,
        },
      },
    },
  };
  return (
    <div className={style["device-by-age-chart"]}>
      <div className={style["chart-header"]}>Devices By Age</div>
      <div style={{ height: 310 }}>
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}
