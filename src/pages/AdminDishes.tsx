import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import DishForm from '@/components/admin/DishForm';
import DishList from '@/components/admin/DishList';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Dish, Category } from '@/types';
import { useRestaurant } from '@/hooks/useRestaurant';
import { getDishes, getCategories, createDish, updateDish, deleteDish } from '@/lib/supabase/queries';
import { toast } from 'sonner';

const AdminDishes = () => {
  const navigate = useNavigate();
  const { currentRestaurant } = useRestaurant();
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDish, setEditingDish] = useState<Dish | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const isAuth = localStorage.getItem('admin_auth');
    if (!isAuth) {
      navigate('/');
    }
  }, [navigate]);

  useEffect(() => {
    if (currentRestaurant) {
      loadData();
    }
  }, [currentRestaurant]);

  const loadData = async () => {
    if (!currentRestaurant) return;
    
    try {
      setLoading(true);
      const [dishesData, categoriesData] = await Promise.all([
        getDishes(currentRestaurant.id),
        getCategories(currentRestaurant.id)
      ]);
      setDishes(dishesData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load dishes');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDish = async (dish: Dish) => {
    if (!currentRestaurant) {
      toast.error('Please select a restaurant');
      return;
    }

    try {
      if (editingDish) {
        await updateDish(editingDish.id, { ...dish, restaurant_id: currentRestaurant.id });
        toast.success('Dish updated successfully');
      } else {
        await createDish({ ...dish, restaurant_id: currentRestaurant.id });
        toast.success('Dish created successfully');
      }
      await loadData();
      setIsFormOpen(false);
      setEditingDish(null);
    } catch (error) {
      console.error('Error saving dish:', error);
      toast.error('Failed to save dish');
    }
  };

  const handleEditDish = (dish: Dish) => {
    setEditingDish(dish);
    setIsFormOpen(true);
  };

  const handleDeleteDish = async (dishId: string) => {
    if (!confirm('Are you sure you want to delete this dish?')) return;

    try {
      await deleteDish(dishId);
      toast.success('Dish deleted successfully');
      await loadData();
    } catch (error) {
      console.error('Error deleting dish:', error);
      toast.error('Failed to delete dish');
    }
  };

  if (!currentRestaurant) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Please select a restaurant to manage dishes</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gradient">Dishes</h1>
            <p className="text-muted-foreground">Manage your restaurant menu</p>
          </div>
          <Button
            onClick={() => {
              setEditingDish(null);
              setIsFormOpen(true);
            }}
            className="bg-gradient-to-r from-primary to-primary-glow"
            disabled={categories.length === 0}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Dish
          </Button>
        </div>

        {categories.length === 0 && (
          <div className="glass rounded-lg p-4 text-center">
            <p className="text-muted-foreground">
              Please create at least one category before adding dishes.
            </p>
          </div>
        )}

        {isFormOpen && (
          <DishForm
            dish={editingDish}
            categories={categories}
            onSave={handleSaveDish}
            onCancel={() => {
              setIsFormOpen(false);
              setEditingDish(null);
            }}
          />
        )}

        {loading ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Loading dishes...</p>
          </div>
        ) : (
          <DishList
            dishes={dishes}
            categories={categories}
            onEdit={handleEditDish}
            onDelete={handleDeleteDish}
          />
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminDishes;
