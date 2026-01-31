import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Scale, Calendar } from 'lucide-react';
import { format } from 'date-fns';

export default function LogWeightModal({ open, onClose, onSave, goalType }) {
  const [weight, setWeight] = useState('');
  const [notes, setNotes] = useState('');
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [saving, setSaving] = useState(false);

  const accentGradient = goalType === 'gain' 
    ? 'from-emerald-500 to-teal-600' 
    : 'from-violet-500 to-purple-600';

  const handleSave = async () => {
    if (!weight) return;
    setSaving(true);
    await onSave({ weight: parseFloat(weight), date, notes });
    setSaving(false);
    setWeight('');
    setNotes('');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-slate-900 border-white/10 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Log Weight</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          <div>
            <label className="text-white/70 text-sm mb-2 block">Weight</label>
            <div className="relative">
              <Scale className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <Input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="150"
                className="pl-12 pr-12 h-14 bg-white/5 border-white/10 text-white placeholder:text-white/30 rounded-xl"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40">lbs</span>
            </div>
          </div>
          
          <div>
            <label className="text-white/70 text-sm mb-2 block">Date</label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="pl-12 h-14 bg-white/5 border-white/10 text-white rounded-xl"
              />
            </div>
          </div>
          
          <div>
            <label className="text-white/70 text-sm mb-2 block">Notes (optional)</label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="How are you feeling?"
              className="bg-white/5 border-white/10 text-white placeholder:text-white/30 rounded-xl resize-none"
              rows={3}
            />
          </div>
          
          <Button
            onClick={handleSave}
            disabled={!weight || saving}
            className={`w-full h-14 rounded-xl bg-gradient-to-r ${accentGradient} text-white font-semibold hover:opacity-90 transition-opacity`}
          >
            {saving ? 'Saving...' : 'Log Weight'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}