import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Trash2, ChevronDown, Calendar, X } from 'lucide-react';
import { cn, formatCurrency, formatDate, categories } from '@/utils/helpers';
import { useRefresh } from '@/context/RefreshContext';
import * as LucideIcons from 'lucide-react';

interface Transaction {
  _id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  icon?: string;
  merchant?: string;
  note?: string;
  date: string;
  paymentMode: string;
  isSplit: boolean;
}

const typeFilters = ['all', 'income', 'expense'];

export default function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const { refreshKey } = useRefresh();

  useEffect(() => {
    fetchTransactions();
  }, [refreshKey]);

  const fetchTransactions = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await fetch('/api/transactions', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setTransactions(data);
      }
    } catch (error) {
      console.error('Failed to fetch:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteTransaction = async (id: string) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await fetch(`/api/transactions/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setTransactions(transactions.filter((t) => t._id !== id));
      }
    } catch (error) {
      console.error('Failed to delete:', error);
    }
  };

  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch =
      t.merchant?.toLowerCase().includes(search.toLowerCase()) ||
      t.category.toLowerCase().includes(search.toLowerCase()) ||
      t.note?.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === 'all' || t.type === typeFilter;
    const matchesCategory = categoryFilter === 'all' || t.category === categoryFilter;
    return matchesSearch && matchesType && matchesCategory;
  });

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-12 bg-slate-800/50 rounded-xl animate-pulse" />
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-20 bg-slate-800/50 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold mb-1">Transactions</h1>
        <p className="text-slate-400">All your income and expenses</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search transactions..."
            className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl focus:outline-none focus:border-primary-500 transition-colors"
          />
        </div>

        <div className="flex gap-2">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl focus:outline-none focus:border-primary-500 transition-colors"
          >
            {typeFilters.map((t) => (
              <option key={t} value={t} className="bg-slate-900">
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </option>
            ))}
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl focus:outline-none focus:border-primary-500 transition-colors"
          >
            <option value="all" className="bg-slate-900">All Categories</option>
            {categories.map((c) => (
              <option key={c.name} value={c.name} className="bg-slate-900">
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="space-y-3"
      >
        <AnimatePresence>
          {filteredTransactions.map((transaction, index) => {
            const IconComponent = (LucideIcons as any)[transaction.icon || 'CreditCard'] || LucideIcons.CreditCard;
            const isExpanded = expandedId === transaction._id;

            return (
              <motion.div
                key={transaction._id}
                layoutId={transaction._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ delay: index * 0.05 }}
                className={cn(
                  'bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden transition-all cursor-pointer',
                  isExpanded && 'ring-2 ring-primary-500/50'
                )}
                onClick={() => setExpandedId(isExpanded ? null : transaction._id)}
              >
                <div className="flex items-center gap-4 p-4">
                  <div
                    className={cn(
                      'w-12 h-12 rounded-xl flex items-center justify-center',
                      transaction.type === 'income'
                        ? 'bg-green-500/20'
                        : 'bg-red-500/20'
                    )}
                  >
                    <IconComponent
                      className={cn(
                        'w-6 h-6',
                        transaction.type === 'income' ? 'text-green-400' : 'text-red-400'
                      )}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">
                      {transaction.merchant || transaction.category}
                    </p>
                    <p className="text-sm text-slate-400 flex items-center gap-2">
                      <Calendar className="w-3 h-3" />
                      {formatDate(transaction.date)}
                      {transaction.isSplit && (
                        <span className="px-1.5 py-0.5 bg-primary-500/20 text-primary-400 rounded text-xs">
                          Split
                        </span>
                      )}
                    </p>
                  </div>

                  <div className="text-right">
                    <p
                      className={cn(
                        'font-bold text-lg',
                        transaction.type === 'income' ? 'text-green-400' : 'text-red-400'
                      )}
                    >
                      {transaction.type === 'income' ? '+' : '-'}
                      {formatCurrency(transaction.amount)}
                    </p>
                    <p className="text-xs text-slate-500">{transaction.paymentMode}</p>
                  </div>

                  <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="w-5 h-5 text-slate-400" />
                  </motion.div>
                </div>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="border-t border-white/10"
                    >
                      <div className="p-4 space-y-3">
                        {transaction.note && (
                          <div>
                            <p className="text-xs text-slate-500 mb-1">Note</p>
                            <p className="text-sm">{transaction.note}</p>
                          </div>
                        )}
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-slate-500">Category</span>
                          <span className="text-sm">{transaction.category}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-slate-500">Payment Mode</span>
                          <span className="text-sm">{transaction.paymentMode}</span>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteTransaction(transaction._id);
                          }}
                          className="w-full mt-2 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors flex items-center justify-center gap-2"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete Transaction
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {filteredTransactions.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            <p>No transactions found</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
