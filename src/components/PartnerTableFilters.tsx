
import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger } from '@/components/ui/dropdown-menu';
import { Filter, Search } from 'lucide-react';

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
  const [specializationSearchTerm, setSpecializationSearchTerm] = useState('');
  const specializations = ['Enterprise Software', 'Digital Marketing', 'Cloud Services', 'Consulting', 'E-commerce'];

  const filteredSpecializations = useMemo(() => {
    return specializations.filter(spec => 
      spec.toLowerCase().includes(specializationSearchTerm.toLowerCase())
    );
  }, [specializations, specializationSearchTerm]);

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
            <DropdownMenuItem onClick={() => onIdentityFilter('cyber-security')}>
              Cyber Security
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onIdentityFilter('cloud-hosting')}>
              Cloud Hosting
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onIdentityFilter('web-hosting')}>
              Web Hosting
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onIdentityFilter('hardware')}>
              Hardware
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onIdentityFilter('cloud-service-provider')}>
              Cloud Service Provider
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onIdentityFilter('microsoft-partner')}>
              Microsoft Partner
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onIdentityFilter('aws-partner')}>
              AWS Partner
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onIdentityFilter('it-consulting')}>
              IT Consulting
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onIdentityFilter('freelance')}>
              Freelance
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            Filter by Partner Program
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="w-64">
            <div className="p-2">
              <div className="relative">
                <Search size={14} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search programs..."
                  value={specializationSearchTerm}
                  onChange={(e) => setSpecializationSearchTerm(e.target.value)}
                  className="pl-8 h-8 text-sm"
                />
              </div>
            </div>
            <DropdownMenuSeparator />
            <div className="max-h-48 overflow-y-auto">
              <DropdownMenuItem onClick={() => onSpecializationFilter('all')}>
                All programs
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {filteredSpecializations.map((spec) => (
                <DropdownMenuItem key={spec} onClick={() => onSpecializationFilter(spec)}>
                  {spec}
                </DropdownMenuItem>
              ))}
              {filteredSpecializations.length === 0 && specializationSearchTerm && (
                <div className="px-2 py-2 text-sm text-muted-foreground">
                  No programs found
                </div>
              )}
            </div>
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
