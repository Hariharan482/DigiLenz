
from fastapi import APIRouter, HTTPException, Query, status
from fastapi.responses import JSONResponse
from services.asset_metric_service import create_asset_metrics_service
from core.logging import logger
from models.schemas import  AssetMetrics

router = APIRouter(prefix="/asset-metrics", tags=["assets-metrics"])

@router.post("/", status_code=status.HTTP_201_CREATED)
def create_asset_metrics(assetMetrics: AssetMetrics):
    """Create a new asset metrics entry."""
    logger.info("Received asset metrics creation request")
    try:
        inserted_id = create_asset_metrics_service(assetMetrics)
        if not inserted_id:
            logger.error("Asset metrics not saved")
            raise HTTPException(status_code=500, detail="Asset metrics not saved")
        
        logger.info(f"Asset metrics saved with id: {inserted_id}")
        return JSONResponse(
            status_code=201,
            content={"id": str(inserted_id), "message": "Asset metrics saved successfully"}
        )
    except Exception as e:
        print(e)
        logger.error(f"Error creating asset metrics: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")
