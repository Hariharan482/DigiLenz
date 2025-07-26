import datetime
from fastapi import APIRouter, HTTPException, Query, status
from fastapi.responses import JSONResponse
from core.logging import logger
from models.schemas import Asset
from services.asset_service import (
    create_asset_service,
    get_assets_list_service,
    get_asset_by_serial_number_service,
    get_assets_summary_paginated_service,
    get_device_health_count
)
from typing import Dict

router = APIRouter(prefix="/assets", tags=["assets"])

@router.post("/", status_code=status.HTTP_201_CREATED)
def create_asset(asset: Dict):
    """Create a new asset."""
    logger.info("Received asset creation request")
    try:
        # Extract customer_id as string
        customer_id = asset.get("customer_id")
        if not customer_id:
            raise HTTPException(status_code=400, detail="customer_id is required")

        # Fetch customer from DB
        from db.mongodb import mongodb
        customer_collection = mongodb.get_collection("customers")
        customer = customer_collection.find_one({"_id": customer_id})

        if not customer:
            raise HTTPException(status_code=404, detail=f"Customer with ID '{customer_id}' not found")

        # Replace customer_id with full customer object
        asset["customer_id"] = customer
        # Now validate and create Asset model
        asset_obj = Asset(**asset)
        asset_obj.created_at = datetime.now()
        inserted_id = create_asset_service(asset_obj)
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
        print(e)
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get("/summary")
def assets_summary(page: int = Query(1, ge=1), page_size: int = Query(10, ge=1, le=100)):
    """Paginated summary of assets with serial_number, customer_name, average metrics, and health score."""
    try:
        summary = get_assets_summary_paginated_service(page, page_size)
        return {"page": page, "page_size": page_size, "summary":summary["summary"], "assets": summary["assets"]}
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
    from services.asset_service import get_devices_by_age
    try:
        age_data = get_devices_by_age()
        return age_data
    except Exception as e:
        logger.error(f"Error fetching devices by age: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")
    
@router.get("/inactive-count")
def get_inactive_assets_count():
    """Get count of inactive assets."""
    from services.asset_service import get_inactive_assets_count
    try:
        inactive_count = get_inactive_assets_count()
        return {"inactive_count": inactive_count}
    except Exception as e:
        logger.error(f"Error fetching inactive assets count: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")
    
@router.get("/health-summary")
def get_device_health_summary(score_threshold: int = 70):
    """Get summary of device health including average age, health score, CPU utilization, and percentage below threshold."""
    try:
        from services.asset_service import get_device_health_summary
        summary = get_device_health_summary(score_threshold)
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
    
