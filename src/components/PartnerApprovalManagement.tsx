import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { PartnerStageReversalRequest } from "@/types";
import { CheckCircle, XCircle, Clock, Eye } from "lucide-react";

export function PartnerApprovalManagement() {
  const [requests, setRequests] = useState<PartnerStageReversalRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<PartnerStageReversalRequest | null>(null);
  const [isApprovalDialogOpen, setIsApprovalDialogOpen] = useState(false);
  const [comments, setComments] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchPendingRequests();
  }, []);

  const fetchPendingRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('partner_stage_reversal_requests')
        .select('*')
        .eq('status', 'pending')
        .order('requested_at', { ascending: false });

      if (error) throw error;

      const transformedData: PartnerStageReversalRequest[] = data.map(item => ({
        id: item.id,
        partnerId: item.partner_id,
        fromStage: item.from_stage as any,
        toStage: item.to_stage as any,
        requestedBy: item.requested_by,
        requestedAt: new Date(item.requested_at),
        approvedBy: item.approved_by,
        approvedAt: item.approved_at ? new Date(item.approved_at) : undefined,
        status: item.status as any,
        reason: item.reason,
        comments: item.comments,
        createdAt: new Date(item.created_at),
        updatedAt: new Date(item.updated_at)
      }));

      setRequests(transformedData);
    } catch (error) {
      console.error('Error fetching requests:', error);
      toast({
        title: "Error",
        description: "Failed to fetch approval requests",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprovalAction = async (requestId: string, action: 'approved' | 'denied') => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { error } = await supabase
        .from('partner_stage_reversal_requests')
        .update({
          status: action,
          approved_by: user.id,
          approved_at: new Date().toISOString(),
          comments: comments || null
        })
        .eq('id', requestId);

      if (error) throw error;

      toast({
        title: action === 'approved' ? "Request Approved" : "Request Denied",
        description: `The stage change request has been ${action}.`,
      });

      // Refresh the requests list
      fetchPendingRequests();
      setIsApprovalDialogOpen(false);
      setSelectedRequest(null);
      setComments("");
    } catch (error) {
      console.error('Error updating request:', error);
      toast({
        title: "Error",
        description: "Failed to process approval action",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case 'approved':
        return <Badge variant="outline" className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Approved</Badge>;
      case 'denied':
        return <Badge variant="outline" className="bg-red-100 text-red-800"><XCircle className="w-3 h-3 mr-1" />Denied</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading approval requests...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Partner Stage Approvals</h2>
          <p className="text-muted-foreground">
            Review and manage partner stage change requests
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pending Approval Requests</CardTitle>
        </CardHeader>
        <CardContent>
          {requests.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No pending approval requests
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Partner ID</TableHead>
                  <TableHead>Stage Change</TableHead>
                  <TableHead>Requested By</TableHead>
                  <TableHead>Request Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="font-medium">{request.partnerId}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <span className="capitalize">{request.fromStage}</span>
                        <span className="mx-2">→</span>
                        <span className="capitalize">{request.toStage}</span>
                      </div>
                    </TableCell>
                    <TableCell>{request.requestedBy}</TableCell>
                    <TableCell>{request.requestedAt.toLocaleDateString()}</TableCell>
                    <TableCell>{getStatusBadge(request.status)}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedRequest(request);
                            setIsApprovalDialogOpen(true);
                          }}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Review
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {selectedRequest && (
        <Dialog open={isApprovalDialogOpen} onOpenChange={setIsApprovalDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Review Stage Change Request</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Partner ID</Label>
                  <div className="text-sm font-medium">{selectedRequest.partnerId}</div>
                </div>
                <div>
                  <Label>Stage Change</Label>
                  <div className="text-sm">
                    <span className="capitalize">{selectedRequest.fromStage}</span>
                    <span className="mx-2">→</span>
                    <span className="capitalize">{selectedRequest.toStage}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <Label>Business Justification</Label>
                <div className="text-sm bg-muted p-3 rounded-md">
                  {selectedRequest.reason}
                </div>
              </div>

              <div>
                <Label htmlFor="comments">Manager Comments (Optional)</Label>
                <Textarea
                  id="comments"
                  placeholder="Add any comments about this approval decision..."
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsApprovalDialogOpen(false);
                    setSelectedRequest(null);
                    setComments("");
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleApprovalAction(selectedRequest.id, 'denied')}
                >
                  <XCircle className="w-4 h-4 mr-1" />
                  Deny
                </Button>
                <Button
                  onClick={() => handleApprovalAction(selectedRequest.id, 'approved')}
                >
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Approve
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}