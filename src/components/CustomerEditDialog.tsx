
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Customer, Partner, Product } from '../types';

interface CustomerEditDialogProps {
  customer: Customer | null;
  partners: Partner[];
  products: Product[];
  isOpen: boolean;
  onClose: () => void;
  onSave: (customerId: string, updates: Partial<Customer>) => void;
}

const CustomerEditDialog = ({ 
  customer, 
  partners, 
  products, 
  isOpen, 
  onClose, 
  onSave 
}: CustomerEditDialogProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    partnerId: '',
    value: '',
    zone: '',
    status: 'active' as 'active' | 'inactive' | 'pending',
    process: 'prospect' as 'prospect' | 'demo' | 'poc' | 'negotiating' | 'lost' | 'won' | 'deployment'
  });
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  useEffect(() => {
    if (customer) {
      setFormData({
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        company: customer.company,
        partnerId: customer.partnerId || '',
        value: customer.value.toString(),
        zone: customer.zone || '',
        status: customer.status,
        process: customer.process || 'prospect'
      });
      setSelectedProducts(customer.productIds || []);
    }
  }, [customer]);

  const zones = [
    { value: 'north', label: 'North' },
    { value: 'east', label: 'East' },
    { value: 'west', label: 'West' },
    { value: 'south', label: 'South' },
  ];

  const processOptions = [
    { value: 'prospect', label: 'Prospect' },
    { value: 'demo', label: 'Demo' },
    { value: 'poc', label: 'POC' },
    { value: 'negotiating', label: 'Negotiating' },
    { value: 'lost', label: 'Lost' },
    { value: 'won', label: 'Won' },
    { value: 'deployment', label: 'Deployment' },
  ];

  const handleProductChange = (productId: string, checked: boolean) => {
    setSelectedProducts(prev => 
      checked 
        ? [...prev, productId]
        : prev.filter(id => id !== productId)
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!customer || !formData.name || !formData.email || !formData.company) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const updates: Partial<Customer> = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      company: formData.company,
      status: formData.status,
      process: formData.process,
      partnerId: formData.partnerId || undefined,
      productIds: selectedProducts.length > 0 ? selectedProducts : undefined,
      value: parseInt(formData.value) || 0,
      zone: formData.zone as 'north' | 'east' | 'west' | 'south' || undefined,
    };

    onSave(customer.id, updates);
    onClose();

    toast({
      title: "Success",
      description: "Customer updated successfully!",
    });
  };

  if (!customer) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Customer</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter customer name"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Enter email address"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="Enter phone number"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="company">Company *</Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                placeholder="Enter company name"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value as 'active' | 'inactive' | 'pending' })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="process">Process</Label>
              <Select value={formData.process} onValueChange={(value) => setFormData({ ...formData, process: value as any })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select process" />
                </SelectTrigger>
                <SelectContent>
                  {processOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="partner">Assign Partner</Label>
              <Select value={formData.partnerId} onValueChange={(value) => setFormData({ ...formData, partnerId: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a partner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">No Partner</SelectItem>
                  {partners.map((partner) => (
                    <SelectItem key={partner.id} value={partner.id}>
                      {partner.name} - {partner.company}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="zone">Zone</Label>
              <Select value={formData.zone} onValueChange={(value) => setFormData({ ...formData, zone: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select zone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">No Zone</SelectItem>
                  {zones.map((zone) => (
                    <SelectItem key={zone.value} value={zone.value}>
                      {zone.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="value">Value (₹)</Label>
              <Input
                id="value"
                type="number"
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                placeholder="Enter value"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Products</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-40 overflow-y-auto border rounded-md p-3">
              {products.map((product) => (
                <div key={product.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={product.id}
                    checked={selectedProducts.includes(product.id)}
                    onCheckedChange={(checked) => handleProductChange(product.id, checked as boolean)}
                  />
                  <label
                    htmlFor={product.id}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {product.name}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CustomerEditDialog;
