
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Eye, Edit, Trash2 } from 'lucide-react';
import { User } from '../types';
import UserFilters from './UserFilters';

interface UserHierarchyTableProps {
  users: User[];
}

const UserHierarchyTable = ({ users }: UserHierarchyTableProps) => {
  const [filteredUsers, setFilteredUsers] = useState<User[]>(users);

  const getRoleColor = (role: string) => {
    const colors = {
      admin: 'bg-red-100 text-red-800',
      manager: 'bg-purple-100 text-purple-800',
      'assistant-manager': 'bg-indigo-100 text-indigo-800',
      'team-leader': 'bg-blue-100 text-blue-800',
      fsr: 'bg-green-100 text-green-800',
      bde: 'bg-yellow-100 text-yellow-800',
    };
    return colors[role as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

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

  const getReportingToName = (reportingToId?: string) => {
    if (!reportingToId) return 'N/A';
    const reportingUser = users.find(u => u.id === reportingToId);
    return reportingUser ? reportingUser.name : 'Unknown';
  };

  const handleRoleFilter = (role: string) => {
    if (role === 'all') {
      setFilteredUsers(users);
    } else {
      setFilteredUsers(users.filter(user => user.role === role));
    }
  };

  const handleStatusFilter = (status: string) => {
    if (status === 'all') {
      setFilteredUsers(users);
    } else {
      setFilteredUsers(users.filter(user => user.status === status));
    }
  };

  const handleDepartmentFilter = (department: string) => {
    if (department === 'all') {
      setFilteredUsers(users);
    } else {
      setFilteredUsers(users.filter(user => user.department === department));
    }
  };

  return (
    <div className="space-y-6">
      <UserFilters
        onRoleFilter={handleRoleFilter}
        onStatusFilter={handleStatusFilter}
        onDepartmentFilter={handleDepartmentFilter}
      />
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users size={24} />
            User Hierarchy
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Reporting To</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge className={getRoleColor(user.role)}>
                      {getRoleDisplayName(user.role)}
                    </Badge>
                  </TableCell>
                  <TableCell>{user.department}</TableCell>
                  <TableCell>{getReportingToName(user.reportingTo)}</TableCell>
                  <TableCell>
                    <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {user.lastLogin ? user.lastLogin.toLocaleDateString() : 'Never'}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye size={16} />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit size={16} />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 size={16} />
                      </Button>
                    </div>
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

export default UserHierarchyTable;
