/**
 * ProfileCreationDialog Component
 *
 * A dialog for creating a new learner profile.
 * After first profile, triggers PIN setup (device security).
 */

'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useOnboarding } from '@/hooks/useOnboarding';
import { getDeviceId } from '@/lib/device-id';
import { toast } from 'sonner';
import { UserPlus, Sparkles } from 'lucide-react';
import { saveLearnerProfile, hasAnyLearnerProfile } from '@/lib/onboarding/deviceProfileStore';
import { isPinSet } from '@/lib/security/devicePinStore';
import { PinSetupDialog } from '@/components/security/PinSetupDialog';

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
  const [showPinSetup, setShowPinSetup] = useState(false);
  const [isFirstProfile, setIsFirstProfile] = useState(false);

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
      const deviceId = getDeviceId();
      const ageNum = age ? parseInt(age) : undefined;
      
      // Check if this is the first profile
      const hadProfilesBefore = hasAnyLearnerProfile();

      // Call API to create profile in database
      const response = await fetch('/api/profile/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          deviceId,
          name: name.trim(),
          age: ageNum,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create profile');
      }

      const data = await response.json();

      // Save to device profile store
      const deviceProfile = saveLearnerProfile({
        name: name.trim(),
        age: ageNum,
      });

      // Also save to localStorage for backward compatibility
      const localProfile: LearnerProfile = {
        id: deviceProfile.id,
        name: deviceProfile.name,
        age: ageNum,
        createdAt: deviceProfile.createdAt,
      };
      setLearnerProfile(localProfile);

      // Mark onboarding as complete
      completeOnboarding();

      // Show success message
      toast.success(`Welcome, ${deviceProfile.name}! Your profile has been created.`, {
        duration: 4000,
      });

      // Close profile dialog
      onOpenChange(false);
      
      // Reset form
      setName('');
      setAge('');
      
      // If this was the first profile and PIN not set, require PIN setup
      if (!hadProfilesBefore && !isPinSet()) {
        setIsFirstProfile(true);
        setShowPinSetup(true);
      } else {
        // Reload to update UI
        window.location.reload();
      }
    } catch (error) {
      console.error('Error creating profile:', error);
      toast.error(
        error instanceof Error 
          ? error.message 
          : 'Failed to create profile. Please try again.',
        { duration: 5000 }
      );
    } finally {
      setIsCreating(false);
    }
  };
  
  const handlePinSetupComplete = () => {
    toast.success('Profile secured! You can now manage multiple profiles.', {
      duration: 4000,
    });
    // Reload to update UI
    window.location.reload();
  };

  const handleCancel = () => {
    setName('');
    setAge('');
    onOpenChange(false);
  };

  return (
    <>
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
                name="name"
                type="text"
                placeholder="Enter learner's name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isCreating}
                className="w-full"
                autoComplete="name"
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
                name="age"
                type="number"
                placeholder="Enter age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                disabled={isCreating}
                className="w-full"
                min="1"
                max="120"
                autoComplete="off"
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
      
      {/* PIN Setup Dialog (triggered after first profile) */}
      <PinSetupDialog
        open={showPinSetup}
        onOpenChange={setShowPinSetup}
        onComplete={handlePinSetupComplete}
        allowClose={false}
      />
    </>
  );
}
