'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  CheckCircle2,
  Ticket,
  Calendar,
  Clock,
  MapPin,
  QrCode,
  Download,
  Share2,
  ArrowRight,
  Film,
} from 'lucide-react';

export default function BookingConfirmationPage() {
  const params = useParams();
  const bookingId = params.id as string;

  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (bookingId) {
      fetchBooking();
    }
  }, [bookingId]);

  const fetchBooking = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/bookings/${bookingId}`);
      const data = await res.json();
      setBooking(data.booking);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center">
        <div className="w-10 h-10 border-3 border-[#8cf202] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-slate-400 text-xs">Generating your digital cinema pass...</p>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center">
        <h2 className="text-lg font-bold text-white">Booking Not Found</h2>
        <Link href="/" className="inline-block mt-3 text-xs text-[#8cf202] hover:underline">
          Return Home
        </Link>
      </div>
    );
  }

  const showTime = new Date(booking.show.startTime).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  const showDate = new Date(booking.show.startTime).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="max-w-xl mx-auto px-4 py-10 space-y-6">
      {/* Success Notification */}
      <div className="text-center space-y-1.5">
        <div className="w-12 h-12 bg-[#8cf202]/15 text-[#8cf202] border border-[#8cf202]/30 rounded-2xl flex items-center justify-center mx-auto mb-2 shadow-[0_0_15px_rgba(140,242,2,0.2)]">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
          Booking Confirmed!
        </h1>
        <p className="text-xs text-slate-400">
          Your admission is confirmed. Present this pass with QR at cinema entrance gate.
        </p>
      </div>

      {/* Cyber Digital Cinema Ticket Pass */}
      <div className="relative bg-[#0c0f16] border border-white/[0.08] rounded-3xl overflow-hidden shadow-2xl">
        {/* Ticket Header in Neon Lime */}
        <div className="bg-[#8cf202] px-6 py-3.5 flex items-center justify-between text-black">
          <div className="flex items-center gap-2">
            <Film className="w-4 h-4 text-black" />
            <span className="font-black text-xs tracking-wider uppercase">Official Cinema Pass</span>
          </div>
          <span className="font-mono text-[11px] font-black bg-black/15 px-2 py-0.5 rounded">
            {booking.bookingNumber}
          </span>
        </div>

        {/* Ticket Main Info */}
        <div className="p-6 space-y-5">
          <div className="flex gap-4 items-start">
            <img
              src={booking.show.movie.posterUrl}
              alt={booking.show.movie.title}
              className="w-16 h-24 object-cover rounded-xl shadow-md border border-white/[0.08] flex-shrink-0"
            />
            <div className="flex-1 space-y-1">
              <span className="text-[9px] font-mono font-black uppercase tracking-wider text-[#8cf202] bg-[#8cf202]/10 px-1.5 py-0.5 rounded border border-[#8cf202]/20">
                {booking.show.screen.screenType}
              </span>
              <h2 className="text-base sm:text-lg font-black text-white leading-tight">
                {booking.show.movie.title}
              </h2>
              <p className="text-[11px] text-slate-400">
                {booking.show.movie.language} • {booking.show.movie.genre}
              </p>
              <p className="text-[11px] text-slate-300 font-medium flex items-center gap-1 pt-0.5">
                <MapPin className="w-3.5 h-3.5 text-[#8cf202]" />
                <span>{booking.show.screen.theatre.name}</span>
              </p>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 bg-white/[0.03] rounded-2xl border border-white/[0.06] text-xs">
            <div>
              <span className="text-slate-400 block text-[9px] uppercase font-bold tracking-wider">Date</span>
              <span className="text-white font-semibold text-[11px]">{showDate}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[9px] uppercase font-bold tracking-wider">Time</span>
              <span className="text-white font-semibold text-[11px]">{showTime}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[9px] uppercase font-bold tracking-wider">Screen</span>
              <span className="text-white font-semibold text-[11px]">{booking.show.screen.name}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[9px] uppercase font-bold tracking-wider">Seats</span>
              <span className="text-[#8cf202] font-black text-[11px]">{booking.seats.join(', ')}</span>
            </div>
          </div>

          {/* Perforated Divider */}
          <div className="relative border-t border-dashed border-white/[0.1] my-4">
            <div className="ticket-notch-left" />
            <div className="ticket-notch-right" />
          </div>

          {/* QR Code & Scan Instructions */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-5 pt-1">
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-xs font-bold text-white block">
                Auditorium Entrance QR
              </span>
              <p className="text-[11px] text-slate-400 max-w-xs">
                Entry gates open 15 minutes before showtime.
              </p>
              <p className="text-[11px] font-semibold text-[#8cf202] pt-0.5">
                Paid: ₹{booking.totalAmount} ({booking.paymentMethod}) • Confirmed
              </p>
            </div>

            <div className="bg-white p-2.5 rounded-2xl shadow-lg flex flex-col items-center">
              <QrCode className="w-20 h-20 text-slate-900" />
              <span className="text-[8px] font-mono font-bold text-slate-700 mt-1">
                {booking.bookingNumber}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-2.5 justify-center pt-2">
        <button
          onClick={handlePrint}
          className="w-full sm:w-auto flex items-center justify-center gap-1.5 bg-white/[0.05] hover:bg-white/[0.09] text-white font-semibold px-4 py-2 rounded-xl border border-white/[0.08] transition text-xs"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download / Print</span>
        </button>

        <Link
          href="/my-bookings"
          className="w-full sm:w-auto flex items-center justify-center gap-1.5 bg-[#8cf202] hover:bg-[#9eff00] text-black font-black px-4 py-2 rounded-xl shadow-md transition text-xs uppercase"
        >
          <Ticket className="w-3.5 h-3.5" />
          <span>View All Bookings</span>
        </Link>

        <Link
          href="/"
          className="w-full sm:w-auto flex items-center justify-center gap-1 text-slate-400 hover:text-white text-xs py-2 px-3 transition"
        >
          <span>Explore Movies</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
