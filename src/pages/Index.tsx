import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import DashboardStats from '@/components/DashboardStats';
import DashboardFilters from '@/components/DashboardFilters';
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

interface Dashboard {
  id: string;
  name: string;
  description?: string;
  timeframe: 'monthly' | 'yearly' | 'custom';
  customDateRange?: {
    from: Date;
    to: Date;
  };
  widgets: {
    showStats: boolean;
    showChart: boolean;
    showRenewals: boolean;
    showCustomerTable: boolean;
  };
  filters: {
    customerStatus?: string[];
    partnerIds?: string[];
    productIds?: string[];
  };
}

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dashboards, setDashboards] = useState<Dashboard[]>([
    { 
      id: 'default', 
      name: 'Main Dashboard', 
      description: 'Default dashboard view',
      timeframe: 'monthly',
      widgets: {
        showStats: true,
        showChart: true,
        showRenewals: true,
        showCustomerTable: false
      },
      filters: {}
    }
  ]);
  const [activeDashboard, setActiveDashboard] = useState('default');
  const [timeframe, setTimeframe] = useState<'monthly' | 'yearly' | 'custom'>('monthly');
  const [customDateRange, setCustomDateRange] = useState<{ from: Date; to: Date } | undefined>();
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [partners] = useState<Partner[]>(mockPartners);
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [users] = useState<User[]>(mockUsers);
  const [renewals] = useState<Renewal[]>(mockRenewals);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleTimeframeChange = (newTimeframe: 'monthly' | 'yearly' | 'custom') => {
    setTimeframe(newTimeframe);
    // Update current dashboard
    setDashboards(prev => prev.map(dashboard => 
      dashboard.id === activeDashboard 
        ? { ...dashboard, timeframe: newTimeframe }
        : dashboard
    ));
  };

  const handleCustomDateChange = (dateRange: { from: Date; to: Date }) => {
    setCustomDateRange(dateRange);
    // Update current dashboard
    setDashboards(prev => prev.map(dashboard => 
      dashboard.id === activeDashboard 
        ? { ...dashboard, customDateRange: dateRange }
        : dashboard
    ));
  };

  const handleDashboardChange = (dashboardId: string) => {
    setActiveDashboard(dashboardId);
    const dashboard = dashboards.find(d => d.id === dashboardId);
    if (dashboard) {
      setTimeframe(dashboard.timeframe);
      setCustomDateRange(dashboard.customDateRange);
    }
  };

  const handleCreateDashboard = (name: string, description?: string) => {
    const newDashboard: Dashboard = {
      id: `dashboard-${Date.now()}`,
      name,
      description,
      timeframe: 'monthly',
      widgets: {
        showStats: true,
        showChart: true,
        showRenewals: true,
        showCustomerTable: false
      },
      filters: {}
    };
    setDashboards(prev => [...prev, newDashboard]);
    setActiveDashboard(newDashboard.id);
    setTimeframe('monthly');
    setCustomDateRange(undefined);
  };

  const handleUpdateDashboard = (dashboardId: string, updates: Partial<Dashboard>) => {
    setDashboards(prev => prev.map(dashboard => 
      dashboard.id === dashboardId 
        ? { ...dashboard, ...updates }
        : dashboard
    ));
  };

  const handleDeleteDashboard = (dashboardId: string) => {
    if (dashboards.length <= 1) return;
    
    setDashboards(prev => prev.filter(d => d.id !== dashboardId));
    if (activeDashboard === dashboardId) {
      const remainingDashboard = dashboards.find(d => d.id !== dashboardId);
      if (remainingDashboard) {
        setActiveDashboard(remainingDashboard.id);
        setTimeframe(remainingDashboard.timeframe);
        setCustomDateRange(remainingDashboard.customDateRange);
      }
    }
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

  const handleCustomerAdd = (customer: Customer) => {
    setCustomers([...customers, customer]);
  };

  const handleCustomerImport = (importedCustomers: Customer[]) => {
    setCustomers([...customers, ...importedCustomers]);
  };

  const handleProductAdd = (product: Product) => {
    setProducts([...products, product]);
  };

  const handleProductImport = (importedProducts: Product[]) => {
    setProducts([...products, ...importedProducts]);
  };

  const handleProductPriceUpdate = (productId: string, newPrice: number) => {
    console.log('Update product price:', productId, newPrice);
  };

  const getCurrentDashboard = () => {
    return dashboards.find(d => d.id === activeDashboard) || dashboards[0];
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        const currentDashboard = getCurrentDashboard();
        return (
          <div className="space-y-6">
            <DashboardFilters 
              timeframe={timeframe} 
              onTimeframeChange={handleTimeframeChange}
              customDateRange={customDateRange}
              onCustomDateChange={handleCustomDateChange}
              dashboards={dashboards}
              activeDashboard={activeDashboard}
              onDashboardChange={handleDashboardChange}
              onCreateDashboard={handleCreateDashboard}
              onUpdateDashboard={handleUpdateDashboard}
              onDeleteDashboard={handleDeleteDashboard}
              customers={customers}
              partners={partners}
              products={products}
            />
            {currentDashboard.widgets.showStats && <DashboardStats stats={stats} />}
            {currentDashboard.widgets.showChart && <CustomerChart customers={filteredCustomers} partners={partners} />}
            {currentDashboard.widgets.showRenewals && <Renewals renewals={filteredRenewals} customers={customers} partners={partners} products={products} />}
            {currentDashboard.widgets.showCustomerTable && (
              <div className="space-y-6">
                <CustomerTable customers={customers} partners={partners} products={products} />
              </div>
            )}
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
