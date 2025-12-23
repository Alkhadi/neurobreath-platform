'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function GetStartedPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="w-full">
        <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
          <CardTitle className="text-3xl font-bold">🚀 Get Started</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <p className="text-muted-foreground">
            This page is under development. Content will be added soon.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
