from pydantic import BaseModel, Field
from typing import Optional, List, Dict
from datetime import date, datetime

class ChallengeBase(BaseModel):
    name: str
    description: Optional[str] = None
    start_date: date
    end_date: date
    target_type: str
    target_value: float
    max_participants: Optional[int] = None

class ChallengeCreate(ChallengeBase):
    pass

class Challenge(ChallengeBase):
    id: int
    is_active: bool
    created_at: datetime
    updated_at: datetime
    class Config:
        orm_mode = True

class ChallengeParticipantBase(BaseModel):
    status: str = 'survived'
    current_streak: int = 0
    elimination_date: Optional[date] = None

class ChallengeParticipant(ChallengeParticipantBase):
    id: int
    user_id: int
    challenge_id: int
    joined_at: datetime
    class Config:
        orm_mode = True

class ChallengeRecordBase(BaseModel):
    date: date
    calorie: Optional[float] = None
    macros: Optional[Dict[str, float]] = None
    image_url: Optional[str] = None
    is_success: bool = False

class ChallengeRecord(ChallengeRecordBase):
    id: int
    user_id: int
    challenge_id: int
    participant_id: int
    created_at: datetime
    class Config:
        orm_mode = True 