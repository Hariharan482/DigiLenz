from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    app_name: str = "DigiLenz FastAPI Backend"
    mongodb_uri: str = "mongodb://localhost:27017"
    database_name: str = "digilenz"
    SMTP_USER: str = ""
    SMTP_PASS: str = ""
    AZURE_OPENAI_API_KEY: str = ""
    AZURE_OPENAI_ENDPOINT: str = ""
    AZURE_OPENAI_DEPLOYMENT: str = ""
    AZURE_OPENAI_API_VERSION: str = ""
    
    class Config:
        env_file = ".env"

settings = Settings()
