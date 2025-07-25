from fastapi import FastAPI
from core.logging import logger
from routes.asset import router as asset_router
from routes.assetMetrics import router as asset_metrics_router

app = FastAPI()


@app.get("/")
def read_root():
    logger.info("Root endpoint accessed")
    return {"message": "Welcome to DigiLenz FastAPI backend!"}

app.include_router(asset_router)
app.include_router(asset_metrics_router)

# Future: Include routers from routes folder here
# from routes import example_router
# app.include_router(example_router)
