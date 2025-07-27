from fastapi import FastAPI
from core.logging import logger
from routes.asset import router as asset_router
from routes.assetMetrics import router as asset_metrics_router
from routes.customer import router as customer_router   
from fastapi.middleware.cors import CORSMiddleware  

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    logger.info("Root endpoint accessed")
    return {"message": "Welcome to DigiLenz FastAPI backend!"}

app.include_router(asset_router)
app.include_router(asset_metrics_router)
app.include_router(customer_router)
