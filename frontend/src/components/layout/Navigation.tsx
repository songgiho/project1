'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Home, 
  Camera, 
  Trophy, 
  User,
  Brain,
  LogOut
} from 'lucide-react';

const navigationItems = [
  // { href: '/dashboard', label: '대시보드', icon: Home }, // 대시보드 메뉴 제거
  { href: '/log', label: '식사 로그', icon: Camera },
  { href: '/challenges', label: '챌린지', icon: Trophy },
  { href: '/profile', label: '프로필', icon: User },
];

export function Navigation() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    // 로컬 스토리지에서 토큰 제거
    localStorage.removeItem('authToken');
    // 로그인 페이지로 리다이렉트
    router.push('/login');
  };

  return (
    <nav className="bg-[#011936]">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* 로고 */}
          <Link href="/dashboard" className="flex items-center">
            <span className="text-base font-noto font-extrabold text-white">체감</span>
          </Link>

          {/* 네비게이션 메뉴 */}
          <div className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-2xl text-sm font-noto font-bold transition-colors
                    ${isActive
                      ? 'bg-white text-[#011936]'
                      : 'text-white hover:bg-[#233a50] hover:text-white'}
                  `}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* 사용자 메뉴 */}
          <div className="flex flex-col justify-end items-end gap-1 min-w-[110px]">
            <div className="hidden md:block text-xs text-white font-noto">
              안녕하세요, 사용자님!
            </div>
            <button 
              onClick={handleLogout}
              className="flex items-center space-x-1 px-2 py-1 rounded-2xl text-xs font-noto font-bold text-white hover:bg-[#233a50] transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden md:block">로그아웃</span>
            </button>
          </div>
        </div>

        {/* 모바일 네비게이션 */}
        <div className="md:hidden flex items-center justify-around py-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-2xl text-xs font-noto font-bold transition-colors
                  ${isActive
                    ? 'bg-white text-[#011936]'
                    : 'text-white hover:bg-[#233a50] hover:text-white'}
                `}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
} 