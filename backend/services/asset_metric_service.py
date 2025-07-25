from models.schemas import AssetMetrics
from crud.asset_crud import create_asset_metrics_db
from typing import List, Optional

def create_asset_metrics_service(asset_metrics: AssetMetrics) -> str:
    """Create a new asset metrics entry."""
    return create_asset_metrics_db(asset_metrics)