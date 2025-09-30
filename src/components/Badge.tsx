'use client';

import { motion } from 'framer-motion';
import { TrendingUp, Sparkles } from 'lucide-react';

export type BadgeType = 'new' | 'trending';

interface BadgeProps {
  type: BadgeType;
  animated?: boolean;
}

const badgeConfig = {
  new: {
    label: 'NEW',
    icon: Sparkles,
    bgColor: 'bg-blue-500',
    textColor: 'text-white',
    description: '新着',
  },
  trending: {
    label: '急上昇',
    icon: TrendingUp,
    bgColor: 'bg-red-500',
    textColor: 'text-white',
    description: '人気急上昇中',
  },
};

export default function Badge({ type, animated = true }: BadgeProps) {
  const config = badgeConfig[type];
  const Icon = config.icon;

  if (!animated) {
    return (
      <span
        className={`${config.bgColor} ${config.textColor} text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1`}
      >
        <Icon className="w-3 h-3" />
        {config.label}
      </span>
    );
  }

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="inline-block"
    >
      <motion.span
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
        className={`${config.bgColor} ${config.textColor} text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1 shadow-md`}
      >
        <Icon className="w-3 h-3" />
        {config.label}
      </motion.span>
    </motion.span>
  );
}