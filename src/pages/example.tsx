import React, { useState } from 'react';
import {
  ProductColorSelector,
  ColorOption,
  ProductSizeSelector,
  SizeOption,
  ProductQuantitySelector,
  ProductPricingDisplay,
  ProductAddToCartButton,
  ProductReviewStars
} from '../components/products';

export default function ProductExample() {
  // Sample product data
  const productName = "Premium Cotton T-Shirt";
  const productDescription = "Our classic t-shirt is made from 100% premium cotton for maximum comfort and durability. Features a relaxed fit and reinforced seams for everyday wear.";
  
  // Color options
  const colorOptions: ColorOption[] = [
    { id: 'black', name: 'Black', hexColor: '#000000', inStock: true },
    { id: 'white', name: 'White', hexColor: '#FFFFFF', inStock: true },
    { id: 'navy', name: 'Navy Blue', hexColor: '#000080', inStock: true },
    { id: 'red', name: 'Red', hexColor: '#FF0000', inStock: false },
    { id: 'green', name: 'Green', hexColor: '#008000', inStock: true },
    { id: 'gray', name: 'Gray', hexColor: '#808080', inStock: true },
  ];
  
  // Size options
  const sizeOptions: SizeOption[] = [
    { id: 'xs', name: 'XS', inStock: true },
    { id: 's', name: 'S', inStock: true },
    { id: 'm', name: 'M', inStock: true, isLowStock: true },
    { id: 'l', name: 'L', inStock: true },
    { id: 'xl', name: 'XL', inStock: true },
    { id: '2xl', name: '2XL', inStock: false },
    { id: '3xl', name: '3XL', inStock: false },
  ];
  
  // State
  const [selectedColor, setSelectedColor] = useState<string>(colorOptions[0].id);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [isAddingToCart, setIsAddingToCart] = useState<boolean>(false);
  const [isAddedToCart, setIsAddedToCart] = useState<boolean>(false);

  // Handle add to cart
  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('Please select a size');
      return;
    }

    setIsAddingToCart(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsAddingToCart(false);
      setIsAddedToCart(true);
      
      // Reset added state after a delay
      setTimeout(() => {
        setIsAddedToCart(false);
      }, 2000);
      
      console.log('Added to cart:', {
        productName,
        color: colorOptions.find(c => c.id === selectedColor)?.name,
        size: sizeOptions.find(s => s.id === selectedSize)?.name,
        quantity
      });
    }, 1000);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl lg:max-w-none">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Product Components Example</h1>
        
        <div className="mt-8 lg:grid lg:grid-cols-2 lg:gap-x-8">
          {/* Product image (placeholder) */}
          <div className="aspect-h-1 aspect-w-1 lg:aspect-none lg:h-auto">
            <div className="h-96 w-full rounded-lg bg-gray-200 dark:bg-gray-800">
              <div className="flex h-full items-center justify-center text-gray-500 dark:text-gray-400">
                Product Image
              </div>
            </div>
          </div>
          
          {/* Product information */}
          <div className="mt-10 lg:mt-0">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{productName}</h2>
            
            {/* Pricing */}
            <div className="mt-3">
              <ProductPricingDisplay
                price={29.99}
                compareAtPrice={39.99}
                size="large"
              />
            </div>
            
            {/* Reviews */}
            <div className="mt-3">
              <ProductReviewStars 
                rating={4.5} 
                reviewCount={127} 
                size="medium"
              />
            </div>
            
            {/* Description */}
            <div className="mt-6">
              <p className="text-base text-gray-700 dark:text-gray-300">{productDescription}</p>
            </div>
            
            {/* Color selector */}
            <div className="mt-8">
              <ProductColorSelector
                colors={colorOptions}
                selectedColor={selectedColor}
                onSelectColor={setSelectedColor}
              />
            </div>
            
            {/* Size selector */}
            <div className="mt-8">
              <ProductSizeSelector
                sizes={sizeOptions}
                selectedSize={selectedSize}
                onSelectSize={setSelectedSize}
                layout="grid"
              />
            </div>
            
            {/* Quantity selector */}
            <div className="mt-8">
              <ProductQuantitySelector
                quantity={quantity}
                onChange={setQuantity}
                minQuantity={1}
                maxQuantity={10}
              />
            </div>
            
            {/* Add to cart button */}
            <div className="mt-8">
              <ProductAddToCartButton
                onClick={handleAddToCart}
                isLoading={isAddingToCart}
                isAdded={isAddedToCart}
                isDisabled={!selectedSize}
                fullWidth
                size="large"
              />
            </div>
          </div>
        </div>
        
        {/* Component variations */}
        <div className="mt-16 border-t border-gray-200 pt-10 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Component Variations</h2>
          
          <div className="mt-8 grid grid-cols-1 gap-y-8 lg:grid-cols-3 lg:gap-x-8">
            {/* Pricing variations */}
            <div className="rounded-lg border border-gray-200 p-6 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Pricing Variations</h3>
              <div className="mt-4 space-y-4">
                <ProductPricingDisplay price={19.99} size="small" />
                <ProductPricingDisplay price={19.99} compareAtPrice={29.99} size="small" />
                <ProductPricingDisplay price={19.99} size="medium" />
                <ProductPricingDisplay price={19.99} compareAtPrice={29.99} size="medium" />
                <ProductPricingDisplay price={19.99} size="large" />
                <ProductPricingDisplay price={19.99} compareAtPrice={29.99} size="large" />
              </div>
            </div>
            
            {/* Button variations */}
            <div className="rounded-lg border border-gray-200 p-6 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Button Variations</h3>
              <div className="mt-4 space-y-4">
                <ProductAddToCartButton onClick={() => {}} size="small" variant="primary" />
                <ProductAddToCartButton onClick={() => {}} size="small" variant="secondary" />
                <ProductAddToCartButton onClick={() => {}} size="small" variant="outline" />
                <ProductAddToCartButton onClick={() => {}} size="medium" variant="primary" />
                <ProductAddToCartButton onClick={() => {}} size="medium" variant="secondary" />
                <ProductAddToCartButton onClick={() => {}} size="medium" variant="outline" />
              </div>
            </div>
            
            {/* Review variations */}
            <div className="rounded-lg border border-gray-200 p-6 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Rating Variations</h3>
              <div className="mt-4 space-y-4">
                <ProductReviewStars rating={5} size="small" />
                <ProductReviewStars rating={4.5} size="small" />
                <ProductReviewStars rating={3.7} size="medium" />
                <ProductReviewStars rating={3} size="medium" />
                <ProductReviewStars rating={2.3} size="large" />
                <ProductReviewStars rating={1} size="large" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 