import { motion } from 'framer-motion';
import { Lightbulb, ChevronRight } from 'lucide-react';

const financialTips = [
  {
    title: 'The 50/30/20 Rule',
    description: 'Allocate 50% of your income to needs, 30% to wants, and 20% to savings and debt repayment.',
    icon: '📊',
  },
  {
    title: 'Track Every Expense',
    description: 'Small purchases add up. Track every expense, even that ₹50 coffee, to understand your spending patterns.',
    icon: '🔍',
  },
  {
    title: 'Emergency Fund First',
    description: 'Build an emergency fund covering 3-6 months of expenses before investing in high-risk options.',
    icon: '🛡️',
  },
  {
    title: 'Automate Your Savings',
    description: 'Set up automatic transfers to savings immediately after payday. Pay yourself first!',
    icon: '⚡',
  },
  {
    title: 'Review Subscriptions',
    description: 'Audit your subscriptions monthly. Cancel unused services and save hundreds yearly.',
    icon: '💳',
  },
  {
    title: 'Use the 24-Hour Rule',
    description: 'Wait 24 hours before making non-essential purchases. Most impulse buys can be avoided.',
    icon: '⏰',
  },
];

export default function FinancialTip() {
  const todayTip = financialTips[new Date().getDate() % financialTips.length];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-gradient-to-br from-primary-500/10 to-purple-500/10 backdrop-blur-xl rounded-2xl p-6 border border-primary-500/20 h-full"
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 rounded-lg bg-primary-500/20">
          <Lightbulb className="w-5 h-5 text-primary-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">Financial Tip of the Day</h3>
          <p className="text-xs text-slate-400">Fresh wisdom every day</p>
        </div>
      </div>

      <motion.div
        key={todayTip.title}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <div className="flex items-start gap-3">
          <span className="text-4xl">{todayTip.icon}</span>
          <div>
            <h4 className="font-semibold text-lg">{todayTip.title}</h4>
            <p className="text-sm text-slate-400 mt-1">{todayTip.description}</p>
          </div>
        </div>
      </motion.div>

      <div className="mt-6 pt-4 border-t border-primary-500/20">
        <p className="text-xs text-slate-500">Tip changes daily. Check back tomorrow!</p>
      </div>
    </motion.div>
  );
}
