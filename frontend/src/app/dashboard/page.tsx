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
        <AICoachTip onClose={() => setShowTip(false)} />
      ) : (
        <button
          className="fixed right-8 bottom-8 z-50 rounded-2xl bg-[#011936] text-white px-6 py-3 shadow-lg font-noto font-bold"
          onClick={() => setShowTip(true)}
        >
          AI 코치 팁 열기
        </button>
      )}

      {/* 메인 컨텐츠 - 달력만 전체 너비로 */}
      <InteractiveCalendar />
    </div>
  );
} 