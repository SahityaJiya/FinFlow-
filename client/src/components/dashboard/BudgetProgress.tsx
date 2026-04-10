import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Target, AlertTriangle, CheckCircle } from 'lucide-react';
import { cn, formatCurrency } from '@/utils/helpers';
import { useAuth } from '@/context/AuthContext';

interface BudgetProgressProps {
  expenses: number;
}

export default function BudgetProgress({ expenses }: BudgetProgressProps) {
  const { user } = useAuth();
  const monthlyLimit = user?.monthlyLimit || 50000;
  const [animatedProgress, setAnimatedProgress] = useState(0);

  useEffect(() => {
    const progress = Math.min((expenses / monthlyLimit) * 100, 100);
    const timer = setTimeout(() => setAnimatedProgress(progress), 500);
    return () => clearTimeout(timer);
  }, [expenses, monthlyLimit]);

  const remaining = monthlyLimit - expenses;
  const isHealthy = animatedProgress < 70;
  const isWarning = animatedProgress >= 70 && animatedProgress < 90;
  const isDanger = animatedProgress >= 90;

  const statusColor = isHealthy ? 'text-green-400' : isWarning ? 'text-yellow-400' : 'text-red-400';
  const progressColor = isHealthy
    ? 'from-green-500 to-emerald-500'
    : isWarning
    ? 'from-yellow-500 to-orange-500'
    : 'from-red-500 to-pink-500';

  const statusIcon = isHealthy ? CheckCircle : isWarning ? Target : AlertTriangle;
  const statusText = isHealthy ? 'On Track' : isWarning ? 'Careful!' : 'Over Budget!';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-white/10 h-full"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold">Monthly Budget</h3>
          <p className="text-sm text-slate-400">Track your spending limit</p>
        </div>
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className={cn('p-2 rounded-full', isDanger ? 'bg-red-500/20' : isWarning ? 'bg-yellow-500/20' : 'bg-green-500/20')}
        >
          <statusIcon className={cn('w-5 h-5', statusColor)} />
        </motion.div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between">
          <span className="text-slate-400">Spent</span>
          <span className="font-medium">{formatCurrency(expenses)}</span>
        </div>

        <div className="relative h-4 bg-slate-700 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${animatedProgress}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className={cn('absolute inset-y-0 left-0 rounded-full bg-gradient-to-r', progressColor)}
          />
          {isDanger && (
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="absolute inset-y-0 left-0 rounded-full bg-red-500/50"
            />
          )}
        </div>

        <div className="flex justify-between items-center">
          <span className="text-slate-400">Remaining</span>
          <span className={cn('font-bold text-lg', statusColor)}>
            {formatCurrency(Math.max(remaining, 0))}
          </span>
        </div>

        <div className="pt-4 border-t border-white/10">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-400">Budget Limit</span>
            <span className="font-medium">{formatCurrency(monthlyLimit)}</span>
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-sm text-slate-400">Daily Safe</span>
            <span className="font-medium">{formatCurrency(remaining / 30)}</span>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={cn(
            'mt-4 p-3 rounded-xl text-center',
            isDanger ? 'bg-red-500/10 border border-red-500/20' : isWarning ? 'bg-yellow-500/10 border border-yellow-500/20' : 'bg-green-500/10 border border-green-500/20'
          )}
        >
          <p className={cn('font-semibold', statusColor)}>{statusText}</p>
          <p className="text-xs text-slate-400 mt-1">
            {isDanger
              ? "You've exceeded your budget limit!"
              : isWarning
              ? "You're approaching your budget limit"
              : "Great job! You're within budget"}
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}
