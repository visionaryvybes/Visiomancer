import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
// import "../styles/animations.css"; // Commented out animation import
import StoreLayout from "@/components/layout/StoreLayout";
import { ProductsProvider } from "@/context/ProductsContext";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { Toaster } from 'react-hot-toast';
import Script from 'next/script';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Gumroad & Printful Store",
  description: "E-commerce site integrating Gumroad and Printful",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const PINTEREST_TAG_ID = '2614113117297';

  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Script id="pinterest-base" strategy="afterInteractive">
          {`
            !function(e){if(!window.pintrk){window.pintrk = function() {
            window.pintrk.queue.push(Array.prototype.slice.call(arguments))};var
            n=window.pintrk;n.queue=[],n.version="3.0";var
            t=document.createElement("script");t.async=!0,t.src=e;var
            r=document.getElementsByTagName("script")[0];
            r.parentNode.insertBefore(t,r)}}("https://s.pinimg.com/ct/core.js");
            pintrk('load', '${PINTEREST_TAG_ID}');
            pintrk('page');
          `}
        </Script>
        <noscript>
          <img height="1" width="1" style={{display:'none'}} alt=""
            src={`https://ct.pinterest.com/v3/?tid=${PINTEREST_TAG_ID}&event=init&noscript=1`}
            fetchPriority="low"
          />
        </noscript>
      </head>
      <body className={inter.className}>
        <ProductsProvider>
          <CartProvider>
            <WishlistProvider>
              <StoreLayout>
                {children}
              </StoreLayout>
              <Toaster position="bottom-right" />
            </WishlistProvider>
          </CartProvider>
        </ProductsProvider>
      </body>
    </html>
  );
}
