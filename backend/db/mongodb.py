from pymongo import MongoClient
from core.config import settings

class MongoDB:
    def __init__(self):
        self.client = MongoClient(settings.mongodb_uri)
        self.db = self.client[settings.database_name]

    def get_collection(self, collection_name):
        return self.db[collection_name]

mongodb = MongoDB()

# Example usage:
# collection = mongodb.get_collection("assets")
# result = collection.find_one({})
