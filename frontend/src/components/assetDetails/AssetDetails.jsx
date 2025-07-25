import React, { useState } from 'react';
import style from './AssetDetails.module.css';
import { mockAssetdata } from '../../constants/AssetData';
import batteryHealth from '../../services/BatteryHealth';
export default function AssetDetails({close}) {
    const [activeTab, setActiveTab] = useState('Details');

    const tabs = ['Details', 'Fetch History'];

    return (
        <div className={style['asset-details']}>
        {/* Header Section */}
        <div className={style['header']}>
            <div className={style['header-content']}>
            {/* Device Icon */}
            <div className={style['device-icon']}>
                {/* Laptop Icon */}
                <svg width="48" height="32" viewBox="0 0 48 32" fill="none">
                <rect x="6" y="2" width="36" height="22" rx="2" fill="none" stroke="white" strokeWidth="2"/>
                <rect x="0" y="26" width="48" height="4" rx="2" fill="white"/>
                <circle cx="24" cy="28" r="1.5" fill="#374151"/>
                </svg>
            </div>

            {/* Device Info */}
            <div className={style['device-info']}>
                <div className={style['device-name']}>
                {mockAssetdata.device_name || 'Device Name'}
                </div>
                <p className={style['mac-address']}>
                {mockAssetdata.mac_address || '00:00:00:00:00:00'}
                </p>
            </div>
            <span className={style['material-symbols-outlined']} onClick={close}>close</span>
            </div>
        </div>

        {/* Tab Navigation */}
        <div className={style['tab-container']}>
            <div className={style['tab-navigation']}>
            {tabs.map((tab) => (
                <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={style['tab-button']}
                style={{
                    backgroundColor: activeTab === tab ? '#DC2626' : 'transparent',
                    color: activeTab === tab ? '#ffffff' : '#6B7280',
                    borderBottom: activeTab === tab ? '3px solid #DC2626' : '3px solid transparent',
                }}
                >
                {tab}
                </button>
            ))}
            </div>
        </div>

        {/* Content Area */}
        <div className={style['content-area']}>
            {activeTab === 'Details' && (
            <div>
                {/* Metrics Row */}
                <div className={style['metrics-row']}>
                {/* CPU Usage */}
                <div className={style['metrics-container']}>
                    {/* CPU Icon */}
                    <div className={style['metrics-icon']}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <rect x="3" y="3" width="18" height="18" rx="2" fill="none" stroke="white" strokeWidth="2"/>
                        <rect x="7" y="7" width="10" height="10" rx="1" fill="white"/>
                        <path d="M9 1v2M15 1v2M9 21v2M15 21v2M1 9h2M1 15h2M21 9h2M21 15h2" stroke="white" strokeWidth="1.5"/>
                    </svg>
                    </div>
                    <div>
                    <div className={style['metrics-value']}>
                        Average CPU Usage - {mockAssetdata.cpu_usage_percent || 'N/A'}%
                    </div>
                    </div>
                </div>

                {/* Battery Health */}
                <div className={style['metrics-container']}>
                    {/* Battery Icon */}
                    <div className={style['metrics-icon']}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <rect x="2" y="6" width="16" height="12" rx="2" fill="none" stroke="white" strokeWidth="2"/>
                        <rect x="4" y="8" width="10" height="8" rx="1" fill="white"/>
                        <rect x="20" y="9" width="2" height="6" rx="1" fill="white"/>
                        <path d="M6 10h6M6 12h4" stroke="#1F2937" strokeWidth="1.5"/>
                    </svg>
                    </div>
                    <div>
                    <div className={style['metrics-value']}>
                        Battery Health - {batteryHealth(mockAssetdata.battery_cycle_count || 0)}%
                    </div>
                    </div>
                </div>
                </div>

                {/* Additional Details Section */}
                <div className={style['additional-details-container']}>
                    <div className={style['additional-details-table']}>
                        {
                            Object.entries(mockAssetdata).map(([detail, value]) => (
                                <div className={style['additional-details-row']} key={detail}>
                                    <div className={style['additional-details-label']}>
                                        {detail.trim().replace(/_/g, ' ').replace(/\b\w/g, s => s.toUpperCase())}
                                    </div>
                                    <div className={style['additional-details-value']}>
                                        {value.toString()}
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
            )}

            {activeTab === 'Fetch History' && (
            <div className={style['fetch-history']}>
                Fetch History content would be displayed here
            </div>
            )}
        </div>
        </div>
    );
}