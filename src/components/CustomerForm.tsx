
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Customer, Partner, Product } from '../types';

interface CustomerFormProps {
  partners: Partner[];
  products: Product[];
  onCustomerAdd: (customer: Customer) => void;
}

const CustomerForm = ({ partners, products, onCustomerAdd }: CustomerFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    partnerId: '',
    value: '',
    zone: '',
  });
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  const zones = [
    { value: 'north', label: 'North' },
    { value: 'east', label: 'East' },
    { value: 'west', label: 'West' },
    { value: 'south', label: 'South' },
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
    
    if (!formData.name || !formData.email || !formData.company) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const newCustomer: Customer = {
      id: Date.now().toString(),
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      company: formData.company,
      status: 'pending',
      partnerId: formData.partnerId || undefined,
      productIds: selectedProducts.length > 0 ? selectedProducts : undefined,
      createdAt: new Date(),
      value: parseInt(formData.value) || 0,
      zone: formData.zone as 'north' | 'east' | 'west' | 'south' || undefined,
    };

    onCustomerAdd(newCustomer);
    
    setFormData({
      name: '',
      email: '',
      phone: '',
      company: '',
      partnerId: '',
      value: '',
      zone: '',
    });
    setSelectedProducts([]);

    toast({
      title: "Success",
      description: "Customer added successfully!",
    });
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Add New Customer</CardTitle>
      </CardHeader>
      <CardContent>
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="partner">Assign Partner</Label>
              <Select value={formData.partnerId} onValueChange={(value) => setFormData({ ...formData, partnerId: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a partner" />
                </SelectTrigger>
                <SelectContent>
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
                  {zones.map((zone) => (
                    <SelectItem key={zone.value} value={zone.value}>
                      {zone.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="value">Expected Value ($)</Label>
              <Input
                id="value"
                type="number"
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                placeholder="Enter expected value"
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

          <Button type="submit" className="w-full">
            Add Customer
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CustomerForm;
