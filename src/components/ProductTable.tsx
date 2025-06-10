
import { useState, useMemo } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger } from '@/components/ui/dropdown-menu';
import { Edit2, Check, X, Filter, Search } from 'lucide-react';
import { Product, ProductPlan } from '../types';
import BulkImportDialog from './BulkImportDialog';

interface ProductTableProps {
  products: Product[];
  onPriceUpdate?: (productId: string, newPrice: number) => void;
  onStatusChange?: (productId: string, newStatus: 'active' | 'inactive') => void;
  onBulkStatusChange?: (productIds: string[], newStatus: 'active' | 'inactive') => void;
  onBulkImport?: (products: Product[]) => void;
}

const ProductTable = ({ products, onPriceUpdate, onStatusChange, onBulkStatusChange, onBulkImport }: ProductTableProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [customersFilter, setCustomersFilter] = useState(0);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  // Simulate current user role - in a real app, this would come from auth context
  const currentUserRole = 'admin'; // Change this to test different roles

  const categories = ['Identity Management', 'Mobile Device Management', 'Productivity Suite', 'Communication', 'Security'];

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const searchMatch = searchTerm === '' || 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.website.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const statusMatch = statusFilter === 'all' || product.status === statusFilter;
      const categoryMatch = categoryFilter === 'all' || product.category === categoryFilter;
      const customersMatch = product.customersCount >= customersFilter;
      
      return searchMatch && statusMatch && categoryMatch && customersMatch;
    });
  }, [products, searchTerm, statusFilter, categoryFilter, customersFilter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getBillingBadgeColor = (billing: string) => {
    switch (billing) {
      case 'monthly': return 'bg-blue-100 text-blue-800';
      case 'yearly': return 'bg-purple-100 text-purple-800';
      case 'one-time': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStatusToggle = (productId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    onStatusChange?.(productId, newStatus as 'active' | 'inactive');
  };

  const handleSelectProduct = (productId: string) => {
    setSelectedProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleSelectAll = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredProducts.map(product => product.id));
    }
  };

  const handleBulkAction = (action: string) => {
    if (selectedProducts.length === 0) return;
    
    switch (action) {
      case 'activate':
        onBulkStatusChange?.(selectedProducts, 'active');
        break;
      case 'deactivate':
        onBulkStatusChange?.(selectedProducts, 'inactive');
        break;
    }
    setSelectedProducts([]);
  };

  const renderPlansCell = (plans: ProductPlan[]) => {
    if (!plans || plans.length === 0) {
      return <span className="text-muted-foreground">No plans available</span>;
    }

    const sortedPlans = [...plans].sort((a, b) => a.price - b.price);
    
    return (
      <div className="space-y-1">
        {sortedPlans.map((plan) => (
          <div key={plan.id} className="flex items-center gap-2 text-sm">
            <span className="font-medium">{plan.name}:</span>
            <span>₹{plan.price.toFixed(2)}</span>
            <Badge className={getBillingBadgeColor(plan.billing)} variant="secondary">
              {plan.billing}
            </Badge>
            {plan.isPopular && (
              <Badge variant="default" className="text-xs">Popular</Badge>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              Software Products Overview ({filteredProducts.length} of {products.length})
            </CardTitle>
            <div className="flex items-center gap-2">
              {currentUserRole === 'admin' && onBulkImport && (
                <BulkImportDialog
                  type="products"
                  onImport={onBulkImport}
                />
              )}
              
              {selectedProducts.length > 0 && currentUserRole === 'admin' && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      Bulk Actions ({selectedProducts.length})
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => handleBulkAction('activate')}>
                      Set Active
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleBulkAction('deactivate')}>
                      Set Inactive
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Filter size={16} className="mr-2" />
                    Filters
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      Filter by Status
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent>
                      <DropdownMenuItem onClick={() => setStatusFilter('all')}>
                        All statuses
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => setStatusFilter('active')}>
                        Active
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setStatusFilter('inactive')}>
                        Inactive
                      </DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>
                  
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      Filter by Category
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent>
                      <DropdownMenuItem onClick={() => setCategoryFilter('all')}>
                        All categories
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {categories.map((category) => (
                        <DropdownMenuItem key={category} onClick={() => setCategoryFilter(category)}>
                          {category}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1 w-full md:w-auto">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search software products by name, website, category, or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                {currentUserRole === 'admin' && (
                  <TableHead className="w-12">
                    <Checkbox 
                      checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                )}
                <TableHead>Software Name</TableHead>
                <TableHead>Website</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Plans & Pricing</TableHead>
                <TableHead>Active Customers</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Added</TableHead>
                {currentUserRole === 'admin' && <TableHead>Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id} className="hover:bg-muted/50">
                  {currentUserRole === 'admin' && (
                    <TableCell>
                      <Checkbox 
                        checked={selectedProducts.includes(product.id)}
                        onCheckedChange={() => handleSelectProduct(product.id)}
                      />
                    </TableCell>
                  )}
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>
                    <a 
                      href={`https://${product.website}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {product.website}
                    </a>
                  </TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell className="max-w-xs truncate">{product.description}</TableCell>
                  <TableCell className="min-w-64">
                    {renderPlansCell(product.plans)}
                  </TableCell>
                  <TableCell>{product.customersCount}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(product.status)}>
                      {product.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{product.createdAt.toLocaleDateString()}</TableCell>
                  {currentUserRole === 'admin' && (
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={product.status === 'active'}
                          onCheckedChange={() => handleStatusToggle(product.id, product.status)}
                        />
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            // Handle plan management - could open a dialog
                            console.log('Manage plans for:', product.name);
                          }}
                        >
                          <Edit2 size={14} className="mr-1" />
                          Manage Plans
                        </Button>
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductTable;
