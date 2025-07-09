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

  return (
    <div className="space-y-6">
      {/* 챌린지 정보 헤더 */}
      <div className="card p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-3xl font-nanum mb-2">{challenge.name}</h1>
            <p className="text-muted-foreground">{challenge.description}</p>
          </div>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            challenge.isActive 
              ? 'bg-green-100 text-green-700' 
              : 'bg-gray-100 text-gray-700'
          }`}>
            {challenge.isActive ? '진행 중' : '종료'}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-primary" />
            <div>
              <div className="text-sm text-muted-foreground">기간</div>
              <div className="font-medium">
                {format(new Date(challenge.startDate), 'M월 d일')} - {format(new Date(challenge.endDate), 'M월 d일')}
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Target className="w-5 h-5 text-primary" />
            <div>
              <div className="text-sm text-muted-foreground">목표</div>
              <div className="font-medium">
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
              <div className="text-sm text-muted-foreground">참여자</div>
              <div className="font-medium">{challenge.participants.length}명</div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Trophy className="w-5 h-5 text-primary" />
            <div>
              <div className="text-sm text-muted-foreground">
                {challenge.isActive ? '남은 기간' : '완료'}
              </div>
              <div className="font-medium">
                {challenge.isActive ? (daysLeft > 0 ? `${daysLeft}일` : '종료') : '완료'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 생존/탈락 통계 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Heart className="w-5 h-5 text-green-500" />
              <span className="font-medium">생존자</span>
            </div>
            <span className="text-2xl font-nanum text-green-500">
              {survivedParticipants.length}
            </span>
          </div>
        </div>
        
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Skull className="w-5 h-5 text-red-500" />
              <span className="font-medium">탈락자</span>
            </div>
            <span className="text-2xl font-nanum text-red-500">
              {eliminatedParticipants.length}
            </span>
          </div>
        </div>
      </div>

      {/* 탭 메뉴 */}
      <div className="flex space-x-4 border-b border-border">
        <button
          onClick={() => setActiveTab('survived')}
          className={`pb-2 px-1 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'survived'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          생존자 ({survivedParticipants.length})
        </button>
        <button
          onClick={() => setActiveTab('eliminated')}
          className={`pb-2 px-1 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'eliminated'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          탈락자 ({eliminatedParticipants.length})
        </button>
      </div>

      {/* 참여자 목록 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {activeTab === 'survived' ? (
          sortedSurvived.length > 0 ? (
            sortedSurvived.map((participant) => (
              <ParticipantCard key={participant.id} participant={participant} />
            ))
          ) : (
            <div className="col-span-full text-center py-8">
              <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">생존자가 없습니다</p>
            </div>
          )
        ) : (
          eliminatedParticipants.length > 0 ? (
            eliminatedParticipants.map((participant) => (
              <ParticipantCard key={participant.id} participant={participant} isEliminated />
            ))
          ) : (
            <div className="col-span-full text-center py-8">
              <Skull className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">탈락자가 없습니다</p>
            </div>
          )
        )}
      </div>
    </div>
  );
} 