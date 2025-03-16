'use client'

import React from 'react'
import Image from 'next/image'
import { Star, Truck, Shield, RotateCcw, ChevronLeft, ChevronRight, Share2, Heart, ChevronDown } from 'lucide-react'
import { useCart } from '../../../context/CartContext'
import { formatPrice, getBestPrice } from '../../../utils/formatters'

interface ProductPageClientProps {
  initialProduct: Product
}

interface Variant {
  id: string
  title: string
  price: number
  is_enabled: boolean
  options: Record<string, string>
}

interface ProductOption {
  name: string
  type: string
  values: string[]
  display_in_preview: boolean
}

interface Product {
  id: string
  title: string
  description: string
  images: Array<{ src: string }>
  variants: Variant[]
  options: ProductOption[]
}

// Helper function for safe logging (only in development)
const safeLog = (message: string, data: any) => {
  if (process.env.NODE_ENV !== 'production') {
    console.log(message, data);
  }
};

export default function ProductPageClient({ initialProduct }: ProductPageClientProps) {
  const [product] = React.useState<Product>(initialProduct)
  const [selectedSize, setSelectedSize] = React.useState<string>('')
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0)
  const [expandedSection, setExpandedSection] = React.useState<string | null>('description')
  const [showSizeGuide, setShowSizeGuide] = React.useState(false)
  const { addToCart } = useCart()
  const [quantity, setQuantity] = React.useState(1)

  // Debug: Log the initial product data
  React.useEffect(() => {
    safeLog('Initial product:', {
      variants: product.variants.map(v => ({
        title: v.title,
        options: v.options,
        price: v.price,
        is_enabled: v.is_enabled
      })),
      options: product.options
    });
  }, [product])

  // Get available sizes and their variants
  const sizeVariants = React.useMemo(() => {
    if (!product?.variants) return [];
    
    // Get all unique sizes from variant titles
    const sizes = new Set(product.variants.map(v => v.title.split(' / ')[1]).filter(Boolean));
    
    // Sort sizes in a logical order
    const sizeOrder = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL'];
    const sortedSizes = Array.from(sizes).sort((a, b) => {
      const aIndex = sizeOrder.indexOf(a);
      const bIndex = sizeOrder.indexOf(b);
      return aIndex === -1 ? 1 : bIndex === -1 ? -1 : aIndex - bIndex;
    });

    return sortedSizes.map(size => {
      const variant = product.variants.find(v => v.title.includes(` / ${size}`));
      return variant ? { size, variant } : null;
    }).filter((v): v is { size: string; variant: Variant } => v !== null);
  }, [product]);

  // Get available colors for the selected size
  const colorVariants = React.useMemo(() => {
    if (!product?.variants || !selectedSize) return [];
    
    // Get all variants for the selected size
    const sizeVariants = product.variants.filter(v => v.title.includes(` / ${selectedSize}`));
    
    // Extract unique colors
    const colors = new Set(sizeVariants.map(v => v.title.split(' / ')[0]));
    
    return Array.from(colors).map(color => {
      const variant = sizeVariants.find(v => v.title.startsWith(color));
      return variant ? { color, variant } : null;
    }).filter((v): v is { color: string; variant: Variant } => v !== null);
  }, [product, selectedSize]);

  const [selectedColor, setSelectedColor] = React.useState<string>('');

  // Set initial selected size and color
  React.useEffect(() => {
    if (sizeVariants.length > 0 && !selectedSize) {
      setSelectedSize(sizeVariants[0].size);
    }
  }, [sizeVariants, selectedSize]);

  React.useEffect(() => {
    if (colorVariants.length > 0 && !selectedColor) {
      setSelectedColor(colorVariants[0].color);
    }
  }, [colorVariants, selectedColor]);

  // Get the selected variant based on size and color
  const selectedVariant = React.useMemo(() => {
    if (!product?.variants || !selectedSize) return null;
    
    return product.variants.find(v => {
      const [color, size] = v.title.split(' / ');
      return size === selectedSize && (!selectedColor || color === selectedColor);
    }) || null;
  }, [product, selectedSize, selectedColor]);

  // Get option labels
  const optionLabels = React.useMemo(() => {
    if (!product?.options) return { size: 'Size', color: 'Color' };
    
    const sizeOption = product.options.find(opt => 
      opt.name.toLowerCase().includes('size') || 
      opt.type === 'size'
    );
    const colorOption = product.options.find(opt => 
      opt.name.toLowerCase().includes('color') || 
      opt.type === 'color'
    );
    
    return {
      size: sizeOption?.name || 'Size',
      color: colorOption?.name || 'Color'
    };
  }, [product]);

  // Price display section update
  const priceDisplay = React.useMemo(() => {
    const price = selectedVariant?.price || getBestPrice(product?.variants || []) || 0;
    return formatPrice(price);
  }, [selectedVariant, product]);

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta
    if (newQuantity >= 1 && newQuantity <= 99) {
      setQuantity(newQuantity)
    }
  }

  const handleAddToCart = () => {
    if (!selectedVariant || !product) return
    
    addToCart({
      id: product.id,
      title: product.title,
      price: selectedVariant.price,
      image: product.images[0]?.src || '/placeholder.jpg',
      variantId: selectedVariant.id,
      quantity: quantity,
      size: selectedSize || undefined
    })
  }

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section)
  }

  if (!product) return null

  // Filter out duplicate mockup images and paper type images
  const uniqueImages = product.images
    .filter((image) => !image.src.includes('paper-type'))
    .filter((image, index, self) => 
      index === self.findIndex((t) => t.src === image.src)
    )

  return (
    <div className="min-h-screen bg-[#1a1a3a] w-full overflow-x-hidden pb-20 md:pb-0">
      <div className="container mx-auto px-4 py-4 sm:py-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8 w-full">
          {/* Left Column - Image Gallery */}
          <div className="relative bg-white rounded-lg p-2 sm:p-4 w-full">
            <div className="relative aspect-square w-full">
              <Image
                src={uniqueImages[currentImageIndex]?.src || '/placeholder.jpg'}
                alt={product.title}
                fill
                priority={true}
                className="object-contain"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            </div>
            {/* Navigation Arrows */}
            {uniqueImages.length > 1 && (
              <>
                <button
                  onClick={() => setCurrentImageIndex((prev) => (prev === 0 ? uniqueImages.length - 1 : prev - 1))}
                  className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1 sm:p-2 hover:bg-white"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-4 w-4 sm:h-6 sm:w-6" />
                </button>
                <button
                  onClick={() => setCurrentImageIndex((prev) => (prev === uniqueImages.length - 1 ? 0 : prev + 1))}
                  className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1 sm:p-2 hover:bg-white"
                  aria-label="Next image"
                >
                  <ChevronRight className="h-4 w-4 sm:h-6 sm:w-6" />
                </button>
              </>
            )}
            {/* Thumbnail Grid */}
            <div className="grid grid-cols-4 gap-2 sm:gap-4 mt-2 sm:mt-4 w-full">
              {uniqueImages.map((image: any, index: number) => (
                <button
                  key={image.src}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`relative aspect-square bg-white rounded-lg overflow-hidden border-2 ${
                    currentImageIndex === index ? 'border-blue-500' : 'border-transparent'
                  }`}
                >
                  <Image
                    src={image.src}
                    alt={`${product.title} - View ${index + 1}`}
                    fill
                    className="object-contain p-1 sm:p-2"
                    sizes="(max-width: 640px) 25vw, (max-width: 1024px) 15vw, 10vw"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column - Product Info */}
          <div className="space-y-4 sm:space-y-6 w-full">
            {/* Title */}
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white break-words">{product.title}</h1>

            {/* Price */}
            <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white">
              {priceDisplay} <span className="text-sm sm:text-base lg:text-lg font-normal text-white/60">Excl. Tax</span>
            </div>

            {/* Size Selection */}
            <div className="space-y-2 sm:space-y-4 w-full">
              <div className="flex justify-between items-center flex-wrap gap-2">
                <h3 className="text-base sm:text-lg lg:text-xl font-medium text-white">{optionLabels.size}: {selectedSize}</h3>
                <button onClick={() => setShowSizeGuide(true)} className="text-sm sm:text-base text-blue-400 hover:text-blue-300">
                  Size guide
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 w-full">
                {sizeVariants.map(({ size, variant }) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`py-2 px-2 rounded-lg transition-colors ${
                      selectedSize === size
                        ? 'bg-white text-[#1a1a3a] font-medium'
                        : 'border border-white/20 text-white hover:border-white/40'
                    }`}
                  >
                    <div className="flex flex-col items-center">
                      <span className="text-xs sm:text-sm">
                        {product.title.toLowerCase().includes('poster') 
                          ? size.replace(' / Matte', '')
                          : size
                        }
                      </span>
                      <span className="text-xs sm:text-sm mt-1">{formatPrice(variant.price)}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selection - Only show if color options exist */}
            {colorVariants.length > 0 && (
              <div className="space-y-2 sm:space-y-4 w-full">
                <h3 className="text-base sm:text-lg lg:text-xl font-medium text-white">{optionLabels.color}: {selectedColor}</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 w-full">
                  {colorVariants.map(({ color, variant }) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`py-2 px-2 rounded-lg transition-colors ${
                        selectedColor === color
                          ? 'bg-white text-[#1a1a3a] font-medium'
                          : 'border border-white/20 text-white hover:border-white/40'
                      }`}
                    >
                      <div className="flex flex-col items-center">
                        <span className="text-xs sm:text-sm">{color}</span>
                        <span className="text-xs sm:text-sm mt-1">{formatPrice(variant.price)}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Paper Type - Only show for poster products */}
            {product.title.toLowerCase().includes('poster') && (
            <div className="space-y-2 sm:space-y-4">
              <h3 className="text-lg sm:text-xl font-medium text-white">Paper: Matte</h3>
            </div>
            )}

            {/* Quantity */}
            <div className="space-y-2 sm:space-y-4">
              <h3 className="text-lg sm:text-xl font-medium text-white">Quantity: {quantity}</h3>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => handleQuantityChange(-1)}
                  className="bg-[#1e1e4a] text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-[#2a2a5a]"
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className="bg-[#1e1e4a] text-white px-4 sm:px-6 py-2 rounded-lg">
                  {quantity}
                </span>
                <button 
                  onClick={() => handleQuantityChange(1)}
                  className="bg-[#1e1e4a] text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-[#2a2a5a]"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              className="w-full bg-white text-[#1a1a3a] font-medium py-3 sm:py-4 rounded-lg transition-colors hover:bg-gray-100"
            >
              Add to Cart
            </button>

            {/* About Product */}
            <div className="mt-4 sm:mt-8">
              <button
                onClick={() => toggleSection('description')}
                className="w-full flex items-center justify-between p-3 sm:p-4 bg-[#1e1e4a] rounded-lg text-white"
              >
                <span className="text-base sm:text-lg font-medium">About product</span>
                <ChevronDown className={`h-4 w-4 sm:h-5 sm:w-5 transform transition-transform ${
                  expandedSection === 'description' ? 'rotate-180' : ''
                }`} />
              </button>
              {expandedSection === 'description' && (
                <div className="p-3 sm:p-4 bg-[#1e1e4a]/50 rounded-b-lg mt-1">
                  <h3 className="text-white font-medium mb-2 sm:mb-4">{product.title}</h3>
                  
                  <p className="text-sm sm:text-base text-white/80 mb-3 sm:mb-6">
                    Introducing the perfect means to print art on – the premium matte vertical posters. 
                    Made with museum-grade paper (175gsm fine art paper), these posters translate any digital artwork into exquisite real life décor. 
                    Available in multiple sizes, each poster is printed with top-tier pigmented archival inks for a stunning end result.
                  </p>

                  <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm md:text-base text-white/80">
                    <p>.: Made with museum-grade archival paper (175gsm) for excellent printing fidelity and vibrant color reproduction.</p>
                    <p>.: Find the perfect match to your customers' needs thanks to the 46 available sizes.</p>
                    <p>.: For indoor use only</p>
                    <p>.: Assembled in the USA from globally sourced parts</p>
                    <p>.: NB! Due to the production process of these posters, please allow for slight size deviations with a tolerance +/- 1/16"</p>
                  </div>
                </div>
              )}
            </div>

            {/* Product Details */}
            <div>
              <button
                onClick={() => toggleSection('details')}
                className="w-full flex items-center justify-between p-3 sm:p-4 bg-[#1e1e4a] rounded-lg text-white"
              >
                <span className="text-base sm:text-lg font-medium">Product details</span>
                <ChevronDown className={`h-4 w-4 sm:h-5 sm:w-5 transform transition-transform ${
                  expandedSection === 'details' ? 'rotate-180' : ''
                }`} />
              </button>
              {expandedSection === 'details' && (
                <div className="p-3 sm:p-4 bg-[#1e1e4a]/50 rounded-b-lg mt-1">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8">
                    <div>
                      <h4 className="font-medium text-white mb-1 sm:mb-2">Museum grade paper</h4>
                      <p className="text-xs sm:text-sm md:text-base text-white/80">Museum grade paper is known to be archival, which means it can be stored for a long time without turning yellow</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-white mb-1 sm:mb-2">Hanging</h4>
                      <p className="text-xs sm:text-sm md:text-base text-white/80">Posters can be hung with double-sided tape, tacks, or framed</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-white mb-1 sm:mb-2">Giclée print</h4>
                      <p className="text-xs sm:text-sm md:text-base text-white/80">Bright and intense colors for your desired design that will not fade when exposed to sunlight regularly</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Care Instructions */}
            <div>
              <button
                onClick={() => toggleSection('care')}
                className="w-full flex items-center justify-between p-3 sm:p-4 bg-[#1e1e4a] rounded-lg text-white"
              >
                <span className="text-base sm:text-lg font-medium">Care instructions</span>
                <ChevronDown className={`h-4 w-4 sm:h-5 sm:w-5 transform transition-transform ${
                  expandedSection === 'care' ? 'rotate-180' : ''
                }`} />
              </button>
              {expandedSection === 'care' && (
                <div className="p-3 sm:p-4 bg-[#1e1e4a]/50 rounded-b-lg mt-1">
                  <p className="text-xs sm:text-sm md:text-base text-white/80">If the print does gather any dust, you may wipe it off gently with a clean, dry cloth.</p>
                </div>
              )}
            </div>

            {/* Shipping & Delivery */}
            <div>
              <button
                onClick={() => toggleSection('shipping')}
                className="w-full flex items-center justify-between p-3 sm:p-4 bg-[#1e1e4a] rounded-lg text-white"
              >
                <span className="text-base sm:text-lg font-medium">Shipping & delivery</span>
                <ChevronDown className={`h-4 w-4 sm:h-5 sm:w-5 transform transition-transform ${
                  expandedSection === 'shipping' ? 'rotate-180' : ''
                }`} />
              </button>
              {expandedSection === 'shipping' && (
                <div className="p-3 sm:p-4 bg-[#1e1e4a]/50 rounded-b-lg mt-1">
                  <p className="text-xs sm:text-sm md:text-base text-white/80">Accurate shipping options will be available in checkout after entering your full address.</p>
                  <div className="mt-3 sm:mt-4 bg-[#1e1e4a] rounded-lg p-3 sm:p-4">
                    <h4 className="font-medium text-white">Standard</h4>
                    <div className="flex justify-between mt-1 sm:mt-2">
                      <span className="text-xs sm:text-sm text-white/80">Cost</span>
                      <span className="text-xs sm:text-sm text-white">from USD 13.19</span>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-xs sm:text-sm text-white/80">Local delivery</span>
                      <span className="text-xs sm:text-sm text-white">10-30 business days</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Return Policy */}
            <div>
              <button
                onClick={() => toggleSection('returns')}
                className="w-full flex items-center justify-between p-3 sm:p-4 bg-[#1e1e4a] rounded-lg text-white"
              >
                <span className="text-base sm:text-lg font-medium">30 day return policy</span>
                <ChevronDown className={`h-4 w-4 sm:h-5 sm:w-5 transform transition-transform ${
                  expandedSection === 'returns' ? 'rotate-180' : ''
                }`} />
              </button>
              {expandedSection === 'returns' && (
                <div className="p-3 sm:p-4 bg-[#1e1e4a]/50 rounded-b-lg mt-1">
                  <p className="text-xs sm:text-sm md:text-base text-white/80">Any goods purchased can only be returned in accordance with the Terms and Conditions and Returns Policy.</p>
                  <p className="text-xs sm:text-sm md:text-base text-white/80 mt-2 sm:mt-4">We want to make sure that you are satisfied with your order and we are committed to making things right in case of any issues. We will provide a solution in cases of any defects if you contact us within 30 days of receiving your order.</p>
                  <button className="text-xs sm:text-sm text-blue-400 hover:text-blue-300 mt-2 sm:mt-4">See terms and conditions</button>
                </div>
              )}
            </div>

            <button className="text-xs sm:text-sm text-white/60 hover:text-white/80">Report this product</button>
          </div>
        </div>
      </div>
    </div>
  )
} 