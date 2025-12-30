/**
 * ClassroomJoinDialog Component
 *
 * Collects a classroom code so learners can connect with their teacher.
 * Saves locally and marks onboarding as complete when submitted.
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
import { KeyRound, ShieldCheck, Users } from 'lucide-react';

export interface ClassroomJoinDetails {
  classCode: string;
  learnerName?: string;
  guardianEmail?: string;
  joinedAt: string;
}

interface ClassroomJoinDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onJoined?: (details: ClassroomJoinDetails) => void;
}

export function ClassroomJoinDialog({ open, onOpenChange, onJoined }: ClassroomJoinDialogProps) {
  const [classCode, setClassCode] = useState('');
  const [learnerName, setLearnerName] = useState('');
  const [guardianEmail, setGuardianEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [, setJoinDetails] = useLocalStorage<ClassroomJoinDetails | null>('classroomJoinDetails', null);
  const { completeOnboarding } = useOnboarding();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const cleanedCode = classCode.trim().toUpperCase();
    if (!cleanedCode) {
      toast.error('Enter your classroom code to join.');
      return;
    }

    if (cleanedCode.length < 4) {
      toast.error('Classroom codes are at least 4 characters.');
      return;
    }

    setIsSubmitting(true);

    try {
      const details: ClassroomJoinDetails = {
        classCode: cleanedCode,
        learnerName: learnerName.trim() || undefined,
        guardianEmail: guardianEmail.trim() || undefined,
        joinedAt: new Date().toISOString(),
      };

      setJoinDetails(details);
      completeOnboarding();
      onJoined?.(details);

      toast.success('You are connected! Your teacher can now track your progress.');

      setClassCode('');
      setLearnerName('');
      setGuardianEmail('');
      onOpenChange(false);
    } catch (error) {
      console.error('[ClassroomJoinDialog] Failed to join classroom:', error);
      toast.error('Could not join classroom. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRequestClose = () => {
    if (isSubmitting) return;
    setClassCode('');
    setLearnerName('');
    setGuardianEmail('');
    onOpenChange(false);
  };

  const handleDialogChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      handleRequestClose();
      return;
    }
    onOpenChange(true);
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <DialogTitle>Join Your Classroom</DialogTitle>
          </div>
          <DialogDescription>
            Enter the code from your teacher to connect and share progress.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 pt-2">
          <div className="space-y-2">
            <Label htmlFor="classCode" className="text-sm font-medium">
              Classroom Code <span className="text-destructive">*</span>
            </Label>
            <Input
              id="classCode"
              value={classCode}
              onChange={(e) => setClassCode(e.target.value)}
              placeholder="e.g. ABCD123"
              disabled={isSubmitting}
              autoFocus
            />
            <p className="text-xs text-muted-foreground">
              Your teacher or therapist shares this code. It is case-insensitive.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="learnerName" className="text-sm font-medium">
                Learner name <span className="text-muted-foreground text-xs">(optional)</span>
              </Label>
              <Input
                id="learnerName"
                value={learnerName}
                onChange={(e) => setLearnerName(e.target.value)}
                placeholder="Who is joining?"
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="guardianEmail" className="text-sm font-medium">
                Guardian email <span className="text-muted-foreground text-xs">(optional)</span>
              </Label>
              <Input
                id="guardianEmail"
                type="email"
                value={guardianEmail}
                onChange={(e) => setGuardianEmail(e.target.value)}
                placeholder="for progress reports"
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="p-3 rounded-lg bg-muted/50 border border-border/60">
            <div className="flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <div className="text-xs text-muted-foreground space-y-1">
                <p className="text-foreground font-medium">Privacy-first</p>
                <p>We only save this on your device so your teacher can connect you.</p>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-1">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={handleRequestClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90" disabled={isSubmitting}>
              {isSubmitting ? 'Joining...' : 'Join Classroom'}
              <KeyRound className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
