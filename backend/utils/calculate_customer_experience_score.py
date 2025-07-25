def calculate_customer_experience_score(average_cpu, average_memory, average_battery) -> float:
    score = 100.0
    score -= average_cpu * 0.3
    score -= average_memory * 0.25
    if average_battery is not None and average_battery < 20:
        score -= (20 - average_battery) * 0.5
    return max(0.0, min(100.0, score))
