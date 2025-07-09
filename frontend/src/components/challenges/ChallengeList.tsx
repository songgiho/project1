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
            participants: []
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
            participants: []
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
            participants: []
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
      <div className="card p-6 hover:shadow-lg transition-shadow">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <TargetIcon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-nanum font-nanum">{challenge.name}</h3>
              <p className="text-sm text-muted-foreground font-nanum">
                {getTargetTypeLabel(challenge.targetType)} 목표
              </p>
            </div>
          </div>
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
            challenge.isActive 
              ? 'bg-green-100 text-green-700' 
              : 'bg-gray-100 text-gray-700'
          }`}>
            {challenge.isActive ? '진행 중' : '종료'}
          </div>
        </div>

        <p className="text-sm text-muted-foreground mb-4 font-nanum">
          {challenge.description}
        </p>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <div className="flex items-center space-x-2 text-sm">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span>기간</span>
            </div>
            <div className="text-sm font-medium mt-1">
              {format(new Date(challenge.startDate), 'M월 d일')} - {format(new Date(challenge.endDate), 'M월 d일')}
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2 text-sm">
              <Users className="w-4 h-4 text-muted-foreground" />
              <span>참여자</span>
            </div>
            <div className="text-sm font-medium mt-1">
              {challenge.participants.length}명
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm font-nanum">
            <span className="text-muted-foreground">목표: </span>
            <span className="font-medium font-nanum">
              {challenge.targetValue}
              {challenge.targetType === 'calorie' && 'kcal'}
              {challenge.targetType === 'macro' && 'g'}
              {challenge.targetType === 'weight' && 'kg'}
            </span>
          </div>
          
          {challenge.isActive && (
            <div className="text-sm font-nanum">
              <span className="text-muted-foreground">남은 기간: </span>
              <span className="font-medium text-primary font-nanum">
                {daysLeft > 0 ? `${daysLeft}일` : '종료'}
              </span>
            </div>
          )}
        </div>

        <div className="mt-4 pt-4 border-t border-border">
          <Link
            href={`/challenges/${challenge.id}`}
            className="w-full btn-primary py-2 text-center block"
          >
            {activeTab === 'recommended' ? '참여하기' : '자세히 보기'}
          </Link>
        </div>
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
        <button className="btn-primary flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>새 챌린지 생성</span>
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