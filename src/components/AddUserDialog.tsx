
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { UserPlus } from 'lucide-react';
import { User } from '../types';
import { useToast } from '@/components/ui/use-toast';

interface AddUserDialogProps {
  users: User[];
  onUserAdd: (user: Omit<User, 'id' | 'createdAt'>) => void;
}

const AddUserDialog = ({ users, onUserAdd }: AddUserDialogProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: '' as User['role'],
    reportingTo: '',
    department: '',
    status: 'active' as const
  });
  const { toast } = useToast();

  const roles: User['role'][] = ['admin', 'manager', 'assistant-manager', 'team-leader', 'fsr', 'bde'];

  const getRoleDisplayName = (role: string) => {
    const names = {
      admin: 'Admin',
      manager: 'Manager',
      'assistant-manager': 'Assistant Manager',
      'team-leader': 'Team Leader',
      fsr: 'FSR',
      bde: 'BDE',
    };
    return names[role as keyof typeof names] || role;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.role || !formData.department.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    // Check if email already exists
    if (users.some(user => user.email.toLowerCase() === formData.email.toLowerCase())) {
      toast({
        title: "Email Already Exists",
        description: "A user with this email already exists.",
        variant: "destructive",
      });
      return;
    }

    onUserAdd({
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      role: formData.role,
      reportingTo: formData.reportingTo === 'none' ? undefined : formData.reportingTo,
      department: formData.department.trim(),
      status: formData.status
    });

    toast({
      title: "User Added",
      description: `${formData.name} has been added successfully.`,
    });

    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      role: '' as User['role'],
      reportingTo: '',
      department: '',
      status: 'active'
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <UserPlus size={16} className="mr-2" />
          Add User
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New User</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter full name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="Enter email address"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="Enter phone number"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role *</Label>
            <Select
              value={formData.role}
              onValueChange={(value) => setFormData({ ...formData, role: value as User['role'] })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem key={role} value={role}>
                    {getRoleDisplayName(role)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reportingTo">Reporting To</Label>
            <Select
              value={formData.reportingTo || 'none'}
              onValueChange={(value) => setFormData({ ...formData, reportingTo: value === 'none' ? '' : value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select manager" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="department">Department *</Label>
            <Input
              id="department"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              placeholder="Enter department"
              required
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              Add User
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddUserDialog;
