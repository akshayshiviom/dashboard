
import { useState, useMemo } from 'react';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Partner, Customer, Product, User } from '../types';
import PartnerDetails from './PartnerDetails';
import PartnerTableHeader from './PartnerTableHeader';
import PartnerTableFilters from './PartnerTableFilters';
import PartnerTableRow from './PartnerTableRow';

interface PartnerTableProps {
  partners: Partner[];
  customers: Customer[];
  products: Product[];
  users: User[];
  onStatusChange?: (partnerId: string, newStatus: 'active' | 'inactive') => void;
  onBulkStatusChange?: (partnerIds: string[], newStatus: 'active' | 'inactive') => void;
  onBulkImport?: (partners: Partner[]) => void;
}

const PartnerTable = ({ partners, customers, products, users, onStatusChange, onBulkStatusChange, onBulkImport }: PartnerTableProps) => {
  const [statusFilter, setStatusFilter] = useState('all');
  const [customersFilter, setCustomersFilter] = useState(0);
  const [revenueFilter, setRevenueFilter] = useState(0);
  const [specializationFilter, setSpecializationFilter] = useState('all');
  const [zoneFilter, setZoneFilter] = useState('all');
  const [identityFilter, setIdentityFilter] = useState('all');
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [selectedPartners, setSelectedPartners] = useState<string[]>([]);

  const filteredPartners = useMemo(() => {
    return partners.filter((partner) => {
      const statusMatch = statusFilter === 'all' || partner.status === statusFilter;
      const customersMatch = partner.customersCount >= customersFilter;
      const revenueMatch = partner.totalValue >= revenueFilter;
      const specializationMatch = specializationFilter === 'all' || partner.specialization === specializationFilter;
      const zoneMatch = zoneFilter === 'all' || partner.zone === zoneFilter;
      const identityMatch = identityFilter === 'all' || partner.identity === identityFilter;
      
      return statusMatch && customersMatch && revenueMatch && specializationMatch && zoneMatch && identityMatch;
    });
  }, [partners, statusFilter, customersFilter, revenueFilter, specializationFilter, zoneFilter, identityFilter]);

  const handleStatusToggle = (partnerId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    onStatusChange?.(partnerId, newStatus as 'active' | 'inactive');
  };

  const handleSelectPartner = (partnerId: string) => {
    setSelectedPartners(prev => 
      prev.includes(partnerId) 
        ? prev.filter(id => id !== partnerId)
        : [...prev, partnerId]
    );
  };

  const handleSelectAll = () => {
    if (selectedPartners.length === filteredPartners.length) {
      setSelectedPartners([]);
    } else {
      setSelectedPartners(filteredPartners.map(partner => partner.id));
    }
  };

  const handleBulkAction = (action: string) => {
    if (selectedPartners.length === 0) return;
    
    switch (action) {
      case 'activate':
        onBulkStatusChange?.(selectedPartners, 'active');
        break;
      case 'deactivate':
        onBulkStatusChange?.(selectedPartners, 'inactive');
        break;
    }
    setSelectedPartners([]);
  };

  if (selectedPartner) {
    return (
      <PartnerDetails
        partner={selectedPartner}
        customers={customers}
        products={products}
        users={users}
        onBack={() => setSelectedPartner(null)}
      />
    );
  }

  return (
    <div>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <PartnerTableHeader
              filteredCount={filteredPartners.length}
              totalCount={partners.length}
              selectedCount={selectedPartners.length}
              onBulkImport={onBulkImport}
              onBulkAction={handleBulkAction}
            />
            <PartnerTableFilters
              onStatusFilter={setStatusFilter}
              onIdentityFilter={setIdentityFilter}
              onSpecializationFilter={setSpecializationFilter}
              onZoneFilter={setZoneFilter}
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox 
                    checked={selectedPartners.length === filteredPartners.length && filteredPartners.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Identity</TableHead>
                <TableHead>Zone</TableHead>
                <TableHead>Agreement</TableHead>
                <TableHead>Payment Terms</TableHead>
                <TableHead>Product Types</TableHead>
                <TableHead>Assigned Employee</TableHead>
                <TableHead>Customers</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPartners.map((partner) => (
                <PartnerTableRow
                  key={partner.id}
                  partner={partner}
                  users={users}
                  isSelected={selectedPartners.includes(partner.id)}
                  onSelect={handleSelectPartner}
                  onStatusToggle={handleStatusToggle}
                  onViewDetails={setSelectedPartner}
                />
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default PartnerTable;
