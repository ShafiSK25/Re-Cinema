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

  const handleDeleteTheatre = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove "${name}"? This will remove all screens and scheduled shows in this multiplex.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/theatres/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to remove multiplex');

      setSuccessMessage(`Multiplex "${name}" was removed.`);
      fetchData();
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const openAddScreenForTheatre = (tId: string) => {
    setTheatreId(tId);
    setShowAddScreenModal(true);
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

      {/* 1. Cinema Multiplexes Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
            <Building2 className="w-4 h-4 text-[#8cf202]" />
            <span>Active Multiplexes ({theatres.length})</span>
          </h2>
          <button
            onClick={() => {
              setError('');
              setShowAddTheatreModal(true);
            }}
            className="text-xs text-[#8cf202] hover:underline font-bold flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Multiplex</span>
          </button>
        </div>

        {loading ? (
          <div className="p-8 text-center text-xs text-slate-400 bg-[#0c121d] border border-white/[0.06] rounded-2xl">
            Loading multiplexes...
          </div>
        ) : theatres.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400 bg-[#0c121d] border border-white/[0.06] rounded-2xl flex flex-col items-center justify-center space-y-2">
            <Building2 className="w-8 h-8 text-slate-600" />
            <p className="font-bold text-white">No multiplexes configured</p>
            <p className="text-slate-400">Click &ldquo;Add Multiplex&rdquo; above to register your first theatre branch.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {theatres.map((theatre) => {
              const theatreScreens = screens.filter((s) => s.theatreId === theatre.id);
              return (
                <div
                  key={theatre.id}
                  className="bg-[#0c121d] border border-white/[0.08] hover:border-[#8cf202]/40 rounded-2xl p-4 transition flex flex-col justify-between space-y-3 shadow-lg"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold text-sm text-white line-clamp-1">
                        {theatre.name}
                      </h3>
                      <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-[#8cf202]/10 text-[#8cf202] border border-[#8cf202]/25 flex-shrink-0">
                        {theatre.city}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-400 flex items-center gap-1 line-clamp-1">
                      <MapPin className="w-3 h-3 text-slate-500 flex-shrink-0" />
                      <span>{theatre.address}</span>
                    </p>

                    <div className="pt-1 flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                      <Tv className="w-3.5 h-3.5 text-[#8cf202]" />
                      <span>{theatreScreens.length} {theatreScreens.length === 1 ? 'Screen' : 'Screens'}</span>
                      {theatreScreens.length > 0 && (
                        <span className="text-slate-500 text-[10px]">
                          ({theatreScreens.map((s) => s.screenType).join(', ')})
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-white/[0.05] flex items-center justify-between gap-2">
                    <button
                      onClick={() => openAddScreenForTheatre(theatre.id)}
                      className="flex items-center gap-1 text-[11px] font-bold text-black bg-[#8cf202] hover:bg-[#9eff00] px-3 py-1.5 rounded-lg transition"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add Screen</span>
                    </button>

                    <button
                      onClick={() => handleDeleteTheatre(theatre.id, theatre.name)}
                      title="Delete Multiplex"
                      className="p-1.5 text-rose-400 hover:text-white hover:bg-rose-600 rounded-lg transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 2. Configured Screens & Auditoriums Section */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
            <Tv className="w-4 h-4 text-amber-400" />
            <span>Configured Screens & Auditoriums ({screens.length})</span>
          </h2>
          <button
            onClick={() => {
              setError('');
              setShowAddScreenModal(true);
            }}
            className="text-xs text-amber-400 hover:underline font-bold flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Screen</span>
          </button>
        </div>

        <div className="bg-[#0c121d] border border-white/[0.06] rounded-2xl overflow-hidden shadow-xl">
          {loading ? (
            <div className="p-10 text-center text-xs text-slate-400">Loading auditoriums...</div>
          ) : screens.length === 0 ? (
            <div className="p-10 text-center text-xs text-slate-400 flex flex-col items-center justify-center space-y-2">
              <Tv className="w-8 h-8 text-slate-600" />
              <p className="font-bold text-white">No screens configured yet</p>
              <p className="text-slate-400">Add an auditorium to any of your multiplexes above.</p>
            </div>
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
                  className="w-full bg-[#0e1118] text-white border border-white/[0.15] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#8cf202]"
                >
                  {theatres.map((t) => (
                    <option key={t.id} value={t.id} className="bg-[#0e1118] text-white py-1">
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
                  className="w-full bg-[#0e1118] text-white border border-white/[0.12] rounded-xl px-3 py-2 text-xs placeholder-slate-500 focus:outline-none focus:border-[#8cf202]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Projection Format *
                </label>
                <select
                  value={screenType}
                  onChange={(e) => setScreenType(e.target.value)}
                  className="w-full bg-[#0e1118] text-white border border-white/[0.15] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#8cf202]"
                >
                  <option value="IMAX" className="bg-[#0e1118] text-white py-1">IMAX with Laser</option>
                  <option value="4DX" className="bg-[#0e1118] text-white py-1">4DX Motion &amp; Effects</option>
                  <option value="3D" className="bg-[#0e1118] text-white py-1">3D RealD</option>
                  <option value="2D" className="bg-[#0e1118] text-white py-1">Standard 2D Dolby 7.1</option>
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
                    className="w-full bg-[#0e1118] text-white border border-white/[0.12] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#8cf202]"
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
                    className="w-full bg-[#0e1118] text-white border border-white/[0.12] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#8cf202]"
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
                  className="px-4 py-1.5 bg-[#8cf202] hover:bg-[#9eff00] text-black font-black rounded-xl text-xs shadow-md transition disabled:opacity-50"
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

            {error && (
              <div className="mx-5 mt-4 p-2.5 bg-rose-500/10 border border-rose-500/20 rounded-xl text-[11px] text-rose-400 flex items-center gap-2">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

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
                  className="w-full bg-[#0e1118] text-white border border-white/[0.12] rounded-xl px-3 py-2 text-xs placeholder-slate-500 focus:outline-none focus:border-[#8cf202]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  City *
                </label>
                <input
                  type="text"
                  required
                  list="city-options"
                  placeholder="e.g. Mumbai, Delhi-NCR, Bengaluru..."
                  value={theatreCity}
                  onChange={(e) => setTheatreCity(e.target.value)}
                  className="w-full bg-[#0e1118] text-white border border-white/[0.15] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#8cf202]"
                />
                <datalist id="city-options">
                  <option value="Mumbai" />
                  <option value="Delhi-NCR" />
                  <option value="Bengaluru" />
                  <option value="Hyderabad" />
                  <option value="Chennai" />
                  <option value="Kolkata" />
                  <option value="Pune" />
                  <option value="Ahmedabad" />
                </datalist>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Street Address *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sector 18, Noida"
                  value={theatreAddress}
                  onChange={(e) => setTheatreAddress(e.target.value)}
                  className="w-full bg-[#0e1118] border border-white/[0.12] rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#8cf202]"
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
                  className="px-4 py-1.5 bg-[#8cf202] hover:bg-[#9eff00] text-black font-black rounded-xl text-xs shadow-md transition disabled:opacity-50"
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
