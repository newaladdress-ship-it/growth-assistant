import './globals.css';
import { AppStateProvider } from '@/lib/appState';
import { AuthProvider } from '@/lib/authContext';
import PwaRegister from '@/components/PwaRegister';
import InstallPWA from '@/components/InstallPWA';

export const metadata = {
  title: 'AIGrowth - AI Web Growth & Audit Assistant',
  description: 'Automate SEO audits, performance benchmarks, and accessibility compliance with neural-guided optimization.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'AIGrowth',
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
};

export const viewport = {
  themeColor: '#004ac6',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="AIGrowth" />
      </head>
      <body suppressHydrationWarning>
        <AuthProvider>
          <AppStateProvider>
            {children}
            <PwaRegister />
            <InstallPWA />
          </AppStateProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
