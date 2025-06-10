import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, CheckCircle, XCircle, User, Calendar, CreditCard, Package, Building } from 'lucide-react';
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
  const assignedUsers = users.filter(u => partner.assignedUserIds?.includes(u.id));

  const getProductName = (productId: string) => {
    return products.find(p => p.id === productId)?.name || 'Unknown Product';
  };

  const getPaymentTermsColor = (terms: string) => {
    switch (terms) {
      case 'annual-in-advance': return 'bg-green-100 text-green-800';
      case 'monthly': return 'bg-blue-100 text-blue-800';
      case 'quarterly': return 'bg-cyan-100 text-cyan-800';
      case 'half-yearly': return 'bg-teal-100 text-teal-800';
      case 'net-15': return 'bg-lime-100 text-lime-800';
      case 'net-30': return 'bg-yellow-100 text-yellow-800';
      case 'net-45': return 'bg-amber-100 text-amber-800';
      case 'net-60': return 'bg-orange-100 text-orange-800';
      case 'net-90': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentTermsLabel = (terms: string) => {
    switch (terms) {
      case 'annual-in-advance': return 'Annual in Advance';
      case 'monthly': return 'Monthly';
      case 'quarterly': return 'Quarterly';
      case 'half-yearly': return 'Half Yearly';
      case 'net-15': return 'Net 15';
      case 'net-30': return 'Net 30';
      case 'net-45': return 'Net 45';
      case 'net-60': return 'Net 60';
      case 'net-90': return 'Net 90';
      default: return terms;
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

  const getIdentityLabel = (identity: string) => {
    switch (identity) {
      case 'web-app-developer': return 'Web/App Developer';
      case 'system-integrator': return 'System Integrator';
      case 'managed-service-provider': return 'Managed Service Provider';
      case 'digital-marketer': return 'Digital Marketer';
      case 'cyber-security': return 'Cyber Security';
      case 'cloud-hosting': return 'Cloud Hosting';
      case 'web-hosting': return 'Web Hosting';
      case 'hardware': return 'Hardware';
      case 'cloud-service-provider': return 'Cloud Service Provider';
      case 'microsoft-partner': return 'Microsoft Partner';
      case 'aws-partner': return 'AWS Partner';
      case 'it-consulting': return 'IT Consulting';
      case 'freelance': return 'Freelance';
      default: return identity;
    }
  };

  const getIdentityColor = (identity: string) => {
    switch (identity) {
      case 'web-app-developer': return 'bg-blue-100 text-blue-800';
      case 'system-integrator': return 'bg-green-100 text-green-800';
      case 'managed-service-provider': return 'bg-purple-100 text-purple-800';
      case 'digital-marketer': return 'bg-orange-100 text-orange-800';
      case 'cyber-security': return 'bg-red-100 text-red-800';
      case 'cloud-hosting': return 'bg-cyan-100 text-cyan-800';
      case 'web-hosting': return 'bg-indigo-100 text-indigo-800';
      case 'hardware': return 'bg-gray-100 text-gray-800';
      case 'cloud-service-provider': return 'bg-sky-100 text-sky-800';
      case 'microsoft-partner': return 'bg-blue-100 text-blue-800';
      case 'aws-partner': return 'bg-yellow-100 text-yellow-800';
      case 'it-consulting': return 'bg-emerald-100 text-emerald-800';
      case 'freelance': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAssignedUserNames = (userIds?: string[]) => {
    if (!userIds || userIds.length === 0) return 'Unassigned';
    return userIds
      .map(id => users.find(u => u.id === id)?.name)
      .filter(Boolean)
      .join(', ');
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
          <Badge className={getIdentityColor(partner.identity)} variant="secondary">
            {getIdentityLabel(partner.identity)}
          </Badge>
        </div>
      </div>

      {/* Partner Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Building size={20} className="text-indigo-600" />
              <div>
                <p className="text-sm text-muted-foreground">Partner Identity</p>
                <p className="font-medium">{getIdentityLabel(partner.identity)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

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
                  {getPaymentTermsLabel(partner.paymentTerms)}
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
                <p className="text-sm text-muted-foreground">Assigned Users</p>
                <p className="font-medium">{getAssignedUserNames(partner.assignedUserIds)}</p>
                {assignedUsers.length > 0 && (
                  <p className="text-xs text-muted-foreground">{assignedUsers.length} user(s)</p>
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
