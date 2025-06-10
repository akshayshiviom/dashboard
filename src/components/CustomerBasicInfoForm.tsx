
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface CustomerBasicInfoFormProps {
  formData: {
    name: string;
    email: string;
    phone: string;
    company: string;
  };
  onChange: (field: string, value: string) => void;
}

const CustomerBasicInfoForm = ({ formData, onChange }: CustomerBasicInfoFormProps) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => onChange('name', e.target.value)}
            placeholder="Enter customer name"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => onChange('email', e.target.value)}
            placeholder="Enter email address"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => onChange('phone', e.target.value)}
            placeholder="Enter phone number"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="company">Company *</Label>
          <Input
            id="company"
            value={formData.company}
            onChange={(e) => onChange('company', e.target.value)}
            placeholder="Enter company name"
            required
          />
        </div>
      </div>
    </>
  );
};

export default CustomerBasicInfoForm;
