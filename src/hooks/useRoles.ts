import { useState, useEffect } from 'react';
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

export const useRoles = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRoles = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('roles')
        .select('*')
        .eq('active', true)
        .order('hierarchy_level', { ascending: false });

      if (error) throw error;
      
      setRoles(data || []);
    } catch (err: any) {
      console.error('Error fetching roles:', err);
      setError(err.message);
      // Fallback to default roles if database fetch fails
      setRoles([
        { id: '1', name: 'admin', display_name: 'Admin', color: '#ef4444', hierarchy_level: 100, active: true, created_at: '', updated_at: '' },
        { id: '2', name: 'manager', display_name: 'Manager', color: '#8b5cf6', hierarchy_level: 80, active: true, created_at: '', updated_at: '' },
        { id: '3', name: 'assistant-manager', display_name: 'Assistant Manager', color: '#6366f1', hierarchy_level: 70, active: true, created_at: '', updated_at: '' },
        { id: '4', name: 'team-leader', display_name: 'Team Leader', color: '#3b82f6', hierarchy_level: 60, active: true, created_at: '', updated_at: '' },
        { id: '5', name: 'fsr', display_name: 'FSR', color: '#10b981', hierarchy_level: 40, active: true, created_at: '', updated_at: '' },
        { id: '6', name: 'bde', display_name: 'BDE', color: '#f59e0b', hierarchy_level: 30, active: true, created_at: '', updated_at: '' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const getRoleByName = (name: string) => {
    return roles.find(role => role.name === name);
  };

  const getRoleColor = (roleName: string) => {
    const role = getRoleByName(roleName);
    return role?.color || '#6b7280';
  };

  const getRoleDisplayName = (roleName: string) => {
    const role = getRoleByName(roleName);
    return role?.display_name || roleName;
  };

  const getActiveRoleNames = () => {
    return roles.map(role => role.name);
  };

  const getActiveRoles = () => {
    return roles;
  };

  return {
    roles,
    isLoading,
    error,
    fetchRoles,
    getRoleByName,
    getRoleColor,
    getRoleDisplayName,
    getActiveRoleNames,
    getActiveRoles,
  };
};