import type { Metadata } from 'next'
import { Sora, DM_Sans, Noto_Serif_SC } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from 'sonner'
import { AuthProvider } from '@/lib/auth-context'
import './globals.css'

const sora = Sora({
  subsets: ['latin'],
  variable: '--font-sora',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
})

const notoSerifSC = Noto_Serif_SC({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-noto-serif-sc',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Hanzi - Aprende chino en español | Vocabulario HSK1',
  description:
    'Flashcards con caracteres, pinyin y traducción al español. Active recall real, progreso visible. Pensado para hispanohablantes desde el primer día.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={`${sora.variable} ${dmSans.variable} ${notoSerifSC.variable}`}>
      <body className="font-sans antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
        <Analytics />
        <Toaster />
      </body>
    </html>
  )
}
