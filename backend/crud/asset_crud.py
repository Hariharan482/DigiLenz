from datetime import datetime, timedelta
from utils.calculate_customer_experience_score import calculate_customer_experience_score
from db.mongodb import mongodb
from models.schemas import Asset, AssetMetrics
from typing import Dict
import math
from core.logging import logger

def get_all_assets() -> list:
    collection = mongodb.get_collection("assets")
    projection = {
        "_id": 0,
        "serial_number": 1,
        "product_name": 1,
        "host_name": 1,
        "status": 1,
        "health_score": 1,
        "average_cpu": 1,
        "average_battery": 1,
        "average_memory": 1,
        "customer_id": 1,
        "created_at": 1,
        "expected_life_years": 1
    }
    cursor = collection.find({}, projection)
    assets = []
    now = datetime.now()
    for doc in cursor:
        asset = dict(doc)
        created_at = asset.get("created_at")
        if created_at:
            try:
                age_years = (now - created_at).total_seconds() / (365.25 * 24 * 60 * 60)
                asset["age_years"] = round(age_years, 2)
            except Exception:
                asset["age_years"] = None
        else:
            asset["age_years"] = None
        assets.append(asset)
    return assets

def get_assets_paginated(page: int = 1, page_size: int = 10) -> Dict:
    """Return paginated asset list with total pages info (flat structure)."""
    collection = mongodb.get_collection("assets")
    
    skip = (page - 1) * page_size
    projection = {
        "_id": 0,
        "serial_number": 1,
        "product_name": 1,
        "host_name": 1,
        "status": 1,
        "health_score": 1,
        "average_cpu": 1,
        "average_battery": 1,
        "average_memory": 1,
        "customer_id": 1,
        "created_at": 1,
        "expected_life_years": 1
    }

    total_count = collection.count_documents({})
    active_count = collection.count_documents({"status": "Active"})
    inactive_count = collection.count_documents({"status": "Inactive"})
    total_pages = math.ceil(total_count / page_size)

    cursor = collection.find({}, projection).skip(skip).limit(page_size)
    assets = []
    now = datetime.now()
    for doc in cursor:
        asset = dict(doc)
        created_at = asset.get("created_at")
        if created_at:
            try:
                age_years = (now - created_at).total_seconds() / (365.25 * 24 * 60 * 60)
                asset["age_years"] = round(age_years, 2)
            except Exception:
                asset["age_years"] = None
        else:
            asset["age_years"] = None
        assets.append(asset)

    return {
        "page": page,
        "page_size": page_size,
        "total_pages": total_pages,
        "active_count": active_count,
        "inactive_count": inactive_count,
        "assets": assets
    }


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
                {"$match": {"$expr": {"$eq": ["$serial_number", "$$asset_serial"]}}},
                {"$sort": {"timestamp": -1}},
                {"$limit": 10},
                {"$project": {"_id": 0, "id": 0}}
            ],
            "as": "metrics_history"
        }},
        {"$lookup": {
            "from": "customers",
            "localField": "customer_id",
            "foreignField": "customer_id",
            "as": "customer"
        }},
        {"$unwind": {"path": "$customer", "preserveNullAndEmptyArrays": True}},
        {"$project": {
            "_id": 0,
            "device_name": "$product_name",
            "hostname": "$host_name",
            "serial_number": 1,
            "mac_address": 1,
            "customer_name": "$customer.customer_name",
            "status": 1,
            "average_cpu": "$average_cpu",
            "average_battery": "$average_battery",
            "average_memory": "$average_memory",
            "health_score": "$health_score",
            "metrics_history": 1
        }}
    ]

    asset = next(collection.aggregate(pipeline), None)
    return asset

