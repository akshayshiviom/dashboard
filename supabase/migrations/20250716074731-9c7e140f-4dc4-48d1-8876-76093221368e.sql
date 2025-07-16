-- Create roles table for admin-configurable user roles
CREATE TABLE public.roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  description TEXT,
  color TEXT DEFAULT '#6b7280',
  hierarchy_level INTEGER DEFAULT 0,
  permissions JSONB DEFAULT '[]'::jsonb,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;

-- Create policies for roles table
CREATE POLICY "Admins can manage all roles" 
ON public.roles 
FOR ALL 
USING (get_current_user_role() = 'admin');

CREATE POLICY "All users can view active roles" 
ON public.roles 
FOR SELECT 
USING (active = true);

-- Insert default roles
INSERT INTO public.roles (name, display_name, description, color, hierarchy_level) VALUES
('admin', 'Admin', 'System administrator with full access', '#ef4444', 100),
('manager', 'Manager', 'Team manager with extended permissions', '#8b5cf6', 80),
('assistant-manager', 'Assistant Manager', 'Assistant manager role', '#6366f1', 70),
('team-leader', 'Team Leader', 'Team leader role', '#3b82f6', 60),
('fsr', 'FSR', 'Field sales representative', '#10b981', 40),
('bde', 'BDE', 'Business development executive', '#f59e0b', 30);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_roles_updated_at
BEFORE UPDATE ON public.roles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();