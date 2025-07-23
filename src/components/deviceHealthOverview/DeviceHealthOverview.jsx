import { Doughnut } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import style from './DeviceHealthOverview.module.css'; 
export default function DeviceHealthOverview() {
    Chart.register(ArcElement, Tooltip, Legend, ChartDataLabels);

    const data = {
    labels: ['<50%', '<75%', '<90%'],
    datasets: [
        {
        data: [2, 3, 5], // Actual values: 2, 3, 5
        backgroundColor: [
            '#FF8A50', // Orange for <50%
            '#4F46E5', // Blue for <75% 
            '#FEB572', // Light orange for <90%
        ],
        borderWidth: 0,
        cutout: '65%',
        },
    ],
    };

    const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
        display: false, // We'll create custom legend
        },
        tooltip: {
        enabled: true,
        },
        datalabels: {
        color: 'white',
        font: {
            size: 16,
            weight: 'bold',
        },
        formatter: (value, context) => {
            return context.chart.data.labels[context.dataIndex];
        },
        display: true,
        },
    },
    };

    const legendItems = [
    { color: '#FF8A50', label: 'No of Devices < 50%', value: 2 },
    { color: '#4F46E5', label: 'No of Devices < 75%', value: 3 },
    { color: '#FEB572', label: 'No of Devices < 90%', value: 5 },
    ];
  return (
    <div className={style['device-health-chart']}>
      <div className={style['chart-heading']}>
        Device Health Overview
      </div>

      <div className={style['chart-container']}>
        <div className={style['pie-chart']}>
          <Doughnut data={data} options={options} />
        </div>
        <div className={style['legend-container']}>
          {legendItems.map((item, index) => (
            <div key={index} className={style['legend-item']}>
              <div className={style['legend-color-indicator']} style={{backgroundColor: item.color}} />
              <span className={style['legend-label']}>
                {item.label}
              </span>
              <span className={style['legend-value']}>
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

}