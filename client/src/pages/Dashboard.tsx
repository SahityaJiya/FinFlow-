import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import DashboardStats from '@/components/dashboard/DashboardStats';

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold">
            Welcome back, <span className="gradient-text">{user?.name?.split(' ')[0] || 'User'}</span>! 👋
          </h1>
          <p className="text-slate-400 mt-1">Here's your financial overview</p>
        </div>
        <div className="hidden md:block">
          <div className="glass rounded-2xl px-4 py-2 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-white font-bold">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div>
              <p className="font-medium text-sm">{user?.name}</p>
              <p className="text-xs text-slate-400">{user?.email}</p>
            </div>
          </div>
        </div>
      </motion.div>

      <DashboardStats />
    </div>
  );
}
