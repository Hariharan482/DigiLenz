import logging

LOG_FORMAT = "% (asctime)s - %(levelname)s - %(name)s - %(message)s"
LOG_LEVEL = logging.INFO

logging.basicConfig(level=LOG_LEVEL, format=LOG_FORMAT)
logger = logging.getLogger("digilenz")

# Example usage:
# logger.info("This is an info message.")
