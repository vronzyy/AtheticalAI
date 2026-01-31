import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Utensils, Search, Plus, Minus, Check, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { FOOD_DATABASE, FOOD_CATEGORIES } from '@/components/data/FoodDatabase';

// Using imported food database
const LEGACY_FOOD_DATABASE = [
  // Proteins
  { name: 'Grilled Chicken Breast', category: 'protein', calories: 165, protein: 31, carbs: 0, fat: 3.6, serving: '4 oz' },
  { name: 'Salmon Fillet', category: 'protein', calories: 208, protein: 20, carbs: 0, fat: 13, serving: '4 oz' },
  { name: 'Ground Beef (lean)', category: 'protein', calories: 215, protein: 21, carbs: 0, fat: 14, serving: '4 oz' },
  { name: 'Turkey Breast', category: 'protein', calories: 135, protein: 30, carbs: 0, fat: 1, serving: '4 oz' },
  { name: 'Eggs (whole)', category: 'protein', calories: 78, protein: 6, carbs: 0.6, fat: 5, serving: '1 large' },
  { name: 'Egg Whites', category: 'protein', calories: 17, protein: 3.6, carbs: 0.2, fat: 0, serving: '1 large' },
  { name: 'Tuna (canned)', category: 'protein', calories: 100, protein: 22, carbs: 0, fat: 1, serving: '3 oz' },
  { name: 'Shrimp', category: 'protein', calories: 84, protein: 18, carbs: 0, fat: 1, serving: '3 oz' },
  { name: 'Greek Yogurt', category: 'protein', calories: 100, protein: 17, carbs: 6, fat: 0.7, serving: '6 oz' },
  { name: 'Cottage Cheese', category: 'protein', calories: 110, protein: 12, carbs: 5, fat: 5, serving: '1/2 cup' },
  { name: 'Protein Shake (whey)', category: 'protein', calories: 120, protein: 24, carbs: 3, fat: 1, serving: '1 scoop' },
  
  // Carbs
  { name: 'Brown Rice', category: 'carbs', calories: 215, protein: 5, carbs: 45, fat: 1.8, serving: '1 cup cooked' },
  { name: 'White Rice', category: 'carbs', calories: 205, protein: 4.3, carbs: 45, fat: 0.4, serving: '1 cup cooked' },
  { name: 'Oatmeal', category: 'carbs', calories: 150, protein: 5, carbs: 27, fat: 3, serving: '1/2 cup dry' },
  { name: 'Sweet Potato', category: 'carbs', calories: 103, protein: 2, carbs: 24, fat: 0, serving: '1 medium' },
  { name: 'White Potato', category: 'carbs', calories: 161, protein: 4, carbs: 37, fat: 0, serving: '1 medium' },
  { name: 'Whole Wheat Bread', category: 'carbs', calories: 80, protein: 4, carbs: 15, fat: 1, serving: '1 slice' },
  { name: 'Pasta (cooked)', category: 'carbs', calories: 220, protein: 8, carbs: 43, fat: 1.3, serving: '1 cup' },
  { name: 'Quinoa', category: 'carbs', calories: 222, protein: 8, carbs: 39, fat: 3.5, serving: '1 cup cooked' },
  { name: 'Banana', category: 'carbs', calories: 105, protein: 1.3, carbs: 27, fat: 0.4, serving: '1 medium' },
  { name: 'Apple', category: 'carbs', calories: 95, protein: 0.5, carbs: 25, fat: 0.3, serving: '1 medium' },
  
  // Fats
  { name: 'Avocado', category: 'fats', calories: 160, protein: 2, carbs: 9, fat: 15, serving: '1/2 medium' },
  { name: 'Peanut Butter', category: 'fats', calories: 190, protein: 7, carbs: 7, fat: 16, serving: '2 tbsp' },
  { name: 'Almond Butter', category: 'fats', calories: 196, protein: 7, carbs: 6, fat: 18, serving: '2 tbsp' },
  { name: 'Almonds', category: 'fats', calories: 164, protein: 6, carbs: 6, fat: 14, serving: '1 oz (23 nuts)' },
  { name: 'Walnuts', category: 'fats', calories: 185, protein: 4, carbs: 4, fat: 18, serving: '1 oz' },
  { name: 'Olive Oil', category: 'fats', calories: 119, protein: 0, carbs: 0, fat: 14, serving: '1 tbsp' },
  { name: 'Cheese (cheddar)', category: 'fats', calories: 113, protein: 7, carbs: 0.4, fat: 9, serving: '1 oz' },
  
  // Vegetables
  { name: 'Broccoli', category: 'vegetables', calories: 55, protein: 4, carbs: 11, fat: 0.5, serving: '1 cup' },
  { name: 'Spinach', category: 'vegetables', calories: 7, protein: 1, carbs: 1, fat: 0, serving: '1 cup raw' },
  { name: 'Mixed Salad', category: 'vegetables', calories: 20, protein: 1, carbs: 4, fat: 0, serving: '2 cups' },
  { name: 'Green Beans', category: 'vegetables', calories: 31, protein: 2, carbs: 7, fat: 0, serving: '1 cup' },
  { name: 'Carrots', category: 'vegetables', calories: 50, protein: 1, carbs: 12, fat: 0, serving: '1 cup' },
  
  // Meals
  { name: 'Chicken & Rice Bowl', category: 'meals', calories: 450, protein: 35, carbs: 50, fat: 10, serving: '1 bowl' },
  { name: 'Turkey Sandwich', category: 'meals', calories: 350, protein: 25, carbs: 35, fat: 12, serving: '1 sandwich' },
  { name: 'Protein Smoothie', category: 'meals', calories: 300, protein: 30, carbs: 35, fat: 5, serving: '16 oz' },
  { name: 'Grilled Chicken Salad', category: 'meals', calories: 380, protein: 35, carbs: 15, fat: 20, serving: '1 large' },
  { name: 'Steak & Vegetables', category: 'meals', calories: 400, protein: 40, carbs: 15, fat: 20, serving: '1 plate' },
  { name: 'Fish Tacos', category: 'meals', calories: 350, protein: 25, carbs: 30, fat: 15, serving: '2 tacos' },
  { name: 'Burrito Bowl', category: 'meals', calories: 550, protein: 30, carbs: 55, fat: 22, serving: '1 bowl' },
  { name: 'Pasta with Meat Sauce', category: 'meals', calories: 480, protein: 25, carbs: 55, fat: 16, serving: '1 plate' },
  
  // Snacks
  { name: 'Protein Bar', category: 'snacks', calories: 200, protein: 20, carbs: 22, fat: 7, serving: '1 bar' },
  { name: 'Trail Mix', category: 'snacks', calories: 175, protein: 5, carbs: 15, fat: 11, serving: '1/4 cup' },
  { name: 'String Cheese', category: 'snacks', calories: 80, protein: 7, carbs: 1, fat: 5, serving: '1 stick' },
  { name: 'Beef Jerky', category: 'snacks', calories: 80, protein: 15, carbs: 3, fat: 1, serving: '1 oz' },
  { name: 'Rice Cakes', category: 'snacks', calories: 70, protein: 1, carbs: 15, fat: 0, serving: '2 cakes' },
  
  // Drinks
  { name: 'Whole Milk', category: 'drinks', calories: 150, protein: 8, carbs: 12, fat: 8, serving: '1 cup' },
  { name: 'Chocolate Milk', category: 'drinks', calories: 208, protein: 8, carbs: 26, fat: 8, serving: '1 cup' },
  { name: 'Orange Juice', category: 'drinks', calories: 110, protein: 2, carbs: 26, fat: 0, serving: '1 cup' },
  { name: 'Sports Drink', category: 'drinks', calories: 80, protein: 0, carbs: 21, fat: 0, serving: '12 oz' },
];

