
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CustomerStatusFormProps {
  formData: {
    status: 'active' | 'inactive' | 'pending';
    process: 'prospect' | 'demo' | 'poc' | 'negotiating' | 'lost' | 'won' | 'deployment';
  };
  onChange: (field: string, value: string) => void;
}

const CustomerStatusForm = ({ formData, onChange }: CustomerStatusFormProps) => {
  const processOptions = [
    { value: 'prospect', label: 'Prospect' },
    { value: 'demo', label: 'Demo' },
    { value: 'poc', label: 'POC' },
    { value: 'negotiating', label: 'Negotiating' },
    { value: 'lost', label: 'Lost' },
    { value: 'won', label: 'Won' },
    { value: 'deployment', label: 'Deployment' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <Select value={formData.status} onValueChange={(value) => onChange('status', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="process">Process</Label>
        <Select value={formData.process} onValueChange={(value) => onChange('process', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select process" />
          </SelectTrigger>
          <SelectContent>
            {processOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default CustomerStatusForm;
