import type { Metadata } from 'next';
import { Josefin_Sans } from 'next/font/google';
import { RootLayoutClient } from './RootLayoutClient';
import './globals.css';

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
        className={`${josefinSans.variable} [font-family:var(--font-josefin-sans)] antialiased bg-main-l dark:bg-main-d text-main-d dark:text-main-l min-h-screen lg:px-20`}
      >
        <RootLayoutClient>{children}</RootLayoutClient>
      </body>
    </html>
  );
}
