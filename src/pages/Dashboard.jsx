import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { createPageUrl } from '@/utils';
import { Zap, Scale, Utensils, Dumbbell, TrendingUp, TrendingDown, Flame, Beef, Target, Calendar } from 'lucide-react';
import { differenceInDays } from 'date-fns';

import ProgressRing from '@/components/dashboard/ProgressRing';
import MacroCard from '@/components/dashboard/MacroCard';
import WeightChart from '@/components/dashboard/WeightChart';
import QuickLogCard from '@/components/dashboard/QuickLogCard';
import LogWeightModal from '@/components/modals/LogWeightModal';
import LogMealModal from '@/components/modals/LogMealModal';
import LogWorkoutModal from '@/components/modals/LogWorkoutModal';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [weightModal, setWeightModal] = useState(false);
  const [mealModal, setMealModal] = useState(false);
  const [workoutModal, setWorkoutModal] = useState(false);
  
  const queryClient = useQueryClient();
  const today = format(new Date(), 'yyyy-MM-dd');

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
      setLoading(false);
    };
    loadData();
  }, []);

  // Fetch today's meals
  const { data: todayMeals = [] } = useQuery({
    queryKey: ['meals', user?.email, today],
    queryFn: () => base44.entities.MealLog.filter({ user_id: user.email, date: today }),
    enabled: !!user
  });

  // Fetch today's workouts
  const { data: todayWorkouts = [] } = useQuery({
    queryKey: ['workouts', user?.email, today],
    queryFn: () => base44.entities.WorkoutLog.filter({ user_id: user.email, date: today }),
    enabled: !!user
  });

  // Fetch weight history
  const { data: weightLogs = [] } = useQuery({
    queryKey: ['weightLogs', user?.email],
    queryFn: () => base44.entities.WeightLog.filter({ user_id: user.email }, 'date', 30),
    enabled: !!user
  });

  // Calculate daily totals
  const dailyTotals = todayMeals.reduce((acc, meal) => ({
    calories: acc.calories + (meal.calories || 0),
    protein: acc.protein + (meal.protein || 0),
    carbs: acc.carbs + (meal.carbs || 0),
    fat: acc.fat + (meal.fat || 0)
  }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

  const workoutCalories = todayWorkouts.reduce((acc, w) => acc + (w.calories_burned || 0), 0);

  // Mutations
  const logWeightMutation = useMutation({
    mutationFn: (data) => base44.entities.WeightLog.create({ user_id: user.email, ...data }),
    onSuccess: () => queryClient.invalidateQueries(['weightLogs'])
  });

  const logMealMutation = useMutation({
    mutationFn: (data) => base44.entities.MealLog.create({ user_id: user.email, ...data }),
    onSuccess: () => queryClient.invalidateQueries(['meals'])
  });

  const logWorkoutMutation = useMutation({
    mutationFn: (data) => base44.entities.WorkoutLog.create({ user_id: user.email, ...data }),
    onSuccess: () => queryClient.invalidateQueries(['workouts'])
  });

  if (loading || !profile) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-pulse text-white/50">Loading...</div>
      </div>
    );
  }

  const goalType = profile.goal_type;
  const accentGradient = goalType === 'gain' ? 'from-emerald-500 to-teal-600' : 'from-violet-500 to-purple-600';
  const accentColor = goalType === 'gain' ? 'emerald' : 'violet';
  
  const latestWeight = weightLogs[weightLogs.length - 1]?.weight || profile.current_weight;
  const weightDiff = latestWeight - profile.current_weight;
  const weightToGoal = Math.abs(profile.goal_weight - latestWeight);
  const totalWeightJourney = Math.abs(profile.goal_weight - profile.current_weight);
  const progressPercent = totalWeightJourney > 0 
    ? Math.min(100, ((totalWeightJourney - weightToGoal) / totalWeightJourney) * 100)
    : 0;

  const calorieProgress = (dailyTotals.calories / profile.daily_calorie_target) * 100;

  return (
    <div className="min-h-screen bg-slate-950 relative">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className={`absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-10 bg-${accentColor}-500`} />
        <div className={`absolute bottom-1/4 right-0 w-96 h-96 rounded-full blur-3xl opacity-10 bg-${accentColor}-600`} />
      </div>
      
      <div className="relative z-10 max-w-md mx-auto px-4 pb-24">
        {/* Header */}
        <div className="pt-8 pb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/50 text-sm">Welcome back,</p>
              <h1 className="text-2xl font-bold text-white">{user.full_name?.split(' ')[0] || 'Athlete'}</h1>
            </div>
            <div className={`p-3 rounded-2xl bg-gradient-to-br ${accentGradient}`}>
              {goalType === 'gain' ? (
                <TrendingUp className="w-6 h-6 text-white" />
              ) : (
                <TrendingDown className="w-6 h-6 text-white" />
              )}
            </div>
          </div>
          
          <div className="mt-4 p-4 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-white/50 text-sm">Current Goal</p>
                <p className={`text-lg font-bold bg-gradient-to-r ${accentGradient} bg-clip-text text-transparent`}>
                  {goalType === 'gain' ? 'Build Mass' : 'Cut Weight'} • {profile.sport?.replace('_', ' ')}
                </p>
              </div>
              <div className="text-right">
                <p className="text-white/50 text-sm">Target</p>
                <p className="text-white font-bold">{profile.goal_weight} lbs</p>
              </div>
            </div>
            {profile.goal_deadline && (
              <div className={`flex items-center gap-2 pt-3 border-t border-white/10`}>
                <Calendar className={`w-4 h-4 text-${accentColor}-400`} />
                <span className="text-white/70 text-sm">
                  {differenceInDays(new Date(profile.goal_deadline), new Date())} days left
                </span>
                <span className="text-white/40 text-sm">
                  • {format(new Date(profile.goal_deadline), 'MMM d, yyyy')}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Main Progress Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 backdrop-blur-sm rounded-3xl p-6 border border-white/10 mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-semibold">Today's Progress</h2>
            <span className="text-white/50 text-sm">{format(new Date(), 'MMM d')}</span>
          </div>
          
          <div className="flex items-center justify-around">
            <ProgressRing
              progress={calorieProgress}
              goalType={goalType}
              value={Math.round(dailyTotals.calories)}
              unit="cal"
              label="of goal"
            />
            
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Target className={`w-5 h-5 text-${accentColor}-400`} />
                <div>
                  <p className="text-white/50 text-xs">Target</p>
                  <p className="text-white font-semibold">{profile.daily_calorie_target} cal</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Dumbbell className="w-5 h-5 text-orange-400" />
                <div>
                  <p className="text-white/50 text-xs">Burned</p>
                  <p className="text-white font-semibold">{workoutCalories} cal</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Macro Cards */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <MacroCard
            name="Protein"
            current={dailyTotals.protein}
            target={profile.daily_protein_target}
            unit="g"
            color={`text-${accentColor}-400`}
            icon={Beef}
            delay={0.1}
          />
          <MacroCard
            name="Carbs"
            current={dailyTotals.carbs}
            target={goalType === 'gain' ? 300 : 200}
            unit="g"
            color="text-amber-400"
            icon={Flame}
            delay={0.2}
          />
        </div>

        {/* Weight Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/5 backdrop-blur-sm rounded-3xl p-6 border border-white/10 mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-semibold">Weight Journey</h2>
            <div className="flex items-center gap-2">
              <span className={`text-sm font-medium ${
                (goalType === 'gain' && weightDiff > 0) || (goalType === 'lose' && weightDiff < 0)
                  ? `text-${accentColor}-400`
                  : 'text-white/50'
              }`}>
                {weightDiff > 0 ? '+' : ''}{weightDiff.toFixed(1)} lbs
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1">
              <p className="text-white/50 text-xs mb-1">Current</p>
              <p className="text-2xl font-bold text-white">{latestWeight} lbs</p>
            </div>
            <div className={`h-12 w-px bg-gradient-to-b ${accentGradient}`} />
            <div className="flex-1 text-right">
              <p className="text-white/50 text-xs mb-1">Goal</p>
              <p className="text-2xl font-bold text-white">{profile.goal_weight} lbs</p>
            </div>
          </div>
          
          <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-4">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.8 }}
              className={`h-full rounded-full bg-gradient-to-r ${accentGradient}`}
            />
          </div>
          
          <WeightChart 
            data={weightLogs} 
            goalType={goalType} 
            goalWeight={profile.goal_weight}
          />
        </motion.div>

        {/* Quick Actions */}
        <div className="space-y-3">
          <h2 className="text-white font-semibold mb-3">Quick Log</h2>
          <QuickLogCard
            icon={Scale}
            title="Log Weight"
            subtitle="Track your progress"
            onClick={() => setWeightModal(true)}
            gradient={accentGradient}
            delay={0.3}
          />
          <QuickLogCard
            icon={Utensils}
            title="Log Meal"
            subtitle={`${todayMeals.length} meals today`}
            onClick={() => setMealModal(true)}
            gradient="from-orange-500 to-amber-600"
            delay={0.4}
          />
          <QuickLogCard
            icon={Dumbbell}
            title="Log Workout"
            subtitle={`${todayWorkouts.length} workouts today`}
            onClick={() => setWorkoutModal(true)}
            gradient="from-blue-500 to-cyan-600"
            delay={0.5}
          />
        </div>

        {/* Modals */}
        <LogWeightModal
          open={weightModal}
          onClose={() => setWeightModal(false)}
          onSave={(data) => logWeightMutation.mutateAsync(data)}
          goalType={goalType}
        />
        <LogMealModal
          open={mealModal}
          onClose={() => setMealModal(false)}
          onSave={(data) => logMealMutation.mutateAsync(data)}
          goalType={goalType}
        />
        <LogWorkoutModal
          open={workoutModal}
          onClose={() => setWorkoutModal(false)}
          onSave={(data) => logWorkoutMutation.mutateAsync(data)}
          goalType={goalType}
        />
      </div>
    </div>
  );
}