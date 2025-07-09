import { MealUploader } from '@/components/meals/MealUploader';

export default function LogPage() {
  return (
    <div className="space-y-8">
      {/* 페이지 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">식사 로그</h1>
          <p className="text-muted-foreground mt-1">
            사진을 업로드하여 AI 분석으로 간편하게 식사를 기록하세요
          </p>
        </div>
      </div>

      {/* 식사 업로더 */}
      <MealUploader />
    </div>
  );
} 