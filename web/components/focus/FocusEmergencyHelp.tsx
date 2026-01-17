import { Card } from '@/components/ui/card';
import { crisisResources } from '@/lib/data/crisis-resources';
import type { Region } from '@/lib/region/region';

interface FocusEmergencyHelpProps {
  region: Region;
}

export function FocusEmergencyHelp({ region }: FocusEmergencyHelpProps) {
  const resources = crisisResources.filter((r) => r.country === region);
  const emergencyResource = resources.find((r) =>
    r.name.toLowerCase().includes('emergency')
  );
  const mentalHealthResource = resources.find(
    (r) =>
      r.name.includes('NHS 111') ||
      r.name.includes('988')
  );
  const supportResource = resources.find(
    (r) =>
      r.name.includes('Samaritans') ||
      r.name.includes('Crisis Text Line')
  );

  return (
    <Card className="p-6 bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800">
      <h3 className="text-xl font-bold mb-3 text-red-900 dark:text-red-100">
        Emergency &amp; urgent help ({region})
      </h3>
      <p className="text-sm text-red-800 dark:text-red-200">
        If you are at immediate risk of harming yourself or someone else, call{' '}
        <strong>{emergencyResource?.phone || (region === 'UK' ? '999' : '911')}</strong>
        {region === 'UK' && ' or go to A&E'}.{' '}
        For urgent mental health support call{' '}
        <strong>{mentalHealthResource?.phone || (region === 'UK' ? 'NHS 111' : '988')}</strong>
        {region === 'UK' && ' (select the mental health option)'}.{' '}
        You can talk 24/7 to{' '}
        <strong>
          {supportResource?.phone || (region === 'UK' ? 'Samaritans on 116 123' : 'Crisis Text Line (text HOME to 741741)')}
        </strong>{' '}
        (free). This site is educational and is <em>not</em> medical advice.
      </p>
    </Card>
  );
}
