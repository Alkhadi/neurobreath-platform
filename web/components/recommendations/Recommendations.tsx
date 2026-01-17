/**
 * Recommendations Component
 * 
 * Displays personalized content recommendations based on user behavior.
 */

'use client';

import { useRecommendations } from '@/lib/recommendations/hooks';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, BookOpen, Compass, Wrench } from 'lucide-react';
import Link from 'next/link';

interface RecommendationsProps {
  maxPerSection?: number;
  showAllSections?: boolean;
}

export function Recommendations({ maxPerSection = 3, showAllSections = true }: RecommendationsProps) {
  const { journeys, guides, tools, isLoading } = useRecommendations();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recommendations</CardTitle>
          <CardDescription>Loading personalized suggestions...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const hasAnyRecommendations = journeys.length > 0 || guides.length > 0 || tools.length > 0;

  if (!hasAnyRecommendations) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Compass className="w-5 h-5" />
            Discover Content
          </CardTitle>
          <CardDescription>
            Start exploring our journeys, guides, and tools. As you save items and complete activities,
            we'll provide personalized recommendations here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button asChild variant="outline">
              <Link href="/journeys">
                <Compass className="w-4 h-4 mr-2" />
                Browse Journeys
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/guides">
                <BookOpen className="w-4 h-4 mr-2" />
                Explore Guides
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/tools">
                <Wrench className="w-4 h-4 mr-2" />
                Try Tools
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Compass className="w-5 h-5" />
            Recommended for You
          </CardTitle>
          <CardDescription>
            Personalized suggestions based on your interests and progress
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Recommended Journeys */}
      {showAllSections && journeys.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Journeys You Might Like</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {journeys.slice(0, maxPerSection).map(rec => (
              <div
                key={rec.id}
                className="flex items-start justify-between gap-4 p-4 rounded-lg border bg-card hover:bg-accent/5 transition-colors"
              >
                <div className="flex-1">
                  <h4 className="font-semibold text-sm mb-1">{rec.title}</h4>
                  <p className="text-xs text-muted-foreground">{rec.reason}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {rec.tags.slice(0, 3).map(tag => (
                      <span
                        key={tag}
                        className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <Button asChild size="sm" variant="outline">
                  <Link href={rec.href}>
                    View
                    <ArrowRight className="w-3 h-3 ml-1" />
                  </Link>
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Recommended Guides */}
      {showAllSections && guides.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Guides for You</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {guides.slice(0, maxPerSection).map(rec => (
              <div
                key={rec.id}
                className="flex items-start justify-between gap-4 p-4 rounded-lg border bg-card hover:bg-accent/5 transition-colors"
              >
                <div className="flex-1">
                  <h4 className="font-semibold text-sm mb-1">{rec.title}</h4>
                  <p className="text-xs text-muted-foreground">{rec.reason}</p>
                </div>
                <Button asChild size="sm" variant="outline">
                  <Link href={rec.href}>
                    View
                    <ArrowRight className="w-3 h-3 ml-1" />
                  </Link>
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Recommended Tools */}
      {showAllSections && tools.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Tools to Try</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {tools.slice(0, maxPerSection).map(rec => (
              <div
                key={rec.id}
                className="flex items-start justify-between gap-4 p-4 rounded-lg border bg-card hover:bg-accent/5 transition-colors"
              >
                <div className="flex-1">
                  <h4 className="font-semibold text-sm mb-1">{rec.title}</h4>
                  <p className="text-xs text-muted-foreground">{rec.reason}</p>
                </div>
                <Button asChild size="sm" variant="outline">
                  <Link href={rec.href}>
                    Try
                    <ArrowRight className="w-3 h-3 ml-1" />
                  </Link>
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
