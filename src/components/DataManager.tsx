
import { useState } from 'react';
import { mockCustomers, mockPartners, mockProducts } from '@/utils/mockData';
import { mockUsers } from '@/utils/mockUsers';
import { mockRenewals } from '@/utils/mockRenewals';
import { Customer, Partner, Product, User, Renewal } from '@/types';

export const useDataManager = () => {
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [partners, setPartners] = useState<Partner[]>(mockPartners);
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [users] = useState<User[]>(mockUsers);
  const [renewals] = useState<Renewal[]>(mockRenewals);

  const handleCustomerAdd = (customer: Customer) => {
    setCustomers([...customers, customer]);
  };

  const handleCustomerUpdate = (customerId: string, updates: Partial<Customer>) => {
    setCustomers(prev => prev.map(customer => 
      customer.id === customerId ? { ...customer, ...updates } : customer
    ));
    
    // Sync relevant data to partners - update customer count and total value
    if (updates.partnerId !== undefined) {
      setPartners(prev => prev.map(partner => {
        const partnerCustomers = customers.filter(c => c.partnerId === partner.id);
        const updatedCustomers = partnerCustomers.map(c => 
          c.id === customerId ? { ...c, ...updates } : c
        );
        
        return {
          ...partner,
          customersCount: partner.id === updates.partnerId 
            ? updatedCustomers.length + 1 
            : updatedCustomers.length,
          totalValue: updatedCustomers.reduce((sum, c) => sum + c.value, 0)
        };
      }));
    }
  };

  const handleBulkAction = (customerIds: string[], action: string) => {
    const statusMap: { [key: string]: 'active' | 'inactive' | 'pending' } = {
      'activate': 'active',
      'deactivate': 'inactive',
      'pending': 'pending'
    };

    if (statusMap[action]) {
      setCustomers(prev => prev.map(customer => 
        customerIds.includes(customer.id) 
          ? { ...customer, status: statusMap[action] }
          : customer
      ));
    }
  };

  const handleCustomerImport = (importedCustomers: Customer[]) => {
    setCustomers([...customers, ...importedCustomers]);
    
    // Update partner stats after import
    setPartners(prev => prev.map(partner => {
      const allCustomers = [...customers, ...importedCustomers];
      const partnerCustomers = allCustomers.filter(c => c.partnerId === partner.id);
      
      return {
        ...partner,
        customersCount: partnerCustomers.length,
        totalValue: partnerCustomers.reduce((sum, c) => sum + c.value, 0)
      };
    }));
  };

  const handleProductAdd = (product: Product) => {
    setProducts([...products, product]);
  };

  const handleProductImport = (importedProducts: Product[]) => {
    setProducts([...products, ...importedProducts]);
  };

  const handleProductPriceUpdate = (productId: string, newPrice: number) => {
    setProducts(prev => prev.map(product => 
      product.id === productId ? { ...product, price: newPrice } : product
    ));
  };

  return {
    customers,
    partners,
    products,
    users,
    renewals,
    handleCustomerAdd,
    handleCustomerUpdate,
    handleBulkAction,
    handleCustomerImport,
    handleProductAdd,
    handleProductImport,
    handleProductPriceUpdate
  };
};
