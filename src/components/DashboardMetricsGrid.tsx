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
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4">
        {[1, 2, 3, 4, 5, 6].map((index) => (
          <Card key={index} className="animate-pulse">
            <CardHeader className="pb-1">
              <div className="h-3 bg-muted rounded w-3/4"></div>
            </CardHeader>
            <CardContent className="pt-1">
              <div className="h-6 bg-muted rounded w-1/2 mb-1"></div>
              <div className="h-2 bg-muted rounded w-full"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const taskCompletionRate = stats.totalTasks > 0 ? (stats.completedTasks / stats.totalTasks) * 100 : 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4">
      {/* Revenue Breakdown */}
      <Card>
        <CardHeader className="pb-1">
          <CardTitle className="text-xs font-medium flex items-center gap-2">
            <DollarSign className="h-3 w-3 text-green-600" />
            Revenue Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 pt-1">
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">New Revenue</span>
            <span className="text-sm font-semibold">₹{stats.newRevenue.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">Renewal Revenue</span>
            <span className="text-sm font-semibold">₹{stats.renewalRevenue.toLocaleString('en-IN')}</span>
          </div>
          <div className="border-t pt-1">
            <div className="flex justify-between items-center">
              <span className="text-xs font-medium">Total Revenue</span>
              <span className="text-sm font-bold text-primary">₹{stats.totalValue.toLocaleString('en-IN')}</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <TrendingUp className="h-3 w-3 text-green-600" />
            <span className="text-xs text-green-600">+{stats.monthlyGrowthRate.toFixed(1)}%</span>
          </div>
        </CardContent>
      </Card>

      {/* Task Management Overview */}
      <Card>
        <CardHeader className="pb-1">
          <CardTitle className="text-xs font-medium flex items-center gap-2">
            <CheckCircle className="h-3 w-3 text-blue-600" />
            Task Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 pt-1">
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">Total Tasks</span>
            <span className="text-sm font-semibold">{stats.totalTasks}</span>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span>Completion Rate</span>
              <span>{taskCompletionRate.toFixed(0)}%</span>
            </div>
            <Progress value={taskCompletionRate} className="h-1" />
          </div>
          <div className="flex gap-1">
            {stats.overdueTasks > 0 && (
              <Badge variant="destructive" className="text-xs px-1 py-0">
                {stats.overdueTasks} Overdue
              </Badge>
            )}
            {stats.highPriorityTasks > 0 && (
              <Badge variant="secondary" className="text-xs px-1 py-0">
                {stats.highPriorityTasks} High
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Partner Insights */}
      <Card>
        <CardHeader className="pb-1">
          <CardTitle className="text-xs font-medium flex items-center gap-2">
            <Users className="h-3 w-3 text-purple-600" />
            Partner Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 pt-1">
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">Active Partners</span>
            <span className="text-sm font-semibold">{stats.activePartnersCount}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">Onboarding</span>
            <span className="text-sm font-semibold">{stats.partnerOnboardingInProgress}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">Avg Deal Size</span>
            <span className="text-sm font-semibold">₹{stats.averageDealSize.toLocaleString('en-IN')}</span>
          </div>
        </CardContent>
      </Card>

      {/* Customer Pipeline */}
      <Card>
        <CardHeader className="pb-1">
          <CardTitle className="text-xs font-medium flex items-center gap-2">
            <BarChart3 className="h-3 w-3 text-orange-600" />
            Customer Pipeline
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 pt-1">
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">In Progress</span>
            <span className="text-sm font-semibold">{stats.customersPipeline}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">Won</span>
            <span className="text-sm font-semibold text-green-600">{stats.customersWon}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">Conversion Rate</span>
            <span className="text-sm font-semibold">{stats.conversionRate.toFixed(1)}%</span>
          </div>
        </CardContent>
      </Card>

      {/* Renewals Status */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <RefreshCw className="h-5 w-5 text-teal-600" />
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
        <CardHeader className="pb-1">
          <CardTitle className="text-xs font-medium flex items-center gap-2">
            <Target className="h-3 w-3 text-indigo-600" />
            Key Alerts
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1 pt-1">
          {stats.overdueTasks > 0 && (
            <div className="flex items-center gap-2 p-1 bg-red-50 rounded">
              <Clock className="h-3 w-3 text-red-500" />
              <span className="text-xs text-red-700">{stats.overdueTasks} overdue</span>
            </div>
          )}
          {stats.renewalsAtRisk > 0 && (
            <div className="flex items-center gap-2 p-1 bg-yellow-50 rounded">
              <AlertTriangle className="h-3 w-3 text-yellow-500" />
              <span className="text-xs text-yellow-700">{stats.renewalsAtRisk} at risk</span>
            </div>
          )}
          {stats.partnerOnboardingInProgress > 0 && (
            <div className="flex items-center gap-2 p-1 bg-blue-50 rounded">
              <Users className="h-3 w-3 text-blue-500" />
              <span className="text-xs text-blue-700">{stats.partnerOnboardingInProgress} onboarding</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardMetricsGrid;