
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger } from '@/components/ui/dropdown-menu';
import { Filter } from 'lucide-react';
import { Partner } from '../types';

interface CustomerTableFiltersProps {
  partners: Partner[];
  onStatusFilter: (status: string) => void;
  onPartnerFilter: (partnerId: string) => void;
  onZoneFilter: (zone: string) => void;
}

const CustomerTableFilters = ({ 
  partners, 
  onStatusFilter, 
  onPartnerFilter, 
  onZoneFilter 
}: CustomerTableFiltersProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Filter size={16} className="mr-2" />
          Filters
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            Filter by Status
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem onClick={() => onStatusFilter('all')}>
              All statuses
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onStatusFilter('active')}>
              Active
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onStatusFilter('pending')}>
              Pending
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onStatusFilter('inactive')}>
              Inactive
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            Filter by Partner
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem onClick={() => onPartnerFilter('all')}>
              All partners
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onPartnerFilter('unassigned')}>
              Unassigned
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {partners.map((partner) => (
              <DropdownMenuItem key={partner.id} onClick={() => onPartnerFilter(partner.id)}>
                {partner.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            Filter by Zone
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem onClick={() => onZoneFilter('all')}>
              All zones
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onZoneFilter('north')}>
              North
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onZoneFilter('east')}>
              East
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onZoneFilter('west')}>
              West
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onZoneFilter('south')}>
              South
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CustomerTableFilters;
