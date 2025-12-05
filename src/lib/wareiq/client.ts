/**
 * EasyEcom/WareIQ API Client
 * Handles API communication with EasyEcom for order fulfillment
 */

import type {
  EasyEcomOrderPayload,
  EasyEcomApiResponse,
  EasyEcomConfig,
  EasyEcomAuthCredentials,
  EasyEcomTokenResponse,
  EasyEcomCreateProductPayload,
  EasyEcomUpdateProductPayload,
} from './types';

export class EasyEcomClient {
  private apiKey: string;
  private baseUrl: string;
  private marketplaceId: number;
  private authCredentials?: EasyEcomAuthCredentials;
  private cachedToken: string | null = null;
  private tokenExpiry: Date | null = null;

  constructor(config: EasyEcomConfig) {
    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl || 'https://api.easyecom.io';
    this.marketplaceId = config.marketplaceId;

    if (!this.apiKey) {
      throw new Error('EasyEcom API key is required');
    }

    // Set auth credentials if provided
    if (config.email && config.password && config.location_key) {
      this.authCredentials = {
        email: config.email,
        password: config.password,
        location_key: config.location_key,
      };
    }
  }

  /**
   * Get JWT token for authentication
   * Fetches token from EasyEcom API if credentials are provided
   * Otherwise falls back to environment variable
   */
  private async getAuthToken(): Promise<string> {
    // Check if we have a valid cached token
    if (this.cachedToken && this.tokenExpiry && this.tokenExpiry > new Date()) {
      return this.cachedToken;
    }

    // If credentials are provided, fetch token from API
    if (this.authCredentials) {
      try {
        const response = await fetch(`${this.baseUrl}/access/token`, {
          method: 'POST',
          headers: {
            'x-api-key': this.apiKey,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: this.authCredentials.email,
            password: this.authCredentials.password,
            location_key: this.authCredentials.location_key,
          }),
        });

        const data: EasyEcomTokenResponse = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || data.error || `Failed to get token: ${response.statusText}`
          );
        }

        // Extract token from response - handle nested structure
        // Response can be: { token: "..." } or { data: { token: { jwt_token: "..." } } }
        let token: string | undefined;

        if (typeof data.token === 'string') {
          token = data.token;
        } else if (data.token && typeof data.token === 'object' && 'jwt_token' in data.token) {
          token = data.token.jwt_token;
        } else if (data.data?.token) {
          if (typeof data.data.token === 'string') {
            token = data.data.token;
          } else if (typeof data.data.token === 'object' && 'jwt_token' in data.data.token) {
            token = data.data.token.jwt_token;
          }
        } else if (data.access_token) {
          token = data.access_token;
        }

        if (!token) {
          console.error('Token response structure:', JSON.stringify(data, null, 2));
          throw new Error('Token not found in response');
        }

        // Cache token - use expires_in if available, otherwise default to 1 hour
        this.cachedToken = token;
        const expiresIn =
          (typeof data.token === 'object' && data.token?.expires_in) ||
          data.data?.token && typeof data.data.token === 'object' && data.data.token?.expires_in ||
          3600; // Default 1 hour
        this.tokenExpiry = new Date(Date.now() + expiresIn * 1000);

