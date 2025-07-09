'use client';

import React from 'react';
import Link from 'next/link';

export function HelperLinks() {
  return (
    <div className="space-y-4 text-center font-nunito">
      {/* SSO 및 비밀번호 찾기 링크 */}
      <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-6 text-sm">
        <Link
          href="/auth/sso"
          className="text-muted-foreground hover:text-primary transition-colors font-nunito"
        >
          Single Sign-On (SSO)
        </Link>
        <span className="hidden sm:inline text-muted-foreground">•</span>
        <Link
          href="/auth/forgot-password"
          className="text-muted-foreground hover:text-primary transition-colors font-nunito"
        >
          Forgot Password?
        </Link>
      </div>

      {/* 회원가입 링크 */}
      <div className="text-sm">
        <span className="text-muted-foreground">Don't have an account? </span>
        <Link
          href="/signup"
          className="text-primary hover:text-primary/80 font-bold transition-colors font-nunito"
        >
          Sign Up
        </Link>
      </div>

      {/* 약관 및 개인정보 처리방침 */}
      <div className="text-xs text-muted-foreground space-y-1">
        <p>
          By continuing, you agree to our{' '}
          <Link
            href="/terms"
            className="underline hover:text-primary transition-colors font-nunito"
          >
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link
            href="/privacy"
            className="underline hover:text-primary transition-colors font-nunito"
          >
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
} 