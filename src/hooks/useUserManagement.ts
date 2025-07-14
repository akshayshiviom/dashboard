import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types';
import { toast } from 'sonner';

interface SupabaseProfile {
  id: string;
  user_id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  role: string;
  status: string;
  phone: string | null;
  department: string | null;
  reporting_to: string | null;
  last_login: string | null;
  created_at: string;
  updated_at: string;
}

export function useUserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Transform Supabase profile to User interface
  const transformProfile = useCallback((profile: SupabaseProfile): User => {
    const name = `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || profile.email;
    return {
      id: profile.user_id,
      name,
      email: profile.email,
      phone: profile.phone || '',
      role: profile.role as User['role'],
      reportingTo: profile.reporting_to || undefined,
      department: profile.department || '',
      status: profile.status as User['status'],
      createdAt: new Date(profile.created_at),
      lastLogin: profile.last_login ? new Date(profile.last_login) : undefined,
    };
  }, []);

  // Fetch users from Supabase
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const transformedUsers = data.map(transformProfile);
      setUsers(transformedUsers);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  }, [transformProfile]);

  // Add new user (Note: Users must be created in Supabase Dashboard first)
  const addUser = useCallback(async (userData: Omit<User, 'id' | 'createdAt'>) => {
    toast.error('Creating new users requires admin setup in Supabase Dashboard');
    throw new Error('User creation must be done through Supabase Dashboard');
  }, []);

  // Update user
  const updateUser = useCallback(async (userId: string, updates: Partial<User>) => {
    try {
      const updateData: any = {};
      
      if (updates.name) {
        const nameParts = updates.name.split(' ');
        updateData.first_name = nameParts[0] || '';
        updateData.last_name = nameParts.slice(1).join(' ') || '';
      }
      
      if (updates.email) updateData.email = updates.email;
      if (updates.role) updateData.role = updates.role;
      if (updates.status) updateData.status = updates.status;
      if (updates.phone !== undefined) updateData.phone = updates.phone || null;
      if (updates.department !== undefined) updateData.department = updates.department || null;
      if (updates.reportingTo !== undefined) updateData.reporting_to = updates.reportingTo || null;
      if (updates.lastLogin) updateData.last_login = updates.lastLogin.toISOString();

      const { data, error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;

      const updatedUser = transformProfile(data);
      setUsers(prev => prev.map(user => user.id === userId ? updatedUser : user));
      toast.success('User updated successfully');
      return updatedUser;
    } catch (err) {
      console.error('Error updating user:', err);
      setError(err instanceof Error ? err.message : 'Failed to update user');
      toast.error('Failed to update user');
      throw err;
    }
  }, [transformProfile]);

  // Bulk status update
  const bulkUpdateStatus = useCallback(async (userIds: string[], status: 'active' | 'inactive') => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ status })
        .in('user_id', userIds);

      if (error) throw error;

      setUsers(prev => prev.map(user => 
        userIds.includes(user.id) ? { ...user, status } : user
      ));
      toast.success(`${userIds.length} user(s) ${status === 'active' ? 'activated' : 'deactivated'}`);
    } catch (err) {
      console.error('Error updating user status:', err);
      setError(err instanceof Error ? err.message : 'Failed to update user status');
      toast.error('Failed to update user status');
      throw err;
    }
  }, []);

  // Set up real-time subscription
  useEffect(() => {
    fetchUsers();

    const channel = supabase
      .channel('profiles-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles'
        },
        (payload) => {
          console.log('Profile change detected:', payload);
          fetchUsers(); // Refetch all users on any change for simplicity
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchUsers]);

  return {
    users,
    loading,
    error,
    addUser,
    updateUser,
    bulkUpdateStatus,
    refetch: fetchUsers,
  };
}