import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Calendar, User, Building, Mail, Phone } from 'lucide-react';
import { Partner } from '@/types';
import PartnerOnboardingStageTimeline from './PartnerOnboardingStageTimeline';

interface PartnerOnboardingDetailProps {
  partner: Partner;
  onBack: () => void;
}

const PartnerOnboardingDetail = ({ partner, onBack }: PartnerOnboardingDetailProps) => {
  const [notes, setNotes] = useState('');

  // Generate mock onboarding data based on the 6-stage system
  const mockOnboardingData = {
    currentStage: 'kyc' as const,
    overallProgress: 65,
    startedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    expectedCompletionDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    lastActivity: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    stages: {
      'outreach': {
        stage: 'outreach' as const,
        status: 'completed' as const,
        startedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        completedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
        assignedTo: 'John Doe',
        tasks: [
          { id: '1', title: 'Initial contact made', completed: true, required: true },
          { id: '2', title: 'Lead qualification completed', completed: true, required: true },
          { id: '3', title: 'Discovery call scheduled', completed: true, required: false }
        ]
      },
      'product-overview': {
        stage: 'product-overview' as const,
        status: 'completed' as const,
        startedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
        completedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
        assignedTo: 'Jane Smith',
        tasks: [
          { id: '4', title: 'Product demo conducted', completed: true, required: true },
          { id: '5', title: 'Feature walkthrough completed', completed: true, required: true },
          { id: '6', title: 'Use case discussion', completed: true, required: false }
        ]
      },
      'partner-program': {
        stage: 'partner-program' as const,
        status: 'completed' as const,
        startedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
        completedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        assignedTo: 'Mike Johnson',
        tasks: [
          { id: '7', title: 'Program benefits explained', completed: true, required: true },
          { id: '8', title: 'Requirements reviewed', completed: true, required: true },
          { id: '9', title: 'Partner tier determined', completed: true, required: true }
        ]
      },
      'kyc': {
        stage: 'kyc' as const,
        status: 'in-progress' as const,
        startedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        assignedTo: 'Sarah Wilson',
        tasks: [
          { id: '10', title: 'Business license verification', completed: true, required: true },
          { id: '11', title: 'Tax documentation submitted', completed: true, required: true },
          { id: '12', title: 'Reference checks', completed: false, required: true },
          { id: '13', title: 'Compliance review', completed: false, required: true }
        ]
      },
      'agreement': {
        stage: 'agreement' as const,
        status: 'pending' as const,
        assignedTo: 'Legal Team',
        tasks: [
          { id: '14', title: 'Contract template prepared', completed: false, required: true },
          { id: '15', title: 'Terms negotiation', completed: false, required: true },
          { id: '16', title: 'Digital signature', completed: false, required: true }
        ]
      },
      'onboarded': {
        stage: 'onboarded' as const,
        status: 'pending' as const,
        assignedTo: 'Onboarding Team',
        tasks: [
          { id: '17', title: 'System access setup', completed: false, required: true },
          { id: '18', title: 'Training completed', completed: false, required: true },
          { id: '19', title: 'First transaction', completed: false, required: false }
        ]
      }
    }
  };

  const onboardingData = partner.onboarding || mockOnboardingData;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="outline" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h2 className="text-2xl font-bold">{partner.name} - Onboarding</h2>
          <p className="text-muted-foreground">Detailed onboarding progress and management</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Partner Information */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Partner Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Building className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{partner.company}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{partner.email}</span>
              </div>
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{partner.specialization}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Started: {onboardingData.startedAt.toLocaleDateString()}</span>
              </div>
              {onboardingData.expectedCompletionDate && (
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Expected: {onboardingData.expectedCompletionDate.toLocaleDateString()}</span>
                </div>
              )}
              <div className="pt-2">
                <Badge variant={partner.status === 'active' ? 'default' : 'secondary'}>
                  {partner.status}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                Schedule Meeting
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Send Email
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Upload Document
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Update Stage
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="timeline" className="space-y-4">
            <TabsList>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
              <TabsTrigger value="tasks">Tasks</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
            </TabsList>

            <TabsContent value="timeline">
              <PartnerOnboardingStageTimeline
                stages={onboardingData.stages}
                currentStage={onboardingData.currentStage}
                overallProgress={onboardingData.overallProgress}
              />
            </TabsContent>

            <TabsContent value="tasks">
              <Card>
                <CardHeader>
                  <CardTitle>All Tasks</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.values(onboardingData.stages).flatMap(stage => 
                      stage.tasks.map(task => (
                        <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <input 
                              type="checkbox" 
                              checked={task.completed}
                              readOnly
                              className="rounded"
                            />
                            <div>
                              <div className={`font-medium ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                                {task.title}
                              </div>
                              {task.description && (
                                <div className="text-sm text-muted-foreground">{task.description}</div>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {task.required && (
                              <Badge variant="outline" className="text-xs">Required</Badge>
                            )}
                            <Badge variant="secondary">{onboardingData.stages[Object.keys(onboardingData.stages).find(key => onboardingData.stages[key as keyof typeof onboardingData.stages].tasks.includes(task))! as keyof typeof onboardingData.stages].stage}</Badge>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="documents">
              <Card>
                <CardHeader>
                  <CardTitle>Documents</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    <p>Document management will be implemented here</p>
                    <Button variant="outline" className="mt-4">
                      Upload Document
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notes">
              <Card>
                <CardHeader>
                  <CardTitle>Notes & Comments</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    placeholder="Add a note about this partner's onboarding..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={4}
                  />
                  <Button>Add Note</Button>
                  
                  {/* Sample existing notes */}
                  <div className="space-y-3 mt-6">
                    <div className="p-3 bg-muted rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-medium text-sm">John Doe</span>
                        <span className="text-xs text-muted-foreground">2 days ago</span>
                      </div>
                      <p className="text-sm">Partner showed strong interest in our enterprise features. Moving to KYC stage.</p>
                    </div>
                    <div className="p-3 bg-muted rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-medium text-sm">Jane Smith</span>
                        <span className="text-xs text-muted-foreground">5 days ago</span>
                      </div>
                      <p className="text-sm">Product demo went well. They have specific requirements for API integration.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default PartnerOnboardingDetail;