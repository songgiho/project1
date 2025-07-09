import { KakaoLoginButton } from '@/components/auth/KakaoLoginButton';
import { LoginForm } from '@/components/auth/LoginForm';
import { HelperLinks } from '@/components/auth/HelperLinks';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 card-cute">
        {/* 페이지 헤더 */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-nanum text-foreground mb-1">체감</h1>
          <p className="text-lg text-muted-foreground font-nanum">Log In or Sign Up to Get Started</p>
        </div>

        {/* 카카오 로그인 버튼 */}
        <KakaoLoginButton />

        {/* 구분선 */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-background text-muted-foreground font-nanum">or</span>
          </div>
        </div>

        {/* 로그인 폼 */}
        <LoginForm />

        {/* 헬퍼 링크 */}
        <HelperLinks />
      </div>
    </div>
  );
} 