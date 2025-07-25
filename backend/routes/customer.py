

from fastapi import APIRouter, HTTPException, Query, status
from fastapi.responses import JSONResponse
from core.logging import logger
from models.schemas import Customer
from services.customer_service import (
    create_customer_service
)

router = APIRouter(prefix="/customers", tags=["customers"])

@router.post("/customer", status_code=status.HTTP_201_CREATED)
def create_asset(asset: Customer):
    """Create a new customer."""
    logger.info("Received customer creation request")
    try:
        inserted_id = create_customer_service(asset)
        if not inserted_id:
            logger.error("Customer not saved")
            raise HTTPException(status_code=500, detail="Customer not saved")
        
        logger.info(f"Customer saved with id: {inserted_id}")
        return JSONResponse(
            status_code=201,
            content={"id": str(inserted_id), "message": "Customer saved successfully"}
        )
    except Exception as e:
        logger.error(f"Error creating customer: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")
