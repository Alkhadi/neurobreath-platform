'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UserPlus, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

export function CreateProfile() {
  const [isOpen, setIsOpen] = useState(false);
  const [learnerName, setLearnerName] = useState('');
  const [profiles, setProfiles] = useState<string[]>([]);

  const handleAddLearner = () => {
    if (learnerName.trim()) {
      setProfiles([...profiles, learnerName.trim()]);
      setLearnerName('');
    }
  };

  return (
    <Card className="overflow-hidden border-2 border-primary/20">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 p-4 sm:p-6">
        <div>
          <p className="text-xs sm:text-sm uppercase tracking-wider text-primary font-semibold mb-1">
            Create Profile
          </p>
          <h2 className="text-lg sm:text-xl font-bold">Who's Learning Today?</h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Create a profile to start learning!
          </p>
        </div>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Enter learner name..."
              value={learnerName}
              onChange={(e) => setLearnerName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddLearner()}
              className="flex-1"
            />
            <Button onClick={handleAddLearner} className="gap-2">
              <UserPlus className="w-4 h-4" />
              <span className="hidden sm:inline">Add New Learner</span>
              <span className="sm:hidden">Add</span>
            </Button>
          </div>
          <Button variant="outline" className="w-full gap-2">
            <Users className="w-4 h-4" />
            Join a Classroom
          </Button>
          {profiles.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Active Learners:</p>
              <div className="grid gap-2">
                {profiles.map((profile, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-muted rounded-lg flex items-center gap-2"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                      {profile[0].toUpperCase()}
                    </div>
                    <span className="font-medium">{profile}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
