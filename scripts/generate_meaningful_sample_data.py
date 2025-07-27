
import requests
import random
import string
from datetime import datetime, timedelta
import uuid

BACKEND_URL = "http://localhost:8000"  # Change if your backend runs elsewhere
CUSTOMER_ENDPOINT = f"{BACKEND_URL}/customers/customer"
ASSET_ENDPOINT = f"{BACKEND_URL}/assets/"
ASSET_METRICS_ENDPOINT = f"{BACKEND_URL}/asset-metrics/"

# Helper functions
def random_string(length=8):
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=length))

def random_mac():
    return ":".join(f"{random.randint(0, 255):02x}" for _ in range(6))

def random_status():
    return random.choice(["Active", "Inactive"])

def random_health_score():
    return random.choice([0, 50, 72, 88, 100, None])

def random_avg():
    return round(random.uniform(0, 100), 2)

def random_date(days_ago=0):
    return (datetime.now() - timedelta(days=days_ago)).isoformat()

# 1. Create 5 customers with names ending in 'Solutions' and unique customer_id
customer_names = [
    f"{prefix} Solutions" for prefix in [
        "Alpha", "Beta", "Gamma", "Delta", "Epsilon"
    ]
]
customers = []
for i, name in enumerate(customer_names):
    customer_id = str(uuid.uuid4())
    customer = {
        "customer_id": customer_id,
        "customer_name": name,
        "customer_email": f"contact@{name.lower().replace(' ', '')}.com",
        "customer_phone": f"+91-90000000{i+1}"
    }
    resp = requests.post(CUSTOMER_ENDPOINT, json=customer)
    resp.raise_for_status()
    customers.append(customer)
    print(f"Created customer: {customer['customer_name']} (ID: {customer_id})")

# 2. For each customer, create 15 laptops with 9:1 active:inactive ratio
assets = []
for cust in customers:
    statuses = ["Active"] * 9 + ["Inactive"] * 1
    statuses = (statuses * 2)[:15]
    random.shuffle(statuses)
    for j in range(15):
        asset_type = "Laptop"
        device_age_days = random.randint(0, 5 * 365)
        created_at = datetime.now() - timedelta(days=device_age_days)
        last_active_days_ago = random.randint(0, min(100, device_age_days))
        last_active = created_at + timedelta(days=last_active_days_ago)
        asset = {
            "serial_number": f"{asset_type[:3].upper()}-{random_string(7)}",
            "product_name": f"{asset_type} Model {random.randint(100,999)}",
            "host_name": f"{asset_type.lower()}-{random_string(4).lower()}",
            "status": statuses[j],
            "health_score": random_health_score(),
            "average_cpu": random_avg(),
            "average_battery": random_avg(),
            "average_memory": random_avg(),
            "customer_id": cust["customer_id"],
            "created_at": created_at.isoformat(),
            "last_active": last_active.isoformat(),
        }
        print(f"Posting asset payload: {asset}")
        resp = requests.post(ASSET_ENDPOINT, json=asset)
        if resp.status_code != 201:
            print(f"Asset creation failed for {asset['serial_number']} (customer: {cust['customer_name']})")
            print(f"Status: {resp.status_code}, Response: {resp.text}")
            resp.raise_for_status()
        asset_id = resp.json().get("id")
        asset["id"] = asset_id
        asset["_created_at_dt"] = created_at  # for metric generation
        assets.append(asset)
        print(f"Created asset: {asset['serial_number']} for {cust['customer_name']}")

# 3. For each asset, create 15 asset metrics with varied values
for asset in assets:
    created_at_dt = asset["_created_at_dt"]
    device_age_days = (datetime.now() - created_at_dt).days
    for k in range(15):
        # Boot time: between device creation and now
        boot_offset_days = random.randint(0, device_age_days)
        boot_time = created_at_dt + timedelta(days=boot_offset_days)
        # Metric timestamp: after boot, up to now
        metric_offset_days = random.randint(0, (datetime.now() - boot_time).days)
        metric_timestamp = boot_time + timedelta(days=metric_offset_days)
        metric = {
            "hostname": asset["host_name"],
            "serial_number": asset["serial_number"],
            "device_name": asset["product_name"],
            "mac_address": random_mac(),
            "os": random.choice(["Windows 10", "Ubuntu 22.04", "macOS 13"]),
            "os_version": random.choice(["10.0.19045", "22.04", "13.4"]),
            "os_release": random.choice(["19045", "22.04", "22E252"]),
            "architecture": random.choice(["x86_64", "arm64"]),
            "machine": random.choice(["x86_64", "arm64"]),
            "processor": random.choice(["Intel", "AMD", "Apple M1"]),
            "python_version": random.choice(["3.11.4", "3.10.12", "3.9.18"]),
            "timestamp": metric_timestamp.isoformat(),
            "physical_cpu_cores": random.randint(2, 8),
            "logical_cpu_cores": random.randint(2, 16),
            "avg_cpu_per_core_usage_percent": random_avg(),
            "cpu_usage_percent": random.choice([0, 10, 50, 75, 99, random_avg()]),
            "cpu_freq_current_mhz": random.uniform(800, 3500),
            "cpu_freq_min_mhz": random.uniform(800, 1200),
            "cpu_freq_max_mhz": random.uniform(2000, 4000),
            "memory_total_gb": random.uniform(4, 64),
            "memory_used_gb": random.uniform(1, 32),
            "memory_free_gb": random.uniform(1, 32),
            "memory_used_percent": random_avg(),
            "swap_total_gb": random.uniform(0, 16),
            "swap_used_gb": random.uniform(0, 8),
            "swap_used_percent": random_avg(),
            "total_disk_usage_gb": random.uniform(10, 1000),
            "total_disk_size_gb": random.uniform(100, 2000),
            "total_disk_used_percent": random_avg(),
            "boot_time_utc": boot_time.isoformat(),
            "uptime_seconds": random.uniform(1000, 1000000),
            "uptime_hms": f"{random.randint(0, 23)}:{random.randint(0, 59)}:{random.randint(0, 59)}",
            "battery_present": random.choice([True, False]),
            "battery_percent": random.choice([0, 15, 50, 80, 100, random_avg()]),
            "battery_plugged_in": random.choice([True, False]),
            "battery_time_left_seconds": random.uniform(0, 100000),
            "battery_time_left_approx": f"{random.randint(0, 5)}h {random.randint(0, 59)}m",
            "battery_cycle_count": random.randint(0, 1000),
        }
        resp = requests.post(ASSET_METRICS_ENDPOINT, json=metric)
        if resp.status_code != 201:
            print(f"Asset metric creation failed for {asset['serial_number']} (metric {k+1})")
            print(f"Status: {resp.status_code}, Response: {resp.text}")
            resp.raise_for_status()
    print(f"Created 15 metrics for asset: {asset['serial_number']}")

print("Meaningful sample data generation complete.")
