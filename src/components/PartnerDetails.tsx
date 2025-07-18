import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, CheckCircle, XCircle, User, Calendar, CreditCard, Package, Building, Filter } from 'lucide-react';
import { Partner, Customer, Product, User as UserType } from '../types';

interface PartnerDetailsProps {
  partner: Partner;
  customers: Customer[];
  products: Product[];
  users: UserType[];
  onBack: () => void;
}

const PartnerDetails = ({ partner, customers, products, users, onBack }: PartnerDetailsProps) => {
  const [processFilter, setProcessFilter] = useState<string[]>(['all']);
  const partnerCustomers = customers.filter(c => c.partnerId === partner.id);
  const assignedUsers = users.filter(u => partner.assignedUserIds?.includes(u.id));

  // Filter customers by process stage
  const filteredCustomers = partnerCustomers.filter(customer => {
    if (processFilter.includes('all')) return true;
    return processFilter.includes(customer.process);
  });

  // Calculate statistics
  const prospects = partnerCustomers.filter(c => ['prospect', 'demo', 'poc', 'negotiating'].includes(c.process));
  const purchased = partnerCustomers.filter(c => ['won', 'deployment'].includes(c.process));
  const lost = partnerCustomers.filter(c => c.process === 'lost');
  const conversionRate = partnerCustomers.length > 0 ? Math.round((purchased.length / partnerCustomers.length) * 100) : 0;

  // Individual stage counts for detailed filtering
  const stageCounts = {
    prospect: partnerCustomers.filter(c => c.process === 'prospect').length,
    demo: partnerCustomers.filter(c => c.process === 'demo').length,
    poc: partnerCustomers.filter(c => c.process === 'poc').length,
    negotiating: partnerCustomers.filter(c => c.process === 'negotiating').length,
    won: partnerCustomers.filter(c => c.process === 'won').length,
    deployment: partnerCustomers.filter(c => c.process === 'deployment').length,
    lost: partnerCustomers.filter(c => c.process === 'lost').length,
  };

  // Quick filter functions
  const setQuickFilter = (filterType: string) => {
    switch (filterType) {
      case 'all':
        setProcessFilter(['all']);
        break;
      case 'prospects':
        setProcessFilter(['prospect', 'demo', 'poc', 'negotiating']);
        break;
      case 'purchased':
        setProcessFilter(['won', 'deployment']);
        break;
      case 'lost':
        setProcessFilter(['lost']);
        break;
      case 'active-pipeline':
        setProcessFilter(['prospect', 'demo', 'poc', 'negotiating']);
        break;
      default:
        setProcessFilter([filterType]);
    }
  };

  const toggleStageFilter = (stage: string) => {
    if (processFilter.includes('all')) {
      setProcessFilter([stage]);
      return;
    }
    
    if (processFilter.includes(stage)) {
      const newFilter = processFilter.filter(f => f !== stage);
      setProcessFilter(newFilter.length === 0 ? ['all'] : newFilter);
    } else {
      setProcessFilter([...processFilter, stage]);
    }
  };

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

  const getProcessStageColor = (process: string) => {
    switch (process) {
      case 'prospect': return 'bg-yellow-100 text-yellow-800';
      case 'demo': return 'bg-blue-100 text-blue-800';
      case 'poc': return 'bg-indigo-100 text-indigo-800';
      case 'negotiating': return 'bg-orange-100 text-orange-800';
      case 'won': return 'bg-green-100 text-green-800';
      case 'deployment': return 'bg-emerald-100 text-emerald-800';
      case 'lost': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getProcessStageLabel = (process: string) => {
    switch (process) {
      case 'prospect': return 'Prospect';
      case 'demo': return 'Demo';
      case 'poc': return 'POC';
      case 'negotiating': return 'Negotiating';
      case 'won': return 'Won';
      case 'deployment': return 'Deployment';
      case 'lost': return 'Lost';
      default: return process;
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
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

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <User size={20} className="text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Active Prospects</p>
                <p className="font-medium">{prospects.length}</p>
                <p className="text-xs text-muted-foreground">In pipeline</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle size={20} className="text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Purchased</p>
                <p className="font-medium">{purchased.length}</p>
                <p className="text-xs text-muted-foreground">{conversionRate}% conversion</p>
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
          <div className="flex flex-col space-y-4">
            <div className="flex items-center justify-between">
              <CardTitle>
                Partner's Customers ({filteredCustomers.length} of {partnerCustomers.length})
              </CardTitle>
            </div>
            
            {/* Quick Filter Buttons */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant={processFilter.includes('all') ? 'default' : 'outline'}
                size="sm"
                onClick={() => setQuickFilter('all')}
              >
                All ({partnerCustomers.length})
              </Button>
              <Button
                variant={processFilter.length === 4 && processFilter.includes('prospect') && processFilter.includes('demo') && processFilter.includes('poc') && processFilter.includes('negotiating') ? 'default' : 'outline'}
                size="sm"
                onClick={() => setQuickFilter('prospects')}
              >
                All Prospects ({prospects.length})
              </Button>
              <Button
                variant={processFilter.length === 2 && processFilter.includes('won') && processFilter.includes('deployment') ? 'default' : 'outline'}
                size="sm"
                onClick={() => setQuickFilter('purchased')}
              >
                Purchased ({purchased.length})
              </Button>
              <Button
                variant={processFilter.length === 1 && processFilter.includes('lost') ? 'default' : 'outline'}
                size="sm"
                onClick={() => setQuickFilter('lost')}
              >
                Lost ({lost.length})
              </Button>
              <Button
                variant={processFilter.length === 4 && processFilter.includes('prospect') && processFilter.includes('demo') && processFilter.includes('poc') && processFilter.includes('negotiating') ? 'default' : 'outline'}
                size="sm"
                onClick={() => setQuickFilter('active-pipeline')}
              >
                Active Pipeline ({prospects.length})
              </Button>
            </div>

            {/* Individual Stage Filters */}
            <div className="flex flex-wrap gap-2">
              <span className="text-sm font-medium text-muted-foreground self-center">Individual Stages:</span>
              {Object.entries(stageCounts).map(([stage, count]) => (
                <Button
                  key={stage}
                  variant={processFilter.includes(stage) && !processFilter.includes('all') ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => toggleStageFilter(stage)}
                  className="gap-1"
                >
                  <Badge className={getProcessStageColor(stage)} variant="secondary">
                    {getProcessStageLabel(stage)}
                  </Badge>
                  ({count})
                </Button>
              ))}
            </div>

            {/* Active Filter Display */}
            {!processFilter.includes('all') && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Active filters:</span>
                <div className="flex gap-1">
                  {processFilter.map(stage => (
                    <Badge key={stage} className={getProcessStageColor(stage)} variant="secondary">
                      {getProcessStageLabel(stage)}
                    </Badge>
                  ))}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setProcessFilter(['all'])}
                  className="text-xs"
                >
                  Clear all
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer Name</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Process Stage</TableHead>
                <TableHead>Products</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="font-medium">{customer.name}</TableCell>
                  <TableCell>{customer.company}</TableCell>
                  <TableCell>
                    <Badge className={getProcessStageColor(customer.process)}>
                      {getProcessStageLabel(customer.process)}
                    </Badge>
                  </TableCell>
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
