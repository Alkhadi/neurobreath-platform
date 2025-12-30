/**
 * ProfileCreationDialog Component
 *
 * A dialog for creating a new learner profile.
 * When profile is successfully created, it marks onboarding as complete.
 */

'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useOnboarding } from '@/hooks/useOnboarding';
import { toast } from 'sonner';
import { UserPlus, Sparkles } from 'lucide-react';

interface LearnerProfile {
  id: string;
  name: string;
  age?: number;
  createdAt: string;
}

interface ProfileCreationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProfileCreationDialog({ open, onOpenChange }: ProfileCreationDialogProps) {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const [, setLearnerProfile] = useLocalStorage<LearnerProfile | null>('learnerProfile', null);
  const { completeOnboarding } = useOnboarding();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error('Please enter a name');
      return;
    }

    setIsCreating(true);

    try {
      // Create the profile
      const newProfile: LearnerProfile = {
        id: `profile_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: name.trim(),
        age: age ? parseInt(age) : undefined,
        createdAt: new Date().toISOString(),
      };

      // Save to localStorage
      setLearnerProfile(newProfile);

      // Mark onboarding as complete
      completeOnboarding();

      // Show success message
      toast.success(`Welcome, ${newProfile.name}! Your profile has been created.`, {
        duration: 4000,
      });

      // Close dialog
      onOpenChange(false);

      // Reset form
      setName('');
      setAge('');
    } catch (error) {
      console.error('Error creating profile:', error);
      toast.error('Failed to create profile. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleCancel = () => {
    setName('');
    setAge('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <UserPlus className="w-5 h-5 text-primary" />
            </div>
            <DialogTitle>Create Learner Profile</DialogTitle>
          </div>
          <DialogDescription>
            Create a profile to track progress and get personalized recommendations.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          {/* Name Field */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter learner's name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isCreating}
              className="w-full"
              autoFocus
            />
          </div>

          {/* Age Field (Optional) */}
          <div className="space-y-2">
            <Label htmlFor="age" className="text-sm font-medium">
              Age <span className="text-muted-foreground text-xs">(optional)</span>
            </Label>
            <Input
              id="age"
              type="number"
              placeholder="Enter age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              disabled={isCreating}
              className="w-full"
              min="1"
              max="120"
            />
          </div>

          {/* Benefits Reminder */}
          <div className="p-3 rounded-lg bg-blue-50/50 dark:bg-blue-950/20 border border-primary/10">
            <div className="flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <div className="text-xs text-muted-foreground">
                <p className="font-medium text-foreground mb-1">You'll be able to:</p>
                <ul className="space-y-0.5">
                  <li>• Track progress across all activities</li>
                  <li>• Get personalized recommendations</li>
                  <li>• Export progress reports</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isCreating}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isCreating || !name.trim()}
              className="flex-1 bg-primary hover:bg-primary/90"
            >
              {isCreating ? 'Creating...' : 'Create Profile'}
            </Button>
          </div>

          {/* Privacy Notice */}
          <div className="pt-2 border-t border-border/30">
            <p className="text-xs text-muted-foreground text-center">
              <span className="text-green-600 dark:text-green-400">🔒</span> Saved privately on your
              device. No account needed.
            </p>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
