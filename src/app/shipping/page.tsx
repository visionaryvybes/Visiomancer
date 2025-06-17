"use client";

import StoreLayout from "@/components/layout/StoreLayout";
import { Download, Clock, CheckCircle } from "lucide-react";
import Image from "next/image";

export default function ShippingPage() {
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
              Digital Delivery Information
            </h1>
            
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-8">
                <h2 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-2">
                  ✅ Instant Digital Downloads
                </h2>
                <p className="text-green-800 dark:text-green-200 mb-0">
                  All our aesthetics, wallpapers, posters, and art are delivered digitally - no physical shipping required!
                </p>
              </div>

              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">How Digital Delivery Works</h2>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/50 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-purple-600 dark:text-purple-400 font-bold">1</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Purchase</h3>
                    <p className="text-gray-600 dark:text-gray-300">Complete your order through our secure checkout</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/50 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-purple-600 dark:text-purple-400 font-bold">2</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Instant Access</h3>
                    <p className="text-gray-600 dark:text-gray-300">Receive download links immediately after payment</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/50 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-purple-600 dark:text-purple-400 font-bold">3</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Download</h3>
                    <p className="text-gray-600 dark:text-gray-300">Download your high-resolution files and enjoy!</p>
                  </div>
                </div>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">What You'll Receive</h3>
              <ul className="list-disc pl-6 mb-6 text-gray-600 dark:text-gray-300 space-y-2">
                <li>High-resolution digital files (typically 3072 x 6144 px at 300 DPI)</li>
                <li>PNG format for optimal quality and compatibility</li>
                <li>Files sized between 7-10 MB for crisp, detailed prints</li>
                <li>Download links sent to your email address</li>
                <li>Access to re-download for a limited time period</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Download Instructions</h3>
              <ol className="list-decimal pl-6 mb-6 text-gray-600 dark:text-gray-300 space-y-2">
                <li>Check your email for the download link (check spam folder if needed)</li>
                <li>Click the download link to access your files</li>
                <li>Save the files to your device or cloud storage</li>
                <li>Use the files for personal printing, wallpapers, or digital displays</li>
              </ol>

              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Technical Requirements</h3>
              <ul className="list-disc pl-6 mb-6 text-gray-600 dark:text-gray-300 space-y-2">
                <li>Any device capable of downloading files (computer, tablet, smartphone)</li>
                <li>Internet connection for downloading</li>
                <li>Image viewer or editing software to open PNG files</li>
                <li>Sufficient storage space (10-15 MB per download)</li>
              </ul>

              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
                <h4 className="text-lg font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
                  Important Notes
                </h4>
                <ul className="text-yellow-800 dark:text-yellow-200 space-y-1">
                  <li>• Download links are typically available for 30 days</li>
                  <li>• Files are for personal use only</li>
                  <li>• No physical products will be shipped</li>
                  <li>• Save your files immediately after download</li>
                </ul>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  Need Help?
                </h4>
                <p className="text-blue-800 dark:text-blue-200">
                  If you experience any issues with downloading your digital art, please contact our support team.
                </p>
              </div>

              <p className="text-sm text-gray-500 dark:text-gray-400 mt-8">
                Last updated: {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </main>
    </StoreLayout>
  );
} 