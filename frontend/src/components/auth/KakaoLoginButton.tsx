'use client';

import React from 'react';

export function KakaoLoginButton() {
  const handleKakaoLogin = async () => {
    try {
      // 카카오 OAuth URL로 리다이렉트
      const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI}&response_type=code`;
      window.location.href = kakaoAuthUrl;
    } catch (error) {
      console.error('Kakao login failed:', error);
    }
  };

  return (
    <button
      onClick={handleKakaoLogin}
      className="w-full btn-primary rounded-full py-3 px-4 flex items-center justify-center space-x-3 text-base font-bold shadow-lg"
      style={{ background: '#FEE500', color: '#3C1E1E', border: 'none' }}
    >
      {/* 카카오 로고 */}
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <ellipse cx="12" cy="12" rx="10" ry="10" fill="#3C1E1E" />
        <ellipse cx="12" cy="12" rx="9" ry="9" fill="#FEE500" />
        <ellipse cx="12" cy="12" rx="7" ry="7" fill="#FEE500" />
        <ellipse cx="12" cy="12" rx="5" ry="5" fill="#FEE500" />
      </svg>
      <span>Continue with Kakao</span>
    </button>
  );
} 