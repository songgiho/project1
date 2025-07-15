from sqlalchemy import Column, Integer, String, Text, Date, DateTime, Boolean, ForeignKey, Float, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from .user import User  # 유저 모델 참조
from backend.app.database import Base

class Challenge(Base):
    __tablename__ = 'challenges'
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    target_type = Column(String(20), nullable=False)  # calorie, macro, weight 등
    target_value = Column(Float, nullable=False)
    max_participants = Column(Integer, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    participants = relationship('ChallengeParticipant', back_populates='challenge', cascade='all, delete-orphan')
    records = relationship('ChallengeRecord', back_populates='challenge', cascade='all, delete-orphan')

class ChallengeParticipant(Base):
    __tablename__ = 'challenge_participants'
    id = Column(Integer, primary_key=True, index=True)
    challenge_id = Column(Integer, ForeignKey('challenges.id', ondelete='CASCADE'), nullable=False)
    user_id = Column(Integer, ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    status = Column(String(20), default='survived')  # survived, eliminated
    current_streak = Column(Integer, default=0)
    elimination_date = Column(Date, nullable=True)
    joined_at = Column(DateTime, default=datetime.utcnow)

    challenge = relationship('Challenge', back_populates='participants')
    user = relationship('User')
    records = relationship('ChallengeRecord', back_populates='participant', cascade='all, delete-orphan')

class ChallengeRecord(Base):
    __tablename__ = 'challenge_records'
    id = Column(Integer, primary_key=True, index=True)
    challenge_id = Column(Integer, ForeignKey('challenges.id', ondelete='CASCADE'), nullable=False)
    participant_id = Column(Integer, ForeignKey('challenge_participants.id', ondelete='CASCADE'), nullable=False)
    user_id = Column(Integer, ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    date = Column(Date, nullable=False)
    calorie = Column(Float, nullable=True)
    macros = Column(JSON, nullable=True)  # 탄단지 등 필요시
    image_url = Column(String(255), nullable=True)
    is_success = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    challenge = relationship('Challenge', back_populates='records')
    participant = relationship('ChallengeParticipant', back_populates='records')
    user = relationship('User') 