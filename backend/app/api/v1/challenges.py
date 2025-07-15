from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.app import models
from backend.app.database import get_db
from typing import List, Dict, Any
from datetime import date, datetime
from backend.app.schemas.challenge import (
    Challenge, ChallengeCreate, ChallengeParticipant, ChallengeParticipantBase, ChallengeRecord, ChallengeRecordBase
)

router = APIRouter(prefix="/challenges", tags=["challenges"])

@router.post("/", response_model=Challenge)
def create_challenge(challenge: ChallengeCreate, db: Session = Depends(get_db)):
    db_challenge = models.Challenge(**challenge.dict())
    db.add(db_challenge)
    db.commit()
    db.refresh(db_challenge)
    return db_challenge

@router.get("/", response_model=List[Challenge])
def list_challenges(db: Session = Depends(get_db)):
    return db.query(models.Challenge).all()

@router.get("/{challenge_id}", response_model=Challenge)
def get_challenge(challenge_id: int, db: Session = Depends(get_db)):
    db_challenge = db.query(models.Challenge).filter(models.Challenge.id == challenge_id).first()
    if not db_challenge:
        raise HTTPException(status_code=404, detail="Challenge not found")
    return db_challenge

@router.post("/{challenge_id}/join", response_model=ChallengeParticipant)
def join_challenge(challenge_id: int, user_id: int, db: Session = Depends(get_db)):
    # 챌린지 존재 확인
    challenge = db.query(models.Challenge).filter(models.Challenge.id == challenge_id).first()
    if not challenge:
        raise HTTPException(status_code=404, detail="Challenge not found")
    
    # 챌린지 활성 상태 확인
    if not challenge.is_active:
        raise HTTPException(status_code=400, detail="Challenge is not active")
    
    # 챌린지 기간 확인
    today = date.today()
    if today < challenge.start_date or today > challenge.end_date:
        raise HTTPException(status_code=400, detail="Challenge is not in progress")
    
    # 중복 참여 확인
    existing_participant = db.query(models.ChallengeParticipant).filter(
        models.ChallengeParticipant.challenge_id == challenge_id,
        models.ChallengeParticipant.user_id == user_id
    ).first()
    
    if existing_participant:
        raise HTTPException(status_code=400, detail="User already joined this challenge")
    
    # 최대 참여자 수 확인
    if challenge.max_participants is not None:
        current_participants = db.query(models.ChallengeParticipant).filter(
            models.ChallengeParticipant.challenge_id == challenge_id
        ).count()
        
        if current_participants >= challenge.max_participants:
            raise HTTPException(status_code=400, detail="Challenge is full")
    
    # 참여자 생성
    participant = models.ChallengeParticipant(
        challenge_id=challenge_id,
        user_id=user_id,
        status='survived',
        current_streak=0
    )
    
    db.add(participant)
    db.commit()
    db.refresh(participant)
    return participant

@router.post("/{challenge_id}/record", response_model=ChallengeRecord)
def add_record(challenge_id: int, user_id: int, record: ChallengeRecordBase, db: Session = Depends(get_db)):
    # 챌린지 존재 확인
    challenge = db.query(models.Challenge).filter(models.Challenge.id == challenge_id).first()
    if not challenge:
        raise HTTPException(status_code=404, detail="Challenge not found")
    
    # 참여자 확인
    participant = db.query(models.ChallengeParticipant).filter(
        models.ChallengeParticipant.challenge_id == challenge_id,
        models.ChallengeParticipant.user_id == user_id
    ).first()
    
    if not participant:
        raise HTTPException(status_code=404, detail="User not participating in this challenge")
    
    # 이미 탈락한 참여자인지 확인
    if participant.status == 'eliminated':
        raise HTTPException(status_code=400, detail="User is already eliminated from this challenge")
    
    # 중복 기록 확인 (같은 날짜)
    existing_record = db.query(models.ChallengeRecord).filter(
        models.ChallengeRecord.challenge_id == challenge_id,
        models.ChallengeRecord.user_id == user_id,
        models.ChallengeRecord.date == record.date
    ).first()
    
    if existing_record:
        raise HTTPException(status_code=400, detail="Record for this date already exists")
    
    # 목표 달성 여부 평가
    is_success = False
    if challenge.target_type == 'calorie' and record.calorie is not None:
        is_success = record.calorie <= challenge.target_value
    elif challenge.target_type == 'macro' and record.macros is not None:
        # 매크로 목표 평가 로직 (예: 단백질 목표)
        if 'protein' in record.macros:
            is_success = record.macros['protein'] >= challenge.target_value
    
    # 기록 생성
    db_record = models.ChallengeRecord(
        challenge_id=challenge_id,
        participant_id=participant.id,
        user_id=user_id,
        date=record.date,
        calorie=record.calorie,
        macros=record.macros,
        image_url=record.image_url,
        is_success=is_success
    )
    
    db.add(db_record)
    
    # 스트릭 업데이트
    if is_success:
        participant.current_streak = participant.current_streak + 1
    else:
        participant.current_streak = 0
        participant.status = 'eliminated'
        participant.elimination_date = record.date
    
    db.commit()
    db.refresh(db_record)
    return db_record

