
import { useState, useMemo } from 'react';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Customer, Partner, Product, User } from '../types';
import CustomerTableHeader from './CustomerTableHeader';
import CustomerTableFilters from './CustomerTableFilters';
import CustomerTableRow from './CustomerTableRow';

interface CustomerTableProps {
  customers: Customer[];
  partners: Partner[];
  products: Product[];
  users: User[];
  onStatusChange?: (customerId: string, newStatus: 'active' | 'inactive' | 'pending') => void;
  onBulkStatusChange?: (customerIds: string[], newStatus: 'active' | 'inactive' | 'pending') => void;
  onBulkImport?: (customers: Customer[]) => void;
}

const CustomerTable = ({ 
  customers, 
  partners, 
  products, 
  users,
  onStatusChange, 
  onBulkStatusChange, 
  onBulkImport 
}: CustomerTableProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [processFilter, setProcessFilter] = useState('all');
  const [partnerFilter, setPartnerFilter] = useState('all');
  const [valueFilter, setValueFilter] = useState(0);
  const [zoneFilter, setZoneFilter] = useState('all');
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);

  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) => {
      const searchMatch = searchTerm === '' || 
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.company.toLowerCase().includes(searchTerm.toLowerCase());
      
      const statusMatch = statusFilter === 'all' || customer.status === statusFilter;
      const processMatch = processFilter === 'all' || customer.process === processFilter;
      const partnerMatch = 
        partnerFilter === 'all' || 
        (partnerFilter === 'unassigned' && !customer.partnerId) ||
        customer.partnerId === partnerFilter;
      const valueMatch = customer.value >= valueFilter;
      const zoneMatch = zoneFilter === 'all' || customer.zone === zoneFilter;
      
      return searchMatch && statusMatch && processMatch && partnerMatch && valueMatch && zoneMatch;
    });
  }, [customers, searchTerm, statusFilter, processFilter, partnerFilter, valueFilter, zoneFilter]);

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
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1 w-full md:w-auto">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search customers by name, email, or company..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <CustomerTableFilters
              partners={partners}
              products={products}
              onStatusFilter={setStatusFilter}
              onProcessFilter={setProcessFilter}
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
                  users={users}
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
