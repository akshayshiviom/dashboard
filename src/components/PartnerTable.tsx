
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Partner } from '../types';

interface PartnerTableProps {
  partners: Partner[];
}

const PartnerTable = ({ partners }: PartnerTableProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Partners Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Specialization</TableHead>
              <TableHead>Customers</TableHead>
              <TableHead>Total Value</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {partners.map((partner) => (
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
  );
};

export default PartnerTable;
