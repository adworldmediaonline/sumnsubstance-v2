'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function WareIQTestPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message?: string;
    error?: string;
    data?: unknown;
  } | null>(null);

  const testAuthentication = async () => {
    setLoading(true);
    setResult(null);

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

