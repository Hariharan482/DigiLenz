from models.asset_data import AssetData
from crud.asset_crud import create_asset_db

def create_asset_service(asset: AssetData):
    # Add business logic here if needed
    inserted_id = create_asset_db(asset)
    return inserted_id
