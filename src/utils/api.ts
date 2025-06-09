
import { DashboardStats } from '@/types';

export const getDashboardStats = async (
  timeframe: 'monthly' | 'yearly' | 'custom',
  customDateRange?: { from: Date; to: Date }
): Promise<DashboardStats> => {
  // Mock API call - in a real app, this would fetch from your backend
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        totalCustomers: 156,
        totalPartners: 24,
        totalProducts: 8,
        totalValue: 2500000,
        activeCustomers: 142,
      });
    }, 100);
  });
};
