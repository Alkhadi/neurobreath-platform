'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface WeeklyChartProps {
  data: {
    date: string;
    day: string;
    minutes: number;
  }[];
}

const CHART_FILL = 'var(--nb-chart-1, #1E40AF)';

const WeeklyChart = ({ data }: WeeklyChartProps) => {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data}>
        <XAxis
          dataKey="day"
          tick={{ fontSize: 12, fill: 'var(--nb-chart-text, #334155)' }}
          tickLine={false}
          axisLine={{ stroke: 'var(--nb-chart-grid, #E2E8F0)' }}
        />
        <YAxis
          tick={{ fontSize: 12, fill: 'var(--nb-chart-text, #334155)' }}
          tickLine={false}
          axisLine={{ stroke: 'var(--nb-chart-grid, #E2E8F0)' }}
          label={{ value: 'Minutes', angle: -90, position: 'insideLeft', style: { fontSize: 11, fill: 'var(--nb-chart-muted-text, #64748B)' } }}
        />
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload?.length > 0) {
              return (
                <div className="nb-chart-tooltip">
                  <p className="tooltip-title">{payload?.[0]?.payload?.day}</p>
                  <p className="tooltip-body">
                    {payload?.[0]?.value} minutes
                  </p>
                </div>
              );
            }
            return null;
          }}
        />
        <Bar
          dataKey="minutes"
          fill={CHART_FILL}
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default WeeklyChart;
