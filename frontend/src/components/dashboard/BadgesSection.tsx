import { motion } from 'framer-motion';
import { useBadges, BADGE_DEFINITIONS } from '../../hooks/useBadges';
import { Lock } from 'lucide-react';

export function BadgesSection() {
  const { badges } = useBadges();

  const earnedBadgeTypes = new Set(badges.map(b => b.badge_type));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="backdrop-blur-xl bg-white/60 dark:bg-gray-900/60 rounded-2xl p-6 border border-white/30 dark:border-gray-700/30 shadow-lg"
    >
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          Achievements
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          {badges.length} of {BADGE_DEFINITIONS.length} badges earned
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {BADGE_DEFINITIONS.map((badge, index) => {
          const earned = earnedBadgeTypes.has(badge.type);
          const IconComponent = badge.icon;

          return (
            <motion.div
              key={badge.type}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: earned ? 1.05 : 1.02, y: -5 }}
              className={`relative p-4 rounded-xl border-2 transition-all ${
                earned
                  ? 'bg-gradient-to-br from-white/80 to-gray-50/80 dark:from-gray-800/80 dark:to-gray-900/80 border-gray-200 dark:border-gray-700 shadow-lg'
                  : 'bg-gray-100/50 dark:bg-gray-800/30 border-gray-300/50 dark:border-gray-700/50'
              }`}
            >
              {!earned && (
                <div className="absolute inset-0 bg-gray-900/20 dark:bg-gray-900/50 backdrop-blur-[2px] rounded-xl flex items-center justify-center">
                  <Lock className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                </div>
              )}

              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${
                  earned ? 'shadow-lg' : 'opacity-50'
                }`}
                style={{
                  backgroundColor: earned ? `${badge.color}20` : '#E5E7EB',
                }}
              >
                <IconComponent
                  className="w-6 h-6"
                  style={{ color: earned ? badge.color : '#9CA3AF' }}
                />
              </div>

              <h4
                className={`font-semibold text-sm mb-1 ${
                  earned
                    ? 'text-gray-900 dark:text-white'
                    : 'text-gray-500 dark:text-gray-400'
                }`}
              >
                {badge.name}
              </h4>
              <p
                className={`text-xs ${
                  earned
                    ? 'text-gray-600 dark:text-gray-400'
                    : 'text-gray-400 dark:text-gray-500'
                }`}
              >
                {badge.description}
              </p>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
