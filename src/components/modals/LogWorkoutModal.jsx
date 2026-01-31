import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dumbbell, Clock, Flame } from 'lucide-react';
import { format } from 'date-fns';

export default function LogWorkoutModal({ open, onClose, onSave, goalType }) {
  const [workout, setWorkout] = useState({
    workout_type: 'strength',
    duration_minutes: '',
    calories_burned: '',
    notes: '',
    date: format(new Date(), 'yyyy-MM-dd')
  });
  const [saving, setSaving] = useState(false);

  const accentGradient = goalType === 'gain' 
    ? 'from-emerald-500 to-teal-600' 
    : 'from-violet-500 to-purple-600';

  const handleChange = (key, value) => {
    setWorkout(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    if (!workout.duration_minutes) return;
    setSaving(true);
    await onSave({
      ...workout,
      duration_minutes: parseFloat(workout.duration_minutes) || 0,
      calories_burned: parseFloat(workout.calories_burned) || 0,
      completed: true
    });
    setSaving(false);
    setWorkout({
      workout_type: 'strength',
      duration_minutes: '',
      calories_burned: '',
      notes: '',
      date: format(new Date(), 'yyyy-MM-dd')
    });
    onClose();
  };

  const workoutTypes = [
    { value: 'strength', label: '💪 Strength Training' },
    { value: 'cardio', label: '🏃 Cardio' },
    { value: 'sport_practice', label: '🏆 Sport Practice' },
    { value: 'flexibility', label: '🧘 Flexibility/Yoga' },
    { value: 'hiit', label: '⚡ HIIT' },
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-slate-900 border-white/10 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Log Workout</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          <div>
            <label className="text-white/70 text-sm mb-2 block">Workout Type</label>
            <Select value={workout.workout_type} onValueChange={(v) => handleChange('workout_type', v)}>
              <SelectTrigger className="h-14 bg-white/5 border-white/10 text-white rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-white/10">
                {workoutTypes.map(type => (
                  <SelectItem key={type.value} value={type.value} className="text-white">
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-white/70 text-sm mb-2 block">Duration</label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <Input
                  type="number"
                  value={workout.duration_minutes}
                  onChange={(e) => handleChange('duration_minutes', e.target.value)}
                  placeholder="45"
                  className="pl-10 pr-12 h-12 bg-white/5 border-white/10 text-white placeholder:text-white/30 rounded-xl"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 text-sm">min</span>
              </div>
            </div>
            
            <div>
              <label className="text-white/70 text-sm mb-2 block">Calories Burned</label>
              <div className="relative">
                <Flame className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-orange-400" />
                <Input
                  type="number"
                  value={workout.calories_burned}
                  onChange={(e) => handleChange('calories_burned', e.target.value)}
                  placeholder="300"
                  className="pl-10 h-12 bg-white/5 border-white/10 text-white placeholder:text-white/30 rounded-xl"
                />
              </div>
            </div>
          </div>
          
          <div>
            <label className="text-white/70 text-sm mb-2 block">Notes (optional)</label>
            <Textarea
              value={workout.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              placeholder="How did your workout go?"
              className="bg-white/5 border-white/10 text-white placeholder:text-white/30 rounded-xl resize-none"
              rows={3}
            />
          </div>
          
          <Button
            onClick={handleSave}
            disabled={!workout.duration_minutes || saving}
            className={`w-full h-14 rounded-xl bg-gradient-to-r ${accentGradient} text-white font-semibold hover:opacity-90 transition-opacity`}
          >
            {saving ? 'Saving...' : 'Log Workout'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}