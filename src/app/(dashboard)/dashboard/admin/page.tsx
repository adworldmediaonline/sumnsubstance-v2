import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ShoppingCart, DollarSign, TrendingUp } from 'lucide-react';
import { calculateOrderAnalytics } from '@/server/queries/order';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default async function DashboardPage() {
  const analytics = await calculateOrderAnalytics();

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
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{analytics.totalRevenue.toLocaleString('en-IN')}
            </div>
            <p className="text-xs text-muted-foreground">
              Total revenue from completed orders
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalOrders}</div>
            <p className="text-xs text-muted-foreground">All customer orders</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Order Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{Math.round(analytics.averageOrderValue).toLocaleString('en-IN')}
            </div>
            <p className="text-xs text-muted-foreground">
              Average value per order
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Action */}
      <Card>
        <CardHeader>
          <CardTitle>Orders Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground">
              View and manage all customer orders ({analytics.totalOrders} total)
            </p>
            <Button asChild>
              <Link href="/dashboard/admin/orders">
                <ShoppingCart className="mr-2 h-4 w-4" />
                View Orders
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
