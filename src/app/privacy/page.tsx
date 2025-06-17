"use client";

import StoreLayout from "@/components/layout/StoreLayout";
import Image from "next/image";

export default function PrivacyPage() {
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
              Privacy Policy
            </h1>
            
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                At Visiomancer, we are committed to protecting your privacy and personal information. 
                This policy explains how we collect, use, and safeguard your data when you use our digital art store.
              </p>

              <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
                <strong>Effective Date:</strong> {new Date().toLocaleDateString()}
              </p>

              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Information We Collect</h2>
              
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Personal Information</h3>
              <ul className="list-disc pl-6 mb-6 text-gray-600 dark:text-gray-300 space-y-2">
                <li>Email address (for purchase confirmation and download links)</li>
                <li>Payment information (processed securely through Gumroad)</li>
                <li>Name (if provided during checkout)</li>
                <li>Communication preferences</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Automatically Collected Information</h3>
              <ul className="list-disc pl-6 mb-6 text-gray-600 dark:text-gray-300 space-y-2">
                <li>Browser type and version</li>
                <li>Device information</li>
                <li>IP address and location data</li>
                <li>Pages visited and time spent on our site</li>
                <li>Referral source</li>
              </ul>

              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">How We Use Your Information</h2>
              <ul className="list-disc pl-6 mb-6 text-gray-600 dark:text-gray-300 space-y-2">
                <li>Process and fulfill your digital art purchases</li>
                <li>Send download links and purchase confirmations</li>
                <li>Provide customer support</li>
                <li>Improve our website and user experience</li>
                <li>Analyze site usage and track conversions</li>
                <li>Prevent fraud and ensure security</li>
              </ul>

              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Third-Party Services</h2>
              
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Payment Processing</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                We use <strong>Gumroad</strong> for secure payment processing. Your payment information is handled 
                directly by Gumroad and is subject to their privacy policy. We do not store your payment details.
              </p>

              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Analytics and Tracking</h3>
              <ul className="list-disc pl-6 mb-6 text-gray-600 dark:text-gray-300 space-y-2">
                <li><strong>Pinterest Conversions API:</strong> We track page visits and purchases to measure advertising effectiveness</li>
                <li><strong>Website Analytics:</strong> We collect anonymous usage data to improve our services</li>
              </ul>

              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Data Security</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                We implement appropriate security measures to protect your personal information against unauthorized 
                access, alteration, disclosure, or destruction. However, no internet transmission is 100% secure, 
                and we cannot guarantee absolute security.
              </p>

              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Cookies and Tracking</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Our website uses cookies and similar technologies to:
              </p>
              <ul className="list-disc pl-6 mb-6 text-gray-600 dark:text-gray-300 space-y-2">
                <li>Remember your preferences (like dark mode)</li>
                <li>Maintain your shopping cart</li>
                <li>Analyze site usage</li>
                <li>Track conversions for advertising</li>
              </ul>

              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Your Rights</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">You have the right to:</p>
              <ul className="list-disc pl-6 mb-6 text-gray-600 dark:text-gray-300 space-y-2">
                <li>Access the personal information we have about you</li>
                <li>Request correction of inaccurate information</li>
                <li>Request deletion of your personal information</li>
                <li>Opt-out of marketing communications</li>
                <li>Disable cookies in your browser settings</li>
              </ul>

              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Data Retention</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                We retain your personal information only as long as necessary to provide our services and comply 
                with legal obligations. Purchase records are typically kept for 7 years for tax and legal purposes.
              </p>

              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Children's Privacy</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Our services are not directed to children under 13. We do not knowingly collect personal 
                information from children under 13. If you believe we have collected such information, 
                please contact us immediately.
              </p>

              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Changes to This Policy</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                We may update this privacy policy from time to time. We will notify you of any significant 
                changes by posting the new policy on our website with an updated effective date.
              </p>

              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Contact Us</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                If you have any questions about this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>Email:</strong> privacy@visiomancer.com<br />
                  <strong>Subject:</strong> Privacy Policy Inquiry
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </StoreLayout>
  );
} 