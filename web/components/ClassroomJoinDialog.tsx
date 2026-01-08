/**
 * ClassroomJoinDialog Component (Role-Neutral, Upgraded)
 *
 * Supports connection for:
 * - Parents/Guardians connecting to their child's progress
 * - Learners joining a classroom or support group
 * - Teachers managing their class
 * - Tutors/Therapists tracking client progress
 * 
 * Privacy-first: All data stored device-local by default.
 */

'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useOnboarding } from '@/hooks/useOnboarding';
import { toast } from 'sonner';
import { Users, ShieldCheck, Info } from 'lucide-react';

export interface ClassroomJoinDetails {
  groupCode: string;
  classCode?: string;
  learnerLabel?: string;
  contactEmail?: string;
  role?: 'parent' | 'learner' | 'teacher' | 'tutor' | 'other';
  className?: string; // For teachers
  joinedAt: string;
}

interface ClassroomJoinDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onJoined?: (details: ClassroomJoinDetails) => void;
}

export function ClassroomJoinDialog({ open, onOpenChange, onJoined }: ClassroomJoinDialogProps) {
  const [groupCode, setGroupCode] = useState('');
  const [learnerLabel, setLearnerLabel] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [role, setRole] = useState<string>('');
  const [className, setClassName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailError, setEmailError] = useState('');

  const [, setJoinDetails] = useLocalStorage<ClassroomJoinDetails | null>('classroomJoinDetails', null);
  const { completeOnboarding } = useOnboarding();

  // Email validation
  const validateEmail = (email: string): boolean => {
    if (!email) return true; // Optional field
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (value: string) => {
    setContactEmail(value);
    if (value && !validateEmail(value)) {
      setEmailError('Please enter a valid email address');
    } else {
      setEmailError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    const cleanedCode = groupCode.trim().toUpperCase();
    if (!cleanedCode) {
      toast.error('Please enter your group code');
      return;
    }

    if (cleanedCode.length < 4) {
      toast.error('Group codes are at least 4 characters');
      return;
    }

    // Email validation (if provided)
    if (contactEmail && !validateEmail(contactEmail)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);

    try {
      const details: ClassroomJoinDetails = {
        groupCode: cleanedCode,
        learnerLabel: learnerLabel.trim() || undefined,
        contactEmail: contactEmail.trim() || undefined,
        role: role as any || undefined,
        className: (role === 'teacher' && className.trim()) ? className.trim() : undefined,
        joinedAt: new Date().toISOString(),
      };

      setJoinDetails(details);
      completeOnboarding();
      onJoined?.(details);

      // Role-specific success message
      let successMessage = 'Connected successfully! ';
      if (role === 'parent') {
        successMessage += 'You can now view your learner\'s progress.';
      } else if (role === 'teacher') {
        successMessage += 'Your class is ready to track.';
      } else if (role === 'tutor') {
        successMessage += 'You can now monitor client progress.';
      } else {
        successMessage += 'Progress sharing is now enabled.';
      }

      toast.success(successMessage, { duration: 4000 });

      // Reset form
      setGroupCode('');
      setLearnerLabel('');
      setContactEmail('');
      setRole('');
      setClassName('');
      setEmailError('');
      onOpenChange(false);
    } catch (error) {
      console.error('[ClassroomJoinDialog] Failed to join:', error);
      toast.error('Could not connect. Please check your code and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRequestClose = () => {
    if (isSubmitting) return;
    setGroupCode('');
    setLearnerLabel('');
    setContactEmail('');
    setRole('');
    setClassName('');
    setEmailError('');
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
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] flex flex-col p-0">
        <div className="px-6 pt-6">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <DialogTitle>Join a Classroom or Support Group</DialogTitle>
            </div>
            <DialogDescription>
              Connect to a teacher, tutor, therapist, or parent group using a shared code. 
              This lets you share progress (only if you choose).
            </DialogDescription>
          </DialogHeader>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="flex-1 overflow-y-auto px-6 space-y-5 pt-4 pb-4">
          {/* Group Code (Required) */}
          <div className="space-y-2">
            <Label htmlFor="groupCode" className="text-sm font-medium">
              Group Code <span className="text-destructive">*</span>
            </Label>
            <Input
              id="groupCode"
              name="groupCode"
              type="text"
              placeholder="e.g. ABCD123"
              value={groupCode}
              onChange={(e) => setGroupCode(e.target.value)}
              disabled={isSubmitting}
              className="w-full uppercase"
              autoComplete="one-time-code"
              autoFocus
              maxLength={20}
              aria-required="true"
              aria-describedby="groupCode-help"
            />
            <p id="groupCode-help" className="text-xs text-muted-foreground">
              The organiser (teacher/tutor/therapist/parent admin) will give you this code. 
              Codes are not case-sensitive.
            </p>
          </div>

          {/* Learner Label (Optional) */}
          <div className="space-y-2">
            <Label htmlFor="learnerLabel" className="text-sm font-medium">
              Who is joining? <span className="text-muted-foreground text-xs">(optional)</span>
            </Label>
            <Input
              id="learnerLabel"
              name="learnerLabel"
              type="text"
              placeholder='e.g., "Sam", "Year 5 – Group A", "Adult learner"'
              value={learnerLabel}
              onChange={(e) => setLearnerLabel(e.target.value)}
              disabled={isSubmitting}
              className="w-full"
              autoComplete="nickname"
              maxLength={60}
              aria-describedby="learnerLabel-help"
            />
            <p id="learnerLabel-help" className="text-xs text-muted-foreground">
              This helps the organiser identify the correct learner. Avoid full names if you prefer.
            </p>
          </div>

          {/* Contact Email (Optional) */}
          <div className="space-y-2">
            <Label htmlFor="contactEmail" className="text-sm font-medium">
              Contact for progress updates <span className="text-muted-foreground text-xs">(optional)</span>
            </Label>
            <Input
              id="contactEmail"
              name="contactEmail"
              type="email"
              placeholder="your@email.com"
              value={contactEmail}
              onChange={(e) => handleEmailChange(e.target.value)}
              disabled={isSubmitting}
              className="w-full"
              autoComplete="email"
              aria-describedby="contactEmail-help"
              aria-invalid={!!emailError}
            />
            {emailError ? (
              <p className="text-xs text-destructive flex items-center gap-1">
                <Info className="w-3 h-3" />
                {emailError}
              </p>
            ) : (
              <p id="contactEmail-help" className="text-xs text-muted-foreground">
                Use a parent/guardian email for children, or your own email for adults.
              </p>
            )}
          </div>

          {/* Role (Optional) */}
          <div className="space-y-2">
            <Label htmlFor="role" className="text-sm font-medium">
              Role <span className="text-muted-foreground text-xs">(optional)</span>
            </Label>
            <Select value={role} onValueChange={setRole} disabled={isSubmitting}>
              <SelectTrigger id="role" aria-describedby="role-help">
                <SelectValue placeholder="Select your role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="parent">Parent/Guardian</SelectItem>
                <SelectItem value="learner">Learner</SelectItem>
                <SelectItem value="teacher">Teacher</SelectItem>
                <SelectItem value="tutor">Tutor/Therapist</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            <p id="role-help" className="text-xs text-muted-foreground">
              This helps tailor what you see next (you can change it later).
            </p>
          </div>

          {/* Class Name (Only for Teachers) */}
          {role === 'teacher' && (
            <div className="space-y-2">
              <Label htmlFor="className" className="text-sm font-medium">
                Class name <span className="text-muted-foreground text-xs">(optional)</span>
              </Label>
              <Input
                id="className"
                name="className"
                type="text"
                placeholder='e.g., "Year 6 Literacy Support"'
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                disabled={isSubmitting}
                className="w-full"
                maxLength={60}
                aria-describedby="className-help"
              />
              <p id="className-help" className="text-xs text-muted-foreground">
                Optional class identifier for your records.
              </p>
            </div>
          )}

          {/* Privacy Notice */}
          <div className="p-3 rounded-lg bg-green-50/50 dark:bg-green-950/20 border border-green-200/50 dark:border-green-800/50">
            <div className="flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-muted-foreground">
                <p className="font-medium text-foreground mb-1">Privacy-first</p>
                <p>
                  We save this information only on this device. Nothing is uploaded unless 
                  your organiser has set up syncing and you explicitly enable it.
                </p>
              </div>
            </div>
          </div>
          </div>

          {/* Action Buttons - Sticky Footer */}
          <div className="border-t bg-background px-6 py-4 mt-auto">
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleRequestClose}
                disabled={isSubmitting}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || !groupCode.trim() || !!emailError}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold disabled:bg-gray-300 disabled:text-gray-500"
              >
                {isSubmitting ? 'Joining...' : 'Join'}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
