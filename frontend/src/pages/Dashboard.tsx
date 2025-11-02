import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { StatsCards } from '../components/dashboard/StatsCards';
import { ProgressChart } from '../components/dashboard/ProgressChart';
import { BadgesSection } from '../components/dashboard/BadgesSection';
import { HabitCard } from '../components/habits/HabitCard';
import { CreateHabitModal } from '../components/habits/CreateHabitModal';
import { useHabits } from '../hooks/useHabits';
import { useCompletions } from '../hooks/useCompletions';

export function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { habits, deleteHabit } = useHabits();
  const { toggleCompletion, isCompleted, getHabitStreak } = useCompletions();
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome back!
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Track your progress and build lasting habits
          </p>
        </motion.div>

        <div className="space-y-8">
          <StatsCards />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ProgressChart />
            <BadgesSection />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Today's Habits
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Keep the momentum going!
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                <Plus className="w-5 h-5" />
                Add Habit
              </motion.button>
            </div>

            {habits.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="backdrop-blur-xl bg-white/60 dark:bg-gray-900/60 rounded-2xl p-12 border border-white/30 dark:border-gray-700/30 shadow-lg text-center"
              >
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-teal-400 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Plus className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  No habits yet
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Start building better habits today! Create your first habit to begin your journey.
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsModalOpen(true)}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  Create Your First Habit
                </motion.button>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {habits.map((habit) => (
                  <HabitCard
                    key={habit.id}
                    habit={habit}
                    completed={isCompleted(habit.id, today)}
                    streak={getHabitStreak(habit.id)}
                    onToggle={() => toggleCompletion(habit.id, today)}
                    onDelete={() => deleteHabit(habit.id)}
                  />
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </main>

      <CreateHabitModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
