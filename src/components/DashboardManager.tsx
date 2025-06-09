import { useState } from 'react';

export interface Dashboard {
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

export const defaultDashboards: Dashboard[] = [
  { 
    id: 'default', 
    name: 'Main Dashboard', 
    description: 'Default dashboard view',
    timeframe: 'monthly',
    widgets: {
      showStats: true,
      showChart: true,
      showRenewals: true,
      showCustomerTable: false
    },
    filters: {}
  }
];

export const DashboardManager = {
  createDashboard: (name: string, setDashboards: React.Dispatch<React.SetStateAction<Dashboard[]>>, description?: string) => {
    const newDashboard: Dashboard = {
      id: `dashboard-${Date.now()}`,
      name,
      description,
      timeframe: 'monthly',
      widgets: {
        showStats: true,
        showChart: true,
        showRenewals: true,
        showCustomerTable: false
      },
      filters: {}
    };
    setDashboards(prev => [...prev, newDashboard]);
  },

  updateDashboard: (dashboardId: string, updates: Partial<Dashboard>, setDashboards: React.Dispatch<React.SetStateAction<Dashboard[]>>) => {
    setDashboards(prev => prev.map(dashboard => 
      dashboard.id === dashboardId 
        ? { ...dashboard, ...updates }
        : dashboard
    ));
  },

  deleteDashboard: (dashboardId: string, setDashboards: React.Dispatch<React.SetStateAction<Dashboard[]>>, setActiveDashboard: React.Dispatch<React.SetStateAction<string>>, dashboards: Dashboard[]) => {
    if (dashboards.length <= 1) return;
    
    setDashboards(prev => prev.filter(d => d.id !== dashboardId));
    const remainingDashboard = dashboards.find(d => d.id !== dashboardId);
    if (remainingDashboard) {
      setActiveDashboard(remainingDashboard.id);
    }
  }
};

interface DashboardManagerProps {
  onDashboardChange: (dashboardId: string) => void;
  onTimeframeChange: (timeframe: 'monthly' | 'yearly' | 'custom') => void;
  onCustomDateChange: (dateRange: { from: Date; to: Date }) => void;
}

export const useDashboardManager = ({ 
  onDashboardChange, 
  onTimeframeChange, 
  onCustomDateChange 
}: DashboardManagerProps) => {
  const [dashboards, setDashboards] = useState<Dashboard[]>([
    { 
      id: 'default', 
      name: 'Main Dashboard', 
      description: 'Default dashboard view',
      timeframe: 'monthly',
      widgets: {
        showStats: true,
        showChart: true,
        showRenewals: true,
        showCustomerTable: false
      },
      filters: {}
    }
  ]);
  const [activeDashboard, setActiveDashboard] = useState('default');
  const [timeframe, setTimeframe] = useState<'monthly' | 'yearly' | 'custom'>('monthly');
  const [customDateRange, setCustomDateRange] = useState<{ from: Date; to: Date } | undefined>();

  const handleDashboardChange = (dashboardId: string) => {
    setActiveDashboard(dashboardId);
    const dashboard = dashboards.find(d => d.id === dashboardId);
    if (dashboard) {
      setTimeframe(dashboard.timeframe);
      setCustomDateRange(dashboard.customDateRange);
      onTimeframeChange(dashboard.timeframe);
      if (dashboard.customDateRange) {
        onCustomDateChange(dashboard.customDateRange);
      }
    }
    onDashboardChange(dashboardId);
  };

  const handleTimeframeChange = (newTimeframe: 'monthly' | 'yearly' | 'custom') => {
    setTimeframe(newTimeframe);
    setDashboards(prev => prev.map(dashboard => 
      dashboard.id === activeDashboard 
        ? { ...dashboard, timeframe: newTimeframe }
        : dashboard
    ));
    onTimeframeChange(newTimeframe);
  };

  const handleCustomDateChange = (dateRange: { from: Date; to: Date }) => {
    setCustomDateRange(dateRange);
    setDashboards(prev => prev.map(dashboard => 
      dashboard.id === activeDashboard 
        ? { ...dashboard, customDateRange: dateRange }
        : dashboard
    ));
    onCustomDateChange(dateRange);
  };

  const handleCreateDashboard = (name: string, description?: string) => {
    const newDashboard: Dashboard = {
      id: `dashboard-${Date.now()}`,
      name,
      description,
      timeframe: 'monthly',
      widgets: {
        showStats: true,
        showChart: true,
        showRenewals: true,
        showCustomerTable: false
      },
      filters: {}
    };
    setDashboards(prev => [...prev, newDashboard]);
    setActiveDashboard(newDashboard.id);
    setTimeframe('monthly');
    setCustomDateRange(undefined);
    onTimeframeChange('monthly');
  };

  const handleUpdateDashboard = (dashboardId: string, updates: Partial<Dashboard>) => {
    setDashboards(prev => prev.map(dashboard => 
      dashboard.id === dashboardId 
        ? { ...dashboard, ...updates }
        : dashboard
    ));
  };

  const handleDeleteDashboard = (dashboardId: string) => {
    if (dashboards.length <= 1) return;
    
    setDashboards(prev => prev.filter(d => d.id !== dashboardId));
    if (activeDashboard === dashboardId) {
      const remainingDashboard = dashboards.find(d => d.id !== dashboardId);
      if (remainingDashboard) {
        setActiveDashboard(remainingDashboard.id);
        setTimeframe(remainingDashboard.timeframe);
        setCustomDateRange(remainingDashboard.customDateRange);
        onTimeframeChange(remainingDashboard.timeframe);
        if (remainingDashboard.customDateRange) {
          onCustomDateChange(remainingDashboard.customDateRange);
        }
      }
    }
  };

  const getCurrentDashboard = () => {
    return dashboards.find(d => d.id === activeDashboard) || dashboards[0];
  };

  return {
    dashboards,
    activeDashboard,
    timeframe,
    customDateRange,
    handleDashboardChange,
    handleTimeframeChange,
    handleCustomDateChange,
    handleCreateDashboard,
    handleUpdateDashboard,
    handleDeleteDashboard,
    getCurrentDashboard
  };
};

export type { Dashboard };
