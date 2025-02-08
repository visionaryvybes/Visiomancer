import React from "react"
import { WarpBackground } from "../../components/ui/warp-background"
import { Truck, Clock, Globe, CreditCard } from "lucide-react"

export default function ShippingPage() {
  return (
    <div className="min-h-screen">
      <WarpBackground>
        <div className="mx-auto max-w-4xl px-4 py-16">
          <h1 className="mb-8 text-center text-4xl font-bold">Shipping Information</h1>

          <div className="space-y-8">
            {/* Shipping Methods */}
            <section className="rounded-lg border border-white/10 bg-black/20 p-6 backdrop-blur-sm">
              <div className="flex items-start gap-4">
                <Truck className="h-6 w-6 flex-shrink-0 text-blue-400" />
                <div>
                  <h2 className="mb-4 text-2xl font-semibold">Shipping Methods</h2>
                  <div className="space-y-4">
                    <div className="rounded-lg border border-white/10 bg-black/10 p-4">
                      <h3 className="mb-2 font-medium">Standard Shipping</h3>
                      <p className="text-gray-300">
                        5-7 business days<br />
                        Free for orders over $50<br />
                        $4.99 for orders under $50
                      </p>
                    </div>
                    <div className="rounded-lg border border-white/10 bg-black/10 p-4">
                      <h3 className="mb-2 font-medium">Express Shipping</h3>
                      <p className="text-gray-300">
                        2-3 business days<br />
                        $14.99 flat rate
                      </p>
                    </div>
                    <div className="rounded-lg border border-white/10 bg-black/10 p-4">
                      <h3 className="mb-2 font-medium">Next Day Delivery</h3>
                      <p className="text-gray-300">
                        Next business day<br />
                        $24.99 flat rate<br />
                        Order by 2 PM for same-day processing
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Processing Time */}
            <section className="rounded-lg border border-white/10 bg-black/20 p-6 backdrop-blur-sm">
              <div className="flex items-start gap-4">
                <Clock className="h-6 w-6 flex-shrink-0 text-blue-400" />
                <div>
                  <h2 className="mb-4 text-2xl font-semibold">Processing Time</h2>
                  <p className="text-gray-300">
                    Most orders are processed within 1-2 business days. During peak seasons 
                    or promotional periods, processing may take up to 3 business days. You'll 
                    receive a confirmation email with tracking information once your order ships.
                  </p>
                </div>
              </div>
            </section>

            {/* International Shipping */}
            <section className="rounded-lg border border-white/10 bg-black/20 p-6 backdrop-blur-sm">
              <div className="flex items-start gap-4">
                <Globe className="h-6 w-6 flex-shrink-0 text-blue-400" />
                <div>
                  <h2 className="mb-4 text-2xl font-semibold">International Shipping</h2>
                  <p className="mb-4 text-gray-300">
                    We ship to most countries worldwide. International shipping rates and 
                    delivery times vary by location. Customs duties and taxes may apply 
                    and are the responsibility of the customer.
                  </p>
                  <div className="rounded-lg border border-white/10 bg-black/10 p-4">
                    <h3 className="mb-2 font-medium">Estimated Delivery Times</h3>
                    <ul className="list-inside list-disc space-y-2 text-gray-300">
                      <li>Canada: 7-10 business days</li>
                      <li>Europe: 10-15 business days</li>
                      <li>Asia Pacific: 12-18 business days</li>
                      <li>Rest of World: 15-20 business days</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Payment & Security */}
            <section className="rounded-lg border border-white/10 bg-black/20 p-6 backdrop-blur-sm">
              <div className="flex items-start gap-4">
                <CreditCard className="h-6 w-6 flex-shrink-0 text-blue-400" />
                <div>
                  <h2 className="mb-4 text-2xl font-semibold">Payment & Security</h2>
                  <p className="text-gray-300">
                    We accept all major credit cards, PayPal, and Apple Pay. All transactions 
                    are secure and encrypted. Your payment information is never stored on our 
                    servers.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </WarpBackground>
    </div>
  )
} 