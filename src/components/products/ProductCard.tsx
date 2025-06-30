import React, { useState } from "react";
import { Product } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { Heart, ShoppingCart, Eye, Star } from "lucide-react";
import { toast } from 'react-hot-toast';
import Button from '@/components/ui/Button';
import ProductVariantSelector from "./ProductVariantSelector";
import VariantSelector from "./VariantSelector";

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView }) => {
  // Safety check for undefined product
  if (!product || !product.id) {
    console.error('ProductCard received invalid product:', product);
    return null;
  }

  const [isHovered, setIsHovered] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showVariants, setShowVariants] = useState(false);
  const { addItem } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
    toast.success(`${product.name} added to cart!`);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onQuickView) {
      onQuickView(product);
    }
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  // Handle image navigation
  const handleImageHover = (direction: 'next' | 'prev') => {
    if (!product.images || product.images.length <= 1) return;
    
    if (direction === 'next') {
      setSelectedImage((prev) => (prev + 1) % product.images!.length);
    } else {
      setSelectedImage((prev) => (prev - 1 + product.images!.length) % product.images!.length);
    }
  };

  const imageUrl = product.images?.[selectedImage]?.url || "/placeholder-product.png";
  const hasMultipleImages = product.images && product.images.length > 1;

  return (
    <div 
      className="group relative bg-gray-900 rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setSelectedImage(0);
      }}
    >
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex gap-2">
        {product.isBestSeller && (
          <span className="px-3 py-1 bg-yellow-500 text-black text-xs font-bold rounded-full">
            BEST SELLER
          </span>
        )}
        {product.isNew && (
          <span className="px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full">
            NEW
          </span>
        )}
        {product.salePrice && product.salePrice < product.price && (
          <span className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
            {Math.round((1 - product.salePrice / product.price) * 100)}% OFF
          </span>
        )}
      </div>

      {/* Wishlist Button */}
      <button
        onClick={handleToggleWishlist}
        className={`absolute top-3 right-3 z-10 p-2 rounded-full transition-all ${
          inWishlist 
            ? 'bg-red-500 text-white' 
            : 'bg-black/50 text-white hover:bg-black/70'
        }`}
      >
        <Heart size={18} fill={inWishlist ? 'currentColor' : 'none'} />
      </button>

      <Link href={`/products/${encodeURIComponent(product.id)}`}>
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-gray-800">
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          
          {/* Image Navigation Zones */}
          {hasMultipleImages && isHovered && (
            <>
              <div 
                className="absolute left-0 top-0 w-1/2 h-full cursor-w-resize"
                onMouseEnter={() => handleImageHover('prev')}
              />
              <div 
                className="absolute right-0 top-0 w-1/2 h-full cursor-e-resize"
                onMouseEnter={() => handleImageHover('next')}
              />
              
              {/* Image Indicators */}
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
                {product.images.map((_, index) => (
                  <div
                    key={index}
                    className={`w-1.5 h-1.5 rounded-full transition-all ${
                      index === selectedImage 
                        ? 'bg-white w-3' 
                        : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </>
          )}

          {/* Quick Action Overlay */}
          <div className={`absolute inset-0 bg-black/60 flex items-center justify-center gap-3 transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}>
            <button
              onClick={handleAddToCart}
              className="p-3 bg-white text-black rounded-full hover:bg-purple-100 transition-colors"
              title="Add to Cart"
            >
              <ShoppingCart size={20} />
            </button>
            {onQuickView && (
              <button
                onClick={handleQuickView}
                className="p-3 bg-white text-black rounded-full hover:bg-purple-100 transition-colors"
                title="Quick View"
              >
                <Eye size={20} />
              </button>
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4">
          {/* Category */}
          {product.tags && product.tags[0] && (
            <p className="text-xs text-purple-400 font-medium uppercase tracking-wide mb-1">
              {product.tags[0]}
            </p>
          )}

          {/* Product Name */}
          <h3 className="font-semibold text-white mb-2 line-clamp-2 group-hover:text-purple-400 transition-colors">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-3">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} fill={i < 4 ? 'currentColor' : 'none'} />
              ))}
            </div>
            <span className="text-xs text-gray-400">(4.{Math.floor(Math.random() * 10)})</span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-white">
              ${(product.salePrice || product.price).toFixed(2)}
            </span>
            {product.salePrice && product.salePrice < product.price && (
              <span className="text-sm text-gray-500 line-through">
                ${product.price.toFixed(2)}
              </span>
            )}
          </div>

          {/* Variant Preview */}
          {product.variants && product.variants.length > 0 && (
            <div className="mt-3">
              <p className="text-xs text-gray-400">
                {product.variants.length} variant{product.variants.length > 1 ? 's' : ''} available
              </p>
            </div>
          )}

          {/* Add to Cart Button (Mobile) */}
          <button
            onClick={handleAddToCart}
            className="mt-3 w-full py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors md:hidden"
          >
            Add to Cart
          </button>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;