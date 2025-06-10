import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Edit2, Trash2, Plus } from 'lucide-react';
import { Product, ProductPlan } from '../types';

interface PlanManagementDialogProps {
  product: Product;
  onUpdateProduct: (productId: string, updatedProduct: Partial<Product>) => void;
  trigger: React.ReactNode;
}

const PlanManagementDialog = ({ product, onUpdateProduct, trigger }: PlanManagementDialogProps) => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<ProductPlan | null>(null);
  const [isAddingPlan, setIsAddingPlan] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    billing: 'monthly' as 'monthly' | 'yearly' | 'one-time',
    features: '',
    userLimit: '',
    isPopular: false,
  });

  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      billing: 'monthly',
      features: '',
      userLimit: '',
      isPopular: false,
    });
    setEditingPlan(null);
    setIsAddingPlan(false);
  };

  const handleEditPlan = (plan: ProductPlan) => {
    setEditingPlan(plan);
    setIsAddingPlan(true);
    setFormData({
      name: plan.name,
      price: plan.price.toString(),
      billing: plan.billing,
      features: plan.features.join('\n'),
      userLimit: plan.userLimit?.toString() || '',
      isPopular: plan.isPopular || false,
    });
  };

  const handleSavePlan = () => {
    if (!formData.name || !formData.price) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const planData: ProductPlan = {
      id: editingPlan ? editingPlan.id : Date.now().toString(),
      name: formData.name,
      price: parseFloat(formData.price),
      billing: formData.billing,
      features: formData.features.split('\n').filter(f => f.trim()),
      userLimit: formData.userLimit ? parseInt(formData.userLimit) : undefined,
      isPopular: formData.isPopular,
    };

    const currentPlans = Array.isArray(product.plans) ? product.plans : [];
    let updatedPlans;

    if (editingPlan) {
      updatedPlans = currentPlans.map(plan => 
        plan.id === editingPlan.id ? planData : plan
      );
    } else {
      updatedPlans = [...currentPlans, planData];
    }

    onUpdateProduct(product.id, { plans: updatedPlans });

    toast({
      title: "Success",
      description: `Plan ${editingPlan ? 'updated' : 'added'} successfully!`,
    });

    resetForm();
  };

  const handleDeletePlan = (planId: string) => {
    const currentPlans = Array.isArray(product.plans) ? product.plans : [];
    const updatedPlans = currentPlans.filter(plan => plan.id !== planId);
    
    onUpdateProduct(product.id, { plans: updatedPlans });

    toast({
      title: "Success",
      description: "Plan deleted successfully!",
    });
  };

  const getBillingBadgeColor = (billing: string) => {
    switch (billing) {
      case 'monthly': return 'bg-blue-100 text-blue-800';
      case 'yearly': return 'bg-purple-100 text-purple-800';
      case 'one-time': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const plans = Array.isArray(product.plans) ? product.plans : [];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild onClick={() => setIsOpen(true)}>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Manage Plans for {product.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Add New Plan Button */}
          {!isAddingPlan && (
            <Button onClick={() => setIsAddingPlan(true)} className="w-full">
              <Plus size={16} className="mr-2" />
              Add New Plan
            </Button>
          )}

          {/* Add/Edit Plan Form */}
          {isAddingPlan && (
            <Card>
              <CardHeader>
                <CardTitle>{editingPlan ? 'Edit Plan' : 'Add New Plan'}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Plan Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Enter plan name"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="price">Price (₹) *</Label>
                    <Input
                      id="price"
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="Enter price"
                      step="0.01"
                      min="0"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="billing">Billing Cycle *</Label>
                    <Select value={formData.billing} onValueChange={(value: 'monthly' | 'yearly' | 'one-time') => setFormData({ ...formData, billing: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="yearly">Yearly</SelectItem>
                        <SelectItem value="one-time">One-time</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="userLimit">User Limit</Label>
                    <Input
                      id="userLimit"
                      type="number"
                      value={formData.userLimit}
                      onChange={(e) => setFormData({ ...formData, userLimit: e.target.value })}
                      placeholder="Enter user limit (optional)"
                      min="1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="features">Features (one per line) *</Label>
                  <Textarea
                    id="features"
                    value={formData.features}
                    onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                    placeholder="Enter features, one per line"
                    rows={4}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="isPopular"
                    checked={formData.isPopular}
                    onCheckedChange={(checked) => setFormData({ ...formData, isPopular: checked })}
                  />
                  <Label htmlFor="isPopular">Mark as Popular Plan</Label>
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleSavePlan}>
                    {editingPlan ? 'Update Plan' : 'Add Plan'}
                  </Button>
                  <Button variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Existing Plans */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Existing Plans ({plans.length})</h3>
            {plans.length === 0 ? (
              <Card>
                <CardContent className="flex items-center justify-center py-8">
                  <p className="text-muted-foreground">No plans available. Add your first plan above.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {plans.map((plan) => (
                  <Card key={plan.id} className={`relative ${plan.isPopular ? 'ring-2 ring-blue-500' : ''}`}>
                    {plan.isPopular && (
                      <div className="absolute -top-3 left-4">
                        <Badge className="bg-blue-500 text-white">Most Popular</Badge>
                      </div>
                    )}
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold">{plan.name}</h4>
                            <Badge className={getBillingBadgeColor(plan.billing)} variant="secondary">
                              {plan.billing}
                            </Badge>
                          </div>
                          <div className="text-2xl font-bold">₹{plan.price.toFixed(2)}</div>
                          {plan.userLimit && (
                            <p className="text-sm text-muted-foreground">
                              Up to {plan.userLimit} users
                            </p>
                          )}
                          <div className="space-y-1">
                            <p className="text-sm font-medium">Features:</p>
                            <ul className="text-sm space-y-1">
                              {plan.features.map((feature, index) => (
                                <li key={index} className="flex items-start gap-2">
                                  <span className="text-green-600 mt-0.5">✓</span>
                                  <span>{feature}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditPlan(plan)}
                          >
                            <Edit2 size={14} />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeletePlan(plan.id)}
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PlanManagementDialog;
