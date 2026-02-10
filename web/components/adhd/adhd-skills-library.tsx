"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, Zap, CheckCircle2 } from 'lucide-react';
import { adhdSkills, skillCategories } from '@/lib/data/adhd-skills';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { logSkillPractice, getProgress as getADHDProgress, initADHDStore } from '@/lib/adhd-progress-store';

// Explicit Tailwind class mappings (no dynamic classes)
const categoryButtonStyles: Record<string, string> = {
  blue: 'bg-blue-600 hover:bg-blue-700',
  green: 'bg-green-600 hover:bg-green-700',
  purple: 'bg-purple-600 hover:bg-purple-700',
  pink: 'bg-pink-600 hover:bg-pink-700',
  orange: 'bg-orange-600 hover:bg-orange-700',
};

const categoryBadgeStyles: Record<string, string> = {
  blue: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  green: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  purple: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  pink: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
  orange: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
};

export function ADHDSkillsLibrary() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [practicedSkills, setPracticedSkills] = useState<Set<string>>(new Set());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    initADHDStore();
    const progress = getADHDProgress();
    setPracticedSkills(progress.skills.practiced);
  }, []);

  const markAsPracticed = (skillId: string) => {
    logSkillPractice(skillId);
    const progress = getADHDProgress();
    setPracticedSkills(progress.skills.practiced);
  };

  const filteredSkills = adhdSkills.filter(skill => {
    const matchesSearch = skill.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         skill.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || skill.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getDopamineStars = (level: number) => {
    return '⭐'.repeat(level);
  };

  if (!mounted) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading Skills...</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="border-2 border-blue-300 dark:border-blue-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Zap className="w-6 h-6 text-blue-600" />
            ADHD Skills Toolkit
          </CardTitle>
          <CardDescription>
            Evidence-based strategies for managing ADHD - learn, practice, thrive! 🚀
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedCategory === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory('all')}
                className={selectedCategory === 'all' ? 'bg-purple-600 hover:bg-purple-700' : ''}
              >
                All Skills
              </Button>
              {skillCategories.map((cat) => (
                <Button
                  key={cat.id}
                  variant={selectedCategory === cat.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={selectedCategory === cat.id ? categoryButtonStyles[cat.color] || '' : ''}
                >
                  {cat.icon} {cat.label}
                </Button>
              ))}
            </div>
          </div>

          <div className="text-sm text-muted-foreground">
            Found {filteredSkills.length} skill{filteredSkills.length !== 1 ? 's' : ''} • 
            {practicedSkills.size} practiced
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AnimatePresence>
          {filteredSkills.map((skill, index) => {
            const isPracticed = practicedSkills.has(skill.id);
            const categoryInfo = skillCategories.find(c => c.id === skill.category);
            
            return (
              <motion.div
                key={skill.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className={`h-full hover:shadow-lg transition-all ${isPracticed ? 'border-green-300 dark:border-green-700 bg-green-50/50 dark:bg-green-950/20' : 'hover:scale-[1.02]'}`}>
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <CardTitle className="text-lg flex items-center gap-2">
                          {categoryInfo?.icon} {skill.title}
                          {isPracticed && <CheckCircle2 className="w-4 h-4 text-green-600" />}
                        </CardTitle>
                        <CardDescription className="mt-1">{skill.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="outline" className={categoryInfo?.color ? categoryBadgeStyles[categoryInfo.color] : ''}>
                        {categoryInfo?.label}
                      </Badge>
                      <Badge variant="outline">
                        {skill.difficulty}
                      </Badge>
                      <Badge variant="outline">
                        ⏱️ {skill.duration}
                      </Badge>
                      <Badge variant="outline" title="Dopamine Boost Level">
                        {getDopamineStars(skill.dopamineBoost)}
                      </Badge>
                    </div>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="w-full" variant="outline">
                          View Full Guide →
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle className="text-2xl">{categoryInfo?.icon} {skill.title}</DialogTitle>
                          <DialogDescription>{skill.description}</DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4">
                          <div>
                            <h4 className="font-semibold mb-2">📝 How To:</h4>
                            <ol className="space-y-2 pl-4">
                              {skill.howTo.map((step, i) => (
                                <li key={i} className="text-sm list-decimal">{step}</li>
                              ))}
                            </ol>
                          </div>

                          <div>
                            <h4 className="font-semibold mb-2">⚠️ Common Pitfalls:</h4>
                            <ul className="space-y-1 pl-4">
                              {skill.commonPitfalls.map((pitfall, i) => (
                                <li key={i} className="text-sm list-disc text-muted-foreground">{pitfall}</li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <h4 className="font-semibold mb-2">🎯 Age Adaptations:</h4>
                            <div className="space-y-2">
                              <Card className="bg-blue-50 dark:bg-blue-950/30">
                                <CardContent className="pt-3">
                                  <p className="text-sm"><strong>Children:</strong> {skill.ageAdaptations.children}</p>
                                </CardContent>
                              </Card>
                              <Card className="bg-purple-50 dark:bg-purple-950/30">
                                <CardContent className="pt-3">
                                  <p className="text-sm"><strong>Teens:</strong> {skill.ageAdaptations.teens}</p>
                                </CardContent>
                              </Card>
                              <Card className="bg-green-50 dark:bg-green-950/30">
                                <CardContent className="pt-3">
                                  <p className="text-sm"><strong>Adults:</strong> {skill.ageAdaptations.adults}</p>
                                </CardContent>
                              </Card>
                            </div>
                          </div>

                          <div>
                            <h4 className="font-semibold mb-2">📚 Evidence:</h4>
                            <ul className="space-y-1 pl-4">
                              {skill.citations.map((citation, i) => (
                                <li key={i} className="text-sm text-muted-foreground list-disc">{citation}</li>
                              ))}
                            </ul>
                          </div>

                          {!isPracticed && (
                            <Button
                              className="w-full bg-green-600 hover:bg-green-700"
                              onClick={() => markAsPracticed(skill.id)}
                            >
                              <CheckCircle2 className="w-4 h-4 mr-2" />
                              Mark as Practiced
                            </Button>
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
