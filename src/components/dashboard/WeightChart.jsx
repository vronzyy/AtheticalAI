import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

export default function WeightChart({ data, goalType, goalWeight }) {
  const chartData = data.map(entry => ({
    date: format(new Date(entry.date), 'MMM d'),
    weight: entry.weight,
    goal: goalWeight
  }));

  const gradientId = 'weightGradient';
  const lineColor = goalType === 'gain' ? '#10b981' : '#8b5cf6';
  const gradientColors = goalType === 'gain' 
    ? ['rgba(16, 185, 129, 0.3)', 'rgba(16, 185, 129, 0)']
    : ['rgba(139, 92, 246, 0.3)', 'rgba(139, 92, 246, 0)'];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-800/90 backdrop-blur-sm px-3 py-2 rounded-lg border border-white/10">
          <p className="text-white font-semibold">{payload[0].value} lbs</p>
          <p className="text-white/50 text-xs">{payload[0].payload.date}</p>
        </div>
      );
    }
    return null;
  };

  if (chartData.length === 0) {
    return (
      <div className="h-48 flex items-center justify-center text-white/40">
        <p>Log your first weigh-in to see progress</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="h-48 w-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={gradientColors[0]} />
              <stop offset="95%" stopColor={gradientColors[1]} />
            </linearGradient>
          </defs>
          <XAxis 
            dataKey="date" 
            axisLine={false}
            tickLine={false}
            tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }}
          />
          <YAxis 
            domain={['dataMin - 5', 'dataMax + 5']}
            axisLine={false}
            tickLine={false}
            tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="weight"
            stroke={lineColor}
            strokeWidth={2}
            fill={`url(#${gradientId})`}
          />
          {goalWeight && (
            <Line
              type="monotone"
              dataKey="goal"
              stroke="rgba(255,255,255,0.3)"
              strokeDasharray="5 5"
              strokeWidth={1}
              dot={false}
            />
          )}
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
}