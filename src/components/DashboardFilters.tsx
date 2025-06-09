import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Calendar as CalendarIcon, TrendingUp, Plus, Edit, Trash2, Settings } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import DashboardEditDialog from './DashboardEditDialog';
import { Customer, Partner, Product } from '@/types';

interface Dashboard {
  id: string;
  name: string;
  description?: string;
  timeframe: 'monthly' | 'yearly' | 'custom';
  customDateRange?: {
    from: Date;
    to: Date;
  };
  widgets: {
    showStats: boolean;
    showChart: boolean;
    showRenewals: boolean;
    showCustomerTable: boolean;
  };
  filters: {
    customerStatus?: string[];
    partnerIds?: string[];
    productIds?: string[];
  };
}

interface DashboardFiltersProps {
  timeframe: 'monthly' | 'yearly' | 'custom';
  onTimeframeChange: (timeframe: 'monthly' | 'yearly' | 'custom') => void;
  customDateRange?: {
    from: Date;
    to: Date;
  };
  onCustomDateChange: (dateRange: { from: Date; to: Date }) => void;
  dashboards: Dashboard[];
  activeDashboard: string;
  onDashboardChange: (dashboardId: string) => void;
  onCreateDashboard: (name: string, description?: string) => void;
  onUpdateDashboard: (dashboardId: string, updates: Partial<Dashboard>) => void;
  onDeleteDashboard: (dashboardId: string) => void;
  customers: Customer[];
  partners: Partner[];
  products: Product[];
}

const DashboardFilters = ({ 
  timeframe, 
  onTimeframeChange,
  customDateRange,
  onCustomDateChange,
  dashboards,
  activeDashboard,
  onDashboardChange,
  onCreateDashboard,
  onUpdateDashboard,
  onDeleteDashboard,
  customers,
  partners,
  products
}: DashboardFiltersProps) => {
  const [isCreatingDashboard, setIsCreatingDashboard] = useState(false);
  const [isEditingDashboard, setIsEditingDashboard] = useState(false);
  const [newDashboardName, setNewDashboardName] = useState('');
  const [newDashboardDescription, setNewDashboardDescription] = useState('');
  const [fromDate, setFromDate] = useState<Date | undefined>(customDateRange?.from);
  const [toDate, setToDate] = useState<Date | undefined>(customDateRange?.to);

  const currentDashboard = dashboards.find(d => d.id === activeDashboard);

  const handleCreateDashboard = () => {
    if (newDashboardName.trim()) {
      onCreateDashboard(newDashboardName.trim(), newDashboardDescription.trim() || undefined);
      setNewDashboardName('');
      setNewDashboardDescription('');
      setIsCreatingDashboard(false);
    }
  };

  const handleEditDashboard = (updates: Partial<Dashboard>) => {
    onUpdateDashboard(activeDashboard, updates);
    setIsEditingDashboard(false);
  };

  const handleCustomDateChange = () => {
    if (fromDate && toDate) {
      onCustomDateChange({ from: fromDate, to: toDate });
    }
  };

  return (
    <>
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="space-y-4">
            {/* Dashboard Selection */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <TrendingUp size={20} className="text-muted-foreground" />
                  <span className="text-sm font-medium">Dashboard:</span>
                </div>
                <Select value={activeDashboard} onValueChange={onDashboardChange}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Select dashboard" />
                  </SelectTrigger>
                  <SelectContent>
                    {dashboards.map((dashboard) => (
                      <SelectItem key={dashboard.id} value={dashboard.id}>
                        <div>
                          <div className="font-medium">{dashboard.name}</div>
                          {dashboard.description && (
                            <div className="text-xs text-muted-foreground">{dashboard.description}</div>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsCreatingDashboard(true)}
                  className="gap-2"
                >
                  <Plus size={16} />
                  New Dashboard
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditingDashboard(true)}
                  className="gap-2"
                >
                  <Settings size={16} />
                  Edit Dashboard
                </Button>
                {dashboards.length > 1 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDeleteDashboard(activeDashboard)}
                    className="gap-2"
                  >
                    <Trash2 size={16} />
                    Delete
                  </Button>
                )}
              </div>
            </div>

            {/* Create Dashboard Form */}
            {isCreatingDashboard && (
              <div className="space-y-3 p-3 bg-muted rounded-lg">
                <input
                  type="text"
                  placeholder="Dashboard name"
                  value={newDashboardName}
                  onChange={(e) => setNewDashboardName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                />
                <input
                  type="text"
                  placeholder="Dashboard description (optional)"
                  value={newDashboardDescription}
                  onChange={(e) => setNewDashboardDescription(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                />
                <div className="flex gap-2">
                  <Button onClick={handleCreateDashboard} size="sm">
                    Create
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setIsCreatingDashboard(false);
                      setNewDashboardName('');
                      setNewDashboardDescription('');
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {/* Timeframe Selection */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <CalendarIcon size={20} className="text-muted-foreground" />
                <span className="text-sm font-medium">Time Period:</span>
              </div>
              <Select value={timeframe} onValueChange={onTimeframeChange}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select timeframe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly View</SelectItem>
                  <SelectItem value="yearly">Yearly View</SelectItem>
                  <SelectItem value="custom">Custom Date Range</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Custom Date Range */}
            {timeframe === 'custom' && (
              <div className="flex items-center gap-4 p-3 bg-muted rounded-lg">
                <span className="text-sm font-medium">From:</span>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-[200px] justify-start text-left font-normal",
                        !fromDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {fromDate ? format(fromDate, "PPP") : <span>Pick start date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={fromDate}
                      onSelect={setFromDate}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>

                <span className="text-sm font-medium">To:</span>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-[200px] justify-start text-left font-normal",
                        !toDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {toDate ? format(toDate, "PPP") : <span>Pick end date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={toDate}
                      onSelect={setToDate}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>

                <Button onClick={handleCustomDateChange} disabled={!fromDate || !toDate}>
                  Apply
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Dashboard Edit Dialog */}
      {isEditingDashboard && currentDashboard && (
        <DashboardEditDialog
          dashboard={currentDashboard}
          onSave={handleEditDashboard}
          onCancel={() => setIsEditingDashboard(false)}
          customers={customers}
          partners={partners}
          products={products}
        />
      )}
    </>
  );
};

export default DashboardFilters;
