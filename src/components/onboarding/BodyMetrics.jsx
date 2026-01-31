import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Scale, Ruler, Calendar, Zap } from 'lucide-react';

export default function BodyMetrics({ data, onChange, goalType }) {
  const accentGradient = goalType === 'gain' 
    ? 'from-emerald-500 to-teal-600' 
    : 'from-violet-500 to-purple-600';

  const metrics = [
    { key: 'age', label: 'Age', icon: Calendar, placeholder: '16', suffix: 'years' },
    { key: 'current_weight', label: 'Current Weight', icon: Scale, placeholder: '150', suffix: 'lbs' },
    { key: 'goal_weight', label: 'Goal Weight', icon: Scale, placeholder: goalType === 'gain' ? '165' : '145', suffix: 'lbs' },
    { key: 'height_inches', label: 'Height', icon: Ruler, placeholder: '70', suffix: 'inches' },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Your Stats</h2>
        <p className="text-white/60">We'll use this to calculate your personalized plan</p>
      </div>
      
      <div className="space-y-4">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          
          return (
            <motion.div
              key={metric.key}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              <Label className="text-white/80 text-sm mb-2 block">{metric.label}</Label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                  <Icon className="w-5 h-5 text-white/40" />
                </div>
                <Input
                  type="number"
                  value={data[metric.key] || ''}
                  onChange={(e) => onChange(metric.key, parseFloat(e.target.value) || '')}
                  placeholder={metric.placeholder}
                  className="pl-12 pr-16 h-14 bg-white/5 border-white/10 text-white placeholder:text-white/30 rounded-xl focus:border-white/30 focus:ring-0"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 text-sm">
                  {metric.suffix}
                </span>
              </div>
            </motion.div>
          );
        })}
        
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Label className="text-white/80 text-sm mb-2 block">Activity Level</Label>
          <Select value={data.activity_level} onValueChange={(v) => onChange('activity_level', v)}>
            <SelectTrigger className="h-14 bg-white/5 border-white/10 text-white rounded-xl">
              <div className="flex items-center gap-3">
                <Zap className="w-5 h-5 text-white/40" />
                <SelectValue placeholder="Select your training intensity" />
              </div>
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-white/10">
              <SelectItem value="moderate" className="text-white hover:bg-white/10">
                Moderate (3-4 days/week)
              </SelectItem>
              <SelectItem value="active" className="text-white hover:bg-white/10">
                Active (5-6 days/week)
              </SelectItem>
              <SelectItem value="very_active" className="text-white hover:bg-white/10">
                Very Active (Daily training)
              </SelectItem>
            </SelectContent>
          </Select>
        </motion.div>
      </div>
    </div>
  );
}