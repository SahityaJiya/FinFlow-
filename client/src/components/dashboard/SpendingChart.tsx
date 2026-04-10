import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useRefresh } from '@/context/RefreshContext';

interface SpendingChartProps {
  data: Record<string, number>;
}

const COLORS = ['#f97316', '#3b82f6', '#ec4899', '#a855f7', '#eab308', '#ef4444', '#6366f1', '#06b6d4', '#22c55e', '#64748b'];

export default function SpendingChart({ data }: SpendingChartProps) {
  const [chartData, setChartData] = useState<Array<{name: string, value: number}>>([]);
  const { refreshKey } = useRefresh();

  useEffect(() => {
    setChartData(Object.entries(data).map(([name, value]) => ({
      name,
      value,
    })));
  }, [data, refreshKey]);

  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-white/10"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold">Spending by Category</h3>
          <p className="text-sm text-slate-400">Total: ₹{total.toLocaleString()}</p>
        </div>
        <div className="flex items-center gap-2 text-green-400">
          <TrendingUp className="w-4 h-4" />
          <span className="text-sm font-medium">This Month</span>
        </div>
      </div>

      {chartData.length === 0 ? (
        <div className="h-64 flex items-center justify-center text-slate-500">
          No expenses this month
        </div>
      ) : (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
                animationDuration={1000}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                }}
                formatter={(value: number) => [`₹${value.toLocaleString()}`, '']}
              />
              <Legend 
                formatter={(value) => <span style={{ color: '#94a3b8', fontSize: '12px' }}>{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </motion.div>
  );
}
