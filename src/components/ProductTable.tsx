
import { useState, useMemo } from 'react';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Product } from '../types';
import ProductTableHeader from './ProductTableHeader';
import ProductTableRow from './ProductTableRow';
import ProductDetail from './ProductDetail';

interface ProductTableProps {
  products: Product[];
  onPriceUpdate?: (productId: string, newPrice: number) => void;
  onStatusChange?: (productId: string, newStatus: 'active' | 'inactive') => void;
  onBulkStatusChange?: (productIds: string[], newStatus: 'active' | 'inactive') => void;
  onBulkImport?: (products: Product[]) => void;
  onProductUpdate?: (productId: string, updates: Partial<Product>) => void;
}

const ProductTable = ({ products, onPriceUpdate, onStatusChange, onBulkStatusChange, onBulkImport, onProductUpdate }: ProductTableProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Simulate current user role - in a real app, this would come from auth context
  const currentUserRole = 'admin';

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const searchMatch = searchTerm === '' || 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.website.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const statusMatch = statusFilter === 'all' || product.status === statusFilter;
      const categoryMatch = categoryFilter === 'all' || product.category === categoryFilter;
      
      return searchMatch && statusMatch && categoryMatch;
    });
  }, [products, searchTerm, statusFilter, categoryFilter]);

  // Only allow selection of active products
  const selectableProducts = filteredProducts.filter(product => product.status === 'active');

  const handleStatusToggle = (productId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    onStatusChange?.(productId, newStatus as 'active' | 'inactive');
  };

  const handleSelectProduct = (productId: string) => {
    // Only allow selection if product is active
    const product = products.find(p => p.id === productId);
    if (product && product.status !== 'active') {
      return; // Don't allow selection of inactive products
    }

    setSelectedProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleSelectAll = () => {
    if (selectedProducts.length === selectableProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(selectableProducts.map(product => product.id));
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

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleBackToList = () => {
    setSelectedProduct(null);
  };

  const handleProductUpdate = (productId: string, updates: Partial<Product>) => {
    const updatedProduct = { ...updates, lastEdited: new Date() };
    onProductUpdate?.(productId, updatedProduct);
  };

  if (selectedProduct) {
    return <ProductDetail product={selectedProduct} onBack={handleBackToList} />;
  }

  return (
    <div>
      <Card>
        <ProductTableHeader
          products={products}
          filteredProducts={filteredProducts}
          searchTerm={searchTerm}
          statusFilter={statusFilter}
          categoryFilter={categoryFilter}
          selectedProducts={selectedProducts}
          currentUserRole={currentUserRole}
          onSearchChange={setSearchTerm}
          onStatusFilter={setStatusFilter}
          onCategoryFilter={setCategoryFilter}
          onBulkAction={handleBulkAction}
          onBulkImport={onBulkImport}
        />
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                {currentUserRole === 'admin' && (
                  <TableHead className="w-12">
                    <Checkbox 
                      checked={selectedProducts.length === selectableProducts.length && selectableProducts.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                )}
                <TableHead>Software Name</TableHead>
                <TableHead>Plans</TableHead>
                <TableHead>Website</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Active Customers</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Added</TableHead>
                <TableHead>Last Edited</TableHead>
                {currentUserRole === 'admin' && <TableHead>Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <ProductTableRow
                  key={product.id}
                  product={product}
                  currentUserRole={currentUserRole}
                  isSelected={selectedProducts.includes(product.id)}
                  onSelect={handleSelectProduct}
                  onStatusToggle={handleStatusToggle}
                  onProductClick={handleProductClick}
                  onProductUpdate={handleProductUpdate}
                />
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductTable;
