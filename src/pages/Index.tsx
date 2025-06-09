
import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import TabContentRenderer from '@/components/TabContentRenderer';
import { useDashboardManager } from '@/components/DashboardManager';
import { useDataManager } from '@/components/DataManager';
import { DashboardStats as StatsType } from '@/types';

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  const {
    dashboards,
    activeDashboard,
    timeframe,
    customDateRange,
    handleDashboardChange,
    handleTimeframeChange,
    handleCustomDateChange,
    handleCreateDashboard,
    handleUpdateDashboard,
    handleDeleteDashboard,
    getCurrentDashboard
  } = useDashboardManager({
    onDashboardChange: () => {},
    onTimeframeChange: () => {},
    onCustomDateChange: () => {}
  });

  const {
    customers,
    partners,
    products,
    users,
    renewals,
    handleCustomerAdd,
    handleCustomerImport,
    handleProductAdd,
    handleProductImport,
    handleProductPriceUpdate
  } = useDataManager();

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const getFilteredData = () => {
    const now = new Date();
    let cutoffDate: Date;
    let endDate: Date = now;

    if (timeframe === 'custom' && customDateRange) {
      cutoffDate = customDateRange.from;
      endDate = customDateRange.to;
    } else if (timeframe === 'monthly') {
      cutoffDate = new Date(now.getFullYear(), now.getMonth(), 1);
    } else {
      cutoffDate = new Date(now.getFullYear(), 0, 1);
    }

    const filteredCustomers = customers.filter(customer => {
      const customerDate = new Date(customer.createdAt);
      return customerDate >= cutoffDate && customerDate <= endDate;
    });

    const filteredRenewals = renewals.filter(renewal => {
      const renewalDate = new Date(renewal.renewalDate);
      return renewalDate >= cutoffDate && renewalDate <= endDate;
    });

    return { filteredCustomers, filteredRenewals };
  };

  const { filteredCustomers, filteredRenewals } = getFilteredData();

  const stats: StatsType = {
    totalCustomers: filteredCustomers.length,
    totalPartners: partners.length,
    totalProducts: products.length,
    totalValue: filteredCustomers.reduce((sum, customer) => sum + customer.value, 0),
    activeCustomers: filteredCustomers.filter(c => c.status === 'active').length,
  };

  const currentDashboard = getCurrentDashboard();

  return (
    <div className="flex h-screen bg-background">
      <Sidebar activeTab={activeTab} onTabChange={handleTabChange} />
      <main className="flex-1 p-8">
        <TabContentRenderer
          activeTab={activeTab}
          currentDashboard={currentDashboard}
          timeframe={timeframe}
          customDateRange={customDateRange}
          dashboards={dashboards}
          activeDashboard={activeDashboard}
          filteredCustomers={filteredCustomers}
          filteredRenewals={filteredRenewals}
          stats={stats}
          customers={customers}
          partners={partners}
          products={products}
          users={users}
          renewals={renewals}
          onTimeframeChange={handleTimeframeChange}
          onCustomDateChange={handleCustomDateChange}
          onDashboardChange={handleDashboardChange}
          onCreateDashboard={handleCreateDashboard}
          onUpdateDashboard={handleUpdateDashboard}
          onDeleteDashboard={handleDeleteDashboard}
          onCustomerAdd={handleCustomerAdd}
          onCustomerImport={handleCustomerImport}
          onProductAdd={handleProductAdd}
          onProductImport={handleProductImport}
          onProductPriceUpdate={handleProductPriceUpdate}
        />
      </main>
    </div>
  );
};

export default Index;
