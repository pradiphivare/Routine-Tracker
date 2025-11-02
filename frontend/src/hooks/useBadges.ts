import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Award, Flame, Star, Trophy, Zap, Target } from 'lucide-react';

export interface Badge {
  id: string;
  user_id: string;
  badge_type: string;
  earned_at: string;
  habit_id: string | null;
}

export interface BadgeDefinition {
  type: string;
  name: string;
  description: string;
  icon: typeof Award;
  color: string;
  requirement: number;
}

export const BADGE_DEFINITIONS: BadgeDefinition[] = [
  {
    type: 'first_habit',
    name: 'Getting Started',
    description: 'Created your first habit',
    icon: Star,
    color: '#10B981',
    requirement: 1,
  },
  {
    type: 'streak_7',
    name: 'Week Warrior',
    description: 'Maintained a 7-day streak',
    icon: Flame,
    color: '#F59E0B',
    requirement: 7,
  },
  {
    type: 'streak_30',
    name: 'Month Master',
    description: 'Maintained a 30-day streak',
    icon: Trophy,
    color: '#8B5CF6',
    requirement: 30,
  },
  {
    type: 'streak_100',
    name: 'Century Champion',
    description: 'Maintained a 100-day streak',
    icon: Award,
    color: '#EF4444',
    requirement: 100,
  },
  {
    type: 'habits_5',
    name: 'Habit Builder',
    description: 'Created 5 different habits',
    icon: Zap,
    color: '#3B82F6',
    requirement: 5,
  },
  {
    type: 'completions_100',
    name: 'Consistency King',
    description: 'Completed 100 habit tasks',
    icon: Target,
    color: '#EC4899',
    requirement: 100,
  },
];

export function useBadges() {
  const { user } = useAuth();
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBadges = async () => {
    if (!user) return;

    setLoading(true);
    const { data, error } = await supabase
      .from('user_badges')
      .select('*')
      .eq('user_id', user.id)
      .order('earned_at', { ascending: false });

    if (!error && data) {
      setBadges(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBadges();
  }, [user]);

  const awardBadge = async (badgeType: string, habitId?: string) => {
    if (!user) return;

    const existing = badges.find(b => b.badge_type === badgeType);
    if (existing) return;

    const { data, error } = await supabase
      .from('user_badges')
      .insert({
        user_id: user.id,
        badge_type: badgeType,
        habit_id: habitId || null,
      })
      .select()
      .single();

    if (!error && data) {
      setBadges([data, ...badges]);
      return data;
    }
  };

  const hasBadge = (badgeType: string) => {
    return badges.some(b => b.badge_type === badgeType);
  };

  const checkAndAwardBadges = async (stats: {
    total_habits: number;
    current_streak: number;
    total_completions: number;
  }) => {
    if (stats.total_habits >= 1 && !hasBadge('first_habit')) {
      await awardBadge('first_habit');
    }

    if (stats.total_habits >= 5 && !hasBadge('habits_5')) {
      await awardBadge('habits_5');
    }

    if (stats.current_streak >= 7 && !hasBadge('streak_7')) {
      await awardBadge('streak_7');
    }

    if (stats.current_streak >= 30 && !hasBadge('streak_30')) {
      await awardBadge('streak_30');
    }

    if (stats.current_streak >= 100 && !hasBadge('streak_100')) {
      await awardBadge('streak_100');
    }

    if (stats.total_completions >= 100 && !hasBadge('completions_100')) {
      await awardBadge('completions_100');
    }
  };

  return {
    badges,
    loading,
    awardBadge,
    hasBadge,
    checkAndAwardBadges,
    refetch: fetchBadges,
  };
}
