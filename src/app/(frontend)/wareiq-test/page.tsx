'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function WareIQTestPage() {
  const [loading, setLoading] = useState(false);
  const [testType, setTestType] = useState<'auth' | 'order'>('auth');
  const [result, setResult] = useState<{
    success: boolean;
    message?: string;
    error?: string;
    data?: unknown;
    orderPayload?: unknown;
  } | null>(null);

  const testAuthentication = async () => {
    setLoading(true);
    setResult(null);
    setTestType('auth');

    try {
      const response = await fetch('/api/wareiq/test');
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    } finally {
      setLoading(false);
    }
  };

  const testOrderCreation = async () => {
    setLoading(true);
    setResult(null);
    setTestType('order');

    try {
      const response = await fetch('/api/wareiq/test-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          testType: 'sample',
        }),
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>WareIQ/EasyEcom Integration Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Test Authentication</h3>
            <p className="text-sm text-muted-foreground mb-4">
              This will test if your EasyEcom credentials are working correctly.
              Make sure you have set the following environment variables:
            </p>
            <ul className="list-disc list-inside text-sm text-muted-foreground mb-4 space-y-1">
              <li>EASYECOM_API_KEY</li>
              <li>EASYECOM_EMAIL</li>
              <li>EASYECOM_PASSWORD</li>
              <li>EASYECOM_LOCATION_KEY</li>
            </ul>
            <Button onClick={testAuthentication} disabled={loading}>
              {loading ? 'Testing...' : 'Test Authentication'}
            </Button>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-2">Sync Products to WareIQ</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Automatically create all products in WareIQ using the API. This will create products
              one by one. For faster bulk import, use the CSV download option below.
            </p>
            <div className="flex gap-2 flex-wrap">
              <Button
                onClick={async () => {
                  setLoading(true);
                  setResult(null);
                  setTestType('product-create');
                  try {
                    const response = await fetch('/api/wareiq/sync-products?test=true', {
                      method: 'POST',
                    });
                    const data = await response.json();
                    setResult(data);
                  } catch (error) {
                    setResult({
                      success: false,
                      error: error instanceof Error ? error.message : 'Unknown error',
                    });
                  } finally {
                    setLoading(false);
                  }
                }}
                disabled={loading}
                variant="outline"
                className="w-full sm:w-auto"
              >
                {loading && testType === 'product-create' ? 'Testing...' : 'Test Product Creation'}
              </Button>
              <Button
                onClick={async () => {
                  setLoading(true);
                  setResult(null);
                  setTestType('exact-payload');
                  try {
                    const response = await fetch('/api/wareiq/sync-products?test=true&exact=true', {
                      method: 'POST',
                    });
                    const data = await response.json();
                    setResult(data);
                  } catch (error) {
                    setResult({
                      success: false,
                      error: error instanceof Error ? error.message : 'Unknown error',
                    });
                  } finally {
                    setLoading(false);
                  }
                }}
                disabled={loading}
                variant="secondary"
                className="w-full sm:w-auto"
              >
                {loading && testType === 'exact-payload' ? 'Testing...' : 'Test with Exact Payload'}
              </Button>
              <Button
                onClick={async () => {
                  if (!confirm('This will create ALL products in WareIQ. Continue?')) return;
                  setLoading(true);
                  setResult(null);
                  setTestType('order');
                  try {
                    const response = await fetch('/api/wareiq/sync-products', {
                      method: 'POST',
                    });
                    const data = await response.json();
                    setResult(data);
                  } catch (error) {
                    setResult({
                      success: false,
                      error: error instanceof Error ? error.message : 'Unknown error',
                    });
                  } finally {
                    setLoading(false);
                  }
                }}
                disabled={loading}
                variant="default"
                className="w-full sm:w-auto"
              >
                {loading ? 'Syncing...' : 'Sync All Products'}
              </Button>
            </div>
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800 mb-2">
                <strong>Update Product:</strong> To update an existing product, use the API endpoint:
              </p>
              <code className="text-xs bg-white p-2 rounded block">
                POST /api/wareiq/sync-products?update=true
                <br />
                Body: {`{ "productId": 123456, "sku": "SNS-SPF-250", ... }`}
              </code>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-2">Generate CSV for WareIQ</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Download a CSV file with all your products formatted for WareIQ bulk import.
              Upload this CSV to WareIQ dashboard to create all products at once.
            </p>
            <a href="/api/wareiq/generate-csv" download>
              <Button variant="outline" className="w-full sm:w-auto">
                Download WareIQ CSV
              </Button>
            </a>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-2">Test Order Creation</h3>
            <p className="text-sm text-muted-foreground mb-4">
              This will test order creation in WareIQ with sample data. This creates a test order
              in EasyEcom/WareIQ without creating an order in your database.
            </p>
            <p className="text-xs text-yellow-600 mb-4">
              ⚠️ This will create an actual test order in WareIQ dashboard
            </p>
            <Button onClick={testOrderCreation} disabled={loading} variant="outline">
              {loading ? 'Testing...' : 'Test Order Creation'}
            </Button>
          </div>

          {result && (
            <div
              className={`p-4 rounded-lg ${result.success
                ? 'bg-green-50 border border-green-200'
                : 'bg-red-50 border border-red-200'
                }`}
            >
              <h4
                className={`font-semibold mb-2 ${result.success ? 'text-green-800' : 'text-red-800'
                  }`}
              >
                {result.success ? '✅ Success' : '❌ Failed'}
              </h4>
              {result.message && (
                <p className="text-sm mb-2">{result.message}</p>
              )}
              {result.error && (
                <p className="text-sm text-red-700 mb-2">
                  <strong>Error:</strong> {result.error}
                </p>
              )}
              {(result.data || result.error) && (
                <details className="mt-2">
                  <summary className="text-sm cursor-pointer text-muted-foreground">
                    View Full Response
                  </summary>
                  <pre className="mt-2 text-xs bg-white p-2 rounded overflow-auto max-h-96">
                    {JSON.stringify(result, null, 2)}
                  </pre>
                </details>
              )}
            </div>
          )}

          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-2">Next Steps</h3>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>
                If authentication succeeds, you can test order mapping
              </li>
              <li>
                Check the browser console or server logs for detailed error
                messages
              </li>
              <li>
                Verify your credentials in the EasyEcom dashboard
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

