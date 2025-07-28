from models.schemas import Asset
from crud.asset_crud import categorize_assets, create_asset_db, get_assets_paginated, get_asset_by_serial_number, get_assets_summary_paginated, get_devices_by_age, get_inactive_assets_count, get_device_health_summary, get_all_assets, get_life_expectancy_categories
from typing import List, Optional

def create_asset_service(asset: Asset) -> str:
    """Create a new asset with business logic validation."""
    return create_asset_db(asset)

def get_assets_list_service(page: int = 1, page_size: int = 10) -> List[dict]:
    """Get paginated assets list."""
    return get_assets_paginated(page, page_size)

def get_asset_by_serial_number_service(serial_number: str) -> Optional[dict]:
    """Get asset details by serial number."""
    return get_asset_by_serial_number(serial_number)

def get_assets_summary_paginated_service(page: int = 1, page_size: int = 10) -> List[dict]:
    """Get paginated assets summary with customer info."""
    return get_assets_summary_paginated(page, page_size)

def get_device_health_count() -> dict:
    """Get count of devices by health status."""
    return categorize_assets()

def get_devices_by_age_service() -> dict:
    """Get devices categorized by age and health status."""
    return get_devices_by_age()

def get_inactive_assets_count_service() -> int:
    """Get count of inactive assets."""
    return get_inactive_assets_count()

def get_device_health_summary_service(score_threshold: int = 70) -> dict:
    """Get summary of device health including average age, health score, CPU utilization, and percentage below threshold."""
    return get_device_health_summary(score_threshold)

def get_all_assets_service() -> list:
    """Get all assets as a list (for download/email)."""
    return get_all_assets()

def get_life_expectancy_categories_service() -> dict:
    return get_life_expectancy_categories()