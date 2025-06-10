
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Partner } from '../types';

interface CustomerAssignmentFormProps {
  formData: {
    partnerId: string;
    zone: string;
    value: string;
  };
  partners: Partner[];
  onChange: (field: string, value: string) => void;
}

const CustomerAssignmentForm = ({ formData, partners, onChange }: CustomerAssignmentFormProps) => {
  const zones = [
    { value: 'north', label: 'North' },
    { value: 'east', label: 'East' },
    { value: 'west', label: 'West' },
    { value: 'south', label: 'South' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="space-y-2">
        <Label htmlFor="partner">Assign Partner</Label>
        <Select value={formData.partnerId} onValueChange={(value) => onChange('partnerId', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select a partner" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">No Partner</SelectItem>
            {partners.map((partner) => (
              <SelectItem key={partner.id} value={partner.id}>
                {partner.name} - {partner.company}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="zone">Zone</Label>
        <Select value={formData.zone} onValueChange={(value) => onChange('zone', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select zone" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">No Zone</SelectItem>
            {zones.map((zone) => (
              <SelectItem key={zone.value} value={zone.value}>
                {zone.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="value">Value (₹)</Label>
        <Input
          id="value"
          type="number"
          value={formData.value}
          onChange={(e) => onChange('value', e.target.value)}
          placeholder="Enter value"
        />
      </div>
    </div>
  );
};

export default CustomerAssignmentForm;
