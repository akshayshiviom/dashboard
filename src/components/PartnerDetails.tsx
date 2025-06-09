
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, CheckCircle, XCircle, User, Calendar, CreditCard, Package } from 'lucide-react';
import { Partner, Customer, Product, User as UserType } from '../types';

interface PartnerDetailsProps {
  partner: Partner;
  customers: Customer[];
  products: Product[];
  users: UserType[];
  onBack: () => void;
}

const PartnerDetails = ({ partner, customers, products, users, onBack }: PartnerDetailsProps) => {
  const partnerCustomers = customers.filter(c => c.partnerId === partner.id);
  const assignedEmployee = users.find(u => u.id === partner.assignedEmployeeId);

  const getProductName = (productId: string) => {
    return products.find(p => p.id === productId)?.name || 'Unknown Product';
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

  const getCustomerStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onBack} className="gap-2">
          <ArrowLeft size={16} />
          Back to Partners
        </Button>
        <div>
          <h2 className="text-2xl font-bold">{partner.name}</h2>
          <p className="text-muted-foreground">{partner.company}</p>
        </div>
      </div>

      {/* Partner Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle size={20} className={partner.agreementSigned ? "text-green-600" : "text-red-600"} />
              <div>
                <p className="text-sm text-muted-foreground">Agreement Status</p>
                <p className="font-medium">{partner.agreementSigned ? 'Signed' : 'Pending'}</p>
                {partner.agreementDate && (
                  <p className="text-xs text-muted-foreground">
                    {partner.agreementDate.toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CreditCard size={20} className="text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Payment Terms</p>
                <Badge className={getPaymentTermsColor(partner.paymentTerms)}>
                  {partner.paymentTerms.toUpperCase()}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <User size={20} className="text-purple-600" />
              <div>
                <p className="text-sm text-muted-foreground">Assigned Employee</p>
                <p className="font-medium">{assignedEmployee?.name || 'Unassigned'}</p>
                {assignedEmployee && (
                  <p className="text-xs text-muted-foreground">{assignedEmployee.email}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Package size={20} className="text-orange-600" />
              <div>
                <p className="text-sm text-muted-foreground">Product Types</p>
                <p className="font-medium">{partner.productTypes.length}</p>
                <p className="text-xs text-muted-foreground">Categories</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Product Types */}
      <Card>
        <CardHeader>
          <CardTitle>Product Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {partner.productTypes.map((type, index) => (
              <Badge key={index} variant="secondary">
                {type}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Partner's Customers */}
      <Card>
        <CardHeader>
          <CardTitle>Partner's Customers ({partnerCustomers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer Name</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Products</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {partnerCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="font-medium">{customer.name}</TableCell>
                  <TableCell>{customer.company}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {customer.productIds?.map((productId) => (
                        <Badge key={productId} variant="outline" className="text-xs">
                          {getProductName(productId)}
                        </Badge>
                      )) || 'None'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getCustomerStatusColor(customer.status)}>
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

export default PartnerDetails;
