
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trash2, Plus, Edit2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ProductCategory {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
}

interface ProductCategoriesTabProps {
  categories: ProductCategory[];
  setCategories: (categories: ProductCategory[]) => void;
}

const ProductCategoriesTab = ({ categories, setCategories }: ProductCategoriesTabProps) => {
  const [editingCategory, setEditingCategory] = useState<ProductCategory | null>(null);
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [categoryFormData, setCategoryFormData] = useState({
    name: '',
    description: ''
  });

  const { toast } = useToast();

  const handleCreateCategory = () => {
    if (!categoryFormData.name.trim() || !categoryFormData.description.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    const newCategory: ProductCategory = {
      id: Date.now().toString(),
      name: categoryFormData.name,
      description: categoryFormData.description,
      isActive: true
    };

    setCategories([...categories, newCategory]);
    setCategoryFormData({ name: '', description: '' });
    setIsCreatingCategory(false);
    
    toast({
      title: "Success",
      description: "Product category created successfully",
    });
  };

  const handleUpdateCategory = () => {
    if (!editingCategory || !categoryFormData.name.trim() || !categoryFormData.description.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setCategories(categories.map(category => 
      category.id === editingCategory.id 
        ? { ...category, name: categoryFormData.name, description: categoryFormData.description }
        : category
    ));
    
    setEditingCategory(null);
    setCategoryFormData({ name: '', description: '' });
    
    toast({
      title: "Success",
      description: "Product category updated successfully",
    });
  };

  const handleDeleteCategory = (categoryId: string) => {
    setCategories(categories.filter(category => category.id !== categoryId));
    toast({
      title: "Success",
      description: "Product category deleted successfully",
    });
  };

  const handleToggleCategoryStatus = (categoryId: string) => {
    setCategories(categories.map(category => 
      category.id === categoryId 
        ? { ...category, isActive: !category.isActive }
        : category
    ));
    
    toast({
      title: "Success",
      description: "Category status updated successfully",
    });
  };

  const startEditingCategory = (category: ProductCategory) => {
    setEditingCategory(category);
    setCategoryFormData({
      name: category.name,
      description: category.description
    });
    setIsCreatingCategory(false);
  };

  const cancelCategoryEditing = () => {
    setEditingCategory(null);
    setIsCreatingCategory(false);
    setCategoryFormData({ name: '', description: '' });
  };

  return (
    <div className="space-y-6">
      {/* Category Form */}
      {(isCreatingCategory || editingCategory) && (
        <Card>
          <CardHeader>
            <CardTitle>{editingCategory ? 'Edit Category' : 'Create New Category'}</CardTitle>
            <CardDescription>
              Manage product categories for better organization
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="category-name">Category Name</Label>
              <Input
                id="category-name"
                value={categoryFormData.name}
                onChange={(e) => setCategoryFormData({ ...categoryFormData, name: e.target.value })}
                placeholder="e.g., Identity Management, Security"
              />
            </div>
            
            <div>
              <Label htmlFor="category-description">Description</Label>
              <Textarea
                id="category-description"
                value={categoryFormData.description}
                onChange={(e) => setCategoryFormData({ ...categoryFormData, description: e.target.value })}
                rows={3}
                placeholder="Describe this category..."
              />
            </div>
            
            <div className="flex gap-2">
              <Button onClick={editingCategory ? handleUpdateCategory : handleCreateCategory}>
                {editingCategory ? 'Update Category' : 'Create Category'}
              </Button>
              <Button variant="outline" onClick={cancelCategoryEditing}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add New Category Button */}
      {!isCreatingCategory && !editingCategory && (
        <Button onClick={() => setIsCreatingCategory(true)} className="gap-2">
          <Plus size={16} />
          Add New Category
        </Button>
      )}

      {/* Categories List */}
      <div className="space-y-4">
        {categories.map((category) => (
          <Card key={category.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {category.name}
                    <Badge variant={category.isActive ? "default" : "secondary"}>
                      {category.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </CardTitle>
                  <CardDescription>{category.description}</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => startEditingCategory(category)}
                    className="gap-1"
                  >
                    <Edit2 size={14} />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleCategoryStatus(category.id)}
                  >
                    {category.isActive ? 'Deactivate' : 'Activate'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteCategory(category.id)}
                    className="gap-1 text-destructive hover:text-destructive"
                  >
                    <Trash2 size={14} />
                    Delete
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProductCategoriesTab;
