
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface CustomDatePickerProps {
  customDateRange?: {
    from: Date;
    to: Date;
  };
  onCustomDateChange: (dateRange: { from: Date; to: Date }) => void;
}

const CustomDatePicker = ({ customDateRange, onCustomDateChange }: CustomDatePickerProps) => {
  const [fromDate, setFromDate] = useState<Date | undefined>(customDateRange?.from);
  const [toDate, setToDate] = useState<Date | undefined>(customDateRange?.to);

  useEffect(() => {
    setFromDate(customDateRange?.from);
    setToDate(customDateRange?.to);
  }, [customDateRange]);

  const handleCustomDateChange = () => {
    if (fromDate && toDate) {
      onCustomDateChange({ from: fromDate, to: toDate });
    }
  };

  return (
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
  );
};

export default CustomDatePicker;
