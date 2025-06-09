
export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: 'active' | 'inactive' | 'pending';
  partnerId?: string;
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

export interface DashboardStats {
  totalCustomers: number;
  totalPartners: number;
  totalValue: number;
  activeCustomers: number;
}
