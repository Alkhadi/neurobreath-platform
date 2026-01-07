'use client';

import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';

export const ClearDataButton = () => {
  const [cleared, setCleared] = useState(false);

  const handleClearData = () => {
    if (confirm('Are you sure you want to clear all progress data? This cannot be undone.')) {
      // Clear all low-mood related localStorage data
      localStorage.removeItem('low-mood-entries');
      localStorage.removeItem('low-mood-completed-skills');
      localStorage.removeItem('low-mood-used-tools');
      localStorage.removeItem('low-mood-daily-challenges');
      localStorage.removeItem('low-mood-challenge-history');
      localStorage.removeItem('low-mood-todays-challenges');
      
      setCleared(true);
      
      // Reload page to reset all components
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleClearData}
      className="text-red-600 hover:text-red-700 border-red-300 hover:border-red-400"
    >
      <Trash2 className="h-4 w-4 mr-2" />
      {cleared ? 'Data Cleared - Reloading...' : 'Clear All Progress Data'}
    </Button>
  );
};

