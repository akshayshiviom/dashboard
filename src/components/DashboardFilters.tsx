
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, TrendingUp } from 'lucide-react';

interface DashboardFiltersProps {
  timeframe: 'monthly' | 'yearly';
  onTimeframeChange: (timeframe: 'monthly' | 'yearly') => void;
}

const DashboardFilters = ({ timeframe, onTimeframeChange }: DashboardFiltersProps) => {
  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <TrendingUp size={20} className="text-muted-foreground" />
            <span className="text-sm font-medium">Dashboard View:</span>
          </div>
          <Select value={timeframe} onValueChange={onTimeframeChange}>
            <SelectTrigger className="w-48">
              <Calendar size={16} className="mr-2" />
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">Monthly View</SelectItem>
              <SelectItem value="yearly">Yearly View</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardFilters;
