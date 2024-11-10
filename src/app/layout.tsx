// src/app/layout.tsx
import { Inter } from 'next/font/google';
import { ToastProvider } from '@/components/ui/toast-context';
import { SocketProvider } from '@/hooks/socket-context';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SocketProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </SocketProvider>
      </body>
    </html>
  );
}