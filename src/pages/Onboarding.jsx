import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { ArrowRight, ArrowLeft, Zap } from 'lucide-react';
import { createPageUrl } from '@/utils';
import GoalSelection from '@/components/onboarding/GoalSelection';
import SportSelection from '@/components/onboarding/SportSelection';
import BodyMetrics from '@/components/onboarding/BodyMetrics';
import GoalDeadline from '@/components/onboarding/GoalDeadline';

export default function Onboarding() {
  const [step, setStep] = useState(0);
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    goal_type: '',
    sport: '',
    current_weight: '',
    goal_weight: '',
    goal_deadline: '',
    height_inches: '',
    age: '',
    activity_level: 'active'
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      const userData = await base44.auth.me();
      setUser(userData);
    };
    loadUser();
  }, []);

  const steps = [
    { component: GoalSelection, key: 'goal' },
    { component: SportSelection, key: 'sport' },
    { component: BodyMetrics, key: 'metrics' },
    { component: GoalDeadline, key: 'deadline' }
  ];

  const canProceed = () => {
    switch (step) {
      case 0: return formData.goal_type;
      case 1: return formData.sport;
      case 2: return formData.current_weight && formData.goal_weight && formData.height_inches && formData.age && formData.activity_level;
      case 3: return formData.goal_deadline;
      default: return false;
    }
  };

  const calculateTargets = () => {
    const { current_weight, height_inches, age, activity_level, goal_type } = formData;
    
    // BMR using Mifflin-St Jeor (adjusted for teens)
    const bmr = (10 * (current_weight * 0.453592)) + (6.25 * (height_inches * 2.54)) - (5 * age) + 5;
    
    // Activity multipliers
    const activityMultipliers = {
      moderate: 1.55,
      active: 1.725,
      very_active: 1.9
    };
    
    let tdee = bmr * activityMultipliers[activity_level];
    
    // Adjust for goal
    let calorieTarget;
    if (goal_type === 'gain') {
      calorieTarget = Math.round(tdee + 400); // Surplus for gaining
    } else {
      calorieTarget = Math.round(tdee - 400); // Deficit for losing
    }
    
    // Protein: 1g per lb of goal weight for athletes
    const proteinTarget = Math.round(formData.goal_weight);
    
    return { calorieTarget, proteinTarget };
  };

  const handleComplete = async () => {
    if (!user) return;
    setSaving(true);
    
    const { calorieTarget, proteinTarget } = calculateTargets();
    
    const profileData = {
      user_id: user.email,
      sport: formData.sport,
      goal_type: formData.goal_type,
      current_weight: parseFloat(formData.current_weight),
      goal_weight: parseFloat(formData.goal_weight),
      goal_deadline: formData.goal_deadline,
      height_inches: parseFloat(formData.height_inches),
      age: parseFloat(formData.age),
      activity_level: formData.activity_level,
      daily_calorie_target: calorieTarget,
      daily_protein_target: proteinTarget,
      onboarding_complete: true
    };
    
    await base44.entities.UserProfile.create(profileData);
    
    // Also log initial weight
    await base44.entities.WeightLog.create({
      user_id: user.email,
      weight: parseFloat(formData.current_weight),
      date: new Date().toISOString().split('T')[0],
      notes: 'Starting weight'
    });
    
    window.location.href = createPageUrl('Dashboard');
  };

  const CurrentStepComponent = steps[step].component;

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className={`absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20 ${
          formData.goal_type === 'gain' ? 'bg-emerald-500' : formData.goal_type === 'lose' ? 'bg-violet-500' : 'bg-blue-500'
        }`} />
        <div className={`absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-20 ${
          formData.goal_type === 'gain' ? 'bg-teal-500' : formData.goal_type === 'lose' ? 'bg-purple-500' : 'bg-indigo-500'
        }`} />
      </div>
      
      <div className="relative z-10 max-w-md mx-auto px-6 py-12 min-h-screen flex flex-col">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 mb-4"
          >
            <div className={`p-2 rounded-xl bg-gradient-to-br ${
              formData.goal_type === 'gain' ? 'from-emerald-500 to-teal-600' : 
              formData.goal_type === 'lose' ? 'from-violet-500 to-purple-600' : 
              'from-blue-500 to-indigo-600'
            }`}>
              <Zap className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">Athletiq</span>
          </motion.div>
          
          {/* Progress dots */}
          <div className="flex items-center justify-center gap-2 mt-6">
            {steps.map((_, i) => (
              <motion.div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === step 
                    ? `w-8 ${formData.goal_type === 'gain' ? 'bg-emerald-500' : formData.goal_type === 'lose' ? 'bg-violet-500' : 'bg-blue-500'}` 
                    : i < step 
                      ? `w-4 ${formData.goal_type === 'gain' ? 'bg-emerald-500/50' : formData.goal_type === 'lose' ? 'bg-violet-500/50' : 'bg-blue-500/50'}`
                      : 'w-4 bg-white/20'
                }`}
              />
            ))}
          </div>
        </div>
        
        {/* Content */}
        <div className="flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <CurrentStepComponent
                selected={step === 0 ? formData.goal_type : step === 1 ? formData.sport : null}
                onSelect={(value) => {
                  if (step === 0) setFormData(prev => ({ ...prev, goal_type: value }));
                  if (step === 1) setFormData(prev => ({ ...prev, sport: value }));
                }}
                data={formData}
                onChange={(key, value) => setFormData(prev => ({ ...prev, [key]: value }))}
                goalType={formData.goal_type}
              />
            </motion.div>
          </AnimatePresence>
        </div>
        
        {/* Navigation */}
        <div className="flex items-center gap-3 mt-8">
          {step > 0 && (
            <Button
              variant="outline"
              onClick={() => setStep(s => s - 1)}
              className="h-14 px-6 rounded-xl border-white/20 text-white hover:bg-white/10"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
          )}
          
          <Button
            onClick={() => {
              if (step < steps.length - 1) {
                setStep(s => s + 1);
              } else {
                handleComplete();
              }
            }}
            disabled={!canProceed() || saving}
            className={`flex-1 h-14 rounded-xl bg-gradient-to-r ${
              formData.goal_type === 'gain' ? 'from-emerald-500 to-teal-600' : 
              formData.goal_type === 'lose' ? 'from-violet-500 to-purple-600' : 
              'from-blue-500 to-indigo-600'
            } text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50`}
          >
            {saving ? 'Setting up...' : step < steps.length - 1 ? (
              <>Continue <ArrowRight className="w-5 h-5 ml-2" /></>
            ) : (
              'Start My Journey'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}