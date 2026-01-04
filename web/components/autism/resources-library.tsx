'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FileText, Download, Eye, Users, GraduationCap, Briefcase, CheckCircle, ExternalLink, Lightbulb } from 'lucide-react';
import { TEMPLATES, type Template, type TemplateField } from '@/lib/data/templates';
import { toast } from 'sonner';

export function ResourcesLibrary() {
  const [mounted, setMounted] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [previewOpen, setPreviewOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getAudienceIcon = (audience: string) => {
    switch (audience) {
      case 'parents':
        return <Users className="w-4 h-4" />;
      case 'teachers':
        return <GraduationCap className="w-4 h-4" />;
      case 'employers':
        return <Briefcase className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getAudienceColor = (audience: string) => {
    switch (audience) {
      case 'parents':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300';
      case 'teachers':
        return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
      case 'employers':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      'assessment-request': 'Assessment Request',
      'evidence': 'Evidence Gathering',
      'meeting-prep': 'Meeting Preparation',
      'classroom': 'Classroom Support',
      'workplace': 'Workplace',
      'appeal': 'Appeals',
    };
    return labels[category] || category;
  };

  const handleFieldChange = (fieldId: string, value: string) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }));
  };

  const fillTemplate = (template: Template) => {
    let filled = template.templateText;
    template.fields.forEach((field) => {
      const value = formData[field.id] || `[${field.label}]`;
      filled = filled.replace(new RegExp(`\\[${field.id}\\]`, 'g'), value);
    });
    return filled;
  };

  const handleDownload = (format: 'txt' | 'pdf') => {
    if (!selectedTemplate) return;

    const filledContent = fillTemplate(selectedTemplate);
    const filename = `${selectedTemplate.id}-${new Date().toISOString().split('T')[0]}.${format}`;

    if (format === 'txt') {
      const blob = new Blob([filledContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.click();
      URL.revokeObjectURL(url);
      toast.success('Template downloaded successfully!');
    } else if (format === 'pdf') {
      // For PDF, we'll create a printable HTML version
      const printWindow = window.open('', '', 'width=800,height=600');
      if (printWindow) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>${selectedTemplate.title}</title>
              <style>
                body {
                  font-family: Arial, sans-serif;
                  line-height: 1.6;
                  max-width: 800px;
                  margin: 0 auto;
                  padding: 20px;
                }
                h1, h2, h3, h4 { color: #333; }
                pre {
                  white-space: pre-wrap;
                  word-wrap: break-word;
                  font-family: Arial, sans-serif;
                }
                @media print {
                  body { margin: 0; }
                }
              </style>
            </head>
            <body>
              <h1>${selectedTemplate.title}</h1>
              <pre>${filledContent}</pre>
              <script>
                window.onload = function() {
                  window.print();
                  window.onafterprint = function() { window.close(); };
                }
              </script>
            </body>
          </html>
        `);
        printWindow.document.close();
      }
      toast.success('Print dialog opened - save as PDF to download');
    }
  };

  const resetForm = () => {
    setFormData({});
    setSelectedTemplate(null);
  };

  const parentsTemplates = TEMPLATES.filter((t) => t.audience === 'parents' || t.audience === 'all');
  const teachersTemplates = TEMPLATES.filter((t) => t.audience === 'teachers' || t.audience === 'all');
  const employersTemplates = TEMPLATES.filter((t) => t.audience === 'employers' || t.audience === 'all');

  // Prevent hydration mismatch by only rendering after client-side mount
  if (!mounted) {
    return (
      <section className="space-y-6">
        <Card className="border-indigo-200 dark:border-indigo-800 bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-950/20 dark:to-background">
          <CardHeader>
            <div className="flex items-start gap-3">
              <div className="p-2 bg-indigo-100 dark:bg-indigo-900 rounded-lg">
                <FileText className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-2xl">Downloadable Resources Library</CardTitle>
                <CardDescription className="mt-1">
                  Loading templates...
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>
      </section>
    );
  }

  return (
    <div className="mx-auto px-4" style={{ width: '86vw', maxWidth: '86vw' }}>
      <section className="space-y-6">
        <Card className="border-indigo-200 dark:border-indigo-800 bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-950/20 dark:to-background">
          <CardHeader>
          <div className="flex items-start gap-3">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900 rounded-lg">
              <FileText className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-2xl">Downloadable Resources Library</CardTitle>
              <CardDescription className="mt-1">
                Professional letter templates, forms, and guides for EHCP/IEP requests, evidence gathering,
                and meetings. Simply fill in the blanks and download.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="parents" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="parents" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Parents/Carers
              </TabsTrigger>
              <TabsTrigger value="teachers" className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4" />
                Teachers
              </TabsTrigger>
              <TabsTrigger value="employers" className="flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                Employers
              </TabsTrigger>
            </TabsList>

            {/* Parents/Carers Templates */}
            <TabsContent value="parents" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                {parentsTemplates.map((template) => (
                  <Card
                    key={template.id}
                    className="hover:border-blue-300 dark:hover:border-blue-700 transition-colors cursor-pointer"
                    onClick={() => setSelectedTemplate(template)}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <CardTitle className="text-lg">{template.title}</CardTitle>
                          <CardDescription className="mt-2 text-sm">
                            {template.description}
                          </CardDescription>
                        </div>
                        <Badge variant="secondary" className="shrink-0">
                          {template.country}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Badge className={getAudienceColor(template.audience)} variant="secondary">
                          {getCategoryLabel(template.category)}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Teachers Templates */}
            <TabsContent value="teachers" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                {teachersTemplates.map((template) => (
                  <Card
                    key={template.id}
                    className="hover:border-green-300 dark:hover:border-green-700 transition-colors cursor-pointer"
                    onClick={() => setSelectedTemplate(template)}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <CardTitle className="text-lg">{template.title}</CardTitle>
                          <CardDescription className="mt-2 text-sm">
                            {template.description}
                          </CardDescription>
                        </div>
                        <Badge variant="secondary" className="shrink-0">
                          {template.country}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Badge className={getAudienceColor(template.audience)} variant="secondary">
                          {getCategoryLabel(template.category)}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Employers Templates */}
            <TabsContent value="employers" className="space-y-4">
              <Alert>
                <Lightbulb className="h-4 w-4" />
                <AlertDescription>
                  Looking for workplace adjustment templates? Check the <strong>Workplace Adjustments Generator</strong> in the Interactive Tools section above for a comprehensive tool with 15+ accommodation templates.
                </AlertDescription>
              </Alert>
              <div className="grid gap-4 md:grid-cols-2">
                {employersTemplates.map((template) => (
                  <Card
                    key={template.id}
                    className="hover:border-purple-300 dark:hover:border-purple-700 transition-colors cursor-pointer"
                    onClick={() => setSelectedTemplate(template)}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <CardTitle className="text-lg">{template.title}</CardTitle>
                          <CardDescription className="mt-2 text-sm">
                            {template.description}
                          </CardDescription>
                        </div>
                        <Badge variant="secondary" className="shrink-0">
                          {template.country}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Badge className={getAudienceColor(template.audience)} variant="secondary">
                          {getCategoryLabel(template.category)}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Template Editor Dialog */}
      {selectedTemplate && (
        <Dialog open={!!selectedTemplate} onOpenChange={(open) => !open && resetForm()}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {getAudienceIcon(selectedTemplate.audience)}
                {selectedTemplate.title}
              </DialogTitle>
              <DialogDescription>
                {selectedTemplate.description}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Template Form */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Fill in the details</h3>
                <div className="grid gap-4">
                  {selectedTemplate.fields.map((field) => (
                    <div key={field.id} className="space-y-2">
                      <Label htmlFor={field.id}>
                        {field.label}
                        {field.required && <span className="text-red-500 ml-1">*</span>}
                      </Label>
                      {field.type === 'textarea' ? (
                        <Textarea
                          id={field.id}
                          placeholder={field.placeholder}
                          value={formData[field.id] || ''}
                          onChange={(e) => handleFieldChange(field.id, e.target.value)}
                          rows={4}
                        />
                      ) : (
                        <Input
                          id={field.id}
                          type={field.type}
                          placeholder={field.placeholder}
                          value={formData[field.id] || ''}
                          onChange={(e) => handleFieldChange(field.id, e.target.value)}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Preview Button */}
              <div className="flex items-center gap-2">
                <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      Preview Template
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Template Preview</DialogTitle>
                      <DialogDescription>
                        This is how your completed template will look
                      </DialogDescription>
                    </DialogHeader>
                    <div className="bg-muted p-6 rounded-lg">
                      <pre className="whitespace-pre-wrap text-sm font-sans">
                        {fillTemplate(selectedTemplate)}
                      </pre>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Download Buttons */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Download your template</h3>
                <div className="flex flex-wrap gap-2">
                  <Button
                    onClick={() => handleDownload('txt')}
                    className="flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download as TXT
                  </Button>
                  <Button
                    onClick={() => handleDownload('pdf')}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Print/Save as PDF
                  </Button>
                </div>
              </div>

              {/* Tips */}
              {selectedTemplate.tips.length > 0 && (
                <Alert>
                  <Lightbulb className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Tips:</strong>
                    <ul className="mt-2 space-y-1 text-sm">
                      {selectedTemplate.tips.map((tip, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 mt-0.5 shrink-0 text-green-600" />
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}

              {/* Evidence Links */}
              {selectedTemplate.evidenceLinks.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold">Helpful Resources:</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedTemplate.evidenceLinks.map((link, index) => (
                      <Button
                        key={index}
                        variant="ghost"
                        size="sm"
                        asChild
                        className="text-xs"
                      >
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1"
                        >
                          {link.title}
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </section>
    </div>
  );
}
