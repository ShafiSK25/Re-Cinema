'use client';

import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Plus,
  Trash2,
  Clock,
  Film,
  Tv,
  CheckCircle2,
  AlertCircle,
  X,
  DollarSign,
} from 'lucide-react';
import { ShowItem, MovieItem, ScreenItem } from '@/types';

export default function AdminShowsPage() {
  const [shows, setShows] = useState<any[]>([]);
  const [movies, setMovies] = useState<MovieItem[]>([]);
  const [screens, setScreens] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Form state
  const [movieId, setMovieId] = useState('');
  const [screenId, setScreenId] = useState('');
  const [showDate, setShowDate] = useState(new Date().toISOString().split('T')[0]);
  const [showTime, setShowTime] = useState('18:00');
  const [priceSilver, setPriceSilver] = useState(180);
  const [priceGold, setPriceGold] = useState(250);
  const [priceVip, setPriceVip] = useState(400);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [showsRes, moviesRes, screensRes] = await Promise.all([
        fetch('/api/shows'),
        fetch('/api/movies'),
        fetch('/api/screens'),
      ]);
      const showsData = await showsRes.json();
      const moviesData = await moviesRes.json();
      const screensData = await screensRes.json();

      setShows(showsData.shows || []);
      setMovies(moviesData.movies || []);
      setScreens(screensData.screens || []);

      if (moviesData.movies?.length > 0 && !movieId) {
        setMovieId(moviesData.movies[0].id);
      }
      if (screensData.screens?.length > 0 && !screenId) {
        setScreenId(screensData.screens[0].id);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateShow = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const startTime = new Date(`${showDate}T${showTime}:00`);

      const res = await fetch('/api/shows', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          movieId,
          screenId,
          startTime: startTime.toISOString(),
          priceSilver,
          priceGold,
          priceVip,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to schedule show');

      setSuccessMessage('Showtime successfully programmed!');
      setShowAddModal(false);
      fetchData();
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteShow = async (id: string) => {
    if (!confirm('Are you sure you want to cancel and remove this showtime?')) return;

    try {
      const res = await fetch(`/api/shows/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to cancel show');

      setSuccessMessage('Showtime cancelled.');
      fetchData();
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Calendar className="w-5 h-5 text-rose-500" />
            <span>Show Scheduling & Pricing</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Program movie showtimes onto auditorium screens and configure seat tier prices
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs px-3.5 py-2 rounded-xl shadow-sm transition hover:scale-102"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Schedule New Show</span>
        </button>
      </div>

      {/* Alert Banner */}
      {successMessage && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-400 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Shows Table */}
      <div className="bg-[#0c121d] border border-white/[0.06] rounded-2xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-10 text-center text-xs text-slate-400">Loading schedules...</div>
        ) : shows.length === 0 ? (
          <div className="p-10 text-center text-xs text-slate-400">No shows scheduled yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[9px] uppercase font-bold text-slate-500 bg-white/[0.02] border-b border-white/[0.04]">
                <tr>
                  <th className="p-3.5">Movie</th>
                  <th className="p-3.5">Cinema & Screen</th>
                  <th className="p-3.5">Date & Time</th>
                  <th className="p-3.5">Tier Pricing</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {shows.map((show) => {
                  const startTime = new Date(show.startTime);
                  const formattedDate = startTime.toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                  });
                  const formattedTime = startTime.toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true,
                  });

                  return (
                    <tr key={show.id} className="hover:bg-white/[0.02] transition">
                      <td className="p-3.5">
                        <div className="flex items-center gap-3">
                          <img
                            src={show.movie?.posterUrl}
                            alt={show.movie?.title}
                            className="w-9 h-12 object-cover rounded-lg border border-white/[0.08] flex-shrink-0"
                          />
                          <div>
                            <span className="font-bold text-white block text-xs">{show.movie?.title}</span>
                            <span className="text-[10px] text-slate-500">{show.movie?.language}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-3.5">
                        <span className="font-semibold text-slate-200 block text-xs">
                          {show.screen?.theatre?.name}
                        </span>
                        <span className="text-[11px] text-rose-400 font-medium">
                          {show.screen?.name} ({show.screen?.screenType})
                        </span>
                      </td>
                      <td className="p-3.5">
                        <span className="text-white font-semibold block text-xs">{formattedTime}</span>
                        <span className="text-[10px] text-slate-500">{formattedDate}</span>
                      </td>
                      <td className="p-3.5">
                        <div className="flex items-center gap-1.5">
                          <span className="px-2 py-0.5 rounded-md bg-white/[0.04] text-slate-300 font-mono text-[10px]">
                            ₹{show.priceSilver}
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-300 font-mono text-[10px]">
                            ₹{show.priceGold}
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-300 font-mono text-[10px]">
                            ₹{show.priceVip}
                          </span>
                        </div>
                      </td>
                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => handleDeleteShow(show.id)}
                          title="Cancel Show"
                          className="p-1.5 text-rose-400 hover:text-white hover:bg-rose-600 rounded-lg transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Show Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-sm bg-[#0c121d] border border-white/[0.09] rounded-3xl shadow-2xl overflow-hidden">
            <div className="p-5 border-b border-white/[0.06] flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Schedule Showtime</h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Allocate screen time and configure tier prices
                </p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-white/[0.06]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateShow} className="p-5 space-y-3.5">
              {error && (
                <div className="p-2.5 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-400">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Select Movie *
                </label>
                <select
                  required
                  value={movieId}
                  onChange={(e) => setMovieId(e.target.value)}
                  className="w-full bg-[#0e1118] text-white border border-white/[0.15] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#8cf202]"
                >
                  {movies.map((m) => (
                    <option key={m.id} value={m.id} className="bg-[#0e1118] text-white py-1">
                      {m.title} ({m.language})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Select Auditorium *
                </label>
                <select
                  required
                  value={screenId}
                  onChange={(e) => setScreenId(e.target.value)}
                  className="w-full bg-[#0e1118] text-white border border-white/[0.15] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#8cf202]"
                >
                  {screens.map((s) => (
                    <option key={s.id} value={s.id} className="bg-[#0e1118] text-white py-1">
                      {s.theatre?.name} - {s.name} ({s.screenType})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Show Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={showDate}
                    onChange={(e) => setShowDate(e.target.value)}
                    className="w-full bg-[#0e1118] text-white border border-white/[0.12] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#8cf202]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Start Time *
                  </label>
                  <input
                    type="time"
                    required
                    value={showTime}
                    onChange={(e) => setShowTime(e.target.value)}
                    className="w-full bg-[#0e1118] text-white border border-white/[0.12] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#8cf202]"
                  />
                </div>
              </div>

              {/* Pricing Tiers */}
              <div className="pt-2 border-t border-white/[0.06]">
                <span className="block text-[11px] font-bold text-slate-300 mb-1.5">
                  Tier Prices (₹)
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-[10px] text-slate-500 block mb-0.5">Silver</label>
                    <input
                      type="number"
                      required
                      value={priceSilver}
                      onChange={(e) => setPriceSilver(Number(e.target.value))}
                      className="w-full bg-[#0e1118] text-white border border-white/[0.12] rounded-lg px-2 py-1 text-xs focus:outline-none focus:border-[#8cf202]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 block mb-0.5">Gold</label>
                    <input
                      type="number"
                      required
                      value={priceGold}
                      onChange={(e) => setPriceGold(Number(e.target.value))}
                      className="w-full bg-[#0e1118] text-white border border-white/[0.12] rounded-lg px-2 py-1 text-xs focus:outline-none focus:border-[#8cf202]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 block mb-0.5">VIP</label>
                    <input
                      type="number"
                      required
                      value={priceVip}
                      onChange={(e) => setPriceVip(Number(e.target.value))}
                      className="w-full bg-[#0e1118] text-white border border-white/[0.12] rounded-lg px-2 py-1 text-xs focus:outline-none focus:border-[#8cf202]"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-white/[0.06] flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3.5 py-1.5 bg-white/[0.04] hover:bg-white/[0.08] rounded-xl text-xs font-semibold text-slate-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-1.5 bg-[#8cf202] hover:bg-[#9eff00] text-black font-black rounded-xl text-xs shadow-md transition disabled:opacity-50"
                >
                  {submitting ? 'Scheduling...' : 'Schedule'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
