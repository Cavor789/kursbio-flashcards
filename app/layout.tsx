import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['cyrillic', 'latin'] });

export const metadata: Metadata = {
  title: 'Kursbio Карточки',
  description: 'Флеш-карточки по биологии — Kursbio',
  alternates: { canonical: 'https://kursbio.ru/cards/bio' },
  openGraph: {
    title: 'Kursbio Карточки',
    description: 'Флеш-карточки по биологии — Kursbio',
    url: 'https://kursbio.ru/cards/bio',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body className={`${inter.className} bg-[#f5f7fb] min-h-screen flex flex-col`}>
        <Header />
        <main className="flex-1 max-w-6xl mx-auto p-4">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
