
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trash2, Plus, Edit2, Package } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  isDefault: boolean;
}

interface ProductCategory {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
}

interface ProductDetails {
  id: string;
  name: string;
  website: string;
  category: string;
  description: string;
  price: number;
  status: 'active' | 'inactive';
}

const Settings = () => {
  const [templates, setTemplates] = useState<EmailTemplate[]>([
    {
      id: '1',
      name: 'Standard Renewal',
      subject: 'Renewal Reminder - {contractValue} Contract',
      body: `Dear {customerName},

I hope this email finds you well.

We wanted to reach out regarding your upcoming software renewal scheduled for {renewalDate}.

Contract Details:
- Customer: {customerName}
- Company: {customerCompany}
- Partner: {partnerName}
- Contract Value: {contractValue}
- Renewal Date: {renewalDate}
- Status: {status}

We would appreciate the opportunity to discuss your renewal and any potential upgrades or changes to your current setup.

Please let us know if you have any questions or would like to schedule a call to discuss this further.

Best regards,
{employeeName}
{employeeEmail}
{employeePhone}`,
      isDefault: true
    }
  ]);

  const [categories, setCategories] = useState<ProductCategory[]>([
    { id: '1', name: 'Identity Management', description: 'User authentication and identity solutions', isActive: true },
    { id: '2', name: 'Mobile Device Management', description: 'Mobile device security and management tools', isActive: true },
    { id: '3', name: 'Productivity Suite', description: 'Office and productivity applications', isActive: true },
    { id: '4', name: 'Communication', description: 'Communication and collaboration tools', isActive: true },
    { id: '5', name: 'Security', description: 'Security and protection software', isActive: true },
  ]);

  const [products, setProducts] = useState<ProductDetails[]>([
    { id: '1', name: 'Azure Active Directory', website: 'azure.microsoft.com', category: 'Identity Management', description: 'Cloud-based identity and access management service', price: 299.99, status: 'active' },
    { id: '2', name: 'Microsoft Intune', website: 'intune.microsoft.com', category: 'Mobile Device Management', description: 'Mobile device and application management service', price: 199.99, status: 'active' },
  ]);

  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null);
  const [isCreatingTemplate, setIsCreatingTemplate] = useState(false);
  const [templateFormData, setTemplateFormData] = useState({
    name: '',
    subject: '',
    body: ''
  });

  const [editingCategory, setEditingCategory] = useState<ProductCategory | null>(null);
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [categoryFormData, setCategoryFormData] = useState({
    name: '',
    description: ''
  });

  const [editingProduct, setEditingProduct] = useState<ProductDetails | null>(null);
  const [isCreatingProduct, setIsCreatingProduct] = useState(false);
  const [productFormData, setProductFormData] = useState({
    name: '',
    website: '',
    category: '',
    description: '',
    price: 0
  });

  const { toast } = useToast();

  // Email template functions
  const handleCreateTemplate = () => {
    if (!templateFormData.name.trim() || !templateFormData.subject.trim() || !templateFormData.body.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    const newTemplate: EmailTemplate = {
      id: Date.now().toString(),
      name: templateFormData.name,
      subject: templateFormData.subject,
      body: templateFormData.body,
      isDefault: false
    };

    setTemplates([...templates, newTemplate]);
    setTemplateFormData({ name: '', subject: '', body: '' });
    setIsCreatingTemplate(false);
    
    toast({
      title: "Success",
      description: "Email template created successfully",
    });
  };

  const handleUpdateTemplate = () => {
    if (!editingTemplate || !templateFormData.name.trim() || !templateFormData.subject.trim() || !templateFormData.body.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setTemplates(templates.map(template => 
      template.id === editingTemplate.id 
        ? { ...template, name: templateFormData.name, subject: templateFormData.subject, body: templateFormData.body }
        : template
    ));
    
    setEditingTemplate(null);
    setTemplateFormData({ name: '', subject: '', body: '' });
    
    toast({
      title: "Success",
      description: "Email template updated successfully",
    });
  };

  const handleDeleteTemplate = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template?.isDefault) {
      toast({
        title: "Error",
        description: "Cannot delete the default template",
        variant: "destructive",
      });
      return;
    }

    setTemplates(templates.filter(template => template.id !== templateId));
    toast({
      title: "Success",
      description: "Email template deleted successfully",
    });
  };

  const handleSetDefaultTemplate = (templateId: string) => {
    setTemplates(templates.map(template => ({
      ...template,
      isDefault: template.id === templateId
    })));
    
    toast({
      title: "Success",
      description: "Default template updated successfully",
    });
  };

  const startEditingTemplate = (template: EmailTemplate) => {
    setEditingTemplate(template);
    setTemplateFormData({
      name: template.name,
      subject: template.subject,
      body: template.body
    });
    setIsCreatingTemplate(false);
  };

  const cancelTemplateEditing = () => {
    setEditingTemplate(null);
    setIsCreatingTemplate(false);
    setTemplateFormData({ name: '', subject: '', body: '' });
  };

  // Category management functions
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

  // Product management functions
  const handleCreateProduct = () => {
    if (!productFormData.name.trim() || !productFormData.website.trim() || !productFormData.category || !productFormData.description.trim() || productFormData.price <= 0) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    const newProduct: ProductDetails = {
      id: Date.now().toString(),
      name: productFormData.name,
      website: productFormData.website,
      category: productFormData.category,
      description: productFormData.description,
      price: productFormData.price,
      status: 'active'
    };

    setProducts([...products, newProduct]);
    setProductFormData({ name: '', website: '', category: '', description: '', price: 0 });
    setIsCreatingProduct(false);
    
    toast({
      title: "Success",
      description: "Product created successfully",
    });
  };

  const handleUpdateProduct = () => {
    if (!editingProduct || !productFormData.name.trim() || !productFormData.website.trim() || !productFormData.category || !productFormData.description.trim() || productFormData.price <= 0) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setProducts(products.map(product => 
      product.id === editingProduct.id 
        ? { ...product, name: productFormData.name, website: productFormData.website, category: productFormData.category, description: productFormData.description, price: productFormData.price }
        : product
    ));
    
    setEditingProduct(null);
    setProductFormData({ name: '', website: '', category: '', description: '', price: 0 });
    
    toast({
      title: "Success",
      description: "Product updated successfully",
    });
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts(products.filter(product => product.id !== productId));
    toast({
      title: "Success",
      description: "Product deleted successfully",
    });
  };

  const handleToggleProductStatus = (productId: string) => {
    setProducts(products.map(product => 
      product.id === productId 
        ? { ...product, status: product.status === 'active' ? 'inactive' : 'active' }
        : product
    ));
    
    toast({
      title: "Success",
      description: "Product status updated successfully",
    });
  };

  const startEditingProduct = (product: ProductDetails) => {
    setEditingProduct(product);
    setProductFormData({
      name: product.name,
      website: product.website,
      category: product.category,
      description: product.description,
      price: product.price
    });
    setIsCreatingProduct(false);
  };

  const cancelProductEditing = () => {
    setEditingProduct(null);
    setIsCreatingProduct(false);
    setProductFormData({ name: '', website: '', category: '', description: '', price: 0 });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-semibold">Settings</h3>
        <p className="text-muted-foreground">Manage your application settings and configurations</p>
      </div>

      <Tabs defaultValue="email-templates" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="email-templates">Email Templates</TabsTrigger>
          <TabsTrigger value="product-categories">Product Categories</TabsTrigger>
          <TabsTrigger value="product-details">Product Details</TabsTrigger>
        </TabsList>

        <TabsContent value="email-templates" className="space-y-6">
          {/* Template Form */}
          {(isCreatingTemplate || editingTemplate) && (
            <Card>
              <CardHeader>
                <CardTitle>{editingTemplate ? 'Edit Template' : 'Create New Template'}</CardTitle>
                <CardDescription>
                  Use placeholders like {'{customerName}'}, {'{renewalDate}'}, {'{contractValue}'}, etc.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="template-name">Template Name</Label>
                  <Input
                    id="template-name"
                    value={templateFormData.name}
                    onChange={(e) => setTemplateFormData({ ...templateFormData, name: e.target.value })}
                    placeholder="e.g., Urgent Renewal, Friendly Reminder"
                  />
                </div>
                
                <div>
                  <Label htmlFor="template-subject">Subject Line</Label>
                  <Input
                    id="template-subject"
                    value={templateFormData.subject}
                    onChange={(e) => setTemplateFormData({ ...templateFormData, subject: e.target.value })}
                    placeholder="e.g., Renewal Reminder - {contractValue} Contract"
                  />
                </div>
                
                <div>
                  <Label htmlFor="template-body">Email Body</Label>
                  <Textarea
                    id="template-body"
                    value={templateFormData.body}
                    onChange={(e) => setTemplateFormData({ ...templateFormData, body: e.target.value })}
                    rows={12}
                    placeholder="Write your email template here..."
                  />
                </div>
                
                <div className="flex gap-2">
                  <Button onClick={editingTemplate ? handleUpdateTemplate : handleCreateTemplate}>
                    {editingTemplate ? 'Update Template' : 'Create Template'}
                  </Button>
                  <Button variant="outline" onClick={cancelTemplateEditing}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Add New Template Button */}
          {!isCreatingTemplate && !editingTemplate && (
            <Button onClick={() => setIsCreatingTemplate(true)} className="gap-2">
              <Plus size={16} />
              Add New Template
            </Button>
          )}

          {/* Templates List */}
          <div className="space-y-4">
            {templates.map((template) => (
              <Card key={template.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {template.name}
                        {template.isDefault && <Badge variant="secondary">Default</Badge>}
                      </CardTitle>
                      <CardDescription>{template.subject}</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => startEditingTemplate(template)}
                        className="gap-1"
                      >
                        <Edit2 size={14} />
                        Edit
                      </Button>
                      {!template.isDefault && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSetDefaultTemplate(template.id)}
                        >
                          Set as Default
                        </Button>
                      )}
                      {!template.isDefault && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteTemplate(template.id)}
                          className="gap-1 text-destructive hover:text-destructive"
                        >
                          <Trash2 size={14} />
                          Delete
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted p-4 rounded-md">
                    <pre className="text-sm whitespace-pre-wrap">{template.body}</pre>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="product-categories" className="space-y-6">
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
        </TabsContent>

        <TabsContent value="product-details" className="space-y-6">
          {/* Product Form */}
          {(isCreatingProduct || editingProduct) && (
            <Card>
              <CardHeader>
                <CardTitle>{editingProduct ? 'Edit Product' : 'Create New Product'}</CardTitle>
                <CardDescription>
                  Manage product details and information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="product-name">Product Name</Label>
                  <Input
                    id="product-name"
                    value={productFormData.name}
                    onChange={(e) => setProductFormData({ ...productFormData, name: e.target.value })}
                    placeholder="e.g., Azure Active Directory"
                  />
                </div>
                
                <div>
                  <Label htmlFor="product-website">Website</Label>
                  <Input
                    id="product-website"
                    value={productFormData.website}
                    onChange={(e) => setProductFormData({ ...productFormData, website: e.target.value })}
                    placeholder="e.g., azure.microsoft.com"
                  />
                </div>
                
                <div>
                  <Label htmlFor="product-category">Category</Label>
                  <Select value={productFormData.category} onValueChange={(value) => setProductFormData({ ...productFormData, category: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.filter(cat => cat.isActive).map((category) => (
                        <SelectItem key={category.id} value={category.name}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="product-description">Description</Label>
                  <Textarea
                    id="product-description"
                    value={productFormData.description}
                    onChange={(e) => setProductFormData({ ...productFormData, description: e.target.value })}
                    rows={3}
                    placeholder="Describe this product..."
                  />
                </div>
                
                <div>
                  <Label htmlFor="product-price">Price ($)</Label>
                  <Input
                    id="product-price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={productFormData.price}
                    onChange={(e) => setProductFormData({ ...productFormData, price: parseFloat(e.target.value) || 0 })}
                    placeholder="0.00"
                  />
                </div>
                
                <div className="flex gap-2">
                  <Button onClick={editingProduct ? handleUpdateProduct : handleCreateProduct}>
                    {editingProduct ? 'Update Product' : 'Create Product'}
                  </Button>
                  <Button variant="outline" onClick={cancelProductEditing}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Add New Product Button */}
          {!isCreatingProduct && !editingProduct && (
            <Button onClick={() => setIsCreatingProduct(true)} className="gap-2">
              <Package size={16} />
              Add New Product
            </Button>
          )}

          {/* Products List */}
          <div className="space-y-4">
            {products.map((product) => (
              <Card key={product.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {product.name}
                        <Badge variant={product.status === 'active' ? "default" : "secondary"}>
                          {product.status}
                        </Badge>
                      </CardTitle>
                      <CardDescription>{product.category} - ${product.price.toFixed(2)}</CardDescription>
                      <p className="text-sm text-muted-foreground mt-1">{product.description}</p>
                      <a 
                        href={`https://${product.website}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-sm"
                      >
                        {product.website}
                      </a>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => startEditingProduct(product)}
                        className="gap-1"
                      >
                        <Edit2 size={14} />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleProductStatus(product.id)}
                      >
                        {product.status === 'active' ? 'Deactivate' : 'Activate'}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteProduct(product.id)}
                        className="gap-1 text-destructive hover:text-destructive"
                      >
                        <Trash2 size={14} />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </CardContent>
            </Card>
          ))}
        </div>
      </TabsContent>
    </Tabs>
  </div>
);
};

export default Settings;
