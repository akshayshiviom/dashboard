
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Mail, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Renewal, Customer, Partner, User } from '../types';

interface RenewalEmailDialogProps {
  renewal: Renewal;
  customer: Customer;
  partner: Partner;
  assignedEmployee?: User;
  children: React.ReactNode;
}

const RenewalEmailDialog = ({ 
  renewal, 
  customer, 
  partner, 
  assignedEmployee, 
  children 
}: RenewalEmailDialogProps) => {
  const [open, setOpen] = useState(false);
  const [emailData, setEmailData] = useState({
    to: customer.email,
    cc: assignedEmployee?.email || '',
    subject: `Renewal Reminder - ${renewal.contractValue.toLocaleString()} Contract`,
    body: `Dear ${customer.name},

I hope this email finds you well.

We wanted to reach out regarding your upcoming software renewal scheduled for ${renewal.renewalDate.toLocaleDateString()}.

Contract Details:
- Customer: ${customer.name}
- Company: ${customer.company}
- Partner: ${partner.name}
- Contract Value: $${renewal.contractValue.toLocaleString()}
- Renewal Date: ${renewal.renewalDate.toLocaleDateString()}
- Status: ${renewal.status}

We would appreciate the opportunity to discuss your renewal and any potential upgrades or changes to your current setup.

Please let us know if you have any questions or would like to schedule a call to discuss this further.

Best regards,
${assignedEmployee?.name || 'Your Account Manager'}
${assignedEmployee?.email || ''}
${assignedEmployee?.phone || ''}`
  });
  const [additionalCCs, setAdditionalCCs] = useState<string[]>([]);
  const [ccInput, setCcInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const addCC = () => {
    if (ccInput && ccInput.includes('@') && !additionalCCs.includes(ccInput)) {
      setAdditionalCCs([...additionalCCs, ccInput]);
      setCcInput('');
    }
  };

  const removeCC = (email: string) => {
    setAdditionalCCs(additionalCCs.filter(cc => cc !== email));
  };

  const handleSendEmail = async () => {
    setIsLoading(true);
    
    // This is where you would integrate with your email service
    // For now, we'll simulate the email sending
    try {
      console.log('Sending email with data:', {
        ...emailData,
        additionalCCs,
        renewalId: renewal.id
      });

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      toast({
        title: "Email Sent Successfully",
        description: `Renewal notification sent to ${customer.name}`,
      });

      setOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail size={20} />
            Send Renewal Notification
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="to">To</Label>
              <Input
                id="to"
                value={emailData.to}
                onChange={(e) => setEmailData({ ...emailData, to: e.target.value })}
                placeholder="customer@email.com"
              />
            </div>
            <div>
              <Label htmlFor="cc">Primary CC</Label>
              <Input
                id="cc"
                value={emailData.cc}
                onChange={(e) => setEmailData({ ...emailData, cc: e.target.value })}
                placeholder="employee@company.com"
              />
            </div>
          </div>

          <div>
            <Label>Additional CCs</Label>
            <div className="flex gap-2 mt-1">
              <Input
                value={ccInput}
                onChange={(e) => setCcInput(e.target.value)}
                placeholder="Add more email addresses"
                onKeyPress={(e) => e.key === 'Enter' && addCC()}
              />
              <Button onClick={addCC} variant="outline" size="sm">
                Add
              </Button>
            </div>
            {additionalCCs.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {additionalCCs.map((email) => (
                  <Badge key={email} variant="secondary" className="gap-1">
                    {email}
                    <X size={12} className="cursor-pointer" onClick={() => removeCC(email)} />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              value={emailData.subject}
              onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="body">Message</Label>
            <Textarea
              id="body"
              value={emailData.body}
              onChange={(e) => setEmailData({ ...emailData, body: e.target.value })}
              rows={12}
              className="resize-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSendEmail} disabled={isLoading}>
              {isLoading ? 'Sending...' : 'Send Email'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RenewalEmailDialog;
