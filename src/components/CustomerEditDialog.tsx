
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Customer, Partner, Product } from '../types';
import CustomerBasicInfoForm from './CustomerBasicInfoForm';
import CustomerStatusForm from './CustomerStatusForm';
import CustomerAssignmentForm from './CustomerAssignmentForm';
import CustomerProductSelection from './CustomerProductSelection';

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

  const handleFormChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

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
          <CustomerBasicInfoForm 
            formData={formData} 
            onChange={handleFormChange} 
          />

          <CustomerStatusForm 
            formData={formData} 
            onChange={handleFormChange} 
          />

          <CustomerAssignmentForm 
            formData={formData} 
            partners={partners} 
            onChange={handleFormChange} 
          />

          <CustomerProductSelection 
            products={products} 
            selectedProducts={selectedProducts} 
            onProductChange={handleProductChange} 
          />

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
