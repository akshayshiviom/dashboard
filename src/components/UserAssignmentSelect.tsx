
import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X, Plus } from 'lucide-react';
import { User } from '../types';

interface UserAssignmentSelectProps {
  users: User[];
  assignedUserIds: string[];
  onAssignmentChange: (userIds: string[]) => void;
  maxAssignments?: number;
  allowedRoles?: string[];
}

const UserAssignmentSelect = ({ 
  users, 
  assignedUserIds, 
  onAssignmentChange, 
  maxAssignments = 3,
  allowedRoles = ['fsr', 'team-leader', 'bde']
}: UserAssignmentSelectProps) => {
  const [selectedUserId, setSelectedUserId] = useState('');

  const filteredUsers = users.filter(user => allowedRoles.includes(user.role));
  const availableUsers = filteredUsers.filter(user => !assignedUserIds.includes(user.id));
  const assignedUsers = users.filter(user => assignedUserIds.includes(user.id));

  const handleAddUser = () => {
    if (selectedUserId && assignedUserIds.length < maxAssignments) {
      onAssignmentChange([...assignedUserIds, selectedUserId]);
      setSelectedUserId('');
    }
  };

  const handleRemoveUser = (userId: string) => {
    onAssignmentChange(assignedUserIds.filter(id => id !== userId));
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'fsr': return 'bg-blue-100 text-blue-800';
      case 'team-leader': return 'bg-green-100 text-green-800';
      case 'bde': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {assignedUsers.map((user) => (
          <Badge key={user.id} variant="secondary" className="flex items-center gap-2">
            <span>{user.name}</span>
            <Badge className={getRoleBadgeColor(user.role)} variant="outline">
              {user.role.toUpperCase()}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
              onClick={() => handleRemoveUser(user.id)}
            >
              <X size={12} />
            </Button>
          </Badge>
        ))}
      </div>

      {assignedUserIds.length < maxAssignments && availableUsers.length > 0 && (
        <div className="flex gap-2">
          <Select value={selectedUserId} onValueChange={setSelectedUserId}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Select user to assign..." />
            </SelectTrigger>
            <SelectContent>
              {availableUsers.map((user) => (
                <SelectItem key={user.id} value={user.id}>
                  <div className="flex items-center gap-2">
                    <span>{user.name}</span>
                    <Badge className={getRoleBadgeColor(user.role)} variant="outline">
                      {user.role.toUpperCase()}
                    </Badge>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddUser}
            disabled={!selectedUserId}
            className="gap-2"
          >
            <Plus size={16} />
            Add
          </Button>
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        {assignedUserIds.length}/{maxAssignments} users assigned
      </p>
    </div>
  );
};

export default UserAssignmentSelect;