@router.get("/{challenge_id}/participants", response_model=List[ChallengeParticipant])
def list_participants(challenge_id: int, db: Session = Depends(get_db)):
    # 챌린지 존재 확인
    challenge = db.query(models.Challenge).filter(models.Challenge.id == challenge_id).first()
    if not challenge:
        raise HTTPException(status_code=404, detail="Challenge not found")
    
    participants = db.query(models.ChallengeParticipant).filter(
        models.ChallengeParticipant.challenge_id == challenge_id
    ).all()
    
    return participants

@router.get("/{challenge_id}/records", response_model=List[ChallengeRecord])
def list_records(challenge_id: int, db: Session = Depends(get_db)):
    # 챌린지 존재 확인
    challenge = db.query(models.Challenge).filter(models.Challenge.id == challenge_id).first()
    if not challenge:
        raise HTTPException(status_code=404, detail="Challenge not found")
    
    records = db.query(models.ChallengeRecord).filter(
        models.ChallengeRecord.challenge_id == challenge_id
    ).order_by(models.ChallengeRecord.date.desc()).all()
    
    return records

@router.get("/{challenge_id}/records/{user_id}", response_model=List[ChallengeRecord])
def get_user_records(challenge_id: int, user_id: int, db: Session = Depends(get_db)):
    # 챌린지 존재 확인
    challenge = db.query(models.Challenge).filter(models.Challenge.id == challenge_id).first()
    if not challenge:
        raise HTTPException(status_code=404, detail="Challenge not found")
    
    # 참여자 확인
    participant = db.query(models.ChallengeParticipant).filter(
        models.ChallengeParticipant.challenge_id == challenge_id,
        models.ChallengeParticipant.user_id == user_id
    ).first()
    
    if not participant:
        raise HTTPException(status_code=404, detail="User not participating in this challenge")
    
    records = db.query(models.ChallengeRecord).filter(
        models.ChallengeRecord.challenge_id == challenge_id,
        models.ChallengeRecord.user_id == user_id
    ).order_by(models.ChallengeRecord.date.desc()).all()
    
    return records

@router.get("/{challenge_id}/stats", response_model=Dict[str, Any])
def get_challenge_stats(challenge_id: int, db: Session = Depends(get_db)):
    # 챌린지 존재 확인
    challenge = db.query(models.Challenge).filter(models.Challenge.id == challenge_id).first()
    if not challenge:
        raise HTTPException(status_code=404, detail="Challenge not found")
    
    # 전체 참여자 수
    total_participants = db.query(models.ChallengeParticipant).filter(
        models.ChallengeParticipant.challenge_id == challenge_id
    ).count()
    
    # 생존자 수
    survived_participants = db.query(models.ChallengeParticipant).filter(
        models.ChallengeParticipant.challenge_id == challenge_id,
        models.ChallengeParticipant.status == 'survived'
    ).count()
    
    # 탈락자 수
    eliminated_participants = db.query(models.ChallengeParticipant).filter(
        models.ChallengeParticipant.challenge_id == challenge_id,
        models.ChallengeParticipant.status == 'eliminated'
    ).count()
    
    # 생존율 계산
    survival_rate = (survived_participants / total_participants * 100) if total_participants > 0 else 0
    
    # 평균 스트릭
    avg_streak = db.query(models.ChallengeParticipant.current_streak).filter(
        models.ChallengeParticipant.challenge_id == challenge_id
    ).all()
    avg_streak = sum([p[0] for p in avg_streak]) / len(avg_streak) if avg_streak else 0
    
    # 최고 스트릭
    max_streak = db.query(models.ChallengeParticipant.current_streak).filter(
        models.ChallengeParticipant.challenge_id == challenge_id
    ).order_by(models.ChallengeParticipant.current_streak.desc()).first()
    max_streak = max_streak[0] if max_streak else 0
    
    return {
        "total_participants": total_participants,
        "survived_participants": survived_participants,
        "eliminated_participants": eliminated_participants,
        "survival_rate": round(survival_rate, 2),
        "average_streak": round(avg_streak, 1),
        "max_streak": max_streak,
        "challenge_days": (challenge.end_date - challenge.start_date).days + 1
    }

@router.get("/{challenge_id}/leaderboard", response_model=List[Dict[str, Any]])
def get_challenge_leaderboard(challenge_id: int, db: Session = Depends(get_db)):
    # 챌린지 존재 확인
    challenge = db.query(models.Challenge).filter(models.Challenge.id == challenge_id).first()
    if not challenge:
        raise HTTPException(status_code=404, detail="Challenge not found")
    
    # 참여자들을 스트릭 순으로 정렬
    participants = db.query(models.ChallengeParticipant).filter(
        models.ChallengeParticipant.challenge_id == challenge_id
    ).order_by(models.ChallengeParticipant.current_streak.desc()).all()
    
    leaderboard = []
    for participant in participants:
        user = db.query(models.User).filter(models.User.id == participant.user_id).first()
        leaderboard.append({
            "user_id": participant.user_id,
            "username": user.username if user else "Unknown",
            "current_streak": participant.current_streak,
            "status": participant.status,
            "elimination_date": participant.elimination_date
        })
    
    return leaderboard 