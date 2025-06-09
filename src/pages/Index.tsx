import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import DashboardStats from '../components/DashboardStats';
import CustomerChart from '../components/CustomerChart';
import CustomerTable from '../components/CustomerTable';
import CustomerForm from '../components/CustomerForm';
import PartnerTable from '../components/PartnerTable';
import ProductTable from '../components/ProductTable';
import UserHierarchyTable from '../components/UserHierarchyTable';
import Reports from '../components/Reports';
import { mockCustomers, mockPartners, mockProducts } from '../utils/mockData';
import { mockUsers } from '../utils/mockUsers';
import { Customer, Partner, Product, User, DashboardStats as StatsType } from '../types';

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [partners] = useState<Partner[]>(mockPartners);
  const [products] = useState<Product[]>(mockProducts);
  const [users] = useState<User[]>(mockUsers);

  const handleCustomerAdd = (newCustomer: Customer) => {
    setCustomers([...customers, newCustomer]);
  };

  const stats: StatsType = {
    totalCustomers: customers.length,
    totalPartners: partners.length,
    totalProducts: products.length,
    totalValue: customers.reduce((sum, customer) => sum + customer.value, 0),
    activeCustomers: customers.filter(c => c.status === 'active').length,
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <DashboardStats stats={stats} />
            <CustomerChart customers={customers} partners={partners} />
            <CustomerTable customers={customers} partners={partners} products={products} />
          </div>
        );
      case 'customers':
        return <CustomerTable customers={customers} partners={partners} products={products} />;
      case 'partners':
        return <PartnerTable partners={partners} />;
      case 'products':
        return <ProductTable products={products} />;
      case 'user-hierarchy':
        return <UserHierarchyTable users={users} />;
      case 'reports':
        return <Reports customers={customers} partners={partners} products={products} users={users} />;
      case 'add-customer':
        return <CustomerForm partners={partners} products={products} onCustomerAdd={handleCustomerAdd} />;
      default:
        return <div>Page not found</div>;
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-foreground capitalize">
              {activeTab.replace('-', ' ')}
            </h2>
            <p className="text-muted-foreground mt-2">
              {activeTab === 'dashboard' && 'Overview of your customer, partner, and product data'}
              {activeTab === 'customers' && 'Manage and view all customer information'}
              {activeTab === 'partners' && 'Overview of all partners and their performance'}
              {activeTab === 'products' && 'Manage and view all product information'}
              {activeTab === 'user-hierarchy' && 'Manage user roles and organizational hierarchy'}
              {activeTab === 'reports' && 'Generate and download business reports'}
              {activeTab === 'add-customer' && 'Add new customers to your database'}
            </p>
          </div>
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default Index;
