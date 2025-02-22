import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from './providers';
import '../styles/globals.css';
import { BreadcrumbProvider } from '@/contexts/BreadcrumbContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SecureGuard - Security Platform',
  description: 'Advanced security monitoring and compliance platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <BreadcrumbProvider>
          <Providers>{children}</Providers>
        </BreadcrumbProvider>
      </body>
    </html>
  );
}