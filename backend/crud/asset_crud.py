from db.mongodb import mongodb
from models.schemas import Asset
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

def create_asset_metrics_db(asset_metrics: dict) -> str:
    """Create a new asset metrics entry in the database."""
    collection = mongodb.get_collection("asset_metrics")
    result = collection.insert_one(asset_metrics)
    return result.inserted_id