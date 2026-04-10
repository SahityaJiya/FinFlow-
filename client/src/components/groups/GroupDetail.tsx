import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Users, DollarSign, Check, ArrowRight } from 'lucide-react';
import { cn, formatCurrency } from '@/utils/helpers';

interface GroupDetailProps {
  group: any;
  onBack: () => void;
}

interface Balance {
  id: string;
  name: string;
  owes: number;
  owed: number;
  net: number;
}

interface Settlement {
  from: string;
  to: string;
  amount: number;
}

export default function GroupDetail({ group, onBack }: GroupDetailProps) {
  const [balances, setBalances] = useState<Record<string, Balance>>({});
  const [settlements, setSettlements] = useState<Settlement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBalances();
  }, [group._id]);

  const fetchBalances = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await fetch(`/api/groups/${group._id}/balances`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setBalances(data.balances);
        setSettlements(data.settlements);
      }
    } catch (error) {
      console.error('Failed to fetch balances:', error);
    } finally {
      setLoading(false);
    }
  };

  const groupTypes: Record<string, { icon: string; color: string }> = {
    roommates: { icon: '🏠', color: 'from-blue-500 to-cyan-500' },
    trip: { icon: '✈️', color: 'from-green-500 to-emerald-500' },
    couple: { icon: '💑', color: 'from-pink-500 to-rose-500' },
    custom: { icon: '👥', color: 'from-purple-500 to-violet-500' },
  };

  const typeInfo = groupTypes[group.type] || groupTypes.custom;

  const getMemberName = (id: string) => {
    const member = group.members.find((m: any) => m.user?._id === id || m.user === id);
    return member?.user?.name || member?.name || 'Unknown';
  };

  return (
    <div className="space-y-6">
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={onBack}
        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Groups
      </motion.button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn('h-32 rounded-2xl bg-gradient-to-br', typeInfo.color)}
      >
        <div className="h-full flex items-end p-6">
          <div className="flex items-center gap-4">
            <span className="text-5xl">{typeInfo.icon}</span>
            <div>
              <h1 className="text-3xl font-bold">{group.name}</h1>
              <p className="text-white/70 capitalize">{group.type}</p>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-white/10"
        >
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-primary-400" />
            <h3 className="font-semibold">Members</h3>
          </div>

          <div className="space-y-3">
            {group.members.map((member: any) => {
              const balance = balances[member.user?._id || member.user];
              return (
                <div
                  key={member.user?._id || member.user}
                  className="flex items-center justify-between p-3 bg-white/5 rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center font-medium">
                      {member.user?.name?.charAt(0) || '?'}
                    </div>
                    <div>
                      <p className="font-medium">{member.user?.name || member.name}</p>
                      <p className="text-xs text-slate-400">{member.user?.email || member.email}</p>
                    </div>
                  </div>
                  {balance && (
                    <div className="text-right">
                      <p className={cn(
                        'font-semibold',
                        balance.net > 0 ? 'text-green-400' : balance.net < 0 ? 'text-red-400' : 'text-slate-400'
                      )}>
                        {balance.net > 0 ? '+' : ''}{formatCurrency(balance.net)}
                      </p>
                      <p className="text-xs text-slate-500">
                        {balance.net > 0 ? 'gets back' : balance.net < 0 ? 'owes' : 'settled'}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-white/10"
        >
          <div className="flex items-center gap-2 mb-4">
            <DollarSign className="w-5 h-5 text-green-400" />
            <h3 className="font-semibold">Settle Up</h3>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="h-16 bg-white/5 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : settlements.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
                <Check className="w-8 h-8 text-green-400" />
              </div>
              <p className="text-slate-400">All settled up!</p>
              <p className="text-sm text-slate-500 mt-1">No pending settlements</p>
            </div>
          ) : (
            <div className="space-y-3">
              <AnimatePresence>
                {settlements.map((settlement, index) => (
                  <motion.div
                    key={`${settlement.from}-${settlement.to}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-green-500/20"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center text-red-400 font-semibold">
                        {getMemberName(settlement.from).charAt(0)}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-slate-400">pays</span>
                        <ArrowRight className="w-4 h-4 text-slate-500" />
                      </div>
                      <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 font-semibold">
                        {getMemberName(settlement.to).charAt(0)}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-400">{formatCurrency(settlement.amount)}</p>
                      <button className="text-xs text-primary-400 hover:text-primary-300">
                        Mark as Paid
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
