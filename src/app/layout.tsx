import type {Metadata} from 'next';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { Toaster } from '@/components/ui/toaster';
import { FirebaseClientProvider } from '@/firebase';

export const metadata: Metadata = {
  title: 'BHOSARI RENTALS | High-Performance Fleet Hub',
  description: 'High-performance bike rentals for modern operatives. Standardized fleet and professional service.',
  icons: {
    icon: 'https://firebasestorage.googleapis.com/v0/b/studio-9741197854-fd9d5.firebasestorage.app/o/download%20(1).jpg?alt=media&token=866cc6c8-7b20-4216-b920-73cdb591852e',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-background text-foreground industrial-grid min-h-screen">
        <FirebaseClientProvider>
          <Navbar />
          <main className="relative pt-20">
            {children}
          </main>
          <Toaster />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
