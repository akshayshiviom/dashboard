import { useState, useMemo } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger } from '@/components/ui/dropdown-menu';
import { Filter } from 'lucide-react';
import { Customer, Partner, Product } from '../types';
import BulkImportDialog from './BulkImportDialog';

interface CustomerTableProps {
  customers: Customer[];
  partners: Partner[];
  products: Product[];
  onStatusChange?: (customerId: string, newStatus: 'active' | 'inactive' | 'pending') => void;
  onBulkStatusChange?: (customerIds: string[], newStatus: 'active' | 'inactive' | 'pending') => void;
  onBulkImport?: (customers: Customer[]) => void;
}

const CustomerTable = ({ customers, partners, products, onStatusChange, onBulkStatusChange, onBulkImport }: CustomerTableProps) => {
  const [statusFilter, setStatusFilter] = useState('all');
  const [partnerFilter, setPartnerFilter] = useState('all');
  const [valueFilter, setValueFilter] = useState(0);
  const [zoneFilter, setZoneFilter] = useState('all');
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);

  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) => {
      const statusMatch = statusFilter === 'all' || customer.status === statusFilter;
      const partnerMatch = 
        partnerFilter === 'all' || 
        (partnerFilter === 'unassigned' && !customer.partnerId) ||
        customer.partnerId === partnerFilter;
      const valueMatch = customer.value >= valueFilter;
      const zoneMatch = zoneFilter === 'all' || customer.zone === zoneFilter;
      
      return statusMatch && partnerMatch && valueMatch && zoneMatch;
    });
  }, [customers, statusFilter, partnerFilter, valueFilter, zoneFilter]);

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

  const handleStatusToggle = (customerId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    onStatusChange?.(customerId, newStatus as 'active' | 'inactive' | 'pending');
  };

  const handleSelectCustomer = (customerId: string) => {
    setSelectedCustomers(prev => 
      prev.includes(customerId) 
        ? prev.filter(id => id !== customerId)
        : [...prev, customerId]
    );
  };

  const handleSelectAll = () => {
    if (selectedCustomers.length === filteredCustomers.length) {
      setSelectedCustomers([]);
    } else {
      setSelectedCustomers(filteredCustomers.map(customer => customer.id));
    }
  };

  const handleBulkAction = (action: string) => {
    if (selectedCustomers.length === 0) return;
    
    switch (action) {
      case 'activate':
        onBulkStatusChange?.(selectedCustomers, 'active');
        break;
      case 'deactivate':
        onBulkStatusChange?.(selectedCustomers, 'inactive');
        break;
      case 'pending':
        onBulkStatusChange?.(selectedCustomers, 'pending');
        break;
    }
    setSelectedCustomers([]);
  };

  return (
    <div>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              Customers ({filteredCustomers.length} of {customers.length})
            </CardTitle>
            <div className="flex items-center gap-2">
              {onBulkImport && (
                <BulkImportDialog
                  type="customers"
                  onImport={onBulkImport}
                />
              )}
              
              {selectedCustomers.length > 0 && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      Bulk Actions ({selectedCustomers.length})
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => handleBulkAction('activate')}>
                      Set Active
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleBulkAction('deactivate')}>
                      Set Inactive
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleBulkAction('pending')}>
                      Set Pending
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Filter size={16} className="mr-2" />
                    Filters
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      Filter by Status
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent>
                      <DropdownMenuItem onClick={() => setStatusFilter('all')}>
                        All statuses
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => setStatusFilter('active')}>
                        Active
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setStatusFilter('pending')}>
                        Pending
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setStatusFilter('inactive')}>
                        Inactive
                      </DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>
                  
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      Filter by Partner
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent>
                      <DropdownMenuItem onClick={() => setPartnerFilter('all')}>
                        All partners
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setPartnerFilter('unassigned')}>
                        Unassigned
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {partners.map((partner) => (
                        <DropdownMenuItem key={partner.id} onClick={() => setPartnerFilter(partner.id)}>
                          {partner.name}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>

                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      Filter by Zone
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent>
                      <DropdownMenuItem onClick={() => setZoneFilter('all')}>
                        All zones
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => setZoneFilter('north')}>
                        North
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setZoneFilter('east')}>
                        East
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setZoneFilter('west')}>
                        West
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setZoneFilter('south')}>
                        South
                      </DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox 
                    checked={selectedCustomers.length === filteredCustomers.length && filteredCustomers.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Partner</TableHead>
                <TableHead>Zone</TableHead>
                <TableHead>Products</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.map((customer) => (
                <TableRow key={customer.id} className="hover:bg-muted/50">
                  <TableCell>
                    <Checkbox 
                      checked={selectedCustomers.includes(customer.id)}
                      onCheckedChange={() => handleSelectCustomer(customer.id)}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{customer.name}</TableCell>
                  <TableCell>{customer.company}</TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>{getPartnerName(customer.partnerId)}</TableCell>
                  <TableCell>
                    {customer.zone ? (
                      <Badge className={getZoneColor(customer.zone)}>
                        {customer.zone.charAt(0).toUpperCase() + customer.zone.slice(1)}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground">Not set</span>
                    )}
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {getProductNames(customer.productIds)}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(customer.status)}>
                      {customer.status}
                    </Badge>
                  </TableCell>
                  <TableCell>${customer.value.toLocaleString()}</TableCell>
                  <TableCell>{customer.createdAt.toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={customer.status === 'active'}
                        onCheckedChange={() => handleStatusToggle(customer.id, customer.status)}
                        disabled={customer.status === 'pending'}
                      />
                      <span className="text-xs text-muted-foreground">
                        {customer.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerTable;