def get_assets_summary_paginated(page: int = 1, page_size: int = 10) -> Dict:
    """Get paginated summary with customer info and metrics, including device status counts."""
    collection = mongodb.get_collection("assets")
    skip = (page - 1) * page_size
    total_count = collection.count_documents({})
    total_pages = math.ceil(total_count / page_size) if total_count > 0 else 1
    
    paginated_pipeline = [
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
            "product_name": 1,
            "host_name": 1,
            "status": 1,
            "customer_name": "$customer.customer_name",
            "customer_email": "$customer.customer_email",
            "customer_phone": "$customer.customer_phone",
            "average_cpu": 1,
            "average_battery": 1,
            "average_memory": 1,
            "health_score": 1,
            "last_active": 1
        }},
        {"$skip": skip},
        {"$limit": page_size}
    ]
    
    score_pipeline = [
        {"$lookup": {
            "from": "customers",
            "localField": "customer_id",
            "foreignField": "customer_id",
            "as": "customer"
        }},
        {"$unwind": "$customer"},
        {
            "$group": {
                "_id": {
                    "$switch": {
                        "branches": [
                            {"case": {"$or": [{"$eq": ["$last_active", None]}, {"$not": ["$last_active"]}]}, "then": "Unknown"},
                            {"case": {"$gte": ["$health_score", 70]}, "then": "Excellent"},
                            {"case": {"$gt": ["$health_score", 0]}, "then": "Needs Attention"},
                        ],
                        "default": "Unknown"
                    }
                },
                "count": {"$sum": 1}
            }
        }
    ]
    
    paginated_assets = list(collection.aggregate(paginated_pipeline))
    health_score_summary = list(collection.aggregate(score_pipeline))
    
    summary = {
        "Excellent Devices": 0,
        "Need Attention": 0,
        "Unknown Devices": 0
    }
    
    for item in health_score_summary:
        category = item["_id"]
        count = item["count"]
        if category == "Excellent":
            summary["Excellent Devices"] = count
        elif category == "Needs Attention":
            summary["Need Attention"] = count
        elif category == "Unknown":
            summary["Unknown Devices"] = count
    
    return {
        "assets": paginated_assets,
        "summary": summary,
        "total_pages": total_pages,
        "current_page": page,
        "page_size": page_size,
        "total_count": total_count
    }

def _health_category_expr():
    # Helper for MongoDB aggregation health category logic
    return {
        "$cond": {
            "if": {"$eq": ["$health_score", None]},
            "then": "unknown",
            "else": {
                "$switch": {
                    "branches": [
                        {"case": {"$gt": ["$health_score", 85]}, "then": "good"},
                        {"case": {"$gt": ["$health_score", 70]}, "then": "moderate"},
                        {"case": {"$eq": ["$health_score", 0]}, "then": "unknown"}
                    ],
                    "default": "critical"
                }
            }
        }
    }

def categorize_assets() -> dict:
    """Categorize assets based on health score."""
    result = {"good": 0, "moderate": 0, "critical": 0, "unknown": 0}
    collection = mongodb.get_collection("assets")
    pipeline = [
        {"$project": {"category": _health_category_expr()}},
        {"$group": {"_id": "$category", "count": {"$sum": 1}}}
    ]
    try:
        categories = collection.aggregate(pipeline)
        for category in categories:
            result[category["_id"]] = category["count"]
        return result
    except Exception as e:
        logger.error(f"Error categorizing assets: {str(e)}")
        return result

def get_devices_by_age() -> dict:
    collection = mongodb.get_collection("assets")
    pipeline = [
        {"$match": {"created_at": {"$exists": True}, "health_score": {"$exists": True}}},
        {"$addFields": {
            "ageInYears": {
                "$divide": [
                    {"$subtract": ["$$NOW", "$created_at"]},
                    1000 * 60 * 60 * 24 * 365
                ]
            },
            "healthCategory": _health_category_expr()
        }},
        {"$addFields": {
            "ageGroup": {
                "$switch": {
                    "branches": [
                        {"case": {"$lte": ["$ageInYears", 1]}, "then": "0-1 year"},
                        {"case": {"$lte": ["$ageInYears", 2]}, "then": "1-2 years"}
                    ],
                    "default": "2+ years"
                }
            }
        }},
        {"$group": {
            "_id": {"healthCategory": "$healthCategory", "ageGroup": "$ageGroup"},
            "count": {"$sum": 1}
        }},
        {"$sort": {"_id.healthCategory": 1, "_id.ageGroup": 1}}
    ]
    try:
        aggregated_result = list(collection.aggregate(pipeline))
        result = {"good": {}, "moderate": {}, "critical": {}, "unknown": {}}
        age_groups = ["0-1 year", "1-2 years", "2+ years"]
        for category in result.keys():
            for age_group in age_groups:
                result[category][age_group] = 0
        for asset in aggregated_result:
            category = asset["_id"]["healthCategory"]
            age_group = asset["_id"]["ageGroup"]
            count = asset["count"]
            result[category][age_group] = count
        return result
    except Exception as e:
        logger.error(f"Error getting devices by age: {str(e)}")
        return {"good": {}, "moderate": {}, "critical": {}, "unknown": {}}


def get_inactive_assets_count() -> int:
    """Get count of inactive assets."""
    collection = mongodb.get_collection("assets")
    now = datetime.now()
    try:
        threshold_date = now.replace(month=now.month - 3)
        return collection.count_documents({
            "last_active": {"$exists": True, "$lt": threshold_date}
        })
    except Exception as e:
        logger.error(f"Error getting inactive assets count: {str(e)}")
        return 0

