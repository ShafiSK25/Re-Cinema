'use client';

import React, { useState, useEffect } from 'react';
import {
  Ticket,
  Search,
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  Users,
} from 'lucide-react';

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/bookings');
      const data = await res.json();
      setBookings(data.bookings || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const filteredBookings = bookings.filter(
    (b) =>
      b.bookingNumber?.toLowerCase().includes(search.toLowerCase()) ||
      b.user?.email?.toLowerCase().includes(search.toLowerCase()) ||
      b.show?.movie?.title?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Ticket className="w-5 h-5 text-rose-500" />
            <span>Bookings & Orders Audit</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Audit log of all admissions, payments, and seat allocations
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-500" />
          <input
            type="text"
            placeholder="Search ref, movie, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#0c121d] border border-white/[0.08] rounded-xl pl-8 pr-3.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
          />
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-[#0c121d] border border-white/[0.06] rounded-2xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-10 text-center text-xs text-slate-400">Loading orders...</div>
        ) : filteredBookings.length === 0 ? (
          <div className="p-10 text-center text-xs text-slate-400">No matching bookings found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[9px] uppercase font-bold text-slate-500 bg-white/[0.02] border-b border-white/[0.04]">
                <tr>
                  <th className="p-3.5">Booking Ref</th>
                  <th className="p-3.5">Customer</th>
                  <th className="p-3.5">Movie & Cinema</th>
                  <th className="p-3.5">Showtime</th>
                  <th className="p-3.5">Seats</th>
                  <th className="p-3.5">Paid Total</th>
                  <th className="p-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {filteredBookings.map((b) => {
                  const showTime = new Date(b.show.startTime).toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true,
                  });
                  const showDate = new Date(b.show.startTime).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  });

                  return (
                    <tr key={b.id} className="hover:bg-white/[0.02] transition">
                      <td className="p-3.5 font-mono font-bold text-rose-400 text-xs">
                        {b.bookingNumber}
                      </td>
                      <td className="p-3.5">
                        <span className="font-semibold text-white block text-xs">{b.user?.name || 'Guest'}</span>
                        <span className="text-[10px] text-slate-400">{b.user?.email}</span>
                      </td>
                      <td className="p-3.5">
                        <span className="font-bold text-slate-200 block text-xs">{b.show?.movie?.title}</span>
                        <span className="text-[10px] text-slate-500">
                          {b.show?.screen?.theatre?.name} ({b.show?.screen?.name})
                        </span>
                      </td>
                      <td className="p-3.5 text-slate-300">
                        <span className="font-semibold block text-white text-xs">{showTime}</span>
                        <span className="text-[10px] text-slate-500">{showDate}</span>
                      </td>
                      <td className="p-3.5">
                        <span className="font-bold text-amber-400 text-xs">
                          {Array.isArray(b.seats) ? b.seats.join(', ') : b.seats}
                        </span>
                      </td>
                      <td className="p-3.5 font-bold text-white text-xs">
                        ₹{b.totalAmount}
                      </td>
                      <td className="p-3.5">
                        <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-md text-[9px] font-bold">
                          {b.paymentStatus} ({b.paymentMethod})
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
