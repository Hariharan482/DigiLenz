import React from 'react';
import style from './AssetScoreList.module.css';
export default function AssetScoreList() {
    const devices = [
        {
            deviceId: 'DJHBJ334',
            deviceName: 'Lenovo Idea Pad - Intel Ultra 9',
            user: 'John Doe',
            cpuScore: 65,
            ramScore: 82,
            diskScore: 45,
            overallScore: 78,
            lastUpdated: '24/07/2025, 10:30:00'
        },
        {
            deviceId: 'KJNDLOW',
            deviceName: 'MacBook Air - M4',
            user: 'Jane Smith',
            cpuScore: 92,
            ramScore: 88,
            diskScore: 95,
            overallScore: 91,
            lastUpdated: '24/07/2025, 10:30:00'
        }
    ];

    const getScoreStyle = (score) => {
        if (score >= 85) {
        return { backgroundColor: '#10b98149', color: '#0b8059ff' }; // Green for excellent
        } else if (score >= 70) {
        return { backgroundColor: '#f59f0b69', color: '#996408ff' }; // Yellow for good
        } else {
        return { backgroundColor: '#ef444461', color: '#731f1fff' }; // Red for poor
        }
    };

    return (
      <div className={style['list-table-container']}>
        <div className={style['list-table']}>
          <div className={style['list-table-header']}>Device ID</div>
          <div className={style['list-table-header']}>Device Name</div>
          <div className={style['list-table-header']}>User</div>
          <div className={style['list-table-header']}>CPU Score</div>
          <div className={style['list-table-header']}>RAM Score</div>
          <div className={style['list-table-header']}>Disk Score</div>
          <div className={style['list-table-header']}>Overall Score</div>
          <div className={style['list-table-header']}>Last Updated</div>
        </div>

        {devices.map((device, index) => (
          <div
            className={style['table-row']}
            key={index}>
            <div className={style['row-device-data']}>
              {device.deviceId}
            </div>
            <div className={style['row-device-data']}>
              {device.deviceName}
            </div>
            <div className={style['row-device-data']}>
              {device.user}
            </div>
            <div className={style['row-score-data']}>
              <span className={style['score']} style={{
                ...getScoreStyle(device.cpuScore)
              }}>
                {device.cpuScore}
              </span>
            </div>
            <div className={style['row-score-data']}>
              <span className={style['score']} style={{
                ...getScoreStyle(device.ramScore)
              }}>
                {device.ramScore}
              </span>
            </div>
            <div className={style['row-score-data']}>
              <span className={style['score']} style={{
                ...getScoreStyle(device.diskScore)
              }}>
                {device.diskScore}
              </span>
            </div>
            <div className={style['row-score-data']}>
              <span className={style['score']} style={{
                ...getScoreStyle(device.overallScore)
              }}>
                {device.overallScore}
              </span>
            </div>
            <div className={style['row-device-data']}>
              {device.lastUpdated}
            </div>
          </div>
        ))}
      </div>
    )


}