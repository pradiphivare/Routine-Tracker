import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          avatar_url: string;
          theme_preference: 'light' | 'dark';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string;
          avatar_url?: string;
          theme_preference?: 'light' | 'dark';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string;
          avatar_url?: string;
          theme_preference?: 'light' | 'dark';
          created_at?: string;
          updated_at?: string;
        };
      };
      habits: {
        Row: {
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
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          description?: string;
          icon?: string;
          color?: string;
          frequency?: 'daily' | 'weekly';
          target_days?: number;
          is_active?: boolean;
          order_index?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          description?: string;
          icon?: string;
          color?: string;
          frequency?: 'daily' | 'weekly';
          target_days?: number;
          is_active?: boolean;
          order_index?: number;
          created_at?: string;
        };
      };
      habit_completions: {
        Row: {
          id: string;
          habit_id: string;
          user_id: string;
          completed_at: string;
          notes: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          habit_id: string;
          user_id: string;
          completed_at?: string;
          notes?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          habit_id?: string;
          user_id?: string;
          completed_at?: string;
          notes?: string;
          created_at?: string;
        };
      };
      user_badges: {
        Row: {
          id: string;
          user_id: string;
          badge_type: string;
          earned_at: string;
          habit_id: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          badge_type: string;
          earned_at?: string;
          habit_id?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          badge_type?: string;
          earned_at?: string;
          habit_id?: string | null;
        };
      };
      user_stats: {
        Row: {
          user_id: string;
          total_habits: number;
          active_habits: number;
          total_completions: number;
          current_streak: number;
          longest_streak: number;
          last_updated: string;
        };
        Insert: {
          user_id: string;
          total_habits?: number;
          active_habits?: number;
          total_completions?: number;
          current_streak?: number;
          longest_streak?: number;
          last_updated?: string;
        };
        Update: {
          user_id?: string;
          total_habits?: number;
          active_habits?: number;
          total_completions?: number;
          current_streak?: number;
          longest_streak?: number;
          last_updated?: string;
        };
      };
    };
  };
};
