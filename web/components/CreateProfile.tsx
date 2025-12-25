'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserPlus, Users, Settings } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export function CreateProfile() {
  return (
    <Card className="overflow-hidden border-2 border-primary/20">
      <CardContent className="p-6 sm:p-8 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Users className="w-6 h-6 text-foreground" />
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                Who's Learning Today?
              </h2>
              <Settings className="w-5 h-5 text-muted-foreground ml-auto" />
            </div>
            <p className="text-sm sm:text-base text-muted-foreground">
              Create a profile to start learning!
            </p>
          </div>
          <Link href="#" className="text-xs text-primary hover:underline whitespace-nowrap">
            Create Profile
          </Link>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-4">
          <Button 
            variant="outline" 
            size="lg" 
            className="w-full gap-2 justify-start text-base"
            onClick={() => {
              toast.info('Profile features coming soon! Create personalized learning paths for multiple learners.');
            }}
          >
            <UserPlus className="w-5 h-5" />
            Add New Learner
          </Button>
          <Button 
            variant="outline" 
            size="lg" 
            className="w-full gap-2 justify-start text-base"
            onClick={() => {
              toast.info('Classroom features coming soon! Connect with teachers and track student progress.');
            }}
          >
            <Users className="w-5 h-5" />
            Join a Classroom
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
