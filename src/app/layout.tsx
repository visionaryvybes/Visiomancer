import type { Metadata } from "next";
import { CartProvider } from '@/context/CartContext';
import { ProductsProvider } from '@/context/ProductsContext';
import { WishlistProvider } from '@/context/WishlistContext';
import { ConversionsProvider } from '@/context/ConversionsContext';
import { Toaster } from 'react-hot-toast';
import { Analytics } from "@vercel/analytics/next";
import EmailCollectionWrapper from '@/components/ui/EmailCollectionWrapper';
import PinterestTrackingDebugger from '@/components/ui/PinterestTrackingDebugger';
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
              
              // Get external_id from localStorage or generate it (same logic as ConversionsContext)
              try {
                var externalId = localStorage.getItem('visiomancer_external_id');
                if (!externalId) {
                  // Generate consistent external_id based on browser fingerprint
                  var fingerprint = navigator.userAgent + '-' + navigator.language + '-' + 
                                   screen.width + 'x' + screen.height + '-' + 
                                   (navigator.hardwareConcurrency || '');
                  var hash = 0;
                  for (var i = 0; i < fingerprint.length; i++) {
                    var char = fingerprint.charCodeAt(i);
                    hash = ((hash << 5) - hash) + char;
                    hash = hash & hash;
                  }
                  externalId = Math.abs(hash).toString();
                  localStorage.setItem('visiomancer_external_id', externalId);
                }
                pinterestLoadConfig.external_id = externalId;
              } catch(e) {
                console.log('Pinterest: Could not generate external_id');
              }
              
              // Extract click ID from URL parameters
              try {
                var urlParams = new URLSearchParams(window.location.search);
                var clickId = urlParams.get('epik') || 
                             urlParams.get('pinterest_click_id') || 
                             urlParams.get('_epik') ||
                             urlParams.get('click_id');
                if (clickId) {
                  pinterestLoadConfig.click_id = clickId;
                }
              } catch(e) {
                console.log('Pinterest: Could not extract click_id');
              }
              
              pintrk('load', '2614113117297', pinterestLoadConfig);
              pintrk('page');
              
              // Also send page event with enhanced data
              // Note: Product-specific pagevisit events with content_ids are handled 
              // by usePageTracking hook on individual product pages
              pintrk('track', 'pagevisit', {
                page_url: window.location.href,
                page_title: document.title
              });
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
                {/* Pinterest Tracking Debugger - Temporarily disabled */}
                {/* {process.env.NODE_ENV === 'development' && 
                 typeof window !== 'undefined' && 
                 (window.location.search.includes('debug=pinterest') || localStorage.getItem('pinterest_debug') === 'true') && 
                 <PinterestTrackingDebugger />} */}
              </CartProvider>
            </ConversionsProvider>
          </WishlistProvider>
        </ProductsProvider>
      </body>
    </html>
  );
}