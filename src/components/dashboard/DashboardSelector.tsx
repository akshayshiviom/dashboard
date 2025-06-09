
import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { TrendingUp, Plus, Settings, Trash2 } from 'lucide-react';

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

interface DashboardSelectorProps {
  dashboards: Dashboard[];
  activeDashboard: string;
  onDashboardChange: (dashboardId: string) => void;
  onCreateDashboard: (name: string, description?: string) => void;
  onDeleteDashboard: (dashboardId: string) => void;
  onEditClick: () => void;
}

const DashboardSelector = ({
  dashboards,
  activeDashboard,
  onDashboardChange,
  onCreateDashboard,
  onDeleteDashboard,
  onEditClick
}: DashboardSelectorProps) => {
  const [isCreatingDashboard, setIsCreatingDashboard] = useState(false);
  const [newDashboardName, setNewDashboardName] = useState('');
  const [newDashboardDescription, setNewDashboardDescription] = useState('');

  const handleCreateDashboard = () => {
    if (newDashboardName.trim()) {
      onCreateDashboard(newDashboardName.trim(), newDashboardDescription.trim() || undefined);
      setNewDashboardName('');
      setNewDashboardDescription('');
      setIsCreatingDashboard(false);
    }
  };

  return (
    <>
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
            onClick={onEditClick}
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
    </>
  );
};

export default DashboardSelector;
