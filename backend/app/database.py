"""
데이터베이스 연결 관리
SQLAlchemy를 사용하여 PostgreSQL과 연결합니다.
"""

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.config import settings

# 데이터베이스 엔진 생성
engine = create_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True,  # 연결 상태 확인
    pool_recycle=300,    # 5분마다 연결 재생성
)

# 세션 팩토리 생성
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# 기본 모델 클래스
Base = declarative_base()


def get_db():
    """
    데이터베이스 세션을 제공하는 의존성 함수
    각 API 요청마다 새로운 세션을 생성합니다.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def create_tables():
    """데이터베이스 테이블을 생성합니다."""
    Base.metadata.create_all(bind=engine)


def drop_tables():
    """데이터베이스 테이블을 삭제합니다. (개발용)"""
    Base.metadata.drop_all(bind=engine) 