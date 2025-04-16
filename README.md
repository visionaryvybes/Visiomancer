# Product Components for E-commerce

A collection of reusable React components designed for e-commerce product pages, built with TypeScript, React, and TailwindCSS.

## Features

- **ProductColorSelector**: Select product colors with visual swatches
- **ProductSizeSelector**: Choose product sizes with availability indicators
- **ProductQuantitySelector**: Increment/decrement quantity with validation
- **ProductPricingDisplay**: Show product pricing with support for sales/discounts
- **ProductAddToCartButton**: Add to cart button with loading and success states
- **ProductReviewStars**: Display product ratings with partial star support

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/store-app.git
cd store-app
```

2. Install dependencies:
```bash
npm install
# or
yarn
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
```

4. Visit http://localhost:3000/example to see the components in action

## Usage

Import the components from the components directory:

```tsx
import {
  ProductColorSelector,
  ProductSizeSelector,
  ProductQuantitySelector,
  ProductPricingDisplay,
  ProductAddToCartButton,
  ProductReviewStars
} from '../components/products';
```

### ProductColorSelector

```tsx
import { ProductColorSelector, ColorOption } from '../components/products';

const colors: ColorOption[] = [
  { id: 'black', name: 'Black', hexColor: '#000000', inStock: true },
  { id: 'white', name: 'White', hexColor: '#FFFFFF', inStock: true },
  { id: 'red', name: 'Red', hexColor: '#FF0000', inStock: false },
];

function MyComponent() {
  const [selectedColor, setSelectedColor] = useState('black');
  
  return (
    <ProductColorSelector
      colors={colors}
      selectedColor={selectedColor}
      onSelectColor={setSelectedColor}
    />
  );
}
```

### ProductSizeSelector

```tsx
import { ProductSizeSelector, SizeOption } from '../components/products';

const sizes: SizeOption[] = [
  { id: 's', name: 'S', inStock: true },
  { id: 'm', name: 'M', inStock: true, isLowStock: true },
  { id: 'l', name: 'L', inStock: false },
];

function MyComponent() {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  
  return (
    <ProductSizeSelector
      sizes={sizes}
      selectedSize={selectedSize}
      onSelectSize={setSelectedSize}
      layout="grid" // or "inline"
    />
  );
}
```

### ProductQuantitySelector

```tsx
import { ProductQuantitySelector } from '../components/products';

function MyComponent() {
  const [quantity, setQuantity] = useState(1);
  
  return (
    <ProductQuantitySelector
      quantity={quantity}
      onChange={setQuantity}
      minQuantity={1}
      maxQuantity={10}
    />
  );
}
```

### ProductPricingDisplay

```tsx
import { ProductPricingDisplay } from '../components/products';

function MyComponent() {
  return (
    <ProductPricingDisplay
      price={29.99}
      compareAtPrice={39.99} // optional, for sale items
      size="large" // "small", "medium", or "large"
      currency="USD" // optional, defaults to USD
      showPercentOff={true} // optional
    />
  );
}
```

### ProductAddToCartButton

```tsx
import { ProductAddToCartButton } from '../components/products';

function MyComponent() {
  const [isLoading, setIsLoading] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  
  const handleAddToCart = () => {
    setIsLoading(true);
    // Add to cart logic
    setTimeout(() => {
      setIsLoading(false);
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 2000);
    }, 1000);
  };
  
  return (
    <ProductAddToCartButton
      onClick={handleAddToCart}
      isLoading={isLoading}
      isAdded={isAdded}
      variant="primary" // "primary", "secondary", or "outline"
      size="medium" // "small", "medium", or "large"
      fullWidth={false} // optional
    />
  );
}
```

### ProductReviewStars

```tsx
import { ProductReviewStars } from '../components/products';

function MyComponent() {
  return (
    <ProductReviewStars
      rating={4.5}
      reviewCount={127} // optional
      showCount={true} // optional
      size="medium" // "small", "medium", or "large"
    />
  );
}
```

## Dependencies

- React
- TypeScript
- TailwindCSS
- Framer Motion
- Heroicons

## License

MIT
