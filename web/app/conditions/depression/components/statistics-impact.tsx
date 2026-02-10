'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { TrendingUp, Users, DollarSign, AlertCircle } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LineChart,
  Line,
} from 'recharts';

export function StatisticsImpact() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // UK prevalence data by age group
  const ukDataByAge = [
    { age: '16-29', rate: 26 },
    { age: '30-49', rate: 18 },
    { age: '50-64', rate: 14 },
    { age: '65+', rate: 10 },
  ];

  // US prevalence data by age group
  const usDataByAge = [
    { age: '12-19', rate: 19.2 },
    { age: '20-39', rate: 16.4 },
    { age: '40-59', rate: 13.7 },
    { age: '60+', rate: 8.7 },
  ];

  // Gender comparison
  const genderData = [
    { country: 'UK', female: 20, male: 12 },
    { country: 'US', female: 16.0, male: 10.1 },
  ];

  // Temporal trend (UK example)
  const ukTrendData = [
    { year: 'Pre-2020', rate: 10 },
    { year: '2021', rate: 21 },
    { year: '2022', rate: 16 },
    { year: '2023', rate: 16 },
  ];

  const keyStats = [
    {
      icon: Users,
      label: 'Global Prevalence',
      value: '280M+',
      description: 'People worldwide affected by depression',
      color: 'from-blue-50 to-blue-100',
      textColor: 'text-blue-900',
    },
    {
      icon: TrendingUp,
      label: 'UK Adults (2023)',
      value: '16%',
      description: 'Moderate to severe depressive symptoms',
      color: 'from-purple-50 to-purple-100',
      textColor: 'text-purple-900',
    },
    {
      icon: AlertCircle,
      label: 'US Overall (2023)',
      value: '13.1%',
      description: 'Of population aged 12+ with depression',
      color: 'from-green-50 to-green-100',
      textColor: 'text-green-900',
    },
    {
      icon: DollarSign,
      label: 'Economic Impact',
      value: '$1T',
      description: 'Annual global cost from lost productivity',
      color: 'from-orange-50 to-orange-100',
      textColor: 'text-orange-900',
    },
  ];

  return (
    <motion.section
      id="statistics"
      ref={ref}
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-8"
    >
      <div className="text-center space-y-3">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Statistics & Impact</h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Understanding the scale and demographics of depression through UK and US data
        </p>
      </div>

      {/* Key Statistics Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {keyStats?.map?.((stat, index) => {
          const Icon = stat?.icon ?? Users;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-gradient-to-br ${stat?.color} rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-all duration-300`}
            >
              <Icon className={`w-10 h-10 ${stat?.textColor} mx-auto mb-3`} />
              <p className={`text-3xl font-bold ${stat?.textColor} mb-1 count-up`}>{stat?.value}</p>
              <p className="text-sm font-semibold text-gray-700 mb-1">{stat?.label}</p>
              <p className="text-xs text-gray-600">{stat?.description}</p>
            </motion.div>
          );
        }) ?? null}
      </div>

      {/* Charts */}
      {mounted && (
        <>
          {/* Age Distribution Comparison */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Depression Prevalence by Age Group</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-3 text-center">🇬🇧 United Kingdom (2023)</p>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={ukDataByAge} margin={{ top: 10, right: 10, left: -20, bottom: 30 }}>
                    <XAxis
                      dataKey="age"
                      tickLine={false}
                      tick={{ fontSize: 10 }}
                      label={{ value: 'Age Group', position: 'insideBottom', offset: -15, style: { textAnchor: 'middle', fontSize: 11 } }}
                    />
                    <YAxis
                      tickLine={false}
                      tick={{ fontSize: 10 }}
                      label={{ value: 'Prevalence (%)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: 11 } }}
                    />
                    <Tooltip wrapperStyle={{ fontSize: 11 }} />
                    <Bar dataKey="rate" fill="#60B5FF" name="Rate (%)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-3 text-center">🇺🇸 United States (2021-2023)</p>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={usDataByAge} margin={{ top: 10, right: 10, left: -20, bottom: 30 }}>
                    <XAxis
                      dataKey="age"
                      tickLine={false}
                      tick={{ fontSize: 10 }}
                      label={{ value: 'Age Group', position: 'insideBottom', offset: -15, style: { textAnchor: 'middle', fontSize: 11 } }}
                    />
                    <YAxis
                      tickLine={false}
                      tick={{ fontSize: 10 }}
                      label={{ value: 'Prevalence (%)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: 11 } }}
                    />
                    <Tooltip wrapperStyle={{ fontSize: 11 }} />
                    <Bar dataKey="rate" fill="#FF9149" name="Rate (%)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="mt-4 bg-blue-50 rounded-lg p-4">
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Key Finding:</span> Both countries show highest prevalence in younger adults, with rates declining with age. UK youth (16-29) show particularly high rates at 26%.
              </p>
            </div>
          </div>

          {/* Gender Comparison */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Gender Disparities in Depression</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={genderData} margin={{ top: 20, right: 30, left: -10, bottom: 30 }}>
                <XAxis
                  dataKey="country"
                  tickLine={false}
                  tick={{ fontSize: 10 }}
                  label={{ value: 'Country', position: 'insideBottom', offset: -15, style: { textAnchor: 'middle', fontSize: 11 } }}
                />
                <YAxis
                  tickLine={false}
                  tick={{ fontSize: 10 }}
                  label={{ value: 'Prevalence (%)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: 11 } }}
                />
                <Tooltip wrapperStyle={{ fontSize: 11 }} />
                <Legend verticalAlign="top" wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="female" fill="#FF90BB" name="Female (%)" />
                <Bar dataKey="male" fill="#60B5FF" name="Male (%)" />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 bg-pink-50 rounded-lg p-4">
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Key Finding:</span> Women experience depression at significantly higher rates than men across both countries, with female rates approximately 1.5-1.6x higher than male rates.
              </p>
            </div>
          </div>

          {/* UK Temporal Trend */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">UK Depression Rates: COVID-19 Impact</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={ukTrendData} margin={{ top: 20, right: 30, left: -10, bottom: 30 }}>
                <XAxis
                  dataKey="year"
                  tickLine={false}
                  tick={{ fontSize: 10 }}
                  label={{ value: 'Time Period', position: 'insideBottom', offset: -15, style: { textAnchor: 'middle', fontSize: 11 } }}
                />
                <YAxis
                  tickLine={false}
                  tick={{ fontSize: 10 }}
                  domain={[0, 25]}
                  label={{ value: 'Prevalence (%)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: 11 } }}
                />
                <Tooltip wrapperStyle={{ fontSize: 11 }} />
                <Legend verticalAlign="top" wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="rate" stroke="#A19AD3" strokeWidth={3} name="Depression Rate (%)" dot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
            <div className="mt-4 bg-purple-50 rounded-lg p-4">
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Key Finding:</span> UK depression rates doubled during the pandemic (10% to 21%), and while declining, remain 60% higher than pre-pandemic levels as of 2023.
              </p>
            </div>
          </div>
        </>
      )}

      {/* Additional Context */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-3">Socioeconomic Disparities</h3>
          <div className="space-y-2 text-sm text-gray-700">
            <p>• <span className="font-semibold">US:</span> People below federal poverty level have 3x higher depression rate (22.1%) than highest income bracket (7.4%)</p>
            <p>• <span className="font-semibold">UK:</span> Financial hardship and living in deprived areas strongly associated with higher rates</p>
            <p>• <span className="font-semibold">Access gap:</span> Only 39% of US adults with depression received therapy in past year</p>
          </div>
        </div>
        <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-3">Economic Burden</h3>
          <div className="space-y-2 text-sm text-gray-700">
            <p>• <span className="font-semibold">Global cost:</span> Over $1 trillion annually from lost productivity</p>
            <p>• <span className="font-semibold">UK:</span> 1 in 4 new disability benefits (PIP) awarded for depression/anxiety</p>
            <p>• <span className="font-semibold">Comorbidity:</span> 40% of people with depression have chronic physical illness, increasing healthcare costs</p>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
