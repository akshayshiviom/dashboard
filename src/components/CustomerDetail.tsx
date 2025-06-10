
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Mail, Building, MapPin, User, Package } from 'lucide-react';
import { Customer, Partner, Product } from '../types';

interface CustomerDetailProps {
  customer: Customer;
  partners: Partner[];
  products: Product[];
  onBack: () => void;
  onCustomerUpdate?: (customerId: string, updates: Partial<Customer>) => void;
}

const CustomerDetail = ({ customer, partners, products, onBack, onCustomerUpdate }: CustomerDetailProps) => {
  const getPartnerName = (partnerId?: string) => {
    const partner = partners.find(p => p.id === partnerId);
    return partner ? partner.name : 'Unassigned';
  };

  const getProductNames = (productIds?: string[]) => {
    if (!productIds || productIds.length === 0) return [];
    return productIds
      .map(id => products.find(p => p.id === id))
      .filter(Boolean) as Product[];
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

  const customerProducts = getProductNames(customer.productIds);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft size={16} className="mr-2" />
          Back to Customer Management
        </Button>
      </div>

      {/* Customer Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl">{customer.name}</CardTitle>
              <div className="flex items-center gap-4 mt-2 text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Mail size={16} />
                  <span>{customer.email}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Building size={16} />
                  <span>{customer.company}</span>
                </div>
                {customer.zone && (
                  <div className="flex items-center gap-1">
                    <MapPin size={16} />
                    <Badge className={getZoneColor(customer.zone)}>
                      {customer.zone.charAt(0).toUpperCase() + customer.zone.slice(1)}
                    </Badge>
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <Badge className={getStatusColor(customer.status)}>
                {customer.status}
              </Badge>
              {customer.process && (
                <Badge className={getProcessColor(customer.process)}>
                  {customer.process.charAt(0).toUpperCase() + customer.process.slice(1)}
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h4 className="font-semibold text-sm text-muted-foreground">Partner</h4>
              <p className="text-lg">{getPartnerName(customer.partnerId)}</p>
            </div>
            <div>
              <h4 className="font-semibold text-sm text-muted-foreground">Customer Value</h4>
              <p className="text-lg font-bold">₹{customer.value.toLocaleString('en-IN')}</p>
            </div>
            <div>
              <h4 className="font-semibold text-sm text-muted-foreground">Created</h4>
              <p className="text-lg">{customer.createdAt.toLocaleDateString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Products ({customerProducts.length})</h2>
        </div>
        {customerProducts.length === 0 ? (
          <Card>
            <CardContent className="flex items-center justify-center py-8">
              <p className="text-muted-foreground">No products assigned to this customer.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {customerProducts.map((product) => (
              <Card key={product.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{product.name}</CardTitle>
                  <div className="flex items-center gap-2">
                    <Package size={16} className="text-muted-foreground" />
                    <Badge variant="outline">{product.category}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{product.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerDetail;
