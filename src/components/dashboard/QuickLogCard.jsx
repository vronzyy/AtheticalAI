import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

export default function QuickLogCard({ icon: Icon, title, subtitle, onClick, gradient, delay = 0 }) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      onClick={onClick}
      className="w-full p-4 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-200 group text-left"
    >
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-xl bg-gradient-to-br ${gradient}`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-white font-semibold">{title}</h3>
          <p className="text-white/50 text-sm">{subtitle}</p>
        </div>
        <ChevronRight className="w-5 h-5 text-white/30 group-hover:text-white/60 transition-colors" />
      </div>
    </motion.button>
  );
}