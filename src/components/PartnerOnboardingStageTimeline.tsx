import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Circle, Clock, AlertCircle, FileText, Handshake, Users, Shield, PenTool, Trophy } from 'lucide-react';
import { OnboardingStage, OnboardingStageData } from '@/types';

interface PartnerOnboardingStageTimelineProps {
  stages: Record<OnboardingStage, OnboardingStageData>;
  currentStage: OnboardingStage;
  overallProgress: number;
}

const stageConfig = {
  'outreach': {
    title: 'Outreach',
    description: 'Initial contact and lead qualification',
    icon: Users,
    color: 'hsl(var(--primary))'
  },
  'product-overview': {
    title: 'Product Overview',
    description: 'Product demonstration and feature walkthrough',
    icon: FileText,
    color: 'hsl(var(--secondary))'
  },
  'partner-program': {
    title: 'Partner Program',
    description: 'Program details, benefits, and requirements',
    icon: Handshake,
    color: 'hsl(var(--accent))'
  },
  'kyc': {
    title: 'KYC',
    description: 'Documentation, verification, and compliance',
    icon: Shield,
    color: 'hsl(var(--muted-foreground))'
  },
  'agreement': {
    title: 'Agreement',
    description: 'Contract negotiation and signing',
    icon: PenTool,
    color: 'hsl(var(--destructive))'
  },
  'onboarded': {
    title: 'Onboarded',
    description: 'Final setup and activation complete',
    icon: Trophy,
    color: 'hsl(var(--success))'
  }
} as const;

const stageOrder: OnboardingStage[] = ['outreach', 'product-overview', 'partner-program', 'kyc', 'agreement', 'onboarded'];

const PartnerOnboardingStageTimeline = ({ stages, currentStage, overallProgress }: PartnerOnboardingStageTimelineProps) => {
  const getStageIcon = (stage: OnboardingStage, stageData: OnboardingStageData) => {
    const config = stageConfig[stage];
    const IconComponent = config.icon;
    
    switch (stageData.status) {
      case 'completed':
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case 'in-progress':
        return <Clock className="h-6 w-6 text-blue-500" />;
      case 'blocked':
        return <AlertCircle className="h-6 w-6 text-red-500" />;
      default:
        return <Circle className="h-6 w-6 text-muted-foreground" />;
    }
  };

  const getStageProgress = (stageData: OnboardingStageData) => {
    if (stageData.status === 'completed') return 100;
    if (stageData.status === 'pending') return 0;
    
    const completedTasks = stageData.tasks.filter(task => task.completed).length;
    const totalTasks = stageData.tasks.length;
    return totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'completed':
        return 'default';
      case 'in-progress':
        return 'secondary';
      case 'blocked':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Onboarding Progress
          <div className="text-sm font-normal text-muted-foreground">
            {overallProgress}% Complete
          </div>
        </CardTitle>
        <Progress value={overallProgress} className="w-full" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {stageOrder.map((stage, index) => {
            const stageData = stages[stage];
            const config = stageConfig[stage];
            const isActive = stage === currentStage;
            const progress = getStageProgress(stageData);
            
            return (
              <div key={stage} className={`relative ${index < stageOrder.length - 1 ? 'pb-4' : ''}`}>
                {/* Connection line */}
                {index < stageOrder.length - 1 && (
                  <div className="absolute left-3 top-8 w-0.5 h-12 bg-border" />
                )}
                
                <div className={`flex items-start space-x-3 p-3 rounded-lg transition-colors ${
                  isActive ? 'bg-muted/50 border border-primary/20' : 'hover:bg-muted/20'
                }`}>
                  {/* Stage Icon */}
                  <div className="flex-shrink-0 mt-1">
                    {getStageIcon(stage, stageData)}
                  </div>
                  
                  {/* Stage Content */}
                  <div className="flex-grow space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className={`font-medium ${isActive ? 'text-primary' : ''}`}>
                          {config.title}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {config.description}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={getStatusBadgeVariant(stageData.status)}>
                          {stageData.status.replace('-', ' ')}
                        </Badge>
                        {stageData.status !== 'pending' && stageData.status !== 'completed' && (
                          <span className="text-sm text-muted-foreground">
                            {progress}%
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* Stage Progress Bar */}
                    {stageData.status === 'in-progress' && (
                      <Progress value={progress} className="h-2" />
                    )}
                    
                    {/* Stage Details */}
                    {isActive && (
                      <div className="mt-3 space-y-2">
                        {stageData.tasks.map((task) => (
                          <div key={task.id} className="flex items-center space-x-2 text-sm">
                            <CheckCircle 
                              className={`h-4 w-4 ${
                                task.completed ? 'text-green-500' : 'text-muted-foreground'
                              }`} 
                            />
                            <span className={task.completed ? 'line-through text-muted-foreground' : ''}>
                              {task.title}
                            </span>
                            {task.required && !task.completed && (
                              <Badge variant="outline" className="text-xs">Required</Badge>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {/* Timestamps */}
                    <div className="text-xs text-muted-foreground space-y-1">
                      {stageData.startedAt && (
                        <div>Started: {stageData.startedAt.toLocaleDateString()}</div>
                      )}
                      {stageData.completedAt && (
                        <div>Completed: {stageData.completedAt.toLocaleDateString()}</div>
                      )}
                      {stageData.assignedTo && (
                        <div>Assigned to: {stageData.assignedTo}</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default PartnerOnboardingStageTimeline;