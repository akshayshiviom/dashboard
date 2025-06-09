
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger } from '@/components/ui/dropdown-menu';
import { Filter } from 'lucide-react';

interface PartnerTableFiltersProps {
  onStatusFilter: (status: string) => void;
  onIdentityFilter: (identity: string) => void;
  onSpecializationFilter: (specialization: string) => void;
  onZoneFilter: (zone: string) => void;
}

const PartnerTableFilters = ({
  onStatusFilter,
  onIdentityFilter,
  onSpecializationFilter,
  onZoneFilter
}: PartnerTableFiltersProps) => {
  const specializations = ['Enterprise Software', 'Digital Marketing', 'Cloud Services', 'Consulting', 'E-commerce'];

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
            <DropdownMenuItem onClick={() => onStatusFilter('inactive')}>
              Inactive
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            Filter by Identity
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem onClick={() => onIdentityFilter('all')}>
              All identities
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onIdentityFilter('web-app-developer')}>
              Web/App Developer
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onIdentityFilter('system-integrator')}>
              System Integrator
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onIdentityFilter('managed-service-provider')}>
              Managed Service Provider
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onIdentityFilter('digital-marketer')}>
              Digital Marketer
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            Filter by Partner Program
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem onClick={() => onSpecializationFilter('all')}>
              All programs
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {specializations.map((spec) => (
              <DropdownMenuItem key={spec} onClick={() => onSpecializationFilter(spec)}>
                {spec}
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

export default PartnerTableFilters;
