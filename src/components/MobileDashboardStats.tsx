
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  Tag, 
  DollarSign, 
  TrendingUp, 
  CheckCircle, 
  BarChart3
} from 'lucide-react';
import { DashboardStats as StatsType } from '../types';

interface MobileDashboardStatsProps {
  stats?: StatsType;
}

const MobileDashboardStats = ({ stats }: MobileDashboardStatsProps) => {
  if (!stats) {
    return (
      <div className="grid grid-cols-2 gap-3 p-4">
        {[1, 2, 3, 4].map((index) => (
          <Card key={index} className="transition-all hover:shadow-md">
            <CardContent className="p-3">
              <div className="flex items-center justify-between space-x-2">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-muted-foreground truncate">
                    Loading...
                  </p>
                  <div className="h-5 w-12 bg-muted rounded animate-pulse mt-1" />
                </div>
                <div className="h-5 w-5 bg-muted rounded animate-pulse flex-shrink-0" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

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

  const taskCompletionRate = stats.totalTasks > 0 ? (stats.completedTasks / stats.totalTasks) * 100 : 0;

  return (
    <div className="space-y-3">
      {/* Main KPI Cards */}
      <div className="grid grid-cols-2 gap-2 p-3">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="transition-all hover:shadow-md">
              <CardContent className="p-2">
                <div className="flex items-center justify-between space-x-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-muted-foreground truncate">
                      {stat.title}
                    </p>
                    <p className="text-base font-bold truncate">{stat.value}</p>
                  </div>
                  <Icon className={`h-4 w-4 ${stat.color} flex-shrink-0`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Mobile-optimized Additional Metrics */}
      <div className="px-3 space-y-3">
        {/* Revenue Breakdown */}
        <Card>
          <CardHeader className="pb-1">
            <CardTitle className="text-xs flex items-center gap-2">
              <DollarSign className="h-3 w-3 text-green-600" />
              Revenue Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 pt-1">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">New</span>
              <span>₹{stats.newRevenue.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Renewal</span>
              <span>₹{stats.renewalRevenue.toLocaleString('en-IN')}</span>
            </div>
          </CardContent>
        </Card>

        {/* Tasks & Alerts */}
        <Card>
          <CardHeader className="pb-1">
            <CardTitle className="text-xs flex items-center gap-2">
              <CheckCircle className="h-3 w-3 text-blue-600" />
              Tasks & Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 pt-1">
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span>Completion</span>
                <span>{taskCompletionRate.toFixed(0)}%</span>
              </div>
              <Progress value={taskCompletionRate} className="h-1" />
            </div>
            <div className="flex gap-1 flex-wrap">
              {stats.overdueTasks > 0 && (
                <Badge variant="destructive" className="text-xs px-1 py-0">
                  {stats.overdueTasks} Overdue
                </Badge>
              )}
              {stats.renewalsAtRisk > 0 && (
                <Badge variant="secondary" className="text-xs px-1 py-0">
                  {stats.renewalsAtRisk} At Risk
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardHeader className="pb-1">
            <CardTitle className="text-xs flex items-center gap-2">
              <BarChart3 className="h-3 w-3 text-orange-600" />
              Quick Stats
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 pt-1">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Conversion Rate</span>
              <span>{stats.conversionRate.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Upcoming Renewals</span>
              <span>{stats.upcomingRenewals}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Partners Onboarding</span>
              <span>{stats.partnerOnboardingInProgress}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MobileDashboardStats;
