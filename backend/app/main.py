"""
FastAPI 애플리케이션 메인 파일
애플리케이션의 진입점입니다.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import create_tables

# FastAPI 애플리케이션 생성
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="다이어트 앱 백엔드 API",
    docs_url="/docs",  # Swagger UI
    redoc_url="/redoc",  # ReDoc
)

# CORS 미들웨어 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup_event():
    """애플리케이션 시작 시 실행되는 이벤트"""
    print("🚀 애플리케이션이 시작되었습니다!")
    # 데이터베이스 테이블 생성 (임시로 비활성화)
    create_tables()
    print("✅ 데이터베이스 테이블이 생성되었습니다!")
    # print("⚠️ 데이터베이스 연결이 비활성화되었습니다.")


@app.on_event("shutdown")
async def shutdown_event():
    """애플리케이션 종료 시 실행되는 이벤트"""
    print("👋 애플리케이션이 종료되었습니다!")


# 기본 라우트
@app.get("/")
async def root():
    """루트 엔드포인트"""
    return {
        "message": "다이어트 앱 API에 오신 것을 환영합니다!",
        "version": settings.APP_VERSION,
        "docs": "/docs"
    }


@app.get("/health")
async def health_check():
    """헬스체크 엔드포인트"""
    return {
        "status": "healthy",
        "message": "서버가 정상적으로 작동하고 있습니다!"
    }


# API 라우터들을 여기에 추가할 예정
# from app.api.v1 import auth, users, logs, challenges
# app.include_router(auth.router, prefix="/api/v1/auth", tags=["인증"])
# app.include_router(users.router, prefix="/api/v1/users", tags=["사용자"])
# app.include_router(logs.router, prefix="/api/v1/logs", tags=["식사 로그"])
# app.include_router(challenges.router, prefix="/api/v1/challenges", tags=["챌린지"])


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,  # 개발 모드에서 코드 변경 시 자동 재시작
        log_level="info"
    ) 
    
    
from app.api.v1 import users
from app.api.v1 import auth
from app.api.v1 import protected

app.include_router(users.router, prefix="/api/v1/users", tags=["users"])
app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(protected.router, prefix="/api/v1/protected", tags=["protected"])