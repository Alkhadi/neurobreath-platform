'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Heart, Rocket, Zap, Star, BookOpen, Users } from 'lucide-react';

export function ADHDResourcesLibrary() {
  const resources = [
    { title: "504 Plan Request Letter", description: "Request ADHD accommodations at school (US)", icon: BookOpen, badge: "Parents" },
    { title: "Workplace Accommodations", description: "Request ADA accommodations at work", icon: Heart, badge: "Adults" },
    { title: "Dopamine Menu", description: "Create your personalized activity menu", icon: Zap, badge: "All Ages" },
    { title: "Focus Block Planner", description: "Visual time-blocking for ADHD brains", icon: Rocket, badge: "All Ages" },
    { title: "Medication Tracker", description: "Track effectiveness and side effects", icon: Star, badge: "All Ages" },
    { title: "Parent-Teacher Plan", description: "Collaboration plan for school support", icon: Users, badge: "Parents & Teachers" }
  ];

  return (
    <div className="mx-auto px-4" style={{ width: '86vw', maxWidth: '86vw' }}>
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">ADHD Resources & Templates 📋</h2>
        <p className="text-muted-foreground max-w-3xl mx-auto">
          Downloadable templates for 504 plans, workplace accommodations, dopamine menus, and more
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {resources.map((resource, index) => (
          <Card key={index} className="hover:shadow-lg transition-all hover:scale-105 cursor-pointer border-2">
            <CardHeader>
              <div className="flex items-start justify-between gap-2">
                <div className="p-2 bg-muted rounded-lg">
                  <resource.icon className="w-8 h-8 text-blue-600" />
                </div>
                <Badge variant="outline">{resource.badge}</Badge>
              </div>
              <CardTitle className="text-lg mt-2">{resource.title}</CardTitle>
              <CardDescription>{resource.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="outline" disabled>
                <Download className="w-4 h-4 mr-2" />
                Coming Soon 🚧
              </Button>
              <p className="text-xs text-muted-foreground mt-2 text-center">
                Template editor in development
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
