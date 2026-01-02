'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Briefcase, Download, ExternalLink } from 'lucide-react';
import { workplaceAdjustments } from '@/lib/data/workplace-adjustments';

interface SelectedAdjustment {
  id: string;
  category: string;
  title: string;
  description: string;
  howToRequest: string;
  legalBasis: string;
  examples: string[];
  evidence?: string;
}

export function WorkplaceAdjustments() {
  const [employeeName, setEmployeeName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [company, setCompany] = useState('');
  const [selectedAdjustments, setSelectedAdjustments] = useState<string[]>([]);
  const [country, setCountry] = useState<'UK' | 'US'>('UK');

  const toggleAdjustment = (id: string) => {
    setSelectedAdjustments(prev =>
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  const getSelectedDetails = (): SelectedAdjustment[] => {
    return workplaceAdjustments
      .filter(adj => selectedAdjustments.includes(adj.id))
      .map(adj => ({
        id: adj.id,
        category: adj.category,
        title: adj.title,
        description: adj.description,
        howToRequest: adj.howToRequest,
        legalBasis: adj.legalBasis,
        examples: adj.examples,
        evidence: adj.evidence,
      }));
  };

  const exportRequest = () => {
    const selected = getSelectedDetails();
    const legalRef = country === 'UK'
      ? 'Equality Act 2010 (reasonable adjustments for disabled employees)'
      : 'Americans with Disabilities Act (ADA) - reasonable accommodations';

    const content = `WORKPLACE ADJUSTMENTS REQUEST
${'='.repeat(60)}

Employee: ${employeeName || '[Your Name]'}
Job Title: ${jobTitle || '[Your Job Title]'}
Company: ${company || '[Company Name]'}
Date: ${new Date().toLocaleDateString()}

--- LEGAL BASIS ---

${legalRef}

Under this legislation, I am requesting reasonable adjustments to support
my performance and wellbeing in the workplace. These adjustments relate to
autism and are evidence-based accommodations that enable me to work effectively.

--- REQUESTED ADJUSTMENTS ---

${selected.map((adj, i) => `
${i + 1}. ${adj.title.toUpperCase()}
${'-'.repeat(50)}

Category: ${adj.category}

Description:
${adj.description}

Request:
${adj.howToRequest}

Examples:
${adj.examples.map(ex => `  • ${ex}`).join('\n')}

Evidence:
${adj.evidence || 'N/A'}
`).join('\n')}

--- NEXT STEPS ---

1. I would appreciate discussing these adjustments with you at your earliest
   convenience.

2. I am happy to work collaboratively to find solutions that work for both
   myself and the organization.

3. Some adjustments may require trial periods to assess effectiveness.

4. I am open to providing additional information or medical documentation
   if required.

--- CONTACT ---

Please contact me to arrange a meeting to discuss these adjustments.

Email: [Your Email]
Phone: [Your Phone]

Thank you for your support in creating an inclusive workplace.

--- RESOURCES FOR EMPLOYERS ---

UK:
- ACAS: www.acas.org.uk
- Access to Work: www.gov.uk/access-to-work
- National Autistic Society Employer Guidance: www.autism.org.uk

US:
- Job Accommodation Network (JAN): askjan.org
- EEOC ADA Resources: www.eeoc.gov/laws/guidance
- Autistic Self Advocacy Network: autisticadvocacy.org

Evidence:
- Scott et al. (2017): Workplace accommodations improve job retention
- NICE CG170: Reasonable adjustments in employment
`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `workplace-adjustments-request-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const categorizedAdjustments = workplaceAdjustments.reduce((acc, adj) => {
    if (!acc[adj.category]) acc[adj.category] = [];
    acc[adj.category].push(adj);
    return acc;
  }, {} as Record<string, typeof workplaceAdjustments>);

  return (
    <Card className="border-indigo-200 dark:border-indigo-800">
      <CardHeader>
        <div className="flex items-start gap-3">
          <div className="p-2 bg-indigo-100 dark:bg-indigo-900 rounded-lg">
            <Briefcase className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="flex-1">
            <CardTitle>Workplace Adjustments Generator</CardTitle>
            <CardDescription>
              Create a formal request for autism-specific workplace accommodations
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Personal Info */}
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <Label htmlFor="employeeName">Your Name</Label>
            <Input
              id="employeeName"
              value={employeeName}
              onChange={(e) => setEmployeeName(e.target.value)}
              placeholder="Optional"
            />
          </div>
          <div>
            <Label htmlFor="jobTitle">Job Title</Label>
            <Input
              id="jobTitle"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="Optional"
            />
          </div>
          <div>
            <Label htmlFor="company">Company</Label>
            <Input
              id="company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="Optional"
            />
          </div>
        </div>

        {/* Country Selection */}
        <div>
          <Label>Legal Framework</Label>
          <div className="flex gap-2 mt-2">
            <Button
              variant={country === 'UK' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCountry('UK')}
            >
              UK (Equality Act 2010)
            </Button>
            <Button
              variant={country === 'US' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCountry('US')}
            >
              US (ADA)
            </Button>
          </div>
        </div>

        {/* Adjustments Selection */}
        <div>
          <Label className="mb-3 block">Select Adjustments ({selectedAdjustments.length} selected)</Label>
          <div className="space-y-6">
            {Object.entries(categorizedAdjustments).map(([category, adjustments]) => (
              <Card key={category} className="border-muted">
                <CardHeader>
                  <CardTitle className="text-base">{category}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {adjustments.map((adj) => (
                    <div key={adj.id} className="flex items-start gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                      <Checkbox
                        id={adj.id}
                        checked={selectedAdjustments.includes(adj.id)}
                        onCheckedChange={() => toggleAdjustment(adj.id)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <Label htmlFor={adj.id} className="font-medium cursor-pointer">
                          {adj.title}
                        </Label>
                        <p className="text-sm text-muted-foreground mt-1">{adj.description}</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <Badge variant="secondary" className="text-xs">
                            {adj.legalBasis.split(' ')[0]}
                          </Badge>
                          {adj.examples.slice(0, 2).map((ex, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {ex}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Preview */}
        {selectedAdjustments.length > 0 && (
          <Card className="border-2 border-indigo-300 dark:border-indigo-700 bg-indigo-50 dark:bg-indigo-950/20">
            <CardHeader>
              <CardTitle className="text-lg">Your Request Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  You've selected {selectedAdjustments.length} adjustment{selectedAdjustments.length !== 1 ? 's' : ''}:
                </p>
                <ul className="list-disc list-inside space-y-1">
                  {getSelectedDetails().map((adj) => (
                    <li key={adj.id} className="text-sm font-medium">{adj.title}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        <div className="flex gap-2 justify-center">
          <Button
            onClick={exportRequest}
            disabled={selectedAdjustments.length === 0}
            size="lg"
          >
            <Download className="w-4 h-4 mr-2" />
            Generate Request Letter
          </Button>
          {selectedAdjustments.length > 0 && (
            <Button
              variant="outline"
              onClick={() => setSelectedAdjustments([])}
              size="lg"
            >
              Clear Selection
            </Button>
          )}
        </div>

        {/* Resources */}
        <Card className="bg-muted">
          <CardContent className="pt-6 space-y-3">
            <p className="font-medium text-sm">Helpful Resources:</p>
            <div className="space-y-2 text-sm">
              {country === 'UK' ? (
                <>
                  <a
                    href="https://www.gov.uk/access-to-work"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-primary hover:underline"
                  >
                    Access to Work (UK Government funding)
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <a
                    href="https://www.acas.org.uk/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-primary hover:underline"
                  >
                    ACAS (Advisory, Conciliation and Arbitration Service)
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <a
                    href="https://www.autism.org.uk/advice-and-guidance/topics/employment"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-primary hover:underline"
                  >
                    National Autistic Society - Employment
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </>
              ) : (
                <>
                  <a
                    href="https://askjan.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-primary hover:underline"
                  >
                    Job Accommodation Network (JAN)
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <a
                    href="https://www.eeoc.gov/laws/guidance"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-primary hover:underline"
                  >
                    EEOC - ADA Guidance
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <a
                    href="https://autisticadvocacy.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-primary hover:underline"
                  >
                    Autistic Self Advocacy Network
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
}
