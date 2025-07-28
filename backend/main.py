from fastapi import FastAPI
from contextlib import asynccontextmanager
from core.logging import logger
from routes.asset import router as asset_router
from routes.assetMetrics import router as asset_metrics_router
from routes.customer import router as customer_router
from routes.email_report import router as email_report_router
from fastapi.middleware.cors import CORSMiddleware  
from fastapi import Request
from scripts.asset_life_scheduler import estimate_asset_life_job, fetch_assets, fetch_asset_metrics, aggregate_metrics, get_life_estimate_from_openai, update_asset_life_estimate
from apscheduler.schedulers.background import BackgroundScheduler
from datetime import datetime

@asynccontextmanager
async def lifespan(app: FastAPI):
    scheduler = BackgroundScheduler()
    scheduler.add_job(estimate_asset_life_job, 'cron', day_of_week='mon', hour=0, minute=0)
    scheduler.start()
    try:
        yield
    finally:
        scheduler.shutdown()

app = FastAPI(lifespan=lifespan)

@app.middleware("http")
async def log_request_access(request: Request, call_next):
    logger.info(f"Accessed {request.method} {request.url.path}")
    response = await call_next(request)
    return response

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
app.include_router(email_report_router)
