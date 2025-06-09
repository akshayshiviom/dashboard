
import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import DashboardStats from '../components/DashboardStats';
import CustomerChart from '../components/CustomerChart';
import CustomerTable from '../components/CustomerTable';
import CustomerForm from '../components/CustomerForm';
import PartnerTable from '../components/PartnerTable';
import { mockCustomers, mockPartners } from '../utils/mockData';
import { Customer, Partner, DashboardStats as StatsType } from '../types';

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [partners] = useState<Partner[]>(mockPartners);

  const handleCustomerAdd = (newCustomer: Customer) => {
    setCustomers([...customers, newCustomer]);
  };

  const stats: StatsType = {
    totalCustomers: customers.length,
    totalPartners: partners.length,
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
            <CustomerTable customers={customers} partners={partners} />
          </div>
        );
      case 'customers':
        return <CustomerTable customers={customers} partners={partners} />;
      case 'partners':
        return <PartnerTable partners={partners} />;
      case 'add-customer':
        return <CustomerForm partners={partners} onCustomerAdd={handleCustomerAdd} />;
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
              {activeTab === 'dashboard' && 'Overview of your customer and partner data'}
              {activeTab === 'customers' && 'Manage and view all customer information'}
              {activeTab === 'partners' && 'Overview of all partners and their performance'}
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