        return token;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error';
        throw new Error(`Failed to authenticate with EasyEcom: ${errorMessage}`);
      }
    }

    // Fallback to environment variable
    const token = process.env.EASYECOM_JWT_TOKEN;
    if (!token) {
      throw new Error(
        'EasyEcom authentication required. Provide email/password/location_key in config or set EASYECOM_JWT_TOKEN environment variable.'
      );
    }
    return token;
  }

  /**
   * Create a retail order in EasyEcom
   */
  async createRetailOrder(
    orderPayload: EasyEcomOrderPayload
  ): Promise<EasyEcomApiResponse> {
    try {
      const token = await this.getAuthToken();

      // EasyEcom order creation endpoint
      const orderEndpoint = `${this.baseUrl}/webhook/v2/createOrder`;

      console.log('Creating order in EasyEcom:', {
        endpoint: orderEndpoint,
        orderNumber: orderPayload.orderNumber,
        hasToken: !!token,
        tokenPreview: token ? token.substring(0, 20) + '...' : 'none',
      });

      const response = await fetch(orderEndpoint, {
        method: 'POST',
        headers: {
          'x-api-key': this.apiKey,
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderPayload),
      });

      // Check content type before parsing
      const contentType = response.headers.get('content-type');
      const responseText = await response.text();

      // If response is HTML, it's likely an error page
      if (!contentType?.includes('application/json')) {
        console.error('EasyEcom API returned non-JSON response:');
        console.error('Status:', response.status, response.statusText);
        console.error('Content-Type:', contentType);
        console.error('Response preview:', responseText.substring(0, 500));

        return {
          success: false,
          error: `API returned ${contentType || 'non-JSON'} response`,
          message: `Failed to create order: Server returned HTML instead of JSON (status ${response.status})`,
        };
      }

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Failed to parse JSON response:', responseText.substring(0, 500));
        return {
          success: false,
          error: 'Invalid JSON response from API',
          message: 'Failed to parse API response',
        };
      }

      // Log the full response for debugging
      console.log('EasyEcom API response:', {
        status: response.status,
        statusText: response.statusText,
        data: JSON.stringify(data, null, 2),
      });

      if (!response.ok) {
        return {
          success: false,
          error: data.message || data.error || `API error: ${response.statusText}`,
          message: data.message || `Failed to create order: ${response.status}`,
          data: data, // Include full response for debugging
        };
      }

      // Check if the response indicates an error (EasyEcom returns errors with code field even on HTTP 200)
      if (data.code && data.code !== 200 && data.code >= 400) {
        return {
          success: false,
          error: data.message || data.error || `API error: code ${data.code}`,
          message: data.message || `Order creation failed: ${data.code}`,
          data: data,
        };
      }

      // Check if the response indicates success (some APIs return success: false even with 200)
      if (data.success === false || data.error) {
        return {
          success: false,
          error: data.error || data.message || 'Order creation failed',
          message: data.message || 'Order creation was not successful',
          data: data,
        };
      }

      return {
        success: true,
        data,
        message: 'Order created successfully',
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred';
      console.error('EasyEcom order creation error:', errorMessage);
      return {
        success: false,
        error: errorMessage,
        message: `Failed to create order: ${errorMessage}`,
      };
    }
  }

  /**
   * Create a product in WareIQ/EasyEcom
   * POST /Products/CreateMasterProduct
   */
  async createProduct(
    productPayload: EasyEcomCreateProductPayload
  ): Promise<EasyEcomApiResponse> {
    try {
      const token = await this.getAuthToken();
      const productEndpoint = `${this.baseUrl}/Products/CreateMasterProduct`;

      console.log('Creating product in EasyEcom:', {
        endpoint: productEndpoint,
        sku: productPayload.Sku,
        hasToken: !!token,
        itemType: productPayload.itemType,
        hasSubProducts: !!productPayload.subProducts,
        subProductsLength: productPayload.subProducts?.length || 0,
      });

      // Log the full payload for debugging
      console.log('Product payload being sent:', JSON.stringify(productPayload, null, 2));

      const response = await fetch(productEndpoint, {
        method: 'POST',
        headers: {
          'x-api-key': this.apiKey,
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productPayload),
      });

      const contentType = response.headers.get('content-type');
      const responseText = await response.text();

      if (!contentType?.includes('application/json')) {
        console.error('EasyEcom API returned non-JSON response:');
        console.error('Status:', response.status, response.statusText);
        console.error('Content-Type:', contentType);
        console.error('Response preview:', responseText.substring(0, 500));

        return {
          success: false,
          error: `API returned ${contentType || 'non-JSON'} response`,
          message: `Failed to create product: Server returned HTML instead of JSON (status ${response.status})`,
        };
      }

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Failed to parse JSON response:', responseText.substring(0, 500));
        return {
          success: false,
          error: `Failed to parse JSON response: ${parseError instanceof Error ? parseError.message : 'Unknown parse error'}`,
          message: `Failed to create product: Invalid JSON response from API (status ${response.status})`,
        };
      }

      // Log the full response for debugging
      console.log('EasyEcom product creation response:', {
        status: response.status,
        statusText: response.statusText,
        data: JSON.stringify(data, null, 2),
      });

      if (!response.ok) {
        return {
          success: false,
          error: data.message || data.error || `API error: ${response.statusText}`,
          message: data.message || `Failed to create product: ${response.status}`,
          data: data,
        };
      }

      // Check if the response indicates an error (EasyEcom returns errors with code field even on HTTP 200)
      if (data.code && data.code !== 200 && data.code >= 400) {
        const errorMessage = data.message || data.error || `API error: code ${data.code}`;
        // Check if this is a duplicate SKU error
        // Generic "Error while creating product" is often a duplicate SKU when other products succeed
        const isGenericError = errorMessage === 'Error while creating product.' ||
          errorMessage.toLowerCase().includes('error while creating');
        const isDuplicateSku =
          errorMessage.toLowerCase().includes('duplicate') ||
          errorMessage.toLowerCase().includes('already exists') ||
          (errorMessage.toLowerCase().includes('sku') && (
            errorMessage.toLowerCase().includes('exist') ||
            errorMessage.toLowerCase().includes('found')
          )) ||
          isGenericError; // Treat generic errors as potential duplicates

        return {
          success: false,
          error: errorMessage,
          message: isDuplicateSku
            ? `Product likely already exists in WareIQ (generic error). Check WareIQ dashboard for SKU and delete it if you want to recreate.`
            : `Product creation failed: ${data.code}`,
          data: data,
          isDuplicateSku, // Add flag to identify duplicate SKU errors
        };
      }

      // Check if the response indicates success (some APIs return success: false even with 200)
      if (data.success === false || data.error) {
        const errorMessage = data.error || data.message || 'Product creation failed';
        // Check if this is a duplicate SKU error
        // Generic "Error while creating product" is often a duplicate SKU when other products succeed
        const isGenericError = errorMessage === 'Error while creating product.' ||
          errorMessage.toLowerCase().includes('error while creating');
        const isDuplicateSku =
          errorMessage.toLowerCase().includes('duplicate') ||
          errorMessage.toLowerCase().includes('already exists') ||
          (errorMessage.toLowerCase().includes('sku') && (
            errorMessage.toLowerCase().includes('exist') ||
            errorMessage.toLowerCase().includes('found')
          )) ||
          isGenericError; // Treat generic errors as potential duplicates

        return {
          success: false,
          error: errorMessage,
          message: isDuplicateSku
            ? `Product likely already exists in WareIQ (generic error). Check WareIQ dashboard for SKU and delete it if you want to recreate.`
            : (data.message || 'Product creation was not successful'),
          data: data,
          isDuplicateSku,
        };
      }

      return {
        success: true,
        data,
        message: 'Product created successfully',
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred';
      console.error('EasyEcom product creation error:', errorMessage);
      return {
        success: false,
        error: errorMessage,
        message: `Failed to create product: ${errorMessage}`,
      };
    }
  }

  /**
   * Update a product in WareIQ/EasyEcom
   * POST /Products/UpdateMasterProduct
   */
  async updateProduct(
    productPayload: EasyEcomUpdateProductPayload
  ): Promise<EasyEcomApiResponse> {
    try {
      const token = await this.getAuthToken();
      const productEndpoint = `${this.baseUrl}/Products/UpdateMasterProduct`;

      console.log('Updating product in EasyEcom:', {
        endpoint: productEndpoint,
        productId: productPayload.productId,
        hasToken: !!token,
      });

      const response = await fetch(productEndpoint, {
        method: 'POST',
        headers: {
          'x-api-key': this.apiKey,
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productPayload),
      });

      const contentType = response.headers.get('content-type');
      const responseText = await response.text();

      if (!contentType?.includes('application/json')) {
        console.error('EasyEcom API returned non-JSON response:');
        console.error('Status:', response.status, response.statusText);
        console.error('Content-Type:', contentType);
        console.error('Response preview:', responseText.substring(0, 500));

        return {
          success: false,
          error: `API returned ${contentType || 'non-JSON'} response`,
          message: `Failed to update product: Server returned HTML instead of JSON (status ${response.status})`,
        };
      }

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Failed to parse JSON response:', responseText.substring(0, 500));
        return {
          success: false,
          error: `Failed to parse JSON response: ${parseError instanceof Error ? parseError.message : 'Unknown parse error'}`,
          message: `Failed to update product: Invalid JSON response from API (status ${response.status})`,
        };
      }

      // Log the full response for debugging
      console.log('EasyEcom product update response:', {
        status: response.status,
        statusText: response.statusText,
        data: JSON.stringify(data, null, 2),
      });

      if (!response.ok) {
        return {
          success: false,
          error: data.message || data.error || `API error: ${response.statusText}`,
          message: data.message || `Failed to update product: ${response.status}`,
          data: data,
        };
      }

      // Check if the response indicates an error (EasyEcom returns errors with code field even on HTTP 200)
      if (data.code && data.code !== 200 && data.code >= 400) {
        return {
          success: false,
          error: data.message || data.error || `API error: code ${data.code}`,
          message: data.message || `Product update failed: ${data.code}`,
          data: data,
        };
      }

      // Check if the response indicates success (some APIs return success: false even with 200)
      if (data.success === false || data.error) {
        return {
          success: false,
          error: data.error || data.message || 'Product update failed',
          message: data.message || 'Product update was not successful',
          data: data,
        };
      }

      // Success response from WareIQ: { code: 200, message: "Product Updated Successfully", data: { productId: ... } }
      return {
        success: true,
        data,
        message: data.message || 'Product updated successfully',
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred';
      console.error('EasyEcom product update error:', errorMessage);
      return {
        success: false,
        error: errorMessage,
        message: `Failed to update product: ${errorMessage}`,
      };
    }
  }

  /**
   * Get order status from EasyEcom
   */
  async getOrderStatus(orderNumber: string): Promise<EasyEcomApiResponse> {
    try {
      const token = await this.getAuthToken();

      const response = await fetch(
        `${this.baseUrl}/orders/${orderNumber}`,
        {
          method: 'GET',
          headers: {
            'x-api-key': this.apiKey,
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || `API error: ${response.statusText}`,
          message: data.message || `Failed to fetch order: ${response.status}`,
        };
      }

      return {
        success: true,
        data,
        message: 'Order fetched successfully',
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred';
      return {
        success: false,
        error: errorMessage,
        message: `Failed to fetch order: ${errorMessage}`,
      };
    }
  }

  /**
   * Update order in EasyEcom
   */
  async updateOrder(
    orderNumber: string,
    updates: Partial<EasyEcomOrderPayload>
  ): Promise<EasyEcomApiResponse> {
    try {
      const token = await this.getAuthToken();

      const response = await fetch(
        `${this.baseUrl}/orders/${orderNumber}`,
        {
          method: 'PATCH',
          headers: {
            'x-api-key': this.apiKey,
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updates),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || `API error: ${response.statusText}`,
          message: data.message || `Failed to update order: ${response.status}`,
        };
      }

      return {
        success: true,
        data,
        message: 'Order updated successfully',
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred';
      return {
        success: false,
        error: errorMessage,
        message: `Failed to update order: ${errorMessage}`,
      };
    }
  }
}

/**
 * Create EasyEcom client instance
 */
export function createEasyEcomClient(config: EasyEcomConfig): EasyEcomClient {
  return new EasyEcomClient(config);
}