export default function LogMealModal({ open, onClose, onSave, goalType }) {
  const [step, setStep] = useState('search'); // 'search' or 'confirm'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFood, setSelectedFood] = useState(null);
  const [servings, setServings] = useState(1);
  const [mealType, setMealType] = useState('breakfast');
  const [saving, setSaving] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');

  const accentGradient = goalType === 'gain' 
    ? 'from-emerald-500 to-teal-600' 
    : 'from-violet-500 to-purple-600';
  
  const accentColor = goalType === 'gain' ? 'emerald' : 'violet';

  const categories = FOOD_CATEGORIES;

  const filteredFoods = FOOD_DATABASE.filter(food => {
    const matchesSearch = food.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'all' || food.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSelectFood = (food) => {
    setSelectedFood(food);
    setServings(1);
    setStep('confirm');
  };

  const handleSave = async () => {
    if (!selectedFood) return;
    setSaving(true);
    
    await onSave({
      meal_type: mealType,
      food_name: `${selectedFood.name}${servings > 1 ? ` (x${servings})` : ''}`,
      calories: Math.round(selectedFood.calories * servings),
      protein: Math.round(selectedFood.protein * servings),
      carbs: Math.round(selectedFood.carbs * servings),
      fat: Math.round(selectedFood.fat * servings),
      date: format(new Date(), 'yyyy-MM-dd')
    });
    
    setSaving(false);
    resetAndClose();
  };

  const resetAndClose = () => {
    setStep('search');
    setSearchQuery('');
    setSelectedFood(null);
    setServings(1);
    setActiveCategory('all');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={resetAndClose}>
      <DialogContent className="bg-slate-900 border-white/10 text-white max-w-md max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-3">
            {step === 'confirm' && (
              <button onClick={() => setStep('search')} className="text-white/50 hover:text-white">
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            {step === 'search' ? 'Add Food' : 'Confirm'}
          </DialogTitle>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {step === 'search' ? (
            <motion.div
              key="search"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1 flex flex-col overflow-hidden"
            >
              {/* Meal Type */}
              <div className="mb-4">
                <Select value={mealType} onValueChange={setMealType}>
                  <SelectTrigger className="h-12 bg-white/5 border-white/10 text-white rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-white/10">
                    <SelectItem value="breakfast" className="text-white">🌅 Breakfast</SelectItem>
                    <SelectItem value="lunch" className="text-white">☀️ Lunch</SelectItem>
                    <SelectItem value="dinner" className="text-white">🌙 Dinner</SelectItem>
                    <SelectItem value="snack" className="text-white">🍎 Snack</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Search */}
              <div className="relative mb-4">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search foods..."
                  className="pl-12 h-12 bg-white/5 border-white/10 text-white placeholder:text-white/30 rounded-xl"
                />
              </div>

              {/* Categories */}
              <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                      activeCategory === cat.id
                        ? `bg-gradient-to-r ${accentGradient} text-white`
                        : 'bg-white/5 text-white/60 hover:bg-white/10'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Food List */}
              <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                {filteredFoods.map((food, idx) => (
                  <motion.button
                    key={food.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.02 }}
                    onClick={() => handleSelectFood(food)}
                    className="w-full p-4 bg-white/5 hover:bg-white/10 rounded-xl text-left transition-all border border-white/5 hover:border-white/10"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white font-medium">{food.name}</p>
                        <p className="text-white/40 text-sm">{food.serving}</p>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold text-${accentColor}-400`}>{food.calories}</p>
                        <p className="text-white/40 text-xs">cal</p>
                      </div>
                    </div>
                    <div className="flex gap-4 mt-2 text-xs text-white/50">
                      <span>P: {food.protein}g</span>
                      <span>C: {food.carbs}g</span>
                      <span>F: {food.fat}g</span>
                    </div>
                  </motion.button>
                ))}
                
                {filteredFoods.length === 0 && (
                  <div className="text-center py-8 text-white/40">
                    <Utensils className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>No foods found</p>
                  </div>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="confirm"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              {selectedFood && (
                <>
                  {/* Food Info */}
                  <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                    <h3 className="text-xl font-bold text-white mb-1">{selectedFood.name}</h3>
                    <p className="text-white/50 text-sm mb-4">{selectedFood.serving} per serving</p>
                    
                    {/* Servings Selector */}
                    <div className="flex items-center justify-center gap-4 mb-6">
                      <button
                        onClick={() => setServings(Math.max(0.5, servings - 0.5))}
                        className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                      >
                        <Minus className="w-5 h-5 text-white" />
                      </button>
                      <div className="text-center">
                        <p className="text-3xl font-bold text-white">{servings}</p>
                        <p className="text-white/50 text-sm">servings</p>
                      </div>
                      <button
                        onClick={() => setServings(servings + 0.5)}
                        className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                      >
                        <Plus className="w-5 h-5 text-white" />
                      </button>
                    </div>

                    {/* Nutrition Summary */}
                    <div className="grid grid-cols-4 gap-3">
                      <div className="text-center p-3 bg-white/5 rounded-xl">
                        <p className={`text-xl font-bold text-${accentColor}-400`}>
                          {Math.round(selectedFood.calories * servings)}
                        </p>
                        <p className="text-white/40 text-xs">calories</p>
                      </div>
                      <div className="text-center p-3 bg-white/5 rounded-xl">
                        <p className="text-xl font-bold text-red-400">
                          {Math.round(selectedFood.protein * servings)}g
                        </p>
                        <p className="text-white/40 text-xs">protein</p>
                      </div>
                      <div className="text-center p-3 bg-white/5 rounded-xl">
                        <p className="text-xl font-bold text-amber-400">
                          {Math.round(selectedFood.carbs * servings)}g
                        </p>
                        <p className="text-white/40 text-xs">carbs</p>
                      </div>
                      <div className="text-center p-3 bg-white/5 rounded-xl">
                        <p className="text-xl font-bold text-yellow-400">
                          {Math.round(selectedFood.fat * servings)}g
                        </p>
                        <p className="text-white/40 text-xs">fat</p>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={handleSave}
                    disabled={saving}
                    className={`w-full h-14 rounded-xl bg-gradient-to-r ${accentGradient} text-white font-semibold hover:opacity-90 transition-opacity`}
                  >
                    {saving ? 'Adding...' : (
                      <>
                        <Check className="w-5 h-5 mr-2" />
                        Add to {mealType.charAt(0).toUpperCase() + mealType.slice(1)}
                      </>
                    )}
                  </Button>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}