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
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Manage your orders and view product catalog
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
            <p className="text-xs text-muted-foreground">Static products in catalog</p>
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
              Combined product value
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">-</div>
            <p className="text-xs text-muted-foreground">Manage customer orders</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Products</CardTitle>
            <CardDescription>View static product catalog</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {staticProducts.length} product{staticProducts.length !== 1 ? 's' : ''}
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
            <CardTitle>Orders</CardTitle>
            <CardDescription>Manage customer orders</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center py-4">
              <p className="text-muted-foreground mb-4">View and manage all customer orders</p>
              <Button asChild>
                <Link href="/dashboard/orders">
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  View Orders
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
