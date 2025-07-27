from typing import Optional

def calculate_customer_experience_score(
    average_cpu: float, 
    average_memory: float, 
    average_battery: Optional[float] = None
) -> float:
    weights = {
        'cpu': 0.50,      
        'memory': 0.35,   
        'battery': 0.15   
    }
    total_score = total_weight = 0.0
    if average_cpu is not None:
        total_score += _calculate_cpu_score(average_cpu) * weights['cpu']
        total_weight += weights['cpu']
    if average_memory is not None:
        total_score += _calculate_memory_score(average_memory) * weights['memory']
        total_weight += weights['memory']
    if average_battery is not None:
        total_score += _calculate_battery_score(average_battery) * weights['battery']
        total_weight += weights['battery']
    return max(0.0, min(100.0, total_score / total_weight))


def _calculate_cpu_score(cpu_usage: float) -> float:
    if cpu_usage <= 30:
        return 100.0
    elif cpu_usage <= 50:
        return 100.0 - (cpu_usage - 30) * 1.0
    elif cpu_usage <= 80:
        return 80.0 - (cpu_usage - 50) * 1.5
    else:
        return max(20.0, 35.0 - (cpu_usage - 80) * 2.0)


def _calculate_memory_score(memory_usage: float) -> float:
    if memory_usage <= 40:
        return 100.0
    elif memory_usage <= 70:
        return 100.0 - (memory_usage - 40) * 1.0
    elif memory_usage <= 90:
        return 70.0 - (memory_usage - 70) * 2.0
    else:
        return max(20.0, 30.0 - (memory_usage - 90) * 3.0)


def _calculate_battery_score(battery_percent: float) -> float:
    if battery_percent >= 80:
        return 100.0
    elif battery_percent >= 50:
        return 100.0 - (80 - battery_percent) * 1.0
    elif battery_percent >= 20:
        return 70.0 - (50 - battery_percent) * 1.5
    else:
        return max(20.0, 25.0 - (20 - battery_percent) * 2.0)
