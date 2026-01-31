import React from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar, Target, Clock } from 'lucide-react';
import { format, differenceInWeeks, addWeeks } from 'date-fns';

export default function GoalDeadline({ data, onChange, goalType }) {
  const accentGradient = goalType === 'gain' 
    ? 'from-emerald-500 to-teal-600' 
    : 'from-violet-500 to-purple-600';

  const accentColor = goalType === 'gain' ? 'emerald' : 'violet';

  const weightDiff = Math.abs((data.goal_weight || 0) - (data.current_weight || 0));
  const weeksToGoal = data.goal_deadline 
    ? differenceInWeeks(new Date(data.goal_deadline), new Date())
    : 0;
  
  // Healthy rate: 0.5-1 lb/week for losing, 0.5-1 lb/week for gaining
  const weeklyRate = weeksToGoal > 0 ? (weightDiff / weeksToGoal).toFixed(1) : 0;
  const isHealthyRate = weeklyRate <= 1.5 && weeklyRate >= 0.3;

  const suggestedDeadlines = [
    { weeks: 8, label: '8 weeks' },
    { weeks: 12, label: '12 weeks' },
    { weeks: 16, label: '16 weeks' },
    { weeks: 24, label: '6 months' },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Set Your Deadline</h2>
        <p className="text-white/60">When do you want to reach your goal?</p>
      </div>

      {/* Weight Goal Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 rounded-2xl p-4 border border-white/10"
      >
        <div className="flex items-center justify-between">
          <div className="text-center flex-1">
            <p className="text-white/50 text-xs mb-1">Current</p>
            <p className="text-xl font-bold text-white">{data.current_weight} lbs</p>
          </div>
          <div className={`px-4 py-2 rounded-full bg-gradient-to-r ${accentGradient}`}>
            <Target className="w-5 h-5 text-white" />
          </div>
          <div className="text-center flex-1">
            <p className="text-white/50 text-xs mb-1">Goal</p>
            <p className="text-xl font-bold text-white">{data.goal_weight} lbs</p>
          </div>
        </div>
        <div className="text-center mt-3">
          <p className={`text-sm font-medium bg-gradient-to-r ${accentGradient} bg-clip-text text-transparent`}>
            {goalType === 'gain' ? '+' : '-'}{weightDiff} lbs to go
          </p>
        </div>
      </motion.div>

      {/* Quick Select */}
      <div className="space-y-3">
        <Label className="text-white/80 text-sm">Quick Select</Label>
        <div className="grid grid-cols-2 gap-3">
          {suggestedDeadlines.map((option, index) => {
            const deadline = format(addWeeks(new Date(), option.weeks), 'yyyy-MM-dd');
            const isSelected = data.goal_deadline === deadline;
            
            return (
              <motion.button
                key={option.weeks}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => onChange('goal_deadline', deadline)}
                className={`p-4 rounded-xl border-2 text-center transition-all ${
                  isSelected 
                    ? `border-${accentColor}-500/50 bg-${accentColor}-500/10` 
                    : 'border-white/10 hover:border-white/20 bg-white/5'
                }`}
              >
                <Clock className={`w-5 h-5 mx-auto mb-2 ${isSelected ? `text-${accentColor}-400` : 'text-white/40'}`} />
                <p className={`font-semibold ${isSelected ? 'text-white' : 'text-white/70'}`}>{option.label}</p>
                <p className="text-white/40 text-xs mt-1">{format(addWeeks(new Date(), option.weeks), 'MMM d, yyyy')}</p>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Custom Date */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Label className="text-white/80 text-sm mb-2 block">Or pick a custom date</Label>
        <div className="relative">
          <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
          <Input
            type="date"
            value={data.goal_deadline || ''}
            onChange={(e) => onChange('goal_deadline', e.target.value)}
            min={format(addWeeks(new Date(), 2), 'yyyy-MM-dd')}
            className="pl-12 h-14 bg-white/5 border-white/10 text-white rounded-xl focus:border-white/30 focus:ring-0"
          />
        </div>
      </motion.div>

      {/* Rate Feedback */}
      {data.goal_deadline && weeksToGoal > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-xl ${
            isHealthyRate 
              ? 'bg-emerald-500/10 border border-emerald-500/30' 
              : 'bg-amber-500/10 border border-amber-500/30'
          }`}
        >
          <div className="flex items-start gap-3">
            <div className={`p-2 rounded-lg ${isHealthyRate ? 'bg-emerald-500/20' : 'bg-amber-500/20'}`}>
              <Target className={`w-4 h-4 ${isHealthyRate ? 'text-emerald-400' : 'text-amber-400'}`} />
            </div>
            <div>
              <p className={`font-medium ${isHealthyRate ? 'text-emerald-400' : 'text-amber-400'}`}>
                ~{weeklyRate} lbs per week
              </p>
              <p className="text-white/50 text-sm mt-1">
                {isHealthyRate 
                  ? 'This is a healthy, sustainable pace for athletes!' 
                  : 'Consider a longer timeline for sustainable results'}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}