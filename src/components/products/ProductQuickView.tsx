'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { X, ShoppingCart, Heart, Share2, Star, Zap } from 'lucide-react';
import { Product } from '@/types';
import Button from '@/components/ui/Button';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useConversions } from '@/context/ConversionsContext';
import { toast } from 'react-hot-toast';

interface ProductQuickViewProps {
  product: Product;
  onClose: () => void;
}

export default function ProductQuickView({ product, onClose }: ProductQuickViewProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { trackAddToCart } = useConversions();

  const handleAddToCart = () => {
    addItem(product, quantity);
    trackAddToCart(product.id, product.name, product.price * quantity);
    onClose();  // CartContext will handle the notification
  };

  const handleBuyNow = () => {
    if (product.gumroadUrl) {
      // Build proper Gumroad checkout URL
      const buildGumroadCheckoutUrl = (gumroadUrl: string, quantity: number): string => {
        try {
          const url = new URL(gumroadUrl);
          
          // Ensure we have the wanted=true parameter for direct checkout
          url.searchParams.set('wanted', 'true');
          
          // Add quantity parameter
          url.searchParams.set('quantity', quantity.toString());
          
          return url.toString();
        } catch (error) {
          console.error('Error constructing Gumroad URL:', error);
          // Fallback to simple concatenation
          const hasParams = gumroadUrl.includes('?');
          const connector = hasParams ? '&' : '?';
          return `${gumroadUrl}${connector}wanted=true&quantity=${quantity}`;
        }
      };
      
      const finalUrl = buildGumroadCheckoutUrl(product.gumroadUrl, quantity);
      
      console.log('[Quick View Buy Now] Opening URL:', finalUrl);
      
      window.open(finalUrl, '_blank');
      toast.success('Redirecting to checkout...');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex flex-col md:flex-row h-full">
          {/* Images Section */}
          <div className="md:w-1/2 bg-gray-800 p-8">
            <div className="relative">
              <button
                onClick={onClose}
                className="absolute -top-4 -right-4 bg-gray-700 hover:bg-gray-600 text-white rounded-full p-2 transition-colors z-10"
              >
                <X size={20} />
              </button>
              
              {/* Main Image */}
              {product.images?.[selectedImage] && (
                <div className="aspect-square relative rounded-xl overflow-hidden mb-4">
                  <Image
                    src={product.images[selectedImage].url}
                    alt={product.images[selectedImage].altText || product.name}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              )}
              
              {/* Thumbnail Gallery */}
              {product.images && product.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${
                        selectedImage === index 
                          ? 'border-purple-500' 
                          : 'border-transparent hover:border-gray-600'
                      }`}
                    >
                      <Image
                        src={image.url}
                        alt={image.altText || product.name}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Product Info Section */}
          <div className="md:w-1/2 p-8 overflow-y-auto">
            {/* Header */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">{product.name}</h2>
              
              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill="currentColor" />
                  ))}
                </div>
                <span className="text-gray-400 text-sm">(4.8 out of 5)</span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-3xl font-bold text-white">${(product.salePrice || product.price).toFixed(2)}</span>
                {product.salePrice && product.salePrice < product.price && (
                  <>
                    <span className="text-xl text-gray-500 line-through">
                      ${product.price.toFixed(2)}
                    </span>
                    <span className="text-green-400 font-medium">
                      Save {Math.round((1 - product.salePrice / product.price) * 100)}%
                    </span>
                  </>
                )}
              </div>

              {/* Tags */}
              {product.tags && product.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {product.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Description */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-2">Description</h3>
              <div 
                className="text-gray-300 prose prose-invert prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: product.description || '' }}
              />
            </div>

            {/* Quantity Selector */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Quantity
              </label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  -
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-20 px-3 py-1 bg-gray-800 border border-gray-700 rounded-lg text-center text-white focus:outline-none focus:border-purple-500"
                />
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <div className="flex gap-3">
                <Button
                  onClick={handleBuyNow}
                  size="lg"
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  <Zap size={20} className="mr-2" />
                  Buy Now
                </Button>
                <Button
                  onClick={handleAddToCart}
                  size="lg"
                  variant="outline"
                  className="flex-1 border-purple-600 text-purple-400 hover:bg-purple-900/20"
                >
                  <ShoppingCart size={20} className="mr-2" />
                  Add to Cart
                </Button>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={`flex-1 py-3 px-4 rounded-lg border transition-all ${
                    isInWishlist(product.id)
                      ? 'bg-red-900/20 border-red-600 text-red-400'
                      : 'border-gray-700 text-gray-400 hover:border-gray-600'
                  }`}
                >
                  <Heart 
                    size={20} 
                    className="inline mr-2"
                    fill={isInWishlist(product.id) ? 'currentColor' : 'none'}
                  />
                  {isInWishlist(product.id) ? 'In Wishlist' : 'Add to Wishlist'}
                </button>
                <button
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: product.name,
                        text: product.description?.substring(0, 100),
                        url: `/products/${product.id}`
                      });
                    } else {
                      navigator.clipboard.writeText(`${window.location.origin}/products/${product.id}`);
                      toast.success('Link copied!');
                    }
                  }}
                  className="px-4 py-3 border border-gray-700 rounded-lg text-gray-400 hover:border-gray-600 transition-colors"
                >
                  <Share2 size={20} />
                </button>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="mt-6 pt-6 border-t border-gray-700">
              <div className="flex items-center justify-around text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <span className="text-green-400">✓</span>
                  Instant Download
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-400">✓</span>
                  Secure Checkout
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-400">✓</span>
                  Money Back Guarantee
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 