import React from 'react';
import { motion } from 'framer-motion';

export default function MacroCard({ name, current, target, unit, color, icon: Icon, delay = 0 }) {
  const percentage = target > 0 ? Math.min((current / target) * 100, 100) : 0;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {Icon && <Icon className={`w-4 h-4 ${color}`} />}
          <span className="text-white/70 text-sm font-medium">{name}</span>
        </div>
        <span className="text-white/50 text-xs">{Math.round(percentage)}%</span>
      </div>
      
      <div className="flex items-baseline gap-1 mb-3">
        <span className="text-2xl font-bold text-white">{Math.round(current)}</span>
        <span className="text-white/40 text-sm">/ {target}{unit}</span>
      </div>
      
      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, delay: delay + 0.2 }}
          className={`h-full rounded-full ${color.replace('text-', 'bg-')}`}
        />
      </div>
    </motion.div>
  );
}