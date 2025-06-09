
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import BulkImportDialog from './BulkImportDialog';
import { Partner } from '../types';

interface PartnerTableHeaderProps {
  filteredCount: number;
  totalCount: number;
  selectedCount: number;
  onBulkImport?: (partners: Partner[]) => void;
  onBulkAction: (action: string) => void;
}

const PartnerTableHeader = ({ 
  filteredCount, 
  totalCount, 
  selectedCount, 
  onBulkImport, 
  onBulkAction 
}: PartnerTableHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <h3 className="text-lg font-semibold">
        Partners Overview ({filteredCount} of {totalCount})
      </h3>
      <div className="flex items-center gap-2">
        {onBulkImport && (
          <BulkImportDialog
            type="partners"
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
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
};

export default PartnerTableHeader;
