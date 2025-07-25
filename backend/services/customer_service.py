
from models.schemas import Customer
from crud.customer_crud import create_customer

def create_customer_service(asset: Customer) -> str:
    """Create a new customer with business logic validation."""
    return create_customer(asset)