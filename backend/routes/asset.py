from fastapi import APIRouter, HTTPException, Query, status
from fastapi.responses import JSONResponse
from core.logging import logger
from typing import Dict
from models.schemas import Asset
from datetime import datetime

from services.asset_service import (
    create_asset_service,
    get_assets_list_service,
    get_asset_by_serial_number_service,
    get_assets_summary_paginated_service,
    get_device_health_count,
    get_devices_by_age_service,
    get_inactive_assets_count_service,
    get_device_health_summary_service
)

router = APIRouter(prefix="/assets", tags=["assets"])

@router.post("/", status_code=status.HTTP_201_CREATED)
def create_asset(asset: Asset):
    """Create a new asset."""
    try:
        if isinstance(asset, dict):
            asset = Asset(**asset)
        inserted_id = create_asset_service(asset)
        if not inserted_id:
            logger.error("Asset not saved")
            raise HTTPException(status_code=500, detail="Asset not saved")
        logger.info(f"Asset saved with id: {inserted_id}")
        return JSONResponse(
            status_code=201,
            content={"id": str(inserted_id), "message": "Asset saved successfully"}
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating asset: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get("/summary")
def assets_summary(page: int = Query(1, ge=1), page_size: int = Query(10, ge=1, le=100)):
    """Paginated summary of assets with serial_number, customer_name, average metrics, and health score."""
    try:
        summary = get_assets_summary_paginated_service(page, page_size)
        return {    
            "page": page,
            "page_size": page_size,
            "total_pages": summary.get("total_pages", 1),
            "total_count": summary.get("total_count", 0),
            "summary": summary["summary"],
            "assets": summary["assets"]
        }    
    except Exception as e:
        logger.error(f"Error fetching assets summary: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get("/list")
def list_assets(page: int = Query(1, ge=1), page_size: int = Query(10, ge=1, le=100)):
    """Paginated list of assets with serial_number, host_name, product_name, status."""
    try:
        return get_assets_list_service(page, page_size)
    except Exception as e:
        logger.error(f"Error fetching assets list: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.get("/health-count")
def get_device_health_assets():
    """Get count of devices by health status."""
    try:
        health_count = get_device_health_count()
        return health_count
    except Exception as e:
        logger.error(f"Error fetching device health count: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get("/devices-by-age")
def get_devices_by_age():
    """Get devices categorized by age and health status."""
    try:
        age_data = get_devices_by_age_service()
        return age_data
    except Exception as e:
        logger.error(f"Error fetching devices by age: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")
    
@router.get("/inactive-count")
def get_inactive_assets_count():
    """Get count of inactive assets."""
    try:
        inactive_count = get_inactive_assets_count_service()
        return {"inactive_count": inactive_count}
    except Exception as e:
        logger.error(f"Error fetching inactive assets count: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")
    
@router.get("/health-summary")
def get_device_health_summary(score_threshold: int = 70):
    """Get summary of device health including average age, health score, CPU utilization, and percentage below threshold."""
    try:
        summary = get_device_health_summary_service(score_threshold)
        return summary
    except Exception as e:
        logger.error(f"Error fetching device health summary: {str(e)}")
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
    
