import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format, subDays, addDays, isToday, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Plus, Dumbbell, Clock, Flame, ChevronLeft, ChevronRight, Trash2, CheckCircle, Circle } from 'lucide-react';
import LogWorkoutModal from '@/components/modals/LogWorkoutModal';
import { createPageUrl } from '@/utils';

export default function Workouts() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [workoutModal, setWorkoutModal] = useState(false);
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

  const dateStr = format(selectedDate, 'yyyy-MM-dd');
  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 0 });
  const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 0 });
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const { data: workouts = [] } = useQuery({
    queryKey: ['workouts', user?.email, dateStr],
    queryFn: () => base44.entities.WorkoutLog.filter({ user_id: user.email, date: dateStr }),
    enabled: !!user
  });

  const { data: weekWorkouts = [] } = useQuery({
    queryKey: ['weekWorkouts', user?.email, format(weekStart, 'yyyy-MM-dd')],
    queryFn: async () => {
      const all = await base44.entities.WorkoutLog.filter({ user_id: user.email }, '-date', 100);
      return all.filter(w => {
        const d = new Date(w.date);
        return d >= weekStart && d <= weekEnd;
      });
    },
    enabled: !!user
  });

  const workoutDates = new Set(weekWorkouts.map(w => w.date));

  const logWorkoutMutation = useMutation({
    mutationFn: (data) => base44.entities.WorkoutLog.create({ user_id: user.email, date: dateStr, ...data }),
    onSuccess: () => {
      queryClient.invalidateQueries(['workouts']);
      queryClient.invalidateQueries(['weekWorkouts']);
    }
  });

  const deleteWorkoutMutation = useMutation({
    mutationFn: (id) => base44.entities.WorkoutLog.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['workouts']);
      queryClient.invalidateQueries(['weekWorkouts']);
    }
  });

  const totalMinutes = workouts.reduce((acc, w) => acc + (w.duration_minutes || 0), 0);
  const totalCalories = workouts.reduce((acc, w) => acc + (w.calories_burned || 0), 0);

  if (!profile) {
    return <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="animate-pulse text-white/50">Loading...</div>
    </div>;
  }

  const goalType = profile.goal_type;
  const accentGradient = goalType === 'gain' ? 'from-emerald-500 to-teal-600' : 'from-violet-500 to-purple-600';
  const accentColor = goalType === 'gain' ? 'emerald' : 'violet';

  const workoutTypeLabels = {
    strength: { label: '💪 Strength', color: 'from-red-500 to-orange-500' },
    cardio: { label: '🏃 Cardio', color: 'from-blue-500 to-cyan-500' },
    sport_practice: { label: '🏆 Sport Practice', color: 'from-purple-500 to-pink-500' },
    flexibility: { label: '🧘 Flexibility', color: 'from-green-500 to-teal-500' },
    hiit: { label: '⚡ HIIT', color: 'from-yellow-500 to-orange-500' }
  };

  return (
    <div className="min-h-screen bg-slate-950 relative pb-24">
      <div className="absolute inset-0 overflow-hidden">
        <div className={`absolute top-0 left-0 w-96 h-96 rounded-full blur-3xl opacity-10 bg-${accentColor}-500`} />
      </div>

      <div className="relative z-10 max-w-md mx-auto px-4">
        {/* Header */}
        <div className="pt-8 pb-6">
          <h1 className="text-2xl font-bold text-white mb-6">Workouts</h1>

          {/* Week View */}
          <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedDate(d => subDays(d, 7))}
                className="text-white/60 hover:text-white hover:bg-white/10"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <span className="text-white font-medium">
                {format(weekStart, 'MMM d')} - {format(weekEnd, 'MMM d')}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedDate(d => addDays(d, 7))}
                className="text-white/60 hover:text-white hover:bg-white/10"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>

            <div className="grid grid-cols-7 gap-2">
              {weekDays.map((day) => {
                const dayStr = format(day, 'yyyy-MM-dd');
                const hasWorkout = workoutDates.has(dayStr);
                const isSelected = format(selectedDate, 'yyyy-MM-dd') === dayStr;
                const isTodayDate = isToday(day);

                return (
                  <button
                    key={dayStr}
                    onClick={() => setSelectedDate(day)}
                    className={`flex flex-col items-center py-2 rounded-xl transition-all ${
                      isSelected 
                        ? `bg-gradient-to-br ${accentGradient}`
                        : 'hover:bg-white/10'
                    }`}
                  >
                    <span className={`text-xs ${isSelected ? 'text-white' : 'text-white/40'}`}>
                      {format(day, 'EEE')}
                    </span>
                    <span className={`text-lg font-bold ${isSelected ? 'text-white' : isTodayDate ? `text-${accentColor}-400` : 'text-white'}`}>
                      {format(day, 'd')}
                    </span>
                    {hasWorkout && (
                      <div className={`w-1.5 h-1.5 rounded-full mt-1 ${isSelected ? 'bg-white' : `bg-${accentColor}-400`}`} />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Daily Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 gap-3 mb-6"
        >
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
            <Clock className="w-5 h-5 text-blue-400 mb-2" />
            <p className="text-2xl font-bold text-white">{totalMinutes}</p>
            <p className="text-white/40 text-sm">minutes</p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
            <Flame className="w-5 h-5 text-orange-400 mb-2" />
            <p className="text-2xl font-bold text-white">{totalCalories}</p>
            <p className="text-white/40 text-sm">calories burned</p>
          </div>
        </motion.div>

        {/* Workouts List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-white font-semibold">
              {isToday(selectedDate) ? "Today's Workouts" : format(selectedDate, 'EEEE, MMM d')}
            </h2>
            <span className="text-white/40 text-sm">{workouts.length} sessions</span>
          </div>

          <AnimatePresence>
            {workouts.map((workout, idx) => {
              const typeInfo = workoutTypeLabels[workout.workout_type] || workoutTypeLabels.strength;
              return (
                <motion.div
                  key={workout.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className={`p-2.5 rounded-xl bg-gradient-to-br ${typeInfo.color}`}>
                        <Dumbbell className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-white font-semibold">{typeInfo.label}</p>
                        <div className="flex items-center gap-3 mt-1 text-sm text-white/40">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {workout.duration_minutes} min
                          </span>
                          {workout.calories_burned > 0 && (
                            <span className="flex items-center gap-1">
                              <Flame className="w-3 h-3" />
                              {workout.calories_burned} cal
                            </span>
                          )}
                        </div>
                        {workout.notes && (
                          <p className="text-white/50 text-sm mt-2">{workout.notes}</p>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteWorkoutMutation.mutate(workout.id)}
                      className="text-white/30 hover:text-red-400 hover:bg-red-500/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {workouts.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <Dumbbell className="w-12 h-12 text-white/20 mx-auto mb-4" />
              <p className="text-white/40">No workouts logged</p>
              <p className="text-white/30 text-sm">Tap + to add your session</p>
            </motion.div>
          )}
        </div>

        {/* Add Workout FAB */}
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: 'spring' }}
          onClick={() => setWorkoutModal(true)}
          className={`fixed bottom-24 right-6 w-14 h-14 rounded-full bg-gradient-to-br ${accentGradient} shadow-lg flex items-center justify-center`}
        >
          <Plus className="w-6 h-6 text-white" />
        </motion.button>

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