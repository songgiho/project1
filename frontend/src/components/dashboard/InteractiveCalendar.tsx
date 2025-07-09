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

  // 달력 날짜 생성 (실제 달력처럼 1일의 요일에 맞춰 시작)
  const daysInMonth = getDaysInMonth(currentDate);
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const startDay = firstDayOfMonth.getDay(); // 0(일)~6(토)

  // 앞쪽 빈 칸
  const leadingEmpty = Array.from({ length: startDay });
  // 날짜 배열
  const calendarDays = Array.from({ length: daysInMonth }, (_, i) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), i + 1);
    return date;
  });
  // 뒤쪽 빈 칸 (마지막 날 이후)
  const totalCells = startDay + daysInMonth;
  const trailingEmpty = Array.from({ length: (7 - (totalCells % 7)) % 7 });

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
    <div className="card-cute p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-nanum text-foreground">
          {format(currentDate, 'yyyy년 M월')}
        </h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => changeMonth('prev')}
            className="p-2 rounded-full bg-pastel-blue hover:bg-blue-200 transition-colors shadow"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => changeMonth('next')}
            className="p-2 rounded-full bg-pastel-blue hover:bg-blue-200 transition-colors shadow"
          >
            <ChevronRight className="w-5 h-5" />
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
              <div key={day} className="p-2 text-center text-base font-nanum text-pastel-purple font-nanum">
                {day}
              </div>
            ))}
          </div>

          {/* 달력 그리드 */}
          <div className="grid grid-cols-7 gap-2">
            {/* 앞쪽 빈 칸 */}
            {leadingEmpty.map((_, idx) => (
              <div key={`empty-start-${idx}`} />
            ))}
            {/* 날짜 */}
            {calendarDays.map(date => {
              const dateStr = format(date, 'yyyy-MM-dd');
              const dayData = calendarData?.days[dateStr];
              const hasLogs = dayData?.meals.some(meal => meal.hasLog);
              
              return (
                <button
                  key={dateStr}
                  onClick={() => handleDateClick(date)}
                  className={`
                    p-2 h-20 rounded-2xl border transition-colors relative flex flex-col items-center justify-start bg-white shadow-sm
                    ${isSameMonth(date, currentDate) 
                      ? 'hover:bg-pastel-yellow' 
                      : 'bg-muted/50 text-muted-foreground'
                    }
                    ${isToday(date) 
                      ? 'border-primary bg-primary/10' 
                      : 'border-border'
                    }
                    ${hasLogs ? 'ring-2 ring-primary/30' : ''}
                  `}
                >
                  <div className="text-base font-nanum font-nanum">
                    {format(date, 'd')}
                  </div>
                  {renderMealIndicators(date)}
                </button>
              );
            })}
            {/* 뒤쪽 빈 칸 */}
            {trailingEmpty.map((_, idx) => (
              <div key={`empty-end-${idx}`} />
            ))}
          </div>
        </>
      )}

      {/* 범례 */}
      <div className="mt-6 flex flex-wrap gap-4 text-sm font-nanum">
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