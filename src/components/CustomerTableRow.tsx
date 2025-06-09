
import { TableCell, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Customer, Partner, Product } from '../types';

interface CustomerTableRowProps {
  customer: Customer;
  partners: Partner[];
  products: Product[];
  isSelected: boolean;
  onSelect: (customerId: string) => void;
  onStatusToggle: (customerId: string, currentStatus: string) => void;
}

const CustomerTableRow = ({ 
  customer, 
  partners, 
  products, 
  isSelected, 
  onSelect, 
  onStatusToggle 
}: CustomerTableRowProps) => {
  const getPartnerName = (partnerId?: string) => {
    const partner = partners.find(p => p.id === partnerId);
    return partner ? partner.name : 'Unassigned';
  };

  const getProductNames = (productIds?: string[]) => {
    if (!productIds || productIds.length === 0) return 'None';
    return productIds
      .map(id => products.find(p => p.id === id)?.name)
      .filter(Boolean)
      .join(', ');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getZoneColor = (zone?: string) => {
    switch (zone) {
      case 'north': return 'bg-blue-100 text-blue-800';
      case 'east': return 'bg-green-100 text-green-800';
      case 'west': return 'bg-orange-100 text-orange-800';
      case 'south': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <TableRow className="hover:bg-muted/50">
      <TableCell className="w-8">
        <Checkbox 
          checked={isSelected}
          onCheckedChange={() => onSelect(customer.id)}
        />
      </TableCell>
      <TableCell className="font-medium min-w-32">
        <div className="truncate">{customer.name}</div>
        <div className="text-xs text-muted-foreground md:hidden truncate">{customer.email}</div>
      </TableCell>
      <TableCell className="hidden md:table-cell">{customer.company}</TableCell>
      <TableCell className="hidden lg:table-cell">{customer.email}</TableCell>
      <TableCell className="hidden md:table-cell">{getPartnerName(customer.partnerId)}</TableCell>
      <TableCell className="hidden lg:table-cell">
        {customer.zone ? (
          <Badge className={getZoneColor(customer.zone)}>
            {customer.zone.charAt(0).toUpperCase() + customer.zone.slice(1)}
          </Badge>
        ) : (
          <span className="text-muted-foreground">Not set</span>
        )}
      </TableCell>
      <TableCell className="hidden xl:table-cell max-w-xs truncate">
        {getProductNames(customer.productIds)}
      </TableCell>
      <TableCell>
        <Badge className={getStatusColor(customer.status)}>
          {customer.status}
        </Badge>
      </TableCell>
      <TableCell className="text-right font-medium">₹{customer.value.toLocaleString('en-IN')}</TableCell>
      <TableCell className="hidden lg:table-cell">{customer.createdAt.toLocaleDateString()}</TableCell>
      <TableCell className="hidden md:table-cell">
        <div className="flex items-center gap-2">
          <Switch
            checked={customer.status === 'active'}
            onCheckedChange={() => onStatusToggle(customer.id, customer.status)}
            disabled={customer.status === 'pending'}
          />
          <span className="text-xs text-muted-foreground hidden lg:inline">
            {customer.status === 'active' ? 'Active' : 'Inactive'}
          </span>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default CustomerTableRow;
