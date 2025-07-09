'use client';

import React, { useState, useEffect } from 'react';
import { Trophy, Lock, Star, Calendar, Target, Zap, Award, Crown } from 'lucide-react';
import { format } from 'date-fns';
import { apiClient } from '@/lib/api';
import { Badge } from '@/types';

interface BadgeCollectionProps {
  username: string;
}

export function BadgeCollection({ username }: BadgeCollectionProps) {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);

  useEffect(() => {
    const loadBadges = async () => {
      setLoading(true);
      try {
        const data = await apiClient.getUserBadges(username);
        setBadges(data);
      } catch (error) {
        console.error('Failed to load badges:', error);
        // 임시 데이터 사용
        setBadges([
          {
            id: '1',
            name: '첫 걸음',
            description: '첫 번째 식사 로그를 기록했습니다',
            iconUrl: '/api/placeholder/80/80',
            isAcquired: true,
            acquiredDate: '2025-01-10'
          },
          {
            id: '2',
            name: '7일 연속',
            description: '7일 연속으로 식사를 기록했습니다',
            iconUrl: '/api/placeholder/80/80',
            isAcquired: true,
            acquiredDate: '2025-01-17'
          },
          {
            id: '3',
            name: '챌린지 마스터',
            description: '첫 번째 챌린지를 완주했습니다',
            iconUrl: '/api/placeholder/80/80',
            isAcquired: true,
            acquiredDate: '2025-01-21'
          },
          {
            id: '4',
            name: '칼로리 킹',
            description: '칼로리 챌린지에서 1위를 달성했습니다',
            iconUrl: '/api/placeholder/80/80',
            isAcquired: false
          },
          {
            id: '5',
            name: '30일 마라톤',
            description: '30일 연속으로 식사를 기록했습니다',
            iconUrl: '/api/placeholder/80/80',
            isAcquired: false
          },
          {
            id: '6',
            name: '영양 마스터',
            description: '모든 영양소 챌린지를 완주했습니다',
            iconUrl: '/api/placeholder/80/80',
            isAcquired: false
          },
          {
            id: '7',
            name: '소셜 스타',
            description: '10명 이상의 챌린지에 참여했습니다',
            iconUrl: '/api/placeholder/80/80',
            isAcquired: false
          },
          {
            id: '8',
            name: '완벽주의자',
            description: '100% 정확도로 7일 연속 기록했습니다',
            iconUrl: '/api/placeholder/80/80',
            isAcquired: false
          }
        ]);
      }
      setLoading(false);
    };

    loadBadges();
  }, [username]);

  const getBadgeIcon = (badgeName: string) => {
    switch (badgeName) {
      case '첫 걸음': return Star;
      case '7일 연속': return Calendar;
      case '챌린지 마스터': return Trophy;
      case '칼로리 킹': return Crown;
      case '30일 마라톤': return Target;
      case '영양 마스터': return Zap;
      case '소셜 스타': return Award;
      case '완벽주의자': return Trophy;
      default: return Trophy;
    }
  };

  const acquiredBadges = badges.filter(badge => badge.isAcquired);
  const unacquiredBadges = badges.filter(badge => !badge.isAcquired);

  const BadgeCard = ({ badge }: { badge: Badge }) => {
    const Icon = getBadgeIcon(badge.name);
    
    return (
      <div
        className={`card p-6 text-center cursor-pointer transition-all hover:scale-105 ${
          badge.isAcquired 
            ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200' 
            : 'bg-muted/30 opacity-60'
        }`}
        onClick={() => setSelectedBadge(badge)}
      >
        <div className="relative">
          {/* 배지 이미지/아이콘 */}
          <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4 ${
            badge.isAcquired 
              ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white' 
              : 'bg-gray-300 text-gray-500'
          }`}>
            {badge.iconUrl && badge.isAcquired ? (
              <img
                src={badge.iconUrl}
                alt={badge.name}
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              badge.isAcquired ? (
                <Icon className="w-10 h-10" />
              ) : (
                <Lock className="w-10 h-10" />
              )
            )}
          </div>

          {/* 획득 표시 */}
          {badge.isAcquired && (
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
              <Star className="w-3 h-3 text-white fill-current" />
            </div>
          )}
        </div>

        <h3 className={`font-semibold mb-2 ${
          badge.isAcquired ? 'text-foreground' : 'text-muted-foreground'
        }`}>
          {badge.name}
        </h3>
        
        <p className={`text-sm ${
          badge.isAcquired ? 'text-muted-foreground' : 'text-muted-foreground/60'
        }`}>
          {badge.description}
        </p>

        {badge.isAcquired && badge.acquiredDate && (
          <div className="mt-3 text-xs text-primary">
            {format(new Date(badge.acquiredDate), 'yyyy년 M월 d일')} 획득
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* 통계 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6 text-center">
          <div className="text-3xl font-bold text-primary mb-2">
            {acquiredBadges.length}
          </div>
          <div className="text-sm text-muted-foreground">획득한 배지</div>
        </div>
        
        <div className="card p-6 text-center">
          <div className="text-3xl font-bold text-muted-foreground mb-2">
            {unacquiredBadges.length}
          </div>
          <div className="text-sm text-muted-foreground">미획득 배지</div>
        </div>
        
        <div className="card p-6 text-center">
          <div className="text-3xl font-bold text-orange-500 mb-2">
            {Math.round((acquiredBadges.length / badges.length) * 100) || 0}%
          </div>
          <div className="text-sm text-muted-foreground">수집률</div>
        </div>
      </div>

      {/* 배지 섹션 */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="card p-6">
              <div className="animate-pulse">
                <div className="w-20 h-20 bg-muted rounded-full mx-auto mb-4" />
                <div className="h-4 bg-muted rounded mb-2" />
                <div className="h-3 bg-muted rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {acquiredBadges.length > 0 && (
            <div>
              <h2 className="text-2xl font-semibold mb-6 flex items-center">
                <Trophy className="w-6 h-6 text-yellow-500 mr-2" />
                획득한 배지 ({acquiredBadges.length})
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {acquiredBadges.map((badge) => (
                  <BadgeCard key={badge.id} badge={badge} />
                ))}
              </div>
            </div>
          )}

          {unacquiredBadges.length > 0 && (
            <div>
              <h2 className="text-2xl font-semibold mb-6 flex items-center">
                <Lock className="w-6 h-6 text-muted-foreground mr-2" />
                미획득 배지 ({unacquiredBadges.length})
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {unacquiredBadges.map((badge) => (
                  <BadgeCard key={badge.id} badge={badge} />
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* 배지 상세 모달 */}
      {selectedBadge && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg shadow-xl max-w-md w-full p-6 animate-fade-in">
            <div className="text-center">
              {/* 배지 아이콘 */}
              <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-4 ${
                selectedBadge.isAcquired 
                  ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white' 
                  : 'bg-gray-300 text-gray-500'
              }`}>
                {selectedBadge.iconUrl && selectedBadge.isAcquired ? (
                  <img
                    src={selectedBadge.iconUrl}
                    alt={selectedBadge.name}
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  React.createElement(getBadgeIcon(selectedBadge.name), { 
                    className: "w-12 h-12" 
                  })
                )}
              </div>

              <h3 className="text-xl font-bold mb-2">{selectedBadge.name}</h3>
              <p className="text-muted-foreground mb-4">{selectedBadge.description}</p>

              {selectedBadge.isAcquired ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                  <div className="flex items-center justify-center space-x-2 text-green-700">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="text-sm font-medium">획득 완료</span>
                  </div>
                  {selectedBadge.acquiredDate && (
                    <div className="text-xs text-green-600 mt-1">
                      {format(new Date(selectedBadge.acquiredDate), 'yyyy년 M월 d일')}
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-4">
                  <div className="flex items-center justify-center space-x-2 text-gray-600">
                    <Lock className="w-4 h-4" />
                    <span className="text-sm font-medium">미획득</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    조건을 만족하면 획득할 수 있습니다
                  </div>
                </div>
              )}

              <button
                onClick={() => setSelectedBadge(null)}
                className="w-full btn-primary"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 