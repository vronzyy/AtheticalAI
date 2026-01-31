import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format, subDays, addDays, isToday } from 'date-fns';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Plus, Flame, Beef, Wheat, Droplet, Trash2, Camera, Sparkles, Search } from 'lucide-react';
import LogMealModal from '@/components/modals/LogMealModal';
import ScanFoodModal from '@/components/modals/ScanFoodModal';
import { createPageUrl } from '@/utils';
import { useTheme } from '@/components/ThemeContext';

export default function Meals() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [mealModal, setMealModal] = useState(false);
  const [scanModal, setScanModal] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState('lunch');
  const queryClient = useQueryClient();
  const { theme } = useTheme();
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
    };
    loadData();
  }, []);

  const dateStr = format(selectedDate, 'yyyy-MM-dd');

  const { data: meals = [] } = useQuery({
    queryKey: ['meals', user?.email, dateStr],
    queryFn: () => base44.entities.MealLog.filter({ user_id: user.email, date: dateStr }),
    enabled: !!user
  });

  const logMealMutation = useMutation({
    mutationFn: (data) => base44.entities.MealLog.create({ user_id: user.email, date: dateStr, ...data }),
    onSuccess: () => queryClient.invalidateQueries(['meals'])
  });

  const deleteMealMutation = useMutation({
    mutationFn: (id) => base44.entities.MealLog.delete(id),
    onSuccess: () => queryClient.invalidateQueries(['meals'])
  });

  const mealsByType = {
    breakfast: meals.filter(m => m.meal_type === 'breakfast'),
    lunch: meals.filter(m => m.meal_type === 'lunch'),
    dinner: meals.filter(m => m.meal_type === 'dinner'),
    snack: meals.filter(m => m.meal_type === 'snack')
  };

  const totals = meals.reduce((acc, m) => ({
    calories: acc.calories + (m.calories || 0),
    protein: acc.protein + (m.protein || 0),
    carbs: acc.carbs + (m.carbs || 0),
    fat: acc.fat + (m.fat || 0)
  }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

  if (!profile) {
    return <div className={`min-h-screen ${isDark ? 'bg-slate-950' : 'bg-gray-50'} flex items-center justify-center`}>
      <div className={`animate-pulse ${isDark ? 'text-white/50' : 'text-gray-400'}`}>Loading...</div>
    </div>;
  }

  const goalType = profile.goal_type;
  const accentGradient = goalType === 'gain' ? 'from-emerald-500 to-teal-600' : 'from-violet-500 to-purple-600';
  const accentColor = goalType === 'gain' ? 'emerald' : 'violet';

  const mealTypes = [
    { type: 'breakfast', label: 'Breakfast', emoji: '🌅' },
    { type: 'lunch', label: 'Lunch', emoji: '☀️' },
    { type: 'dinner', label: 'Dinner', emoji: '🌙' },
    { type: 'snack', label: 'Snacks', emoji: '🍎' }
  ];

  const bgMain = isDark ? 'bg-slate-950' : 'bg-gray-50';
  const bgCard = isDark ? 'bg-white/5' : 'bg-white';
  const borderColor = isDark ? 'border-white/10' : 'border-gray-200';
  const textPrimary = isDark ? 'text-white' : 'text-gray-900';
  const textSecondary = isDark ? 'text-white/50' : 'text-gray-500';
  const textMuted = isDark ? 'text-white/40' : 'text-gray-400';

  return (
    <div className={`min-h-screen ${bgMain} relative pb-24`}>
      <div className="absolute inset-0 overflow-hidden">
        <div className={`absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-10 ${goalType === 'gain' ? 'bg-emerald-500' : 'bg-violet-500'}`} />
      </div>

      <div className="relative z-10 max-w-md mx-auto px-4">
        {/* Header */}
        <div className="pt-8 pb-4">
          <h1 className={`text-2xl font-bold ${textPrimary} mb-4`}>Nutrition</h1>
          
          {/* AI Scan Hero Card */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => setScanModal(true)}
            className={`w-full rounded-3xl p-6 bg-gradient-to-br ${accentGradient} mb-4 text-left relative overflow-hidden`}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-white" />
                <span className="text-white/80 text-sm font-medium">AI-Powered</span>
              </div>
              <h2 className="text-xl font-bold text-white mb-1">Scan Your Food</h2>
              <p className="text-white/70 text-sm mb-4">Take a photo and instantly get calories & macros</p>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                  <Camera className="w-5 h-5 text-white" />
                  <span className="text-white font-semibold">Snap a Photo</span>
                </div>
              </div>
            </div>
          </motion.button>
          
          {/* Date Selector */}
          <div className={`flex items-center justify-between ${bgCard} rounded-2xl p-3 border ${borderColor}`}>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSelectedDate(d => subDays(d, 1))}
              className={`${isDark ? 'text-white/60 hover:text-white hover:bg-white/10' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'}`}
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <div className="text-center">
              <p className={`${textPrimary} font-semibold`}>
                {isToday(selectedDate) ? 'Today' : format(selectedDate, 'EEEE')}
              </p>
              <p className={`${textSecondary} text-sm`}>{format(selectedDate, 'MMM d, yyyy')}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSelectedDate(d => addDays(d, 1))}
              disabled={isToday(selectedDate)}
              className={`${isDark ? 'text-white/60 hover:text-white hover:bg-white/10' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'} disabled:opacity-30`}
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Daily Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`${bgCard} backdrop-blur-sm rounded-3xl p-6 border ${borderColor} mb-6`}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className={`${textPrimary} font-semibold`}>Daily Summary</h2>
            <span className={`text-sm font-medium ${goalType === 'gain' ? 'text-emerald-500' : 'text-violet-500'}`}>
              {Math.round((totals.calories / profile.daily_calorie_target) * 100)}%
            </span>
          </div>
          
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center">
              <Flame className="w-5 h-5 text-orange-400 mx-auto mb-1" />
              <p className={`${textPrimary} font-bold`}>{Math.round(totals.calories)}</p>
              <p className={`${textMuted} text-xs`}>/{profile.daily_calorie_target}</p>
            </div>
            <div className="text-center">
              <Beef className={`w-5 h-5 mx-auto mb-1 ${goalType === 'gain' ? 'text-emerald-500' : 'text-violet-500'}`} />
              <p className={`${textPrimary} font-bold`}>{Math.round(totals.protein)}g</p>
              <p className={`${textMuted} text-xs`}>/{profile.daily_protein_target}g</p>
            </div>
            <div className="text-center">
              <Wheat className="w-5 h-5 text-amber-400 mx-auto mb-1" />
              <p className={`${textPrimary} font-bold`}>{Math.round(totals.carbs)}g</p>
              <p className={`${textMuted} text-xs`}>carbs</p>
            </div>
            <div className="text-center">
              <Droplet className="w-5 h-5 text-yellow-400 mx-auto mb-1" />
              <p className={`${textPrimary} font-bold`}>{Math.round(totals.fat)}g</p>
              <p className={`${textMuted} text-xs`}>fat</p>
            </div>
          </div>
        </motion.div>

        {/* Meals by Type */}
        <div className="space-y-4">
          {mealTypes.map((mealType, idx) => (
            <motion.div
              key={mealType.type}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`${bgCard} backdrop-blur-sm rounded-2xl border ${borderColor} overflow-hidden`}
            >
              <div className={`p-4 flex items-center justify-between border-b ${borderColor}`}>
                <div className="flex items-center gap-3">
                  <span className="text-xl">{mealType.emoji}</span>
                  <div>
                    <h3 className={`${textPrimary} font-semibold`}>{mealType.label}</h3>
                    <p className={`${textMuted} text-sm`}>
                      {mealsByType[mealType.type].reduce((acc, m) => acc + (m.calories || 0), 0)} cal
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => { setSelectedMealType(mealType.type); setScanModal(true); }}
                    className={`${isDark ? 'text-white/40 hover:text-white hover:bg-white/10' : 'text-gray-400 hover:text-gray-900 hover:bg-gray-100'}`}
                  >
                    <Camera className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => { setSelectedMealType(mealType.type); setMealModal(true); }}
                    className={`${isDark ? 'text-white/40 hover:text-white hover:bg-white/10' : 'text-gray-400 hover:text-gray-900 hover:bg-gray-100'}`}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <AnimatePresence>
                {mealsByType[mealType.type].map((meal) => (
                  <motion.div
                    key={meal.id}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className={`p-4 border-b ${isDark ? 'border-white/5' : 'border-gray-100'} last:border-0`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className={`${textPrimary} font-medium`}>{meal.food_name}</p>
                        <div className={`flex items-center gap-3 mt-1 text-sm ${textMuted}`}>
                          <span>{meal.calories} cal</span>
                          {meal.protein > 0 && <span>• {meal.protein}g protein</span>}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteMealMutation.mutate(meal.id)}
                        className={`${isDark ? 'text-white/30 hover:text-red-400 hover:bg-red-500/10' : 'text-gray-300 hover:text-red-500 hover:bg-red-50'}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {mealsByType[mealType.type].length === 0 && (
                <div className={`p-4 text-center ${textMuted} text-sm`}>
                  No {mealType.label.toLowerCase()} logged
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Manual Log Button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          onClick={() => setMealModal(true)}
          className={`w-full mt-6 p-4 rounded-2xl border-2 border-dashed ${isDark ? 'border-white/20 hover:border-white/30' : 'border-gray-300 hover:border-gray-400'} flex items-center justify-center gap-2 transition-all`}
        >
          <Search className={`w-5 h-5 ${textMuted}`} />
          <span className={textSecondary}>Search foods manually</span>
        </motion.button>

        <LogMealModal
          open={mealModal}
          onClose={() => setMealModal(false)}
          onSave={(data) => logMealMutation.mutateAsync({ ...data, meal_type: data.meal_type || selectedMealType })}
          goalType={goalType}
          defaultMealType={selectedMealType}
        />

        <ScanFoodModal
          open={scanModal}
          onClose={() => setScanModal(false)}
          onSave={(data) => logMealMutation.mutateAsync({ ...data, meal_type: data.meal_type || selectedMealType })}
          goalType={goalType}
          mealType={selectedMealType}
        />
      </div>
    </div>
  );
}