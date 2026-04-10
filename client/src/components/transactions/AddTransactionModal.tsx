import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Receipt, Smartphone, Mic, Check, Users } from 'lucide-react';
import { cn, categories, categoryIcons } from '@/utils/helpers';
import { parseBankSMS, ParsedSMS } from '@/utils/smsParser';
import SMSParser from '@/components/sms/SMSParser';
import SplitTransaction from './SplitTransaction';
import { useRefresh } from '@/context/RefreshContext';
import * as LucideIcons from 'lucide-react';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabType = 'manual' | 'sms' | 'split';

export default function AddTransactionModal({ isOpen, onClose }: AddTransactionModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('manual');
  const [type, setType] = useState<'expense' | 'income'>('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [merchant, setMerchant] = useState('');
  const [note, setNote] = useState('');
  const [paymentMode, setPaymentMode] = useState('UPI');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [isSuccess, setIsSuccess] = useState(false);
  const [parsedSMS, setParsedSMS] = useState<ParsedSMS | null>(null);
  const { triggerRefresh } = useRefresh();

  useEffect(() => {
    if (parsedSMS && parsedSMS.amount) {
      setAmount(parsedSMS.amount.toString());
      if (parsedSMS.merchant) setMerchant(parsedSMS.merchant);
      setType(parsedSMS.type === 'credit' ? 'income' : 'expense');
    }
  }, [parsedSMS]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const token = localStorage.getItem('token');
    if (!token) return;

    const selectedCategory = category || 'Other';
    const IconComponent = (LucideIcons as any)[categoryIcons[selectedCategory]] || LucideIcons.CreditCard;

    const transaction = {
      type,
      amount: parseFloat(amount),
      category: selectedCategory,
      icon: categoryIcons[selectedCategory],
      merchant,
      note,
      paymentMode,
      date: new Date(date),
    };

    try {
      const res = await fetch('/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(transaction),
      });

      if (res.ok) {
        setIsSuccess(true);
        triggerRefresh();
        setTimeout(() => {
          setIsSuccess(false);
          onClose();
          resetForm();
        }, 1500);
      }
    } catch (error) {
      console.error('Failed to add transaction:', error);
    }
  };

  const resetForm = () => {
    setAmount('');
    setCategory('');
    setMerchant('');
    setNote('');
    setPaymentMode('UPI');
    setDate(new Date().toISOString().split('T')[0]);
    setType('expense');
    setParsedSMS(null);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="w-full max-w-lg bg-slate-900 rounded-t-3xl md:rounded-2xl overflow-hidden shadow-2xl"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold gradient-text">Add Transaction</h2>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex gap-2 mb-6">
                {[
                  { key: 'manual', icon: Receipt, label: 'Manual' },
                  { key: 'sms', icon: Smartphone, label: 'SMS' },
                  { key: 'split', icon: Users, label: 'Split' },
                ].map((tab) => (
                  <motion.button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key as TabType)}
                    className={cn(
                      'flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-all',
                      activeTab === tab.key
                        ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                        : 'bg-white/5 text-slate-400 border border-transparent hover:bg-white/10'
                    )}
                  >
                    <tab.icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </motion.button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                {activeTab === 'manual' && (
                  <motion.form
                    key="manual"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    onSubmit={handleSubmit}
                    className="space-y-4"
                  >
                    <div className="flex gap-2">
                      {['expense', 'income'].map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setType(t as 'expense' | 'income')}
                          className={cn(
                            'flex-1 py-2 rounded-lg font-medium capitalize transition-all',
                            type === t
                              ? t === 'expense'
                                ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                                : 'bg-green-500/20 text-green-400 border border-green-500/30'
                              : 'bg-white/5 text-slate-400'
                          )}
                        >
                          {t}
                        </button>
                      ))}
                    </div>

                    <div className="relative">
                      <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder=" "
                        className="w-full px-4 pt-6 pb-2 bg-white/5 border border-white/10 rounded-xl text-lg focus:outline-none focus:border-primary-500 transition-colors peer"
                        required
                      />
                      <label className="absolute left-4 top-4 text-slate-400 pointer-events-none transition-all duration-200 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-xs peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-xs">
                        Amount (₹)
                      </label>
                    </div>

                    <div>
                      <label className="text-sm text-slate-400 mb-2 block">Date</label>
                      <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-primary-500 transition-colors"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="relative">
                        <input
                          type="text"
                          value={merchant}
                          onChange={(e) => setMerchant(e.target.value)}
                          placeholder=" "
                          className="w-full px-4 pt-6 pb-2 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-primary-500 transition-colors peer"
                        />
                        <label className="absolute left-4 top-4 text-slate-400 pointer-events-none transition-all duration-200 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-xs peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-xs">
                          Merchant/Source
                        </label>
                      </div>

                      <select
                        value={paymentMode}
                        onChange={(e) => setPaymentMode(e.target.value)}
                        className="px-4 py-3 bg-slate-800 border border-white/10 rounded-xl focus:outline-none focus:border-primary-500 transition-colors text-white appearance-none cursor-pointer"
                        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2394a3b8'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', backgroundSize: '16px' }}
                      >
                        <option value="UPI" className="bg-slate-800">UPI</option>
                        <option value="Card" className="bg-slate-800">Card</option>
                        <option value="Cash" className="bg-slate-800">Cash</option>
                        <option value="Net Banking" className="bg-slate-800">Net Banking</option>
                      </select>
                    </div>

                    <div>
                      <p className="text-sm text-slate-400 mb-2">Category</p>
                      <div className="flex flex-wrap gap-2">
                        {categories.slice(0, 8).map((cat) => {
                          const IconComponent = (LucideIcons as any)[categoryIcons[cat.name]];
                          return (
                            <button
                              key={cat.name}
                              type="button"
                              onClick={() => setCategory(cat.name)}
                              className={cn(
                                'flex items-center gap-2 px-3 py-2 rounded-lg transition-all',
                                category === cat.name
                                  ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                                  : 'bg-white/5 text-slate-400 hover:bg-white/10'
                              )}
                            >
                              {IconComponent && <IconComponent className="w-4 h-4" />}
                              <span className="text-sm">{cat.name}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="relative">
                      <textarea
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder=" "
                        className="w-full px-4 pt-6 pb-2 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-primary-500 transition-colors peer resize-none h-20"
                      />
                      <label className="absolute left-4 top-4 text-slate-400 pointer-events-none transition-all duration-200 peer-placeholder-shown:top-4 peer-focus:top-2 peer-focus:text-xs peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-xs">
                        Note (optional)
                      </label>
                    </div>

                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={cn(
                        'w-full py-4 rounded-xl font-semibold text-lg transition-all flex items-center justify-center gap-2',
                        type === 'expense'
                          ? 'bg-gradient-to-r from-red-500 to-orange-500'
                          : 'bg-gradient-to-r from-green-500 to-emerald-500'
                      )}
                    >
                      {isSuccess ? (
                        <>
                          <Check className="w-5 h-5" />
                          Added Successfully!
                        </>
                      ) : (
                        <>Add {type === 'expense' ? 'Expense' : 'Income'}</>
                      )}
                    </motion.button>
                  </motion.form>
                )}

                {activeTab === 'sms' && (
                  <motion.div
                    key="sms"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <SMSParser onParsed={setParsedSMS} />
                    
                    {parsedSMS && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 p-4 bg-green-500/10 border border-green-500/20 rounded-xl"
                      >
                        <p className="text-green-400 text-sm mb-2">Parsed Data:</p>
                        {parsedSMS.amount && (
                          <p className="text-white">Amount: ₹{parsedSMS.amount}</p>
                        )}
                        {parsedSMS.merchant && (
                          <p className="text-white">Merchant: {parsedSMS.merchant}</p>
                        )}
                        <p className="text-slate-400 text-sm mt-2">
                          Switch to Manual tab to edit and save
                        </p>
                      </motion.div>
                    )}
                  </motion.div>
                )}

                {activeTab === 'split' && (
                  <motion.div
                    key="split"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <SplitTransaction onSuccess={() => { onClose(); }} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
