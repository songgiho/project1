'use client';

import React, { useState, useEffect } from 'react';
import { Users, Trophy, Calendar, Target, Skull, Heart, Crown } from 'lucide-react';
import { format } from 'date-fns';
import { apiClient } from '@/lib/api';
import { Challenge, ChallengeParticipant } from '@/types';

interface SurvivalBoardProps {
  challengeId: string;
}

export function SurvivalBoard({ challengeId }: SurvivalBoardProps) {
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'survived' | 'eliminated'>('survived');

  useEffect(() => {
    const loadChallenge = async () => {
      setLoading(true);
      try {
        const data = await apiClient.getChallengeDetails(challengeId);
        setChallenge(data);
      } catch (error) {
        console.error('Failed to load challenge:', error);
        // 임시 데이터 사용
        setChallenge({
          id: challengeId,
          name: '7일 칼로리 챌린지',
          description: '7일 동안 매일 1800kcal 이하로 식사하기',
          startDate: '2025-01-15',
          endDate: '2025-01-21',
          targetType: 'calorie',
          targetValue: 1800,
          isActive: true,
          participants: [
            {
              id: '1',
              user: {
                id: '1',
                username: 'user1',
                email: 'user1@example.com',
                nickname: '다이어트왕',
                profilePicture: '/api/placeholder/40/40'
              },
              status: 'survived',
              currentStreak: 5
            },
            {
              id: '2',
              user: {
                id: '2',
                username: 'user2',
                email: 'user2@example.com',
                nickname: '헬스마니아',
                profilePicture: '/api/placeholder/40/40'
              },
              status: 'survived',
              currentStreak: 3
            },
            {
              id: '3',
              user: {
                id: '3',
                username: 'user3',
                email: 'user3@example.com',
                nickname: '운동좋아',
                profilePicture: '/api/placeholder/40/40'
              },
              status: 'eliminated',
              eliminationDate: '2025-01-18',
              currentStreak: 2
            },
            {
              id: '4',
              user: {
                id: '4',
                username: 'user4',
                email: 'user4@example.com',
                nickname: '칼로리마스터',
                profilePicture: '/api/placeholder/40/40'
              },
              status: 'survived',
              currentStreak: 7
            },
            {
              id: '5',
              user: {
                id: '5',
                username: 'user5',
                email: 'user5@example.com',
                nickname: '다이어트초보',
                profilePicture: '/api/placeholder/40/40'
              },
              status: 'eliminated',
              eliminationDate: '2025-01-17',
              currentStreak: 1
            }
          ]
        });
      }
      setLoading(false);
    };

    loadChallenge();
  }, [challengeId]);



  const calculateDaysLeft = (endDate: string) => {
    const today = new Date();
    const end = new Date(endDate);
    const diffTime = end.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const survivedParticipants = challenge?.participants.filter(p => p.status === 'survived') || [];
  const eliminatedParticipants = challenge?.participants.filter(p => p.status === 'eliminated') || [];

  // 생존자를 연속 기록 순으로 정렬
  const sortedSurvived = [...survivedParticipants].sort((a, b) => b.currentStreak - a.currentStreak);

  const ParticipantCard = ({ participant, isEliminated = false }: { participant: ChallengeParticipant; isEliminated?: boolean }) => {
    const isLeader = !isEliminated && participant.id === sortedSurvived[0]?.id;
    
    return (
      <div className={`card p-4 transition-all ${
        isEliminated 
          ? 'opacity-60 bg-muted/20' 
          : 'hover:shadow-md'
      }`}>
        <div className="flex items-center space-x-3">
          {/* 프로필 이미지 */}
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center overflow-hidden">
              {participant.user.profilePicture ? (
                <img
                  src={participant.user.profilePicture}
                  alt={participant.user.nickname}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-lg font-nanum">
                  {participant.user.nickname.charAt(0)}
                </span>
              )}
            </div>
            {isLeader && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center">
                <Crown className="w-3 h-3 text-white" />
              </div>
            )}
          </div>

          {/* 사용자 정보 */}
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <h3 className="font-medium font-nanum">{participant.user.nickname}</h3>
              {isLeader && (
                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                  리더
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              @{participant.user.username}
            </p>
          </div>

          {/* 상태 표시 */}
          <div className="flex flex-col items-end space-y-1">
            <div className={`flex items-center space-x-1 ${
              isEliminated ? 'text-destructive' : 'text-primary'
            }`}>
              {isEliminated ? (
                <Skull className="w-4 h-4" />
              ) : (
                <Heart className="w-4 h-4" />
              )}
              <span className="text-sm font-medium font-nanum">
                {isEliminated ? '탈락' : '생존'}
              </span>
            </div>
            <div className="text-xs text-muted-foreground font-nanum">
              {isEliminated ? (
                participant.eliminationDate && 
                `${format(new Date(participant.eliminationDate), 'M월 d일')} 탈락`
              ) : (
                `${participant.currentStreak}일 연속`
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="card p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded mb-4" />
            <div className="h-4 bg-muted rounded w-2/3 mb-2" />
            <div className="h-4 bg-muted rounded w-1/2" />
          </div>
        </div>
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="text-center py-12">
        <div className="text-muted-foreground">챌린지를 찾을 수 없습니다.</div>
      </div>
    );
  }

  const daysLeft = calculateDaysLeft(challenge.endDate);

  // 참여자 셀 현황판용 (번호 부여)
  const allParticipants = challenge.participants.map((p, idx) => ({ ...p, number: idx + 1 }));
  const total = challenge.participants.length;
  const survived = survivedParticipants.length;
  const eliminated = eliminatedParticipants.length;
  const progress = total > 0 ? Math.round((survived / total) * 100) : 0;

  // 전체 기간 대비 진행률 계산
  const totalDays = Math.max(1, Math.ceil((new Date(challenge.endDate).getTime() - new Date(challenge.startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1);
  const daysPassed = Math.max(0, Math.min(totalDays, Math.ceil((new Date().getTime() - new Date(challenge.startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1));
  const periodProgress = Math.round((daysPassed / totalDays) * 100);

  return (
    <div className="space-y-8">
      {/* 챌린지 정보 + 전체 기간 대비 진행률 (상단) */}
      <div className="flex flex-col md:flex-row gap-8 items-center justify-center card p-8">
        <div className="flex-1 min-w-[240px]">
          <h2 className="text-2xl font-nanum mb-2">챌린지 정보</h2>
          <p className="text-muted-foreground mb-4 text-base font-nanum">{challenge.description}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-primary" />
              <div>
                <div className="text-base text-muted-foreground font-nanum">기간</div>
                <div className="font-medium font-nanum">
                  {format(new Date(challenge.startDate), 'M월 d일')} - {format(new Date(challenge.endDate), 'M월 d일')}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-primary" />
              <div>
                <div className="text-base text-muted-foreground font-nanum">목표</div>
                <div className="font-medium font-nanum">
                  {challenge.targetValue}
                  {challenge.targetType === 'calorie' && 'kcal'}
                  {challenge.targetType === 'macro' && 'g'}
                  {challenge.targetType === 'weight' && 'kg'}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-primary" />
              <div>
                <div className="text-base text-muted-foreground font-nanum">참여자</div>
                <div className="font-medium font-nanum">{challenge.participants.length}명</div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Trophy className="w-5 h-5 text-primary" />
              <div>
                <div className="text-base text-muted-foreground font-nanum">
                  {challenge.isActive ? '남은 기간' : '완료'}
                </div>
                <div className="font-medium font-nanum">
                  {challenge.isActive ? (daysLeft > 0 ? `${daysLeft}일` : '종료') : '완료'}
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* 전체 기간 대비 진행률 원형 그래프 (확대) */}
        <div className="flex flex-col items-center justify-center min-w-[160px]">
          <span className="text-lg text-primary font-nanum mb-2">기간 진행률</span>
          <div className="relative w-32 h-32">
            <svg className="w-32 h-32 rotate-[-90deg]" viewBox="0 0 128 128">
              <circle cx="64" cy="64" r="52" fill="none" stroke="#eee" strokeWidth="12" />
              <circle
                cx="64" cy="64" r="52" fill="none"
                stroke="#38bdf8" strokeWidth="12"
                strokeDasharray={2 * Math.PI * 52}
                strokeDashoffset={2 * Math.PI * 52 * (1 - periodProgress / 100)}
                strokeLinecap="round"
              />
            </svg>
            <span className="absolute inset-0 flex flex-col items-center justify-center text-3xl font-nanum text-sky-400">{periodProgress}%</span>
            <span className="absolute bottom-4 left-0 right-0 text-base text-muted-foreground text-center font-nanum">{daysPassed} / {totalDays}일</span>
          </div>
        </div>
      </div>

      {/* 참여자 현황판 + 생존율 (하단) */}
      <div className="flex flex-col md:flex-row gap-8 items-center justify-center card p-8">
        {/* 서바이벌 보드판 */}
        <div className="flex-1 min-w-[320px]">
          <h2 className="text-2xl font-nanum mb-2">참여자 현황</h2>
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 p-2 rounded-xl bg-muted/40">
            {allParticipants.map((p) => (
              <div
                key={p.id}
                className={`flex flex-col items-center justify-center rounded-lg border p-1 h-20 transition-all
                  ${p.status === 'survived' ? 'bg-yellow-100 border-yellow-300' : 'bg-gray-200 border-gray-300 opacity-40'}
                `}
                title={p.user.nickname}
              >
                <div className="w-10 h-10 rounded-full overflow-hidden mb-1 border border-white">
                  {p.user.profilePicture ? (
                    <img src={p.user.profilePicture} alt={p.user.nickname} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-lg font-nanum">{p.user.nickname.charAt(0)}</span>
                  )}
                </div>
                <span className="text-base font-nanum">{p.number}</span>
                <span className="text-xs font-nanum truncate max-w-[56px]">{p.user.nickname}</span>
              </div>
            ))}
          </div>
        </div>
        {/* 생존율 원형 그래프 (확대) */}
        <div className="flex flex-col items-center justify-center min-w-[160px]">
          <span className="text-lg text-primary font-nanum mb-2">생존율</span>
          <div className="relative w-32 h-32">
            <svg className="w-32 h-32 rotate-[-90deg]" viewBox="0 0 128 128">
              <circle cx="64" cy="64" r="52" fill="none" stroke="#eee" strokeWidth="12" />
              <circle
                cx="64" cy="64" r="52" fill="none"
                stroke="#fbbf24" strokeWidth="12"
                strokeDasharray={2 * Math.PI * 52}
                strokeDashoffset={2 * Math.PI * 52 * (1 - progress / 100)}
                strokeLinecap="round"
              />
            </svg>
            <span className="absolute inset-0 flex flex-col items-center justify-center text-3xl font-nanum text-primary">{progress}%</span>
            <span className="absolute bottom-4 left-0 right-0 text-base text-muted-foreground text-center font-nanum">{survived} / {total}명</span>
          </div>
        </div>
      </div>
    </div>
  );
} 