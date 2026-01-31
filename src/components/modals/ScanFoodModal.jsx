import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Camera, Upload, Loader2, Check, X, RefreshCw, Sparkles, Utensils } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { useTheme } from '@/components/ThemeContext';

export default function ScanFoodModal({ open, onClose, onSave, goalType, mealType: defaultMealType }) {
  const [step, setStep] = useState('capture');
  const [imageUrl, setImageUrl] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [servings, setServings] = useState(1);
  const [mealType, setMealType] = useState(defaultMealType || 'lunch');
  const fileInputRef = useRef(null);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const accentGradient = goalType === 'gain' ? 'from-emerald-500 to-teal-600' : 'from-violet-500 to-purple-600';
  const accentColor = goalType === 'gain' ? 'emerald' : 'violet';

  const bgModal = isDark ? 'bg-slate-900' : 'bg-white';
  const borderColor = isDark ? 'border-white/10' : 'border-gray-200';
  const textPrimary = isDark ? 'text-white' : 'text-gray-900';
  const textSecondary = isDark ? 'text-white/60' : 'text-gray-500';
  const textMuted = isDark ? 'text-white/40' : 'text-gray-400';
  const bgCard = isDark ? 'bg-white/5' : 'bg-gray-50';

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setStep('analyzing');
    setAnalyzing(true);

    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setImageUrl(file_url);

      const analysis = await base44.integrations.Core.InvokeLLM({
        prompt: `Analyze this food image and estimate the nutritional content accurately. Identify all visible food items, estimate portion sizes based on typical serving sizes, and calculate total macros.

Be thorough in identifying:
- Main dishes and proteins
- Side dishes and carbs
- Vegetables and fruits
- Sauces, dressings, and toppings
- Beverages if visible

Provide your best estimate for the TOTAL meal shown. If multiple items are visible, sum them all.

Return your analysis in the exact JSON format specified. If you cannot identify the food or it's not a food image, set is_food to false.`,
        file_urls: [file_url],
        response_json_schema: {
          type: "object",
          properties: {
            is_food: { type: "boolean", description: "Whether the image contains identifiable food" },
            food_name: { type: "string", description: "Descriptive name of the meal/food items" },
            items_identified: { type: "array", items: { type: "string" }, description: "List of individual food items identified" },
            calories: { type: "number", description: "Estimated total calories" },
            protein: { type: "number", description: "Estimated protein in grams" },
            carbs: { type: "number", description: "Estimated carbs in grams" },
            fat: { type: "number", description: "Estimated fat in grams" },
            fiber: { type: "number", description: "Estimated fiber in grams" },
            confidence: { type: "string", enum: ["high", "medium", "low"], description: "Confidence in the estimate" },
            portion_notes: { type: "string", description: "Notes about portion size estimation" },
            suggestions: { type: "string", description: "Brief nutritional tips for athletes" }
          },
          required: ["is_food", "food_name", "calories", "protein", "carbs", "fat", "confidence"]
        }
      });

      setResults(analysis);
      setStep('results');
    } catch (error) {
      console.error('Error analyzing food:', error);
      setStep('capture');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSave = () => {
    if (!results) return;
    
    onSave({
      food_name: results.food_name,
      calories: Math.round(results.calories * servings),
      protein: Math.round(results.protein * servings),
      carbs: Math.round(results.carbs * servings),
      fat: Math.round(results.fat * servings),
      meal_type: mealType
    });
    
    handleReset();
    onClose();
  };

  const handleReset = () => {
    setStep('capture');
    setImageUrl(null);
    setResults(null);
    setServings(1);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  const mealTypes = [
    { value: 'breakfast', label: '🌅 Breakfast' },
    { value: 'lunch', label: '☀️ Lunch' },
    { value: 'dinner', label: '🌙 Dinner' },
    { value: 'snack', label: '🍎 Snack' },
  ];

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className={`${bgModal} ${borderColor} border ${textPrimary} max-w-md mx-auto max-h-[90vh] overflow-y-auto`}>
        <DialogHeader>
          <DialogTitle className={`text-xl font-bold ${textPrimary} flex items-center gap-2`}>
            <div className={`p-2 rounded-lg bg-gradient-to-br ${accentGradient}`}>
              <Camera className="w-4 h-4 text-white" />
            </div>
            AI Food Scanner
          </DialogTitle>
        </DialogHeader>

        <div className="py-2">
          {step === 'capture' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              <div className={`${bgCard} rounded-xl p-4 border ${borderColor}`}>
                <div className="flex items-center gap-3 mb-3">
                  <Sparkles className={`w-5 h-5 ${goalType === 'gain' ? 'text-emerald-500' : 'text-violet-500'}`} />
                  <span className={`${textPrimary} font-medium`}>How it works</span>
                </div>
                <ul className={`text-sm ${textSecondary} space-y-2`}>
                  <li className="flex items-start gap-2">
                    <span className="text-lg">📸</span>
                    <span>Take a clear photo of your meal</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-lg">🤖</span>
                    <span>AI identifies foods & estimates nutrition</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-lg">✅</span>
                    <span>Review, adjust portions & log</span>
                  </li>
                </ul>
              </div>

              <div className={`${bgCard} rounded-xl p-3 border ${borderColor}`}>
                <label className={`text-sm ${textSecondary} mb-2 block`}>Meal Type</label>
                <Select value={mealType} onValueChange={setMealType}>
                  <SelectTrigger className={`w-full ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-gray-200 text-gray-900'}`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className={isDark ? 'bg-slate-800 border-white/10' : 'bg-white border-gray-200'}>
                    {mealTypes.map(mt => (
                      <SelectItem key={mt.value} value={mt.value} className={textPrimary}>{mt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileSelect}
                className="hidden"
              />
              
              <Button
                onClick={() => fileInputRef.current?.click()}
                className={`w-full h-36 rounded-2xl bg-gradient-to-r ${accentGradient} flex flex-col items-center justify-center gap-3 text-white`}
              >
                <div className="p-4 bg-white/20 rounded-full">
                  <Camera className="w-10 h-10" />
                </div>
                <span className="text-lg font-semibold">Take Photo</span>
              </Button>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className={`w-full border-t ${borderColor}`}></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className={`px-2 ${bgModal} ${textMuted}`}>or</span>
                </div>
              </div>
              
              <Button
                variant="outline"
                onClick={() => {
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.accept = 'image/*';
                  input.onchange = (e) => handleFileSelect(e);
                  input.click();
                }}
                className={`w-full h-14 rounded-xl ${isDark ? 'border-white/20 text-white hover:bg-white/10' : 'border-gray-300 text-gray-700 hover:bg-gray-100'}`}
              >
                <Upload className="w-5 h-5 mr-2" />
                Upload from Gallery
              </Button>
            </motion.div>
          )}

          {step === 'analyzing' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-16"
            >
              <div className={`relative mb-6`}>
                <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${accentGradient} flex items-center justify-center`}>
                  <Utensils className="w-8 h-8 text-white" />
                </div>
                <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${accentGradient} animate-ping opacity-30`} />
              </div>
              <p className={`${textPrimary} font-semibold text-lg mb-2`}>Analyzing your food...</p>
              <p className={`${textMuted} text-sm text-center max-w-xs`}>
                Our AI is identifying ingredients and calculating nutrition
              </p>
            </motion.div>
          )}

          {step === 'results' && results && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {imageUrl && (
                <div className="relative rounded-xl overflow-hidden">
                  <img src={imageUrl} alt="Food" className="w-full h-48 object-cover" />
                  <div className={`absolute top-2 right-2 px-3 py-1 rounded-full text-xs font-medium ${
                    results.confidence === 'high' ? 'bg-green-500' :
                    results.confidence === 'medium' ? 'bg-yellow-500' :
                    'bg-orange-500'
                  } text-white flex items-center gap-1`}>
                    <Sparkles className="w-3 h-3" />
                    {results.confidence} confidence
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                    <h3 className="text-lg font-bold text-white">{results.food_name}</h3>
                  </div>
                </div>
              )}

              {!results.is_food ? (
                <div className="text-center py-8">
                  <div className={`w-16 h-16 rounded-full ${isDark ? 'bg-red-500/20' : 'bg-red-100'} flex items-center justify-center mx-auto mb-4`}>
                    <X className="w-8 h-8 text-red-500" />
                  </div>
                  <p className={`${textPrimary} font-semibold mb-2`}>Couldn't identify food</p>
                  <p className={`${textMuted} text-sm mb-4`}>Please try again with a clearer photo of food</p>
                  <Button
                    onClick={handleReset}
                    className={`bg-gradient-to-r ${accentGradient} text-white`}
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Try Again
                  </Button>
                </div>
              ) : (
                <>
                  {results.items_identified && results.items_identified.length > 0 && (
                    <div className={`${bgCard} rounded-xl p-3 border ${borderColor}`}>
                      <p className={`text-xs ${textMuted} mb-2`}>Items identified:</p>
                      <div className="flex flex-wrap gap-2">
                        {results.items_identified.map((item, idx) => (
                          <span key={idx} className={`px-2 py-1 rounded-full text-xs ${isDark ? 'bg-white/10 text-white/80' : 'bg-gray-200 text-gray-700'}`}>
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-4 gap-2">
                    <div className={`${isDark ? 'bg-orange-500/20' : 'bg-orange-100'} rounded-xl p-3 text-center`}>
                      <p className="text-orange-500 text-xl font-bold">{Math.round(results.calories * servings)}</p>
                      <p className={`${textMuted} text-xs`}>cal</p>
                    </div>
                    <div className={`${isDark ? (goalType === 'gain' ? 'bg-emerald-500/20' : 'bg-violet-500/20') : (goalType === 'gain' ? 'bg-emerald-100' : 'bg-violet-100')} rounded-xl p-3 text-center`}>
                      <p className={`${goalType === 'gain' ? 'text-emerald-500' : 'text-violet-500'} text-xl font-bold`}>{Math.round(results.protein * servings)}g</p>
                      <p className={`${textMuted} text-xs`}>protein</p>
                    </div>
                    <div className={`${isDark ? 'bg-blue-500/20' : 'bg-blue-100'} rounded-xl p-3 text-center`}>
                      <p className="text-blue-500 text-xl font-bold">{Math.round(results.carbs * servings)}g</p>
                      <p className={`${textMuted} text-xs`}>carbs</p>
                    </div>
                    <div className={`${isDark ? 'bg-yellow-500/20' : 'bg-yellow-100'} rounded-xl p-3 text-center`}>
                      <p className="text-yellow-500 text-xl font-bold">{Math.round(results.fat * servings)}g</p>
                      <p className={`${textMuted} text-xs`}>fat</p>
                    </div>
                  </div>

                  {results.suggestions && (
                    <div className={`${isDark ? 'bg-blue-500/10 border-blue-500/30' : 'bg-blue-50 border-blue-200'} border rounded-xl p-3`}>
                      <p className={`text-xs ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>💡 {results.suggestions}</p>
                    </div>
                  )}

                  <div className={`flex items-center justify-between ${bgCard} rounded-xl p-3 border ${borderColor}`}>
                    <span className={textSecondary}>Servings</span>
                    <div className="flex items-center gap-3">
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => setServings(Math.max(0.5, servings - 0.5))}
                        className={`h-8 w-8 ${isDark ? 'border-white/20 text-white hover:bg-white/10' : 'border-gray-300 text-gray-700 hover:bg-gray-100'}`}
                      >
                        -
                      </Button>
                      <span className={`${textPrimary} font-bold w-8 text-center`}>{servings}</span>
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => setServings(servings + 0.5)}
                        className={`h-8 w-8 ${isDark ? 'border-white/20 text-white hover:bg-white/10' : 'border-gray-300 text-gray-700 hover:bg-gray-100'}`}
                      >
                        +
                      </Button>
                    </div>
                  </div>

                  <div className={`${bgCard} rounded-xl p-3 border ${borderColor}`}>
                    <label className={`text-sm ${textSecondary} mb-2 block`}>Log as</label>
                    <Select value={mealType} onValueChange={setMealType}>
                      <SelectTrigger className={`w-full ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-gray-200 text-gray-900'}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className={isDark ? 'bg-slate-800 border-white/10' : 'bg-white border-gray-200'}>
                        {mealTypes.map(mt => (
                          <SelectItem key={mt.value} value={mt.value} className={textPrimary}>{mt.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      onClick={handleReset}
                      variant="outline"
                      className={`flex-1 h-12 rounded-xl ${isDark ? 'border-white/20 text-white hover:bg-white/10' : 'border-gray-300 text-gray-700 hover:bg-gray-100'}`}
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Retake
                    </Button>
                    <Button
                      onClick={handleSave}
                      className={`flex-1 h-12 rounded-xl bg-gradient-to-r ${accentGradient} text-white`}
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Log Meal
                    </Button>
                  </div>
                </>
              )}
            </motion.div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}