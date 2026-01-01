'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface WeeklyChartProps {
  data: {
    date: string;
    day: string;
    minutes: number;
  }[];
}

const WeeklyChart = ({ data }: WeeklyChartProps) => {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data}>
        <XAxis
          dataKey="day"
          tick={{ fontSize: 12 }}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 12 }}
          tickLine={false}
          label={{ value: 'Minutes', angle: -90, position: 'insideLeft', style: { fontSize: 11 } }}
        />
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload?.length > 0) {
              return (
                <div className="bg-white dark:bg-gray-800 p-2 rounded shadow-lg border">
                  <p className="text-sm font-semibold">{payload?.[0]?.payload?.day}</p>
                  <p className="text-sm text-muted-foreground">
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
          fill="#60B5FF"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default WeeklyChart;

