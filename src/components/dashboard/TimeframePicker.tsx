
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar as CalendarIcon } from 'lucide-react';

interface TimeframePickerProps {
  timeframe: 'monthly' | 'yearly' | 'custom';
  onTimeframeChange: (timeframe: 'monthly' | 'yearly' | 'custom') => void;
}

const TimeframePicker = ({ timeframe, onTimeframeChange }: TimeframePickerProps) => {
  return (
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
  );
};

export default TimeframePicker;
