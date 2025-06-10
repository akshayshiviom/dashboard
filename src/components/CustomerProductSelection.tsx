
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Product } from '../types';

interface CustomerProductSelectionProps {
  products: Product[];
  selectedProducts: string[];
  onProductChange: (productId: string, checked: boolean) => void;
}

const CustomerProductSelection = ({ products, selectedProducts, onProductChange }: CustomerProductSelectionProps) => {
  return (
    <div className="space-y-2">
      <Label>Products</Label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-40 overflow-y-auto border rounded-md p-3">
        {products.map((product) => (
          <div key={product.id} className="flex items-center space-x-2">
            <Checkbox
              id={product.id}
              checked={selectedProducts.includes(product.id)}
              onCheckedChange={(checked) => onProductChange(product.id, checked as boolean)}
            />
            <label
              htmlFor={product.id}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              {product.name}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerProductSelection;
