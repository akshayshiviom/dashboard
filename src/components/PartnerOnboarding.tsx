import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Search, UserPlus, Filter, CheckCircle, Clock, AlertCircle, Eye } from 'lucide-react';
import { Partner, User } from '@/types';
import AddPartnerForm from '@/components/AddPartnerForm';

interface PartnerOnboardingProps {
  partners: Partner[];
  users: User[];
  onPartnerAdd?: (partner: Partner) => void;
}

interface OnboardingStep {
  id: string;
  name: string;
  completed: boolean;
  required: boolean;
}

interface OnboardingPartner extends Partner {
  onboardingStatus: 'pending' | 'in-progress' | 'completed' | 'blocked';
  onboardingProgress: number;
  steps: OnboardingStep[];
  assignedTo?: string;
  lastActivity: Date;
}

const PartnerOnboarding = ({ partners, users, onPartnerAdd }: PartnerOnboardingProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);

  // Mock onboarding data - in real app this would come from API
  const onboardingPartners: OnboardingPartner[] = partners.map(partner => ({
    ...partner,
    onboardingStatus: ['pending', 'in-progress', 'completed', 'blocked'][Math.floor(Math.random() * 4)] as any,
    onboardingProgress: Math.floor(Math.random() * 100),
    lastActivity: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
    assignedTo: 'John Doe',
    steps: [
      { id: '1', name: 'Document Verification', completed: true, required: true },
      { id: '2', name: 'Agreement Signing', completed: true, required: true },
      { id: '3', name: 'System Setup', completed: false, required: true },
      { id: '4', name: 'Training Completion', completed: false, required: true },
      { id: '5', name: 'First Sale', completed: false, required: false },
    ]
  }));

  const handleAddPartner = (partner: Partner) => {
    if (onPartnerAdd) {
      onPartnerAdd(partner);
    }
    setShowAddForm(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'in-progress':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'blocked':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'in-progress':
        return 'bg-blue-500';
      case 'blocked':
        return 'bg-red-500';
      default:
        return 'bg-yellow-500';
    }
  };

  const filteredPartners = onboardingPartners.filter(partner => {
    const matchesSearch = partner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         partner.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || partner.onboardingStatus === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const statsData = [
    {
      title: 'Total Partners',
      value: onboardingPartners.length,
      color: 'text-blue-600'
    },
    {
      title: 'In Progress',
      value: onboardingPartners.filter(p => p.onboardingStatus === 'in-progress').length,
      color: 'text-yellow-600'
    },
    {
      title: 'Completed',
      value: onboardingPartners.filter(p => p.onboardingStatus === 'completed').length,
      color: 'text-green-600'
    },
    {
      title: 'Blocked',
      value: onboardingPartners.filter(p => p.onboardingStatus === 'blocked').length,
      color: 'text-red-600'
    }
  ];

  if (showAddForm) {
    return (
      <div className="space-y-6">
        <AddPartnerForm 
          users={users}
          onPartnerAdd={handleAddPartner}
          onCancel={() => setShowAddForm(false)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Partner Onboarding</h2>
          <p className="text-muted-foreground">
            Track and manage partner onboarding process
          </p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={() => setShowAddForm(true)}>
            <UserPlus className="h-4 w-4 mr-2" />
            Add Partner
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {statsData.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search partners..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="blocked">Blocked</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Partner</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Last Activity</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPartners.map((partner) => (
                <TableRow key={partner.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{partner.name}</div>
                      <div className="text-sm text-muted-foreground">{partner.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(partner.onboardingStatus)}
                      <Badge 
                        variant="outline" 
                        className={`${getStatusColor(partner.onboardingStatus)} text-white border-0`}
                      >
                        {partner.onboardingStatus.replace('-', ' ')}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>{partner.assignedTo}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {partner.lastActivity.toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default PartnerOnboarding;
