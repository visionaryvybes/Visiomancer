"use client";

import StoreLayout from "@/components/layout/StoreLayout";
import { FaPinterest, FaTiktok } from "react-icons/fa";
import { Mail, MessageSquare, Clock, Facebook, Twitter, Instagram } from "lucide-react";
import Image from "next/image";

export default function ContactPage() {
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
              Contact Us
            </h1>
            
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                Have questions about our digital art collection? Need help with your download? 
                We're here to help you get the most out of our aesthetics, wallpapers, posters, and art.
              </p>

              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/50 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-purple-600 dark:text-purple-400">📧</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Email Support</h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-2">
                        For technical issues, refunds, or general inquiries
                      </p>
                      <p className="text-purple-600 dark:text-purple-400 font-medium">
                        support@visiomancer.com
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/50 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-purple-600 dark:text-purple-400">⏰</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Response Time</h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        We typically respond within 24-48 hours during business days
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/50 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-purple-600 dark:text-purple-400">💬</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Social Media</h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-3">
                        Follow us for updates and inspiration
                      </p>
                      <div className="flex space-x-4">
                        <a 
                          href="https://www.pinterest.com/VISIOMANCER/" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-gray-600 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400 transition-colors"
                        >
                          <FaPinterest size={20} />
                        </a>
                        <a 
                          href="https://www.tiktok.com/@visiomancer" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-gray-600 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400 transition-colors"
                        >
                          <FaTiktok size={20} />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
                  Frequently Asked Questions
                </h3>
                <div className="space-y-3 text-blue-800 dark:text-blue-200">
                  <div>
                    <p className="font-medium">Q: I can't download my files, what should I do?</p>
                    <p className="text-sm">A: Check your email (including spam) for download links. If you still have issues, contact us with your order number.</p>
                  </div>
                  <div>
                    <p className="font-medium">Q: What file formats do you provide?</p>
                    <p className="text-sm">A: All our digital art is provided in high-resolution PNG format for the best quality and compatibility.</p>
                  </div>
                  <div>
                    <p className="font-medium">Q: How long do I have to download my files?</p>
                    <p className="text-sm">A: Download links are typically available for 30 days. Make sure to save your files promptly.</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mt-8">
                <p className="text-gray-600 dark:text-gray-300 text-center">
                  <strong>Visiomancer</strong> - Serving Aesthetics, Wallpapers, Posters and Art
                  <br />
                  <span className="text-sm">We're committed to providing you with beautiful digital art and excellent customer service.</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </StoreLayout>
  );
} 