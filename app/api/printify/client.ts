export class PrintifyClient {
  private readonly apiUrl = 'https://api.printify.com/v1';
  private readonly token: string;

  constructor(token: string) {
    if (!token) {
      throw new Error('Printify API token is required');
    }
    this.token = token;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.apiUrl}${endpoint}`;
    const startTime = Date.now();
    console.log(`[Printify] Making request to: ${url}`);

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      const endTime = Date.now();
      console.log(`[Printify] Request completed in ${endTime - startTime}ms`);

      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorBody = await response.text();
          console.error('[Printify] API error response:', errorBody);
          errorMessage += ` - ${errorBody}`;
        } catch (e) {
          console.error('[Printify] Failed to read error response:', e);
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log(`[Printify] Successfully processed ${endpoint} request`);
      return data as T;
    } catch (error) {
      console.error('[Printify] Request failed:', {
        endpoint,
        error,
        duration: Date.now() - startTime
      });
      throw error;
    }
  }

  async getShops() {
    console.log('[Printify] Fetching shops');
    return this.request<Array<{
      id: number;
      title: string;
      sales_channel: string;
    }>>('/shops.json');
  }

  async getProducts(shopId: string, limit = 25) {
    console.log(`[Printify] Fetching products for shop ${shopId}`);
    return this.request<{
      data: Array<{
        id: string;
        title: string;
        description: string;
        images: Array<{ src: string }>;
        variants: Array<{
          id: string;
          title: string;
          price: number;
          is_enabled: boolean;
          options: Record<string, string>;
        }>;
      }>;
      total: number;
      current_page: number;
      last_page: number;
    }>(`/shops/${shopId}/products.json?limit=${limit}`);
  }

  async getProduct(shopId: string, productId: string) {
    console.log(`[Printify] Fetching product ${productId} from shop ${shopId}`);
    return this.request<{
      id: string;
      title: string;
      description: string;
      images: Array<{ src: string }>;
      variants: Array<{
        id: string;
        title: string;
        price: number;
        is_enabled: boolean;
        options: Record<string, string>;
        sku: string;
        grams: number;
        is_default: boolean;
      }>;
      options: Array<{
        name: string;
        type: string;
        values: string[];
      }>;
      tags: string[];
      created_at: string;
      updated_at: string;
      visible: boolean;
      is_locked: boolean;
      blueprint_id: number;
      user_id: number;
      shop_id: string;
      print_provider_id: number;
      print_areas: Record<string, any>;
      print_details: Record<string, any>;
    }>(`/shops/${shopId}/products/${productId}.json`);
  }

  async getShipping(shopId: string, address: {
    country: string;
    region?: string;
    address1?: string;
    address2?: string;
    city?: string;
    zip?: string;
  }) {
    console.log(`[Printify] Fetching shipping rates for shop ${shopId}`);
    return this.request<{
      shipping_methods: Array<{
        id: string;
        title: string;
        price: number;
        currency: string;
        delivery_time: {
          min: number;
          max: number;
          unit: string;
        };
      }>;
    }>(`/shops/${shopId}/shipping.json`, {
      method: 'POST',
      body: JSON.stringify({ address }),
    });
  }
} 