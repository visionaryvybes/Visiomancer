"use client";

import StoreLayout from "@/components/layout/StoreLayout";
import Image from "next/image";

export default function ReturnsPage() {
  return (
    <StoreLayout>
      <main className="flex-1 w-full">
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 sm:p-8">
            <div className="flex justify-center mb-8">
              <Image
                src="/logo visiomancer.png"
                alt="VisionMancer"
                width={120}
                height={120}
                className="object-contain"
              />
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6 font-heading">
              Returns & Refunds
            </h1>
            
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Digital Products Policy</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Since all our products are digital downloads (aesthetics, wallpapers, posters, and art), 
                they are delivered instantly upon purchase completion. Due to the nature of digital goods, 
                we generally cannot offer returns once the download has been completed.
              </p>

              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">When We Offer Refunds</h3>
              <ul className="list-disc pl-6 mb-6 text-gray-600 dark:text-gray-300 space-y-2">
                <li>Technical issues preventing download within 48 hours of purchase</li>
                <li>File corruption or inability to open the downloaded files</li>
                <li>Significant discrepancy between product description and delivered content</li>
                <li>Duplicate accidental purchases made within 24 hours</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Refund Process</h3>
              <ol className="list-decimal pl-6 mb-6 text-gray-600 dark:text-gray-300 space-y-2">
                <li>Contact us within 7 days of purchase with your order details</li>
                <li>Provide a clear description of the issue</li>
                <li>Include screenshots if applicable</li>
                <li>We will review and respond within 2-3 business days</li>
              </ol>

              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Non-Refundable Situations</h3>
              <ul className="list-disc pl-6 mb-6 text-gray-600 dark:text-gray-300 space-y-2">
                <li>Change of mind after successful download</li>
                <li>Incompatibility with your device (please check requirements before purchase)</li>
                <li>Downloading to wrong device or losing files</li>
                <li>Purchases made more than 7 days ago</li>
              </ul>

              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
                <h4 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  Contact for Support
                </h4>
                <p className="text-blue-800 dark:text-blue-200">
                  If you experience any issues with your digital downloads, please reach out to us. 
                  We're committed to ensuring you receive the high-quality digital art you purchased.
                </p>
              </div>

              <p className="text-sm text-gray-500 dark:text-gray-400 mt-8">
                This policy was last updated: {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </main>
    </StoreLayout>
  );
} 