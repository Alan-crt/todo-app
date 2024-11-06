import React from 'react';
import { Inter } from 'next/font/google';
import { NavBar } from '@/components/navigation/NavBar';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Privacy-Focused Todo App',
  description: 'A secure, self-hosted todo list application with real-time collaboration',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NavBar />
        <main className="min-h-screen pt-16">{children}</main>
        <Toaster />
      </body>
    </html>
  );
}