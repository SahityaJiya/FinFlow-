import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Users, Search, Check } from 'lucide-react';
import { cn } from '@/utils/helpers';

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (group: any) => void;
}

const groupTypes = [
  { id: 'roommates', label: 'Roommates', icon: '🏠' },
  { id: 'trip', label: 'Trip', icon: '✈️' },
  { id: 'couple', label: 'Couple', icon: '💑' },
  { id: 'custom', label: 'Custom', icon: '👥' },
];

export default function CreateGroupModal({ isOpen, onClose, onCreated }: CreateGroupModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('custom');
  const [members, setMembers] = useState<Array<{ id: string; name: string; email: string }>>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isCreating, setIsCreating] = useState(false);

  const searchUsers = async (query: string) => {
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`/api/users/search?q=${query}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setSearchResults(data);
      }
    } catch (error) {
      console.error('Search failed:', error);
    }
  };

  const addMember = (user: any) => {
    if (!members.find((m) => m.id === user._id)) {
      setMembers([...members, { id: user._id, name: user.name, email: user.email }]);
    }
    setSearchQuery('');
    setSearchResults([]);
  };

  const removeMember = (id: string) => {
    setMembers(members.filter((m) => m.id !== id));
  };

  const handleCreate = async () => {
    const token = localStorage.getItem('token');
    if (!token || !name) return;

    setIsCreating(true);

    try {
      const res = await fetch('/api/groups', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          description,
          type,
          members: members.map((m) => ({ user: m.id, name: m.name, email: m.email })),
        }),
      });

      if (res.ok) {
        const group = await res.json();
        onCreated(group);
        resetForm();
      }
    } catch (error) {
      console.error('Failed to create group:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const resetForm = () => {
    setName('');
    setDescription('');
    setType('custom');
    setMembers([]);
    setSearchQuery('');
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="w-full max-w-lg bg-slate-900 rounded-2xl overflow-hidden shadow-2xl"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Users className="w-6 h-6 text-primary-400" />
                  <h2 className="text-xl font-bold">Create Group</h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm text-slate-400 mb-2 block">Group Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Goa Trip 2024"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-primary-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="text-sm text-slate-400 mb-2 block">Description (optional)</label>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="What's this group for?"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-primary-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="text-sm text-slate-400 mb-2 block">Group Type</label>
                  <div className="grid grid-cols-4 gap-2">
                    {groupTypes.map((gt) => (
                      <button
                        key={gt.id}
                        onClick={() => setType(gt.id)}
                        className={cn(
                          'p-3 rounded-xl border transition-all flex flex-col items-center gap-1',
                          type === gt.id
                            ? 'bg-primary-500/20 border-primary-500/30 text-primary-400'
                            : 'bg-white/5 border-transparent text-slate-400 hover:bg-white/10'
                        )}
                      >
                        <span className="text-xl">{gt.icon}</span>
                        <span className="text-xs">{gt.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm text-slate-400 mb-2 block">Add Members</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        searchUsers(e.target.value);
                      }}
                      placeholder="Search by name or email"
                      className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-primary-500 transition-colors"
                    />
                    {searchResults.length > 0 && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-slate-800 rounded-xl border border-white/10 overflow-hidden z-10">
                        {searchResults.map((user) => (
                          <button
                            key={user._id}
                            onClick={() => addMember(user)}
                            className="w-full p-3 flex items-center gap-3 hover:bg-white/5 transition-colors text-left"
                          >
                            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-sm">
                              {user.name.charAt(0)}
                            </div>
                            <div>
                              <p className="text-sm font-medium">{user.name}</p>
                              <p className="text-xs text-slate-400">{user.email}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {members.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {members.map((member) => (
                        <div
                          key={member.id}
                          className="flex items-center gap-2 px-3 py-1.5 bg-primary-500/20 rounded-full"
                        >
                          <span className="text-sm">{member.name}</span>
                          <button
                            onClick={() => removeMember(member.id)}
                            className="w-4 h-4 rounded-full bg-primary-500/30 flex items-center justify-center"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <motion.button
                onClick={handleCreate}
                disabled={!name || isCreating}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full mt-6 py-4 bg-gradient-to-r from-primary-500 to-purple-600 rounded-xl font-semibold disabled:opacity-50"
              >
                {isCreating ? 'Creating...' : 'Create Group'}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
