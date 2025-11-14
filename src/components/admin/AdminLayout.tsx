import { ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  UtensilsCrossed, 
  FolderTree, 
  Settings, 
  LogOut,
  Menu as MenuIcon,
  ShoppingCart,
  QrCode,
  Building2
} from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';
import { useRestaurant } from '@/hooks/useRestaurant';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { restaurants, currentRestaurant, setCurrentRestaurant, loading } = useRestaurant();

  const handleLogout = () => {
    localStorage.removeItem('admin_auth');
    toast.success('Logged out successfully');
    navigate('/');
  };

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: Building2, label: 'Restaurants', path: '/admin/restaurants' },
    { icon: UtensilsCrossed, label: 'Dishes', path: '/admin/dishes' },
    { icon: FolderTree, label: 'Categories', path: '/admin/categories' },
    { icon: ShoppingCart, label: 'Orders', path: '/admin/orders' },
    { icon: QrCode, label: 'QR Code', path: '/admin/qr-code' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 h-16 glass border-b border-white/10 flex items-center justify-between px-4">
        <h1 className="text-xl font-bold text-gradient">ReelMenu Admin</h1>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <MenuIcon className="w-5 h-5" />
        </Button>
      </div>

      <div className="flex pt-16 lg:pt-0">
        {/* Sidebar */}
        <aside
          className={`fixed lg:sticky top-16 lg:top-0 left-0 h-[calc(100vh-4rem)] lg:h-screen w-64 glass border-r border-white/10 p-6 space-y-6 transition-transform duration-300 z-40 ${
            isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          <div className="hidden lg:flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center">
              <span className="text-xl font-bold">R</span>
            </div>
            <h1 className="text-xl font-bold text-gradient">ReelMenu</h1>
          </div>

          {/* Restaurant Selector */}
          {!loading && (
            <div className="mb-6 space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Restaurant</label>
              <Select
                value={currentRestaurant?.id || ''}
                onValueChange={(value) => {
                  const restaurant = restaurants.find(r => r.id === value);
                  if (restaurant) {
                    setCurrentRestaurant(restaurant);
                    toast.success(`Switched to ${restaurant.name}`);
                  }
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select restaurant" />
                </SelectTrigger>
                <SelectContent>
                  {restaurants.map((restaurant) => (
                    <SelectItem key={restaurant.id} value={restaurant.id}>
                      {restaurant.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {currentRestaurant && (
                <p className="text-xs text-muted-foreground">
                  Managing: <span className="font-medium">{currentRestaurant.name}</span>
                </p>
              )}
            </div>
          )}

          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Button
                  key={item.path}
                  variant={isActive ? 'secondary' : 'ghost'}
                  className={`w-full justify-start ${
                    isActive ? 'bg-primary/20 text-primary' : ''
                  }`}
                  onClick={() => {
                    navigate(item.path);
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <Icon className="w-4 h-4 mr-3" />
                  {item.label}
                </Button>
              );
            })}
          </nav>

          <div className="absolute bottom-6 left-6 right-6 space-y-2">
            <Button
              variant="ghost"
              className="w-full justify-start text-destructive hover:text-destructive"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-3" />
              Logout
            </Button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminLayout;
