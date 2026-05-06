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
  title: {
    default: 'Hanzi – Aprende vocabulario fácil',
    template: '%s | Hanzi',
  },
  description: 'Aprende vocabulario chino con repasos activos en español. Flashcards HSK, exámenes simulados y seguimiento de progreso.',
  openGraph: {
    type: 'website',
    url: 'https://hanzi.app',
    siteName: 'Hanzi',
    title: 'Hanzi – Aprende vocabulario fácil',
    description: 'Aprende vocabulario chino con repasos activos en español. Flashcards HSK, exámenes simulados y seguimiento de progreso.',
    images: [{ url: 'https://hanzi.app/opengraph-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hanzi – Aprende vocabulario fácil',
    description: 'Aprende vocabulario chino con repasos activos en español.',
    images: ['https://hanzi.app/opengraph-image.png'],
  },
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
