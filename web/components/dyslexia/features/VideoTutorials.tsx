'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Video, Play, BookOpen, Users, GraduationCap } from 'lucide-react';

const videos = [
  { id: 1, title: 'Understanding Dyslexia', category: 'Parents', url: 'https://www.youtube.com/watch?v=zafiGBrFkRM', duration: '10:24' },
  { id: 2, title: 'How to Use This Platform', category: 'Getting Started', url: 'https://www.youtube.com/watch?v=5MgBikgcWnY', duration: '8:15' },
  { id: 3, title: 'Teaching Strategies for Parents', category: 'Parents', url: 'https://www.youtube.com/watch?v=UnNQ4-fLTjU', duration: '12:30' },
  { id: 4, title: 'Classroom Accommodations', category: 'Teachers', url: 'https://www.youtube.com/watch?v=4LbyMSPqhZw', duration: '15:45' },
  { id: 5, title: 'Study Skills for Students', category: 'Students', url: 'https://www.youtube.com/watch?v=PVJXJ-Hkq9c', duration: '9:20' },
];

export function VideoTutorials() {
  return (
    <Card>
      <CardContent className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Video className="w-5 h-5" />
            Video Tutorials
          </h3>
        </div>

        <div className="grid gap-4">
          {videos.map((video) => (
            <div key={video.id} className="p-4 border-2 rounded-lg hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-semibold text-lg">{video.title}</h4>
                  <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
                    <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 rounded-full text-xs">
                      {video.category}
                    </span>
                    <span>{video.duration}</span>
                  </div>
                </div>
                <Button
                  size="sm"
                  onClick={() => window.open(video.url, '_blank')}
                >
                  <Play className="w-4 h-4 mr-2" />
                  Watch
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-xs text-muted-foreground">
          <p>🎬 Watch tutorials to learn more about dyslexia and how to use our tools effectively</p>
        </div>
      </CardContent>
    </Card>
  );
}
