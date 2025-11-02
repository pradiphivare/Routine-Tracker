/*
  # Habit Tracker Database Schema

  ## Overview
  This migration creates a complete habit tracking system with authentication,
  habit management, streak tracking, and gamification features.

  ## Tables Created

  ### 1. profiles
  User profile information extending Supabase auth.users
  - `id` (uuid, FK to auth.users) - User identifier
  - `email` (text) - User email
  - `full_name` (text) - User's full name
  - `avatar_url` (text) - Profile picture URL
  - `theme_preference` (text) - Light or dark theme
  - `created_at` (timestamptz) - Account creation time
  - `updated_at` (timestamptz) - Last profile update

  ### 2. habits
  User's habit definitions
  - `id` (uuid, PK) - Habit identifier
  - `user_id` (uuid, FK) - Owner of the habit
  - `name` (text) - Habit name (e.g., "Morning Exercise")
  - `description` (text) - Detailed description
  - `icon` (text) - Icon identifier (exercise, meditation, reading, sleep, hydration, etc.)
  - `color` (text) - Hex color code for UI
  - `frequency` (text) - daily or weekly
  - `target_days` (integer) - Days per week for weekly habits
  - `is_active` (boolean) - Whether habit is currently tracked
  - `created_at` (timestamptz) - Habit creation time
  - `order_index` (integer) - Display order

  ### 3. habit_completions
  Daily habit completion records
  - `id` (uuid, PK) - Completion record identifier
  - `habit_id` (uuid, FK) - Associated habit
  - `user_id` (uuid, FK) - User who completed
  - `completed_at` (date) - Date of completion
  - `notes` (text) - Optional completion notes
  - `created_at` (timestamptz) - Record creation time

  ### 4. user_badges
  Achievement badges earned by users
  - `id` (uuid, PK) - Badge record identifier
  - `user_id` (uuid, FK) - User who earned badge
  - `badge_type` (text) - Badge identifier (streak_7, streak_30, streak_100, first_habit, etc.)
  - `earned_at` (timestamptz) - When badge was earned
  - `habit_id` (uuid, FK, nullable) - Related habit if applicable

  ### 5. user_stats
  Cached statistics for performance
  - `user_id` (uuid, PK, FK) - User identifier
  - `total_habits` (integer) - Total number of habits created
  - `active_habits` (integer) - Currently active habits
  - `total_completions` (integer) - All-time completions
  - `current_streak` (integer) - Current daily streak
  - `longest_streak` (integer) - Best streak ever
  - `last_updated` (timestamptz) - Last statistics update

  ## Security
  Row Level Security (RLS) enabled on all tables with policies ensuring:
  - Users can only access their own data
  - Authenticated access required for all operations
  - Ownership validation on all mutations

  ## Indexes
  Performance indexes on frequently queried columns:
  - User lookups on all tables
  - Date-based queries on completions
  - Badge type lookups
*/

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- PROFILES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text DEFAULT '',
  avatar_url text DEFAULT '',
  theme_preference text DEFAULT 'light' CHECK (theme_preference IN ('light', 'dark')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- =====================================================
-- HABITS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS habits (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text DEFAULT '',
  icon text NOT NULL DEFAULT 'check-circle',
  color text NOT NULL DEFAULT '#3B82F6',
  frequency text NOT NULL DEFAULT 'daily' CHECK (frequency IN ('daily', 'weekly')),
  target_days integer DEFAULT 7 CHECK (target_days >= 1 AND target_days <= 7),
  is_active boolean DEFAULT true,
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE habits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own habits"
  ON habits FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own habits"
  ON habits FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own habits"
  ON habits FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own habits"
  ON habits FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_habits_user_id ON habits(user_id);
CREATE INDEX IF NOT EXISTS idx_habits_user_active ON habits(user_id, is_active);

-- =====================================================
-- HABIT_COMPLETIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS habit_completions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  habit_id uuid NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  completed_at date NOT NULL DEFAULT CURRENT_DATE,
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  UNIQUE(habit_id, completed_at)
);

ALTER TABLE habit_completions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own completions"
  ON habit_completions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own completions"
  ON habit_completions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own completions"
  ON habit_completions FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_completions_user_id ON habit_completions(user_id);
CREATE INDEX IF NOT EXISTS idx_completions_habit_id ON habit_completions(habit_id);
CREATE INDEX IF NOT EXISTS idx_completions_date ON habit_completions(completed_at);
CREATE INDEX IF NOT EXISTS idx_completions_user_date ON habit_completions(user_id, completed_at);

-- =====================================================
-- USER_BADGES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS user_badges (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  badge_type text NOT NULL,
  earned_at timestamptz DEFAULT now(),
  habit_id uuid REFERENCES habits(id) ON DELETE SET NULL,
  UNIQUE(user_id, badge_type, habit_id)
);

ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own badges"
  ON user_badges FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own badges"
  ON user_badges FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_badges_user_id ON user_badges(user_id);
CREATE INDEX IF NOT EXISTS idx_badges_type ON user_badges(badge_type);

-- =====================================================
-- USER_STATS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS user_stats (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  total_habits integer DEFAULT 0,
  active_habits integer DEFAULT 0,
  total_completions integer DEFAULT 0,
  current_streak integer DEFAULT 0,
  longest_streak integer DEFAULT 0,
  last_updated timestamptz DEFAULT now()
);

ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own stats"
  ON user_stats FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own stats"
  ON user_stats FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own stats"
  ON user_stats FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- FUNCTIONS
-- =====================================================

-- Function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', '')
  );
  
  INSERT INTO public.user_stats (user_id)
  VALUES (new.id);
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for profiles updated_at
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();