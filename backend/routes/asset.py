from fastapi import APIRouter, HTTPException, Response
from fastapi.responses import JSONResponse
from models.asset_data import AssetData

from services.asset_service import create_asset_service
from core.logging import logger

router = APIRouter(prefix="/assets", tags=["assets"])

@router.post("/", status_code=201)
def create_asset(asset: AssetData):
    logger.info("Received asset creation request")
    inserted_id = create_asset_service(asset)
    if not inserted_id:
        logger.error("Asset not saved")
        raise HTTPException(status_code=500, detail="Asset not saved")
    logger.info(f"Asset saved with id: {inserted_id}")
    return JSONResponse(
        status_code=201,
        content={"id": str(inserted_id), "message": "Asset saved successfully"}
    )
