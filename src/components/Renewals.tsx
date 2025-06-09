import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, AlertTriangle, CheckCircle, Clock, XCircle, Phone, Mail } from 'lucide-react';
import { Renewal, Customer, Partner, Product, User } from '../types';
import RenewalEmailDialog from './RenewalEmailDialog';

interface RenewalsProps {
  renewals: Renewal[];
  customers: Customer[];
  partners: Partner[];
  products: Product[];
  users?: User[];
}

const Renewals = ({ renewals, customers, partners, products, users = [] }: RenewalsProps) => {
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredRenewals = useMemo(() => {
    return renewals.filter(renewal => 
      statusFilter === 'all' || renewal.status === statusFilter
    );
  }, [renewals, statusFilter]);

  const getCustomerName = (customerId: string) => {
    const customer = customers.find(c => c.id === customerId);
    return customer ? customer.name : 'Unknown Customer';
  };

  const getCustomer = (customerId: string) => {
    return customers.find(c => c.id === customerId);
  };

  const getPartnerName = (partnerId: string) => {
    const partner = partners.find(p => p.id === partnerId);
    return partner ? partner.name : 'Unknown Partner';
  };

  const getPartner = (partnerId: string) => {
    return partners.find(p => p.id === partnerId);
  };

  const getProductName = (productId: string) => {
    const product = products.find(p => p.id === productId);
    return product ? product.name : 'Unknown Product';
  };

  const getAssignedEmployee = (partnerId: string) => {
    const partner = partners.find(p => p.id === partnerId);
    if (partner?.assignedEmployeeId) {
      return users.find(u => u.id === partner.assignedEmployeeId);
    }
    return undefined;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'due': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      case 'renewed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'upcoming': return <Clock size={16} className="text-blue-600" />;
      case 'due': return <AlertTriangle size={16} className="text-yellow-600" />;
      case 'overdue': return <XCircle size={16} className="text-red-600" />;
      case 'renewed': return <CheckCircle size={16} className="text-green-600" />;
      case 'cancelled': return <XCircle size={16} className="text-gray-600" />;
      default: return <Clock size={16} className="text-gray-600" />;
    }
  };

  const getDaysUntilRenewal = (renewalDate: Date) => {
    const today = new Date();
    const diffTime = renewalDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const totalValue = filteredRenewals.reduce((sum, renewal) => sum + renewal.contractValue, 0);
  const urgentRenewals = renewals.filter(r => r.status === 'due' || r.status === 'overdue').length;

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calendar size={20} className="text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total Renewals</p>
                <p className="text-2xl font-bold">{renewals.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle size={20} className="text-red-600" />
              <div>
                <p className="text-sm text-muted-foreground">Urgent</p>
                <p className="text-2xl font-bold">{urgentRenewals}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle size={20} className="text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Renewed</p>
                <p className="text-2xl font-bold">{renewals.filter(r => r.status === 'renewed').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="text-purple-600">$</div>
              <div>
                <p className="text-sm text-muted-foreground">Total Value</p>
                <p className="text-2xl font-bold">${totalValue.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Table */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Renewal Management</CardTitle>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="upcoming">Upcoming</SelectItem>
                <SelectItem value="due">Due</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
                <SelectItem value="renewed">Renewed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Partner</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Renewal Date</TableHead>
                <TableHead>Days Left</TableHead>
                <TableHead>Contract Value</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Contact</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRenewals.map((renewal) => {
                const daysLeft = getDaysUntilRenewal(renewal.renewalDate);
                const customer = getCustomer(renewal.customerId);
                const partner = getPartner(renewal.partnerId);
                const assignedEmployee = getAssignedEmployee(renewal.partnerId);
                
                return (
                  <TableRow key={renewal.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">
                      {getCustomerName(renewal.customerId)}
                    </TableCell>
                    <TableCell>{getPartnerName(renewal.partnerId)}</TableCell>
                    <TableCell>{getProductName(renewal.productId)}</TableCell>
                    <TableCell>{renewal.renewalDate.toLocaleDateString()}</TableCell>
                    <TableCell>
                      <span className={`font-medium ${
                        daysLeft < 0 ? 'text-red-600' : 
                        daysLeft <= 30 ? 'text-yellow-600' : 
                        'text-green-600'
                      }`}>
                        {daysLeft < 0 ? `${Math.abs(daysLeft)} days overdue` : 
                         daysLeft === 0 ? 'Due today' : 
                         `${daysLeft} days`}
                      </span>
                    </TableCell>
                    <TableCell>${renewal.contractValue.toLocaleString()}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(renewal.status)}
                        <Badge className={getStatusColor(renewal.status)}>
                          {renewal.status}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      {renewal.lastContactDate ? 
                        renewal.lastContactDate.toLocaleDateString() : 
                        'No contact'
                      }
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="outline" size="sm" className="gap-1">
                          <Phone size={14} />
                          Contact
                        </Button>
                        {customer && partner && (
                          <RenewalEmailDialog
                            renewal={renewal}
                            customer={customer}
                            partner={partner}
                            assignedEmployee={assignedEmployee}
                          >
                            <Button variant="outline" size="sm" className="gap-1">
                              <Mail size={14} />
                              Email
                            </Button>
                          </RenewalEmailDialog>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Renewals;
