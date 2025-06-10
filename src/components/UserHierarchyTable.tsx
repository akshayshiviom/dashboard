
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger } from '@/components/ui/dropdown-menu';
import { Users, Eye, Edit, Trash2, MoreVertical, UserPlus, Download, Filter, Settings2 } from 'lucide-react';
import { User } from '../types';

interface UserHierarchyTableProps {
  users: User[];
  onStatusChange?: (userId: string, newStatus: 'active' | 'inactive') => void;
  onBulkStatusChange?: (userIds: string[], newStatus: 'active' | 'inactive') => void;
}

const UserHierarchyTable = ({ users, onStatusChange, onBulkStatusChange }: UserHierarchyTableProps) => {
  const [filteredUsers, setFilteredUsers] = useState<User[]>(users);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [showInactive, setShowInactive] = useState(true);
  const [compactView, setCompactView] = useState(false);
  const [showHierarchy, setShowHierarchy] = useState(true);

  const roles = ['admin', 'manager', 'assistant-manager', 'team-leader', 'fsr', 'bde'];

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

  const handleSelectUser = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === displayUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(displayUsers.map(user => user.id));
    }
  };

  const handleStatusToggle = (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    onStatusChange?.(userId, newStatus as 'active' | 'inactive');
  };

  const handleBulkAction = (action: string) => {
    if (selectedUsers.length === 0) return;

    switch (action) {
      case 'activate':
        onBulkStatusChange?.(selectedUsers, 'active');
        break;
      case 'deactivate':
        onBulkStatusChange?.(selectedUsers, 'inactive');
        break;
      case 'export':
        console.log('Exporting users:', selectedUsers);
        break;
      case 'delete':
        console.log('Deleting users:', selectedUsers);
        break;
    }
    setSelectedUsers([]);
  };

  const exportUsers = () => {
    console.log('Exporting users:', filteredUsers);
    // Here you would implement the export functionality
  };

  const displayUsers = showInactive ? filteredUsers : filteredUsers.filter(user => user.status === 'active');

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users size={24} />
              User Hierarchy ({displayUsers.length} users)
            </CardTitle>
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Filter size={16} className="mr-2" />
                    Filters
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      Filter by Role
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent>
                      <DropdownMenuItem onClick={() => handleRoleFilter('all')}>
                        All roles
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {roles.map((role) => (
                        <DropdownMenuItem key={role} onClick={() => handleRoleFilter(role)}>
                          {getRoleDisplayName(role)}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>
                  
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      Filter by Status
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent>
                      <DropdownMenuItem onClick={() => handleStatusFilter('all')}>
                        All statuses
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleStatusFilter('active')}>
                        Active
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleStatusFilter('inactive')}>
                        Inactive
                      </DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Settings2 size={16} />
                    View Options
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setShowInactive(!showInactive)}>
                    {showInactive ? 'Hide' : 'Show'} Inactive Users
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setCompactView(!compactView)}>
                    {compactView ? 'Detailed' : 'Compact'} View
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setShowHierarchy(!showHierarchy)}>
                    {showHierarchy ? 'Hide' : 'Show'} Hierarchy
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={exportUsers}>
                    <Download size={16} className="mr-2" />
                    Export Users
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              {selectedUsers.length > 0 && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      Bulk Actions ({selectedUsers.length})
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => handleBulkAction('activate')}>
                      Activate Selected
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleBulkAction('deactivate')}>
                      Deactivate Selected
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleBulkAction('export')}>
                      Export Selected
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleBulkAction('delete')} className="text-red-600">
                      Delete Selected
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
              
              <Button size="sm">
                <UserPlus size={16} className="mr-2" />
                Add User
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox 
                    checked={selectedUsers.length === displayUsers.length && displayUsers.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>Name</TableHead>
                {!compactView && <TableHead>Email</TableHead>}
                <TableHead>Role</TableHead>
                {showHierarchy && <TableHead>Reporting To</TableHead>}
                <TableHead>Status</TableHead>
                {!compactView && <TableHead>Last Login</TableHead>}
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <Checkbox 
                      checked={selectedUsers.includes(user.id)}
                      onCheckedChange={() => handleSelectUser(user.id)}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  {!compactView && <TableCell>{user.email}</TableCell>}
                  <TableCell>
                    <Badge className={getRoleColor(user.role)}>
                      {getRoleDisplayName(user.role)}
                    </Badge>
                  </TableCell>
                  {showHierarchy && <TableCell>{getReportingToName(user.reportingTo)}</TableCell>}
                  <TableCell>
                    <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                      {user.status}
                    </Badge>
                  </TableCell>
                  {!compactView && (
                    <TableCell>
                      {user.lastLogin ? user.lastLogin.toLocaleDateString() : 'Never'}
                    </TableCell>
                  )}
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={user.status === 'active'}
                        onCheckedChange={() => handleStatusToggle(user.id, user.status)}
                      />
                      <Button variant="outline" size="sm">
                        <Eye size={16} />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit size={16} />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm">
                            <MoreVertical size={16} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Send Message</DropdownMenuItem>
                          <DropdownMenuItem>Change Role</DropdownMenuItem>
                          <DropdownMenuItem>Reset Password</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 size={16} className="mr-2" />
                            Delete User
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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
