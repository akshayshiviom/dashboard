import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger } from '@/components/ui/dropdown-menu';
import { Users, Edit, UserPlus, Download, Filter, Settings2, Key } from 'lucide-react';
import { User } from '../types';
import { useAuth } from '@/contexts/AuthContext';
import { useRoles } from '@/hooks/useRoles';
import AddUserDialog from './AddUserDialog';
import AdminPasswordResetDialog from './AdminPasswordResetDialog';
import RoleManagementDialog from './RoleManagementDialog';

interface UserHierarchyTableProps {
  users: User[];
  onStatusChange?: (userId: string, newStatus: 'active' | 'inactive') => Promise<void>;
  onBulkStatusChange?: (userIds: string[], newStatus: 'active' | 'inactive') => Promise<void>;
  onUserUpdate?: (userId: string, updates: Partial<User>) => Promise<void>;
  onUserAdd?: (user: Omit<User, 'id' | 'createdAt'>) => Promise<void>;
}

interface EditingUser {
  id: string;
  name: string;
  role: string;
  reportingTo?: string;
}

const UserHierarchyTable = ({ users, onStatusChange, onBulkStatusChange, onUserUpdate, onUserAdd }: UserHierarchyTableProps) => {
  const [filteredUsers, setFilteredUsers] = useState<User[]>(users);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [showInactive, setShowInactive] = useState(true);
  const [compactView, setCompactView] = useState(false);
  const [showHierarchy, setShowHierarchy] = useState(true);
  const [editingUser, setEditingUser] = useState<EditingUser | null>(null);
  const [passwordResetUser, setPasswordResetUser] = useState<User | null>(null);
  
  const { isAdmin } = useAuth();
  const { roles: availableRoles, getRoleColor, getRoleDisplayName, getActiveRoleNames } = useRoles();

  // Additional security check
  if (!isAdmin) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <h3 className="text-xl font-semibold text-muted-foreground mb-2">Access Denied</h3>
          <p className="text-muted-foreground">You don't have permission to access user hierarchy management.</p>
        </div>
      </div>
    );
  }

  const roles = getActiveRoleNames();

  const getRoleBadgeStyle = (roleName: string) => {
    const color = getRoleColor(roleName);
    return {
      backgroundColor: color,
      color: 'white',
      border: 'none'
    };
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
  };

  const handleEditStart = (user: User) => {
    setEditingUser({
      id: user.id,
      name: user.name,
      role: user.role,
      reportingTo: user.reportingTo
    });
  };

  const handleEditCancel = () => {
    setEditingUser(null);
  };

  const handleEditSave = () => {
    if (editingUser && editingUser.name.trim()) {
      onUserUpdate?.(editingUser.id, {
        name: editingUser.name.trim(),
        role: editingUser.role as User['role'],
        reportingTo: editingUser.reportingTo === 'none' ? undefined : editingUser.reportingTo
      });
      setEditingUser(null);
    }
  };

  const handleUserAdd = (userData: Omit<User, 'id' | 'createdAt'>) => {
    const newUser: User = {
      ...userData,
      id: Date.now().toString(), // Simple ID generation for demo
      createdAt: new Date(),
    };
    
    onUserAdd?.(userData);
    console.log('Adding new user:', newUser);
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
              <RoleManagementDialog />
              
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
              
              <AddUserDialog users={users} onUserAdd={handleUserAdd} />
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
                  <TableCell className="font-medium">
                    {editingUser && editingUser.id === user.id ? (
                      <Input
                        value={editingUser.name}
                        onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                        className="h-8"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleEditSave();
                          if (e.key === 'Escape') handleEditCancel();
                        }}
                      />
                    ) : (
                      user.name
                    )}
                  </TableCell>
                  {!compactView && <TableCell>{user.email}</TableCell>}
                  <TableCell>
                    {editingUser && editingUser.id === user.id ? (
                      <Select
                        value={editingUser.role}
                        onValueChange={(value) => setEditingUser({ ...editingUser, role: value })}
                      >
                        <SelectTrigger className="h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {roles.map((role) => (
                            <SelectItem key={role} value={role}>
                              {getRoleDisplayName(role)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                     ) : (
                       <Badge style={getRoleBadgeStyle(user.role)} variant="secondary">
                         {getRoleDisplayName(user.role)}
                       </Badge>
                     )}
                  </TableCell>
                  {showHierarchy && (
                    <TableCell>
                      {editingUser && editingUser.id === user.id ? (
                        <Select
                          value={editingUser.reportingTo || 'none'}
                          onValueChange={(value) => setEditingUser({ ...editingUser, reportingTo: value === 'none' ? undefined : value })}
                        >
                          <SelectTrigger className="h-8">
                            <SelectValue placeholder="Select manager" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">None</SelectItem>
                            {users
                              .filter(u => u.id !== user.id)
                              .map((u) => (
                                <SelectItem key={u.id} value={u.id}>
                                  {u.name}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        getReportingToName(user.reportingTo)
                      )}
                    </TableCell>
                  )}
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
                      {editingUser && editingUser.id === user.id ? (
                        <>
                          <Button size="sm" onClick={handleEditSave}>
                            Save
                          </Button>
                          <Button size="sm" variant="outline" onClick={handleEditCancel}>
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditStart(user)}
                          >
                            <Edit size={16} />
                          </Button>
                          {isAdmin && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setPasswordResetUser(user)}
                              title="Reset Password"
                            >
                              <Key size={16} />
                            </Button>
                          )}
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {passwordResetUser && (
        <AdminPasswordResetDialog
          open={true}
          onOpenChange={(open) => !open && setPasswordResetUser(null)}
          userEmail={passwordResetUser.email}
          userName={passwordResetUser.name}
        />
      )}
    </div>
  );
};

export default UserHierarchyTable;