def create_asset_metrics_db(asset_metrics: AssetMetrics) -> str:
    """Create a new asset metrics entry in the database."""
    try:
        asset_metrics_dict = asset_metrics.model_dump(by_alias=True)
        collection = mongodb.get_collection("asset_metrics")
        result = collection.insert_one(asset_metrics_dict)
        inserted_id = str(result.inserted_id)
    except Exception as e:
        print(f"Error creating asset metrics: {str(e)}")
        raise

    # Define time window for aggregation
    time_threshold = datetime.now() - timedelta(days=90)

    # Aggregate metrics for the asset over the time window
    pipeline = [
        {"$match": {"serial_number": asset_metrics.serial_number, "timestamp": {"$gte": time_threshold}}},
        {"$group": {
            "_id": "$serial_number",
            "avg_cpu_usage_percent": {"$avg": "$cpu_usage_percent"},
            "avg_memory_used_percent": {"$avg": "$memory_used_percent"},
            "avg_total_disk_used_percent": {"$avg": "$total_disk_used_percent"},
            "avg_battery_percent": {"$avg": "$battery_percent"},
            "battery_present": {"$max": "$battery_present"}
        }}
    ]

    agg_result = list(collection.aggregate(pipeline))
    if not agg_result:
        # No recent metrics, optionally clear health score and averages
        assets_collection = mongodb.get_collection("assets")
        assets_collection.update_one(
            {"serial_number": asset_metrics.serial_number},
            {"$set": {
                "health_score": None,
                "average_cpu": None,
                "average_memory": None,
                "average_battery": None
            }}
        )
        return inserted_id
    aggregated = agg_result[0]

    # Get the metrics values
    avg_cpu = aggregated.get("avg_cpu_usage_percent", 0.0)
    avg_memory = aggregated.get("avg_memory_used_percent", 0.0)
    avg_battery = aggregated.get("avg_battery_percent")
    
    # Calculate the customer experience score
    ces_score = calculate_customer_experience_score(
        average_cpu=avg_cpu,
        average_memory=avg_memory,
        average_battery=avg_battery
    )

    # Update the Asset document with score and averages
    assets_collection = mongodb.get_collection("assets")
    assets_collection.update_one(
        {"serial_number": asset_metrics.serial_number},
        {"$set": {
            "health_score": ces_score,
            "average_cpu": avg_cpu,
            "average_memory": avg_memory,
            "average_battery": avg_battery,
            "last_active": datetime.now() 
        }}
    )
    return inserted_id

def get_device_health_summary(score_threshold=70):
    """Get summary of device health including average age, health score, CPU utilization, and percentage below threshold."""
    collection = mongodb.get_collection("assets")
    now = datetime.now()

    pipeline = [
        {
            "$match": {
                "health_score": {"$exists": True, "$ne": 0},
                "average_cpu": {"$exists": True, "$ne": 0},
                "average_memory": {"$exists": True, "$ne": 0},
                "average_battery": {"$exists": True, "$ne": 0},
                "created_at": {"$exists": True}
            }
        },
        {
            "$addFields": {
                "now": "$$NOW"
            }
        },
        {
            "$addFields": {
                "ageInYears": {
                    "$divide": [
                        {"$subtract": ["$now", "$created_at"]},
                        1000 * 60 * 60 * 24 * 365
                    ]
                }
            }
        },
        {
            "$group": {
                "_id": None,
                "avgAge": {"$avg": "$ageInYears"},
                "avgHealthScore": {"$avg": "$health_score"},
                "avgCpu": {"$avg": "$average_cpu"},
                "totalDevices": {"$sum": 1},
                "belowThreshold": {
                    "$sum": {
                        "$cond": [
                            {"$lt": ["$health_score", score_threshold]},
                            1,
                            0
                        ]
                    }
                }
            }
        }
    ]

    result = list(collection.aggregate(pipeline))

    if not result:
        return None

    data = result[0]
    percent_below_threshold = (data["belowThreshold"] / data["totalDevices"]) * 100 if data["totalDevices"] > 0 else 0

    return {
        "AvgAgeYears": round(data["avgAge"], 2),
        "AvgHealthScore": round(data["avgHealthScore"], 2),
        "AvgCPUUtilizationPercent": round(data["avgCpu"], 2),
        "PercentDevicesBelowScoreThreshold": round(percent_below_threshold, 2)
    }