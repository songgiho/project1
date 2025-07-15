'use client';

import React, { useState } from 'react';
import { Target, Trophy, Calendar, Plus, CheckCircle, XCircle } from 'lucide-react';
import { apiClient } from '@/lib/api';

interface MyChallengeStatusBoardProps {
  todayGoal: number;
  todayIntake: number;
  streak: number;
  challengeId?: string;
  userId?: number;
}

export function MyChallengeStatusBoard({ 
  todayGoal, 
  todayIntake, 
  streak, 
  challengeId,
  userId = 1 
}: MyChallengeStatusBoardProps) {
  const [showRecordForm, setShowRecordForm] = useState(false);
  const [recording, setRecording] = useState(false);
  const [recordData, setRecordData] = useState({
    date: new Date().toISOString().split('T')[0],
    calorie: todayIntake,
    macros: {
      protein: 0,
      carbs: 0,
      fat: 0
    },
    image_url: null
  });

  const progress = Math.min(100, (todayIntake / todayGoal) * 100);
  const isGoalAchieved = todayIntake <= todayGoal;

  const handleRecordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!challengeId) return;

    setRecording(true);
    try {
      await apiClient.addChallengeRecord(challengeId, userId, recordData);
      alert('오늘의 기록이 성공적으로 추가되었습니다!');
      setShowRecordForm(false);
      // 페이지 새로고침 또는 상태 업데이트
      window.location.reload();
    } catch (error) {
      console.error('Failed to add record:', error);
      alert('기록 추가에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setRecording(false);
    }
  };

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold font-nanum">나의 챌린지 현황</h2>
        {challengeId && (
          <button
            onClick={() => setShowRecordForm(!showRecordForm)}
            className="btn-primary flex items-center space-x-2 px-4 py-2"
          >
            <Plus className="w-4 h-4" />
            <span>기록 추가</span>
          </button>
        )}
      </div>

      {/* 기록 추가 폼 */}
      {showRecordForm && challengeId && (
        <div className="mb-6 p-4 bg-muted rounded-lg">
          <h3 className="text-lg font-bold mb-4">오늘의 기록 추가</h3>
          <form onSubmit={handleRecordSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">날짜</label>
                <input
                  type="date"
                  value={recordData.date}
                  onChange={(e) => setRecordData({...recordData, date: e.target.value})}
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">칼로리 (kcal)</label>
                <input
                  type="number"
                  value={recordData.calorie}
                  onChange={(e) => setRecordData({...recordData, calorie: parseFloat(e.target.value) || 0})}
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">단백질 (g)</label>
                <input
                  type="number"
                  value={recordData.macros.protein}
                  onChange={(e) => setRecordData({
                    ...recordData, 
                    macros: {...recordData.macros, protein: parseFloat(e.target.value) || 0}
                  })}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">탄수화물 (g)</label>
                <input
                  type="number"
                  value={recordData.macros.carbs}
                  onChange={(e) => setRecordData({
                    ...recordData, 
                    macros: {...recordData.macros, carbs: parseFloat(e.target.value) || 0}
                  })}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">지방 (g)</label>
                <input
                  type="number"
                  value={recordData.macros.fat}
                  onChange={(e) => setRecordData({
                    ...recordData, 
                    macros: {...recordData.macros, fat: parseFloat(e.target.value) || 0}
                  })}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
            </div>

            <div className="flex space-x-2">
              <button
                type="submit"
                disabled={recording}
                className="btn-primary px-4 py-2"
              >
                {recording ? '기록 중...' : '기록 추가'}
              </button>
              <button
                type="button"
                onClick={() => setShowRecordForm(false)}
                className="btn-secondary px-4 py-2"
              >
                취소
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 현재 상태 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 오늘 목표 */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <Target className="w-6 h-6 text-primary mr-2" />
            <h3 className="text-lg font-bold">오늘 목표</h3>
          </div>
          <div className="text-3xl font-bold text-primary">{todayGoal} kcal</div>
          <div className="text-sm text-muted-foreground mt-1">일일 칼로리 목표</div>
        </div>

        {/* 현재 섭취량 */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <Calendar className="w-6 h-6 text-blue-500 mr-2" />
            <h3 className="text-lg font-bold">현재 섭취량</h3>
          </div>
          <div className="text-3xl font-bold text-blue-500">{todayIntake} kcal</div>
          <div className="text-sm text-muted-foreground mt-1">
            {isGoalAchieved ? (
              <span className="text-green-600 flex items-center justify-center">
                <CheckCircle className="w-4 h-4 mr-1" />
                목표 달성!
              </span>
            ) : (
              <span className="text-red-600 flex items-center justify-center">
                <XCircle className="w-4 h-4 mr-1" />
                목표 초과
              </span>
            )}
          </div>
        </div>

        {/* 연속 기록 */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <Trophy className="w-6 h-6 text-yellow-500 mr-2" />
            <h3 className="text-lg font-bold">연속 기록</h3>
          </div>
          <div className="text-3xl font-bold text-yellow-500">{streak}일</div>
          <div className="text-sm text-muted-foreground mt-1">현재 스트릭</div>
        </div>
      </div>

      {/* 진행률 바 */}
      <div className="mt-6">
        <div className="flex justify-between text-sm mb-2">
          <span>진행률</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className={`h-3 rounded-full transition-all duration-300 ${
              isGoalAchieved ? 'bg-green-500' : 'bg-red-500'
            }`}
            style={{ width: `${Math.min(100, progress)}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>0 kcal</span>
          <span>{todayGoal} kcal</span>
        </div>
      </div>

      {/* 목표 달성 상태 */}
      <div className="mt-4 p-4 rounded-lg bg-muted">
        <div className="flex items-center justify-between">
          <span className="font-medium">오늘의 목표 달성 상태</span>
          {isGoalAchieved ? (
            <span className="text-green-600 font-bold flex items-center">
              <CheckCircle className="w-5 h-5 mr-1" />
              성공
            </span>
          ) : (
            <span className="text-red-600 font-bold flex items-center">
              <XCircle className="w-5 h-5 mr-1" />
              실패
            </span>
          )}
        </div>
        <div className="text-sm text-muted-foreground mt-1">
          {isGoalAchieved 
            ? '축하합니다! 오늘의 목표를 달성했습니다.'
            : `목표까지 ${todayGoal - todayIntake}kcal 남았습니다.`
          }
        </div>
      </div>
    </div>
  );
} 