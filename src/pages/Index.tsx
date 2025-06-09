import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import DashboardStats from '@/components/DashboardStats';
import CustomerChart from '@/components/CustomerChart';
import CustomerTable from '@/components/CustomerTable';
import CustomerForm from '@/components/CustomerForm';
import PartnerTable from '@/components/PartnerTable';
import ProductTable from '@/components/ProductTable';
import ProductForm from '@/components/ProductForm';
import Renewals from '@/components/Renewals';
import UserHierarchyTable from '@/components/UserHierarchyTable';
import Reports from '@/components/Reports';
import Settings from '@/components/Settings';
import ImportData from '@/components/ImportData';
import { mockCustomers, mockPartners, mockProducts } from '@/utils/mockData';
import { mockUsers } from '@/utils/mockUsers';
import { mockRenewals } from '@/utils/mockRenewals';
import { Customer, Partner, Product, User, Renewal, DashboardStats as StatsType } from '@/types';

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [partners] = useState<Partner[]>(mockPartners);
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [users] = useState<User[]>(mockUsers);
  const [renewals] = useState<Renewal[]>(mockRenewals);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  // Calculate dashboard stats
  const stats: StatsType = {
    totalCustomers: customers.length,
    totalPartners: partners.length,
    totalProducts: products.length,
    totalValue: customers.reduce((sum, customer) => sum + customer.value, 0),
    activeCustomers: customers.filter(c => c.status === 'active').length,
  };

  // Callback functions for customer management
  const handleCustomerAdd = (customer: Customer) => {
    setCustomers([...customers, customer]);
  };

  const handleCustomerImport = (importedCustomers: Customer[]) => {
    setCustomers([...customers, ...importedCustomers]);
  };

  // Callback functions for product management
  const handleProductAdd = (product: Product) => {
    setProducts([...products, product]);
  };

  const handleProductImport = (importedProducts: Product[]) => {
    setProducts([...products, ...importedProducts]);
  };

  const handleProductPriceUpdate = (productId: string, newPrice: number) => {
    console.log('Update product price:', productId, newPrice);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <DashboardStats stats={stats} />
            <CustomerChart customers={customers} partners={partners} />
            <Renewals renewals={renewals} customers={customers} partners={partners} products={products} />
          </div>
        );
      case 'customers':
        return (
          <div className="space-y-6">
            <CustomerTable customers={customers} partners={partners} products={products} />
          </div>
        );
      case 'add-customer':
        return <CustomerForm partners={partners} products={products} onCustomerAdd={handleCustomerAdd} />;
      case 'partners':
        return (
          <div className="space-y-6">
            <PartnerTable partners={partners} customers={customers} products={products} users={users} />
          </div>
        );
      case 'products':
        return (
          <div className="space-y-6">
            <ProductTable products={products} onPriceUpdate={handleProductPriceUpdate} />
          </div>
        );
      case 'add-product':
        return <ProductForm onProductAdd={handleProductAdd} />;
      case 'renewals':
        return <Renewals renewals={renewals} customers={customers} partners={partners} products={products} />;
      case 'user-hierarchy':
        return (
          <div className="space-y-6">
            <UserHierarchyTable users={users} />
          </div>
        );
      case 'reports':
        return <Reports customers={customers} partners={partners} products={products} users={users} />;
      case 'settings':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-semibold">Settings</h3>
              <p className="text-muted-foreground">Configure your application settings</p>
            </div>
            <div className="text-center py-8">
              <p className="text-muted-foreground">Select a settings option from the sidebar to get started.</p>
            </div>
          </div>
        );
      case 'email-templates':
        return <Settings />;
      case 'import-data':
        return (
          <ImportData 
            onCustomerImport={handleCustomerImport}
            onProductImport={handleProductImport}
          />
        );
      default:
        return (
          <div className="space-y-6">
            <DashboardStats stats={stats} />
            <CustomerChart customers={customers} partners={partners} />
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar activeTab={activeTab} onTabChange={handleTabChange} />
      <main className="flex-1 p-8">
        {renderContent()}
      </main>
    </div>
  );
};

export default Index;
