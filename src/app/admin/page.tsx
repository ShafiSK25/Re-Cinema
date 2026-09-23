'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  DollarSign,
  Ticket,
  Film,
  Tv,
  TrendingUp,
  Calendar,
  PlusCircle,
  Clock,
  MapPin,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/stats');
      const data = await res.json();
      setStats(data.stats);
      setRecentBookings(data.recentBookings || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-24 bg-[#0c121d] rounded-2xl border border-white/[0.05]" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-[#0c121d] rounded-2xl border border-white/[0.05]" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-7">
      {/* Header & Quick Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Cinema Operations Overview
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time analytics, screens status, and box office metrics
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/admin/movies"
            className="flex items-center gap-1.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition shadow-sm"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Add Movie</span>
          </Link>
          <Link
            href="/admin/screens"
            className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs px-3.5 py-2 rounded-xl transition shadow-sm"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Add Screen</span>
          </Link>
          <Link
            href="/admin/shows"
            className="flex items-center gap-1.5 bg-white/[0.04] hover:bg-white/[0.08] text-white border border-white/[0.08] font-semibold text-xs px-3.5 py-2 rounded-xl transition"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Schedule Show</span>
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="bg-[#0c121d] border border-white/[0.06] p-4 sm:p-5 rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Total Box Office</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-xs">
              ₹
            </div>
          </div>
          <div className="mt-2.5">
            <span className="text-2xl font-black text-white">₹{stats?.totalRevenue?.toLocaleString() || 0}</span>
            <p className="text-[10px] text-emerald-400 flex items-center gap-1 mt-0.5 font-medium">
              <TrendingUp className="w-3 h-3" />
              <span>Live collected revenues</span>
            </p>
          </div>
        </div>

        {/* Total Bookings */}
        <div className="bg-[#0c121d] border border-white/[0.06] p-4 sm:p-5 rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Total Bookings</span>
            <div className="w-7 h-7 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center font-bold text-xs">
              <Ticket className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2.5">
            <span className="text-2xl font-black text-white">{stats?.totalBookings || 0}</span>
            <p className="text-[10px] text-slate-400 mt-0.5">
              {stats?.totalTicketsBooked || 0} tickets reserved
            </p>
          </div>
        </div>

        {/* Active Movies */}
        <div className="bg-[#0c121d] border border-white/[0.06] p-4 sm:p-5 rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Active Movies</span>
            <div className="w-7 h-7 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold text-xs">
              <Film className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2.5">
            <span className="text-2xl font-black text-white">{stats?.totalMovies || 0}</span>
            <p className="text-[10px] text-slate-400 mt-0.5">
              Running across theatres
            </p>
          </div>
        </div>

        {/* Active Screens */}
        <div className="bg-[#0c121d] border border-white/[0.06] p-4 sm:p-5 rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Auditoriums</span>
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold text-xs">
              <Tv className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2.5">
            <span className="text-2xl font-black text-white">{stats?.totalScreens || 0}</span>
            <p className="text-[10px] text-slate-400 mt-0.5">
              Across {stats?.totalTheatres || 0} multiplexes
            </p>
          </div>
        </div>
      </div>

      {/* Recent Bookings Audit Table */}
      <div className="bg-[#0c121d] border border-white/[0.06] rounded-2xl p-4 sm:p-5 space-y-3.5">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Ticket className="w-4 h-4 text-rose-500" />
            <span>Recent Customer Bookings</span>
          </h2>
          <Link href="/admin/bookings" className="text-xs text-rose-400 hover:underline">
            View All
          </Link>
        </div>

        {recentBookings.length === 0 ? (
          <p className="text-xs text-slate-500 py-6 text-center">No bookings recorded yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[9px] uppercase font-bold text-slate-500 bg-white/[0.02] border-b border-white/[0.04]">
                <tr>
                  <th className="p-3">Order Ref</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Movie & Cinema</th>
                  <th className="p-3">Seats</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {recentBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-white/[0.02] transition">
                    <td className="p-3 font-mono font-bold text-rose-400 text-[11px]">{b.bookingNumber}</td>
                    <td className="p-3">
                      <span className="font-semibold text-white block text-xs">{b.user?.name || 'Guest'}</span>
                      <span className="text-[10px] text-slate-400">{b.user?.email}</span>
                    </td>
                    <td className="p-3">
                      <span className="font-semibold text-slate-200 block text-xs">{b.show?.movie?.title}</span>
                      <span className="text-[10px] text-slate-500">{b.show?.screen?.theatre?.name} ({b.show?.screen?.name})</span>
                    </td>
                    <td className="p-3 font-semibold text-amber-400 text-xs">{b.seats?.join(', ')}</td>
                    <td className="p-3 font-bold text-white text-xs">₹{b.totalAmount}</td>
                    <td className="p-3">
                      <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-md text-[9px] font-bold">
                        {b.paymentStatus} ({b.paymentMethod})
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
