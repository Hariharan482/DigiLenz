from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    app_name: str = "DigiLenz FastAPI Backend"
    mongodb_uri: str = "mongodb://localhost:27017"
    database_name: str = "digilenz"
    smtp_user: str = ""
    smtp_pass: str = ""

    class Config:
        env_file = ".env"

settings = Settings()
