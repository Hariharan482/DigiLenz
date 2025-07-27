#!/usr/bin/env python3
"""
Efficient cross-platform system metrics collector
- Collects CPU, memory, disk, battery, uptime, device/serial/OS info including MAC address
- Posts JSON to a remote backend every 5 minutes
"""

import sys
import subprocess
import platform
import socket
import datetime
import os
import shutil
import json
import time
from threading import Lock
import uuid

# === Auto-install psutil if missing ===
try:
    import psutil
except ImportError:
    print("psutil module not found. Attempting to install with pip...")
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "psutil"])
        import site
        site.main()
        import psutil
        print("psutil installed successfully.")
    except Exception as e:
        print("Automatic installation of psutil failed:", e)
        sys.exit(1)

# === Auto-install requests if missing ===
try:
    import requests
except ImportError:
    print("requests module not found. Attempting to install with pip...")
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "requests"])
        import requests
        print("requests installed successfully.")
    except Exception as e:
        print("Automatic installation of requests failed:", e)
        sys.exit(1)

class SystemMetrics:
    def __init__(self):
        self.os_type = platform.system().lower()
        self._cpu_freq = None

    def collect_metrics(self):
        metrics = {}

        metrics["hostname"] = socket.gethostname()
        metrics["device_name"] = self.get_device_name()
        metrics["serial_number"] = self.get_serial_number() or "Unavailable"
        metrics["mac_address"] = self.get_mac_address() or "Unavailable"
        metrics["os"] = platform.system()
        metrics["os_release"] = platform.release()
        metrics["os_version"] = self.get_os_version()
        metrics["architecture"] = platform.architecture()[0]
        metrics["machine"] = platform.machine()
        metrics["processor"] = platform.processor()
        metrics["python_version"] = platform.python_version()
        metrics["timestamp"] = datetime.datetime.now(datetime.timezone.utc).isoformat()

        cpu_data = self.collect_cpu()
        memory_data = self.collect_memory()
        disk_data = self.collect_disks()
        uptime_data = self.collect_uptime()
        battery_data = self.collect_battery()
        thermal_data = self.collect_thermal()

        metrics.update(cpu_data)
        metrics.update(memory_data)
        metrics.update(disk_data)
        metrics.update(uptime_data)
        metrics.update(battery_data)
        metrics.update(thermal_data)

        return metrics

    def get_os_version(self):
        if self.os_type == "darwin":
            full_version = platform.version()
            import re
            match = re.match(r"(Darwin Kernel Version \d+(\.\d+)+)", full_version)
            if match:
                return match.group(1)
            return full_version
        else:
            return platform.version()

    def get_mac_address(self):
        """Returns the primary MAC address as a string."""
        mac_int = uuid.getnode()
        if (mac_int >> 40) % 2:
            return None
        return ':'.join(['{:02x}'.format((mac_int >> 8*i) & 0xff) for i in reversed(range(6))])

    def get_device_name(self):
        try:
            if self.os_type == "linux":
                product = vendor = ""
                for path, attr in [("/sys/class/dmi/id/product_name", "product"),
                                   ("/sys/class/dmi/id/sys_vendor", "vendor")]:
                    if os.path.exists(path):
                        with open(path, "r") as f:
                            val = f.read().strip()
                            if attr == "vendor":
                                vendor = val
                            else:
                                product = val
                return f"{vendor} {product}".strip() if vendor else product
            elif self.os_type == "windows":
                if shutil.which("powershell"):
                    cmd = (
                        "Get-CimInstance Win32_ComputerSystem | "
                        "Select-Object -ExpandProperty Model | "
                        "ConvertTo-Json"
                    )
                    out = subprocess.check_output(
                        ["powershell", "-NoProfile", "-Command", cmd],
                        text=True, timeout=5
                    ).strip()
                    return json.loads(out)
            elif self.os_type == "darwin":
                result = subprocess.check_output(
                    ["system_profiler", "SPHardwareDataType"], text=True, timeout=10
                )
                for line in result.splitlines():
                    if "Model Name" in line or "Model Identifier" in line:
                        return line.split(":")[1].strip()
        except Exception:
            pass
        return "Unknown"

    def get_serial_number(self):
        try:
            if self.os_type == "linux":
                serial = None
                path = "/sys/class/dmi/id/product_serial"
                if os.path.exists(path):
                    with open(path, "r") as f:
                        serial = f.read().strip()
                if serial and serial.lower() != "none":
                    return serial
                if shutil.which("dmidecode"):
                    try:
                        output = subprocess.check_output(
                            ["dmidecode", "-s", "system-serial-number"], text=True, timeout=5
                        ).strip()
                        if output and output.lower() != "none":
                            return output
                    except Exception:
                        pass
            elif self.os_type == "windows":
                if shutil.which("powershell"):
                    ps = (
                        "Get-CimInstance -ClassName Win32_BIOS | "
                        "Select-Object -ExpandProperty SerialNumber | ConvertTo-Json"
                    )
                    res = subprocess.run(
                        ["powershell", "-NoProfile", "-Command", ps],
                        capture_output=True, text=True, timeout=5
                    )
                    if res.returncode == 0 and res.stdout.strip():
                        try:
                            sn = json.loads(res.stdout)
                            if isinstance(sn, str) and sn.strip():
                                return sn.strip()
                        except Exception:
                            pass
                else:
                    try:
                        out = subprocess.check_output(
                            ["wmic", "bios", "get", "serialnumber"],
                            text=True, timeout=5
                        )
                        lines = out.strip().splitlines()
                        if len(lines) >= 2:
                            serial = lines[1].strip()
                            if serial and serial.lower() != "none":
                                return serial
                    except Exception:
                        pass
            elif self.os_type == "darwin":
                out = subprocess.check_output(
                    ["system_profiler", "SPHardwareDataType"], text=True, timeout=10
                )
                for line in out.splitlines():
                    if "Serial Number" in line:
                        parts = line.split(":")
                        if len(parts) > 1:
                            return parts[1].strip()
        except Exception:
            pass
        return None

    def collect_cpu(self):
        cpu_metrics = {}

        if not self._cpu_freq:
            self._cpu_freq = psutil.cpu_freq()

        cpu_metrics["physical_cpu_cores"] = psutil.cpu_count(logical=False)
        cpu_metrics["logical_cpu_cores"] = psutil.cpu_count(logical=True)

        per_core_percents = psutil.cpu_percent(interval=1, percpu=True)
        if per_core_percents:
            avg_percent = round(sum(per_core_percents) / len(per_core_percents), 1)
            cpu_metrics["avg_cpu_per_core_usage_percent"] = avg_percent
            cpu_metrics["cpu_usage_percent"] = avg_percent
        else:
            cpu_metrics["avg_cpu_per_core_usage_percent"] = 0.0
            cpu_metrics["cpu_usage_percent"] = 0.0

        freq = self._cpu_freq
        if freq and freq.current is not None:
            cpu_metrics["cpu_freq_current_mhz"] = freq.current
            cpu_metrics["cpu_freq_min_mhz"] = freq.min if freq.min is not None else 0
            cpu_metrics["cpu_freq_max_mhz"] = freq.max if freq.max is not None else 0
        else:
            cpu_metrics["cpu_freq_current_mhz"] = 0
            cpu_metrics["cpu_freq_min_mhz"] = 0
            cpu_metrics["cpu_freq_max_mhz"] = 0

        return cpu_metrics

    def collect_memory(self):
        mem_metrics = {}
        vm = psutil.virtual_memory()
        swap = psutil.swap_memory()
        mem_metrics["memory_total_gb"] = round(vm.total / (1024 ** 3), 2)
        mem_metrics["memory_used_gb"] = round(vm.used / (1024 ** 3), 2)
        mem_metrics["memory_free_gb"] = round(vm.available / (1024 ** 3), 2)
        mem_metrics["memory_used_percent"] = vm.percent
        mem_metrics["swap_total_gb"] = round(swap.total / (1024 ** 3), 2)
        mem_metrics["swap_used_gb"] = round(swap.used / (1024 ** 3), 2)
        mem_metrics["swap_used_percent"] = swap.percent
        return mem_metrics

    def collect_disks(self):
        disk_metrics = {}
        total_used = 0
        total_size = 0
        for part in psutil.disk_partitions(all=False):
            try:
                usage = psutil.disk_usage(part.mountpoint)
                total_used += usage.used
                total_size += usage.total
            except PermissionError:
                continue
        if total_size > 0:
            used_gb = total_used / (1024 ** 3)
            total_gb = total_size / (1024 ** 3)
            percent_used = (total_used / total_size) * 100
            disk_metrics["total_disk_usage_gb"] = round(used_gb, 2)
            disk_metrics["total_disk_size_gb"] = round(total_gb, 2)
            disk_metrics["total_disk_used_percent"] = round(percent_used, 1)
        else:
            disk_metrics["total_disk_usage_gb"] = None
            disk_metrics["total_disk_size_gb"] = None
            disk_metrics["total_disk_used_percent"] = None
        return disk_metrics

    def collect_uptime(self):
        uptime_metrics = {}
        boot_time = datetime.datetime.fromtimestamp(psutil.boot_time(), datetime.timezone.utc)
        now = datetime.datetime.now(datetime.timezone.utc)
        uptime = now - boot_time
        uptime_metrics["boot_time_utc"] = boot_time.isoformat()
        uptime_metrics["uptime_seconds"] = int(uptime.total_seconds())
        uptime_metrics["uptime_hms"] = str(uptime).split('.')[0]
        return uptime_metrics

    def collect_battery(self):
        battery_metrics = {}
        battery = psutil.sensors_battery()
        if battery is None:
            battery_metrics["battery_present"] = False
            return battery_metrics

        battery_metrics["battery_present"] = True
        battery_metrics["battery_percent"] = battery.percent
        battery_metrics["battery_plugged_in"] = battery.power_plugged

        if not battery.power_plugged:
            if battery.secsleft not in (psutil.POWER_TIME_UNLIMITED, psutil.POWER_TIME_UNKNOWN, None):
                battery_metrics["battery_time_left_seconds"] = battery.secsleft
                battery_metrics["battery_time_left_approx"] = self._format_battery_time(battery.secsleft)
            else:
                battery_metrics["battery_time_left_seconds"] = 0
                battery_metrics["battery_time_left_approx"] = "Unknown"
        else:
            battery_metrics["battery_time_left_seconds"] = "N/A"
            battery_metrics["battery_time_left_approx"] = "Charging or Full"

        cycles = self.get_battery_cycle_count()
        battery_metrics["battery_cycle_count"] = cycles

        return battery_metrics

    def get_battery_cycle_count(self):
        if self.os_type == "darwin":
            try:
                output = subprocess.check_output(
                    ['ioreg', '-rn', 'AppleSmartBattery'],
                    text=True,
                    timeout=5
                )
                cycles_candidates = []
                for line in output.splitlines():
                    if '"CycleCount"' in line:
                        parts = [p.strip() for p in line.split('=', 1)]
                        if len(parts) == 2:
                            val_str = parts[1].rstrip(',').strip()
                            try:
                                val_int = int(val_str)
                                cycles_candidates.append(val_int)
                            except Exception:
                                continue
                if cycles_candidates:
                    return max(cycles_candidates)
                return None
            except Exception as e:
                print(f"ERROR retrieving battery cycle count: {e}")
                return None
        elif self.os_type == "linux":
            for bat in ['BAT0', 'BAT1']:
                path = f'/sys/class/power_supply/{bat}'
                if os.path.exists(path):
                    try:
                        cfile = os.path.join(path, 'cycle_count')
                        if os.path.exists(cfile):
                            with open(cfile) as f:
                                cycles = int(f.read().strip())
                                return cycles
                    except Exception:
                        continue
            return None
        elif self.os_type == "windows":
            if shutil.which("powershell"):
                ps_script = (
                    "Get-CimInstance Win32_Battery | "
                    "Select-Object CycleCount | ConvertTo-Json"
                )
                try:
                    result = subprocess.run(
                        ["powershell", "-NoProfile", "-Command", ps_script],
                        capture_output=True, text=True, timeout=5
                    )
                    if result.returncode == 0 and result.stdout.strip():
                        data = json.loads(result.stdout)
                        if isinstance(data, list) and data and "CycleCount" in data[0]:
                            return data[0]["CycleCount"]
                        elif isinstance(data, dict) and "CycleCount" in data:
                            return data["CycleCount"]
                except Exception:
                    return None
            return None
        return None

    def _format_battery_time(self, secs):
        if secs is None:
            return "Unknown"
        hours, remainder = divmod(secs, 3600)
        minutes = remainder // 60
        return f"{hours}h {minutes}m" if hours else f"{minutes}m"

    def collect_thermal(self):
        therm_metrics = {}
        if hasattr(psutil, "sensors_temperatures"):
            temps = psutil.sensors_temperatures()
            cpu_labels = ['coretemp', 'cpu_thermal', 'k10temp', 'acpitz', 'iwlwifi']
            temps_list = []
            for label in cpu_labels:
                if label in temps:
                    for entry in temps[label]:
                        if hasattr(entry, 'current'):
                            temps_list.append({
                                "label": label,
                                "sensor": entry.label if entry.label else "unknown",
                                "temperature_c": entry.current
                            })
            if temps_list:
                therm_metrics["cpu_temperatures_c"] = temps_list
        return therm_metrics

