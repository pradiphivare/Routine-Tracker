import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export interface Completion {
  id: string;
  habit_id: string;
  user_id: string;
  completed_at: string;
  notes: string;
  created_at: string;
}

export function useCompletions() {
  const { user } = useAuth();
  const [completions, setCompletions] = useState<Completion[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCompletions = async () => {
    if (!user) return;

    setLoading(true);
    const { data, error } = await supabase
      .from('habit_completions')
      .select('*')
      .eq('user_id', user.id)
      .order('completed_at', { ascending: false });

    if (!error && data) {
      setCompletions(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCompletions();
  }, [user]);

  const toggleCompletion = async (habitId: string, date: string) => {
    if (!user) return;

    const existing = completions.find(
      c => c.habit_id === habitId && c.completed_at === date
    );

    if (existing) {
      const { error } = await supabase
        .from('habit_completions')
        .delete()
        .eq('id', existing.id);

      if (!error) {
        setCompletions(completions.filter(c => c.id !== existing.id));
        return false;
      }
    } else {
      const { data, error } = await supabase
        .from('habit_completions')
        .insert({
          habit_id: habitId,
          user_id: user.id,
          completed_at: date,
        })
        .select()
        .single();

      if (!error && data) {
        setCompletions([data, ...completions]);
        return true;
      }
    }
  };

  const isCompleted = (habitId: string, date: string) => {
    return completions.some(
      c => c.habit_id === habitId && c.completed_at === date
    );
  };

  const getHabitStreak = (habitId: string): number => {
    const habitCompletions = completions
      .filter(c => c.habit_id === habitId)
      .map(c => new Date(c.completed_at))
      .sort((a, b) => b.getTime() - a.getTime());

    if (habitCompletions.length === 0) return 0;

    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const lastCompletion = habitCompletions[0];
    lastCompletion.setHours(0, 0, 0, 0);

    if (lastCompletion.getTime() !== today.getTime() && lastCompletion.getTime() !== yesterday.getTime()) {
      return 0;
    }

    let currentDate = lastCompletion;
    for (const completion of habitCompletions) {
      completion.setHours(0, 0, 0, 0);
      const dayDiff = Math.floor((currentDate.getTime() - completion.getTime()) / (1000 * 60 * 60 * 24));

      if (dayDiff === 0) {
        streak++;
      } else if (dayDiff === 1) {
        streak++;
        currentDate = completion;
      } else {
        break;
      }
    }

    return streak;
  };

  const getTodayCompletionRate = () => {
    const today = new Date().toISOString().split('T')[0];
    return completions.filter(c => c.completed_at === today).length;
  };

  return {
    completions,
    loading,
    toggleCompletion,
    isCompleted,
    getHabitStreak,
    getTodayCompletionRate,
    refetch: fetchCompletions,
  };
}
