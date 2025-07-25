from db.mongodb import mongodb
from models.schemas import Customer

def create_customer(customer: Customer) -> str:
    """Create a new customer in the database, using customer_id as _id."""
    customer_dict = customer.model_dump(by_alias=True)
    customer_dict["_id"] = customer.customer_id  # Set _id to customer_id

    collection = mongodb.get_collection("customers")
    collection.insert_one(customer_dict)

    return customer.customer_id