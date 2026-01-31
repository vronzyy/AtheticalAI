import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function GoalSelection({ onSelect, selected }) {
  const goals = [
    {
      id: 'gain',
      title: 'Build Mass',
      subtitle: 'Gain Weight & Muscle',
      description: 'Designed for athletes looking to add size, strength, and power',
      icon: TrendingUp,
      gradient: 'from-emerald-500 to-teal-600',
      bgGlow: 'bg-emerald-500/20',
      borderColor: 'border-emerald-500/50'
    },
    {
      id: 'lose',
      title: 'Cut Weight',
      subtitle: 'Lose Weight & Lean Out',
      description: 'Perfect for athletes needing to drop weight while maintaining performance',
      icon: TrendingDown,
      gradient: 'from-violet-500 to-purple-600',
      bgGlow: 'bg-violet-500/20',
      borderColor: 'border-violet-500/50'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">What's Your Goal?</h2>
        <p className="text-white/60">Select your primary objective</p>
      </div>
      
      <div className="grid gap-4">
        {goals.map((goal, index) => {
          const Icon = goal.icon;
          const isSelected = selected === goal.id;
          
          return (
            <motion.button
              key={goal.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => onSelect(goal.id)}
              className={`relative p-6 rounded-2xl border-2 text-left transition-all duration-300 overflow-hidden group ${
                isSelected 
                  ? `${goal.borderColor} ${goal.bgGlow}` 
                  : 'border-white/10 hover:border-white/20 bg-white/5'
              }`}
            >
              {isSelected && (
                <div className={`absolute inset-0 bg-gradient-to-br ${goal.gradient} opacity-10`} />
              )}
              
              <div className="relative flex items-start gap-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${goal.gradient} shadow-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white mb-1">{goal.title}</h3>
                  <p className={`text-sm font-medium mb-2 bg-gradient-to-r ${goal.gradient} bg-clip-text text-transparent`}>
                    {goal.subtitle}
                  </p>
                  <p className="text-white/50 text-sm">{goal.description}</p>
                </div>
                
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                  isSelected ? goal.borderColor : 'border-white/30'
                }`}>
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className={`w-2.5 h-2.5 rounded-full bg-gradient-to-br ${goal.gradient}`}
                    />
                  )}
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}