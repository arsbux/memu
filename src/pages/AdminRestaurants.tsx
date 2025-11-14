import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Check } from 'lucide-react';
import { toast } from 'sonner';
import { Restaurant } from '@/types';
import { getRestaurants, createRestaurant, updateRestaurant, deleteRestaurant } from '@/lib/supabase/queries';
import { useRestaurant } from '@/hooks/useRestaurant';

const AdminRestaurants = () => {
  const navigate = useNavigate();
  const { restaurants, refreshRestaurants, currentRestaurant, setCurrentRestaurant } = useRestaurant();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRestaurant, setEditingRestaurant] = useState<Restaurant | null>(null);
  const [formData, setFormData] = useState({ name: '', slug: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const isAuth = localStorage.getItem('admin_auth');
    if (!isAuth) {
      navigate('/');
    }
  }, [navigate]);

  const handleSave = async () => {
    if (!formData.name || !formData.slug) {
      toast.error('Please fill in all fields');
      return;
    }

    // Validate slug format
    const slugRegex = /^[a-z0-9-]+$/;
    if (!slugRegex.test(formData.slug)) {
      toast.error('Slug must contain only lowercase letters, numbers, and hyphens');
      return;
    }

    try {
      setLoading(true);
      if (editingRestaurant) {
        await updateRestaurant(editingRestaurant.id, {
          ...editingRestaurant,
          name: formData.name,
          slug: formData.slug,
        });
        toast.success('Restaurant updated');
      } else {
        await createRestaurant({
          name: formData.name,
          slug: formData.slug,
          is_active: true,
        });
        toast.success('Restaurant created');
      }

      await refreshRestaurants();
      setIsFormOpen(false);
      setEditingRestaurant(null);
      setFormData({ name: '', slug: '' });
    } catch (error: any) {
      console.error('Error saving restaurant:', error);
      if (error.message?.includes('duplicate') || error.message?.includes('unique')) {
        toast.error('A restaurant with this slug already exists');
      } else {
        toast.error('Failed to save restaurant');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (restaurant: Restaurant) => {
    setEditingRestaurant(restaurant);
    setFormData({ name: restaurant.name, slug: restaurant.slug });
    setIsFormOpen(true);
  };

  const handleDelete = async (restaurantId: string) => {
    if (!confirm('Delete this restaurant? This will also delete all categories, dishes, and orders.')) return;

    try {
      await deleteRestaurant(restaurantId);
      toast.success('Restaurant deleted');
      await refreshRestaurants();
      // If deleted restaurant was current, clear selection
      if (currentRestaurant?.id === restaurantId) {
        setCurrentRestaurant(null);
      }
    } catch (error) {
      console.error('Error deleting restaurant:', error);
      toast.error('Failed to delete restaurant');
    }
  };

  const handleSetActive = (restaurant: Restaurant) => {
    setCurrentRestaurant(restaurant);
    toast.success(`Switched to ${restaurant.name}`);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gradient">Restaurants</h1>
            <p className="text-muted-foreground">Manage your restaurants</p>
          </div>
          <Button
            onClick={() => {
              setEditingRestaurant(null);
              setFormData({ name: '', slug: '' });
              setIsFormOpen(true);
            }}
            className="bg-gradient-to-r from-primary to-primary-glow"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Restaurant
          </Button>
        </div>

        {isFormOpen && (
          <Card className="glass border-white/20 animate-fade-in">
            <CardHeader>
              <CardTitle>{editingRestaurant ? 'Edit Restaurant' : 'Add New Restaurant'}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Restaurant Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., My Restaurant"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug *</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      slug: e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
                    })
                  }
                  placeholder="e.g., my-restaurant"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Used in URL: /menu/{formData.slug || 'slug'}
                </p>
              </div>
              <div className="flex gap-3 justify-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsFormOpen(false);
                    setEditingRestaurant(null);
                    setFormData({ name: '', slug: '' });
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={loading}
                  className="bg-gradient-to-r from-primary to-primary-glow"
                >
                  {editingRestaurant ? 'Update' : 'Create'} Restaurant
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="space-y-3">
          {restaurants.map((restaurant) => (
            <Card
              key={restaurant.id}
              className={`glass border-white/20 animate-fade-in ${
                currentRestaurant?.id === restaurant.id ? 'ring-2 ring-primary' : ''
              }`}
            >
              <CardContent className="flex items-center justify-between py-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-lg">{restaurant.name}</h3>
                    {currentRestaurant?.id === restaurant.id && (
                      <Badge variant="default" className="flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        Active
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Slug: {restaurant.slug} | URL: /menu/{restaurant.slug}
                  </p>
                </div>
                <div className="flex gap-2">
                  {currentRestaurant?.id !== restaurant.id && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleSetActive(restaurant)}
                    >
                      Set Active
                    </Button>
                  )}
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => handleEdit(restaurant)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => handleDelete(restaurant.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {restaurants.length === 0 && !isFormOpen && (
          <Card className="glass border-white/20">
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">No restaurants yet</p>
              <Button
                onClick={() => {
                  setEditingRestaurant(null);
                  setFormData({ name: '', slug: '' });
                  setIsFormOpen(true);
                }}
                className="bg-gradient-to-r from-primary to-primary-glow"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Restaurant
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminRestaurants;

