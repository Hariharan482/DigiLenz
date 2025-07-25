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
    last_active: Optional[datetime] = None
    customer_id: Customer  # Reference to Customer
    
class AssetMetrics(BaseModel):
    id: Optional[str] = None  # _id in MongoDB
    hostname: str
    serial_number: str
    device_name: str
    mac_address:str
    os: str
    os_version: str
    os_release: str
    architecture: str
    machine: str
    processor: str
    python_version: str
    timestamp: datetime
    physical_cpu_cores: int
    logical_cpu_cores: int
    avg_cpu_per_core_usage_percent: float
    cpu_usage_percent: float
    cpu_freq_current_mhz : Optional[float] = None
    cpu_freq_min_mhz : Optional[float] = None
    cpu_freq_max_mhz : Optional[float] = None
    memory_total_gb: float
    memory_used_gb: float
    memory_free_gb: float
    memory_used_percent: float
    swap_total_gb: float
    swap_used_gb: float
    swap_used_percent: float
    total_disk_usage_gb: float
    total_disk_size_gb: float
    total_disk_used_percent: float
    boot_time_utc: datetime
    uptime_seconds: float
    uptime_hms: str
    battery_present: bool
    battery_percent: Optional[float] = None
    battery_plugged_in: Optional[bool] = None
    battery_time_left_seconds: Optional[float] = None
    battery_time_left_approx: Optional[str] = None
    battery_cycle_count: Optional[int] = None
