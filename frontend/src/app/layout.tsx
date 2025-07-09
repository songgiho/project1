import type { Metadata } from 'next';
import './globals.css';
import { Navigation } from '@/components/layout/Navigation';

export const metadata: Metadata = {
  title: 'Diet Survival - 다이어트 생존 게임',
  description: 'AI 기반 영양 분석과 소셜 게임화를 통한 다이어트 관리 서비스',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        <div className="min-h-screen bg-background">
          <Navigation />
          <main className="container mx-auto px-4 py-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
