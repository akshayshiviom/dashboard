
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Customer, Partner, Product } from '@/types';

interface Dashboard {
  id: string;
  name: string;
  description?: string;
  timeframe: 'monthly' | 'yearly' | 'custom';
  customDateRange?: {
    from: Date;
    to: Date;
  };
  widgets: {
    showStats: boolean;
    showChart: boolean;
    showRenewals: boolean;
    showCustomerTable: boolean;
  };
  filters: {
    customerStatus?: string[];
    partnerIds?: string[];
    productIds?: string[];
  };
}

interface DashboardEditDialogProps {
  dashboard: Dashboard;
  onSave: (updates: Partial<Dashboard>) => void;
  onCancel: () => void;
  customers: Customer[];
  partners: Partner[];
  products: Product[];
}

const DashboardEditDialog = ({ dashboard, onSave, onCancel, customers, partners, products }: DashboardEditDialogProps) => {
  const [formData, setFormData] = useState({
    name: dashboard.name,
    description: dashboard.description || '',
    widgets: { ...dashboard.widgets },
    filters: { ...dashboard.filters }
  });

  const handleSave = () => {
    onSave({
      name: formData.name,
      description: formData.description || undefined,
      widgets: formData.widgets,
      filters: formData.filters
    });
  };

  const handleWidgetChange = (widget: keyof Dashboard['widgets'], checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      widgets: {
        ...prev.widgets,
        [widget]: checked
      }
    }));
  };

  const handleFilterChange = (filterType: string, value: string, checked: boolean) => {
    setFormData(prev => {
      const currentFilter = prev.filters[filterType as keyof Dashboard['filters']] || [];
      const updatedFilter = checked 
        ? [...currentFilter, value]
        : currentFilter.filter(item => item !== value);
      
      return {
        ...prev,
        filters: {
          ...prev.filters,
          [filterType]: updatedFilter
        }
      };
    });
  };

  const customerStatuses = ['active', 'inactive', 'pending'];

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Dashboard</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="dashboard-name">Dashboard Name</Label>
                <Input
                  id="dashboard-name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="dashboard-description">Description</Label>
                <Textarea
                  id="dashboard-description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Optional description for this dashboard"
                />
              </div>
            </CardContent>
          </Card>

          {/* Widget Configuration */}
          <Card>
            <CardHeader>
              <CardTitle>Dashboard Widgets</CardTitle>
              <CardDescription>Choose which components to display on this dashboard</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="show-stats"
                  checked={formData.widgets.showStats}
                  onCheckedChange={(checked) => handleWidgetChange('showStats', checked as boolean)}
                />
                <Label htmlFor="show-stats">Dashboard Statistics</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="show-chart"
                  checked={formData.widgets.showChart}
                  onCheckedChange={(checked) => handleWidgetChange('showChart', checked as boolean)}
                />
                <Label htmlFor="show-chart">Customer Chart</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="show-renewals"
                  checked={formData.widgets.showRenewals}
                  onCheckedChange={(checked) => handleWidgetChange('showRenewals', checked as boolean)}
                />
                <Label htmlFor="show-renewals">Renewals Table</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="show-customer-table"
                  checked={formData.widgets.showCustomerTable}
                  onCheckedChange={(checked) => handleWidgetChange('showCustomerTable', checked as boolean)}
                />
                <Label htmlFor="show-customer-table">Customer Table</Label>
              </div>
            </CardContent>
          </Card>

          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Data Filters</CardTitle>
              <CardDescription>Filter data displayed on this dashboard</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Customer Status Filter */}
              <div>
                <Label className="text-sm font-medium">Customer Status</Label>
                <div className="mt-2 space-y-2">
                  {customerStatuses.map((status) => (
                    <div key={status} className="flex items-center space-x-2">
                      <Checkbox
                        id={`status-${status}`}
                        checked={formData.filters.customerStatus?.includes(status) || false}
                        onCheckedChange={(checked) => handleFilterChange('customerStatus', status, checked as boolean)}
                      />
                      <Label htmlFor={`status-${status}`} className="capitalize">{status}</Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Partner Filter */}
              <div>
                <Label className="text-sm font-medium">Partners</Label>
                <div className="mt-2 space-y-2 max-h-32 overflow-y-auto">
                  {partners.map((partner) => (
                    <div key={partner.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`partner-${partner.id}`}
                        checked={formData.filters.partnerIds?.includes(partner.id) || false}
                        onCheckedChange={(checked) => handleFilterChange('partnerIds', partner.id, checked as boolean)}
                      />
                      <Label htmlFor={`partner-${partner.id}`}>{partner.name}</Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Product Filter */}
              <div>
                <Label className="text-sm font-medium">Products</Label>
                <div className="mt-2 space-y-2 max-h-32 overflow-y-auto">
                  {products.map((product) => (
                    <div key={product.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`product-${product.id}`}
                        checked={formData.filters.productIds?.includes(product.id) || false}
                        onCheckedChange={(checked) => handleFilterChange('productIds', product.id, checked as boolean)}
                      />
                      <Label htmlFor={`product-${product.id}`}>{product.name}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DashboardEditDialog;
