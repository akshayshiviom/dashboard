
import { Card, CardContent } from '@/components/ui/card';
import { Users, Tag, DollarSign, TrendingUp } from 'lucide-react';
import { DashboardStats as StatsType } from '../types';

interface MobileDashboardStatsProps {
  stats: StatsType;
}

const MobileDashboardStats = ({ stats }: MobileDashboardStatsProps) => {
  const statCards = [
    {
      title: 'Customers',
      value: stats.totalCustomers.toString(),
      icon: Users,
      color: 'text-blue-600',
    },
    {
      title: 'Partners',
      value: stats.totalPartners.toString(),
      icon: Tag,
      color: 'text-green-600',
    },
    {
      title: 'Total Value',
      value: `₹${stats.totalValue.toLocaleString('en-IN')}`,
      icon: DollarSign,
      color: 'text-purple-600',
    },
    {
      title: 'Active',
      value: stats.activeCustomers.toString(),
      icon: TrendingUp,
      color: 'text-orange-600',
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 p-4">
      {statCards.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title} className="transition-all hover:shadow-md">
            <CardContent className="p-3">
              <div className="flex items-center justify-between space-x-2">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-muted-foreground truncate">
                    {stat.title}
                  </p>
                  <p className="text-lg font-bold truncate">{stat.value}</p>
                </div>
                <Icon className={`h-5 w-5 ${stat.color} flex-shrink-0`} />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default MobileDashboardStats;
