import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import EmailTemplatesTab from './settings/EmailTemplatesTab';
import ProductCategoriesTab from './settings/ProductCategoriesTab';
import ProductDetailsTab from './settings/ProductDetailsTab';

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  isDefault: boolean;
}

interface ProductCategory {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
}

interface ProductDetails {
  id: string;
  name: string;
  website: string;
  category: string;
  description: string;
  price: number;
  status: 'active' | 'inactive';
}

const Settings = () => {
  // Simulate admin role - in a real app, this would come from authentication context
  const [isAdmin] = useState(true); // Set to true for demo purposes
  
  const [templates, setTemplates] = useState<EmailTemplate[]>([
    {
      id: '1',
      name: 'Standard Renewal',
      subject: 'Renewal Reminder - {contractValue} Contract',
      body: `Dear {customerName},

I hope this email finds you well.

We wanted to reach out regarding your upcoming software renewal scheduled for {renewalDate}.

Contract Details:
- Customer: {customerName}
- Company: {customerCompany}
- Partner: {partnerName}
- Contract Value: {contractValue}
- Renewal Date: {renewalDate}
- Status: {status}

We would appreciate the opportunity to discuss your renewal and any potential upgrades or changes to your current setup.

Please let us know if you have any questions or would like to schedule a call to discuss this further.

Best regards,
{employeeName}
{employeeEmail}
{employeePhone}`,
      isDefault: true
    }
  ]);

  const [categories, setCategories] = useState<ProductCategory[]>([
    { id: '1', name: 'Identity Management', description: 'User authentication and identity solutions', isActive: true },
    { id: '2', name: 'Mobile Device Management', description: 'Mobile device security and management tools', isActive: true },
    { id: '3', name: 'Productivity Suite', description: 'Office and productivity applications', isActive: true },
    { id: '4', name: 'Communication', description: 'Communication and collaboration tools', isActive: true },
    { id: '5', name: 'Security', description: 'Security and protection software', isActive: true },
  ]);

  const [products, setProducts] = useState<ProductDetails[]>([
    { id: '1', name: 'Azure Active Directory', website: 'azure.microsoft.com', category: 'Identity Management', description: 'Cloud-based identity and access management service', price: 299.99, status: 'active' },
    { id: '2', name: 'Microsoft Intune', website: 'intune.microsoft.com', category: 'Mobile Device Management', description: 'Mobile device and application management service', price: 199.99, status: 'active' },
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-semibold">Settings</h3>
        <p className="text-muted-foreground">Manage your application settings and configurations</p>
        {isAdmin && (
          <p className="text-sm text-green-600 mt-1">Admin Mode: You have full editing rights</p>
        )}
      </div>

      <Tabs defaultValue="email-templates" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="email-templates">Email Templates</TabsTrigger>
          <TabsTrigger value="product-categories">Product Categories</TabsTrigger>
          <TabsTrigger value="product-details">Product Details</TabsTrigger>
        </TabsList>

        <TabsContent value="email-templates" className="space-y-6">
          <EmailTemplatesTab templates={templates} setTemplates={setTemplates} />
        </TabsContent>

        <TabsContent value="product-categories" className="space-y-6">
          <ProductCategoriesTab categories={categories} setCategories={setCategories} />
        </TabsContent>

        <TabsContent value="product-details" className="space-y-6">
          <ProductDetailsTab 
            products={products} 
            setProducts={setProducts} 
            categories={categories}
            isAdmin={isAdmin}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
