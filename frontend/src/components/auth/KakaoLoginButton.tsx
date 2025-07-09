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
      className="w-full bg-[#FEE500] hover:bg-[#FDD800] text-[#3C1E1E] font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-3 shadow-sm"
    >
      {/* 카카오 로고 */}
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 3C6.48 3 2 6.48 2 12c0 5.52 4.48 10 10 10s10-4.48 10-10c0-5.52-4.48-10-10-10zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
        <path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"/>
      </svg>
      
      {/* 버튼 텍스트 */}
      <span>Continue with Kakao</span>
    </button>
  );
} 