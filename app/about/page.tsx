import React from "react"
import { WarpBackground } from "../../components/ui/warp-background"

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <WarpBackground>
        <div className="mx-auto max-w-4xl px-4 py-16">
          <h1 className="mb-8 text-center text-4xl font-bold">About VISIOMANCER</h1>
          
          <div className="space-y-8">
            <section className="rounded-lg border border-white/10 bg-black/20 p-6 backdrop-blur-sm">
              <h2 className="mb-4 text-2xl font-semibold">Our Story</h2>
              <p className="text-gray-300">
                VISIOMANCER was founded with a simple yet powerful vision: to bring unique, 
                high-quality products to those who appreciate distinctive design and exceptional 
                craftsmanship. Our journey began with a passion for creating products that 
                combine aesthetic beauty with practical functionality.
              </p>
            </section>

            <section className="rounded-lg border border-white/10 bg-black/20 p-6 backdrop-blur-sm">
              <h2 className="mb-4 text-2xl font-semibold">Our Mission</h2>
              <p className="text-gray-300">
                We strive to provide our customers with products that not only meet their needs 
                but exceed their expectations. Every item in our collection is carefully selected 
                to ensure the highest quality and unique design that sets us apart from the ordinary.
              </p>
            </section>

            <section className="rounded-lg border border-white/10 bg-black/20 p-6 backdrop-blur-sm">
              <h2 className="mb-4 text-2xl font-semibold">Quality & Sustainability</h2>
              <p className="text-gray-300">
                At VISIOMANCER, we believe in responsible business practices. We work with 
                suppliers who share our commitment to quality and sustainability. Our products 
                are made to last, reducing waste and environmental impact while providing 
                excellent value to our customers.
              </p>
            </section>

            <section className="rounded-lg border border-white/10 bg-black/20 p-6 backdrop-blur-sm">
              <h2 className="mb-4 text-2xl font-semibold">Customer Experience</h2>
              <p className="text-gray-300">
                Your satisfaction is our top priority. We are committed to providing exceptional 
                customer service at every step of your journey with us. From browsing our 
                collection to after-sales support, we're here to ensure you have the best 
                possible experience.
              </p>
            </section>
          </div>
        </div>
      </WarpBackground>
    </div>
  )
} 