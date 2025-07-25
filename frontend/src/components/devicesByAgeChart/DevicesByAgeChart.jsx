import React from "react";
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Legend,
  Tooltip,
} from 'chart.js';
import style from './DeviceByAgeChart.module.css';
export default function DeviceHealthOverview() {
    ChartJS.register(BarElement, CategoryScale, LinearScale, Legend, Tooltip);
    const data = {
    labels: ['0-1yrs', '1-2yrs', '2-3yrs', '>3yrs'],
    datasets: [
        {
        label: 'Good',
        data: [10, 15, 10, 5],
        backgroundColor: '#4B9A8C',
        stack: 'Stack 0',
        },
        {
        label: 'Moderate',
        data: [10, 18, 12, 8],
        backgroundColor: '#82C4AC', 
        stack: 'Stack 0',
        },
        {
        label: 'Poor',
        data: [7, 10, 18, 20],
        backgroundColor: '#F37B71', 
        stack: 'Stack 0',
        },
    ],
    };

    const options = {
        plugins: {
            legend: { position: 'bottom' },
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
            grid: { color: '#eee' },
            ticks: {
                stepSize: 10,
            },
            },
        },
    };
    return(
        <div className={style['device-by-age-chart']}>
        <div className={style['chart-header']}>Devices By Age</div>
        <div style={{ height: 310 }}>
        <Bar data={data} options={options} />
        </div>
    </div>
    )
}