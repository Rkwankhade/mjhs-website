import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/ui/theme-provider';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://www.mjhskaranja.edu.in'),
  title: {
    default: 'M.J. High School, Karanja Lad | Excellence in Education',
    template: '%s | M.J. High School Karanja Lad',
  },
  description:
    'M.J. High School, Karanja Lad, Washim District, Maharashtra — Providing quality education with modern facilities and dedicated faculty since 1965. Nurturing Minds, Building Futures.',
  keywords: [
    'M.J. High School',
    'Karanja Lad',
    'Maharashtra school',
    'Washim district school',
    'SSC school Maharashtra',
    'best school Karanja',
    'secondary school Washim',
  ],
  authors: [{ name: 'M.J. High School' }],
  creator: 'M.J. High School',
  publisher: 'M.J. High School',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: '/',
    siteName: 'M.J. High School Karanja Lad',
    title: 'M.J. High School, Karanja Lad | Excellence in Education',
    description:
      'Providing quality education since 1965 — Karanja Lad, Washim District, Maharashtra',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'M.J. High School Karanja Lad',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'M.J. High School, Karanja Lad',
    description: 'Excellence in Education since 1965',
    images: ['/images/og-image.jpg'],
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0f2547" />
      </head>
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
