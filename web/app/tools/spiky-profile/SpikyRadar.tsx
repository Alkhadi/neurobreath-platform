'use client';

import * as React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts';

export type RadarDatum = { category: string; score: number };

export default function SpikyRadar({ data }: { data: RadarDatum[] }) {
  return (
    <div className="w-full h-72 sm:h-96" aria-label="Spiky profile radar chart">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey="category" tick={{ fontSize: 11 }} />
          <PolarRadiusAxis angle={30} domain={[0, 5]} tick={{ fontSize: 10 }} />
          <Radar
            name="Reflection"
            dataKey="score"
            stroke="#0f172a"
            fill="#0f172a"
            fillOpacity={0.25}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
