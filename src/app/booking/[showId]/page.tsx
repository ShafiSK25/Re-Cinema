'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Tv,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  QrCode,
  Smartphone,
  Shield,
  Clock,
  Ticket,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function BookingSeatPage() {
  const params = useParams();
  const router = useRouter();
  const showId = params.showId as string;

  const [showData, setShowData] = useState<any>(null);
  const [bookedSeats, setBookedSeats] = useState<string[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Checkout modal state
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'CARD' | 'UPI' | 'NETBANKING'>('UPI');
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    if (showId) {
      fetchShow();
    }
  }, [showId]);

  const fetchShow = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/shows/${showId}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to load show');
      setShowData(data.show);
      setBookedSeats(data.bookedSeats || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getSeatTier = (rowLetter: string) => {
    const r = rowLetter.toUpperCase();
    if (r === 'A' || r === 'B') return { name: 'VIP Recliners', price: showData?.priceVip || 400, color: 'text-purple-400' };
    if (r === 'C' || r === 'D' || r === 'E') return { name: 'Gold Class', price: showData?.priceGold || 250, color: 'text-amber-400' };
    return { name: 'Silver Class', price: showData?.priceSilver || 180, color: 'text-slate-400' };
  };

  const toggleSeat = (seatCode: string) => {
    if (bookedSeats.includes(seatCode)) return;

    if (selectedSeats.includes(seatCode)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seatCode));
    } else {
      if (selectedSeats.length >= 8) {
        alert('Maximum 8 seats can be booked in a single transaction.');
        return;
      }
      setSelectedSeats([...selectedSeats, seatCode]);
    }
  };

  const calculateTicketTotal = () => {
    let subtotal = 0;
    selectedSeats.forEach((seat) => {
      const row = seat.charAt(0);
      const tier = getSeatTier(row);
      subtotal += tier.price;
    });
    return subtotal;
  };

  const ticketSubtotal = calculateTicketTotal();
  const convenienceFee = selectedSeats.length > 0 ? selectedSeats.length * 28 : 0;
  const taxes = selectedSeats.length > 0 ? Math.round((ticketSubtotal + convenienceFee) * 0.18) : 0;
  const grandTotal = ticketSubtotal + convenienceFee + taxes;

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPaying(true);
    setError('');

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          showId,
          seats: selectedSeats,
          paymentMethod,
          guestInfo: guestEmail ? { name: guestName || 'Movie Fan', email: guestEmail } : undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Payment failed');
      }

      confetti({
        particleCount: 140,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#8cf202', '#ffffff', '#22c55e', '#eab308'],
      });

      router.push(`/booking/confirmation/${data.booking.id}`);
    } catch (err: any) {
      setError(err.message);
      setPaying(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <div className="w-10 h-10 border-3 border-[#8cf202] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-slate-400 text-xs">Loading auditorium matrix...</p>
      </div>
    );
  }

  if (error && !showData) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center">
        <AlertCircle className="w-10 h-10 text-rose-500 mx-auto mb-2" />
        <h2 className="text-lg font-bold text-white">Auditorium Unavailable</h2>
        <p className="text-xs text-slate-400 mt-1">{error}</p>
        <Link href="/" className="inline-block mt-3 text-xs text-[#8cf202] hover:underline">
          Return to Movies
        </Link>
      </div>
    );
  }

  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  const seatsPerRow = showData?.screen?.seatsPerRow || 12;

  const showTimeStr = new Date(showData.startTime).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  const showDateStr = new Date(showData.startTime).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-[#06080c] pb-36">
      {/* Top Header Bar */}
      <div className="sticky top-16 z-30 bg-[#06080c]/90 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href={`/movie/${showData.movie.id}`}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-white/[0.06] rounded-xl transition"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="text-sm font-bold text-white flex items-center gap-2">
                <span>{showData.movie.title}</span>
                <span className="text-[9px] font-mono bg-[#8cf202]/15 text-[#8cf202] border border-[#8cf202]/30 px-1.5 py-0.2 rounded font-black">
                  {showData.screen.screenType}
                </span>
              </h1>
              <p className="text-[11px] text-slate-400">
                {showData.screen.theatre.name} | {showDateStr}, {showTimeStr}
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5 text-slate-400">
              <span className="w-3.5 h-3.5 rounded-md bg-white/[0.05] border border-white/[0.1]" />
              <span>Available</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-400">
              <span className="w-3.5 h-3.5 rounded-md bg-[#8cf202] border border-[#8cf202] shadow-[0_0_8px_#8cf202]" />
              <span className="text-white font-bold">Selected</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-400">
              <span className="w-3.5 h-3.5 rounded-md bg-white/[0.02] border border-white/[0.04] opacity-40" />
              <span>Booked</span>
            </div>
          </div>
        </div>
      </div>

      {/* Auditorium Map */}
      <div className="max-w-3xl mx-auto px-4 pt-10 pb-6">
        {/* Curved Cinema Screen Graphic with Neon Glow */}
        <div className="mb-12 text-center">
          <div className="cinema-screen-curve" />
          <div className="cinema-screen-glow h-10 -mt-2 flex items-center justify-center">
            <span className="text-[9px] uppercase font-black tracking-[0.25em] text-[#8cf202]/80">
              Auditorium Screen this Way
            </span>
          </div>
        </div>

        {/* Seat Rows Matrix */}
        <div className="space-y-4">
          {rows.map((rowLetter, index) => {
            const tier = getSeatTier(rowLetter);
            const isFirstOfTier =
              index === 0 ||
              getSeatTier(rows[index - 1]).name !== tier.name;

            return (
              <div key={rowLetter} className="space-y-1.5">
                {isFirstOfTier && (
                  <div className="flex items-center justify-between border-b border-white/[0.06] pb-1 pt-3">
                    <span className={`text-[11px] font-black uppercase tracking-wider ${tier.color}`}>
                      {tier.name}
                    </span>
                    <span className="text-xs font-semibold text-slate-400 font-mono">
                      ₹{tier.price}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-center gap-2 sm:gap-3">
                  {/* Row Letter left */}
                  <span className="w-4 text-center text-[11px] font-bold text-slate-500">
                    {rowLetter}
                  </span>

                  {/* Seat columns */}
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    {Array.from({ length: seatsPerRow }).map((_, i) => {
                      const seatNum = i + 1;
                      const seatCode = `${rowLetter}${seatNum}`;
                      const isBooked = bookedSeats.includes(seatCode);
                      const isSelected = selectedSeats.includes(seatCode);

                      const isAisleGap = seatNum === Math.floor(seatsPerRow / 2);

                      return (
                        <React.Fragment key={seatCode}>
                          <button
                            type="button"
                            disabled={isBooked}
                            onClick={() => toggleSeat(seatCode)}
                            title={`Seat ${seatCode} (₹${tier.price})`}
                            className={`w-6 h-6 sm:w-7 sm:h-7 rounded-lg text-[10px] font-black transition-all duration-150 flex items-center justify-center ${
                              isBooked
                                ? 'bg-white/[0.02] border border-white/[0.04] text-slate-600 cursor-not-allowed opacity-30'
                                : isSelected
                                ? 'bg-[#8cf202] border-[#8cf202] text-black shadow-[0_0_12px_rgba(140,242,2,0.5)] scale-105'
                                : 'bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-slate-300 hover:border-[#8cf202]/60'
                            }`}
                          >
                            {seatNum}
                          </button>
                          {isAisleGap && <div className="w-3 sm:w-5" />}
                        </React.Fragment>
                      );
                    })}
                  </div>

                  {/* Row Letter right */}
                  <span className="w-4 text-center text-[11px] font-bold text-slate-500">
                    {rowLetter}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Floating Bottom Booking Drawer */}
      {selectedSeats.length > 0 && (
        <div className="fixed bottom-0 inset-x-0 z-40 bg-[#0c0f16]/95 backdrop-blur-xl border-t border-white/[0.08] shadow-2xl p-3.5 sm:p-4 animate-in slide-in-from-bottom-2">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Selected Seats:</span>
                <div className="flex flex-wrap gap-1">
                  {selectedSeats.map((seat) => (
                    <span
                      key={seat}
                      className="bg-[#8cf202]/20 border border-[#8cf202]/40 text-[#8cf202] text-xs font-bold px-2 py-0.5 rounded-md"
                    >
                      {seat}
                    </span>
                  ))}
                </div>
              </div>
              <p className="text-[11px] text-slate-400">
                {selectedSeats.length} {selectedSeats.length === 1 ? 'ticket' : 'tickets'} • Incl. taxes &amp; fees
              </p>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-6">
              <div className="text-right">
                <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider">
                  Total Payable
                </span>
                <span className="text-xl sm:text-2xl font-black text-white font-mono">
                  ₹{grandTotal}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setShowPaymentModal(true)}
                className="bg-[#8cf202] hover:bg-[#9eff00] text-black font-black text-xs px-6 py-2.5 rounded-xl shadow-[0_0_15px_rgba(140,242,2,0.35)] transition hover:scale-102 flex items-center gap-2 uppercase tracking-wide"
              >
                <span>Proceed to Pay</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Gateway Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-md bg-[#0c0f16] border border-white/[0.09] rounded-3xl shadow-2xl overflow-hidden">
            <div className="p-5 border-b border-white/[0.06] flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-white">Complete Booking</h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {showData.movie.title} • {selectedSeats.length} Seats ({selectedSeats.join(', ')})
                </p>
              </div>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-white/[0.06]"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleBookingSubmit} className="p-5 space-y-4">
              {error && (
                <div className="p-2.5 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-400">
                  {error}
                </div>
              )}

              {/* Contact Information */}
              <div className="space-y-2 bg-white/[0.03] p-3 rounded-xl border border-white/[0.06]">
                <span className="text-[11px] font-semibold text-slate-300 block">
                  Ticket Recipient Info
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Full Name"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    className="bg-white/[0.04] border border-white/[0.08] rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#8cf202]"
                  />
                  <input
                    type="email"
                    required
                    placeholder="Email Address"
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    className="bg-white/[0.04] border border-white/[0.08] rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#8cf202]"
                  />
                </div>
              </div>

              {/* Payment Method Selector */}
              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1.5">
                  Choose Payment Option
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('UPI')}
                    className={`flex flex-col items-center gap-1 p-2.5 rounded-xl border text-[11px] font-bold transition ${
                      paymentMethod === 'UPI'
                        ? 'bg-[#8cf202]/15 border-[#8cf202]/50 text-[#8cf202]'
                        : 'bg-white/[0.02] border-white/[0.06] text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Smartphone className="w-4 h-4" />
                    <span>UPI / QR</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('CARD')}
                    className={`flex flex-col items-center gap-1 p-2.5 rounded-xl border text-[11px] font-bold transition ${
                      paymentMethod === 'CARD'
                        ? 'bg-[#8cf202]/15 border-[#8cf202]/50 text-[#8cf202]'
                        : 'bg-white/[0.02] border-white/[0.06] text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Card</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('NETBANKING')}
                    className={`flex flex-col items-center gap-1 p-2.5 rounded-xl border text-[11px] font-bold transition ${
                      paymentMethod === 'NETBANKING'
                        ? 'bg-[#8cf202]/15 border-[#8cf202]/50 text-[#8cf202]'
                        : 'bg-white/[0.02] border-white/[0.06] text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Shield className="w-4 h-4" />
                    <span>NetBanking</span>
                  </button>
                </div>
              </div>

              {/* Details for payment modes */}
              {paymentMethod === 'UPI' && (
                <div className="p-3 bg-white/[0.02] rounded-xl border border-white/[0.06] text-center space-y-2">
                  <div className="w-24 h-24 bg-white p-1.5 rounded-xl mx-auto flex items-center justify-center">
                    <QrCode className="w-20 h-20 text-slate-900" />
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Scan with Google Pay, PhonePe, Paytm, or any UPI App
                  </p>
                </div>
              )}

              {paymentMethod === 'CARD' && (
                <div className="space-y-2 bg-white/[0.02] p-3 rounded-xl border border-white/[0.06]">
                  <input
                    type="text"
                    placeholder="Card Number"
                    defaultValue="4242 •••• •••• 4242"
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-2.5 py-1.5 text-xs text-white"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="MM/YY"
                      defaultValue="12/28"
                      className="bg-white/[0.04] border border-white/[0.08] rounded-lg px-2.5 py-1.5 text-xs text-white"
                    />
                    <input
                      type="password"
                      placeholder="CVV"
                      defaultValue="123"
                      className="bg-white/[0.04] border border-white/[0.08] rounded-lg px-2.5 py-1.5 text-xs text-white"
                    />
                  </div>
                </div>
              )}

              {paymentMethod === 'NETBANKING' && (
                <div className="bg-white/[0.02] p-3 rounded-xl border border-white/[0.06] text-xs text-slate-300">
                  <p className="mb-2 font-semibold text-[11px]">Select Popular Bank:</p>
                  <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                    <span className="p-1.5 bg-white/[0.04] rounded-lg border border-white/[0.06] text-center cursor-pointer hover:border-[#8cf202]">HDFC Bank</span>
                    <span className="p-1.5 bg-white/[0.04] rounded-lg border border-white/[0.06] text-center cursor-pointer hover:border-[#8cf202]">ICICI Bank</span>
                    <span className="p-1.5 bg-white/[0.04] rounded-lg border border-white/[0.06] text-center cursor-pointer hover:border-[#8cf202]">State Bank of India</span>
                    <span className="p-1.5 bg-white/[0.04] rounded-lg border border-white/[0.06] text-center cursor-pointer hover:border-[#8cf202]">Axis Bank</span>
                  </div>
                </div>
              )}

              {/* Price Breakdown */}
              <div className="border-t border-white/[0.06] pt-2.5 space-y-1 text-[11px] text-slate-400">
                <div className="flex justify-between">
                  <span>Tickets ({selectedSeats.length}):</span>
                  <span className="text-slate-300 font-mono">₹{ticketSubtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Convenience Fee:</span>
                  <span className="text-slate-300 font-mono">₹{convenienceFee}</span>
                </div>
                <div className="flex justify-between">
                  <span>GST (18%):</span>
                  <span className="text-slate-300 font-mono">₹{taxes}</span>
                </div>
                <div className="flex justify-between font-black text-white text-xs pt-1.5 border-t border-white/[0.06]">
                  <span>Total Amount:</span>
                  <span className="text-[#8cf202] font-mono text-sm">₹{grandTotal}</span>
                </div>
              </div>

              {/* Confirm Pay */}
              <button
                type="submit"
                disabled={paying}
                className="w-full bg-[#8cf202] hover:bg-[#9eff00] text-black font-black py-2.5 rounded-xl shadow-[0_0_15px_rgba(140,242,2,0.35)] transition disabled:opacity-50 flex items-center justify-center gap-2 text-xs uppercase tracking-wide"
              >
                {paying ? (
                  <span>Processing...</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Pay ₹{grandTotal}</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
