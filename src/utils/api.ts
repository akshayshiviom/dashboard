
import { DashboardStats } from '@/types';

// Mock data imports
import { mockCustomers, mockPartners, mockProducts } from './mockData';
import { mockRenewals } from './mockRenewals';
import { mockTasks } from './mockTasks';

export const getDashboardStats = async (
  timeframe: 'monthly' | 'yearly' | 'custom',
  customDateRange?: { from: Date; to: Date }
): Promise<DashboardStats> => {
  // Calculate real metrics from mock data
  return new Promise((resolve) => {
    setTimeout(() => {
      // Basic counts
      const totalCustomers = mockCustomers.length;
      const totalPartners = mockPartners.length;
      const totalProducts = mockProducts.length;
      const activeCustomers = mockCustomers.filter(c => c.status === 'active').length;
      const activePartnersCount = mockPartners.filter(p => p.status === 'active').length;

      // Revenue calculations
      const newRevenue = mockPartners.reduce((sum, partner) => sum + partner.newRevenue, 0);
      const renewalRevenue = mockPartners.reduce((sum, partner) => sum + partner.renewalRevenue, 0);
      const totalValue = newRevenue + renewalRevenue;

      // Task metrics
      const totalTasks = mockTasks.length;
      const overdueTasks = mockTasks.filter(task => 
        new Date(task.dueDate) < new Date() && task.status !== 'completed'
      ).length;
      const completedTasks = mockTasks.filter(task => task.status === 'completed').length;
      const highPriorityTasks = mockTasks.filter(task => task.priority === 'high').length;

      // Partner onboarding metrics
      const partnerOnboardingInProgress = mockPartners.filter(p => 
        p.status === 'active' && p.customersCount < 5 // Assuming new partners have < 5 customers
      ).length;

      // Customer process metrics
      const customersPipeline = mockCustomers.filter(c => c.process === 'prospect' || c.process === 'demo' || c.process === 'poc' || c.process === 'negotiating').length;
      const customersWon = mockCustomers.filter(c => c.process === 'won').length;
      const customersLost = mockCustomers.filter(c => c.process === 'lost').length;
      const conversionRate = customersWon > 0 ? (customersWon / (customersWon + customersLost)) * 100 : 0;

      // Renewal metrics
      const now = new Date();
      const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
      const upcomingRenewals = mockRenewals.filter(r => 
        new Date(r.renewalDate) >= now && new Date(r.renewalDate) <= thirtyDaysFromNow
      ).length;
      const renewalsAtRisk = mockRenewals.filter(r => r.status === 'overdue').length;
      const successfulRenewals = mockRenewals.filter(r => r.status === 'renewed').length;
      const renewalSuccessRate = mockRenewals.length > 0 ? (successfulRenewals / mockRenewals.length) * 100 : 0;

      // Performance metrics
      const averageDealSize = totalCustomers > 0 ? totalValue / totalCustomers : 0;
      const monthlyGrowthRate = 12.5; // Mock value - would be calculated from historical data

      resolve({
        totalCustomers,
        totalPartners,
        totalProducts,
        totalValue,
        activeCustomers,
        newRevenue,
        renewalRevenue,
        totalTasks,
        overdueTasks,
        completedTasks,
        highPriorityTasks,
        activePartnersCount,
        partnerOnboardingInProgress,
        customersPipeline,
        customersWon,
        customersLost,
        conversionRate,
        upcomingRenewals,
        renewalsAtRisk,
        renewalSuccessRate,
        averageDealSize,
        monthlyGrowthRate,
      });
    }, 100);
  });
};
