import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata = {
  title: 'Kursbio Карточки',
  description: 'Флеш-карточки по биологии — Kursbio',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body className="min-h-screen bg-gray-50 text-gray-900 font-[Inter] antialiased flex flex-col">
        <Header />
        <main className="flex-grow max-w-6xl mx-auto w-full p-4">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
