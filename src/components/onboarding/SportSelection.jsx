import React from 'react';
import { motion } from 'framer-motion';

const sports = [
  { id: 'basketball', emoji: '🏀', name: 'Basketball' },
  { id: 'football', emoji: '🏈', name: 'Football' },
  { id: 'soccer', emoji: '⚽', name: 'Soccer' },
  { id: 'swimming', emoji: '🏊', name: 'Swimming' },
  { id: 'track', emoji: '🏃', name: 'Track & Field' },
  { id: 'tennis', emoji: '🎾', name: 'Tennis' },
  { id: 'baseball', emoji: '⚾', name: 'Baseball' },
  { id: 'volleyball', emoji: '🏐', name: 'Volleyball' },
  { id: 'wrestling', emoji: '🤼', name: 'Wrestling' },
  { id: 'gymnastics', emoji: '🤸', name: 'Gymnastics' },
  { id: 'hockey', emoji: '🏒', name: 'Hockey' },
  { id: 'lacrosse', emoji: '🥍', name: 'Lacrosse' },
  { id: 'other', emoji: '🏅', name: 'Other' },
];

export default function SportSelection({ onSelect, selected, goalType }) {
  const accentGradient = goalType === 'gain' 
    ? 'from-emerald-500 to-teal-600' 
    : 'from-violet-500 to-purple-600';
  
  const accentBorder = goalType === 'gain' 
    ? 'border-emerald-500/50' 
    : 'border-violet-500/50';

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Your Sport</h2>
        <p className="text-white/60">Select your primary athletic focus</p>
      </div>
      
      <div className="grid grid-cols-3 gap-3">
        {sports.map((sport, index) => {
          const isSelected = selected === sport.id;
          
          return (
            <motion.button
              key={sport.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.03 }}
              onClick={() => onSelect(sport.id)}
              className={`p-4 rounded-xl border-2 text-center transition-all duration-200 ${
                isSelected 
                  ? `${accentBorder} bg-white/10` 
                  : 'border-white/10 hover:border-white/20 bg-white/5'
              }`}
            >
              <span className="text-2xl block mb-2">{sport.emoji}</span>
              <span className={`text-xs font-medium ${isSelected ? 'text-white' : 'text-white/70'}`}>
                {sport.name}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}