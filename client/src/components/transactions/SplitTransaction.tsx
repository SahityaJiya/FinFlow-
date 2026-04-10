import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, X, Check } from 'lucide-react';
import { cn } from '@/utils/helpers';
import { useRefresh } from '@/context/RefreshContext';

interface Participant {
  id: string;
  name: string;
  amount: string;
  settled: boolean;
}

interface SplitTransactionProps {
  onSuccess: () => void;
}

export default function SplitTransaction({ onSuccess }: SplitTransactionProps) {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [splitType, setSplitType] = useState<'equal' | 'exact'>('equal');
  const [participants, setParticipants] = useState<Participant[]>([
    { id: '1', name: '', amount: '', settled: false },
    { id: '2', name: '', amount: '', settled: false },
  ]);
  const [includeMe, setIncludeMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const { triggerRefresh } = useRefresh();

  const addParticipant = () => {
    setParticipants([
      ...participants,
      { id: Date.now().toString(), name: '', amount: '', settled: false },
    ]);
  };

  const removeParticipant = (id: string) => {
    if (participants.length > 2) {
      setParticipants(participants.filter((p) => p.id !== id));
    }
  };

  const updateParticipant = (id: string, field: 'name' | 'amount', value: string) => {
    setParticipants(
      participants.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  const calculateEqualSplit = () => {
    const total = parseFloat(amount) || 0;
    const count = participants.filter((p) => p.name).length;
    return count > 0 ? (total / count).toFixed(2) : '0.00';
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const validParticipants = participants.filter((p) => p.name);
    if (validParticipants.length < 2) {
      alert('Please add at least 2 participants with names');
      return;
    }

    setIsSubmitting(true);

    const splitData = {
      type: 'expense',
      amount: parseFloat(amount),
      category: 'Other',
      merchant: description || 'Split Expense',
      isSplit: true,
      splitType,
      participants: validParticipants.map((p) => ({
        name: p.name,
        amount: splitType === 'exact' ? parseFloat(p.amount || '0') : parseFloat(calculateEqualSplit()),
        settled: false,
      })),
    };

    try {
      const res = await fetch('/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(splitData),
      });

      if (res.ok) {
        setSuccess(true);
        triggerRefresh();
        setTimeout(() => {
          onSuccess();
        }, 1500);
      } else {
        const error = await res.json();
        alert('Failed to create split: ' + (error.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Failed to create split:', error);
      alert('Failed to create split. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder=" "
          className="w-full px-4 pt-6 pb-2 bg-white/5 border border-white/10 rounded-xl text-lg focus:outline-none focus:border-primary-500 transition-colors peer"
        />
        <label className="absolute left-4 top-4 text-slate-400 pointer-events-none transition-all duration-200 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-xs peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-xs">
          Total Amount (₹)
        </label>
      </div>

      <div className="relative">
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder=" "
          className="w-full px-4 pt-6 pb-2 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-primary-500 transition-colors peer"
        />
        <label className="absolute left-4 top-4 text-slate-400 pointer-events-none transition-all duration-200 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-xs peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-xs">
          What's it for?
        </label>
      </div>

      <div className="flex gap-2">
        {['equal', 'exact'].map((type) => (
          <button
            key={type}
            onClick={() => setSplitType(type as 'equal' | 'exact')}
            className={cn(
              'flex-1 py-2 rounded-lg font-medium capitalize transition-all',
              splitType === type
                ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                : 'bg-white/5 text-slate-400'
            )}
          >
            {type === 'equal' ? 'Split Equally' : 'Split by Amount'}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-400">Participants</p>
          <label className="flex items-center gap-2 text-sm text-slate-400">
            <input
              type="checkbox"
              checked={includeMe}
              onChange={(e) => setIncludeMe(e.target.checked)}
              className="w-4 h-4 rounded bg-white/5 border-white/20"
            />
            Include Me
          </label>
        </div>

        {participants.map((participant, index) => (
          <motion.div
            key={participant.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-2"
          >
            <input
              type="text"
              value={participant.name}
              onChange={(e) => updateParticipant(participant.id, 'name', e.target.value)}
              placeholder={`Person ${index + 1}`}
              className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary-500 transition-colors"
            />
            {splitType === 'exact' && (
              <input
                type="number"
                value={participant.amount}
                onChange={(e) => updateParticipant(participant.id, 'amount', e.target.value)}
                placeholder="₹"
                className="w-24 px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary-500 transition-colors"
              />
            )}
            <button
              onClick={() => removeParticipant(participant.id)}
              className="p-2 rounded-lg hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}

        <button
          onClick={addParticipant}
          className="w-full py-2 border border-dashed border-white/20 rounded-lg text-slate-400 hover:text-primary-400 hover:border-primary-500/30 transition-colors flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Person
        </button>
      </div>

      {splitType === 'equal' && amount && (
        <div className="p-3 bg-primary-500/10 rounded-lg border border-primary-500/20">
          <p className="text-sm text-slate-400">Each person pays:</p>
          <p className="text-xl font-bold text-primary-400">
            ₹{calculateEqualSplit()}
          </p>
        </div>
      )}

      <div className="text-sm text-slate-400 text-center mb-2">
        {participants.filter((p) => p.name).length < 2
          ? `Add ${2 - participants.filter((p) => p.name).length} more participant(s)`
          : 'Ready to split!'}
      </div>

      <motion.button
        onClick={handleSubmit}
        disabled={isSubmitting || !amount || participants.filter((p) => p.name).length < 2}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          'w-full py-4 rounded-xl font-semibold text-lg transition-all flex items-center justify-center gap-2',
          success
            ? 'bg-green-500'
            : 'bg-gradient-to-r from-primary-500 to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed'
        )}
      >
        {success ? (
          <>
            <Check className="w-5 h-5" />
            Split Created!
          </>
        ) : isSubmitting ? (
          'Creating...'
        ) : (
          'Create Split'
        )}
      </motion.button>
    </div>
  );
}
