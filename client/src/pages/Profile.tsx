import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, LogOut, Download, Save, X, Check } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function Profile() {
  const { user, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [monthlyLimit, setMonthlyLimit] = useState(user?.monthlyLimit || 50000);
  const [dailySafeSpend, setDailySafeSpend] = useState(user?.dailySafeSpend || 1500);

  const handleSave = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, monthlyLimit, dailySafeSpend }),
      });
      if (res.ok) {
        setIsEditing(false);
        window.location.reload();
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const handleExport = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await fetch('/api/transactions', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const transactions = await res.json();
        const dataStr = JSON.stringify(transactions, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'finflow-export.json';
        link.click();
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold">Profile</h1>
        <p className="text-slate-400">Manage your account settings</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden"
      >
        <div className="relative h-32 bg-gradient-to-r from-primary-500 to-purple-600">
          <div className="absolute -bottom-12 left-6">
            <div className="w-24 h-24 rounded-2xl bg-slate-800 border-4 border-slate-900 flex items-center justify-center text-4xl font-bold">
              {user?.name?.charAt(0) || 'U'}
            </div>
          </div>
        </div>

        <div className="pt-16 pb-6 px-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">{user?.name}</h2>
              <p className="text-slate-400">{user?.email}</p>
            </div>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-primary-500/20 text-primary-400 rounded-lg hover:bg-primary-500/30 transition-colors"
              >
                Edit
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors flex items-center gap-1"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors flex items-center gap-1"
                >
                  <Check className="w-4 h-4" />
                  Save
                </button>
              </div>
            )}
          </div>

          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="text-sm text-slate-400 mb-2 block">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-primary-500 transition-colors"
                />
              </div>
              <div>
                <label className="text-sm text-slate-400 mb-2 block">Monthly Budget (₹)</label>
                <input
                  type="number"
                  value={monthlyLimit}
                  onChange={(e) => setMonthlyLimit(Number(e.target.value))}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-primary-500 transition-colors"
                />
              </div>
              <div>
                <label className="text-sm text-slate-400 mb-2 block">Daily Safe Spend (₹)</label>
                <input
                  type="number"
                  value={dailySafeSpend}
                  onChange={(e) => setDailySafeSpend(Number(e.target.value))}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-primary-500 transition-colors"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                <span className="text-slate-400">Monthly Budget</span>
                <span className="font-semibold">₹{user?.monthlyLimit?.toLocaleString() || 50000}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                <span className="text-slate-400">Daily Safe Spend</span>
                <span className="font-semibold">₹{user?.dailySafeSpend?.toLocaleString() || 1500}</span>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-white/10 p-6"
      >
        <h3 className="font-semibold mb-4">Quick Actions</h3>
        <div className="space-y-2">
          <button
            onClick={handleExport}
            className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors text-left"
          >
            <Download className="w-5 h-5 text-slate-400" />
            <span>Export Data (JSON)</span>
          </button>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-red-500/10 transition-colors text-left text-red-400"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
