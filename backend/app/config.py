"""
애플리케이션 설정 관리
환경 변수와 기본 설정값들을 관리합니다.
"""

import os
from typing import Optional
from pydantic_settings import BaseSettings
from dotenv import load_dotenv


# .env 파일을 강제로 환경변수로 로딩
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), ".env"))
print("DEBUG: .env DATABASE_URL =", os.getenv("DATABASE_URL"))

class Settings(BaseSettings):
    """애플리케이션 설정 클래스"""
    
    # 기본 설정
    APP_NAME: str = "Diet App API"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False
    
    # 데이터베이스 설정
    DATABASE_URL: str
    
    # Redis 설정
    REDIS_URL: str = "redis://localhost:6379"
    
    # JWT 설정
    SECRET_KEY: str = "your-secret-key-here-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # 카카오 OAuth 설정
    KAKAO_CLIENT_ID: Optional[str] = None
    KAKAO_CLIENT_SECRET: Optional[str] = None
    KAKAO_REDIRECT_URI: str = "http://localhost:3000/auth/kakao/callback"
    
    # 파일 업로드 설정
    UPLOAD_DIR: str = "uploads"
    MAX_FILE_SIZE: int = 10 * 1024 * 1024  # 10MB
    
    # CORS 설정
    ALLOWED_ORIGINS: list = [
        "http://localhost:3000",  # Next.js 개발 서버
        "http://localhost:3001",
    ]
    
    class Config:
        env_file = ".env"
        case_sensitive = True


# 설정 인스턴스 생성
settings = Settings()


# 환경별 설정
def get_settings() -> Settings:
    """환경별 설정을 반환합니다."""
    return settings 
