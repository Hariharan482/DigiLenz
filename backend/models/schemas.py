from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class Customer(BaseModel):
    customer_id: str
    customer_name: str
    customer_phone: Optional[str] = None
    customer_email: Optional[str] = None

class Asset(BaseModel):
    serial_number: str
    product_name: str
    host_name: str
    status: str
    health_score: Optional[float] = None
    average_cpu: Optional[float] = None
    average_battery: Optional[float] = None
    average_memory: Optional[float] = None
    customer_id: str  # Reference to Customer

class AssetMetrics(BaseModel):
    id: Optional[str] = None  # _id in MongoDB
    serial_number: int = Field(..., alias="serial number")  # Reference to Asset
    timestamp: Optional[datetime] = None
    cpu: Optional[float] = None
    battery: Optional[float] = None
    memory: Optional[float] = None
    disk_usage: Optional[float] = None
    uptime: Optional[float] = None
    disk_type: Optional[float] = None
    os_version: Optional[float] = None
    thermal: Optional[float] = None
