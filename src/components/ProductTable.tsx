
import { useState, useMemo } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Edit2, Check, X } from 'lucide-react';
import { Product } from '../types';
import ProductFilters from './ProductFilters';

interface ProductTableProps {
  products: Product[];
  onPriceUpdate?: (productId: string, newPrice: number) => void;
}

const ProductTable = ({ products, onPriceUpdate }: ProductTableProps) => {
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [customersFilter, setCustomersFilter] = useState(0);
  const [editingPrice, setEditingPrice] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState<number>(0);

  // Simulate current user role - in a real app, this would come from auth context
  const currentUserRole = 'admin'; // Change this to test different roles

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

  return (
    <div>
      <ProductFilters
        onStatusFilter={setStatusFilter}
        onCategoryFilter={setCategoryFilter}
        onCustomersFilter={setCustomersFilter}
      />
      <Card>
        <CardHeader>
          <CardTitle>
            Products Overview ({filteredProducts.length} of {products.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
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
                        <span>${product.price.toFixed(2)}</span>
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
