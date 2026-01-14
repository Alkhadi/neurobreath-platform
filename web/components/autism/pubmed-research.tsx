'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { BookOpen, ExternalLink, Search, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface PubMedArticle {
  pmid: string;
  title: string;
  authors: string[];
  journal: string;
  year: string;
  abstract: string;
  doi?: string;
  url: string;
}

interface PubMedResponse {
  articles: PubMedArticle[];
  total: number;
  query: string;
  yearFrom: string;
}

const PRESET_TOPICS = [
  // Autism Topics
  { label: 'Autism Support Strategies', query: 'autism support strategies interventions' },
  { label: 'Sensory Processing', query: 'autism sensory processing regulation' },
  { label: 'Communication & AAC', query: 'autism communication AAC augmentative' },
  { label: 'Education & IEP', query: 'autism education inclusive teaching' },
  { label: 'Workplace Accommodations', query: 'autism employment workplace accommodations' },
  { label: 'Mental Health & Anxiety', query: 'autism anxiety depression mental health' },
  
  // Additional Neurodevelopmental & Mental Health Topics
  { label: '📖 Dyslexia & Reading', query: 'dyslexia reading intervention training strategies' },
  { label: '⚡ ADHD Support', query: 'ADHD attention deficit hyperactivity strategies management' },
  { label: '💙 Depression', query: 'depression treatment interventions therapy evidence based' },
  { label: '⚡ Bipolar Disorder', query: 'bipolar disorder management treatment mood stabilization' },
  { label: '😓 Stress Management', query: 'stress management techniques coping strategies workplace' },
  { label: '💤 Sleep Issues', query: 'sleep disorders insomnia interventions sleep hygiene' },
  { label: '🌧️ Low Mood & Burnout', query: 'burnout prevention low mood mental wellbeing strategies' },
  
  // NHS Research
  { label: '🏥 NHS Guidelines', query: 'NHS NICE guidelines mental health neurodevelopmental' },
];

export function PubMedResearch() {
  const [articles, setArticles] = useState<PubMedArticle[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [customQuery, setCustomQuery] = useState('');
  const [activeQuery, setActiveQuery] = useState('');
  const [total, setTotal] = useState(0);
  const [yearFrom, setYearFrom] = useState('2020');

  const fetchResearch = async (query: string) => {
    setLoading(true);
    setError(null);
    setActiveQuery(query);

    try {
      const response = await fetch(
        `/api/pubmed?query=${encodeURIComponent(query)}&max=10&yearFrom=${yearFrom}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch research');
      }

      const data: PubMedResponse = await response.json();
      setArticles(data.articles);
      setTotal(data.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePresetClick = (query: string) => {
    fetchResearch(query);
  };

  const handleCustomSearch = () => {
    if (customQuery.trim()) {
      fetchResearch(customQuery.trim());
    }
  };

  return (
    <div className="w-full">
      <section className="space-y-6">
        <Card className="bg-white/95 dark:bg-gray-900/95 backdrop-blur border-purple-200 dark:border-purple-800">
          <CardHeader>
          <div className="flex items-start gap-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <BookOpen className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-2xl">Live PubMed Research</CardTitle>
              <CardDescription className="mt-1">
                Access peer-reviewed research on autism, ADHD, dyslexia, mental health, and more from PubMed's database of 35+ million citations
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Preset Topics */}
          <div>
            <h3 className="text-sm font-medium mb-3">Quick Topics</h3>
            <div className="flex flex-wrap gap-2">
              {PRESET_TOPICS.map((topic) => (
                <Button
                  key={topic.query}
                  variant="outline"
                  size="sm"
                  onClick={() => handlePresetClick(topic.query)}
                  className="text-xs"
                  disabled={loading}
                >
                  {topic.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Custom Search */}
          <div>
            <h3 className="text-sm font-medium mb-3">Custom Search</h3>
            <div className="flex gap-2">
              <Input
                placeholder="Enter search terms (e.g., autism communication visual supports)"
                value={customQuery}
                onChange={(e) => setCustomQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCustomSearch()}
                disabled={loading}
              />
              <Button onClick={handleCustomSearch} disabled={loading || !customQuery.trim()}>
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
            </div>
          </div>

          {/* Year Filter */}
          <div>
            <h3 className="text-sm font-medium mb-3">Filter by Year</h3>
            <div className="flex flex-wrap gap-2">
              {['2024', '2023', '2022', '2020', '2015'].map((year) => (
                <Button
                  key={year}
                  variant={yearFrom === year ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setYearFrom(year)}
                  disabled={loading}
                  className="min-w-[60px]"
                >
                  {year}+
                </Button>
              ))}
            </div>
          </div>

          {/* Results Summary */}
          {activeQuery && !loading && !error && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Found {total.toLocaleString()} articles matching "{activeQuery}" (showing top 10)
              </AlertDescription>
            </Alert>
          )}

          {/* Error State */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Loading State */}
          {loading && (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2 mt-2" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-20 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Articles List */}
          {!loading && articles.length > 0 && (
            <div className="space-y-4">
              {articles.map((article) => (
                <Card key={article.pmid} className="hover:border-purple-300 dark:hover:border-purple-700 transition-colors">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <CardTitle className="text-lg leading-tight">
                          {article.title}
                        </CardTitle>
                        <CardDescription className="mt-2">
                          <span className="font-medium">{article.authors.join(', ')}</span>
                          {article.authors.length === 5 && ' et al.'}
                        </CardDescription>
                      </div>
                      <Badge variant="secondary" className="shrink-0">
                        {article.year}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground italic">
                      {article.journal}
                    </p>
                    <p className="text-sm leading-relaxed">
                      {article.abstract}
                    </p>
                    <div className="flex items-center gap-4 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                      >
                        <a
                          href={article.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2"
                        >
                          View on PubMed
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </Button>
                      {article.doi && (
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                        >
                          <a
                            href={`https://doi.org/${article.doi}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-xs"
                          >
                            DOI: {article.doi}
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && articles.length === 0 && activeQuery && (
            <Card className="bg-white/95 dark:bg-gray-900/95 backdrop-blur border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <BookOpen className="w-12 h-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground text-center">
                  No articles found for this search.
                  <br />
                  Try different search terms or adjust the year filter.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Initial State */}
          {!loading && !error && articles.length === 0 && !activeQuery && (
            <Card className="bg-white/95 dark:bg-gray-900/95 backdrop-blur border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Search className="w-12 h-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground text-center">
                  Select a quick topic or enter custom search terms to explore the latest autism research
                </p>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </section>
    </div>
  );
}
