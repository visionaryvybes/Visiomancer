import type { Metadata } from "next";
import { CartProvider } from '@/context/CartContext';
import { ProductsProvider } from '@/context/ProductsContext';
import { WishlistProvider } from '@/context/WishlistContext';
import { ConversionsProvider } from '@/context/ConversionsContext';
import { Toaster } from 'react-hot-toast';
import "./globals.css";

export const metadata: Metadata = {
  title: "Visiomancer - Digital Art Store",
  description: "Serving Aesthetics, Wallpapers, Posters and Art - Digital collections for creators",
  icons: {
    icon: [
      { url: '/logo visiomancer.png', sizes: '32x32', type: 'image/png' },
      { url: '/logo visiomancer.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [
      { url: '/logo visiomancer.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/logo visiomancer.png',
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
        <link rel="icon" href="/logo visiomancer.png" type="image/png" />
        <link rel="apple-touch-icon" href="/logo visiomancer.png" />
        <link rel="shortcut icon" href="/logo visiomancer.png" type="image/png" />
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