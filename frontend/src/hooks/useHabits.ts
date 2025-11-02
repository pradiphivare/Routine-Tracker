import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export interface Habit {
  id: string;
  user_id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  frequency: 'daily' | 'weekly';
  target_days: number;
  is_active: boolean;
  order_index: number;
  created_at: string;
}

export function useHabits() {
  const { user } = useAuth();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHabits = async () => {
    if (!user) return;

    setLoading(true);
    const { data, error } = await supabase
      .from('habits')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .order('order_index', { ascending: true });

    if (!error && data) {
      setHabits(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchHabits();
  }, [user]);

  const createHabit = async (habitData: Omit<Habit, 'id' | 'user_id' | 'created_at'>) => {
    if (!user) return;

    const { data, error } = await supabase
      .from('habits')
      .insert({
        ...habitData,
        user_id: user.id,
      })
      .select()
      .single();

    if (!error && data) {
      setHabits([...habits, data]);
      return data;
    }
    return null;
  };

  const updateHabit = async (id: string, updates: Partial<Habit>) => {
    const { data, error } = await supabase
      .from('habits')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (!error && data) {
      setHabits(habits.map(h => h.id === id ? data : h));
    }
  };

  const deleteHabit = async (id: string) => {
    const { error } = await supabase
      .from('habits')
      .update({ is_active: false })
      .eq('id', id);

    if (!error) {
      setHabits(habits.filter(h => h.id !== id));
    }
  };

  return {
    habits,
    loading,
    createHabit,
    updateHabit,
    deleteHabit,
    refetch: fetchHabits,
  };
}
