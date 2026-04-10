import { Outlet } from 'react-router-dom';
import Header, { MobileNav } from './Header';
import AddTransactionModal from '@/components/transactions/AddTransactionModal';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';

export default function Layout() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950">
      <Header />
      
      <main className="pt-20 pb-24 md:pb-24 px-4 container mx-auto max-w-6xl">
        <Outlet />
      </main>

      {/* Add Transaction Button - Desktop */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsAddModalOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 shadow-lg shadow-primary-500/40 flex items-center justify-center z-40 hover:shadow-primary-500/60 transition-shadow hidden md:flex"
      >
        <Plus className="w-6 h-6 text-white" />
      </motion.button>

      {/* Add Transaction Button - Mobile */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsAddModalOpen(true)}
        className="fixed bottom-24 right-6 w-14 h-14 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 shadow-lg shadow-primary-500/40 flex items-center justify-center z-40 md:hidden"
      >
        <Plus className="w-6 h-6 text-white" />
      </motion.button>

      <MobileNav />
      <AddTransactionModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
    </div>
  );
}
