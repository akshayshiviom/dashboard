
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, FileText, Download, Clock, Target, Users, BarChart } from 'lucide-react';
import { Customer, Partner, Product, User, Task } from '../types';

interface CustomReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customers: Customer[];
  partners: Partner[];
  products: Product[];
  users: User[];
  tasks: Task[];
}

const CustomReportDialog = ({ open, onOpenChange, customers, partners, products, users, tasks }: CustomReportDialogProps) => {
  const [reportType, setReportType] = useState('');
  const [dateRange, setDateRange] = useState('last-30-days');
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [filters, setFilters] = useState<Record<string, string>>({});

  const reportTypes = [
    { value: 'tasks', label: 'Task Performance Report', icon: Clock },
    { value: 'productivity', label: 'Productivity Analytics', icon: Target },
    { value: 'customers', label: 'Customer Report', icon: Users },
    { value: 'partners', label: 'Partner Report', icon: Users },
    { value: 'products', label: 'Product Report', icon: BarChart },
    { value: 'users', label: 'User Performance Report', icon: Users },
    { value: 'business-intelligence', label: 'Business Intelligence Report', icon: BarChart },
    { value: 'combined', label: 'Executive Summary Report', icon: BarChart },
  ];

  const dateRangeOptions = [
    { value: 'last-7-days', label: 'Last 7 days' },
    { value: 'last-30-days', label: 'Last 30 days' },
    { value: 'last-90-days', label: 'Last 90 days' },
    { value: 'current-month', label: 'Current month' },
    { value: 'current-year', label: 'Current year' },
    { value: 'custom', label: 'Custom range' },
  ];

  const getAvailableFields = (type: string) => {
    switch (type) {
      case 'tasks':
        return ['title', 'status', 'priority', 'type', 'assignedTo', 'customerId', 'partnerId', 'dueDate', 'createdAt', 'estimatedHours', 'actualHours', 'tags', 'completedAt'];
      case 'productivity':
        return ['taskCompletionRate', 'averageCompletionTime', 'overdueTasks', 'tasksByPriority', 'tasksByType', 'workloadDistribution', 'efficiencyMetrics'];
      case 'customers':
        return ['name', 'email', 'company', 'status', 'value', 'partner', 'products', 'createdAt', 'taskCount', 'lastTaskActivity'];
      case 'partners':
        return ['name', 'company', 'specialization', 'customersCount', 'totalValue', 'status', 'createdAt', 'onboardingStage', 'taskCount'];
      case 'products':
        return ['name', 'category', 'description', 'status', 'customersCount', 'createdAt', 'adoptionRate', 'revenueContribution'];
      case 'users':
        return ['name', 'email', 'role', 'department', 'status', 'reportingTo', 'lastLogin', 'taskCount', 'completionRate', 'productivity'];
      case 'business-intelligence':
        return ['revenueAnalytics', 'customerLifecycleValue', 'churnPrediction', 'growthMetrics', 'performanceKPIs', 'marketTrends'];
      case 'combined':
        return ['executiveSummary', 'keyMetrics', 'performance', 'revenue', 'growth', 'riskAnalysis', 'recommendations'];
      default:
        return [];
    }
  };

  const handleFieldToggle = (field: string) => {
    setSelectedFields(prev => 
      prev.includes(field) 
        ? prev.filter(f => f !== field)
        : [...prev, field]
    );
  };

  const handleGenerateReport = () => {
    console.log('Generating custom report:', {
      type: reportType,
      dateRange,
      fields: selectedFields,
      filters,
    });
    
    // In a real app, this would generate the actual report
    onOpenChange(false);
    
    // Reset form
    setReportType('');
    setSelectedFields([]);
    setFilters({});
  };

  const availableFields = getAvailableFields(reportType);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText size={20} />
            Create Custom Report
          </DialogTitle>
          <DialogDescription>
            Configure your custom report parameters and select the data you want to include.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Report Type Selection */}
          <div className="space-y-2">
            <Label>Report Type</Label>
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger>
                <SelectValue placeholder="Select report type" />
              </SelectTrigger>
              <SelectContent>
                {reportTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    <div className="flex items-center gap-2">
                      <type.icon size={16} />
                      {type.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date Range */}
          <div className="space-y-2">
            <Label>Date Range</Label>
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {dateRangeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Field Selection */}
          {reportType && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Select Fields to Include</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {availableFields.map((field) => (
                    <div key={field} className="flex items-center space-x-2">
                      <Checkbox
                        id={field}
                        checked={selectedFields.includes(field)}
                        onCheckedChange={() => handleFieldToggle(field)}
                      />
                      <Label
                        htmlFor={field}
                        className="text-sm font-normal capitalize cursor-pointer"
                      >
                        {field.replace(/([A-Z])/g, ' $1').trim()}
                      </Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Filters */}
          {reportType && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Filters (Optional)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {reportType === 'tasks' && (
                    <>
                      <div>
                        <Label className="text-sm">Task Status</Label>
                        <Select onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="All statuses" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All statuses</SelectItem>
                            <SelectItem value="pending">Pending only</SelectItem>
                            <SelectItem value="in-progress">In Progress only</SelectItem>
                            <SelectItem value="completed">Completed only</SelectItem>
                            <SelectItem value="overdue">Overdue only</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-sm">Priority Level</Label>
                        <Select onValueChange={(value) => setFilters(prev => ({ ...prev, priority: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="All priorities" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All priorities</SelectItem>
                            <SelectItem value="urgent">Urgent only</SelectItem>
                            <SelectItem value="high">High only</SelectItem>
                            <SelectItem value="medium">Medium only</SelectItem>
                            <SelectItem value="low">Low only</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </>
                  )}

                  {reportType === 'productivity' && (
                    <>
                      <div>
                        <Label className="text-sm">Time Period</Label>
                        <Select onValueChange={(value) => setFilters(prev => ({ ...prev, period: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select period" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="week">This Week</SelectItem>
                            <SelectItem value="month">This Month</SelectItem>
                            <SelectItem value="quarter">This Quarter</SelectItem>
                            <SelectItem value="year">This Year</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-sm">User Group</Label>
                        <Select onValueChange={(value) => setFilters(prev => ({ ...prev, userGroup: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="All users" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All users</SelectItem>
                            <SelectItem value="team">My team</SelectItem>
                            <SelectItem value="department">My department</SelectItem>
                            <SelectItem value="individual">Individual only</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </>
                  )}

                  {reportType === 'customers' && (
                    <>
                      <div>
                        <Label className="text-sm">Status</Label>
                        <Select onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="All statuses" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All statuses</SelectItem>
                            <SelectItem value="active">Active only</SelectItem>
                            <SelectItem value="pending">Pending only</SelectItem>
                            <SelectItem value="inactive">Inactive only</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-sm">Minimum Value</Label>
                        <Select onValueChange={(value) => setFilters(prev => ({ ...prev, minValue: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Any value" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0">Any value</SelectItem>
                            <SelectItem value="10000">₹10,000+</SelectItem>
                            <SelectItem value="25000">₹25,000+</SelectItem>
                            <SelectItem value="50000">₹50,000+</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </>
                  )}
                  
                  {reportType === 'partners' && (
                    <>
                      <div>
                        <Label className="text-sm">Status</Label>
                        <Select onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="All statuses" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All statuses</SelectItem>
                            <SelectItem value="active">Active only</SelectItem>
                            <SelectItem value="inactive">Inactive only</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-sm">Onboarding Stage</Label>
                        <Select onValueChange={(value) => setFilters(prev => ({ ...prev, onboardingStage: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="All stages" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All stages</SelectItem>
                            <SelectItem value="outreach">Outreach</SelectItem>
                            <SelectItem value="product-overview">Product Overview</SelectItem>
                            <SelectItem value="partner-program">Partner Program</SelectItem>
                            <SelectItem value="kyc">KYC</SelectItem>
                            <SelectItem value="agreement">Agreement</SelectItem>
                            <SelectItem value="onboarded">Onboarded</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </>
                  )}

                  {reportType === 'business-intelligence' && (
                    <>
                      <div>
                        <Label className="text-sm">Analysis Type</Label>
                        <Select onValueChange={(value) => setFilters(prev => ({ ...prev, analysisType: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select analysis" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="revenue">Revenue Analysis</SelectItem>
                            <SelectItem value="customer-lifecycle">Customer Lifecycle</SelectItem>
                            <SelectItem value="predictive">Predictive Analytics</SelectItem>
                            <SelectItem value="competitive">Competitive Analysis</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-sm">Forecast Period</Label>
                        <Select onValueChange={(value) => setFilters(prev => ({ ...prev, forecastPeriod: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select period" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="3months">3 Months</SelectItem>
                            <SelectItem value="6months">6 Months</SelectItem>
                            <SelectItem value="1year">1 Year</SelectItem>
                            <SelectItem value="2years">2 Years</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleGenerateReport}
              disabled={!reportType || selectedFields.length === 0}
              className="gap-2"
            >
              <Download size={16} />
              Generate Report
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CustomReportDialog;
