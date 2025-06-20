import type { Metadata } from "next";
import { CartProvider } from '@/context/CartContext';
import { ProductsProvider } from '@/context/ProductsContext';
import { WishlistProvider } from '@/context/WishlistContext';
import { ConversionsProvider } from '@/context/ConversionsContext';
import { Toaster } from 'react-hot-toast';
import { Analytics } from "@vercel/analytics/next";
import EmailCollectionWrapper from '@/components/ui/EmailCollectionWrapper';
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
  verification: {
    other: {
      'p:domain_verify': 'b8fb5a83d7d1a8709f4faa3ca46e1fea',
    }
  },
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
        
        {/* Pinterest Tag with Enhanced Match Support (2025 EQS Compliant) */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              !function(e){if(!window.pintrk){window.pintrk = function () {
              window.pintrk.queue.push(Array.prototype.slice.call(arguments))};var
                n=window.pintrk;n.queue=[],n.version="3.0";var
                t=document.createElement("script");t.async=!0,t.src=e;var
                r=document.getElementsByTagName("script")[0];
                r.parentNode.insertBefore(t,r)}}("https://s.pinimg.com/ct/core.js");
              
              // Enhanced Match initialization with dynamic email and external_id
              var pinterestLoadConfig = {};
              
              // Get email from localStorage if available for Enhanced Match
              try {
                var storedEmail = localStorage.getItem('visiomancer_user_email');
                if (storedEmail) {
                  pinterestLoadConfig.em = storedEmail; // Pinterest will hash this automatically
                }
              } catch(e) {
                console.log('Pinterest: Could not access stored email');
              }
              
              // Generate external_id for Enhanced Match (EQS requirement)
              try {
                var browserData = navigator.userAgent + '-' + navigator.language + '-' + screen.width + 'x' + screen.height;
                var externalId = '';
                for (var i = 0; i < browserData.length; i++) {
                  externalId += browserData.charCodeAt(i).toString(16);
                }
                pinterestLoadConfig.external_id = externalId.substring(0, 64); // Pinterest limit
              } catch(e) {
                console.log('Pinterest: Could not generate external_id');
              }
              
              pintrk('load', '2614113117297', pinterestLoadConfig);
              pintrk('page');
            `
          }}
        />
        
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
                <EmailCollectionWrapper />
                <Toaster position="bottom-right" />
                <Analytics />
              </CartProvider>
            </ConversionsProvider>
          </WishlistProvider>
        </ProductsProvider>
      </body>
    </html>
  );
}