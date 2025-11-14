import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Category } from '@/types';
import { Plus, Edit, Trash2, GripVertical } from 'lucide-react';
import { toast } from 'sonner';
import { useRestaurant } from '@/hooks/useRestaurant';
import { getCategories, createCategory, updateCategory, deleteCategory } from '@/lib/supabase/queries';

const AdminCategories = () => {
  const navigate = useNavigate();
  const { currentRestaurant } = useRestaurant();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({ name: '', slug: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const isAuth = localStorage.getItem('admin_auth');
    if (!isAuth) {
      navigate('/');
    }
  }, [navigate]);

  useEffect(() => {
    if (currentRestaurant) {
      loadCategories();
    }
  }, [currentRestaurant]);

  const loadCategories = async () => {
    if (!currentRestaurant) return;
    
    try {
      setLoading(true);
      const data = await getCategories(currentRestaurant.id);
      setCategories(data);
    } catch (error) {
      console.error('Error loading categories:', error);
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!currentRestaurant) {
      toast.error('Please select a restaurant');
      return;
    }

    if (!formData.name || !formData.slug) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, {
          ...editingCategory,
          name: formData.name,
          slug: formData.slug,
          restaurant_id: currentRestaurant.id
        });
        toast.success('Category updated');
      } else {
        await createCategory({
          restaurant_id: currentRestaurant.id,
          name: formData.name,
          slug: formData.slug,
          display_order: categories.length + 1,
          is_active: true,
        });
        toast.success('Category created');
      }

      await loadCategories();
      setIsFormOpen(false);
      setEditingCategory(null);
      setFormData({ name: '', slug: '' });
    } catch (error) {
      console.error('Error saving category:', error);
      toast.error('Failed to save category');
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({ name: category.name, slug: category.slug });
    setIsFormOpen(true);
  };

  const handleDelete = async (categoryId: string) => {
    if (!confirm('Delete this category? This will also delete all dishes in this category.')) return;

    try {
      await deleteCategory(categoryId);
      toast.success('Category deleted');
      await loadCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('Failed to delete category');
    }
  };

  if (!currentRestaurant) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Please select a restaurant to manage categories</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gradient">Categories</h1>
            <p className="text-muted-foreground">Organize your menu items</p>
          </div>
          <Button
            onClick={() => {
              setEditingCategory(null);
              setFormData({ name: '', slug: '' });
              setIsFormOpen(true);
            }}
            className="bg-gradient-to-r from-primary to-primary-glow"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Category
          </Button>
        </div>

        {isFormOpen && (
          <Card className="glass border-white/20 animate-fade-in">
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Category Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      name: e.target.value,
                      slug: e.target.value.toLowerCase().replace(/\s+/g, '-'),
                    })
                  }
                  placeholder="e.g., Starters"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="e.g., starters"
                />
              </div>
              <div className="flex gap-3 justify-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsFormOpen(false);
                    setEditingCategory(null);
                    setFormData({ name: '', slug: '' });
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  className="bg-gradient-to-r from-primary to-primary-glow"
                >
                  {editingCategory ? 'Update' : 'Create'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {loading ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Loading categories...</p>
          </div>
        ) : (
          <div className="space-y-3">
            {categories.map((category) => (
            <Card
              key={category.id}
              className="glass border-white/20 animate-fade-in"
            >
              <CardContent className="flex items-center justify-between py-4">
                <div className="flex items-center gap-3">
                  <GripVertical className="w-5 h-5 text-muted-foreground cursor-move" />
                  <div>
                    <h3 className="font-semibold">{category.name}</h3>
                    <p className="text-sm text-muted-foreground">{category.slug}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => handleEdit(category)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => handleDelete(category.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminCategories;
