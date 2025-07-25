

from fastapi import APIRouter, HTTPException, Query, status
from fastapi.responses import JSONResponse
from core.logging import logger
from models.schemas import Asset, AssetMetrics
from services.asset_service import (
    create_asset_service,
    get_assets_list_service,
    get_asset_by_serial_number_service,
    get_assets_summary_paginated_service,
    create_asset_metrics_service
)

router = APIRouter(prefix="/assets", tags=["assets"])

@router.post("/", status_code=status.HTTP_201_CREATED)
def create_asset(asset: Asset):
    """Create a new asset."""
    logger.info("Received asset creation request")
    try:
        inserted_id = create_asset_service(asset)
        if not inserted_id:
            logger.error("Asset not saved")
            raise HTTPException(status_code=500, detail="Asset not saved")
        
        logger.info(f"Asset saved with id: {inserted_id}")
        return JSONResponse(
            status_code=201,
            content={"id": str(inserted_id), "message": "Asset saved successfully"}
        )
    except Exception as e:
        logger.error(f"Error creating asset: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get("/summary")
def assets_summary(page: int = Query(1, ge=1), page_size: int = Query(10, ge=1, le=100)):
    """Paginated summary of assets with serial_number, customer_name, average metrics, and health score."""
    try:
        summary = get_assets_summary_paginated_service(page, page_size)
        return {"page": page, "page_size": page_size, "summary": summary}
    except Exception as e:
        logger.error(f"Error fetching assets summary: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get("/list")
def list_assets(page: int = Query(1, ge=1), page_size: int = Query(10, ge=1, le=100)):
    """Paginated list of assets with serial_number, host_name, product_name, status."""
    try:
        assets = get_assets_list_service(page, page_size)
        return {"page": page, "page_size": page_size, "assets": assets}
    except Exception as e:
        logger.error(f"Error fetching assets list: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get("/{serial_number}")
def get_asset_details(serial_number: str):
    """Get asset details by serial number."""
    try:
        asset = get_asset_by_serial_number_service(serial_number)
        if not asset:
            raise HTTPException(status_code=404, detail="Asset not found")
        return asset
    except Exception as e:
        logger.error(f"Error fetching asset details: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.post("/assetmetrics", status_code=status.HTTP_201_CREATED)
def create_asset_metrics(assetMetrics: AssetMetrics):
    """Create a new asset metrics entry."""
    logger.info("Received asset metrics creation request")
    try:
        inserted_id = create_asset_metrics_service(assetMetrics)
        if not inserted_id:
            logger.error("Asset not saved")
            raise HTTPException(status_code=500, detail="Asset not saved")
        
        logger.info(f"Asset saved with id: {inserted_id}")
        return JSONResponse(
            status_code=201,
            content={"message": "Asset metrics created successfully"}
        )
    except Exception as e:
        logger.error(f"Error creating asset metrics: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")
