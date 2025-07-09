"use client";

import { InteractiveCalendar } from '@/components/dashboard/InteractiveCalendar';
import { AICoachTip } from '@/components/dashboard/AICoachTip';
import { useState } from 'react';

export default function Dashboard() {
  const [showTip, setShowTip] = useState(true);

  return (
    <div className="space-y-8 relative">
      {/* AI 코치 팁 */}
      {showTip ? (
        <div className="card-cute relative">
          <AICoachTip onClose={() => setShowTip(false)} />
        </div>
      ) : (
        <button
          className="fixed right-8 bottom-8 z-50 bg-primary text-primary-foreground px-4 py-2 rounded-full shadow-lg hover:bg-yellow-400 transition-colors font-nanum"
          onClick={() => setShowTip(true)}
        >
          AI 코치 팁 열기
        </button>
      )}

      {/* 메인 컨텐츠 - 달력만 전체 너비로 */}
      <div className="card-cute">
        <InteractiveCalendar />
      </div>
    </div>
  );
} 