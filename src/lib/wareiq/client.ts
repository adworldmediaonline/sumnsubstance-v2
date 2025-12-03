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

        // Extract token from response (could be 'token' or 'access_token')
        const token = data.token || data.access_token;
        if (!token) {
          throw new Error('Token not found in response');
        }

        // Cache token (assume it's valid for 1 hour, adjust based on actual expiry)
        this.cachedToken = token;
        this.tokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

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

      const response = await fetch(`${this.baseUrl}/orders`, {
        method: 'POST',
        headers: {
          'x-api-key': this.apiKey,
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderPayload),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || `API error: ${response.statusText}`,
          message: data.message || `Failed to create order: ${response.status}`,
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
      return {
        success: false,
        error: errorMessage,
        message: `Failed to create order: ${errorMessage}`,
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

