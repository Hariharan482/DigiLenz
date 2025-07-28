import logging
import requests
from datetime import datetime, timedelta
from typing import List, Dict, Any
from crud.asset_metrics_crud import fetch_assets, fetch_asset_metrics, update_asset_life_estimate
from core.config import settings

# --- Logging setup (similar to routes) ---
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger("asset_life_scheduler")

# --- ENV config ---
AZURE_OPENAI_API_KEY = settings.AZURE_OPENAI_API_KEY
AZURE_OPENAI_ENDPOINT = settings.AZURE_OPENAI_ENDPOINT
AZURE_OPENAI_DEPLOYMENT = getattr(settings, "AZURE_OPENAI_DEPLOYMENT", "gpt-4o")
AZURE_OPENAI_API_VERSION = getattr(settings, "AZURE_OPENAI_API_VERSION", "2025-01-01-preview")

# --- Azure OpenAI call ---
def get_life_estimate_from_openai(metrics_summary: Dict[str, Any]) -> float:
    prompt = (
        "Given the following device metrics summary, estimate the expected remaining device life in years as a float. "
        "Respond with only a float value.\n"
        f"Metrics: {metrics_summary}"
    )
    headers = {
        "api-key": AZURE_OPENAI_API_KEY,
        "Content-Type": "application/json"
    }
    url = f"{AZURE_OPENAI_ENDPOINT}/openai/deployments/{AZURE_OPENAI_DEPLOYMENT}/chat/completions?api-version={AZURE_OPENAI_API_VERSION}"
    data = {
        "messages": [
            {"role": "system", "content": "You are an expert device health analyst."},
            {"role": "user", "content": prompt}
        ],
        "max_tokens": 10,
        "temperature": 0.0
    }
    try:
        resp = requests.post(url, headers=headers, json=data, timeout=30)
        resp.raise_for_status()
        result = resp.json()
        content = result["choices"][0]["message"]["content"].strip()
        estimate = float(content)
        return estimate
    except Exception as e:
        logger.error(f"OpenAI API error: {e}")
        raise

# --- Aggregation helper ---
def aggregate_metrics(metrics: List[Dict[str, Any]]) -> Dict[str, float]:
    if not metrics:
        return {}
    keys = [k for k in metrics[0].keys() if isinstance(metrics[0][k], (int, float))]
    summary = {}
    for k in keys:
        values = [m[k] for m in metrics if k in m and isinstance(m[k], (int, float))]
        if values:
            summary[f"avg_{k}"] = sum(values) / len(values)
            summary[f"min_{k}"] = min(values)
            summary[f"max_{k}"] = max(values)
    return summary

# --- Main job ---
def estimate_asset_life_job():
    logger.info("Starting asset life estimation job...")
    assets = fetch_assets()
    since = datetime.utcnow() - timedelta(days=1)
    for asset in assets:
        serial = asset["serial_number"]
        try:
            metrics = fetch_asset_metrics(serial, since)
            if not metrics:
                logger.warning(f"No metrics for asset {serial} in last 24h.")
                continue
            summary = aggregate_metrics(metrics)
            estimate = get_life_estimate_from_openai(summary)
            update_asset_life_estimate(serial, estimate)
        except Exception as e:
            logger.error(f"Failed for asset {serial}: {e}")
    logger.info("Asset life estimation job complete.")
