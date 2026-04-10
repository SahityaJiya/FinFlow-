import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, History, Plus, Users, Menu, X, Wallet, Search, Settings, LogOut } from 'lucide-react';
import { cn, formatCurrency } from '@/utils/helpers';
import { useAuth } from '@/context/AuthContext';
import AddTransactionModal from '@/components/transactions/AddTransactionModal';

const navItems = [
  { path: '/dashboard', label: 'Home', icon: Home },
  { path: '/transactions', label: 'History', icon: History },
  { path: '/groups', label: 'Groups', icon: Users },
  { path: '/profile', label: 'Profile', icon: Settings },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const dailyBudget = user?.dailySafeSpend || 1500;

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
          isScrolled
            ? 'glass-strong py-2 shadow-2xl'
            : 'bg-transparent py-4'
        )}
      >
        <div className="container mx-auto px-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <motion.div
              animate={{ rotate: isScrolled ? 0 : 360 }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center shadow-lg"
            >
              <Wallet className="w-5 h-5 text-white" />
            </motion.div>
            <span className={cn(
              'font-bold text-xl transition-all duration-300',
              isScrolled ? 'text-white' : 'gradient-text'
            )}>
              FinFlow
            </span>
          </Link>

          {isAuthenticated && (
            <>
              <div className="hidden md:flex items-center gap-6">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={cn(
                        'relative px-3 py-2 rounded-lg transition-all duration-300',
                        isActive ? 'text-primary-400' : 'text-slate-400 hover:text-white'
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4" />
                        <span className="text-sm font-medium">{item.label}</span>
                      </div>
                      {isActive && (
                        <motion.div
                          layoutId="activeNav"
                          className="absolute inset-0 bg-primary-500/20 rounded-lg -z-10"
                          transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                    </Link>
                  );
                })}
              </div>

              <div className="flex items-center gap-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/20 border border-green-500/30"
                >
                  <span className="text-xs text-green-400 font-medium">Daily Safe:</span>
                  <span className="text-sm font-bold text-green-400">
                    {formatCurrency(dailyBudget)}
                  </span>
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                </motion.div>

                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                  {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              </div>
            </>
          )}

          {!isAuthenticated && (
            <div className="flex items-center gap-3">
              <Link to="/" className="text-sm text-slate-400 hover:text-white transition-colors">
                Login
              </Link>
              <Link to="/" className="btn-primary text-sm py-2 px-4">
                Get Started
              </Link>
            </div>
          )}
        </div>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden glass-strong mt-2 mx-4 rounded-2xl overflow-hidden"
            >
              <div className="p-4 space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        'flex items-center gap-3 p-3 rounded-xl transition-all',
                        isActive
                          ? 'bg-primary-500/20 text-primary-400'
                          : 'text-slate-400 hover:bg-white/5'
                      )}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  );
                })}
                <button
                  onClick={() => { logout(); setIsMobileMenuOpen(false); }}
                  className="flex items-center gap-3 p-3 rounded-xl text-red-400 hover:bg-red-500/10 w-full"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      <AddTransactionModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
    </>
  );
}

export function FloatingActionButton({ onClick }: { onClick: () => void }) {
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className="fixed bottom-24 right-6 w-14 h-14 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 shadow-lg shadow-primary-500/40 flex items-center justify-center z-40"
    >
      <Plus className="w-6 h-6 text-white" />
    </motion.button>
  );
}

export function MobileNav() {
  const location = useLocation();

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 z-50 glass-strong md:hidden"
    >
      <div className="flex items-center justify-around py-3 px-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex flex-col items-center gap-1 p-2 rounded-xl transition-all',
                isActive ? 'text-primary-400' : 'text-slate-500'
              )}
            >
              <div className="relative">
                <Icon className="w-5 h-5" />
                {isActive && (
                  <motion.div
                    layoutId="mobileNavIndicator"
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary-400"
                  />
                )}
              </div>
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </motion.nav>
  );
}
