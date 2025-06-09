
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Filter } from 'lucide-react';

interface CustomerFiltersProps {
  onStatusFilter: (status: string) => void;
  onPartnerFilter: (partnerId: string) => void;
  onValueFilter: (minValue: number) => void;
  partners: { id: string; name: string }[];
}

const CustomerFilters = ({ onStatusFilter, onPartnerFilter, onValueFilter, partners }: CustomerFiltersProps) => {
  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <Filter size={20} className="text-muted-foreground" />
          <h3 className="font-medium">Filter Customers</h3>
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
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Partner</label>
            <Select onValueChange={onPartnerFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All partners" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All partners</SelectItem>
                <SelectItem value="unassigned">Unassigned</SelectItem>
                {partners.map((partner) => (
                  <SelectItem key={partner.id} value={partner.id}>
                    {partner.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Min Value ($)</label>
            <Input
              type="number"
              placeholder="0"
              onChange={(e) => onValueFilter(Number(e.target.value) || 0)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomerFilters;
