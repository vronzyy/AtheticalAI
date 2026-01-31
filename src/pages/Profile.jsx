import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  User, Scale, Ruler, Target, Activity, LogOut, Save, TrendingUp, TrendingDown,
  Calendar, Flame, Award, Clock, Sun, Moon
} from 'lucide-react';
import { differenceInDays } from 'date-fns';
import { createPageUrl } from '@/utils';
import { format } from 'date-fns';
import { useTheme } from '@/components/ThemeContext';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [saving, setSaving] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

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
      setEditData(profiles[0]);
    };
    loadData();
  }, []);

  const { data: weightLogs = [] } = useQuery({
    queryKey: ['allWeightLogs', user?.email],
    queryFn: () => base44.entities.WeightLog.filter({ user_id: user.email }, '-date', 100),
    enabled: !!user
  });

  const { data: allMeals = [] } = useQuery({
    queryKey: ['allMeals', user?.email],
    queryFn: () => base44.entities.MealLog.filter({ user_id: user.email }, '-date', 1000),
    enabled: !!user
  });

  const { data: allWorkouts = [] } = useQuery({
    queryKey: ['allWorkouts', user?.email],
    queryFn: () => base44.entities.WorkoutLog.filter({ user_id: user.email }, '-date', 1000),
    enabled: !!user
  });

  const handleSave = async () => {
    setSaving(true);
    
    // Recalculate targets
    const { current_weight, height_inches, age, activity_level, goal_type } = editData;
    const bmr = (10 * (current_weight * 0.453592)) + (6.25 * (height_inches * 2.54)) - (5 * age) + 5;
    const activityMultipliers = { moderate: 1.55, active: 1.725, very_active: 1.9 };
    let tdee = bmr * activityMultipliers[activity_level];
    
    const calorieTarget = goal_type === 'gain' ? Math.round(tdee + 400) : Math.round(tdee - 400);
    const proteinTarget = Math.round(editData.goal_weight);

    await base44.entities.UserProfile.update(profile.id, {
      ...editData,
      daily_calorie_target: calorieTarget,
      daily_protein_target: proteinTarget
    });

    setProfile({ ...editData, daily_calorie_target: calorieTarget, daily_protein_target: proteinTarget });
    setEditing(false);
    setSaving(false);
  };

  const handleLogout = () => {
    base44.auth.logout();
  };

  if (!profile) {
    return <div className={`min-h-screen ${isDark ? 'bg-slate-950' : 'bg-gray-50'} flex items-center justify-center`}>
      <div className={`animate-pulse ${isDark ? 'text-white/50' : 'text-gray-400'}`}>Loading...</div>
    </div>;
  }

  const goalType = profile.goal_type;
  const accentGradient = goalType === 'gain' ? 'from-emerald-500 to-teal-600' : 'from-violet-500 to-purple-600';
  const accentColor = goalType === 'gain' ? 'emerald' : 'violet';

  const bgMain = isDark ? 'bg-slate-950' : 'bg-gray-50';
  const bgCard = isDark ? 'bg-white/5' : 'bg-white';
  const borderColor = isDark ? 'border-white/10' : 'border-gray-200';
  const textPrimary = isDark ? 'text-white' : 'text-gray-900';
  const textSecondary = isDark ? 'text-white/50' : 'text-gray-500';
  const textMuted = isDark ? 'text-white/40' : 'text-gray-400';
  const textLabel = isDark ? 'text-white/70' : 'text-gray-600';

  const latestWeight = weightLogs[0]?.weight || profile.current_weight;
  const weightChange = latestWeight - profile.current_weight;
  const totalCaloriesLogged = allMeals.reduce((acc, m) => acc + (m.calories || 0), 0);
  const totalWorkouts = allWorkouts.length;
  const totalWorkoutMinutes = allWorkouts.reduce((acc, w) => acc + (w.duration_minutes || 0), 0);

  const sports = [
    { id: 'basketball', name: 'Basketball' },
    { id: 'football', name: 'Football' },
    { id: 'soccer', name: 'Soccer' },
    { id: 'swimming', name: 'Swimming' },
    { id: 'track', name: 'Track & Field' },
    { id: 'tennis', name: 'Tennis' },
    { id: 'baseball', name: 'Baseball' },
    { id: 'volleyball', name: 'Volleyball' },
    { id: 'wrestling', name: 'Wrestling' },
    { id: 'gymnastics', name: 'Gymnastics' },
    { id: 'hockey', name: 'Hockey' },
    { id: 'lacrosse', name: 'Lacrosse' },
    { id: 'other', name: 'Other' },
  ];

  return (
    <div className={`min-h-screen ${bgMain} relative pb-24`}>
      <div className="absolute inset-0 overflow-hidden">
        <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full blur-3xl opacity-10 ${goalType === 'gain' ? 'bg-emerald-500' : 'bg-violet-500'}`} />
      </div>

      <div className="relative z-10 max-w-md mx-auto px-4">
        {/* Header */}
        <div className="pt-8 pb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${accentGradient} mx-auto mb-4 flex items-center justify-center`}>
              <User className="w-12 h-12 text-white" />
            </div>
            <h1 className={`text-2xl font-bold ${textPrimary}`}>{user?.full_name || 'Athlete'}</h1>
            <p className={textSecondary}>{user?.email}</p>
            <div className={`inline-flex items-center gap-2 mt-3 px-4 py-2 rounded-full bg-gradient-to-r ${accentGradient}`}>
              {goalType === 'gain' ? (
                <TrendingUp className="w-4 h-4 text-white" />
              ) : (
                <TrendingDown className="w-4 h-4 text-white" />
              )}
              <span className="text-white text-sm font-medium">
                {goalType === 'gain' ? 'Building Mass' : 'Cutting Weight'}
              </span>
            </div>
          </motion.div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`${bgCard} backdrop-blur-sm rounded-2xl p-4 border ${borderColor} text-center`}
          >
            <Scale className={`w-5 h-5 mx-auto mb-2 ${goalType === 'gain' ? 'text-emerald-500' : 'text-violet-500'}`} />
            <p className={`text-xl font-bold ${textPrimary}`}>
              {weightChange > 0 ? '+' : ''}{weightChange.toFixed(1)}
            </p>
            <p className={`${textMuted} text-xs`}>lbs change</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`${bgCard} backdrop-blur-sm rounded-2xl p-4 border ${borderColor} text-center`}
          >
            <Flame className="w-5 h-5 text-orange-400 mx-auto mb-2" />
            <p className={`text-xl font-bold ${textPrimary}`}>{(totalCaloriesLogged / 1000).toFixed(0)}k</p>
            <p className={`${textMuted} text-xs`}>cal logged</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={`${bgCard} backdrop-blur-sm rounded-2xl p-4 border ${borderColor} text-center`}
          >
            <Award className="w-5 h-5 text-amber-400 mx-auto mb-2" />
            <p className={`text-xl font-bold ${textPrimary}`}>{totalWorkouts}</p>
            <p className={`${textMuted} text-xs`}>workouts</p>
          </motion.div>
        </div>

        {/* Appearance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className={`${bgCard} backdrop-blur-sm rounded-3xl p-6 border ${borderColor} mb-6`}
        >
          <h2 className={`${textPrimary} font-semibold mb-4`}>Appearance</h2>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {isDark ? <Moon className={`w-5 h-5 ${goalType === 'gain' ? 'text-emerald-500' : 'text-violet-500'}`} /> : <Sun className={`w-5 h-5 ${goalType === 'gain' ? 'text-emerald-500' : 'text-violet-500'}`} />}
              <span className={textLabel}>Theme</span>
            </div>
            <button
              onClick={toggleTheme}
              className={`px-4 py-2 rounded-xl font-medium transition-all ${
                isDark 
                  ? 'bg-white/10 text-white hover:bg-white/20' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {isDark ? '🌙 Dark' : '☀️ Light'}
            </button>
          </div>
        </motion.div>

        {/* Profile Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className={`${bgCard} backdrop-blur-sm rounded-3xl p-6 border ${borderColor} mb-6`}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className={`${textPrimary} font-semibold`}>Settings</h2>
            {!editing ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setEditing(true)}
                className={`${isDark ? 'text-white/50 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}
              >
                Edit
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={handleSave}
                disabled={saving}
                className={`bg-gradient-to-r ${accentGradient} text-white`}
              >
                <Save className="w-4 h-4 mr-1" />
                {saving ? 'Saving...' : 'Save'}
              </Button>
            )}
          </div>

          <div className="space-y-4">
            <div className={`flex items-center justify-between py-3 border-b ${borderColor}`}>
              <div className="flex items-center gap-3">
                <Target className={`w-5 h-5 ${goalType === 'gain' ? 'text-emerald-500' : 'text-violet-500'}`} />
                <span className={textLabel}>Goal</span>
              </div>
              {editing ? (
                <Select value={editData.goal_type} onValueChange={(v) => setEditData({...editData, goal_type: v})}>
                  <SelectTrigger className={`w-32 h-9 ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className={isDark ? 'bg-slate-900 border-white/10' : 'bg-white border-gray-200'}>
                    <SelectItem value="gain" className={textPrimary}>Gain Weight</SelectItem>
                    <SelectItem value="lose" className={textPrimary}>Lose Weight</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <span className={`${textPrimary} font-medium capitalize`}>{profile.goal_type} weight</span>
              )}
            </div>

            <div className={`flex items-center justify-between py-3 border-b ${borderColor}`}>
              <div className="flex items-center gap-3">
                <Activity className={`w-5 h-5 ${goalType === 'gain' ? 'text-emerald-500' : 'text-violet-500'}`} />
                <span className={textLabel}>Sport</span>
              </div>
              {editing ? (
                <Select value={editData.sport} onValueChange={(v) => setEditData({...editData, sport: v})}>
                  <SelectTrigger className={`w-32 h-9 ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className={`${isDark ? 'bg-slate-900 border-white/10' : 'bg-white border-gray-200'} max-h-48`}>
                    {sports.map(s => (
                      <SelectItem key={s.id} value={s.id} className={textPrimary}>{s.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <span className={`${textPrimary} font-medium capitalize`}>{profile.sport?.replace('_', ' ')}</span>
              )}
            </div>

            <div className={`flex items-center justify-between py-3 border-b ${borderColor}`}>
              <div className="flex items-center gap-3">
                <Scale className={`w-5 h-5 ${goalType === 'gain' ? 'text-emerald-500' : 'text-violet-500'}`} />
                <span className={textLabel}>Goal Weight</span>
              </div>
              {editing ? (
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={editData.goal_weight}
                    onChange={(e) => setEditData({...editData, goal_weight: parseFloat(e.target.value)})}
                    className={`w-20 h-9 text-center ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
                  />
                  <span className={textMuted}>lbs</span>
                </div>
              ) : (
                <span className={`${textPrimary} font-medium`}>{profile.goal_weight} lbs</span>
              )}
            </div>

            <div className={`flex items-center justify-between py-3 border-b ${borderColor}`}>
              <div className="flex items-center gap-3">
                <Clock className={`w-5 h-5 ${goalType === 'gain' ? 'text-emerald-500' : 'text-violet-500'}`} />
                <span className={textLabel}>Goal Deadline</span>
              </div>
              {editing ? (
                <Input
                  type="date"
                  value={editData.goal_deadline || ''}
                  onChange={(e) => setEditData({...editData, goal_deadline: e.target.value})}
                  className={`w-36 h-9 ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
                />
              ) : (
                <div className="text-right">
                  {profile.goal_deadline ? (
                    <>
                      <span className={`${textPrimary} font-medium`}>{format(new Date(profile.goal_deadline), 'MMM d, yyyy')}</span>
                      <span className={`${goalType === 'gain' ? 'text-emerald-500' : 'text-violet-500'} text-sm ml-2`}>
                        ({differenceInDays(new Date(profile.goal_deadline), new Date())} days)
                      </span>
                    </>
                  ) : (
                    <span className={textMuted}>Not set</span>
                  )}
                </div>
              )}
            </div>

            <div className={`flex items-center justify-between py-3 border-b ${borderColor}`}>
              <div className="flex items-center gap-3">
                <Flame className={`w-5 h-5 ${goalType === 'gain' ? 'text-emerald-500' : 'text-violet-500'}`} />
                <span className={textLabel}>Daily Calories</span>
              </div>
              <span className={`${textPrimary} font-medium`}>{profile.daily_calorie_target} cal</span>
            </div>

            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <Calendar className={`w-5 h-5 ${goalType === 'gain' ? 'text-emerald-500' : 'text-violet-500'}`} />
                <span className={textLabel}>Member Since</span>
              </div>
              <span className={`${textPrimary} font-medium`}>
                {format(new Date(profile.created_date), 'MMM yyyy')}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Logout Button */}
        <Button
          variant="outline"
          onClick={handleLogout}
          className={`w-full h-14 rounded-2xl ${isDark ? 'border-white/10 text-white/70 hover:text-white hover:bg-white/10' : 'border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}
        >
          <LogOut className="w-5 h-5 mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}