/**
 * Builds a proper Gumroad checkout URL with quantity parameter
 * Ensures the URL goes directly to checkout (wanted=true) and includes quantity
 */
export function buildGumroadCheckoutUrl(gumroadUrl: string, quantity: number = 1): string {
  try {
    const url = new URL(gumroadUrl);
    
    // Ensure we have the wanted=true parameter for direct checkout
    url.searchParams.set('wanted', 'true');
    
    // Add quantity parameter
    url.searchParams.set('quantity', quantity.toString());
    
    // Add cache-busting timestamp to prevent caching issues
    url.searchParams.set('_t', Date.now().toString());
    
    return url.toString();
  } catch (error) {
    console.error('Error constructing Gumroad URL:', error);
    
    // Fallback to simple concatenation
    const hasParams = gumroadUrl.includes('?');
    const connector = hasParams ? '&' : '?';
    const timestamp = Date.now();
    return `${gumroadUrl}${connector}wanted=true&quantity=${quantity}&_t=${timestamp}`;
  }
}

/**
 * Validates if a URL is a valid Gumroad product URL
 */
export function isValidGumroadUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.includes('gumroad.com');
  } catch {
    return false;
  }
}

/**
 * Extracts the product ID from a Gumroad URL
 */
export function extractGumroadProductId(url: string): string | null {
  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/');
    return pathParts[pathParts.length - 1] || null;
  } catch {
    return null;
  }
} 