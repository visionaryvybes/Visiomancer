const PRINTIFY_API_URL = 'https://api.printify.com/v1';

class PrintifyAPI {
  private token: string;

  constructor() {
    const token = process.env.NEXT_PUBLIC_PRINTIFY_API_TOKEN;
    if (!token) {
      throw new Error('Printify API token is not configured');
    }
    this.token = token;
  }

  private async fetch(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(`${PRINTIFY_API_URL}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`Printify API error: ${response.statusText}`);
    }

    return response.json();
  }

  // Get shop information
  async getShops() {
    return this.fetch('/shops.json');
  }

  // Get products for a shop
  async getProducts(shopId: string) {
    return this.fetch(`/shops/${shopId}/products.json`);
  }

  // Get a specific product
  async getProduct(shopId: string, productId: string) {
    return this.fetch(`/shops/${shopId}/products/${productId}.json`);
  }

  // Create a new product
  async createProduct(shopId: string, productData: any) {
    return this.fetch(`/shops/${shopId}/products.json`, {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  }

  // Update a product
  async updateProduct(shopId: string, productId: string, productData: any) {
    return this.fetch(`/shops/${shopId}/products/${productId}.json`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  }

  // Delete a product
  async deleteProduct(shopId: string, productId: string) {
    return this.fetch(`/shops/${shopId}/products/${productId}.json`, {
      method: 'DELETE',
    });
  }

  // Get orders
  async getOrders(shopId: string) {
    return this.fetch(`/shops/${shopId}/orders.json`);
  }

  // Get a specific order
  async getOrder(shopId: string, orderId: string) {
    return this.fetch(`/shops/${shopId}/orders/${orderId}.json`);
  }
}

export const printifyAPI = new PrintifyAPI(); 