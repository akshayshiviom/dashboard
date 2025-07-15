-- Create partner stage changes tracking table
CREATE TABLE public.partner_stage_changes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  partner_id TEXT NOT NULL,
  from_stage TEXT NOT NULL,
  to_stage TEXT NOT NULL,
  changed_by UUID NOT NULL,
  changed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create partner stage reversal requests table
CREATE TABLE public.partner_stage_reversal_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  partner_id TEXT NOT NULL,
  from_stage TEXT NOT NULL,
  to_stage TEXT NOT NULL,
  requested_by UUID NOT NULL,
  requested_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  approved_by UUID,
  approved_at TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'denied')),
  reason TEXT NOT NULL,
  comments TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.partner_stage_changes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partner_stage_reversal_requests ENABLE ROW LEVEL SECURITY;

-- Create policies for partner_stage_changes
CREATE POLICY "Users can view their own stage changes" 
ON public.partner_stage_changes 
FOR SELECT 
USING (auth.uid() = changed_by OR get_current_user_role() IN ('admin', 'manager', 'assistant-manager'));

CREATE POLICY "Users can create stage changes" 
ON public.partner_stage_changes 
FOR INSERT 
WITH CHECK (auth.uid() = changed_by);

-- Create policies for partner_stage_reversal_requests
CREATE POLICY "Users can view their own reversal requests" 
ON public.partner_stage_reversal_requests 
FOR SELECT 
USING (auth.uid() = requested_by OR get_current_user_role() IN ('admin', 'manager', 'assistant-manager'));

CREATE POLICY "Users can create reversal requests" 
ON public.partner_stage_reversal_requests 
FOR INSERT 
WITH CHECK (auth.uid() = requested_by);

CREATE POLICY "Managers can update reversal requests" 
ON public.partner_stage_reversal_requests 
FOR UPDATE 
USING (get_current_user_role() IN ('admin', 'manager', 'assistant-manager'));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_partner_stage_reversal_requests_updated_at
BEFORE UPDATE ON public.partner_stage_reversal_requests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();