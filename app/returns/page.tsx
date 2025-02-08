import React from "react"
import { WarpBackground } from "../../components/ui/warp-background"
import { RefreshCw, ShieldCheck, HelpCircle, Package } from "lucide-react"

export default function ReturnsPage() {
  return (
    <div className="min-h-screen">
      <WarpBackground>
        <div className="mx-auto max-w-4xl px-4 py-16">
          <h1 className="mb-8 text-center text-4xl font-bold">Returns & Refunds</h1>

          <div className="space-y-8">
            {/* Return Policy Overview */}
            <section className="rounded-lg border border-white/10 bg-black/20 p-6 backdrop-blur-sm">
              <div className="flex items-start gap-4">
                <RefreshCw className="h-6 w-6 flex-shrink-0 text-blue-400" />
                <div>
                  <h2 className="mb-4 text-2xl font-semibold">Our Return Policy</h2>
                  <p className="text-gray-300">
                    We want you to be completely satisfied with your purchase. If you're not 
                    happy with your order, we accept returns within 30 days of delivery for 
                    a full refund or exchange. Items must be unused and in their original 
                    packaging with all tags attached.
                  </p>
                </div>
              </div>
            </section>

            {/* Return Process */}
            <section className="rounded-lg border border-white/10 bg-black/20 p-6 backdrop-blur-sm">
              <div className="flex items-start gap-4">
                <Package className="h-6 w-6 flex-shrink-0 text-blue-400" />
                <div>
                  <h2 className="mb-4 text-2xl font-semibold">Return Process</h2>
                  <div className="space-y-4">
                    <div className="rounded-lg border border-white/10 bg-black/10 p-4">
                      <h3 className="mb-2 font-medium">Step 1: Request a Return</h3>
                      <p className="text-gray-300">
                        Contact our customer service team to initiate a return. You'll need 
                        your order number and the reason for return. We'll provide you with 
                        a return authorization and shipping label.
                      </p>
                    </div>
                    <div className="rounded-lg border border-white/10 bg-black/10 p-4">
                      <h3 className="mb-2 font-medium">Step 2: Package Your Return</h3>
                      <p className="text-gray-300">
                        Carefully pack the item(s) in their original packaging. Include all 
                        tags, accessories, and documentation. Attach the provided shipping 
                        label to the outside of the package.
                      </p>
                    </div>
                    <div className="rounded-lg border border-white/10 bg-black/10 p-4">
                      <h3 className="mb-2 font-medium">Step 3: Ship Your Return</h3>
                      <p className="text-gray-300">
                        Drop off your package at any authorized shipping location. Keep your 
                        tracking number for reference. We'll process your return within 5-7 
                        business days of receiving it.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Refund Information */}
            <section className="rounded-lg border border-white/10 bg-black/20 p-6 backdrop-blur-sm">
              <div className="flex items-start gap-4">
                <ShieldCheck className="h-6 w-6 flex-shrink-0 text-blue-400" />
                <div>
                  <h2 className="mb-4 text-2xl font-semibold">Refund Information</h2>
                  <p className="mb-4 text-gray-300">
                    Once we receive and inspect your return, we'll process your refund. The 
                    money will be refunded to your original payment method within 3-5 business 
                    days. Shipping costs are non-refundable unless the return is due to our error.
                  </p>
                  <div className="rounded-lg border border-white/10 bg-black/10 p-4">
                    <h3 className="mb-2 font-medium">Refund Timeline</h3>
                    <ul className="list-inside list-disc space-y-2 text-gray-300">
                      <li>Return shipping: 3-5 business days</li>
                      <li>Return processing: 1-2 business days</li>
                      <li>Refund processing: 3-5 business days</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* FAQ */}
            <section className="rounded-lg border border-white/10 bg-black/20 p-6 backdrop-blur-sm">
              <div className="flex items-start gap-4">
                <HelpCircle className="h-6 w-6 flex-shrink-0 text-blue-400" />
                <div>
                  <h2 className="mb-4 text-2xl font-semibold">Frequently Asked Questions</h2>
                  <div className="space-y-4">
                    <div>
                      <h3 className="mb-2 font-medium">What items cannot be returned?</h3>
                      <p className="text-gray-300">
                        Personalized items, intimate apparel, and final sale items cannot be 
                        returned. Items damaged through normal wear and tear are also not eligible 
                        for return.
                      </p>
                    </div>
                    <div>
                      <h3 className="mb-2 font-medium">Do I need the original receipt?</h3>
                      <p className="text-gray-300">
                        While having the original receipt is preferred, we can also process 
                        returns using your order number or the email address used for purchase.
                      </p>
                    </div>
                    <div>
                      <h3 className="mb-2 font-medium">What about damaged items?</h3>
                      <p className="text-gray-300">
                        If you receive a damaged item, please contact us immediately with photos 
                        of the damage. We'll send a replacement or process a refund right away.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </WarpBackground>
    </div>
  )
} 