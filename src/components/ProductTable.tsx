
import { useState, useMemo } from 'react';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
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

  const handleStatusToggle = (productId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    console.log('Status toggle called for product:', productId, 'from', currentStatus, 'to', newStatus);
    onStatusChange?.(productId, newStatus as 'active' | 'inactive');
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

  // Dummy handlers for removed bulk functionality
  const handleSelect = (productId: string) => {
    // No longer used since bulk actions are removed
  };

  if (selectedProduct) {
    return <ProductDetail product={selectedProduct} onBack={handleBackToList} onProductUpdate={handleProductUpdate} />;
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
          currentUserRole={currentUserRole}
          onSearchChange={setSearchTerm}
          onStatusFilter={setStatusFilter}
          onCategoryFilter={setCategoryFilter}
          onBulkImport={onBulkImport}
        />
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Software Name</TableHead>
                <TableHead>Plans</TableHead>
                <TableHead>Website</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Active Customers</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Added</TableHead>
                <TableHead>Last Edited</TableHead>
                {currentUserRole === 'admin' && <TableHead>Status Toggle</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <ProductTableRow
                  key={product.id}
                  product={product}
                  currentUserRole={currentUserRole}
                  isSelected={false}
                  onSelect={handleSelect}
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
