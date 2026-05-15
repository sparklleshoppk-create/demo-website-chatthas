'use client';

import React, { useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, AreaChart, Area, PieChart, Pie, Cell 
} from 'recharts';

export default function AnalyticsClient({ initialOrders }: { initialOrders: any[] }) {
  
  const dailyStats = useMemo(() => {
    const stats: any = {};
    initialOrders.forEach(order => {
      const date = new Date(order.created_at).toLocaleDateString();
      if (!stats[date]) stats[date] = { date, revenue: 0, orders: 0 };
      if (order.status !== 'cancelled') {
        stats[date].revenue += Number(order.total);
        stats[date].orders += 1;
      }
    });
    return Object.values(stats);
  }, [initialOrders]);

  const hourlyHeatmap = useMemo(() => {
    const hours = Array.from({ length: 24 }, (_, i) => ({ hour: `${i}:00`, orders: 0 }));
    initialOrders.forEach(order => {
      const hour = new Date(order.created_at).getHours();
      hours[hour].orders += 1;
    });
    return hours;
  }, [initialOrders]);

  const totalRevenue = initialOrders.reduce((sum, o) => o.status !== 'cancelled' ? sum + Number(o.total) : sum, 0);
  const avgOrderValue = initialOrders.length > 0 ? totalRevenue / initialOrders.filter(o => o.status !== 'cancelled').length : 0;

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-dark-card border border-dark-border p-6 rounded-sm">
          <p className="text-[10px] font-bold text-cream/40 uppercase tracking-widest mb-1">30D Revenue</p>
          <p className="text-3xl font-display font-bold text-gold-500">Rs. {totalRevenue.toLocaleString()}</p>
        </div>
        <div className="bg-dark-card border border-dark-border p-6 rounded-sm">
          <p className="text-[10px] font-bold text-cream/40 uppercase tracking-widest mb-1">Total Orders</p>
          <p className="text-3xl font-display font-bold text-cream">{initialOrders.length}</p>
        </div>
        <div className="bg-dark-card border border-dark-border p-6 rounded-sm">
          <p className="text-[10px] font-bold text-cream/40 uppercase tracking-widest mb-1">Avg Order Value</p>
          <p className="text-3xl font-display font-bold text-cream">Rs. {Math.round(avgOrderValue)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue Chart */}
        <div className="bg-dark-card border border-dark-border p-8 rounded-sm">
          <h3 className="text-lg font-display font-bold text-cream mb-6">Revenue Trend</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyStats}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C5A059" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#C5A059" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="date" stroke="#ffffff30" fontSize={10} />
                <YAxis stroke="#ffffff30" fontSize={10} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid #ffffff10', borderRadius: '4px' }}
                  itemStyle={{ color: '#C5A059' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#C5A059" fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Hourly Heatmap */}
        <div className="bg-dark-card border border-dark-border p-8 rounded-sm">
          <h3 className="text-lg font-display font-bold text-cream mb-6">Peak Ordering Hours</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourlyHeatmap}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="hour" stroke="#ffffff30" fontSize={10} />
                <YAxis stroke="#ffffff30" fontSize={10} />
                <Tooltip 
                   contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid #ffffff10', borderRadius: '4px' }}
                />
                <Bar dataKey="orders" fill="#C5A059" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
