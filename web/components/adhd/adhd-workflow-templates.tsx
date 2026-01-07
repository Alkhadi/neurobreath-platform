'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Calendar, FileText, CheckSquare } from 'lucide-react';

export function ADHDWorkflowTemplates() {
  const templates = [
    { name: 'Google Calendar', icon: Calendar, description: '25/5 repeating event' },
    { name: 'Notion Sprint Board', icon: FileText, description: 'Focus + reward tracker' },
    { name: 'Microsoft To Do', icon: CheckSquare, description: 'If-Then checklist' }
  ];

  return (
    <div className="mx-auto px-4" style={{ width: '86vw', maxWidth: '86vw' }}>
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Plug Into Your Workflow 🔌</h2>
        <p className="text-muted-foreground max-w-3xl mx-auto">
          Drop these templates into the tools you already use
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {templates.map((template, idx) => (
          <Card key={idx} className="hover:shadow-lg transition-all">
            <CardHeader>
              <template.icon className="w-12 h-12 text-blue-600 mb-3" />
              <CardTitle>{template.name}</CardTitle>
              <CardDescription>{template.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full gap-2">
                <Download className="w-4 h-4" />
                Get Template
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
