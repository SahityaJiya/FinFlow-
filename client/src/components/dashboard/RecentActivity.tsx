import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { formatCurrency, formatDate } from '@/utils/helpers';
import { useRefresh } from '@/context/RefreshContext';

interface Transaction {
  _id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  merchant?: string;
  date: string;
}

export default function RecentActivity() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { refreshKey } = useRefresh();

  useEffect(() => {
    fetchRecentTransactions();
  }, [refreshKey]);

  const fetchRecentTransactions = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await fetch('/api/transactions?limit=10', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setTransactions(data);
      }
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    }
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % Math.max(transactions.length, 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + Math.max(transactions.length, 1)) % Math.max(transactions.length, 1));
  };

  if (transactions.length === 0) {
    return (
      <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
        <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
        <div className="flex items-center justify-center h-40 text-slate-500">
          <p>No transactions yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Recent Activity</h3>
        <div className="flex items-center gap-1 text-slate-400">
          <Clock className="w-4 h-4" />
          <span className="text-xs">Live</span>
        </div>
      </div>

      <div className="relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
            className={cn(
              'p-4 rounded-xl border',
              transactions[currentIndex]?.type === 'income'
                ? 'bg-green-500/10 border-green-500/20'
                : 'bg-red-500/10 border-red-500/20'
            )}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">
                  {transactions[currentIndex]?.merchant || transactions[currentIndex]?.category}
                </p>
                <p className="text-sm text-slate-400">
                  {formatDate(transactions[currentIndex]?.date)}
                </p>
              </div>
              <div className="text-right">
                <p className={cn(
                  'font-bold text-lg',
                  transactions[currentIndex]?.type === 'income' ? 'text-green-400' : 'text-red-400'
                )}>
                  {transactions[currentIndex]?.type === 'income' ? '+' : '-'}
                  {formatCurrency(transactions[currentIndex]?.amount || 0)}
                </p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {transactions.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-0 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-0 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}
      </div>

      <div className="flex justify-center gap-2 mt-4">
        {transactions.slice(0, 5).map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={cn(
              'w-2 h-2 rounded-full transition-all',
              i === currentIndex ? 'bg-primary-500 w-4' : 'bg-slate-600 hover:bg-slate-500'
            )}
          />
        ))}
      </div>
    </div>
  );
}

function cn(...classes: (string | boolean | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}
