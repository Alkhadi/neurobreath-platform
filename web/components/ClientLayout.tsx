'use client';

import { useState } from 'react';
import ReadingBuddy from '@/components/ReadingBuddy';
import InteractiveTutorial from '@/components/InteractiveTutorial';

export default function ClientLayout() {
  const [tutorialOpen, setTutorialOpen] = useState(false);

  return (
    <>
      <ReadingBuddy onStartTutorial={() => setTutorialOpen(true)} />
      <InteractiveTutorial open={tutorialOpen} onOpenChange={setTutorialOpen} />
    </>
  );
}
