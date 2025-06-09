
import { useState, useMemo } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Partner } from '../types';
import PartnerFilters from './PartnerFilters';

interface PartnerTableProps {
  partners: Partner[];
}

const PartnerTable = ({ partners }: PartnerTableProps) => {
  const [statusFilter, setStatusFilter] = useState('all');
  const [customersFilter, setCustomersFilter] = useState(0);
  const [revenueFilter, setRevenueFilter] = useState(0);
  const [specializationFilter, setSpecializationFilter] = useState('all');

  const filteredPartners = useMemo(() => {
    return partners.filter((partner) => {
      const statusMatch = statusFilter === 'all' || partner.status === statusFilter;
      const customersMatch = partner.customersCount >= customersFilter;
      const revenueMatch = partner.totalValue >= revenueFilter;
      const specializationMatch = specializationFilter === 'all' || partner.specialization === specializationFilter;
      
      return statusMatch && customersMatch && revenueMatch && specializationMatch;
    });
  }, [partners, statusFilter, customersFilter, revenueFilter, specializationFilter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      <PartnerFilters
        onStatusFilter={setStatusFilter}
        onCustomersFilter={setCustomersFilter}
        onRevenueFilter={setRevenueFilter}
        onSpecializationFilter={setSpecializationFilter}
      />
      <Card>
        <CardHeader>
          <CardTitle>
            Partners Overview ({filteredPartners.length} of {partners.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Specialization</TableHead>
                <TableHead>Active Opportunities</TableHead>
                <TableHead>Total Revenue</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPartners.map((partner) => (
                <TableRow key={partner.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">{partner.name}</TableCell>
                  <TableCell>{partner.company}</TableCell>
                  <TableCell>{partner.specialization}</TableCell>
                  <TableCell>{partner.customersCount}</TableCell>
                  <TableCell>${partner.totalValue.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(partner.status)}>
                      {partner.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{partner.createdAt.toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default PartnerTable;
