"use client";

import StoreLayout from "@/components/layout/StoreLayout";
import Image from "next/image";

export default function TermsPage() {
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
              Terms of Service
            </h1>
            
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Welcome to Visiomancer. By using our website and purchasing our digital art products, 
                you agree to these Terms of Service. Please read them carefully.
              </p>

              <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
                <strong>Effective Date:</strong> {new Date().toLocaleDateString()}
              </p>

              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">1. Our Services</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Visiomancer provides digital art products including:
              </p>
              <ul className="list-disc pl-6 mb-6 text-gray-600 dark:text-gray-300 space-y-2">
                <li>Digital aesthetics and artwork</li>
                <li>High-resolution wallpapers</li>
                <li>Printable digital posters</li>
                <li>Digital art files in PNG format</li>
              </ul>

              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">2. Digital Product License</h2>
              
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Personal Use License</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                When you purchase our digital products, you receive a personal use license that allows you to:
              </p>
              <ul className="list-disc pl-6 mb-6 text-gray-600 dark:text-gray-300 space-y-2">
                <li>Use the digital art for personal, non-commercial purposes</li>
                <li>Print the artwork for personal use in your home or office</li>
                <li>Use as wallpapers on your personal devices</li>
                <li>Share prints as gifts (not for resale)</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Restrictions</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">You may NOT:</p>
              <ul className="list-disc pl-6 mb-6 text-gray-600 dark:text-gray-300 space-y-2">
                <li>Resell, redistribute, or share the digital files</li>
                <li>Use the artwork for commercial purposes</li>
                <li>Claim the artwork as your own creation</li>
                <li>Modify or alter the artwork significantly</li>
                <li>Upload to print-on-demand services for sale</li>
                <li>Share download links with others</li>
              </ul>

              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">3. Purchase and Payment</h2>
              <ul className="list-disc pl-6 mb-6 text-gray-600 dark:text-gray-300 space-y-2">
                <li>All purchases are processed through Gumroad, our payment provider</li>
                <li>Prices are listed in USD and may vary by region</li>
                <li>Payment must be completed before accessing downloads</li>
                <li>All sales are final, subject to our Returns policy</li>
              </ul>

              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">4. Digital Delivery</h2>
              <ul className="list-disc pl-6 mb-6 text-gray-600 dark:text-gray-300 space-y-2">
                <li>Digital products are delivered via email download links</li>
                <li>Download links are typically available for 30 days</li>
                <li>You are responsible for downloading and saving your files</li>
                <li>We are not responsible for lost or expired download links due to user negligence</li>
              </ul>

              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">5. Contact Information</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>Email:</strong> legal@visiomancer.com<br />
                  <strong>Subject:</strong> Terms of Service Inquiry
                </p>
              </div>

              <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <p className="text-blue-800 dark:text-blue-200 text-sm">
                  <strong>Thank you for choosing Visiomancer!</strong> We're committed to providing you with 
                  beautiful digital aesthetics, wallpapers, posters, and art while protecting both your rights 
                  and our intellectual property.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </StoreLayout>
  );
} 