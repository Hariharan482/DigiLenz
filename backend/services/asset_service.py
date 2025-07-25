
from models.schemas import Asset
from crud.asset_crud import create_asset_db, get_assets_paginated, get_asset_by_serial_number, get_assets_summary_paginated
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
