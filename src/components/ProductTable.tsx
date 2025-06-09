
import { useState, useMemo } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger } from '@/components/ui/dropdown-menu';
import { Edit2, Check, X, Filter } from 'lucide-react';
import { Product } from '../types';
import BulkImportDialog from './BulkImportDialog';

interface ProductTableProps {
  products: Product[];
  onPriceUpdate?: (productId: string, newPrice: number) => void;
  onStatusChange?: (productId: string, newStatus: 'active' | 'inactive') => void;
  onBulkStatusChange?: (productIds: string[], newStatus: 'active' | 'inactive') => void;
  onBulkImport?: (products: Product[]) => void;
}

const ProductTable = ({ products, onPriceUpdate, onStatusChange, onBulkStatusChange, onBulkImport }: ProductTableProps) => {
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [customersFilter, setCustomersFilter] = useState(0);
  const [editingPrice, setEditingPrice] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState<number>(0);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  // Simulate current user role - in a real app, this would come from auth context
  const currentUserRole = 'admin'; // Change this to test different roles

  const categories = ['Identity Management', 'Mobile Device Management', 'Productivity Suite', 'Communication', 'Security'];

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const statusMatch = statusFilter === 'all' || product.status === statusFilter;
      const categoryMatch = categoryFilter === 'all' || product.category === categoryFilter;
      const customersMatch = product.customersCount >= customersFilter;
      
      return statusMatch && categoryMatch && customersMatch;
    });
  }, [products, statusFilter, categoryFilter, customersFilter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const startPriceEdit = (productId: string, currentPrice: number) => {
    setEditingPrice(productId);
    setEditPrice(currentPrice);
  };

  const savePriceEdit = (productId: string) => {
    if (onPriceUpdate && editPrice > 0) {
      onPriceUpdate(productId, editPrice);
    }
    setEditingPrice(null);
    setEditPrice(0);
  };

  const cancelPriceEdit = () => {
    setEditingPrice(null);
    setEditPrice(0);
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

  return (
    <div>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              Products Overview ({filteredProducts.length} of {products.length})
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
                <TableHead>Product Name</TableHead>
                <TableHead>Website</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Price</TableHead>
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
                  <TableCell>
                    {editingPrice === product.id ? (
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          value={editPrice}
                          onChange={(e) => setEditPrice(parseFloat(e.target.value) || 0)}
                          className="w-24"
                          step="0.01"
                          min="0"
                        />
                        <Button size="sm" onClick={() => savePriceEdit(product.id)}>
                          <Check size={14} />
                        </Button>
                        <Button size="sm" variant="outline" onClick={cancelPriceEdit}>
                          <X size={14} />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span>₹{product.price.toFixed(2)}</span>
                        {currentUserRole === 'admin' && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => startPriceEdit(product.id, product.price)}
                          >
                            <Edit2 size={14} />
                          </Button>
                        )}
                      </div>
                    )}
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
                        {editingPrice !== product.id && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => startPriceEdit(product.id, product.price)}
                          >
                            <Edit2 size={14} className="mr-1" />
                            Edit Price
                          </Button>
                        )}
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
