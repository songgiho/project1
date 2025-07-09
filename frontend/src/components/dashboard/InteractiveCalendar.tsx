'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, getDaysInMonth, isSameMonth, isToday, addMonths, subMonths } from 'date-fns';
import { apiClient } from '@/lib/api';
import { MonthlyCalendar } from '@/types';
import { DailyReportModal } from './DailyReportModal';

export function InteractiveCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarData, setCalendarData] = useState<MonthlyCalendar | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // 월 변경 함수
  const changeMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => direction === 'prev' ? subMonths(prev, 1) : addMonths(prev, 1));
  };

  // 달력 데이터 로드
  useEffect(() => {
    const loadCalendarData = async () => {
      setLoading(true);
      try {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1;
        const data = await apiClient.getMonthlyLogs(year, month);
        setCalendarData(data);
      } catch (error) {
        console.error('Failed to load calendar data:', error);
        // 임시 데이터 사용
        setCalendarData({
          year: currentDate.getFullYear(),
          month: currentDate.getMonth() + 1,
          days: {
            '2025-01-15': {
              meals: [
                { type: 'breakfast', hasLog: true },
                { type: 'lunch', hasLog: true },
                { type: 'dinner', hasLog: false },
                { type: 'snack', hasLog: true },
              ]
            },
            '2025-01-16': {
              meals: [
                { type: 'breakfast', hasLog: true },
                { type: 'lunch', hasLog: true },
                { type: 'dinner', hasLog: true },
                { type: 'snack', hasLog: false },
              ]
            },
          }
        });
      }
      setLoading(false);
    };

    loadCalendarData();
  }, [currentDate]);

  // 날짜 클릭 핸들러
  const handleDateClick = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    setSelectedDate(dateStr);
  };

  // 달력 날짜 생성
  const daysInMonth = getDaysInMonth(currentDate);
  const calendarDays = Array.from({ length: daysInMonth }, (_, i) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), i + 1);
    return date;
  });

  // 식사 인디케이터 렌더링
  const renderMealIndicators = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const dayData = calendarData?.days[dateStr];
    
    if (!dayData) return null;

    return (
      <div className="flex justify-center space-x-1 mt-1">
        {dayData.meals.map((meal, index) => (
          <div
            key={index}
            className={`meal-indicator ${meal.hasLog ? `meal-${meal.type}` : 'bg-gray-200'}`}
          />
        ))}
      </div>
    );
  };

  // 요일 헤더
  const weekDays = ['일', '월', '화', '수', '목', '금', '토'];

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">
          {format(currentDate, 'yyyy년 M월')}
        </h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => changeMonth('prev')}
            className="p-2 rounded-md hover:bg-muted transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => changeMonth('next')}
            className="p-2 rounded-md hover:bg-muted transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">로딩 중...</div>
        </div>
      ) : (
        <>
          {/* 요일 헤더 */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekDays.map(day => (
              <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
                {day}
              </div>
            ))}
          </div>

          {/* 달력 그리드 */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map(date => {
              const dateStr = format(date, 'yyyy-MM-dd');
              const dayData = calendarData?.days[dateStr];
              const hasLogs = dayData?.meals.some(meal => meal.hasLog);
              
              return (
                <button
                  key={dateStr}
                  onClick={() => handleDateClick(date)}
                  className={`
                    p-2 h-20 rounded-lg border transition-colors relative
                    ${isSameMonth(date, currentDate) 
                      ? 'bg-card hover:bg-muted' 
                      : 'bg-muted/50 text-muted-foreground'
                    }
                    ${isToday(date) 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border'
                    }
                    ${hasLogs ? 'ring-1 ring-primary/20' : ''}
                  `}
                >
                  <div className="text-sm font-medium">
                    {format(date, 'd')}
                  </div>
                  {renderMealIndicators(date)}
                </button>
              );
            })}
          </div>
        </>
      )}

      {/* 범례 */}
      <div className="mt-6 flex flex-wrap gap-4 text-sm">
        <div className="flex items-center space-x-2">
          <div className="meal-indicator meal-breakfast" />
          <span>아침</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="meal-indicator meal-lunch" />
          <span>점심</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="meal-indicator meal-dinner" />
          <span>저녁</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="meal-indicator meal-snack" />
          <span>간식</span>
        </div>
      </div>

      {/* 일일 리포트 모달 */}
      {selectedDate && (
        <DailyReportModal
          date={selectedDate}
          onClose={() => setSelectedDate(null)}
        />
      )}
    </div>
  );
} 