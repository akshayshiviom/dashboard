
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Filter } from 'lucide-react';

interface ProductFiltersProps {
  onStatusFilter: (status: string) => void;
  onCategoryFilter: (category: string) => void;
  onCustomersFilter: (minCustomers: number) => void;
}

const ProductFilters = ({ onStatusFilter, onCategoryFilter, onCustomersFilter }: ProductFiltersProps) => {
  const categories = ['Identity Management', 'Mobile Device Management', 'Productivity Suite', 'Communication', 'Security'];

  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <Filter size={20} className="text-muted-foreground" />
          <h3 className="font-medium">Filter Products</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Status</label>
            <Select onValueChange={onStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Category</label>
            <Select onValueChange={onCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Min Active Customers</label>
            <Input
              type="number"
              placeholder="0"
              onChange={(e) => onCustomersFilter(Number(e.target.value) || 0)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductFilters;
