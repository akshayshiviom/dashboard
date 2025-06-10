
import { TableCell, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Edit2 } from 'lucide-react';
import { Product } from '../types';

interface ProductTableRowProps {
  product: Product;
  currentUserRole: string;
  isSelected: boolean;
  onSelect: (productId: string) => void;
  onStatusToggle: (productId: string, currentStatus: string) => void;
  onProductClick: (product: Product) => void;
}

const ProductTableRow = ({ product, currentUserRole, isSelected, onSelect, onStatusToggle, onProductClick }: ProductTableRowProps) => {
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

  const handleRowClick = (e: React.MouseEvent) => {
    // Don't trigger if clicking on interactive elements
    if ((e.target as HTMLElement).closest('button, input, a, [role="switch"]')) {
      return;
    }
    onProductClick(product);
  };

  return (
    <TableRow className="hover:bg-muted/50 cursor-pointer" onClick={handleRowClick}>
      {currentUserRole === 'admin' && (
        <TableCell onClick={(e) => e.stopPropagation()}>
          <Checkbox 
            checked={isSelected}
            onCheckedChange={() => onSelect(product.id)}
          />
        </TableCell>
      )}
      <TableCell className="font-medium">
        <div className="space-y-2">
          <div className="font-semibold">{product.name}</div>
          {product.plans && product.plans.length > 0 && (
            <div className="space-y-1">
              {product.plans.slice(0, 2).map((plan) => (
                <div key={plan.id} className="flex items-center gap-2 text-xs">
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
              {product.plans.length > 2 && (
                <div className="text-xs text-muted-foreground">
                  +{product.plans.length - 2} more plans
                </div>
              )}
            </div>
          )}
        </div>
      </TableCell>
      <TableCell>
        <a 
          href={`https://${product.website}`} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
          onClick={(e) => e.stopPropagation()}
        >
          {product.website}
        </a>
      </TableCell>
      <TableCell>{product.category}</TableCell>
      <TableCell className="max-w-xs truncate">{product.description}</TableCell>
      <TableCell>{product.customersCount}</TableCell>
      <TableCell>
        <Badge className={getStatusColor(product.status)}>
          {product.status}
        </Badge>
      </TableCell>
      <TableCell>{product.createdAt.toLocaleDateString()}</TableCell>
      {currentUserRole === 'admin' && (
        <TableCell onClick={(e) => e.stopPropagation()}>
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
