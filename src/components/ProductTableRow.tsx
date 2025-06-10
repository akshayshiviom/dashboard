
import { TableCell, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Edit2 } from 'lucide-react';
import { Product } from '../types';
import ProductPlansCell from './ProductPlansCell';

interface ProductTableRowProps {
  product: Product;
  currentUserRole: string;
  isSelected: boolean;
  onSelect: (productId: string) => void;
  onStatusToggle: (productId: string, currentStatus: string) => void;
}

const ProductTableRow = ({ product, currentUserRole, isSelected, onSelect, onStatusToggle }: ProductTableRowProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <TableRow className="hover:bg-muted/50">
      {currentUserRole === 'admin' && (
        <TableCell>
          <Checkbox 
            checked={isSelected}
            onCheckedChange={() => onSelect(product.id)}
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
        <ProductPlansCell plans={product.plans} />
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
              onCheckedChange={() => onStatusToggle(product.id, product.status)}
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
  );
};

export default ProductTableRow;
