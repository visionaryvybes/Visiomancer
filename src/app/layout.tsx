import type { Metadata } from "next";
import { CartProvider } from '@/context/CartContext';
import { ProductsProvider } from '@/context/ProductsContext';
import { WishlistProvider } from '@/context/WishlistContext';
import { ConversionsProvider } from '@/context/ConversionsContext';
import { Toaster } from 'react-hot-toast';
import "./globals.css";

export const metadata: Metadata = {
  title: "Visiomancer - Digital Art Store",
  description: "Premium digital art collections and visual assets",
  icons: {
    icon: [
      { url: '/images/logo.png', sizes: '32x32', type: 'image/png' },
      { url: '/images/logo.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [
      { url: '/images/logo.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/images/logo.png',
  },
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" style={{ fontFamily: "'Share Tech Mono', monospace" }}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=M+PLUS+1+Code:wght@400;500;700&family=Share+Tech+Mono&display=swap" 
          rel="stylesheet" 
        />
        <link rel="icon" href="/images/logo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/images/logo.png" />
        <link rel="shortcut icon" href="/images/logo.png" type="image/png" />
        <style dangerouslySetInnerHTML={{
          __html: `
            * {
              font-family: 'Share Tech Mono', monospace !important;
            }
            h1, h2, h3, h4, h5, h6 {
              font-family: 'M PLUS 1 Code', monospace !important;
              font-weight: 700 !important;
            }
          `
        }} />
      </head>
      <body style={{ fontFamily: "'Share Tech Mono', monospace" }}>
        <ProductsProvider>
          <WishlistProvider>
            <ConversionsProvider>
              <CartProvider>
                {children}
                <Toaster position="bottom-right" />
              </CartProvider>
            </ConversionsProvider>
          </WishlistProvider>
        </ProductsProvider>
      </body>
    </html>
  );
}