def store_metrics(metrics_data):
    """Store metrics in a local JSON file."""
    storage_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "stored_metrics")
    os.makedirs(storage_dir, exist_ok=True)
    
    current_date = datetime.datetime.now().strftime("%Y-%m-%d")
    file_path = os.path.join(storage_dir, f"metrics_{current_date}.json")
    
    existing_data = []
    if os.path.exists(file_path):
        try:
            with open(file_path, 'r') as f:
                existing_data = json.load(f)
        except json.JSONDecodeError:
            pass
    existing_data.append(metrics_data)
    with open(file_path, 'w') as f:
        json.dump(existing_data, f, indent=2)
    
    print(f"Stored metrics at {metrics_data['timestamp']}")

def send_metrics(api_url, data):
    try:
        headers = {"Content-Type": "application/json"}
        resp = requests.post(api_url, data=json.dumps(data), headers=headers, timeout=10)
        if resp.status_code in (200, 201):
            print(f"Successfully sent metrics batch at {datetime.datetime.now().isoformat()}")
            return True
        else:
            print(f"Failed to send metrics! Status: {resp.status_code}. Response: {resp.text}")
    except Exception as e:
        print(f"Error sending metrics: {e}")
    return False

def get_unsent_dates():
    """Get a list of dates that have stored metrics files."""
    storage_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "stored_metrics")
    if not os.path.exists(storage_dir):
        return []
    
    dates = []
    today = datetime.datetime.now().date()
    for file in os.listdir(storage_dir):
        if file.startswith("metrics_") and file.endswith(".json"):
            date_str = file[8:-5]
            try:
                file_date = datetime.datetime.strptime(date_str, "%Y-%m-%d").date()
                if file_date < today:
                    dates.append(date_str)
            except ValueError:
                continue
    return sorted(dates)

