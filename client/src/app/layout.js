import './globals.css';
import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Solar Intelligence - AI-Powered Solar Management',
  description: 'Live IoT monitoring, predictive maintenance, smart recycling, and sustainability analytics',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Toaster 
          position="top-right"
          toastOptions={{
            style: {
              background: 'rgba(10, 31, 26, 0.95)',
              color: '#fff',
              border: '1px solid rgba(0, 255, 136, 0.3)',
              backdropFilter: 'blur(10px)',
            },
            success: {
              iconTheme: {
                primary: '#00ff88',
                secondary: '#0a1f1a',
              },
            },
            error: {
              iconTheme: {
                primary: '#ff4444',
                secondary: '#0a1f1a',
              },
            },
          }}
        />
      </body>
    </html>
  );
}
