'use client';

import React, { useState, useEffect } from 'react';
import { Users, Trophy, Calendar, Target, Skull, Heart, Crown, ChevronDown, ChevronUp, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { apiClient } from '@/lib/api';
import { Challenge, ChallengeParticipant } from '@/types';
import { MyChallengeStatusBoard } from './MyChallengeStatusBoard';

interface SurvivalBoardProps {
  challengeId: string;
}

interface ChallengeStats {
  total_participants: number;
  survived_participants: number;
  eliminated_participants: number;
  survival_rate: number;
  average_streak: number;
  max_streak: number;
  challenge_days: number;
}

interface LeaderboardEntry {
  user_id: number;
  username: string;
  current_streak: number;
  status: string;
  elimination_date?: string;
}

export function SurvivalBoard({ challengeId }: SurvivalBoardProps) {
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [participants, setParticipants] = useState<any[]>([]);
  const [stats, setStats] = useState<ChallengeStats | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [joining, setJoining] = useState(false);
  const [activeTab, setActiveTab] = useState<'survived' | 'eliminated'>('survived');
  const [showDetail, setShowDetail] = useState(false);
  const [isParticipating, setIsParticipating] = useState(false);

  // 임시 사용자 ID (실제로는 인증 시스템에서 가져와야 함)
  const currentUserId = 1;

  useEffect(() => {
    const loadChallengeData = async () => {
      setLoading(true);
      try {
        // 챌린지 기본 정보
        const challengeData = await apiClient.getChallengeDetails(challengeId);
        setChallenge(challengeData);

        // 참여자 목록
        const participantsData = await apiClient.getChallengeParticipants(challengeId);
        setParticipants(participantsData);

        // 현재 사용자가 참여 중인지 확인
        const isParticipating = participantsData.some(p => p.user_id === currentUserId);
        setIsParticipating(isParticipating);

        // 통계 정보
        const statsData = await apiClient.getChallengeStats(challengeId);
        setStats(statsData);

        // 리더보드
        const leaderboardData = await apiClient.getChallengeLeaderboard(challengeId);
        setLeaderboard(leaderboardData);

      } catch (error) {
        console.error('Failed to load challenge data:', error);
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
          participants: []
        });
        
        setStats({
          total_participants: 40,
          survived_participants: 28,
          eliminated_participants: 12,
          survival_rate: 70.0,
          average_streak: 4.2,
          max_streak: 7,
          challenge_days: 7
        });
      }
      setLoading(false);
    };

    loadChallengeData();
  }, [challengeId]);

  const handleJoinChallenge = async () => {
    if (!challenge || isParticipating) return;
    
    setJoining(true);
    try {
      await apiClient.joinChallenge(challengeId, currentUserId);
      
      // 참여자 목록 새로고침
      const participantsData = await apiClient.getChallengeParticipants(challengeId);
      setParticipants(participantsData);
      setIsParticipating(true);
      
      // 통계 새로고침
      const statsData = await apiClient.getChallengeStats(challengeId);
      setStats(statsData);
      
      alert('챌린지에 성공적으로 참여했습니다!');
    } catch (error) {
      console.error('Failed to join challenge:', error);
      alert('챌린지 참여에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setJoining(false);
    }
  };

  const calculateDaysLeft = (endDate: string) => {
    const today = new Date();
    const end = new Date(endDate);
    const diffTime = end.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const survivedParticipants = participants.filter(p => p.status === 'survived');
  const eliminatedParticipants = participants.filter(p => p.status === 'eliminated');

  // 생존자를 연속 기록 순으로 정렬
  const sortedSurvived = [...survivedParticipants].sort((a, b) => b.current_streak - a.current_streak);

  const ParticipantCard = ({ participant, isEliminated = false }: { participant: any; isEliminated?: boolean }) => {
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
              <span className="text-lg font-nanum">
                {participant.username?.charAt(0) || 'U'}
              </span>
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
              <h3 className="font-medium font-nanum">{participant.username || 'Unknown'}</h3>
              {isLeader && (
                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                  리더
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              User ID: {participant.user_id}
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
                participant.elimination_date && 
                `${format(new Date(participant.elimination_date), 'M월 d일')} 탈락`
              ) : (
                `${participant.current_streak}일 연속`
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
        <MyChallengeStatusBoard todayGoal={1800} todayIntake={1200} streak={3} />
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
        <MyChallengeStatusBoard todayGoal={1800} todayIntake={1200} streak={3} />
        <div className="text-muted-foreground">챌린지를 찾을 수 없습니다.</div>
      </div>
    );
  }

  const daysLeft = calculateDaysLeft(challenge.endDate);

  // 전체 기간 대비 진행률 계산
  const totalDays = Math.max(1, Math.ceil((new Date(challenge.endDate).getTime() - new Date(challenge.startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1);
  const daysPassed = Math.max(0, Math.min(totalDays, Math.ceil((new Date().getTime() - new Date(challenge.startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1));
  const periodProgress = Math.round((daysPassed / totalDays) * 100);

  return (
    <div className="space-y-8">
      {/* 나의 챌린지 현황판 - 상단에 단독 배치 */}
      <MyChallengeStatusBoard 
        todayGoal={1800} 
        todayIntake={1200} 
        streak={3} 
        challengeId={challengeId}
        userId={currentUserId}
      />
      
      {/* 챌린지 참여 버튼 */}
      {challenge.isActive && !isParticipating && (
        <div className="flex justify-center">
          <button
            onClick={handleJoinChallenge}
            disabled={joining}
            className="btn-primary flex items-center space-x-2 px-6 py-3 text-lg font-bold"
          >
            <Plus className="w-5 h-5" />
            <span>{joining ? '참여 중...' : '챌린지 참여하기'}</span>
          </button>
        </div>
      )}
      
      {/* 챌린지 설명(제목) + 상세 정보 토글 */}
      <div className="flex flex-col items-center">
        <button
          className="text-2xl md:text-3xl font-extrabold font-nanum text-center mb-2 focus:outline-none hover:underline flex items-center gap-2"
          onClick={() => setShowDetail((v) => !v)}
        >
          {challenge.description}
          {showDetail ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
        </button>
        {showDetail && (
          <div className="w-full max-w-3xl mx-auto card p-6 mt-2 animate-fade-in flex flex-col md:flex-row gap-8 items-center justify-center">
            {/* 기간 진행률 도넛 + 정보 오버레이 */}
            <div className="flex flex-col items-center justify-center min-w-[240px]">
              <span className="text-lg text-primary font-nanum mb-2">진행율</span>
              <div className="relative w-48 h-48">
                <svg className="w-48 h-48 rotate-[-90deg]" viewBox="0 0 160 160">
                  <circle cx="80" cy="80" r="68" fill="none" stroke="#eee" strokeWidth="16" />
                  <circle
                    cx="80" cy="80" r="68" fill="none"
                    stroke="#38bdf8" strokeWidth="16"
                    strokeDasharray={2 * Math.PI * 68}
                    strokeDashoffset={2 * Math.PI * 68 * (1 - periodProgress / 100)}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <div className="text-4xl font-bold text-black mb-1">{periodProgress}%</div>
                  <div className="text-lg text-muted-foreground mb-2">{daysPassed} / {totalDays}일</div>
                  <div className="mt-2 text-sm text-center space-y-1">
                    <div><span className="font-bold">기간</span>: {format(new Date(challenge.startDate), 'M월 d일')} - {format(new Date(challenge.endDate), 'M월 d일')}</div>
                    <div><span className="font-bold">목표</span>: {challenge.targetValue}{challenge.targetType === 'calorie' && 'kcal'}{challenge.targetType === 'macro' && 'g'}{challenge.targetType === 'weight' && 'kg'}</div>
                    <div><span className="font-bold">참여자</span>: {stats?.total_participants || 0}명</div>
                    <div><span className="font-bold">남은 기간</span>: {challenge.isActive ? (daysLeft > 0 ? `${daysLeft}일` : '종료') : '완료'}</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* 생존율 도넛 그래프 */}
            <div className="flex flex-col items-center justify-center min-w-[240px]">
              <span className="text-lg text-primary font-nanum mb-2">생존율</span>
              <div className="relative w-48 h-48">
                <svg className="w-48 h-48 rotate-[-90deg]" viewBox="0 0 160 160">
                  <circle cx="80" cy="80" r="68" fill="none" stroke="#eee" strokeWidth="16" />
                  <circle
                    cx="80" cy="80" r="68" fill="none"
                    stroke="#10b981" strokeWidth="16"
                    strokeDasharray={2 * Math.PI * 68}
                    strokeDashoffset={2 * Math.PI * 68 * (1 - (stats?.survival_rate || 0) / 100)}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <div className="text-4xl font-bold text-black mb-1">{stats?.survival_rate || 0}%</div>
                  <div className="text-lg text-muted-foreground mb-2">{stats?.survived_participants || 0} / {stats?.total_participants || 0}명</div>
                  <div className="mt-2 text-sm text-center space-y-1">
                    <div><span className="font-bold">평균 스트릭</span>: {stats?.average_streak || 0}일</div>
                    <div><span className="font-bold">최고 스트릭</span>: {stats?.max_streak || 0}일</div>
                    <div><span className="font-bold">탈락자</span>: {stats?.eliminated_participants || 0}명</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
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
          생존자 ({survivedParticipants.length}명)
        </button>
        <button
          onClick={() => setActiveTab('eliminated')}
          className={`pb-2 px-1 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'eliminated'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          탈락자 ({eliminatedParticipants.length}명)
        </button>
      </div>

      {/* 참여자 목록 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {(activeTab === 'survived' ? survivedParticipants : eliminatedParticipants).map((participant) => (
          <ParticipantCard 
            key={participant.id} 
            participant={participant} 
            isEliminated={activeTab === 'eliminated'}
          />
        ))}
      </div>

      {/* 빈 상태 */}
      {(activeTab === 'survived' && survivedParticipants.length === 0) && (
        <div className="text-center py-12">
          <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">생존자가 없습니다</h3>
          <p className="text-muted-foreground">
            아직 챌린지가 시작되지 않았거나 모든 참여자가 탈락했습니다
          </p>
        </div>
      )}
      
      {(activeTab === 'eliminated' && eliminatedParticipants.length === 0) && (
        <div className="text-center py-12">
          <Trophy className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">탈락자가 없습니다</h3>
          <p className="text-muted-foreground">
            모든 참여자가 아직 생존하고 있습니다
          </p>
        </div>
      )}
    </div>
  );
} 