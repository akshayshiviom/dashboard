
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
  price: number;
  createdAt: Date;
}

export interface DashboardStats {
  totalCustomers: number;
  totalPartners: number;
  totalProducts: number;
  totalValue: number;
  activeCustomers: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'fsr' | 'team-leader' | 'manager' | 'assistant-manager' | 'bde';
  reportingTo?: string; // ID of the user they report to
  department: string;
  status: 'active' | 'inactive';
  createdAt: Date;
  lastLogin?: Date;
}

export interface UserHierarchy {
  user: User;
  subordinates: UserHierarchy[];
}
