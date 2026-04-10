import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Wallet, PieChart, Users, Shield, Zap, TrendingUp } from 'lucide-react';
import Lottie from 'lottie-react';
import heroAnimation from '@/assets/hero-animation.json';

const features = [
  {
    icon: Wallet,
    title: 'Smart Tracking',
    description: 'Track expenses effortlessly with SMS parsing and voice input',
  },
  {
    icon: Users,
    title: 'Group Splits',
    description: 'Split bills with friends and calculate debts automatically',
  },
  {
    icon: PieChart,
    title: 'Visual Insights',
    description: 'Beautiful charts and graphs to understand your spending',
  },
  {
    icon: Shield,
    title: 'Secure',
    description: 'Bank-level security for all your financial data',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Real-time updates and instant calculations',
  },
  {
    icon: TrendingUp,
    title: 'Budget Goals',
    description: 'Set budgets and track progress with smart alerts',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function Landing() {
  return (
    <div className="min-h-screen bg-slate-950 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-purple-500/10" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />

      <nav className="relative z-10 flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center shadow-lg">
            <Wallet className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl gradient-text">FinFlow</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-4"
        >
          <Link
            to="/login"
            className="text-slate-400 hover:text-white transition-colors"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="btn-primary text-sm py-2 px-4"
          >
            Get Started
          </Link>
        </motion.div>
      </nav>

      <section className="relative z-10 px-6 py-20 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/20 border border-primary-500/30 mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-sm text-primary-400">Introducing FinFlow 2.0</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6"
            >
              <span className="gradient-text">Smart Expense</span>
              <br />
              <span className="text-white">Tracking Made</span>
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-purple-400">
                Beautiful
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg text-slate-400 mb-8 max-w-lg"
            >
              Track expenses, split bills with friends, and visualize your finances with 
              stunning animations. The expense tracker you've been waiting for.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap gap-4"
            >
              <Link
                to="/register"
                className="btn-primary flex items-center gap-2 text-lg px-8 py-4"
              >
                Start Free
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/login"
                className="px-8 py-4 rounded-xl font-semibold text-slate-300 border border-white/20 hover:bg-white/5 transition-all flex items-center gap-2"
              >
                Demo
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative"
          >
            <motion.div
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-purple-600 rounded-3xl blur-2xl opacity-30" />
              <div className="relative glass-strong rounded-3xl p-8">
                <div className="w-full h-80 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl mb-4 animate-float">💰</div>
                    <div className="space-y-2">
                      <p className="text-slate-400">Total Balance</p>
                      <p className="text-4xl font-bold gradient-text">₹1,25,000</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="relative z-10 px-6 py-20 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">
            Everything You Need to{' '}
            <span className="gradient-text">Manage Money</span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Powerful features wrapped in a beautiful, intuitive interface
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                whileHover={{ scale: 1.02, y: -5 }}
                className="group glass rounded-2xl p-6 card-hover"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500/20 to-purple-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6 text-primary-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-slate-400 text-sm">{feature.description}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      <footer className="relative z-10 border-t border-white/10 py-8">
        <div className="max-w-7xl mx-auto px-6 text-center text-slate-500">
          <p>© 2024 FinFlow. Built for the modern Indian spender.</p>
        </div>
      </footer>
    </div>
  );
}
