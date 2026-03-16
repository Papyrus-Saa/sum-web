import type { Metadata } from 'next';
import { Josefin_Sans } from 'next/font/google';
import { RootLayoutClient } from './RootLayoutClient';
import './globals.css';
import Header from '@/components/header/Header';

const josefinSans = Josefin_Sans({
  variable: '--font-josefin-sans',
  subsets: ['latin']
});

export const metadata: Metadata = {
  title: 'SumTirecode',
  description: 'Search and manage tire codes'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" suppressHydrationWarning>
      <body
        className={`${josefinSans.variable} [font-family:var(--font-josefin-sans)] antialiased bg-main-l dark:bg-main-d text-main-d dark:text-main-l  overflow-hidden`}
        style={{ '--header-height': '64px' } as React.CSSProperties}
      >
        <RootLayoutClient>
          <Header />
          <div className="">{children}</div>
        </RootLayoutClient>
      </body>
    </html>
  );
}
