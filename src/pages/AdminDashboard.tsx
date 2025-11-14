import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRestaurant } from '@/hooks/useRestaurant';
import { getOrders, getDishes, getCategories } from '@/lib/supabase/queries';
import { Order, Dish, Category } from '@/types';
import { 
  UtensilsCrossed, 
  ShoppingCart, 
  QrCode, 
  Building2, 
  FolderTree,
  TrendingUp,
  Clock,
  ChefHat,
  CheckCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { currentRestaurant } = useRestaurant();
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    preparingOrders: 0,
    readyOrders: 0,
    totalDishes: 0,
    totalCategories: 0,
    todayRevenue: 0,
  });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const isAuth = localStorage.getItem('admin_auth');
    if (!isAuth) {
      navigate('/');
    }
  }, [navigate]);

  useEffect(() => {
    if (currentRestaurant) {
      loadDashboardData();
    }
  }, [currentRestaurant]);

  const loadDashboardData = async () => {
    if (!currentRestaurant) return;

    try {
      setLoading(true);
      const [orders, dishes, categories] = await Promise.all([
        getOrders(currentRestaurant.id),
        getDishes(currentRestaurant.id),
        getCategories(currentRestaurant.id),
      ]);

      const pending = orders.filter(o => o.status === 'pending').length;
      const preparing = orders.filter(o => o.status === 'preparing').length;
      const ready = orders.filter(o => o.status === 'ready').length;

      // Calculate today's revenue
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayRevenue = orders
        .filter(o => new Date(o.created_at) >= today && o.status !== 'pending')
        .reduce((sum, o) => sum + Number(o.total_amount), 0);

      setStats({
        totalOrders: orders.length,
        pendingOrders: pending,
        preparingOrders: preparing,
        readyOrders: ready,
        totalDishes: dishes.length,
        totalCategories: categories.length,
        todayRevenue,
      });

      // Get recent orders (last 5)
      setRecentOrders(orders.slice(0, 5));
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const configs = {
      pending: { variant: 'default' as const, icon: Clock, label: 'Pending' },
      preparing: { variant: 'secondary' as const, icon: ChefHat, label: 'Preparing' },
      ready: { variant: 'outline' as const, icon: CheckCircle, label: 'Ready' },
    };
    const config = configs[status as keyof typeof configs];
    if (!config) return null;
    const Icon = config.icon;
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="w-3 h-3" />
        {config.label}
      </Badge>
    );
  };

  if (!currentRestaurant) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Please select a restaurant to view dashboard</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gradient">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's what's happening at {currentRestaurant.name}</p>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Loading dashboard...</p>
          </div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="glass border-white/20">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalOrders}</div>
                  <p className="text-xs text-muted-foreground">All time</p>
                </CardContent>
              </Card>

              <Card className="glass border-white/20">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-500">{stats.pendingOrders}</div>
                  <p className="text-xs text-muted-foreground">Needs attention</p>
                </CardContent>
              </Card>

              <Card className="glass border-white/20">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Today's Revenue</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-accent">₹{stats.todayRevenue.toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground">Completed orders</p>
                </CardContent>
              </Card>

              <Card className="glass border-white/20">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Menu Items</CardTitle>
                  <UtensilsCrossed className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalDishes}</div>
                  <p className="text-xs text-muted-foreground">{stats.totalCategories} categories</p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card className="glass border-white/20">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Manage your restaurant quickly</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Button
                    variant="outline"
                    className="h-auto flex-col items-start p-4"
                    onClick={() => navigate('/admin/restaurants')}
                  >
                    <Building2 className="w-6 h-6 mb-2" />
                    <span className="font-semibold">Restaurants</span>
                    <span className="text-xs text-muted-foreground">Manage locations</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-auto flex-col items-start p-4"
                    onClick={() => navigate('/admin/categories')}
                  >
                    <FolderTree className="w-6 h-6 mb-2" />
                    <span className="font-semibold">Categories</span>
                    <span className="text-xs text-muted-foreground">Organize menu</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-auto flex-col items-start p-4"
                    onClick={() => navigate('/admin/dishes')}
                  >
                    <UtensilsCrossed className="w-6 h-6 mb-2" />
                    <span className="font-semibold">Dishes</span>
                    <span className="text-xs text-muted-foreground">Add menu items</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-auto flex-col items-start p-4"
                    onClick={() => navigate('/admin/qr-code')}
                  >
                    <QrCode className="w-6 h-6 mb-2" />
                    <span className="font-semibold">QR Code</span>
                    <span className="text-xs text-muted-foreground">Generate QR</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Orders */}
            <Card className="glass border-white/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Recent Orders</CardTitle>
                    <CardDescription>Latest customer orders</CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/admin/orders')}
                  >
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {recentOrders.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No orders yet</p>
                ) : (
                  <div className="space-y-3">
                    {recentOrders.map((order) => (
                      <div
                        key={order.id}
                        className="flex items-center justify-between p-3 glass rounded-lg"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold">Order #{order.id.slice(0, 8)}</span>
                            {getStatusBadge(order.status)}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(order.created_at), 'PPP p')}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-accent">₹{Number(order.total_amount).toFixed(2)}</p>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate('/admin/orders')}
                            className="text-xs"
                          >
                            View
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;


