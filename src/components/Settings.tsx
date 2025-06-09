import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trash2, Plus, Edit2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  isDefault: boolean;
}

const Settings = () => {
  const [templates, setTemplates] = useState<EmailTemplate[]>([
    {
      id: '1',
      name: 'Standard Renewal',
      subject: 'Renewal Reminder - {contractValue} Contract',
      body: `Dear {customerName},

I hope this email finds you well.

We wanted to reach out regarding your upcoming software renewal scheduled for {renewalDate}.

Contract Details:
- Customer: {customerName}
- Company: {customerCompany}
- Partner: {partnerName}
- Contract Value: {contractValue}
- Renewal Date: {renewalDate}
- Status: {status}

We would appreciate the opportunity to discuss your renewal and any potential upgrades or changes to your current setup.

Please let us know if you have any questions or would like to schedule a call to discuss this further.

Best regards,
{employeeName}
{employeeEmail}
{employeePhone}`,
      isDefault: true
    }
  ]);

  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    body: ''
  });
  const { toast } = useToast();

  const handleCreateTemplate = () => {
    if (!formData.name.trim() || !formData.subject.trim() || !formData.body.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    const newTemplate: EmailTemplate = {
      id: Date.now().toString(),
      name: formData.name,
      subject: formData.subject,
      body: formData.body,
      isDefault: false
    };

    setTemplates([...templates, newTemplate]);
    setFormData({ name: '', subject: '', body: '' });
    setIsCreating(false);
    
    toast({
      title: "Success",
      description: "Email template created successfully",
    });
  };

  const handleUpdateTemplate = () => {
    if (!editingTemplate || !formData.name.trim() || !formData.subject.trim() || !formData.body.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setTemplates(templates.map(template => 
      template.id === editingTemplate.id 
        ? { ...template, name: formData.name, subject: formData.subject, body: formData.body }
        : template
    ));
    
    setEditingTemplate(null);
    setFormData({ name: '', subject: '', body: '' });
    
    toast({
      title: "Success",
      description: "Email template updated successfully",
    });
  };

  const handleDeleteTemplate = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template?.isDefault) {
      toast({
        title: "Error",
        description: "Cannot delete the default template",
        variant: "destructive",
      });
      return;
    }

    setTemplates(templates.filter(template => template.id !== templateId));
    toast({
      title: "Success",
      description: "Email template deleted successfully",
    });
  };

  const handleSetDefault = (templateId: string) => {
    setTemplates(templates.map(template => ({
      ...template,
      isDefault: template.id === templateId
    })));
    
    toast({
      title: "Success",
      description: "Default template updated successfully",
    });
  };

  const startEditing = (template: EmailTemplate) => {
    setEditingTemplate(template);
    setFormData({
      name: template.name,
      subject: template.subject,
      body: template.body
    });
    setIsCreating(false);
  };

  const cancelEditing = () => {
    setEditingTemplate(null);
    setIsCreating(false);
    setFormData({ name: '', subject: '', body: '' });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-semibold">Email Templates</h3>
        <p className="text-muted-foreground">Manage renewal notification email templates</p>
      </div>

      {/* Template Form */}
      {(isCreating || editingTemplate) && (
        <Card>
          <CardHeader>
            <CardTitle>{editingTemplate ? 'Edit Template' : 'Create New Template'}</CardTitle>
            <CardDescription>
              Use placeholders like {'{customerName}'}, {'{renewalDate}'}, {'{contractValue}'}, etc.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="template-name">Template Name</Label>
              <Input
                id="template-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Urgent Renewal, Friendly Reminder"
              />
            </div>
            
            <div>
              <Label htmlFor="template-subject">Subject Line</Label>
              <Input
                id="template-subject"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="e.g., Renewal Reminder - {contractValue} Contract"
              />
            </div>
            
            <div>
              <Label htmlFor="template-body">Email Body</Label>
              <Textarea
                id="template-body"
                value={formData.body}
                onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                rows={12}
                placeholder="Write your email template here..."
              />
            </div>
            
            <div className="flex gap-2">
              <Button onClick={editingTemplate ? handleUpdateTemplate : handleCreateTemplate}>
                {editingTemplate ? 'Update Template' : 'Create Template'}
              </Button>
              <Button variant="outline" onClick={cancelEditing}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add New Template Button */}
      {!isCreating && !editingTemplate && (
        <Button onClick={() => setIsCreating(true)} className="gap-2">
          <Plus size={16} />
          Add New Template
        </Button>
      )}

      {/* Templates List */}
      <div className="space-y-4">
        {templates.map((template) => (
          <Card key={template.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {template.name}
                    {template.isDefault && <Badge variant="secondary">Default</Badge>}
                  </CardTitle>
                  <CardDescription>{template.subject}</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => startEditing(template)}
                    className="gap-1"
                  >
                    <Edit2 size={14} />
                    Edit
                  </Button>
                  {!template.isDefault && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSetDefault(template.id)}
                    >
                      Set as Default
                    </Button>
                  )}
                  {!template.isDefault && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteTemplate(template.id)}
                      className="gap-1 text-destructive hover:text-destructive"
                    >
                      <Trash2 size={14} />
                      Delete
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-muted p-4 rounded-md">
                <pre className="text-sm whitespace-pre-wrap">{template.body}</pre>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Settings;
