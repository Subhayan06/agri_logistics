import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'KrishiQ | Official Mandi Bot • WhatsApp',
  description:
    'Pixel-perfect WhatsApp Web/Mobile chat interface for KrishiQ - Official Mandi e-Gate Pass Assistant.',
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#075E54',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="h-full m-0 p-0 overflow-hidden bg-[#eae6df] select-none">
        {children}
      </body>
    </html>
  );
}
