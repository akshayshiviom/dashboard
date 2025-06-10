
import { CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Search } from 'lucide-react';
import { Product } from '../types';
import BulkImportDialog from './BulkImportDialog';
import ProductTableFilters from './ProductTableFilters';

interface ProductTableHeaderProps {
  products: Product[];
  filteredProducts: Product[];
  searchTerm: string;
  statusFilter: string;
  categoryFilter: string;
  selectedProducts: string[];
  currentUserRole: string;
  onSearchChange: (value: string) => void;
  onStatusFilter: (status: string) => void;
  onCategoryFilter: (category: string) => void;
  onBulkAction: (action: string) => void;
  onBulkImport?: (products: Product[]) => void;
}

const ProductTableHeader = ({
  products,
  filteredProducts,
  searchTerm,
  statusFilter,
  categoryFilter,
  selectedProducts,
  currentUserRole,
  onSearchChange,
  onStatusFilter,
  onCategoryFilter,
  onBulkAction,
  onBulkImport
}: ProductTableHeaderProps) => {
  return (
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
                <DropdownMenuItem onClick={() => onBulkAction('activate')}>
                  Set Active
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onBulkAction('deactivate')}>
                  Set Inactive
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          
          <ProductTableFilters
            statusFilter={statusFilter}
            categoryFilter={categoryFilter}
            onStatusFilter={onStatusFilter}
            onCategoryFilter={onCategoryFilter}
          />
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="flex-1 w-full md:w-auto">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search software products by name, website, category, or description..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>
    </CardHeader>
  );
};

export default ProductTableHeader;
