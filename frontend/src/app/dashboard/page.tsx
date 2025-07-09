import { InteractiveCalendar } from '@/components/dashboard/InteractiveCalendar';
import { AICoachTip } from '@/components/dashboard/AICoachTip';

export default function Dashboard() {
  return (
    <div className="space-y-8">
      {/* 페이지 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">대시보드</h1>
          <p className="text-muted-foreground mt-1">
            식사 로그를 확인하고 진행 중인 챌린지를 관리하세요
          </p>
        </div>
      </div>

      {/* AI 코치 팁 */}
      <AICoachTip />

      {/* 메인 컨텐츠 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 달력 */}
        <div className="lg:col-span-2">
          <InteractiveCalendar />
        </div>

        {/* 사이드바 */}
        <div className="space-y-6">
          {/* 현재 활성 챌린지 */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold mb-4">활성 챌린지</h3>
            <div className="space-y-3">
              <div className="p-3 bg-challenge-active/10 rounded-lg border border-challenge-active/20">
                <div className="flex items-center justify-between">
                  <span className="font-medium">7일 칼로리 챌린지</span>
                  <span className="text-sm text-primary">3일 남음</span>
                </div>
                <div className="mt-2 text-sm text-muted-foreground">
                  목표: 1,800kcal 이하
                </div>
              </div>
            </div>
          </div>

          {/* 최근 성과 */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold mb-4">최근 성과</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">연속 로그 기록</span>
                <span className="text-sm font-medium">5일</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">평균 칼로리</span>
                <span className="text-sm font-medium">1,750kcal</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">완료된 챌린지</span>
                <span className="text-sm font-medium">3개</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 