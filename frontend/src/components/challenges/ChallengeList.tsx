'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Calendar, Users, Target, Trophy, Zap } from 'lucide-react';
import { format } from 'date-fns';
import { apiClient } from '@/lib/api';
import { Challenge } from '@/types';
import Link from 'next/link';

export function ChallengeList() {
  const [recommendedChallenges, setRecommendedChallenges] = useState<Challenge[]>([]);
  const [myChallenges, setMyChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'recommended' | 'my'>('recommended');

  useEffect(() => {
    const loadChallenges = async () => {
      setLoading(true);
      try {
        const [recommended, my] = await Promise.all([
          apiClient.getRecommendedChallenges(),
          apiClient.getMyChallenges()
        ]);
        setRecommendedChallenges(recommended);
        setMyChallenges(my);
      } catch (error) {
        console.error('Failed to load challenges:', error);
        // 임시 데이터 사용
        const tempChallenges = [
          {
            id: '1',
            name: '7일 칼로리 챌린지',
            description: '7일 동안 매일 1800kcal 이하로 식사하기',
            startDate: '2025-01-15',
            endDate: '2025-01-21',
            targetType: 'calorie' as const,
            targetValue: 1800,
            isActive: true,
            participants: [],
            maxParticipants: 10,
          },
          {
            id: '2',
            name: '단백질 마스터 챌린지',
            description: '14일 동안 매일 단백질 100g 이상 섭취하기',
            startDate: '2025-01-10',
            endDate: '2025-01-24',
            targetType: 'macro' as const,
            targetValue: 100,
            isActive: true,
            participants: [],
            maxParticipants: 8,
          },
          {
            id: '3',
            name: '30일 체중 감량 챌린지',
            description: '30일 동안 5kg 감량하기',
            startDate: '2025-01-01',
            endDate: '2025-01-30',
            targetType: 'weight' as const,
            targetValue: 5,
            isActive: false,
            participants: [],
            maxParticipants: 20,
          }
        ];
        setRecommendedChallenges(tempChallenges);
        setMyChallenges(tempChallenges.slice(0, 1));
      }
      setLoading(false);
    };

    loadChallenges();
  }, []);

  const getTargetTypeLabel = (type: string) => {
    switch (type) {
      case 'calorie': return '칼로리';
      case 'macro': return '영양소';
      case 'weight': return '체중';
      default: return type;
    }
  };

  const getTargetIcon = (type: string) => {
    switch (type) {
      case 'calorie': return Zap;
      case 'macro': return Target;
      case 'weight': return Trophy;
      default: return Target;
    }
  };

  const calculateDaysLeft = (endDate: string) => {
    const today = new Date();
    const end = new Date(endDate);
    const diffTime = end.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const ChallengeCard = ({ challenge }: { challenge: Challenge }) => {
    const TargetIcon = getTargetIcon(challenge.targetType);
    const daysLeft = calculateDaysLeft(challenge.endDate);
    
    return (
      <div className={`relative rounded-2xl border shadow p-6 flex flex-col min-h-[420px] transition
        ${challenge.isActive ? 'bg-white shadow-lg' : 'bg-gray-100 opacity-70'}
      `}>
        {/* 상태 불빛 인디케이터 + 툴팁 */}
        <span
          className={`absolute top-4 left-4 w-4 h-4 rounded-full z-10 border-2 border-white
            ${challenge.isActive ? 'bg-green-400 shadow-green-200 shadow' : 'bg-gray-300'}
          `}
          title={challenge.isActive ? '진행 중' : '종료'}
        />
        {/* 타이틀/아이콘 */}
        <div className="flex items-center space-x-2 mb-2">
          <div className={`p-2 rounded-lg ${challenge.isActive ? 'bg-primary/10' : 'bg-gray-200'}`}> 
            <TargetIcon className={`w-5 h-5 ${challenge.isActive ? 'text-primary' : 'text-gray-400'}`} />
          </div>
          <h3 className={`text-xl font-extrabold font-nanum ${challenge.isActive ? 'text-foreground' : 'text-gray-400'}`}>{challenge.name}</h3>
        </div>
        {/* 목표/설명 */}
        <div className={`mb-4 text-sm font-nanum ${challenge.isActive ? 'text-muted-foreground' : 'text-gray-400'}`}>{challenge.description}</div>
        {/* 기간/참여자 */}
        <div className="flex items-center justify-between text-xs mb-4">
          <div className="flex items-center space-x-2">
            <Calendar className={`w-4 h-4 ${challenge.isActive ? 'text-muted-foreground' : 'text-gray-400'}`} />
            <span>기간</span>
            <span className="font-medium ml-1">
              {format(new Date(challenge.startDate), 'M월 d일')} - {format(new Date(challenge.endDate), 'M월 d일')}
            </span>
          </div>
          <div className="flex flex-col items-start">
            <div className="flex items-center space-x-2">
              <Users className={`w-4 h-4 ${challenge.isActive ? 'text-muted-foreground' : 'text-gray-400'}`} />
              <span>참여자</span>
            </div>
            <span className="font-medium ml-6 mt-1">{challenge.participants.length}/{challenge.maxParticipants ?? '-'}명</span>
          </div>
        </div>
        {/* 목표/남은 기간 */}
        <div className="flex items-center justify-between text-xs mb-6">
          <span>목표: <span className="font-bold">{challenge.targetValue}{challenge.targetType === 'calorie' && 'kcal'}{challenge.targetType === 'macro' && 'g'}{challenge.targetType === 'weight' && 'kg'}</span></span>
          <span>남은 기간: <span className="font-bold text-primary">{challenge.isActive ? (daysLeft > 0 ? `${daysLeft}일` : '종료') : '종료'}</span></span>
        </div>
        {/* 하단 버튼 */}
        <Link
          href={challenge.isActive ? `/challenges/${challenge.id}` : '#'}
          className={`mt-auto w-full py-3 rounded-2xl font-bold shadow text-center block transition
            ${challenge.isActive
              ? 'bg-[#011936] text-white hover:bg-[#02224d] cursor-pointer'
              : 'bg-gray-300 text-gray-400 cursor-not-allowed pointer-events-none'}
          `}
          tabIndex={challenge.isActive ? 0 : -1}
          aria-disabled={!challenge.isActive}
        >
          {challenge.isActive ? (activeTab === 'recommended' ? '참여하기' : '자세히 보기') : '종료됨'}
        </Link>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* 탭 메뉴 */}
      <div className="flex space-x-4 border-b border-border">
        <button
          onClick={() => setActiveTab('recommended')}
          className={`pb-2 px-1 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'recommended'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          추천 챌린지
        </button>
        <button
          onClick={() => setActiveTab('my')}
          className={`pb-2 px-1 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'my'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          내 챌린지
        </button>
      </div>

      {/* 챌린지 생성 버튼 */}
      <div className="flex justify-end">
        <button className="btn-primary flex items-center space-x-2 min-w-[120px] px-5 py-2">
          <Plus className="w-4 h-4" />
          <span className="text-xs font-medium">새 챌린지 생성</span>
        </button>
      </div>

      {/* 챌린지 그리드 */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="card p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-muted rounded mb-2" />
                <div className="h-3 bg-muted rounded w-2/3 mb-4" />
                <div className="h-12 bg-muted rounded mb-4" />
                <div className="h-8 bg-muted rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(activeTab === 'recommended' ? recommendedChallenges : myChallenges).map((challenge) => (
            <ChallengeCard key={challenge.id} challenge={challenge} />
          ))}
        </div>
      )}

      {/* 빈 상태 */}
      {!loading && (
        <>
          {activeTab === 'recommended' && recommendedChallenges.length === 0 && (
            <div className="text-center py-12">
              <Trophy className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">추천 챌린지가 없습니다</h3>
              <p className="text-muted-foreground">
                새로운 챌린지가 곧 추가될 예정입니다
              </p>
            </div>
          )}
          {activeTab === 'my' && myChallenges.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">참여 중인 챌린지가 없습니다</h3>
              <p className="text-muted-foreground">
                추천 챌린지에서 원하는 챌린지를 찾아보세요
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
} 