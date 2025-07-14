import { KakaoLoginButton } from '@/components/auth/KakaoLoginButton';
import { LoginForm } from '@/components/auth/LoginForm';
import { HelperLinks } from '@/components/auth/HelperLinks';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 card-cute">
        {/* 페이지 헤더 */}
        <div className="text-center space-y-2 mb-14">
          <h1 className="text-3xl font-noto text-foreground mb-1">체감</h1>
        </div>

        {/* 로그인 폼 */}
        <LoginForm />

        {/* 헬퍼 링크 */}
        <HelperLinks />

        {/* 구분선 */}
        <div className="relative flex items-center my-6">
          <div className="flex-grow border-t border-border" />
          <span className="mx-4 text-muted-foreground font-noto text-sm whitespace-nowrap">또는</span>
          <div className="flex-grow border-t border-border" />
        </div>

        {/* 카카오 로그인 버튼 */}
        <KakaoLoginButton />
      </div>
    </div>
  );
} 