import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  CheckCircle, 
  AlertTriangle, 
  Clock,
  Target,
  BarChart3,
  RefreshCw,
  DollarSign
} from 'lucide-react';
import { DashboardStats } from '@/types';

interface DashboardMetricsGridProps {
  stats?: DashboardStats;
}

const DashboardMetricsGrid = ({ stats }: DashboardMetricsGridProps) => {
  if (!stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((index) => (
          <Card key={index} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-4 bg-muted rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-muted rounded w-full"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const taskCompletionRate = stats.totalTasks > 0 ? (stats.completedTasks / stats.totalTasks) * 100 : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Revenue Breakdown */}
      <Card className="col-span-1 md:col-span-2 lg:col-span-1">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-green-600" />
            Revenue Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">New Revenue</span>
            <span className="font-semibold">₹{stats.newRevenue.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Renewal Revenue</span>
            <span className="font-semibold">₹{stats.renewalRevenue.toLocaleString('en-IN')}</span>
          </div>
          <div className="border-t pt-2">
            <div className="flex justify-between items-center">
              <span className="font-medium">Total Revenue</span>
              <span className="text-lg font-bold text-primary">₹{stats.totalValue.toLocaleString('en-IN')}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-green-600" />
            <span className="text-sm text-green-600">+{stats.monthlyGrowthRate.toFixed(1)}% growth</span>
          </div>
        </CardContent>
      </Card>

      {/* Task Management Overview */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-blue-600" />
            Task Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Total Tasks</span>
            <span className="font-semibold">{stats.totalTasks}</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Completion Rate</span>
              <span>{taskCompletionRate.toFixed(0)}%</span>
            </div>
            <Progress value={taskCompletionRate} className="h-2" />
          </div>
          <div className="flex gap-2">
            {stats.overdueTasks > 0 && (
              <Badge variant="destructive" className="text-xs">
                {stats.overdueTasks} Overdue
              </Badge>
            )}
            {stats.highPriorityTasks > 0 && (
              <Badge variant="secondary" className="text-xs">
                {stats.highPriorityTasks} High Priority
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Partner Insights */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Users className="h-4 w-4 text-purple-600" />
            Partner Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Active Partners</span>
            <span className="font-semibold">{stats.activePartnersCount}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Onboarding</span>
            <span className="font-semibold">{stats.partnerOnboardingInProgress}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Avg Deal Size</span>
            <span className="font-semibold">₹{stats.averageDealSize.toLocaleString('en-IN')}</span>
          </div>
        </CardContent>
      </Card>

      {/* Customer Pipeline */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-orange-600" />
            Customer Pipeline
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">In Progress</span>
            <span className="font-semibold">{stats.customersPipeline}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Won</span>
            <span className="font-semibold text-green-600">{stats.customersWon}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Conversion Rate</span>
            <span className="font-semibold">{stats.conversionRate.toFixed(1)}%</span>
          </div>
        </CardContent>
      </Card>

      {/* Renewals Status */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <RefreshCw className="h-4 w-4 text-teal-600" />
            Renewals Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Upcoming (30d)</span>
            <span className="font-semibold">{stats.upcomingRenewals}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Success Rate</span>
            <span className="font-semibold">{stats.renewalSuccessRate.toFixed(1)}%</span>
          </div>
          {stats.renewalsAtRisk > 0 && (
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <span className="text-sm text-red-600">{stats.renewalsAtRisk} at risk</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Target className="h-4 w-4 text-indigo-600" />
            Key Alerts
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {stats.overdueTasks > 0 && (
            <div className="flex items-center gap-2 p-2 bg-red-50 rounded">
              <Clock className="h-3 w-3 text-red-500" />
              <span className="text-xs text-red-700">{stats.overdueTasks} overdue tasks</span>
            </div>
          )}
          {stats.renewalsAtRisk > 0 && (
            <div className="flex items-center gap-2 p-2 bg-yellow-50 rounded">
              <AlertTriangle className="h-3 w-3 text-yellow-500" />
              <span className="text-xs text-yellow-700">{stats.renewalsAtRisk} renewals at risk</span>
            </div>
          )}
          {stats.partnerOnboardingInProgress > 0 && (
            <div className="flex items-center gap-2 p-2 bg-blue-50 rounded">
              <Users className="h-3 w-3 text-blue-500" />
              <span className="text-xs text-blue-700">{stats.partnerOnboardingInProgress} partners onboarding</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardMetricsGrid;