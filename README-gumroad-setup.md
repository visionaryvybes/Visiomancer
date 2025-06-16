# Gumroad Integration Setup

This guide will help you set up your Gumroad store integration with your website.

## Prerequisites

1. A Gumroad account with products
2. Access to your Gumroad account settings

## Step 1: Get Your Gumroad Access Token

1. Sign in to your Gumroad account
2. Go to **Advanced Settings** (https://app.gumroad.com/settings/advanced)
3. Scroll down to the **Applications** section
4. Click **Create application**
5. Fill in the required information:
   - **Application name**: Your website name (e.g., "My Store Website")
   - **Application icon**: Upload a small thumbnail image
   - **Redirect URI**: Enter `http://127.0.0.1` (this is not used for personal access)
6. Click **Create application**
7. Once created, click **Generate access token**
8. Copy the generated access token

## Step 2: Configure Environment Variables

1. Create a `.env.local` file in your project root
2. Add your Gumroad access token:

```bash
# Gumroad API Configuration
GUMROAD_ACCESS_TOKEN=your_access_token_here

# Next.js Configuration (optional)
NEXT_PUBLIC_SITE_URL=http://localhost:3001
```

⚠️ **Important**: Never commit your `.env.local` file to version control. It should already be in your `.gitignore`.

## Step 3: Test the Integration

1. Make sure your products are **published** in Gumroad
2. Start your development server: `npm run dev`
3. Visit the products page to see your Gumroad products
4. Add products to cart and test the checkout flow

## How It Works

### Product Display
- Products are fetched from Gumroad's API
- Images, descriptions, and pricing are automatically imported
- Products can be added to cart and wishlist

### Cart & Checkout
- Users can add multiple products to their cart
- When checking out, users are redirected to Gumroad to complete the purchase
- For single items, opens the direct product page
- For multiple items, opens each product page sequentially

### API Caching
- Product data is cached for 5 minutes to improve performance
- If API calls fail, appropriate error messages are shown

## Troubleshooting

### Products not showing
1. Check that your access token is correct in `.env.local`
2. Ensure your products are published in Gumroad
3. Check the browser console for API errors

### Access token issues
- Make sure there are no extra spaces in your `.env.local` file
- Regenerate the access token if needed
- Ensure you're using the Bearer token, not the Application ID/Secret

### API rate limiting
- The integration uses caching to minimize API calls
- If you hit rate limits, the app will show appropriate error messages

## API Scopes

The integration uses these Gumroad API endpoints:
- `GET /v2/products` - To fetch all your products
- `GET /v2/products/:id` - To fetch individual product details

No special scopes are required for basic product listing.

## Support

If you encounter issues:
1. Check the browser console for error messages
2. Verify your Gumroad products are published
3. Test your access token using Gumroad's API documentation
4. Make sure your environment variables are properly set 