
import { TableCell, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Eye, CheckCircle, XCircle } from 'lucide-react';
import { Partner, User } from '../types';

interface PartnerTableRowProps {
  partner: Partner;
  users: User[];
  isSelected: boolean;
  onSelect: (partnerId: string) => void;
  onStatusToggle: (partnerId: string, currentStatus: string) => void;
  onViewDetails: (partner: Partner) => void;
}

const PartnerTableRow = ({
  partner,
  users,
  isSelected,
  onSelect,
  onStatusToggle,
  onViewDetails
}: PartnerTableRowProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentTermsColor = (terms: string) => {
    switch (terms) {
      case 'prepaid': return 'bg-green-100 text-green-800';
      case 'monthly': return 'bg-blue-100 text-blue-800';
      case 'net-30': return 'bg-yellow-100 text-yellow-800';
      case 'net-60': return 'bg-orange-100 text-orange-800';
      case 'net-90': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getZoneColor = (zone?: string) => {
    switch (zone) {
      case 'north': return 'bg-blue-100 text-blue-800';
      case 'east': return 'bg-green-100 text-green-800';
      case 'west': return 'bg-orange-100 text-orange-800';
      case 'south': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getEmployeeName = (employeeId?: string) => {
    const employee = users.find(u => u.id === employeeId);
    return employee ? employee.name : 'Unassigned';
  };

  const getIdentityColor = (identity: string) => {
    switch (identity) {
      case 'web-app-developer': return 'bg-blue-100 text-blue-800';
      case 'system-integrator': return 'bg-green-100 text-green-800';
      case 'managed-service-provider': return 'bg-purple-100 text-purple-800';
      case 'digital-marketer': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getIdentityLabel = (identity: string) => {
    switch (identity) {
      case 'web-app-developer': return 'Web/App Developer';
      case 'system-integrator': return 'System Integrator';
      case 'managed-service-provider': return 'MSP';
      case 'digital-marketer': return 'Digital Marketer';
      default: return identity;
    }
  };

  return (
    <TableRow className="hover:bg-muted/50">
      <TableCell>
        <Checkbox 
          checked={isSelected}
          onCheckedChange={() => onSelect(partner.id)}
        />
      </TableCell>
      <TableCell className="font-medium">{partner.name}</TableCell>
      <TableCell>{partner.company}</TableCell>
      <TableCell>
        <Badge className={getIdentityColor(partner.identity)}>
          {getIdentityLabel(partner.identity)}
        </Badge>
      </TableCell>
      <TableCell>
        {partner.zone ? (
          <Badge className={getZoneColor(partner.zone)}>
            {partner.zone.charAt(0).toUpperCase() + partner.zone.slice(1)}
          </Badge>
        ) : (
          <span className="text-muted-foreground">Not set</span>
        )}
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          {partner.agreementSigned ? (
            <CheckCircle size={16} className="text-green-600" />
          ) : (
            <XCircle size={16} className="text-red-600" />
          )}
          <span className="text-sm">
            {partner.agreementSigned ? 'Signed' : 'Pending'}
          </span>
        </div>
      </TableCell>
      <TableCell>
        <Badge className={getPaymentTermsColor(partner.paymentTerms)}>
          {partner.paymentTerms.toUpperCase()}
        </Badge>
      </TableCell>
      <TableCell>
        <div className="max-w-32">
          <div className="flex flex-wrap gap-1">
            {partner.productTypes.slice(0, 2).map((type, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {type}
              </Badge>
            ))}
            {partner.productTypes.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{partner.productTypes.length - 2}
              </Badge>
            )}
          </div>
        </div>
      </TableCell>
      <TableCell>{getEmployeeName(partner.assignedEmployeeId)}</TableCell>
      <TableCell>{partner.customersCount}</TableCell>
      <TableCell>${partner.totalValue.toLocaleString()}</TableCell>
      <TableCell>
        <Badge className={getStatusColor(partner.status)}>
          {partner.status}
        </Badge>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Switch
            checked={partner.status === 'active'}
            onCheckedChange={() => onStatusToggle(partner.id, partner.status)}
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewDetails(partner)}
            className="gap-2"
          >
            <Eye size={14} />
            View Details
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default PartnerTableRow;
