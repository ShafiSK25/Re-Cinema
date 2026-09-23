'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Ticket, Calendar, Clock, MapPin, ChevronRight, AlertCircle, Sparkles } from 'lucide-react';
import AuthModal from '@/components/AuthModal';

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [needsAuth, setNeedsAuth] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/bookings');
      if (res.status === 401) {
        setNeedsAuth(true);
        return;
      }
      const data = await res.json();
      setBookings(data.bookings || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
          <Ticket className="w-5 h-5 text-rose-500" />
          <span>My Cinema Bookings</span>
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          View your upcoming show admissions and digital cinema passes
        </p>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="h-28 bg-[#0c121d] border border-white/[0.05] rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : needsAuth ? (
        <div className="bg-[#0c121d] border border-white/[0.06] rounded-3xl p-10 text-center space-y-3">
          <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
          <h2 className="text-base font-bold text-white">Sign In to View Bookings</h2>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Please sign in with your customer account or demo user credentials to access your ticket history.
          </p>
          <button
            onClick={() => setShowAuthModal(true)}
            className="bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs px-5 py-2.5 rounded-xl shadow-md transition"
          >
            Sign In Now
          </button>
        </div>
      ) : bookings.length === 0 ? (
        <div className="bg-[#0c121d] border border-white/[0.06] rounded-3xl p-12 text-center space-y-3">
          <Ticket className="w-10 h-10 text-slate-600 mx-auto" />
          <h2 className="text-base font-bold text-white">No Bookings Found</h2>
          <p className="text-xs text-slate-400">
            You haven&apos;t booked any tickets yet. Explore movies now showing in your city!
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs px-5 py-2 rounded-xl shadow-md transition"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Browse Movies</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-3.5">
          {bookings.map((booking) => {
            const showTime = new Date(booking.show.startTime).toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: '2-digit',
              hour12: true,
            });
            const showDate = new Date(booking.show.startTime).toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
            });

            return (
              <div
                key={booking.id}
                className="bg-[#0c121d] border border-white/[0.06] hover:border-white/[0.1] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition"
              >
                <div className="flex gap-3.5 items-center">
                  <img
                    src={booking.show.movie.posterUrl}
                    alt={booking.show.movie.title}
                    className="w-14 h-20 sm:w-16 sm:h-24 object-cover rounded-xl border border-white/[0.08] flex-shrink-0"
                  />
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-mono bg-rose-500/15 text-rose-400 border border-rose-500/30 px-1.5 py-0.2 rounded font-bold">
                      {booking.bookingNumber}
                    </span>
                    <h3 className="font-bold text-sm text-white">
                      {booking.show.movie.title}
                    </h3>
                    <p className="text-[11px] text-slate-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-rose-500" />
                      <span>{booking.show.screen.theatre.name} ({booking.show.screen.name})</span>
                    </p>
                    <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-300 pt-0.5">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-500" />
                        {showDate}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-500" />
                        {showTime}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="w-full sm:w-auto flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 border-white/[0.05] pt-3 sm:pt-0">
                  <div>
                    <span className="text-[9px] text-slate-500 uppercase font-bold block sm:text-right">
                      Seats ({booking.seats.length})
                    </span>
                    <span className="text-xs font-bold text-rose-400 block sm:text-right">
                      {booking.seats.join(', ')}
                    </span>
                    <span className="text-[11px] text-slate-300 block sm:text-right font-medium mt-0.5">
                      ₹{booking.totalAmount} • {booking.paymentStatus}
                    </span>
                  </div>

                  <Link
                    href={`/booking/confirmation/${booking.id}`}
                    className="mt-2 inline-flex items-center gap-1 bg-white/[0.05] hover:bg-white/[0.09] border border-white/[0.08] text-xs font-semibold text-white px-3 py-1.5 rounded-xl transition"
                  >
                    <span>View Pass</span>
                    <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showAuthModal && (
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onSuccess={() => {
            setShowAuthModal(false);
            setNeedsAuth(false);
            fetchBookings();
          }}
        />
      )}
    </div>
  );
}
