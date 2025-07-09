import { KakaoLoginButton } from '@/components/auth/KakaoLoginButton';
import { LoginForm } from '@/components/auth/LoginForm';
import { HelperLinks } from '@/components/auth/HelperLinks';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* 페이지 헤더 */}
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-6">
            <svg className="w-8 h-8 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Diet Survival
          </h1>
          <p className="text-xl text-muted-foreground">
            Log In or Sign Up to Get Started
          </p>
        </div>

        {/* 카카오 로그인 버튼 */}
        <KakaoLoginButton />

        {/* 구분선 */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-background text-muted-foreground">
              or
            </span>
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