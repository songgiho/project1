from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.core.auth import get_current_user, get_current_active_user
from app.schemas.user import UserRead
from pydantic import BaseModel

router = APIRouter()

class ProfileResponse(BaseModel):
    id: int
    username: str
    email: str
    message: str

class ChallengeCreate(BaseModel):
    title: str
    description: str
    target_days: int

class ChallengeResponse(BaseModel):
    id: int
    title: str
    description: str
    target_days: int
    user_id: int

@router.get("/me", response_model=ProfileResponse)
def get_my_profile(current_user: User = Depends(get_current_active_user)):
    """내 프로필 정보 조회 (보호된 API)"""
    return ProfileResponse(
        id=int(current_user.id),
        username=str(current_user.username),
        email=str(current_user.email),
        message="인증된 사용자입니다!"
    )

@router.get("/protected-test")
def protected_test(current_user: User = Depends(get_current_user)):
    """보호된 API 테스트"""
    return {
        "message": "이 API는 JWT 토큰이 필요합니다!",
        "user_id": current_user.id,
        "username": current_user.username
    }

@router.post("/challenges", response_model=ChallengeResponse)
def create_challenge(
    challenge: ChallengeCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """챌린지 생성 (보호된 API)"""
    # 실제로는 Challenge 모델을 만들어서 데이터베이스에 저장해야 합니다
    # 여기서는 예시로 간단히 반환합니다
    return ChallengeResponse(
        id=1,
        title=challenge.title,
        description=challenge.description,
        target_days=challenge.target_days,
        user_id=int(current_user.id)
    )

@router.get("/challenges/my")
def get_my_challenges(current_user: User = Depends(get_current_active_user)):
    """내 챌린지 목록 조회 (보호된 API)"""
    # 실제로는 데이터베이스에서 조회해야 합니다
    return {
        "message": f"{current_user.username}님의 챌린지 목록입니다",
        "challenges": [
            {"id": 1, "title": "30일 운동 챌린지", "progress": 15},
            {"id": 2, "title": "독서 챌린지", "progress": 8}
        ]
    } 