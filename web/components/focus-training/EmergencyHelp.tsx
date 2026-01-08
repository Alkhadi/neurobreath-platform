"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Phone, ExternalLink, AlertCircle } from 'lucide-react';

export function EmergencyHelp() {
  const resources = [
    {
      name: 'Samaritans',
      phone: '116 123',
      description: 'Free 24/7 support for anyone struggling to cope',
      available: '24 hours, 7 days a week'
    },
    {
      name: 'NHS 111',
      phone: '111',
      description: 'Urgent medical advice when it\'s not a 999 emergency',
      available: '24 hours, 7 days a week'
    },
    {
      name: 'Shout Crisis Text',
      phone: 'Text 85258',
      description: 'Free, confidential text support for anyone in crisis',
      available: '24 hours, 7 days a week'
    },
    {
      name: 'Mind Infoline',
      phone: '0300 123 3393',
      description: 'Information and support for mental health concerns',
      available: 'Mon–Fri, 9am–6pm'
    }
  ];

  return (
    <Card className="border-2 border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30">
      <CardHeader>
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/50 flex-shrink-0">
            <AlertCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="flex-1 min-w-0">
            <CardTitle className="text-xl sm:text-2xl">Need Urgent Support?</CardTitle>
            <CardDescription className="text-sm sm:text-base">
              If you're in crisis or need immediate help, these UK services are here for you
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert className="bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800">
          <AlertDescription className="text-sm">
            <strong>Emergency:</strong> If you or someone else is in immediate danger, call <strong>999</strong> or go to your nearest A&E.
          </AlertDescription>
        </Alert>

        <div className="grid gap-3">
          {resources.map((resource, index) => (
            <div 
              key={index} 
              className="p-4 rounded-lg bg-white dark:bg-gray-900 border-2 hover:border-blue-300 dark:hover:border-blue-700 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4">
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-base sm:text-lg flex items-center gap-2 flex-wrap">
                    {resource.name}
                    {resource.phone.includes('Text') && (
                      <span className="text-xs px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300">
                        SMS
                      </span>
                    )}
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1">{resource.description}</p>
                  <p className="text-xs text-muted-foreground mt-1">{resource.available}</p>
                </div>
                <a 
                  href={resource.phone.includes('Text') ? undefined : `tel:${resource.phone.replace(/\s/g, '')}`}
                  className="flex items-center gap-2 font-mono font-bold text-blue-600 dark:text-blue-400 hover:underline flex-shrink-0 text-base sm:text-lg"
                >
                  <Phone className="w-4 h-4" />
                  {resource.phone}
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t">
          <p className="text-xs text-muted-foreground text-center">
            This page provides educational information only and is not a substitute for professional medical advice, diagnosis, or treatment. Always seek guidance from qualified healthcare professionals.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
