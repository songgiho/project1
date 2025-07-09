import { BadgeCollection } from '@/components/profile/BadgeCollection';

interface ProfilePageProps {
  params: Promise<{
    username: string;
  }>;
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { username } = await params;
  
  return (
    <div className="space-y-8">
      {/* 페이지 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">프로필</h1>
          <p className="text-muted-foreground mt-1">
            @{username}의 프로필과 획득한 배지를 확인하세요
          </p>
        </div>
      </div>

      {/* 배지 컬렉션 */}
      <BadgeCollection username={username} />
    </div>
  );
} 