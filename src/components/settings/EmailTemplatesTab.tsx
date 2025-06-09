
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

interface EmailTemplatesTabProps {
  templates: EmailTemplate[];
  setTemplates: (templates: EmailTemplate[]) => void;
}

const EmailTemplatesTab = ({ templates, setTemplates }: EmailTemplatesTabProps) => {
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null);
  const [isCreatingTemplate, setIsCreatingTemplate] = useState(false);
  const [templateFormData, setTemplateFormData] = useState({
    name: '',
    subject: '',
    body: ''
  });

  const { toast } = useToast();

  const handleCreateTemplate = () => {
    if (!templateFormData.name.trim() || !templateFormData.subject.trim() || !templateFormData.body.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    const newTemplate: EmailTemplate = {
      id: Date.now().toString(),
      name: templateFormData.name,
      subject: templateFormData.subject,
      body: templateFormData.body,
      isDefault: false
    };

    setTemplates([...templates, newTemplate]);
    setTemplateFormData({ name: '', subject: '', body: '' });
    setIsCreatingTemplate(false);
    
    toast({
      title: "Success",
      description: "Email template created successfully",
    });
  };

  const handleUpdateTemplate = () => {
    if (!editingTemplate || !templateFormData.name.trim() || !templateFormData.subject.trim() || !templateFormData.body.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setTemplates(templates.map(template => 
      template.id === editingTemplate.id 
        ? { ...template, name: templateFormData.name, subject: templateFormData.subject, body: templateFormData.body }
        : template
    ));
    
    setEditingTemplate(null);
    setTemplateFormData({ name: '', subject: '', body: '' });
    
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

  const handleSetDefaultTemplate = (templateId: string) => {
    setTemplates(templates.map(template => ({
      ...template,
      isDefault: template.id === templateId
    })));
    
    toast({
      title: "Success",
      description: "Default template updated successfully",
    });
  };

  const startEditingTemplate = (template: EmailTemplate) => {
    setEditingTemplate(template);
    setTemplateFormData({
      name: template.name,
      subject: template.subject,
      body: template.body
    });
    setIsCreatingTemplate(false);
  };

  const cancelTemplateEditing = () => {
    setEditingTemplate(null);
    setIsCreatingTemplate(false);
    setTemplateFormData({ name: '', subject: '', body: '' });
  };

  return (
    <div className="space-y-6">
      {/* Template Form */}
      {(isCreatingTemplate || editingTemplate) && (
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
                value={templateFormData.name}
                onChange={(e) => setTemplateFormData({ ...templateFormData, name: e.target.value })}
                placeholder="e.g., Urgent Renewal, Friendly Reminder"
              />
            </div>
            
            <div>
              <Label htmlFor="template-subject">Subject Line</Label>
              <Input
                id="template-subject"
                value={templateFormData.subject}
                onChange={(e) => setTemplateFormData({ ...templateFormData, subject: e.target.value })}
                placeholder="e.g., Renewal Reminder - {contractValue} Contract"
              />
            </div>
            
            <div>
              <Label htmlFor="template-body">Email Body</Label>
              <Textarea
                id="template-body"
                value={templateFormData.body}
                onChange={(e) => setTemplateFormData({ ...templateFormData, body: e.target.value })}
                rows={12}
                placeholder="Write your email template here..."
              />
            </div>
            
            <div className="flex gap-2">
              <Button onClick={editingTemplate ? handleUpdateTemplate : handleCreateTemplate}>
                {editingTemplate ? 'Update Template' : 'Create Template'}
              </Button>
              <Button variant="outline" onClick={cancelTemplateEditing}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add New Template Button */}
      {!isCreatingTemplate && !editingTemplate && (
        <Button onClick={() => setIsCreatingTemplate(true)} className="gap-2">
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
                    onClick={() => startEditingTemplate(template)}
                    className="gap-1"
                  >
                    <Edit2 size={14} />
                    Edit
                  </Button>
                  {!template.isDefault && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSetDefaultTemplate(template.id)}
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

export default EmailTemplatesTab;
