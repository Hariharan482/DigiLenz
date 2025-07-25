from db.mongodb import mongodb
from models.schemas import Asset
from typing import List, Optional

def get_assets_paginated(page: int = 1, page_size: int = 10) -> List[dict]:
    """Get paginated list of assets with basic info."""
    collection = mongodb.get_collection("assets")
    skip = (page - 1) * page_size
    projection = {"_id": 0, "serial_number": 1, "host_name": 1, "product_name": 1, "status": 1}
    cursor = collection.find({}, projection).skip(skip).limit(page_size)
    return list(cursor)

def create_asset_db(asset: Asset) -> str:
    """Create a new asset in the database."""
    asset_dict = asset.model_dump(by_alias=True)
    collection = mongodb.get_collection("assets")
    result = collection.insert_one(asset_dict)
    return result.inserted_id

def get_asset_by_serial_number(serial_number: str) -> dict:
    """Get detailed asset information including system specs and latest metrics."""
    collection = mongodb.get_collection("assets")
    
    pipeline = [
        {"$match": {"serial_number": serial_number}},
        {"$lookup": {
            "from": "asset_metrics",
            "let": {"asset_serial": "$serial_number"},
            "pipeline": [
                {
                    "$match": {
                        "$expr": {"$eq": ["$serial_number", "$$asset_serial"]}
                    }
                },
                {"$sort": {"timestamp": -1}},
                {"$limit": 1}
            ],
            "as": "latest_metrics"
        }},
        {"$unwind": {
            "path": "$latest_metrics",
            "preserveNullAndEmptyArrays": True
        }},
        {"$lookup": {
            "from": "customers",
            "localField": "customer_id",
            "foreignField": "customer_id",
            "as": "customer"
        }},
        {"$unwind": {
            "path": "$customer",
            "preserveNullAndEmptyArrays": True
        }},
        {"$project": {
            "_id": 0,
            "device_name": "$product_name",
            "hostname": "$host_name",
            "serial_number": 1,
            "mac_address": 1,
            "customer_name": "$customer.customer_name",
            "status": 1,
            "os": "$latest_metrics.os",
            "os_release": "$latest_metrics.os_release",
            "os_version": "$latest_metrics.os_version",
            "architecture": "$latest_metrics.architecture",
            "machine": "$latest_metrics.machine",
            "processor": "$latest_metrics.processor",
            "python_version": "$latest_metrics.python_version",
            "timestamp": "$latest_metrics.timestamp",
            "system_specs": {
                "physical_cpu_cores": "$latest_metrics.physical_cpu_cores",
                "logical_cpu_cores": "$latest_metrics.logical_cpu_cores",
                "cpu_freq": {
                    "current": "$latest_metrics.cpu_freq_current_mhz",
                    "min": "$latest_metrics.cpu_freq_min_mhz",
                    "max": "$latest_metrics.cpu_freq_max_mhz"
                },
                "memory": {
                    "total_gb": "$latest_metrics.memory_total_gb",
                    "used_gb": "$latest_metrics.memory_used_gb",
                    "free_gb": "$latest_metrics.memory_free_gb",
                    "used_percent": "$latest_metrics.memory_used_percent"
                },
                "swap": {
                    "total_gb": "$latest_metrics.swap_total_gb",
                    "used_gb": "$latest_metrics.swap_used_gb",
                    "used_percent": "$latest_metrics.swap_used_percent"
                },
                "disk": {
                    "total_gb": "$latest_metrics.total_disk_size_gb",
                    "used_gb": "$latest_metrics.total_disk_usage_gb",
                    "used_percent": "$latest_metrics.total_disk_used_percent"
                }
            },
            "performance": {
                "cpu_usage_percent": "$latest_metrics.cpu_usage_percent",
                "avg_cpu_per_core_percent": "$latest_metrics.avg_cpu_per_core_usage_percent",
                "battery_health_percent": "$latest_metrics.battery_health",
                "battery_present": "$latest_metrics.battery_present",
                "battery_percent": "$latest_metrics.battery_percent"
            },
            "uptime": {
                "boot_time_utc": "$latest_metrics.boot_time_utc",
                "uptime_seconds": "$latest_metrics.uptime_seconds",
                "uptime_hms": "$latest_metrics.uptime_hms"
            }
        }}
    ]
    
    result = list(collection.aggregate(pipeline))
    return result[0] if result else None

def get_assets_summary_paginated(page: int = 1, page_size: int = 10) -> List[dict]:
    """Get paginated summary with customer info and metrics."""
    collection = mongodb.get_collection("assets")
    skip = (page - 1) * page_size
    
    pipeline = [
        {"$lookup": {
            "from": "customers",
            "localField": "customer_id",
            "foreignField": "customer_id",
            "as": "customer"
        }},
        {"$unwind": "$customer"},
        {"$project": {
            "_id": 0,
            "serial_number": 1,
            "customer_name": "$customer.customer_name",
            "average_cpu": 1,
            "average_battery": 1,
            "average_memory": 1,
            "health_score": 1
        }},
        {"$skip": skip},
        {"$limit": page_size}
    ]
    
    return list(collection.aggregate(pipeline))
