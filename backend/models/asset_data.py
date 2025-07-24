from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class AssetData(BaseModel):
    serial_number: int = Field(..., alias="serial number")
    timestamp: Optional[datetime] = None
    cpu: float
    battery: float
    memory: float
    disk_usage: float
    uptime: float
    disk_type: float
    os_version: float
    thermal: float

