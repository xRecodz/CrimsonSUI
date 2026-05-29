import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import '@mysten/dapp-kit/dist/index.css'
import { Providers } from '@/components/providers'
import { BRAND_NAME, BRAND_TAGLINE } from '@/lib/brand'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: `${BRAND_NAME} — DeFi Quests on Sui`,
  description: BRAND_TAGLINE,
  generator: 'xrecodz',
  icons: {
    icon: [{ url: '/crimson.jpg', type: 'image/jpeg' }],
    apple: '/crimson.jpg',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-background scroll-smooth antialiased">
      <body className="font-sans antialiased">
        <Providers>
          {children}
        </Providers>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
