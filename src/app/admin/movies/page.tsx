'use client';

import React, { useState, useEffect } from 'react';
import {
  Film,
  Plus,
  Trash2,
  Edit,
  Star,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  X,
  Play,
} from 'lucide-react';
import { MovieItem } from '@/types';

export default function AdminMoviesPage() {
  const [movies, setMovies] = useState<MovieItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [posterUrl, setPosterUrl] = useState('');
  const [bannerUrl, setBannerUrl] = useState('');
  const [trailerUrl, setTrailerUrl] = useState('');
  const [genre, setGenre] = useState('Action, Sci-Fi');
  const [language, setLanguage] = useState('English');
  const [durationMin, setDurationMin] = useState(135);
  const [rating, setRating] = useState(8.2);
  const [releaseDate, setReleaseDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/movies?includeInactive=true');
      const data = await res.json();
      setMovies(data.movies || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMovie = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/movies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          posterUrl,
          bannerUrl: bannerUrl || posterUrl,
          trailerUrl,
          genre,
          language,
          durationMin,
          rating,
          releaseDate,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to add movie');
      }

      setSuccessMessage(`"${title}" was added to the cinema catalog!`);
      setShowAddModal(false);
      resetForm();
      fetchMovies();

      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteMovie = async (movieId: string, movieTitle: string) => {
    if (!confirm(`Are you sure you want to remove "${movieTitle}"? This will also remove scheduled shows in all screens.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/movies/${movieId}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete movie');

      setSuccessMessage(`"${movieTitle}" has been removed.`);
      fetchMovies();
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setPosterUrl('');
    setBannerUrl('');
    setTrailerUrl('');
    setGenre('Action, Sci-Fi');
    setLanguage('English');
    setDurationMin(135);
    setRating(8.2);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Film className="w-5 h-5 text-rose-500" />
            <span>Movies Catalog</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Add theatrical titles, update movie metadata, and remove archived films
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs px-3.5 py-2 rounded-xl shadow-sm transition hover:scale-102"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add New Movie</span>
        </button>
      </div>

      {/* Alert Banner */}
      {successMessage && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-400 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Movies Table */}
      <div className="bg-[#0c121d] border border-white/[0.06] rounded-2xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-10 text-center text-xs text-slate-400">Loading movie database...</div>
        ) : movies.length === 0 ? (
          <div className="p-10 text-center text-xs text-slate-400">No movies found in the database.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[9px] uppercase font-bold text-slate-500 bg-white/[0.02] border-b border-white/[0.04]">
                <tr>
                  <th className="p-3.5">Movie Title</th>
                  <th className="p-3.5">Genre & Language</th>
                  <th className="p-3.5">Duration</th>
                  <th className="p-3.5">Rating</th>
                  <th className="p-3.5">Release Date</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {movies.map((movie) => (
                  <tr key={movie.id} className="hover:bg-white/[0.02] transition">
                    <td className="p-3.5">
                      <div className="flex items-center gap-3">
                        <img
                          src={movie.posterUrl}
                          alt={movie.title}
                          className="w-9 h-12 object-cover rounded-lg border border-white/[0.08] flex-shrink-0"
                        />
                        <div>
                          <span className="font-bold text-white block text-xs">{movie.title}</span>
                          <span className="text-[10px] text-slate-500 line-clamp-1 max-w-xs">
                            {movie.description}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="p-3.5">
                      <span className="text-slate-200 block font-medium text-xs">{movie.genre}</span>
                      <span className="text-[10px] text-slate-500">{movie.language}</span>
                    </td>
                    <td className="p-3.5 text-slate-300 font-medium text-xs">
                      {movie.durationMin}m
                    </td>
                    <td className="p-3.5">
                      <span className="inline-flex items-center gap-1 bg-amber-500/10 text-amber-400 px-1.5 py-0.5 rounded text-[10px] font-bold">
                        <Star className="w-2.5 h-2.5 fill-amber-400" />
                        {movie.rating}
                      </span>
                    </td>
                    <td className="p-3.5 text-slate-400 text-xs">
                      {new Date(movie.releaseDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => handleDeleteMovie(movie.id, movie.title)}
                        title="Remove Movie"
                        className="p-1.5 text-rose-400 hover:text-white hover:bg-rose-600 rounded-lg transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Movie Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-xl bg-[#0c121d] border border-white/[0.09] rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-5 border-b border-white/[0.06] flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Add Movie Title</h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Publish a new movie title to the BookShow cinema catalog
                </p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-white/[0.06]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddMovie} className="p-5 overflow-y-auto space-y-3.5">
              {error && (
                <div className="p-2.5 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-400">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Movie Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Avatar: Fire and Ash"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Description / Synopsis *
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Enter storyline, plot overview, and background..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Poster Image URL *
                  </label>
                  <input
                    type="url"
                    required
                    placeholder="https://images.unsplash.com/..."
                    value={posterUrl}
                    onChange={(e) => setPosterUrl(e.target.value)}
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Banner / Backdrop URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={bannerUrl}
                    onChange={(e) => setBannerUrl(e.target.value)}
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Genre *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Action, Sci-Fi"
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Language *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. English, Hindi"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Duration (Minutes) *
                  </label>
                  <input
                    type="number"
                    required
                    min={30}
                    max={360}
                    value={durationMin}
                    onChange={(e) => setDurationMin(Number(e.target.value))}
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Rating (out of 10)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="10"
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Release Date
                  </label>
                  <input
                    type="date"
                    required
                    value={releaseDate}
                    onChange={(e) => setReleaseDate(e.target.value)}
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    YouTube Trailer URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://www.youtube.com/watch?v=..."
                    value={trailerUrl}
                    onChange={(e) => setTrailerUrl(e.target.value)}
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              {/* Poster Preview */}
              {posterUrl && (
                <div className="p-2.5 bg-white/[0.02] rounded-xl border border-white/[0.06] flex items-center gap-3">
                  <img
                    src={posterUrl}
                    alt="Preview"
                    className="w-10 h-14 object-cover rounded-lg border border-white/[0.08]"
                    onError={(e) => ((e.target as any).style.display = 'none')}
                  />
                  <span className="text-[11px] text-slate-400">Live Poster Preview</span>
                </div>
              )}

              <div className="pt-3 border-t border-white/[0.06] flex justify-end gap-2.5">
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
                  className="px-4 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs shadow-md transition disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : 'Save & Publish Movie'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
