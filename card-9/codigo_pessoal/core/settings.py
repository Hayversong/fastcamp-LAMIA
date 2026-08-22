from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file='.env',
        env_file_encoding='utf-8',
    )

    database_url: str = 'postgresql://admin:admin123@localhost:5432/fastcamp'


settings = Settings()
