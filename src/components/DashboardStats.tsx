
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Tag, DollarSign, TrendingUp } from 'lucide-react';
import { DashboardStats as StatsType } from '../types';

interface DashboardStatsProps {
  stats: StatsType;
}

const DashboardStats = ({ stats }: DashboardStatsProps) => {
  const statCards = [
    {
      title: 'Total Customers',
      value: stats.totalCustomers.toString(),
      icon: Users,
      color: 'text-blue-600',
    },
    {
      title: 'Active Partners',
      value: stats.totalPartners.toString(),
      icon: Tag,
      color: 'text-green-600',
    },
    {
      title: 'Total Value',
      value: `$${stats.totalValue.toLocaleString()}`,
      icon: DollarSign,
      color: 'text-purple-600',
    },
    {
      title: 'Active Customers',
      value: stats.activeCustomers.toString(),
      icon: TrendingUp,
      color: 'text-orange-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statCards.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title} className="transition-all hover:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <Icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default DashboardStats;
