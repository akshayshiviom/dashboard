
import { useState, useMemo } from 'react';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Customer, Partner, Product } from '../types';
import CustomerTableHeader from './CustomerTableHeader';
import CustomerTableFilters from './CustomerTableFilters';
import CustomerTableRow from './CustomerTableRow';

interface CustomerTableProps {
  customers: Customer[];
  partners: Partner[];
  products: Product[];
  onStatusChange?: (customerId: string, newStatus: 'active' | 'inactive' | 'pending') => void;
  onBulkStatusChange?: (customerIds: string[], newStatus: 'active' | 'inactive' | 'pending') => void;
  onBulkImport?: (customers: Customer[]) => void;
}

const CustomerTable = ({ 
  customers, 
  partners, 
  products, 
  onStatusChange, 
  onBulkStatusChange, 
  onBulkImport 
}: CustomerTableProps) => {
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
          <CustomerTableHeader
            filteredCount={filteredCustomers.length}
            totalCount={customers.length}
            selectedCount={selectedCustomers.length}
            onBulkImport={onBulkImport}
            onBulkAction={handleBulkAction}
          />
          <div className="flex items-center justify-end">
            <CustomerTableFilters
              partners={partners}
              onStatusFilter={setStatusFilter}
              onPartnerFilter={setPartnerFilter}
              onZoneFilter={setZoneFilter}
            />
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
                <CustomerTableRow
                  key={customer.id}
                  customer={customer}
                  partners={partners}
                  products={products}
                  isSelected={selectedCustomers.includes(customer.id)}
                  onSelect={handleSelectCustomer}
                  onStatusToggle={handleStatusToggle}
                />
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerTable;
