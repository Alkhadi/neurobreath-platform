'use client';

import { useState, useMemo, useRef } from 'react';
import { skills } from '@/lib/data/skills';
import { useProgress } from '@/hooks/autism/use-progress';
import { usePreferences } from '@/hooks/autism/use-preferences';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, ExternalLink, Check, BookOpen } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type Skill = (typeof skills)[number];
type EvidenceLink = { url: string; text: string };

export const SkillsLibrary = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const { logSkill } = useProgress();
  const { preferences } = usePreferences();
  const { toast } = useToast();
  const skillsRef = useRef<HTMLDivElement>(null);

  // Get all unique tags
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    skills?.forEach?.(skill => {
      skill?.tags?.forEach?.(tag => tagSet?.add?.(tag));
    });
    return Array.from(tagSet)?.sort?.();
  }, []);

  // Filter skills
  const filteredSkills = useMemo(() => {
    return skills?.filter?.(skill => {
      // Search filter
      const matchesSearch = !searchTerm ||
        skill?.title?.toLowerCase?.()?.includes?.(searchTerm?.toLowerCase?.()) ||
        skill?.description?.toLowerCase?.()?.includes?.(searchTerm?.toLowerCase?.());

      // Tag filter
      const matchesTags = selectedTags?.length === 0 ||
        selectedTags?.some?.(tag => skill?.tags?.includes?.(tag));

      // Audience filter (optional - show all if not specified)
      const matchesAudience = !skill?.audienceRelevance ||
        skill?.audienceRelevance?.includes?.(preferences?.audience);

      return matchesSearch && matchesTags && matchesAudience;
    });
  }, [searchTerm, selectedTags, preferences?.audience]);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev?.includes?.(tag)
        ? prev?.filter?.(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleLogPractice = (skillId: string, skillTitle: string) => {
    logSkill?.(skillId);
    toast?.({
      title: 'Practice logged!',
      description: `You practiced: ${skillTitle}`,
    });
  };

  return (
    <section ref={skillsRef} className="py-12 bg-white dark:bg-gray-900">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="flex items-center gap-3 mb-8">
          <BookOpen className="h-8 w-8 text-blue-600" />
          <h2 className="text-3xl font-bold">Skills Library</h2>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search strategies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm?.(e?.target?.value ?? '')}
              className="pl-10"
            />
          </div>
        </div>

        {/* Tag filters */}
        <div className="mb-8">
          <p className="text-sm font-semibold mb-3">Filter by type:</p>
          <div className="flex flex-wrap gap-2">
            {allTags?.map?.(tag => (
              <Badge
                key={tag}
                variant={selectedTags?.includes?.(tag) ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => toggleTag?.(tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* Skills grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredSkills?.map?.(skill => (
            <SkillCard
              key={skill?.id}
              skill={skill}
              onLogPractice={handleLogPractice}
            />
          ))}
        </div>

        {filteredSkills?.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No skills found matching your filters.</p>
            <Button
              variant="link"
              onClick={() => {
                setSearchTerm('');
                setSelectedTags([]);
              }}
            >
              Clear filters
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

interface SkillCardProps {
  skill: Skill;
  onLogPractice: (id: string, title: string) => void;
}

const SkillCard = ({ skill, onLogPractice }: SkillCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <h3 className="text-xl font-semibold mb-2">{skill?.title}</h3>
      <p className="text-sm text-muted-foreground mb-4">{skill?.description}</p>

      <div className="mb-4">
        <p className="text-sm font-semibold mb-1">Why it helps:</p>
        <p className="text-sm">{skill?.whyItHelps}</p>
      </div>

      {isExpanded && (
        <div className="space-y-4 mb-4">
          <div>
            <p className="text-sm font-semibold mb-2">How to do it:</p>
            <ol className="text-sm space-y-1 list-decimal list-inside">
              {skill?.howToDo?.map?.((step: string, idx: number) => (
                <li key={idx}>{step}</li>
              ))}
            </ol>
          </div>

          <div>
            <p className="text-sm font-semibold mb-2">Common pitfalls:</p>
            <ul className="text-sm space-y-1 list-disc list-inside">
              {skill?.commonPitfalls?.map?.((pitfall: string, idx: number) => (
                <li key={idx}>{pitfall}</li>
              ))}
            </ul>
          </div>

          {skill?.evidenceLinks && skill?.evidenceLinks?.length > 0 && (
            <div>
              <p className="text-sm font-semibold mb-2">Evidence:</p>
              <div className="space-y-1">
                {skill?.evidenceLinks?.map?.((link: EvidenceLink, idx: number) => (
                  <Button
                    key={idx}
                    variant="link"
                    size="sm"
                    className="p-0 h-auto text-xs"
                    onClick={() => window?.open?.(link?.url, '_blank')}
                  >
                    {link?.text}
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsExpanded?.(!isExpanded)}
          className="flex-1"
        >
          {isExpanded ? 'Show less' : 'Show more'}
        </Button>
        <Button
          size="sm"
          onClick={() => onLogPractice?.(skill?.id, skill?.title)}
          className="gap-2"
        >
          <Check className="h-4 w-4" />
          Log practice
        </Button>
      </div>
    </Card>
  );
};
