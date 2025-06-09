
import { useState, useMemo } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, CheckCircle, XCircle } from 'lucide-react';
import { Partner, Customer, Product, User } from '../types';
import PartnerFilters from './PartnerFilters';
import PartnerDetails from './PartnerDetails';

interface PartnerTableProps {
  partners: Partner[];
  customers: Customer[];
  products: Product[];
  users: User[];
}

const PartnerTable = ({ partners, customers, products, users }: PartnerTableProps) => {
  const [statusFilter, setStatusFilter] = useState('all');
  const [customersFilter, setCustomersFilter] = useState(0);
  const [revenueFilter, setRevenueFilter] = useState(0);
  const [specializationFilter, setSpecializationFilter] = useState('all');
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);

  const filteredPartners = useMemo(() => {
    return partners.filter((partner) => {
      const statusMatch = statusFilter === 'all' || partner.status === statusFilter;
      const customersMatch = partner.customersCount >= customersFilter;
      const revenueMatch = partner.totalValue >= revenueFilter;
      const specializationMatch = specializationFilter === 'all' || partner.specialization === specializationFilter;
      
      return statusMatch && customersMatch && revenueMatch && specializationMatch;
    });
  }, [partners, statusFilter, customersFilter, revenueFilter, specializationFilter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentTermsColor = (terms: string) => {
    switch (terms) {
      case 'prepaid': return 'bg-green-100 text-green-800';
      case 'monthly': return 'bg-blue-100 text-blue-800';
      case 'net-30': return 'bg-yellow-100 text-yellow-800';
      case 'net-60': return 'bg-orange-100 text-orange-800';
      case 'net-90': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getEmployeeName = (employeeId?: string) => {
    const employee = users.find(u => u.id === employeeId);
    return employee ? employee.name : 'Unassigned';
  };

  if (selectedPartner) {
    return (
      <PartnerDetails
        partner={selectedPartner}
        customers={customers}
        products={products}
        users={users}
        onBack={() => setSelectedPartner(null)}
      />
    );
  }

  return (
    <div>
      <PartnerFilters
        onStatusFilter={setStatusFilter}
        onCustomersFilter={setCustomersFilter}
        onRevenueFilter={setRevenueFilter}
        onSpecializationFilter={setSpecializationFilter}
      />
      <Card>
        <CardHeader>
          <CardTitle>
            Partners Overview ({filteredPartners.length} of {partners.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Agreement</TableHead>
                <TableHead>Payment Terms</TableHead>
                <TableHead>Product Types</TableHead>
                <TableHead>Assigned Employee</TableHead>
                <TableHead>Customers</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPartners.map((partner) => (
                <TableRow key={partner.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">{partner.name}</TableCell>
                  <TableCell>{partner.company}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {partner.agreementSigned ? (
                        <CheckCircle size={16} className="text-green-600" />
                      ) : (
                        <XCircle size={16} className="text-red-600" />
                      )}
                      <span className="text-sm">
                        {partner.agreementSigned ? 'Signed' : 'Pending'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getPaymentTermsColor(partner.paymentTerms)}>
                      {partner.paymentTerms.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-32">
                      <div className="flex flex-wrap gap-1">
                        {partner.productTypes.slice(0, 2).map((type, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {type}
                          </Badge>
                        ))}
                        {partner.productTypes.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{partner.productTypes.length - 2}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getEmployeeName(partner.assignedEmployeeId)}</TableCell>
                  <TableCell>{partner.customersCount}</TableCell>
                  <TableCell>${partner.totalValue.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(partner.status)}>
                      {partner.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedPartner(partner)}
                      className="gap-2"
                    >
                      <Eye size={14} />
                      View Details
                    </Button>
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

export default PartnerTable;
