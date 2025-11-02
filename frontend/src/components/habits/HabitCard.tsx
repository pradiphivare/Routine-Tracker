import { motion } from 'framer-motion';
import { CheckCircle2, Circle, Flame, Trash2 } from 'lucide-react';
import { Habit } from '../../hooks/useHabits';
import { HABIT_ICONS } from '../../utils/habitIcons';

interface HabitCardProps {
  habit: Habit;
  completed: boolean;
  streak: number;
  onToggle: () => void;
  onDelete: () => void;
}

export function HabitCard({ habit, completed, streak, onToggle, onDelete }: HabitCardProps) {
  const IconComponent = HABIT_ICONS[habit.icon as keyof typeof HABIT_ICONS] || Circle;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ scale: 1.02 }}
      className="group relative"
    >
      <div
        className="backdrop-blur-xl bg-white/60 dark:bg-gray-900/60 rounded-2xl p-6 border border-white/30 dark:border-gray-700/30 shadow-lg hover:shadow-2xl transition-all duration-300"
        style={{
          borderLeft: `4px solid ${habit.color}`,
        }}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3 flex-1">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{
                backgroundColor: `${habit.color}20`,
              }}
            >
              <IconComponent
                className="w-6 h-6"
                style={{ color: habit.color }}
              />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                {habit.name}
              </h3>
              {habit.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {habit.description}
                </p>
              )}
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onDelete}
            className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
          >
            <Trash2 className="w-4 h-4 text-red-500" />
          </motion.button>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {streak > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex items-center gap-1 px-3 py-1 bg-orange-50 dark:bg-orange-900/20 rounded-full"
              >
                <Flame className="w-4 h-4 text-orange-500" />
                <span className="text-sm font-semibold text-orange-600 dark:text-orange-400">
                  {streak} day{streak !== 1 ? 's' : ''}
                </span>
              </motion.div>
            )}
            <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
              {habit.frequency}
            </span>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onToggle}
            className="relative"
          >
            {completed ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1, rotate: 360 }}
                transition={{ type: 'spring', stiffness: 200 }}
              >
                <CheckCircle2
                  className="w-10 h-10"
                  style={{ color: habit.color }}
                />
              </motion.div>
            ) : (
              <Circle className="w-10 h-10 text-gray-300 dark:text-gray-600 hover:text-gray-400 dark:hover:text-gray-500 transition-colors" />
            )}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
