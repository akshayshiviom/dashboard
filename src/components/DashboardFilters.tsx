
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import DashboardEditDialog from './DashboardEditDialog';
import DashboardSelector from './dashboard/DashboardSelector';
import TimeframePicker from './dashboard/TimeframePicker';
import CustomDatePicker from './dashboard/CustomDatePicker';
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
  const [isEditingDashboard, setIsEditingDashboard] = useState(false);

  const currentDashboard = dashboards.find(d => d.id === activeDashboard);

  const handleEditDashboard = (updates: Partial<Dashboard>) => {
    onUpdateDashboard(activeDashboard, updates);
    setIsEditingDashboard(false);
  };

  return (
    <>
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <DashboardSelector
              dashboards={dashboards}
              activeDashboard={activeDashboard}
              onDashboardChange={onDashboardChange}
              onCreateDashboard={onCreateDashboard}
              onDeleteDashboard={onDeleteDashboard}
              onEditClick={() => setIsEditingDashboard(true)}
            />

            <TimeframePicker
              timeframe={timeframe}
              onTimeframeChange={onTimeframeChange}
            />

            {timeframe === 'custom' && (
              <CustomDatePicker
                customDateRange={customDateRange}
                onCustomDateChange={onCustomDateChange}
              />
            )}
          </div>
        </CardContent>
      </Card>

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
