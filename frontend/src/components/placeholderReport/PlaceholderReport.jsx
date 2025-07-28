import React, { useEffect, useState } from "react";
import styles from "./PlaceholderReport.module.css";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import { BACKEND_BASE_URL,ROUTE_CONSTANTS } from "../../constants/ApiConstants";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

const PlaceHolderReport = () => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    fetch(`${BACKEND_BASE_URL}${ROUTE_CONSTANTS.ASSET_LIFE_EXPECTANCY}`)
      .then((res) => res.json())
      .then((data) => {
        const transformedData = Object.entries(data).map(([key, value]) => ({
          name: key,
          value: value
        }));
        setChartData(transformedData);
      })
      .catch((error) => {
        console.error("Failed to fetch life expectancy data", error);
      });
  }, []);

  return (
    <div className={styles.placeholderCard}>
      <div className={styles.title}>Categorization By Expected Years</div>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PlaceHolderReport;
