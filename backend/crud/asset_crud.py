from datetime import datetime
from db.mongodb import mongodb
from models.schemas import Asset, AssetMetrics
from typing import List, Optional

def get_assets_paginated(page: int = 1, page_size: int = 10) -> List[dict]:
    """Get paginated list of assets with basic info."""
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
        "customer_id": 1
    }
    cursor = collection.find({}, projection).skip(skip).limit(page_size)
    return list(cursor)

def create_asset_db(asset: Asset) -> str:
    """Create a new asset in the database."""
    asset_dict = asset.model_dump(by_alias=True)
    collection = mongodb.get_collection("assets")
    result = collection.insert_one(asset_dict)
    return result.inserted_id

def get_asset_by_serial_number(serial_number: str) -> Optional[dict]:
    """Get asset details by serial number."""
    collection = mongodb.get_collection("assets")
    return collection.find_one({"serial_number": serial_number}, {"_id": 0})

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
            "product_name": 1,
            "host_name": 1,
            "status": 1,
            "customer_name": "$customer.customer_name",
            "customer_email": "$customer.customer_email",
            "customer_phone": "$customer.customer_phone",
            "average_cpu": 1,
            "average_battery": 1,
            "average_memory": 1,
            "health_score": 1
        }},
        {"$skip": skip},
        {"$limit": page_size}
    ]
    
    return list(collection.aggregate(pipeline))

def create_asset_metrics_db(asset_metrics: AssetMetrics) -> str:
    """Create a new asset metrics entry in the database."""
    asset_metrics_dict = asset_metrics.model_dump(by_alias=True)
    collection = mongodb.get_collection("asset_metrics")
    result = collection.insert_one(asset_metrics_dict)
    return result.inserted_id

def categorize_assets()->dict:
    """Categorize assets based on health score."""
    result = {"good": 0, "moderate": 0, "critical": 0}
    collection = mongodb.get_collection("assets")
    cursor = collection.find({"health_score": {"$exists": True, "$ne": None}}, {"health_score": 1})
    
    for asset in cursor:
        score = asset.get("health_score")
        if score is None:
            continue
        if score > 85:
            result["good"] += 1
        elif score > 70:
            result["moderate"] += 1
        else:
            result["critical"] += 1
            
    return result

def get_devices_by_age()->dict:
    collection = mongodb.get_collection("assets")
    now = datetime.now()
    pipeline = [{
        "$addFields": {
            "ageInYears": {
                "$divide": [
                    {"$subtract": [now, "$created"]},
                    1000 * 60 * 60 * 24 * 365  
                ]
            },
            "healthCategory": {
                "$switch": {
                    "branches": [
                        {"case": {"$gt": ["$health_score", 85]}, "then": "good"},
                        {"case": {"$gt": ["$health_score", 70]}, "then": "moderate"},
                    ],
                    "default": "critical"
                }
            }
        }
    },
    {
        "$addFields": {
            "ageGroup": {
                "$switch": {
                    "branches": [
                        {"case": {"$lte": ["$ageInYears", 1]}, "then": "0-1 year"},
                        {"case": {"$lte": ["$ageInYears", 2]}, "then": "1-2 years"},
                    ],
                    "default": "2+ years"
                }
            }
        }
    },
    {
        "$group": {
            "_id": {
                "healthCategory": "$healthCategory",
                "ageGroup": "$ageGroup"
            },
            "count": {"$sum": 1}
        }
    },
    {
        "$sort": {
            "_id.healthCategory": 1,
            "_id.ageGroup": 1
        }
    }]

    result = list(collection.aggregate(pipeline))
    result = {"good": {}, "moderate": {}, "critical": {}}

    for asset in result:
        category = asset["_id"]["healthCategory"]
        age_group = asset["_id"]["ageGroup"]
        count = asset["count"]
        result[category][age_group] = count    
    return result


def get_inactive_assets_count() -> int:
    """Get count of inactive assets."""
    collection = mongodb.get_collection("assets")
    now = datetime.now()
    threshold_date = now.replace(year=now.year - 1)
    return collection.count_documents({"last_active": {"$lt": threshold_date}})