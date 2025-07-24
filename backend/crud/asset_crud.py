from db.mongodb import mongodb
from models.asset_data import AssetData

def create_asset_db(asset: AssetData):
    asset_dict = asset.model_dump(by_alias=True)
    collection = mongodb.get_collection("assets")
    result = collection.insert_one(asset_dict)
    return result.inserted_id
