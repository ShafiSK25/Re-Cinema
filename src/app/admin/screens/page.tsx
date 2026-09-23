'use client';

import React, { useState, useEffect } from 'react';
import {
  Tv,
  Plus,
  Trash2,
  Building2,
  CheckCircle2,
  AlertCircle,
  X,
  MapPin,
  Users,
} from 'lucide-react';
import { ScreenItem, TheatreItem } from '@/types';

export default function AdminScreensPage() {
  const [screens, setScreens] = useState<any[]>([]);
  const [theatres, setTheatres] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddScreenModal, setShowAddScreenModal] = useState(false);
  const [showAddTheatreModal, setShowAddTheatreModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Form state for Screen
  const [screenName, setScreenName] = useState('');
  const [theatreId, setTheatreId] = useState('');
  const [screenType, setScreenType] = useState('IMAX');
  const [totalRows, setTotalRows] = useState(8);
  const [seatsPerRow, setSeatsPerRow] = useState(12);

  // Form state for Theatre
  const [theatreName, setTheatreName] = useState('');
  const [theatreCity, setTheatreCity] = useState('Mumbai');
  const [theatreAddress, setTheatreAddress] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [screensRes, theatresRes] = await Promise.all([
        fetch('/api/screens'),
        fetch('/api/theatres'),
      ]);
      const screensData = await screensRes.json();
      const theatresData = await theatresRes.json();
      setScreens(screensData.screens || []);
      setTheatres(theatresData.theatres || []);
      if (theatresData.theatres?.length > 0 && !theatreId) {
        setTheatreId(theatresData.theatres[0].id);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAddScreen = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/screens', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: screenName,
          theatreId,
          screenType,
          totalRows,
          seatsPerRow,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to add screen');

      setSuccessMessage(`Screen "${screenName}" added successfully!`);
      setShowAddScreenModal(false);
      setScreenName('');
      fetchData();
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddTheatre = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/theatres', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: theatreName,
          city: theatreCity,
          address: theatreAddress,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to add cinema theatre');

      setSuccessMessage(`Theatre "${theatreName}" created!`);
      setShowAddTheatreModal(false);
      setTheatreName('');
      setTheatreAddress('');
      fetchData();
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteScreen = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove ${name}? This will remove all scheduled shows in this auditorium.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/screens/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to remove screen');

      setSuccessMessage(`Screen "${name}" was removed.`);
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
            <Tv className="w-5 h-5 text-amber-500" />
            <span>Screens & Multiplexes</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure multiplex branches, technology formats (IMAX, 4DX, 3D), and seat capacities
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddTheatreModal(true)}
            className="flex items-center gap-1.5 bg-white/[0.04] hover:bg-white/[0.08] text-white text-xs font-semibold px-3 py-2 rounded-xl border border-white/[0.08] transition"
          >
            <Building2 className="w-3.5 h-3.5 text-rose-500" />
            <span>Add Multiplex</span>
          </button>

          <button
            onClick={() => setShowAddScreenModal(true)}
            className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold px-3.5 py-2 rounded-xl shadow-sm transition hover:scale-102"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Screen</span>
          </button>
        </div>
      </div>

      {/* Alert Banner */}
      {successMessage && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-400 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Screens Grid */}
      <div className="bg-[#0c121d] border border-white/[0.06] rounded-2xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-10 text-center text-xs text-slate-400">Loading auditoriums...</div>
        ) : screens.length === 0 ? (
          <div className="p-10 text-center text-xs text-slate-400">No screens configured yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[9px] uppercase font-bold text-slate-500 bg-white/[0.02] border-b border-white/[0.04]">
                <tr>
                  <th className="p-3.5">Screen Name</th>
                  <th className="p-3.5">Cinema Multiplex</th>
                  <th className="p-3.5">Format</th>
                  <th className="p-3.5">Seat Capacity</th>
                  <th className="p-3.5">Grid Layout</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {screens.map((screen) => {
                  const capacity = screen.totalRows * screen.seatsPerRow;
                  return (
                    <tr key={screen.id} className="hover:bg-white/[0.02] transition">
                      <td className="p-3.5">
                        <span className="font-bold text-white block text-xs">{screen.name}</span>
                      </td>
                      <td className="p-3.5">
                        <span className="font-semibold text-slate-200 block text-xs">{screen.theatre?.name}</span>
                        <span className="text-[10px] text-slate-500">{screen.theatre?.city}</span>
                      </td>
                      <td className="p-3.5">
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/25">
                          {screen.screenType}
                        </span>
                      </td>
                      <td className="p-3.5 text-slate-300 font-medium text-xs">
                        {capacity} seats
                      </td>
                      <td className="p-3.5 text-slate-500 font-mono text-[10px]">
                        {screen.totalRows} Rows × {screen.seatsPerRow} Columns
                      </td>
                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => handleDeleteScreen(screen.id, screen.name)}
                          title="Remove Screen"
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

      {/* Add Screen Modal */}
      {showAddScreenModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-sm bg-[#0c121d] border border-white/[0.09] rounded-3xl shadow-2xl overflow-hidden">
            <div className="p-5 border-b border-white/[0.06] flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Add New Screen</h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Configure an auditorium inside a multiplex
                </p>
              </div>
              <button
                onClick={() => setShowAddScreenModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-white/[0.06]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddScreen} className="p-5 space-y-3.5">
              {error && (
                <div className="p-2.5 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-400">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Select Multiplex *
                </label>
                <select
                  required
                  value={theatreId}
                  onChange={(e) => setTheatreId(e.target.value)}
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  {theatres.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.city})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Screen Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Screen 3 - IMAX Laser"
                  value={screenName}
                  onChange={(e) => setScreenName(e.target.value)}
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Projection Format *
                </label>
                <select
                  value={screenType}
                  onChange={(e) => setScreenType(e.target.value)}
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="IMAX">IMAX with Laser</option>
                  <option value="4DX">4DX Motion & Effects</option>
                  <option value="3D">3D RealD</option>
                  <option value="2D">Standard 2D Dolby 7.1</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Total Rows
                  </label>
                  <input
                    type="number"
                    min={4}
                    max={12}
                    value={totalRows}
                    onChange={(e) => setTotalRows(Number(e.target.value))}
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                  <span className="text-[10px] text-slate-500 mt-0.5 block">Rows A to {String.fromCharCode(64 + totalRows)}</span>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Seats Per Row
                  </label>
                  <input
                    type="number"
                    min={6}
                    max={20}
                    value={seatsPerRow}
                    onChange={(e) => setSeatsPerRow(Number(e.target.value))}
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                  <span className="text-[10px] text-slate-500 mt-0.5 block">{totalRows * seatsPerRow} Total Seats</span>
                </div>
              </div>

              <div className="pt-2 border-t border-white/[0.06] flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowAddScreenModal(false)}
                  className="px-3.5 py-1.5 bg-white/[0.04] hover:bg-white/[0.08] rounded-xl text-xs font-semibold text-slate-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs shadow-md transition disabled:opacity-50"
                >
                  {submitting ? 'Creating...' : 'Create Screen'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Theatre Modal */}
      {showAddTheatreModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-sm bg-[#0c121d] border border-white/[0.09] rounded-3xl shadow-2xl overflow-hidden">
            <div className="p-5 border-b border-white/[0.06] flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Add Multiplex</h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Register a new cinema branch location
                </p>
              </div>
              <button
                onClick={() => setShowAddTheatreModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-white/[0.06]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddTheatre} className="p-5 space-y-3.5">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Multiplex Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. PVR Superplex: Mall of India"
                  value={theatreName}
                  onChange={(e) => setTheatreName(e.target.value)}
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  City *
                </label>
                <select
                  value={theatreCity}
                  onChange={(e) => setTheatreCity(e.target.value)}
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
                >
                  <option value="Mumbai">Mumbai</option>
                  <option value="Delhi-NCR">Delhi-NCR</option>
                  <option value="Bengaluru">Bengaluru</option>
                  <option value="Hyderabad">Hyderabad</option>
                  <option value="Chennai">Chennai</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Street Address *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Sector 18, Noida"
                  value={theatreAddress}
                  onChange={(e) => setTheatreAddress(e.target.value)}
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="pt-2 border-t border-white/[0.06] flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowAddTheatreModal(false)}
                  className="px-3.5 py-1.5 bg-white/[0.04] hover:bg-white/[0.08] rounded-xl text-xs font-semibold text-slate-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs shadow-md transition disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : 'Register Multiplex'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
