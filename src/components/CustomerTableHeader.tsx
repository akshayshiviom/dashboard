
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import BulkImportDialog from './BulkImportDialog';
import { Customer } from '../types';

interface CustomerTableHeaderProps {
  filteredCount: number;
  totalCount: number;
  selectedCount: number;
  onBulkImport?: (customers: Customer[]) => void;
  onBulkAction: (action: string) => void;
}

const CustomerTableHeader = ({ 
  filteredCount, 
  totalCount, 
  selectedCount, 
  onBulkImport, 
  onBulkAction 
}: CustomerTableHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <h3 className="text-lg font-semibold">
        Customers ({filteredCount} of {totalCount})
      </h3>
      <div className="flex items-center gap-2">
        {onBulkImport && (
          <BulkImportDialog
            type="customers"
            onImport={onBulkImport}
          />
        )}
        
        {selectedCount > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Bulk Actions ({selectedCount})
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => onBulkAction('activate')}>
                Set Active
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onBulkAction('deactivate')}>
                Set Inactive
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onBulkAction('pending')}>
                Set Pending
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
};

export default CustomerTableHeader;
