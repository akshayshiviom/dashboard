
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
import { mockCustomers, mockPartners, mockProducts } from '@/utils/mockData';
import { mockUsers } from '@/utils/mockUsers';
import { mockRenewals } from '@/utils/mockRenewals';
import { Customer, Partner, Product, User, Renewal, DashboardStats as StatsType } from '@/types';

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [partners] = useState<Partner[]>(mockPartners);
  const [products] = useState<Product[]>(mockProducts);
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

  // Filter callbacks (these would typically filter the data, but for now they're placeholders)
  const handleCustomerStatusFilter = (status: string) => {
    console.log('Filter by status:', status);
  };

  const handleCustomerPartnerFilter = (partnerId: string) => {
    console.log('Filter by partner:', partnerId);
  };

  const handleCustomerValueFilter = (minValue: number) => {
    console.log('Filter by min value:', minValue);
  };

  const handlePartnerStatusFilter = (status: string) => {
    console.log('Filter partners by status:', status);
  };

  const handlePartnerCustomersFilter = (minCustomers: number) => {
    console.log('Filter partners by min customers:', minCustomers);
  };

  const handlePartnerRevenueFilter = (minRevenue: number) => {
    console.log('Filter partners by min revenue:', minRevenue);
  };

  const handlePartnerSpecializationFilter = (specialization: string) => {
    console.log('Filter partners by specialization:', specialization);
  };

  const handleProductStatusFilter = (status: string) => {
    console.log('Filter products by status:', status);
  };

  const handleProductCategoryFilter = (category: string) => {
    console.log('Filter products by category:', category);
  };

  const handleProductCustomersFilter = (minCustomers: number) => {
    console.log('Filter products by min customers:', minCustomers);
  };

  const handleUserRoleFilter = (role: string) => {
    console.log('Filter users by role:', role);
  };

  const handleUserStatusFilter = (status: string) => {
    console.log('Filter users by status:', status);
  };

  const handleUserDepartmentFilter = (department: string) => {
    console.log('Filter users by department:', department);
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
          </div>
        );
      case 'customers':
        return (
          <div className="space-y-6">
            <CustomerFilters 
              onStatusFilter={handleCustomerStatusFilter}
              onPartnerFilter={handleCustomerPartnerFilter}
              onValueFilter={handleCustomerValueFilter}
              partners={partners}
            />
            <CustomerTable customers={customers} partners={partners} products={products} />
          </div>
        );
      case 'add-customer':
        return <CustomerForm partners={partners} products={products} onCustomerAdd={handleCustomerAdd} />;
      case 'partners':
        return (
          <div className="space-y-6">
            <PartnerFilters 
              onStatusFilter={handlePartnerStatusFilter}
              onCustomersFilter={handlePartnerCustomersFilter}
              onRevenueFilter={handlePartnerRevenueFilter}
              onSpecializationFilter={handlePartnerSpecializationFilter}
            />
            <PartnerTable partners={partners} customers={customers} products={products} users={users} />
          </div>
        );
      case 'products':
        return (
          <div className="space-y-6">
            <ProductFilters 
              onStatusFilter={handleProductStatusFilter}
              onCategoryFilter={handleProductCategoryFilter}
              onCustomersFilter={handleProductCustomersFilter}
            />
            <ProductTable products={products} onPriceUpdate={handleProductPriceUpdate} />
          </div>
        );
      case 'renewals':
        return <Renewals renewals={renewals} customers={customers} partners={partners} products={products} />;
      case 'user-hierarchy':
        return (
          <div className="space-y-6">
            <UserFilters 
              onRoleFilter={handleUserRoleFilter}
              onStatusFilter={handleUserStatusFilter}
              onDepartmentFilter={handleUserDepartmentFilter}
            />
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
