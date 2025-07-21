import type { Metadata } from 'next';
import './globals.css';
import { ConditionalNavigation } from '@/components/layout/ConditionalNavigation';

export const metadata: Metadata = {
  title: '체감',
  description: 'AI 기반 영양 분석과 소셜 게임화를 통한 다이어트 관리 서비스',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="font-nanum">
        <div className="min-h-screen bg-background">
          <ConditionalNavigation />
          <main className="container mx-auto px-4 py-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