def send_stored_metrics(api_url, date_str):
    """Send stored metrics for a specific date and delete the file after successful send."""
    storage_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "stored_metrics")
    if not os.path.exists(storage_dir):
        return False
    
    file_path = os.path.join(storage_dir, f"metrics_{date_str}.json")
    
    if os.path.exists(file_path):
        try:
            with open(file_path, 'r') as f:
                stored_metrics = json.load(f)
            
            if send_metrics(api_url, stored_metrics):
                os.remove(file_path)
                print(f"Successfully sent and cleared metrics for {date_str}")
                return True
            else:
                print(f"Failed to send metrics for {date_str}, file retained for retry")
        except Exception as e:
            print(f"Error processing stored metrics for {date_str}: {e}")
    return False

def check_internet():
    """Check if we have internet connectivity by trying to reach a reliable host."""
    try:
        socket.create_connection(("8.8.8.8", 53), timeout=3)
        return True
    except OSError:
        return False

def try_send_stored_data(api_url):
    """Attempt to send all stored data when internet is available."""
    if not check_internet():
        print("No internet connection available, will try again later")
        return False
    all_dates = get_unsent_dates()
    today = datetime.datetime.now().strftime("%Y-%m-%d")
    if os.path.exists(os.path.join(os.path.dirname(os.path.abspath(__file__)), 
                                  "stored_metrics", f"metrics_{today}.json")):
        all_dates.append(today)

    success = True
    for date in all_dates:
        if not send_stored_metrics(api_url, date):
            success = False
            break
    
    return success

def main():
    api_url = "http://digilenz.southindia.cloudapp.azure.com:8000/asset-metrics"
    metrics = SystemMetrics()
    last_send_attempt = 0
    send_interval = 300
    
    while True:
        current_time = time.time()
        if current_time - last_send_attempt >= send_interval:
            if try_send_stored_data(api_url):
                print("Successfully sent all stored metrics")
            last_send_attempt = current_time
        all_metrics = metrics.collect_metrics()
        print(json.dumps(all_metrics, indent=2))
        store_metrics(all_metrics)
        time.sleep(300)

if __name__ == "__main__":
    main()