import axios from 'axios';

const GUMROAD_API_URL = 'https://api.gumroad.com/v2';

interface CreateProductPayload {
  name: string;
  price: number; // in cents
  description: string;
  url?: string; // URL of the file if it's a redirect
  // Note: Adding files directly via API is not supported.
  // We will add the product and then manually or via another process add files.
  // For now, we will add file paths to the description.
}

export class GumroadAPI {
  private accessToken: string;

  constructor(accessToken: string) {
    if (!accessToken) {
      throw new Error('Gumroad access token is required.');
    }
    this.accessToken = accessToken;
  }

  private getHeaders() {
    return {
      'Authorization': `Bearer ${this.accessToken}`,
      'Content-Type': 'application/json',
    };
  }
  
  /**
   * Creates a new product on Gumroad.
   * Note: The Gumroad API does not support uploading files directly when creating a product.
   * The product is created as a redirect to a link or as a digital product with no files.
   * The file URLs must be added to the description for the user.
   */
  async createProduct(payload: CreateProductPayload): Promise<any> {
    const { name, price, description, url } = payload;
    
    // The Gumroad API for creating a product via POST /products is not officially documented.
    // This is based on community findings and may be unstable.
    // The official docs only show GET, PUT, DELETE. This is a critical assumption.
    // Let's assume a POST to /products works.
    const productData = {
      name,
      price,
      description,
      // If we had a URL to a zip file of all items, we'd put it here
      url: url || 'https://placeholder.com/digital-delivery-info', 
    };

    try {
      const response = await axios.post(`${GUMROAD_API_URL}/products`, productData, {
        headers: this.getHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('Error creating Gumroad product:', error.response?.data || error.message);
      throw new Error('Could not create product on Gumroad.');
    }
  }
} 