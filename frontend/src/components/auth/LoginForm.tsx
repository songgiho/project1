'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';

interface LoginFormData {
  email: string;
  password: string;
}

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        // 로그인 성공 시 user 정보를 localStorage에 저장
        if (result.user) {
          localStorage.setItem('user', JSON.stringify(result.user));
        }
        // 로그인 성공 시 대시보드로 리다이렉트
        window.location.href = '/dashboard';
      } else {
        const errorData = await response.json();
        setError(errorData.message || '로그인에 실패했습니다.');
      }
    } catch (error) {
      setError('네트워크 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* 이메일 입력 필드 */}
      <div>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            {...register('email', {
              required: '이메일을 입력해주세요.',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: '유효한 이메일 주소를 입력해주세요.',
              },
            })}
            type="email"
            placeholder="Email"
            className="w-full pl-10 pr-4 py-3 border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white font-nunito text-base shadow-sm"
          />
        </div>
        {errors.email && (
          <p className="text-sm text-destructive mt-1 font-nunito">{errors.email.message}</p>
        )}
      </div>

      {/* 비밀번호 입력 필드 */}
      <div>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            {...register('password', {
              required: '비밀번호를 입력해주세요.',
              minLength: {
                value: 6,
                message: '비밀번호는 최소 6자 이상이어야 합니다.',
              },
            })}
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            className="w-full pl-10 pr-12 py-3 border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white font-nunito text-base shadow-sm"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
        {errors.password && (
          <p className="text-sm text-destructive mt-1 font-nunito">{errors.password.message}</p>
        )}
      </div>

      {/* 에러 메시지 */}
      {error && (
        <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-xl p-3 font-nunito">
          {error}
        </div>
      )}

      {/* 로그인 버튼 */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full btn-primary rounded-full py-3 px-4 text-base font-bold shadow-md font-nunito"
      >
        {isLoading ? '로그인 중...' : 'Log In'}
      </button>
    </form>
  );
} 