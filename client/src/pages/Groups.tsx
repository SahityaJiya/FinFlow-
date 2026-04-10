import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Plus, ArrowRight, DollarSign, Settings, UserPlus } from 'lucide-react';
import { cn } from '@/utils/helpers';
import CreateGroupModal from '@/components/groups/CreateGroupModal';
import GroupDetail from '@/components/groups/GroupDetail';

interface Group {
  _id: string;
  name: string;
  description?: string;
  type: string;
  members: Array<{
    user: { _id: string; name: string; email: string; avatar?: string };
  }>;
}

export default function Groups() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await fetch('/api/groups', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setGroups(data);
      }
    } catch (error) {
      console.error('Failed to fetch groups:', error);
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

  if (selectedGroup) {
    return <GroupDetail group={selectedGroup} onBack={() => setSelectedGroup(null)} />;
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold">Groups</h1>
          <p className="text-slate-400">Split expenses with friends and family</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsCreateOpen(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Create Group
        </motion.button>
      </motion.div>

      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-48 bg-slate-800/50 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : groups.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-20"
        >
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-slate-800 flex items-center justify-center">
            <Users className="w-10 h-10 text-slate-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No Groups Yet</h3>
          <p className="text-slate-400 mb-6">Create your first group to start splitting expenses</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsCreateOpen(true)}
            className="btn-primary inline-flex items-center gap-2"
          >
            <UserPlus className="w-5 h-5" />
            Create Your First Group
          </motion.button>
        </motion.div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {groups.map((group, index) => {
              const typeInfo = groupTypes[group.type] || groupTypes.custom;
              return (
                <motion.div
                  key={group._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  onClick={() => setSelectedGroup(group)}
                  className="group cursor-pointer bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden"
                >
                  <div className={cn('h-24 bg-gradient-to-br', typeInfo.color, 'opacity-80')} />
                  <div className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-3xl">{typeInfo.icon}</span>
                      <div>
                        <h3 className="font-semibold group-hover:text-primary-400 transition-colors">
                          {group.name}
                        </h3>
                        <p className="text-xs text-slate-400 capitalize">{group.type}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex -space-x-2">
                        {group.members.slice(0, 3).map((member, i) => (
                          <div
                            key={i}
                            className="w-8 h-8 rounded-full bg-slate-700 border-2 border-slate-800 flex items-center justify-center text-xs font-medium"
                          >
                            {member.user?.name?.charAt(0) || '?'}
                          </div>
                        ))}
                        {group.members.length > 3 && (
                          <div className="w-8 h-8 rounded-full bg-slate-600 border-2 border-slate-800 flex items-center justify-center text-xs">
                            +{group.members.length - 3}
                          </div>
                        )}
                      </div>
                      <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-primary-400 group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      <CreateGroupModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreated={(newGroup) => {
          setGroups([newGroup, ...groups]);
          setIsCreateOpen(false);
        }}
      />
    </div>
  );
}
