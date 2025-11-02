import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useCompletions } from './useCompletions';
import { useHabits } from './useHabits';

export interface Stats {
  total_habits: number;
  active_habits: number;
  total_completions: number;
  current_streak: number;
  longest_streak: number;
}

export function useStats() {
  const { user } = useAuth();
  const { habits } = useHabits();
  const { completions } = useCompletions();
  const [stats, setStats] = useState<Stats>({
    total_habits: 0,
    active_habits: 0,
    total_completions: 0,
    current_streak: 0,
    longest_streak: 0,
  });

  useEffect(() => {
    if (!user) return;

    const calculateStats = () => {
      const currentStreak = calculateCurrentStreak();
      const longestStreak = calculateLongestStreak();

      setStats({
        total_habits: habits.length,
        active_habits: habits.filter(h => h.is_active).length,
        total_completions: completions.length,
        current_streak: currentStreak,
        longest_streak: longestStreak,
      });

      updateStatsInDatabase({
        total_habits: habits.length,
        active_habits: habits.filter(h => h.is_active).length,
        total_completions: completions.length,
        current_streak: currentStreak,
        longest_streak: longestStreak,
      });
    };

    calculateStats();
  }, [habits, completions, user]);

  const calculateCurrentStreak = (): number => {
    if (completions.length === 0) return 0;

    const sortedDates = [...new Set(completions.map(c => c.completed_at))]
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const lastDate = new Date(sortedDates[0]);
    lastDate.setHours(0, 0, 0, 0);

    if (lastDate.getTime() !== today.getTime() && lastDate.getTime() !== yesterday.getTime()) {
      return 0;
    }

    let streak = 0;
    let expectedDate = new Date(lastDate);

    for (const dateStr of sortedDates) {
      const date = new Date(dateStr);
      date.setHours(0, 0, 0, 0);

      if (date.getTime() === expectedDate.getTime()) {
        streak++;
        expectedDate.setDate(expectedDate.getDate() - 1);
      } else {
        break;
      }
    }

    return streak;
  };

  const calculateLongestStreak = (): number => {
    if (completions.length === 0) return 0;

    const sortedDates = [...new Set(completions.map(c => c.completed_at))]
      .sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

    let maxStreak = 1;
    let currentStreak = 1;

    for (let i = 1; i < sortedDates.length; i++) {
      const prevDate = new Date(sortedDates[i - 1]);
      const currDate = new Date(sortedDates[i]);

      const dayDiff = Math.floor((currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));

      if (dayDiff === 1) {
        currentStreak++;
        maxStreak = Math.max(maxStreak, currentStreak);
      } else {
        currentStreak = 1;
      }
    }

    return maxStreak;
  };

  const updateStatsInDatabase = async (newStats: Stats) => {
    if (!user) return;

    await supabase
      .from('user_stats')
      .upsert({
        user_id: user.id,
        ...newStats,
        last_updated: new Date().toISOString(),
      });
  };

  return stats;
}
