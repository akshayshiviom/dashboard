
import { useState, useMemo } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger } from '@/components/ui/dropdown-menu';
import { Filter } from 'lucide-react';
import { Customer, Partner, Product } from '../types';

interface CustomerTableProps {
  customers: Customer[];
  partners: Partner[];
  products: Product[];
}

const CustomerTable = ({ customers, partners, products }: CustomerTableProps) => {
  const [statusFilter, setStatusFilter] = useState('all');
  const [partnerFilter, setPartnerFilter] = useState('all');
  const [valueFilter, setValueFilter] = useState(0);
  const [zoneFilter, setZoneFilter] = useState('all');

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

  return (
    <div>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              Customers ({filteredCustomers.length} of {customers.length})
            </CardTitle>
            <div className="flex items-center gap-2">
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
                <TableHead>Name</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Partner</TableHead>
                <TableHead>Zone</TableHead>
                <TableHead>Products</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.map((customer) => (
                <TableRow key={customer.id} className="hover:bg-muted/50">
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
