import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Partner, User } from '@/types';
import UserAssignmentSelect from './UserAssignmentSelect';

const partnerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  company: z.string().min(2, 'Company name must be at least 2 characters'),
  specialization: z.string().min(2, 'Specialization is required'),
  identity: z.enum(['web-app-developer', 'system-integrator', 'managed-service-provider', 'digital-marketer', 'cyber-security', 'cloud-hosting', 'web-hosting', 'hardware', 'cloud-service-provider', 'microsoft-partner', 'aws-partner', 'it-consulting', 'freelance']),
  paymentTerms: z.enum(['net-15', 'net-30', 'net-45', 'net-60', 'net-90', 'annual-in-advance', 'monthly', 'quarterly', 'half-yearly']),
  zone: z.enum(['north', 'east', 'west', 'south']).optional(),
});

type PartnerFormData = z.infer<typeof partnerSchema>;

interface AddPartnerFormProps {
  users: User[];
  onPartnerAdd: (partner: Partner) => void;
  onCancel: () => void;
}

const AddPartnerForm = ({ users, onPartnerAdd, onCancel }: AddPartnerFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [assignedUserIds, setAssignedUserIds] = useState<string[]>([]);

  const form = useForm<PartnerFormData>({
    resolver: zodResolver(partnerSchema),
    defaultValues: {
      name: '',
      email: '',
      company: '',
      specialization: '',
      identity: 'web-app-developer',
      paymentTerms: 'net-30',
    },
  });

  const onSubmit = async (data: PartnerFormData) => {
    setIsSubmitting(true);
    try {
      const newPartner: Partner = {
        id: `partner-${Date.now()}`,
        name: data.name,
        email: data.email,
        company: data.company,
        specialization: data.specialization,
        identity: data.identity,
        paymentTerms: data.paymentTerms,
        zone: data.zone,
        assignedUserIds: assignedUserIds.length > 0 ? assignedUserIds : undefined,
        customersCount: 0,
        newRevenue: 0,
        renewalRevenue: 0,
        totalValue: 0,
        status: 'active',
        createdAt: new Date(),
        agreementSigned: false,
        productTypes: [],
      };

      onPartnerAdd(newPartner);
      form.reset();
      setAssignedUserIds([]);
      onCancel();
    } catch (error) {
      console.error('Error adding partner:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Add New Partner</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Partner Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter partner name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="partner@company.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company</FormLabel>
                    <FormControl>
                      <Input placeholder="Company name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="specialization"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Specialization</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., E-commerce, Healthcare" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="identity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Partner Identity</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select identity" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="web-app-developer">Web App Developer</SelectItem>
                        <SelectItem value="system-integrator">System Integrator</SelectItem>
                        <SelectItem value="managed-service-provider">Managed Service Provider</SelectItem>
                        <SelectItem value="digital-marketer">Digital Marketer</SelectItem>
                        <SelectItem value="cyber-security">Cyber Security</SelectItem>
                        <SelectItem value="cloud-hosting">Cloud Hosting</SelectItem>
                        <SelectItem value="web-hosting">Web Hosting</SelectItem>
                        <SelectItem value="hardware">Hardware</SelectItem>
                        <SelectItem value="cloud-service-provider">Cloud Service Provider</SelectItem>
                        <SelectItem value="microsoft-partner">Microsoft Partner</SelectItem>
                        <SelectItem value="aws-partner">AWS Partner</SelectItem>
                        <SelectItem value="it-consulting">IT Consulting</SelectItem>
                        <SelectItem value="freelance">Freelance</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="paymentTerms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Terms</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select payment terms" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="net-15">Net 15</SelectItem>
                        <SelectItem value="net-30">Net 30</SelectItem>
                        <SelectItem value="net-45">Net 45</SelectItem>
                        <SelectItem value="net-60">Net 60</SelectItem>
                        <SelectItem value="net-90">Net 90</SelectItem>
                        <SelectItem value="annual-in-advance">Annual in Advance</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="quarterly">Quarterly</SelectItem>
                        <SelectItem value="half-yearly">Half Yearly</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="zone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Zone (Optional)</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select zone" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="north">North</SelectItem>
                      <SelectItem value="east">East</SelectItem>
                      <SelectItem value="west">West</SelectItem>
                      <SelectItem value="south">South</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <label className="block text-sm font-medium mb-2">
                Assigned Users
              </label>
              <UserAssignmentSelect
                users={users}
                assignedUserIds={assignedUserIds}
                onAssignmentChange={setAssignedUserIds}
                maxAssignments={3}
                allowedRoles={['fsr', 'team-leader', 'bde']}
              />
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Adding...' : 'Add Partner'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default AddPartnerForm;
