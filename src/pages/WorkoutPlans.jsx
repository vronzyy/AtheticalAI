import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { 
  Dumbbell, ChevronRight, Clock, Flame, Play, Check, ArrowLeft, 
  Calendar, Star, Zap, Target
} from 'lucide-react';
import { WORKOUT_PLANS, SUGGESTED_WORKOUTS, WORKOUT_TYPE_LABELS } from '@/components/data/WorkoutDatabase';

export default function WorkoutPlans() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [view, setView] = useState('plans'); // 'plans', 'plan-detail', 'workouts', 'workout-detail'
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('strength');
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    const loadData = async () => {
      const userData = await base44.auth.me();
      setUser(userData);
      const profiles = await base44.entities.UserProfile.filter({ user_id: userData.email });
      if (profiles.length === 0) {
        window.location.href = createPageUrl('Onboarding');
        return;
      }
      setProfile(profiles[0]);
    };
    loadData();
  }, []);

  const logWorkoutMutation = useMutation({
    mutationFn: (data) => base44.entities.WorkoutLog.create({ 
      user_id: user.email, 
      date: format(new Date(), 'yyyy-MM-dd'),
      ...data 
    }),
    onSuccess: () => {
      queryClient.invalidateQueries(['workouts']);
      setView('plans');
      setSelectedWorkout(null);
    }
  });

  if (!profile) {
    return <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="animate-pulse text-white/50">Loading...</div>
    </div>;
  }

  const goalType = profile.goal_type;
  const accentGradient = goalType === 'gain' ? 'from-emerald-500 to-teal-600' : 'from-violet-500 to-purple-600';
  const accentColor = goalType === 'gain' ? 'emerald' : 'violet';

  const plans = WORKOUT_PLANS[goalType] || [];
  const workouts = SUGGESTED_WORKOUTS[selectedCategory] || [];

  const handleStartWorkout = (workout) => {
    logWorkoutMutation.mutate({
      workout_type: selectedCategory,
      duration_minutes: workout.duration,
      calories_burned: workout.calories,
      notes: workout.name,
      completed: true
    });
  };

  const renderPlans = () => (
    <div className="space-y-6">
      <div className="pt-8 pb-4">
        <h1 className="text-2xl font-bold text-white mb-2">Workout Plans</h1>
        <p className="text-white/50">Programs designed for {goalType === 'gain' ? 'building mass' : 'cutting weight'}</p>
      </div>

      <div className="space-y-4">
        {plans.map((plan, idx) => (
          <motion.button
            key={plan.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            onClick={() => { setSelectedPlan(plan); setView('plan-detail'); }}
            className="w-full bg-white/5 backdrop-blur-sm rounded-2xl p-5 border border-white/10 text-left hover:bg-white/10 transition-all"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    plan.level === 'beginner' ? 'bg-green-500/20 text-green-400' :
                    plan.level === 'intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {plan.level}
                  </span>
                </div>
                <p className="text-white/50 text-sm mb-3">{plan.description}</p>
                <div className="flex items-center gap-4 text-sm">
                  <span className="flex items-center gap-1 text-white/60">
                    <Calendar className="w-4 h-4" />
                    {plan.frequency}
                  </span>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-white/30" />
            </div>
          </motion.button>
        ))}
      </div>

      {/* Quick Workouts Section */}
      <div className="pt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white">Quick Workouts</h2>
          <Button
            variant="ghost"
            onClick={() => setView('workouts')}
            className="text-white/50 hover:text-white"
          >
            View All <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>

        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
          {Object.entries(WORKOUT_TYPE_LABELS).filter(([k]) => k !== 'rest').map(([key, val]) => (
            <button
              key={key}
              onClick={() => { setSelectedCategory(key); setView('workouts'); }}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all bg-white/5 text-white/60 hover:bg-white/10`}
            >
              {val.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3">
          {SUGGESTED_WORKOUTS.strength.slice(0, 2).map((workout, idx) => (
            <motion.button
              key={workout.name}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => { setSelectedWorkout(workout); setSelectedCategory('strength'); setView('workout-detail'); }}
              className="bg-white/5 rounded-xl p-4 text-left hover:bg-white/10 transition-all border border-white/10"
            >
              <div className={`p-2 rounded-lg bg-gradient-to-br ${WORKOUT_TYPE_LABELS.strength.color} w-fit mb-2`}>
                <Dumbbell className="w-4 h-4 text-white" />
              </div>
              <h4 className="text-white font-medium text-sm mb-1 line-clamp-1">{workout.name}</h4>
              <div className="flex items-center gap-2 text-xs text-white/40">
                <span>{workout.duration} min</span>
                <span>•</span>
                <span>{workout.calories} cal</span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPlanDetail = () => (
    <div className="space-y-6">
      <div className="pt-8 pb-4">
        <button onClick={() => setView('plans')} className="flex items-center gap-2 text-white/50 hover:text-white mb-4">
          <ArrowLeft className="w-5 h-5" />
          Back to Plans
        </button>
        
        <h1 className="text-2xl font-bold text-white mb-2">{selectedPlan.name}</h1>
        <p className="text-white/50">{selectedPlan.description}</p>
        
        <div className="flex items-center gap-4 mt-4">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            selectedPlan.level === 'beginner' ? 'bg-green-500/20 text-green-400' :
            selectedPlan.level === 'intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
            'bg-red-500/20 text-red-400'
          }`}>
            {selectedPlan.level}
          </span>
          <span className="flex items-center gap-1 text-white/60">
            <Calendar className="w-4 h-4" />
            {selectedPlan.frequency}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        {selectedPlan.days.map((day, idx) => {
          const typeInfo = WORKOUT_TYPE_LABELS[day.type] || WORKOUT_TYPE_LABELS.rest;
          return (
            <motion.div
              key={day.day}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={`p-4 rounded-xl border ${
                day.type === 'rest' 
                  ? 'bg-white/5 border-white/10' 
                  : 'bg-white/5 border-white/10 hover:bg-white/10'
              } transition-all`}
            >
              <div className="flex items-center gap-4">
                <div className={`p-2.5 rounded-xl bg-gradient-to-br ${typeInfo.color}`}>
                  <Dumbbell className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-white/50 text-sm">{day.day}</p>
                  <p className="text-white font-medium">{day.focus}</p>
                </div>
                <span className="text-white/40 text-sm">{typeInfo.label.split(' ')[0]}</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );

  const renderWorkouts = () => (
    <div className="space-y-6">
      <div className="pt-8 pb-4">
        <button onClick={() => setView('plans')} className="flex items-center gap-2 text-white/50 hover:text-white mb-4">
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>
        <h1 className="text-2xl font-bold text-white mb-4">Quick Workouts</h1>
        
        <div className="flex gap-2 overflow-x-auto pb-2">
          {Object.entries(WORKOUT_TYPE_LABELS).filter(([k]) => k !== 'rest').map(([key, val]) => (
            <button
              key={key}
              onClick={() => setSelectedCategory(key)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                selectedCategory === key
                  ? `bg-gradient-to-r ${accentGradient} text-white`
                  : 'bg-white/5 text-white/60 hover:bg-white/10'
              }`}
            >
              {val.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {(SUGGESTED_WORKOUTS[selectedCategory] || []).map((workout, idx) => (
          <motion.button
            key={workout.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            onClick={() => { setSelectedWorkout(workout); setView('workout-detail'); }}
            className="w-full bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10 text-left hover:bg-white/10 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl bg-gradient-to-br ${WORKOUT_TYPE_LABELS[selectedCategory].color}`}>
                <Dumbbell className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-white font-semibold">{workout.name}</h3>
                <div className="flex items-center gap-3 mt-1 text-sm text-white/40">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {workout.duration} min
                  </span>
                  <span className="flex items-center gap-1">
                    <Flame className="w-3 h-3" />
                    {workout.calories} cal
                  </span>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-white/30" />
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );

  const renderWorkoutDetail = () => (
    <div className="space-y-6">
      <div className="pt-8 pb-4">
        <button onClick={() => setView('workouts')} className="flex items-center gap-2 text-white/50 hover:text-white mb-4">
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>
        
        <div className={`p-4 rounded-2xl bg-gradient-to-br ${WORKOUT_TYPE_LABELS[selectedCategory].color} mb-4`}>
          <h1 className="text-2xl font-bold text-white mb-2">{selectedWorkout.name}</h1>
          <div className="flex items-center gap-4 text-white/80">
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {selectedWorkout.duration} min
            </span>
            <span className="flex items-center gap-1">
              <Flame className="w-4 h-4" />
              {selectedWorkout.calories} cal
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-white font-semibold">Exercises</h2>
        {selectedWorkout.exercises.map((exercise, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="bg-white/5 rounded-xl p-4 border border-white/10"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">{exercise.name}</p>
                <p className="text-white/50 text-sm">{exercise.sets}</p>
              </div>
              {exercise.rest !== '-' && (
                <span className="text-white/40 text-sm">Rest: {exercise.rest}</span>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <Button
        onClick={() => handleStartWorkout(selectedWorkout)}
        disabled={logWorkoutMutation.isPending}
        className={`w-full h-14 rounded-xl bg-gradient-to-r ${accentGradient} text-white font-semibold`}
      >
        {logWorkoutMutation.isPending ? 'Logging...' : (
          <>
            <Check className="w-5 h-5 mr-2" />
            Log This Workout
          </>
        )}
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 relative pb-24">
      <div className="absolute inset-0 overflow-hidden">
        <div className={`absolute top-0 left-0 w-96 h-96 rounded-full blur-3xl opacity-10 bg-${accentColor}-500`} />
      </div>

      <div className="relative z-10 max-w-md mx-auto px-4">
        <AnimatePresence mode="wait">
          {view === 'plans' && renderPlans()}
          {view === 'plan-detail' && selectedPlan && renderPlanDetail()}
          {view === 'workouts' && renderWorkouts()}
          {view === 'workout-detail' && selectedWorkout && renderWorkoutDetail()}
        </AnimatePresence>
      </div>
    </div>
  );
}