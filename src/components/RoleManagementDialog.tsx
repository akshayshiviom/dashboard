import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Settings, Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Role {
  id: string;
  name: string;
  display_name: string;
  description?: string;
  color: string;
  hierarchy_level: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

interface EditingRole {
  id?: string;
  name: string;
  display_name: string;
  description: string;
  color: string;
  hierarchy_level: number;
}

const RoleManagementDialog = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [editingRole, setEditingRole] = useState<EditingRole | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const { data, error } = await supabase
        .from('roles')
        .select('*')
        .order('hierarchy_level', { ascending: false });

      if (error) throw error;
      setRoles(data || []);
    } catch (error) {
      console.error('Error fetching roles:', error);
      toast({
        title: "Error",
        description: "Failed to fetch roles",
        variant: "destructive",
      });
    }
  };

  const handleAddNew = () => {
    setEditingRole({
      name: '',
      display_name: '',
      description: '',
      color: '#6b7280',
      hierarchy_level: 0
    });
    setIsAddingNew(true);
  };

  const handleEdit = (role: Role) => {
    setEditingRole({
      id: role.id,
      name: role.name,
      display_name: role.display_name,
      description: role.description || '',
      color: role.color,
      hierarchy_level: role.hierarchy_level
    });
    setIsAddingNew(false);
  };

  const handleSave = async () => {
    if (!editingRole || !editingRole.name.trim() || !editingRole.display_name.trim()) {
      toast({
        title: "Error",
        description: "Role name and display name are required",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      if (isAddingNew) {
        const { error } = await supabase
          .from('roles')
          .insert({
            name: editingRole.name.toLowerCase().replace(/\s+/g, '-'),
            display_name: editingRole.display_name,
            description: editingRole.description || null,
            color: editingRole.color,
            hierarchy_level: editingRole.hierarchy_level
          });

        if (error) throw error;
        toast({
          title: "Success",
          description: "Role created successfully",
        });
      } else {
        const { error } = await supabase
          .from('roles')
          .update({
            display_name: editingRole.display_name,
            description: editingRole.description || null,
            color: editingRole.color,
            hierarchy_level: editingRole.hierarchy_level
          })
          .eq('id', editingRole.id);

        if (error) throw error;
        toast({
          title: "Success",
          description: "Role updated successfully",
        });
      }

      await fetchRoles();
      setEditingRole(null);
      setIsAddingNew(false);
    } catch (error: any) {
      console.error('Error saving role:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save role",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setEditingRole(null);
    setIsAddingNew(false);
  };

  const handleToggleActive = async (role: Role) => {
    try {
      const { error } = await supabase
        .from('roles')
        .update({ active: !role.active })
        .eq('id', role.id);

      if (error) throw error;
      
      await fetchRoles();
      toast({
        title: "Success",
        description: `Role ${role.active ? 'deactivated' : 'activated'} successfully`,
      });
    } catch (error: any) {
      console.error('Error toggling role status:', error);
      toast({
        title: "Error",
        description: "Failed to update role status",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (role: Role) => {
    if (role.name === 'admin') {
      toast({
        title: "Error",
        description: "Cannot delete the admin role",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('roles')
        .delete()
        .eq('id', role.id);

      if (error) throw error;
      
      await fetchRoles();
      toast({
        title: "Success",
        description: "Role deleted successfully",
      });
    } catch (error: any) {
      console.error('Error deleting role:', error);
      toast({
        title: "Error",
        description: "Failed to delete role. Make sure no users are assigned to this role.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings className="mr-2 h-4 w-4" />
          Manage Roles
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Role Management</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              Configure user roles and their hierarchy levels
            </p>
            <Button onClick={handleAddNew} size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Role
            </Button>
          </div>

          {editingRole && (
            <div className="border rounded-lg p-4 space-y-4 bg-muted/50">
              <h4 className="font-medium">
                {isAddingNew ? 'Add New Role' : 'Edit Role'}
              </h4>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Role Name</Label>
                  <Input
                    id="name"
                    value={editingRole.name}
                    onChange={(e) => setEditingRole({ ...editingRole, name: e.target.value })}
                    placeholder="e.g., manager"
                    disabled={!isAddingNew}
                  />
                </div>
                <div>
                  <Label htmlFor="display_name">Display Name</Label>
                  <Input
                    id="display_name"
                    value={editingRole.display_name}
                    onChange={(e) => setEditingRole({ ...editingRole, display_name: e.target.value })}
                    placeholder="e.g., Manager"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={editingRole.description}
                  onChange={(e) => setEditingRole({ ...editingRole, description: e.target.value })}
                  placeholder="Role description"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="color">Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="color"
                      type="color"
                      value={editingRole.color}
                      onChange={(e) => setEditingRole({ ...editingRole, color: e.target.value })}
                      className="w-16 h-10"
                    />
                    <Input
                      value={editingRole.color}
                      onChange={(e) => setEditingRole({ ...editingRole, color: e.target.value })}
                      placeholder="#6b7280"
                      className="flex-1"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="hierarchy_level">Hierarchy Level</Label>
                  <Input
                    id="hierarchy_level"
                    type="number"
                    value={editingRole.hierarchy_level}
                    onChange={(e) => setEditingRole({ ...editingRole, hierarchy_level: parseInt(e.target.value) || 0 })}
                    placeholder="0-100"
                    min="0"
                    max="100"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleSave} disabled={isLoading}>
                  <Save className="mr-2 h-4 w-4" />
                  Save
                </Button>
                <Button variant="outline" onClick={handleCancel}>
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
              </div>
            </div>
          )}

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Role</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Hierarchy Level</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {roles.map((role) => (
                <TableRow key={role.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Badge 
                        style={{ backgroundColor: role.color, color: 'white' }}
                        variant="secondary"
                      >
                        {role.display_name}
                      </Badge>
                      <span className="text-sm text-muted-foreground">({role.name})</span>
                    </div>
                  </TableCell>
                  <TableCell>{role.description || 'No description'}</TableCell>
                  <TableCell>{role.hierarchy_level}</TableCell>
                  <TableCell>
                    <Badge variant={role.active ? 'default' : 'secondary'}>
                      {role.active ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(role)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleActive(role)}
                      >
                        {role.active ? 'Deactivate' : 'Activate'}
                      </Button>
                      {role.name !== 'admin' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(role)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RoleManagementDialog;