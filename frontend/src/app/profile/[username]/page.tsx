import { BadgeCollection } from '@/components/profile/BadgeCollection';

interface ProfilePageProps {
  params: { username: string };
}

export default function ProfilePage({ params }: ProfilePageProps) {
  const { username } = params;
  return (
    <div className="space-y-8">
      {/* 프로필 헤더 */}
      <div className="flex items-center space-x-6 card-cute">
        <div className="w-24 h-24 rounded-full bg-pastel-blue flex items-center justify-center shadow-lg">
          {/* 캐릭터/아바타 이미지 (샘플) */}
          <span className="text-5xl">🧑‍🎤</span>
        </div>
        <div>
          <h1 className="text-3xl font-nanum text-foreground mb-1">사용자 프로필</h1>
          <p className="text-lg text-muted-foreground font-nanum">나의 뱃지와 챌린지 기록을 확인하세요</p>
        </div>
      </div>

      {/* 뱃지 컬렉션 */}
      <div className="card-cute">
        <BadgeCollection username={username} />
      </div>
    </div>
  );
} 