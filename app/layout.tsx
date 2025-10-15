// app/layout.tsx
import './globals.css';
import React from 'react';
import HeroGate from '@/components/HeroGate';

export const metadata = {
  title: 'Kursbio Карточки',
  description: 'Карточки и колоды по биологии.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body className="bg-gray-50 text-gray-900">
        {/* Фиолетовый баннер показываем только там, где надо */}
        <HeroGate />

        {/* Единый контейнер для страниц */}
        <main className="max-w-6xl mx-auto px-4 py-6">
          {children}
        </main>
      </body>
    </html>
  );
}
