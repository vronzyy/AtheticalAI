import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { Home, Utensils, Dumbbell, User, Zap } from 'lucide-react';
import { ThemeProvider, useTheme } from '@/components/ThemeContext';

function LayoutContent({ children, currentPageName }) {
  const [profile, setProfile] = useState(null);
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const user = await base44.auth.me();
        const profiles = await base44.entities.UserProfile.filter({ user_id: user.email });
        if (profiles.length > 0) {
          setProfile(profiles[0]);
        }
      } catch (e) {
        // User not logged in
      }
    };
    loadProfile();
  }, [currentPageName]);

  const hideNav = currentPageName === 'Onboarding';
  
  const goalType = profile?.goal_type || 'gain';
  const accentColor = goalType === 'gain' ? 'emerald' : 'violet';

  const navItems = [
    { name: 'Home', icon: Home, page: 'Dashboard' },
    { name: 'Meals', icon: Utensils, page: 'Meals' },
    { name: 'Train', icon: Dumbbell, page: 'WorkoutPlans' },
    { name: 'Progress', icon: Zap, page: 'Progress' },
    { name: 'Profile', icon: User, page: 'Profile' },
  ];

  return (
    <div className={`min-h-screen ${isDark ? 'bg-slate-950' : 'bg-gray-50'}`}>
      <style>{`
        :root {
          --accent-color: ${goalType === 'gain' ? '#10b981' : '#8b5cf6'};
        }
        
        * {
          -webkit-tap-highlight-color: transparent;
        }
        
        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        
        input[type="number"] {
          -moz-appearance: textfield;
        }
        
        ::-webkit-scrollbar {
          width: 4px;
        }
        
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        
        ::-webkit-scrollbar-thumb {
          background: ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'};
          border-radius: 4px;
        }
      `}</style>
      
      {children}
      
      {!hideNav && (
        <nav className="fixed bottom-0 left-0 right-0 z-50">
          <div className="max-w-md mx-auto">
            <div className={`${isDark ? 'bg-slate-900/95 border-white/10' : 'bg-white/95 border-gray-200'} backdrop-blur-xl border-t px-6 py-2`}>
              <div className="flex items-center justify-around">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentPageName === item.page;
                  
                  const activeColor = goalType === 'gain' ? 'text-emerald-500' : 'text-violet-500';
                  const activeBg = goalType === 'gain' ? 'bg-emerald-500/20' : 'bg-violet-500/20';
                  
                  return (
                    <Link
                      key={item.page}
                      to={createPageUrl(item.page)}
                      className={`flex flex-col items-center py-2 px-4 rounded-xl transition-all ${
                        isActive 
                          ? activeColor
                          : isDark ? 'text-white/40 hover:text-white/60' : 'text-gray-400 hover:text-gray-600'
                      }`}
                    >
                      <div className={`p-2 rounded-xl transition-all ${
                        isActive ? activeBg : ''
                      }`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-xs mt-1 font-medium">{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </nav>
      )}
    </div>
  );
}

export default function Layout({ children, currentPageName }) {
  return (
    <ThemeProvider>
      <LayoutContent currentPageName={currentPageName}>
        {children}
      </LayoutContent>
    </ThemeProvider>
  );
}