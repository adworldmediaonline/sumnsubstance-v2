import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Package } from 'lucide-react';
import Link from 'next/link';
import { staticProducts } from '@/constants/static-products-data';

export default async function DashboardPage() {

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">User Dashboard</h1>
        <p className="text-muted-foreground">
          View your orders and browse products
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{staticProducts.length}</div>
            <p className="text-xs text-muted-foreground">Available products</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">-</div>
            <p className="text-xs text-muted-foreground">View your orders</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹
              {staticProducts
                .reduce((sum: number, product) => sum + product.price, 0)
                .toLocaleString('en-IN')}
            </div>
            <p className="text-xs text-muted-foreground">
              Catalog value
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Browse Products</CardTitle>
            <CardDescription>Explore our product catalog</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {staticProducts.length} product{staticProducts.length !== 1 ? 's' : ''} available
                </span>
                <Button size="sm" asChild>
                  <Link href="/">View Store</Link>
                </Button>
              </div>
              <div className="space-y-1">
                {staticProducts.slice(0, 3).map(product => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between text-sm"
                  >
                    <span>{product.name}</span>
                    <span className="text-muted-foreground">
                      ₹{product.price.toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
                {staticProducts.length > 3 && (
                  <div className="text-xs text-muted-foreground">
                    +{staticProducts.length - 3} more
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>My Orders</CardTitle>
            <CardDescription>View your order history</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center py-4">
              <p className="text-muted-foreground mb-4">View your order history and track shipments</p>
              <Button asChild>
                <Link href="/dashboard/orders">
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  View My Orders
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
