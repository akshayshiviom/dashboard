import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import DashboardStats from '@/components/DashboardStats';
import CustomerChart from '@/components/CustomerChart';
import CustomerFilters from '@/components/CustomerFilters';
import CustomerTable from '@/components/CustomerTable';
import CustomerForm from '@/components/CustomerForm';
import PartnerFilters from '@/components/PartnerFilters';
import PartnerTable from '@/components/PartnerTable';
import ProductFilters from '@/components/ProductFilters';
import ProductTable from '@/components/ProductTable';
import Renewals from '@/components/Renewals';
import UserFilters from '@/components/UserFilters';
import UserHierarchyTable from '@/components/UserHierarchyTable';
import Reports from '@/components/Reports';
import Settings from '@/components/Settings';

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <DashboardStats />
            <CustomerChart />
          </div>
        );
      case 'customers':
        return (
          <div className="space-y-6">
            <CustomerFilters />
            <CustomerTable />
          </div>
        );
      case 'add-customer':
        return <CustomerForm />;
      case 'partners':
        return (
          <div className="space-y-6">
            <PartnerFilters />
            <PartnerTable />
          </div>
        );
      case 'products':
        return (
          <div className="space-y-6">
            <ProductFilters />
            <ProductTable />
          </div>
        );
      case 'renewals':
        return <Renewals />;
      case 'user-hierarchy':
        return (
          <div className="space-y-6">
            <UserFilters />
            <UserHierarchyTable />
          </div>
        );
      case 'reports':
        return <Reports />;
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
      default:
        return (
          <div className="space-y-6">
            <DashboardStats />
            <CustomerChart />
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
