import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import { TrendingUp, TrendingDown, Wallet, Target, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { cn, formatCurrency } from '@/utils/helpers';
import SpendingChart from './SpendingChart';
import BudgetProgress from './BudgetProgress';
import RecentActivity from './RecentActivity';
import FinancialTip from './FinancialTip';
import { useRefresh } from '@/context/RefreshContext';

interface Stats {
  income: number;
  expenses: number;
  balance: number;
  byCategory: Record<string, number>;
  total: number;
}

export default function DashboardStats() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const { refreshKey } = useRefresh();

  useEffect(() => {
    fetchStats();
  }, [refreshKey]);

  const fetchStats = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await fetch('/api/transactions/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-32 bg-slate-800/50 rounded-2xl animate-pulse" />
        ))}
      </div>
    );
  }

  const statCards = [
    {
      label: 'Total Balance',
      value: stats?.balance || 0,
      icon: Wallet,
      gradient: 'from-primary-500 to-purple-600',
      trend: 'neutral',
    },
    {
      label: 'Monthly Income',
      value: stats?.income || 0,
      icon: TrendingUp,
      gradient: 'from-green-500 to-emerald-600',
      trend: 'up',
    },
    {
      label: 'Monthly Expenses',
      value: stats?.expenses || 0,
      icon: TrendingDown,
      gradient: 'from-red-500 to-orange-600',
      trend: 'down',
    },
    {
      label: 'Daily Safe Spend',
      value: (stats?.balance || 0) / 30,
      icon: Target,
      gradient: 'from-yellow-500 to-amber-600',
      trend: 'up',
    },
  ];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className={cn(
                'relative overflow-hidden rounded-2xl p-5 cursor-pointer',
                'bg-gradient-to-br shadow-lg',
                stat.gradient
              )}
            >
              <div className="absolute inset-0 bg-white/10" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <Icon className="w-6 h-6 text-white/80" />
                  {stat.trend === 'up' && <ArrowUpRight className="w-4 h-4 text-green-200" />}
                  {stat.trend === 'down' && <ArrowDownRight className="w-4 h-4 text-red-200" />}
                </div>
                <p className="text-sm text-white/70 mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-white">
                  <CountUp
                    end={stat.value}
                    duration={1.5}
                    separator=","
                    prefix="₹"
                    decimals={0}
                  />
                </p>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2"
        >
          <SpendingChart data={stats?.byCategory || {}} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <BudgetProgress expenses={stats?.expenses || 0} />
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <RecentActivity />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <FinancialTip />
        </motion.div>
      </div>
    </div>
  );
}
