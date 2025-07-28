from db.mongodb import mongodb
from datetime import datetime
from typing import List, Dict, Any
from core.logging import logger

def fetch_assets() -> List[Dict[str, Any]]:
    """Return all assets as a list of dicts."""
    collection = mongodb.get_collection("assets")
    projection = {"serial_number": 1, "product_name": 1, "_id": 0}
    return list(collection.find({}, projection))

def fetch_asset_metrics(serial_number: str, since: datetime) -> List[Dict[str, Any]]:
    """Return all metrics for an asset since the given datetime."""
    collection = mongodb.get_collection("asset_metrics")
    query = {"serial_number": serial_number, "timestamp": {"$gte": since}}
    projection = {"_id": 0}
    return list(collection.find(query, projection))

def update_asset_life_estimate(serial_number: str, estimate: float):
    """Update the asset's expected remaining life in years."""
    collection = mongodb.get_collection("assets")
    result = collection.update_one(
        {"serial_number": serial_number},
        {"$set": {"expected_life_years": estimate, "expected_life_last_updated": datetime.utcnow()}}
    )
    if result.modified_count:
        logger.info(f"Updated {serial_number} with estimated life: {estimate:.2f} years")
    else:
        logger.warning(f"No asset updated for serial_number: {serial_number}")
