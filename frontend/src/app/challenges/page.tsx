import { ChallengeList } from '@/components/challenges/ChallengeList';

export default function ChallengesPage() {
  return (
    <div className="space-y-8">
      {/* 페이지 헤더 */}
      <div className="card-cute flex items-center space-x-4">
        <span className="text-4xl">🏆</span>
        <div>
          <h1 className="text-3xl font-nanum text-foreground mb-1">챌린지</h1>
          <p className="text-lg text-muted-foreground font-nanum">
            다른 사용자들과 함께 다이어트 게임에 참여하고 목표를 달성하세요
          </p>
        </div>
      </div>

      {/* 챌린지 목록 */}
      <div className="card-cute">
        <ChallengeList />
      </div>
    </div>
  );
} 