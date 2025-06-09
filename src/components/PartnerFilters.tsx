
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Filter } from 'lucide-react';

interface PartnerFiltersProps {
  onStatusFilter: (status: string) => void;
  onCustomersFilter: (minCustomers: number) => void;
  onRevenueFilter: (minRevenue: number) => void;
  onSpecializationFilter: (specialization: string) => void;
}

const PartnerFilters = ({ onStatusFilter, onCustomersFilter, onRevenueFilter, onSpecializationFilter }: PartnerFiltersProps) => {
  const specializations = ['Enterprise Software', 'Digital Marketing', 'Cloud Services', 'Consulting', 'E-commerce'];

  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <Filter size={20} className="text-muted-foreground" />
          <h3 className="font-medium">Filter Partners</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
            <label className="text-sm font-medium mb-2 block">Min Active Opportunities</label>
            <Input
              type="number"
              placeholder="0"
              onChange={(e) => onCustomersFilter(Number(e.target.value) || 0)}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Min Total Revenue ($)</label>
            <Input
              type="number"
              placeholder="0"
              onChange={(e) => onRevenueFilter(Number(e.target.value) || 0)}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Partner Program</label>
            <Select onValueChange={onSpecializationFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All programs" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All programs</SelectItem>
                {specializations.map((spec) => (
                  <SelectItem key={spec} value={spec}>
                    {spec}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PartnerFilters;
