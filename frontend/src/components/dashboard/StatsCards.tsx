import { motion } from 'framer-motion';
import { TrendingUp, Target, Award, Flame } from 'lucide-react';
import { useStats } from '../../hooks/useStats';

export function StatsCards() {
  const stats = useStats();

  const cards = [
    {
      title: 'Current Streak',
      value: stats.current_streak,
      suffix: 'days',
      icon: Flame,
      gradient: 'from-orange-500 to-red-500',
      bgColor: 'from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20',
    },
    {
      title: 'Active Habits',
      value: stats.active_habits,
      suffix: 'habits',
      icon: Target,
      gradient: 'from-blue-500 to-cyan-500',
      bgColor: 'from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20',
    },
    {
      title: 'Total Completions',
      value: stats.total_completions,
      suffix: 'tasks',
      icon: TrendingUp,
      gradient: 'from-green-500 to-emerald-500',
      bgColor: 'from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20',
    },
    {
      title: 'Longest Streak',
      value: stats.longest_streak,
      suffix: 'days',
      icon: Award,
      gradient: 'from-purple-500 to-pink-500',
      bgColor: 'from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ scale: 1.05, y: -5 }}
          className="relative overflow-hidden"
        >
          <div className={`absolute inset-0 bg-gradient-to-br ${card.bgColor} opacity-50`} />
          <div className="backdrop-blur-xl bg-white/60 dark:bg-gray-900/60 rounded-2xl p-6 border border-white/30 dark:border-gray-700/30 shadow-lg relative">
            <div className="flex items-start justify-between mb-4">
              <div
                className={`w-12 h-12 bg-gradient-to-br ${card.gradient} rounded-xl flex items-center justify-center shadow-lg`}
              >
                <card.icon className="w-6 h-6 text-white" />
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {card.title}
              </p>
              <div className="flex items-baseline gap-2">
                <motion.span
                  key={card.value}
                  initial={{ scale: 1.2, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-4xl font-bold text-gray-900 dark:text-white"
                >
                  {card.value}
                </motion.span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {card.suffix}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
