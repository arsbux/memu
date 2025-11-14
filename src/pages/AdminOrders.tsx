import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getOrders, getOrderWithItems, updateOrderStatus } from '@/lib/supabase/queries';
import { Order, OrderItem, OrderStatus } from '@/types';
import { useRestaurant } from '@/hooks/useRestaurant';
import { toast } from 'sonner';
import { Clock, ChefHat, CheckCircle, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';

const AdminOrders = () => {
  const navigate = useNavigate();
  const { currentRestaurant } = useRestaurant();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order & { items: OrderItem[] } | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [newOrderCount, setNewOrderCount] = useState(0);
  const channelRef = useRef<RealtimeChannel | null>(null);

  useEffect(() => {
    const isAuth = localStorage.getItem('admin_auth');
    if (!isAuth) {
      navigate('/');
    }
  }, [navigate]);

  useEffect(() => {
    if (currentRestaurant) {
      loadOrders();
      setupRealtimeSubscription();
    }

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [currentRestaurant, statusFilter]);

  const setupRealtimeSubscription = () => {
    if (!currentRestaurant) return;

    // Remove existing channel if any
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
    }

    // Subscribe to new orders for this restaurant
    const channel = supabase
      .channel(`orders:${currentRestaurant.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'orders',
          filter: `restaurant_id=eq.${currentRestaurant.id}`,
        },
        (payload) => {
          const newOrder = payload.new as Order;
          if (newOrder.status === 'pending') {
            setNewOrderCount((prev) => prev + 1);
            toast.success('New order received! 🎉', {
              description: `Order #${newOrder.id.slice(0, 8)} - ₹${newOrder.total_amount.toFixed(2)}`,
              duration: 5000,
            });
            // Refresh orders list if showing all or pending orders
            if (statusFilter === 'all' || statusFilter === 'pending') {
              loadOrders();
            }
          }
        }
      )
      .subscribe();

    channelRef.current = channel;
  };

  const loadOrders = async () => {
    if (!currentRestaurant) return;
    
    try {
      setLoading(true);
      const status = statusFilter === 'all' ? undefined : statusFilter;
      const data = await getOrders(currentRestaurant.id, status);
      setOrders(data);
      // Reset new order count when orders are loaded
      if (statusFilter === 'all' || statusFilter === 'pending') {
        setNewOrderCount(0);
      }
    } catch (error) {
      console.error('Error loading orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (orderId: string) => {
    try {
      const orderWithItems = await getOrderWithItems(orderId);
      setSelectedOrder(orderWithItems);
      setIsDetailsOpen(true);
    } catch (error) {
      console.error('Error loading order details:', error);
      toast.error('Failed to load order details');
    }
  };

  const handleStatusUpdate = async (orderId: string, newStatus: OrderStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      toast.success(`Order status updated to ${newStatus}`);
      await loadOrders();
      if (selectedOrder?.id === orderId) {
        const updated = await getOrderWithItems(orderId);
        setSelectedOrder(updated);
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status');
    }
  };

  const getStatusBadge = (status: OrderStatus) => {
    const variants = {
      pending: { variant: 'default' as const, icon: Clock, label: 'Pending' },
      preparing: { variant: 'secondary' as const, icon: ChefHat, label: 'Preparing' },
      ready: { variant: 'outline' as const, icon: CheckCircle, label: 'Ready' },
    };
    const config = variants[status];
    const Icon = config.icon;
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="w-3 h-3" />
        {config.label}
      </Badge>
    );
  };

  const getNextStatus = (currentStatus: OrderStatus): OrderStatus | null => {
    if (currentStatus === 'pending') return 'preparing';
    if (currentStatus === 'preparing') return 'ready';
    return null;
  };

  if (!currentRestaurant) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Please select a restaurant to view orders</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gradient">Orders</h1>
            <p className="text-muted-foreground">Manage customer orders</p>
          </div>
          <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as OrderStatus | 'all')}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Orders</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="preparing">Preparing</SelectItem>
              <SelectItem value="ready">Ready</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Loading orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <Card className="glass border-white/20">
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No orders found</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const nextStatus = getNextStatus(order.status);
              return (
                <Card key={order.id} className="glass border-white/20 animate-fade-in">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-3">
                          <span className="font-semibold text-lg">Order #{order.id.slice(0, 8)}</span>
                          {getStatusBadge(order.status)}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(order.created_at), 'PPP p')}
                        </p>
                        <p className="text-xl font-bold text-accent">
                          ₹{order.total_amount.toFixed(2)}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDetails(order.id)}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                        {nextStatus && (
                          <Button
                            size="sm"
                            onClick={() => handleStatusUpdate(order.id, nextStatus)}
                            className="bg-gradient-to-r from-primary to-primary-glow"
                          >
                            Mark as {nextStatus === 'preparing' ? 'Preparing' : 'Ready'}
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Order Details Dialog */}
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Order Details</DialogTitle>
            </DialogHeader>
            {selectedOrder && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Order ID</p>
                    <p className="font-mono">{selectedOrder.id}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Status</p>
                    {getStatusBadge(selectedOrder.status)}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Ordered at</p>
                  <p>{format(new Date(selectedOrder.created_at), 'PPP p')}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold mb-2">Items</p>
                  <div className="space-y-2">
                    {selectedOrder.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-3 glass rounded-lg"
                      >
                        <div className="flex-1">
                          <p className="font-semibold">{item.dish_name}</p>
                          <p className="text-sm text-muted-foreground">
                            ₹{item.price.toFixed(2)} × {item.quantity}
                          </p>
                        </div>
                        <p className="font-bold">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="border-t pt-4 flex items-center justify-between">
                  <span className="text-xl font-bold">Total</span>
                  <span className="text-xl font-bold text-accent">
                    ₹{selectedOrder.total_amount.toFixed(2)}
                  </span>
                </div>
                {getNextStatus(selectedOrder.status) && (
                  <Button
                    onClick={() => {
                      const nextStatus = getNextStatus(selectedOrder.status);
                      if (nextStatus) {
                        handleStatusUpdate(selectedOrder.id, nextStatus);
                      }
                    }}
                    className="w-full bg-gradient-to-r from-primary to-primary-glow"
                  >
                    Mark as {getNextStatus(selectedOrder.status) === 'preparing' ? 'Preparing' : 'Ready'}
                  </Button>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminOrders;

