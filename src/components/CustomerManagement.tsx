
import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Search, MoreHorizontal, UserPlus, Download, Upload } from 'lucide-react';
import { Customer, Partner, Product } from '../types';
import CustomerEditDialog from './CustomerEditDialog';
import CustomerTableFilters from './CustomerTableFilters';

interface CustomerManagementProps {
  customers: Customer[];
  partners: Partner[];
  products: Product[];
  onCustomerUpdate?: (customerId: string, updates: Partial<Customer>) => void;
  onBulkAction?: (customerIds: string[], action: string) => void;
}

const CustomerManagement = ({ 
  customers, 
  partners, 
  products, 
  onCustomerUpdate, 
  onBulkAction 
}: CustomerManagementProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [processFilter, setProcessFilter] = useState('all');
  const [partnerFilter, setPartnerFilter] = useState('all');
  const [zoneFilter, setZoneFilter] = useState('all');
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const filteredCustomers = useMemo(() => {
    return customers.filter(customer => {
      const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           customer.company.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;
      const matchesProcess = processFilter === 'all' || customer.process === processFilter;
      const matchesPartner = partnerFilter === 'all' || 
                            (partnerFilter === 'unassigned' && !customer.partnerId) ||
                            customer.partnerId === partnerFilter;
      const matchesZone = zoneFilter === 'all' || customer.zone === zoneFilter;

      return matchesSearch && matchesStatus && matchesProcess && matchesPartner && matchesZone;
    });
  }, [customers, searchTerm, statusFilter, processFilter, partnerFilter, zoneFilter]);

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

  const handleStatusToggle = (customerId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    onCustomerUpdate?.(customerId, { status: newStatus as 'active' | 'inactive' });
  };

  const getPartnerName = (partnerId?: string) => {
    const partner = partners.find(p => p.id === partnerId);
    return partner ? partner.name : 'Unassigned';
  };

  const getProductNames = (productIds?: string[]) => {
    if (!productIds || productIds.length === 0) return 'None';
    return productIds
      .map(id => products.find(p => p.id === id)?.name)
      .filter(Boolean)
      .slice(0, 2)
      .join(', ') + (productIds.length > 2 ? ` +${productIds.length - 2}` : '');
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

  const getProcessColor = (process?: string) => {
    switch (process) {
      case 'prospect': return 'bg-gray-100 text-gray-800';
      case 'demo': return 'bg-blue-100 text-blue-800';
      case 'poc': return 'bg-cyan-100 text-cyan-800';
      case 'negotiating': return 'bg-yellow-100 text-yellow-800';
      case 'won': return 'bg-green-100 text-green-800';
      case 'lost': return 'bg-red-100 text-red-800';
      case 'deployment': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const stats = {
    total: customers.length,
    active: customers.filter(c => c.status === 'active').length,
    pending: customers.filter(c => c.status === 'pending').length,
    inactive: customers.filter(c => c.status === 'inactive').length,
    totalValue: customers.reduce((sum, customer) => sum + customer.value, 0),
    prospect: customers.filter(c => c.process === 'prospect').length,
    demo: customers.filter(c => c.process === 'demo').length,
    poc: customers.filter(c => c.process === 'poc').length,
    negotiating: customers.filter(c => c.process === 'negotiating').length,
    won: customers.filter(c => c.process === 'won').length,
    deployment: customers.filter(c => c.process === 'deployment').length
  };

  const handleEditCustomer = (customer: Customer) => {
    setEditingCustomer(customer);
    setIsEditDialogOpen(true);
  };

  const handleSaveCustomer = (customerId: string, updates: Partial<Customer>) => {
    onCustomerUpdate?.(customerId, updates);
    setIsEditDialogOpen(false);
    setEditingCustomer(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Customer Management</h2>
          <p className="text-muted-foreground">Manage your partner customers and relationships</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download size={16} className="mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Upload size={16} className="mr-2" />
            Import
          </Button>
          <Button size="sm">
            <UserPlus size={16} className="mr-2" />
            Add Customer
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-sm text-muted-foreground">Total Customers</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
            <p className="text-sm text-muted-foreground">Active</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            <p className="text-sm text-muted-foreground">Pending</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">{stats.inactive}</div>
            <p className="text-sm text-muted-foreground">Inactive</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">₹{stats.totalValue.toLocaleString('en-IN')}</div>
            <p className="text-sm text-muted-foreground">Total Value</p>
          </CardContent>
        </Card>
      </div>

      {/* Process Stats */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-3">
            <div className="text-lg font-bold text-gray-600">{stats.prospect}</div>
            <p className="text-xs text-muted-foreground">Prospect</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3">
            <div className="text-lg font-bold text-blue-600">{stats.demo}</div>
            <p className="text-xs text-muted-foreground">Demo</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3">
            <div className="text-lg font-bold text-cyan-600">{stats.poc}</div>
            <p className="text-xs text-muted-foreground">POC</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3">
            <div className="text-lg font-bold text-yellow-600">{stats.negotiating}</div>
            <p className="text-xs text-muted-foreground">Negotiating</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3">
            <div className="text-lg font-bold text-green-600">{stats.won}</div>
            <p className="text-xs text-muted-foreground">Won</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3">
            <div className="text-lg font-bold text-purple-600">{stats.deployment}</div>
            <p className="text-xs text-muted-foreground">Deployment</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search customers..."
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
        </CardContent>
      </Card>

      {/* Customer Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              Customers ({filteredCustomers.length} of {customers.length})
            </CardTitle>
            {selectedCustomers.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {selectedCustomers.length} selected
                </span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      Bulk Actions
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => onBulkAction?.(selectedCustomers, 'activate')}>
                      Set Active
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onBulkAction?.(selectedCustomers, 'deactivate')}>
                      Set Inactive
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onBulkAction?.(selectedCustomers, 'pending')}>
                      Set Pending
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
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
                <TableHead>Customer</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Partner</TableHead>
                <TableHead>Zone</TableHead>
                <TableHead>Products</TableHead>
                <TableHead>Process</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>
                    <Checkbox 
                      checked={selectedCustomers.includes(customer.id)}
                      onCheckedChange={() => handleSelectCustomer(customer.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{customer.name}</div>
                      <div className="text-sm text-muted-foreground">{customer.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>{customer.company}</TableCell>
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
                    {customer.process ? (
                      <Badge className={getProcessColor(customer.process)}>
                        {customer.process.charAt(0).toUpperCase() + customer.process.slice(1)}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground">Not set</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(customer.status)}>
                      {customer.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">
                    ₹{customer.value.toLocaleString('en-IN')}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={customer.status === 'active'}
                        onCheckedChange={() => handleStatusToggle(customer.id, customer.status)}
                        disabled={customer.status === 'pending'}
                      />
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal size={16} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => handleEditCustomer(customer)}>
                            Edit Customer
                          </DropdownMenuItem>
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Assign Partner</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            Delete Customer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <CustomerEditDialog
        customer={editingCustomer}
        partners={partners}
        products={products}
        isOpen={isEditDialogOpen}
        onClose={() => {
          setIsEditDialogOpen(false);
          setEditingCustomer(null);
        }}
        onSave={handleSaveCustomer}
      />
    </div>
  );
};

export default CustomerManagement;
