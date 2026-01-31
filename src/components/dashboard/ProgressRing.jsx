import React from 'react';
import { motion } from 'framer-motion';

export default function ProgressRing({ 
  progress, 
  size = 120, 
  strokeWidth = 8, 
  goalType = 'gain',
  label,
  value,
  unit
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (Math.min(progress, 100) / 100) * circumference;
  
  const gradientId = `gradient-${label?.replace(/\s/g, '-')}`;
  
  const gradientColors = goalType === 'gain' 
    ? ['#10b981', '#14b8a6'] 
    : ['#8b5cf6', '#a855f7'];

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={gradientColors[0]} />
            <stop offset="100%" stopColor={gradientColors[1]} />
          </linearGradient>
        </defs>
        
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={strokeWidth}
        />
        
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </svg>
      
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-white">{value}</span>
        {unit && <span className="text-xs text-white/50">{unit}</span>}
        {label && <span className="text-xs text-white/50 mt-1">{label}</span>}
      </div>
    </div>
  );
}