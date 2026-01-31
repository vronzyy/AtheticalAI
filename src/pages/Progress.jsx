import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { format, subDays, differenceInDays, startOfWeek, endOfWeek, eachDayOfInterval, parseISO } from 'date-fns';
import { createPageUrl } from '@/utils';
import { 
  TrendingUp, TrendingDown, Scale, Flame, Beef, Dumbbell, Calendar, 
  Target, Award, Zap, ChevronLeft, ChevronRight, Camera, Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, LineChart, Line } from 'recharts';
import LogWeightModal from '@/components/modals/LogWeightModal';

export default function Progress() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [weightModal, setWeightModal] = useState(false);
  const [timeRange, setTimeRange] = useState('30'); // days

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

  const { data: weightLogs = [], refetch: refetchWeight } = useQuery({
    queryKey: ['weightLogs', user?.email, timeRange],
    queryFn: () => base44.entities.WeightLog.filter({ user_id: user.email }, 'date', 100),
    enabled: !!user
  });

  const { data: allMeals = [] } = useQuery({
    queryKey: ['allMealsProgress', user?.email],
    queryFn: () => base44.entities.MealLog.filter({ user_id: user.email }, '-date', 500),
    enabled: !!user
  });

  const { data: allWorkouts = [] } = useQuery({
    queryKey: ['allWorkoutsProgress', user?.email],
    queryFn: () => base44.entities.WorkoutLog.filter({ user_id: user.email }, '-date', 500),
    enabled: !!user
  });

  const handleWeightSave = async (data) => {
    await base44.entities.WeightLog.create({ user_id: user.email, ...data });
    refetchWeight();
  };

  if (!profile) {
    return <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="animate-pulse text-white/50">Loading...</div>
    </div>;
  }

  const goalType = profile.goal_type;
  const accentGradient = goalType === 'gain' ? 'from-emerald-500 to-teal-600' : 'from-violet-500 to-purple-600';
  const accentColor = goalType === 'gain' ? 'emerald' : 'violet';
  const lineColor = goalType === 'gain' ? '#10b981' : '#8b5cf6';

  // Process weight data
  const weightData = weightLogs
    .filter(w => differenceInDays(new Date(), new Date(w.date)) <= parseInt(timeRange))
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .map(w => ({
      date: format(new Date(w.date), 'MMM d'),
      weight: w.weight,
      goal: profile.goal_weight
    }));

  const latestWeight = weightLogs[weightLogs.length - 1]?.weight || profile.current_weight;
  const startWeight = profile.current_weight;
  const weightChange = latestWeight - startWeight;
  const weightToGoal = Math.abs(profile.goal_weight - latestWeight);
  const progressPercent = Math.abs(profile.goal_weight - profile.current_weight) > 0
    ? ((Math.abs(weightChange) / Math.abs(profile.goal_weight - profile.current_weight)) * 100)
    : 0;

  // Weekly averages
  const last7DaysMeals = allMeals.filter(m => differenceInDays(new Date(), new Date(m.date)) <= 7);
  const avgCalories = last7DaysMeals.length > 0 
    ? Math.round(last7DaysMeals.reduce((acc, m) => acc + (m.calories || 0), 0) / 7)
    : 0;
  const avgProtein = last7DaysMeals.length > 0
    ? Math.round(last7DaysMeals.reduce((acc, m) => acc + (m.protein || 0), 0) / 7)
    : 0;

  // Weekly workout data
  const weeklyWorkoutData = [];
  for (let i = 6; i >= 0; i--) {
    const day = subDays(new Date(), i);
    const dayStr = format(day, 'yyyy-MM-dd');
    const dayWorkouts = allWorkouts.filter(w => w.date === dayStr);
    weeklyWorkoutData.push({
      day: format(day, 'EEE'),
      minutes: dayWorkouts.reduce((acc, w) => acc + (w.duration_minutes || 0), 0),
      calories: dayWorkouts.reduce((acc, w) => acc + (w.calories_burned || 0), 0)
    });
  }

  // Stats
  const totalWorkouts = allWorkouts.length;
  const totalWorkoutMinutes = allWorkouts.reduce((acc, w) => acc + (w.duration_minutes || 0), 0);
  const totalCaloriesBurned = allWorkouts.reduce((acc, w) => acc + (w.calories_burned || 0), 0);
  const totalMealsLogged = allMeals.length;
  const streakDays = calculateStreak(allMeals, allWorkouts);

  function calculateStreak(meals, workouts) {
    let streak = 0;
    for (let i = 0; i < 365; i++) {
      const day = format(subDays(new Date(), i), 'yyyy-MM-dd');
      const hasMeal = meals.some(m => m.date === day);
      const hasWorkout = workouts.some(w => w.date === day);
      if (hasMeal || hasWorkout) {
        streak++;
      } else if (i > 0) {
        break;
      }
    }
    return streak;
  }

  // Calorie trend data
  const calorieTrendData = [];
  for (let i = 13; i >= 0; i--) {
    const day = subDays(new Date(), i);
    const dayStr = format(day, 'yyyy-MM-dd');
    const dayMeals = allMeals.filter(m => m.date === dayStr);
    calorieTrendData.push({
      date: format(day, 'M/d'),
      calories: dayMeals.reduce((acc, m) => acc + (m.calories || 0), 0),
      target: profile.daily_calorie_target
    });
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-800/95 backdrop-blur-sm px-4 py-3 rounded-xl border border-white/10 shadow-xl">
          <p className="text-white/60 text-sm mb-1">{label}</p>
          {payload.map((entry, idx) => (
            <p key={idx} className="text-white font-semibold">
              {entry.name}: {entry.value} {entry.name === 'weight' ? 'lbs' : entry.name === 'calories' || entry.name === 'target' ? 'cal' : 'min'}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-slate-950 relative pb-24">
      <div className="absolute inset-0 overflow-hidden">
        <div className={`absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-10 bg-${accentColor}-500`} />
      </div>

      <div className="relative z-10 max-w-md mx-auto px-4">
        {/* Header */}
        <div className="pt-8 pb-6">
          <h1 className="text-2xl font-bold text-white mb-2">Progress</h1>
          <p className="text-white/50">Track your journey to {profile.goal_weight} lbs</p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`bg-gradient-to-br ${accentGradient} rounded-2xl p-4`}
          >
            <div className="flex items-center gap-2 mb-2">
              <Scale className="w-5 h-5 text-white/80" />
              <span className="text-white/80 text-sm">Weight Change</span>
            </div>
            <p className="text-3xl font-bold text-white">
              {weightChange > 0 ? '+' : ''}{weightChange.toFixed(1)}
            </p>
            <p className="text-white/60 text-sm">lbs {goalType === 'gain' ? 'gained' : 'lost'}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10"
          >
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-5 h-5 text-amber-400" />
              <span className="text-white/80 text-sm">Current Streak</span>
            </div>
            <p className="text-3xl font-bold text-white">{streakDays}</p>
            <p className="text-white/60 text-sm">days active</p>
          </motion.div>
        </div>

        {/* Weight Progress Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/5 backdrop-blur-sm rounded-3xl p-6 border border-white/10 mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-semibold">Weight Progress</h2>
            <div className="flex gap-2">
              {['7', '30', '90'].map(days => (
                <button
                  key={days}
                  onClick={() => setTimeRange(days)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                    timeRange === days 
                      ? `bg-${accentColor}-500/20 text-${accentColor}-400` 
                      : 'text-white/40 hover:text-white/60'
                  }`}
                >
                  {days}d
                </button>
              ))}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-white/50">Start: {startWeight} lbs</span>
              <span className={`text-${accentColor}-400 font-medium`}>{Math.min(100, progressPercent).toFixed(0)}%</span>
              <span className="text-white/50">Goal: {profile.goal_weight} lbs</span>
            </div>
            <div className="h-3 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, progressPercent)}%` }}
                transition={{ duration: 1 }}
                className={`h-full rounded-full bg-gradient-to-r ${accentGradient}`}
              />
            </div>
            <p className="text-center text-white/40 text-sm mt-2">
              {weightToGoal.toFixed(1)} lbs to go
            </p>
          </div>

          {/* Weight Chart */}
          {weightData.length > 1 ? (
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weightData}>
                  <defs>
                    <linearGradient id="weightGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={lineColor} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={lineColor} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} />
                  <YAxis domain={['dataMin - 3', 'dataMax + 3']} axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="weight" stroke={lineColor} strokeWidth={2} fill="url(#weightGradient)" />
                  <Line type="monotone" dataKey="goal" stroke="rgba(255,255,255,0.2)" strokeDasharray="5 5" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-48 flex items-center justify-center text-white/40">
              <p>Log more weigh-ins to see your chart</p>
            </div>
          )}

          <Button
            onClick={() => setWeightModal(true)}
            className={`w-full mt-4 h-12 rounded-xl bg-gradient-to-r ${accentGradient}`}
          >
            <Scale className="w-4 h-4 mr-2" />
            Log Today's Weight
          </Button>
        </motion.div>

        {/* Nutrition Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/5 backdrop-blur-sm rounded-3xl p-6 border border-white/10 mb-6"
        >
          <h2 className="text-white font-semibold mb-4">Calorie Trend (14 days)</h2>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center p-3 bg-white/5 rounded-xl">
              <Flame className="w-5 h-5 text-orange-400 mx-auto mb-1" />
              <p className="text-xl font-bold text-white">{avgCalories}</p>
              <p className="text-white/40 text-xs">avg daily cal</p>
            </div>
            <div className="text-center p-3 bg-white/5 rounded-xl">
              <Beef className={`w-5 h-5 text-${accentColor}-400 mx-auto mb-1`} />
              <p className="text-xl font-bold text-white">{avgProtein}g</p>
              <p className="text-white/40 text-xs">avg daily protein</p>
            </div>
          </div>

          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={calorieTrendData}>
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="calories" fill={lineColor} radius={[4, 4, 0, 0]} />
                <Line type="monotone" dataKey="target" stroke="rgba(255,255,255,0.3)" strokeDasharray="3 3" dot={false} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Weekly Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/5 backdrop-blur-sm rounded-3xl p-6 border border-white/10 mb-6"
        >
          <h2 className="text-white font-semibold mb-4">This Week's Activity</h2>
          
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyWorkoutData}>
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="minutes" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* All-Time Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white/5 backdrop-blur-sm rounded-3xl p-6 border border-white/10"
        >
          <h2 className="text-white font-semibold mb-4">All-Time Stats</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-white/5 rounded-xl">
              <Dumbbell className="w-6 h-6 text-red-400 mb-2" />
              <p className="text-2xl font-bold text-white">{totalWorkouts}</p>
              <p className="text-white/40 text-sm">workouts completed</p>
            </div>
            <div className="p-4 bg-white/5 rounded-xl">
              <Target className="w-6 h-6 text-blue-400 mb-2" />
              <p className="text-2xl font-bold text-white">{Math.round(totalWorkoutMinutes / 60)}h</p>
              <p className="text-white/40 text-sm">total training time</p>
            </div>
            <div className="p-4 bg-white/5 rounded-xl">
              <Flame className="w-6 h-6 text-orange-400 mb-2" />
              <p className="text-2xl font-bold text-white">{(totalCaloriesBurned / 1000).toFixed(1)}k</p>
              <p className="text-white/40 text-sm">calories burned</p>
            </div>
            <div className="p-4 bg-white/5 rounded-xl">
              <Award className="w-6 h-6 text-amber-400 mb-2" />
              <p className="text-2xl font-bold text-white">{totalMealsLogged}</p>
              <p className="text-white/40 text-sm">meals logged</p>
            </div>
          </div>

          {profile.goal_deadline && (
            <div className={`mt-4 p-4 rounded-xl bg-gradient-to-r ${accentGradient} bg-opacity-10 border border-${accentColor}-500/30`}>
              <div className="flex items-center gap-3">
                <Calendar className={`w-5 h-5 text-${accentColor}-400`} />
                <div>
                  <p className="text-white font-medium">Goal Deadline</p>
                  <p className="text-white/60 text-sm">
                    {format(new Date(profile.goal_deadline), 'MMMM d, yyyy')} • {differenceInDays(new Date(profile.goal_deadline), new Date())} days left
                  </p>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      <LogWeightModal
        open={weightModal}
        onClose={() => setWeightModal(false)}
        onSave={handleWeightSave}
        goalType={goalType}
      />
    </div>
  );
}