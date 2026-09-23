'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  Star,
  Clock,
  Calendar,
  Play,
  MapPin,
  ChevronRight,
  Info,
  Film,
  Zap,
} from 'lucide-react';
import { MovieItem, ShowItem } from '@/types';

export default function MovieDetailPage() {
  const params = useParams();
  const movieId = params.id as string;

  const [movie, setMovie] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [availableDates, setAvailableDates] = useState<{ dateStr: string; label: string; day: string }[]>([]);

  useEffect(() => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 4; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const dateStr = d.toISOString().split('T')[0];
      const day = d.toLocaleDateString('en-US', { weekday: 'short' });
      const label = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : `${d.getDate()} ${d.toLocaleDateString('en-US', { month: 'short' })}`;
      dates.push({ dateStr, label, day });
    }
    setAvailableDates(dates);
    if (dates.length > 0) {
      setSelectedDate(dates[0].dateStr);
    }
  }, []);

  useEffect(() => {
    if (movieId) {
      fetchMovieDetails();
    }
  }, [movieId]);

  const fetchMovieDetails = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/movies/${movieId}`);
      const data = await res.json();
      setMovie(data.movie);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 animate-pulse space-y-8">
        <div className="h-72 bg-[#0c1017] rounded-3xl" />
        <div className="h-40 bg-[#0c1017] rounded-3xl" />
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <h2 className="text-xl font-bold text-white">Movie Not Found</h2>
        <Link href="/" className="inline-block mt-3 text-xs text-[#8cf202] hover:underline">
          Return to Movies
        </Link>
      </div>
    );
  }

  const filteredShows = (movie.shows || []).filter((show: any) => {
    const showDate = new Date(show.startTime).toISOString().split('T')[0];
    return showDate === selectedDate;
  });

  const theatreMap: Record<string, { theatre: any; screens: Record<string, { screen: any; shows: any[] }> }> = {};

  filteredShows.forEach((show: any) => {
    const theatre = show.screen.theatre;
    if (!theatreMap[theatre.id]) {
      theatreMap[theatre.id] = { theatre, screens: {} };
    }
    const screen = show.screen;
    if (!theatreMap[theatre.id].screens[screen.id]) {
      theatreMap[theatre.id].screens[screen.id] = { screen, shows: [] };
    }
    theatreMap[theatre.id].screens[screen.id].shows.push(show);
  });

  return (
    <div className="space-y-8 pb-20">
      {/* Cinematic Backdrop Header */}
      <div className="relative bg-[#080b11] border-b border-white/[0.06]">
        <div className="absolute inset-0 overflow-hidden">
          <img
            src={movie.bannerUrl || movie.posterUrl}
            alt={movie.title}
            className="w-full h-full object-cover opacity-20 filter blur-xl"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#06080c] via-[#06080c]/80 to-transparent" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Poster Card */}
            <div className="w-48 sm:w-56 flex-shrink-0 rounded-2xl overflow-hidden shadow-2xl border border-white/[0.1] bg-[#0c0f16]">
              <img
                src={movie.posterUrl}
                alt={movie.title}
                className="w-full h-72 sm:h-80 object-cover"
              />
            </div>

            {/* Movie Info */}
            <div className="flex-1 space-y-3.5">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-4 bg-[#8cf202] rounded-full inline-block shadow-[0_0_8px_#8cf202]" />
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#8cf202] font-black">
                  NOW PLAYING
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
                {movie.title}
              </h1>

              <div className="flex flex-wrap items-center gap-2.5 text-xs">
                <span className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/25 text-amber-400 font-bold px-2.5 py-1 rounded-lg">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  {movie.rating}/10
                </span>
                <span className="bg-white/[0.04] border border-white/[0.06] text-slate-300 px-2.5 py-1 rounded-lg font-medium">
                  {movie.language}
                </span>
                <span className="bg-white/[0.04] border border-white/[0.06] text-slate-300 px-2.5 py-1 rounded-lg font-medium">
                  {movie.genre}
                </span>
                <span className="text-slate-400 flex items-center gap-1 font-medium bg-white/[0.04] border border-white/[0.06] px-2.5 py-1 rounded-lg">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {movie.durationMin} mins
                </span>
              </div>

              <div className="pt-1">
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-2xl font-normal">
                  {movie.description}
                </p>
              </div>

              {movie.trailerUrl && (
                <div className="pt-2">
                  <a
                    href={movie.trailerUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 bg-[#8cf202]/10 hover:bg-[#8cf202]/20 border border-[#8cf202]/30 text-[#8cf202] font-bold text-xs px-4 py-2 rounded-xl transition"
                  >
                    <Play className="w-3.5 h-3.5 text-[#8cf202] fill-[#8cf202]" />
                    <span>Watch Official Trailer</span>
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Date Selector Navigation */}
      <div className="sticky top-16 z-30 bg-[#06080c]/90 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center gap-2 overflow-x-auto">
          {availableDates.map((item) => (
            <button
              key={item.dateStr}
              onClick={() => setSelectedDate(item.dateStr)}
              className={`flex flex-col items-center min-w-[68px] py-1.5 px-3 rounded-xl border transition-all ${
                selectedDate === item.dateStr
                  ? 'bg-[#8cf202] border-[#8cf202] text-black shadow-md shadow-[#8cf202]/20 font-black'
                  : 'bg-white/[0.02] border-white/[0.05] text-slate-400 hover:text-white hover:border-white/[0.1]'
              }`}
            >
              <span className="text-[9px] uppercase font-bold tracking-wider opacity-80">
                {item.day}
              </span>
              <span className="text-xs font-black mt-0.5">
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Theatres & Showtimes List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <span className="w-1.5 h-4 bg-[#8cf202] rounded-full inline-block shadow-[0_0_8px_#8cf202]" />
            <span>Select Cinema &amp; Showtime</span>
          </h2>
          <span className="text-xs text-slate-500 font-medium">
            {Object.keys(theatreMap).length} Multiplexes Active
          </span>
        </div>

        {Object.keys(theatreMap).length === 0 ? (
          <div className="p-12 text-center bg-[#0c0f16] rounded-2xl border border-white/[0.06]">
            <Info className="w-7 h-7 text-slate-500 mx-auto mb-2" />
            <p className="text-sm font-semibold text-white">No Shows Available for this Date</p>
            <p className="text-xs text-slate-500 mt-0.5">Please select another date from the tabs above.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {Object.values(theatreMap).map(({ theatre, screens }) => (
              <div
                key={theatre.id}
                className="bg-[#0c0f16] border border-white/[0.06] rounded-2xl p-4 sm:p-5 hover:border-white/[0.1] transition-colors"
              >
                {/* Theatre Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-3.5 border-b border-white/[0.05]">
                  <div>
                    <h3 className="text-sm font-black text-white flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#8cf202] flex-shrink-0" />
                      <span>{theatre.name}</span>
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-0.5 pl-5">
                      {theatre.address}, {theatre.city}
                    </p>
                  </div>
                </div>

                {/* Screens & Showtimes */}
                <div className="pt-3.5 space-y-3.5">
                  {Object.values(screens).map(({ screen, shows }) => (
                    <div key={screen.id} className="flex flex-col sm:flex-row sm:items-center gap-3">
                      {/* Screen badge */}
                      <div className="sm:w-44 flex-shrink-0">
                        <span className="text-xs font-semibold text-slate-200">
                          {screen.name}
                        </span>
                        <div className="mt-0.5">
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#8cf202]/15 text-[#8cf202] border border-[#8cf202]/30">
                            {screen.screenType}
                          </span>
                        </div>
                      </div>

                      {/* Show chips */}
                      <div className="flex flex-wrap items-center gap-2">
                        {shows.map((show: any) => {
                          const timeFormatted = new Date(show.startTime).toLocaleTimeString('en-US', {
                            hour: 'numeric',
                            minute: '2-digit',
                            hour12: true,
                          });

                          return (
                            <Link
                              key={show.id}
                              href={`/booking/${show.id}`}
                              className="group flex flex-col items-center px-3.5 py-1.5 bg-[#121622] hover:bg-[#8cf202] border border-white/[0.08] hover:border-[#8cf202] rounded-xl transition duration-150"
                            >
                              <span className="text-xs font-black text-white group-hover:text-black">
                                {timeFormatted}
                              </span>
                              <span className="text-[9px] text-slate-400 group-hover:text-black font-semibold">
                                From ₹{show.priceSilver}
                              </span>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
