
export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: 'active' | 'inactive' | 'pending';
  partnerId?: string;
  productIds?: string[];
  createdAt: Date;
  value: number;
}

export interface Partner {
  id: string;
  name: string;
  email: string;
  company: string;
  specialization: string;
  customersCount: number;
  totalValue: number;
  status: 'active' | 'inactive';
  createdAt: Date;
}

export interface Product {
  id: string;
  name: string;
  website: string;
  category: string;
  description: string;
  status: 'active' | 'inactive';
  customersCount: number;
  createdAt: Date;
}

export interface DashboardStats {
  totalCustomers: number;
  totalPartners: number;
  totalProducts: number;
  totalValue: number;
  activeCustomers: number;
}
