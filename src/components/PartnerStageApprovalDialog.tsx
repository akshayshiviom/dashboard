import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { OnboardingStage, Partner } from "@/types";

interface PartnerStageApprovalDialogProps {
  isOpen: boolean;
  onClose: () => void;
  partner: Partner;
  fromStage: OnboardingStage;
  toStage: OnboardingStage;
  onSuccess: () => void;
}

export function PartnerStageApprovalDialog({
  isOpen,
  onClose,
  partner,
  fromStage,
  toStage,
  onSuccess
}: PartnerStageApprovalDialogProps) {
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!reason.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide a reason for this stage change request.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("User not authenticated");
      }

      // Create stage reversal request
      const { error: requestError } = await supabase
        .from('partner_stage_reversal_requests')
        .insert({
          partner_id: partner.id,
          from_stage: fromStage,
          to_stage: toStage,
          requested_by: user.id,
          reason: reason.trim(),
          status: 'pending'
        });

      if (requestError) throw requestError;

      // Create notification for managers/admins about the approval request
      // In a real implementation, this would trigger a task management system

      toast({
        title: "Approval Request Submitted",
        description: "Your stage change request has been submitted for approval. You will be notified once it's reviewed.",
      });

      onSuccess();
      onClose();
      setReason("");
    } catch (error) {
      console.error('Error submitting approval request:', error);
      toast({
        title: "Error",
        description: "Failed to submit approval request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Request Stage Change Approval</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="partner">Partner</Label>
            <Input
              id="partner"
              value={partner.name}
              disabled
              className="bg-muted"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fromStage">From Stage</Label>
              <Input
                id="fromStage"
                value={fromStage}
                disabled
                className="bg-muted capitalize"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="toStage">To Stage</Label>
              <Input
                id="toStage"
                value={toStage}
                disabled
                className="bg-muted capitalize"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Business Justification *</Label>
            <Textarea
              id="reason"
              placeholder="Please provide a detailed reason for this stage change request..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="min-h-[100px]"
              required
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !reason.trim()}
            >
              {isSubmitting ? "Submitting..." : "Submit Request"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}