'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Star,
  Clock,
  Play,
  Search,
  Ticket,
  ChevronLeft,
  ChevronRight,
  Zap,
  X,
  Volume2,
  Tv,
  Film,
} from 'lucide-react';
import { MovieItem } from '@/types';

export default function HomePage() {
  const [movies, setMovies] = useState<MovieItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [trendingTab, setTrendingTab] = useState<'DAY' | 'WEEK' | 'MONTH'>('DAY');
  const [showNotice, setShowNotice] = useState(true);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  useEffect(() => {
    fetchMovies();
  }, []);

  // Auto-cycle banners every 5 seconds
  useEffect(() => {
    if (movies.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentBannerIndex((prev) => (prev + 1) % Math.min(movies.length, 5));
    }, 5000);
    return () => clearInterval(interval);
  }, [movies.length]);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/movies');
      const data = await res.json();
      setMovies(data.movies || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const filteredMovies = movies.filter((m) => {
    const matchesSearch = m.title.toLowerCase().includes(search.toLowerCase());
    if (activeFilter === 'All') return matchesSearch;
    return matchesSearch && m.genre.toLowerCase().includes(activeFilter.toLowerCase());
  });

  const recentPremieredMovies = movies.slice(0, 5);
  const activeBannerMovie = recentPremieredMovies[currentBannerIndex] || recentPremieredMovies[0];
  const featuredBanners = movies.slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* 1. Neon Green Notice Banner (Exactly as in Reference Image 2) */}
      {showNotice && (
        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-[#0b1308] border border-[#8cf202]/30 rounded-xl text-xs overflow-hidden shadow-lg shadow-[#8cf202]/5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#8cf202]/15 text-[#8cf202] flex items-center justify-center flex-shrink-0">
              <Zap className="w-4 h-4 fill-[#8cf202]" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase font-black tracking-wider text-[#8cf202] block">
                BOX OFFICE PREMIERE LINEUP
              </span>
              <p className="text-slate-300 text-xs mt-0.5">
                Psst!! Latest IMAX Laser & 4DX shows are live! Click any movie to reserve your favourite recliner seats :)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            <Link
              href="/#now-showing"
              className="px-3 py-1.5 bg-[#8cf202]/15 hover:bg-[#8cf202]/25 border border-[#8cf202]/40 rounded-lg text-[#8cf202] text-[11px] font-black uppercase tracking-wider transition"
            >
              EXPLORE SHOWS &gt;
            </Link>
            <button
              onClick={() => setShowNotice(false)}
              className="text-slate-500 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 2. Main Two-Column Layout (Matching Reference Image 2) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Movies & Carousels (75% / 9 cols) */}
        <div className="lg:col-span-8 xl:col-span-9 space-y-8">
          
          {/* Section: Recent Premiered Films Banner (Immersive Widescreen Showcase) */}
          {activeBannerMovie && (
            <section className="relative rounded-2xl overflow-hidden border border-white/[0.08] bg-[#0c0f16] shadow-2xl group">
              <div className="relative w-full h-80 sm:h-96">
                <img
                  src={activeBannerMovie.bannerUrl || activeBannerMovie.posterUrl}
                  alt={activeBannerMovie.title}
                  className="w-full h-full object-cover opacity-35 scale-105 transition-all duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#06080c] via-[#06080c]/60 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#06080c] via-[#06080c]/80 to-transparent" />

                {/* Banner Content */}
                <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-end space-y-3 max-w-xl">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#8cf202] animate-pulse shadow-[0_0_8px_#8cf202]" />
                    <span className="text-[10px] font-mono font-black uppercase tracking-wider text-[#8cf202] bg-[#8cf202]/10 border border-[#8cf202]/25 px-2 py-0.5 rounded">
                      RECENT PREMIERE
                    </span>
                    <span className="bg-black/60 backdrop-blur-md text-[10px] font-bold text-slate-300 border border-white/10 px-2 py-0.5 rounded uppercase">
                      IMAX Laser
                    </span>
                  </div>

                  <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
                    {activeBannerMovie.title}
                  </h2>

                  <div className="flex flex-wrap items-center gap-2.5 text-xs text-slate-300">
                    <span className="flex items-center gap-1 text-amber-400 font-bold bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded">
                      <Star className="w-3 h-3 fill-amber-400" />
                      {activeBannerMovie.rating}/10
                    </span>
                    <span className="bg-white/[0.04] px-2 py-0.5 rounded border border-white/[0.06]">
                      {activeBannerMovie.language}
                    </span>
                    <span className="bg-white/[0.04] px-2 py-0.5 rounded border border-white/[0.06]">
                      {activeBannerMovie.genre}
                    </span>
                    <span className="text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {activeBannerMovie.durationMin}m
                    </span>
                  </div>

                  <p className="text-slate-300 text-xs sm:text-sm line-clamp-2 leading-relaxed">
                    {activeBannerMovie.description}
                  </p>

                  <div className="flex items-center gap-3 pt-1">
                    <Link
                      href={`/movie/${activeBannerMovie.id}`}
                      className="flex items-center gap-2 bg-[#8cf202] hover:bg-[#9eff00] text-black font-black text-xs px-5 py-2.5 rounded-xl shadow-[0_0_15px_rgba(140,242,2,0.35)] transition-all hover:scale-102 uppercase tracking-wide"
                    >
                      <Ticket className="w-4 h-4" />
                      <span>Book Tickets</span>
                    </Link>

                    {activeBannerMovie.trailerUrl && (
                      <a
                        href={activeBannerMovie.trailerUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1.5 bg-white/[0.05] hover:bg-white/[0.09] border border-white/[0.08] text-white font-bold text-xs px-4 py-2.5 rounded-xl transition"
                      >
                        <Play className="w-3.5 h-3.5 text-[#8cf202] fill-[#8cf202]" />
                        <span>Trailer</span>
                      </a>
                    )}
                  </div>
                </div>

                {/* Left & Right Slide Controls */}
                {recentPremieredMovies.length > 1 && (
                  <>
                    <button
                      onClick={() =>
                        setCurrentBannerIndex((prev) =>
                          prev === 0 ? recentPremieredMovies.length - 1 : prev - 1
                        )
                      }
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 border border-white/10 text-white flex items-center justify-center transition opacity-0 group-hover:opacity-100"
                      aria-label="Previous banner"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() =>
                        setCurrentBannerIndex((prev) =>
                          prev === recentPremieredMovies.length - 1 ? 0 : prev + 1
                        )
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 border border-white/10 text-white flex items-center justify-center transition opacity-0 group-hover:opacity-100"
                      aria-label="Next banner"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </>
                )}

                {/* Slide indicator dots */}
                {recentPremieredMovies.length > 1 && (
                  <div className="absolute bottom-3 right-4 flex items-center gap-1.5">
                    {recentPremieredMovies.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentBannerIndex(i)}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          i === currentBannerIndex
                            ? 'w-6 bg-[#8cf202] shadow-[0_0_6px_#8cf202]'
                            : 'w-1.5 bg-white/30 hover:bg-white/50'
                        }`}
                        aria-label={`Slide ${i + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Section: Latest Releases / Now Showing (Matching Image 1 & Image 2) */}
          <section id="now-showing" className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h2 className="text-lg font-black text-white flex items-center gap-2 tracking-tight">
                <span className="w-1.5 h-4 bg-[#8cf202] rounded-full inline-block shadow-[0_0_8px_#8cf202]" />
                <span>Now Showing</span>
              </h2>

              {/* Filter toggles & Carousel Arrows (Image 2 style) */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 text-xs">
                  {['All', 'Action', 'Sci-Fi', 'Adventure'].map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setActiveFilter(filter)}
                      className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all ${
                        activeFilter === filter
                          ? 'text-[#8cf202] bg-[#8cf202]/15 font-black'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-1 border-l border-white/[0.08] pl-3">
                  <button
                    aria-label="Previous"
                    className="p-1 rounded bg-[#0e1118] border border-white/[0.08] text-slate-400 hover:text-white hover:border-[#8cf202]"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    aria-label="Next"
                    className="p-1 rounded bg-[#0e1118] border border-white/[0.08] text-slate-400 hover:text-white hover:border-[#8cf202]"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Poster Cards Grid (Exact design from Image 1 & 2) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredMovies.map((movie) => (
                <div key={movie.id} className="group flex flex-col space-y-2">
                  {/* Poster Thumbnail */}
                  <Link
                    href={`/movie/${movie.id}`}
                    className="relative block aspect-[3/4.2] w-full rounded-xl overflow-hidden bg-[#0c0f16] border border-white/[0.08] group-hover:border-[#8cf202]/60 transition-all duration-300 group-hover:shadow-[0_0_20px_rgba(140,242,2,0.15)]"
                  >
                    <img
                      src={movie.posterUrl}
                      alt={movie.title}
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />

                    {/* Top Badges: Star Rating & Age Rating (Image 1 style) */}
                    <div className="absolute top-2 left-2 flex items-center gap-1.5">
                      <div className="flex items-center gap-1 bg-black/80 backdrop-blur-md px-1.5 py-0.5 rounded text-[10px] font-black text-amber-400 border border-white/10">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span>{movie.rating}</span>
                      </div>
                      <div className="bg-black/80 backdrop-blur-md px-1.5 py-0.5 rounded text-[9px] font-bold text-slate-300 border border-white/10">
                        PG-13
                      </div>
                    </div>

                    {/* Bottom Specs Bar on the image (Exact icons from Image 1: [12 / mic / list]) */}
                    <div className="absolute bottom-2 inset-x-2 flex items-center justify-between text-[10px] font-mono bg-black/80 backdrop-blur-md px-2 py-1 rounded border border-white/10 text-slate-300">
                      <div className="flex items-center gap-2">
                        <span className="flex items-center gap-1">
                          <Tv className="w-3 h-3 text-[#8cf202]" />
                          IMAX
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Volume2 className="w-3 h-3 text-slate-400" />
                          Dolby
                        </span>
                      </div>
                      <span className="text-[#8cf202] font-black">Book</span>
                    </div>
                  </Link>

                  {/* Title & Info Below Poster (Image 1 style) */}
                  <div className="space-y-0.5 px-0.5">
                    <Link
                      href={`/movie/${movie.id}`}
                      className="flex items-center gap-1.5 group-hover:text-[#8cf202] transition-colors"
                    >
                      {/* Green Status Dot */}
                      <span className="w-1.5 h-1.5 rounded-full bg-[#8cf202] inline-block flex-shrink-0 shadow-[0_0_5px_#8cf202]" />
                      <h3 className="font-black text-xs text-white line-clamp-1">
                        {movie.title}
                      </h3>
                    </Link>
                    <p className="text-[10px] text-slate-500 font-medium pl-3">
                      {movie.language.split(',')[0]} • {movie.durationMin}m
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section: New on Site (Image 1 style section) */}
          <section className="space-y-4 pt-4">
            <h2 className="text-lg font-black text-white flex items-center gap-2 tracking-tight">
              <span className="w-1.5 h-4 bg-[#8cf202] rounded-full inline-block shadow-[0_0_8px_#8cf202]" />
              <span>New on Site</span>
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {movies.map((movie) => (
                <Link
                  key={`new-${movie.id}`}
                  href={`/movie/${movie.id}`}
                  className="group bg-[#0e1118] border border-white/[0.06] hover:border-[#8cf202]/50 p-2 rounded-xl transition flex items-center gap-3"
                >
                  <img
                    src={movie.posterUrl}
                    alt={movie.title}
                    className="w-10 h-14 object-cover rounded-lg flex-shrink-0"
                  />
                  <div className="space-y-0.5 overflow-hidden">
                    <span className="text-[9px] text-[#8cf202] font-mono font-bold block uppercase">
                      Premiere
                    </span>
                    <h4 className="font-bold text-xs text-white truncate group-hover:text-[#8cf202] transition-colors">
                      {movie.title}
                    </h4>
                    <span className="text-[10px] text-slate-500 block">
                      ★ {movie.rating} • {movie.durationMin}m
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column: Top Trending Ranking Board (Matching Reference Image 2) */}
        <div className="lg:col-span-4 xl:col-span-3">
          <div className="sticky top-20 bg-[#0c0f16] border border-white/[0.08] rounded-2xl p-4 sm:p-5 space-y-4 shadow-xl">
            {/* Header with DAY / WEEK / MONTH tabs */}
            <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
              <h3 className="font-black text-sm text-white tracking-tight">
                Top Trending
              </h3>

              <div className="flex items-center gap-2 text-[10px] font-bold">
                {(['DAY', 'WEEK', 'MONTH'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setTrendingTab(tab)}
                    className={`transition-colors uppercase tracking-wider ${
                      trendingTab === tab
                        ? 'text-[#8cf202] border-b-2 border-[#8cf202] pb-0.5'
                        : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Ranked List (Exact huge italic numbers from Image 2) */}
            <div className="space-y-3.5">
              {movies.slice(0, 5).map((movie, index) => {
                const rank = index + 1;
                return (
                  <Link
                    key={`rank-${movie.id}`}
                    href={`/movie/${movie.id}`}
                    className="group relative flex items-center gap-3.5 p-2 rounded-xl hover:bg-white/[0.03] transition duration-200"
                  >
                    {/* Big Italic Number (Image 2 style) */}
                    <span className="text-3xl font-black italic tracking-tighter text-slate-500 group-hover:text-[#8cf202] transition-colors w-7 text-center font-rank">
                      {rank}
                    </span>

                    {/* Movie info */}
                    <div className="flex-1 min-w-0 space-y-1">
                      <h4 className="font-black text-xs text-white group-hover:text-[#8cf202] transition-colors truncate">
                        {movie.title}
                      </h4>

                      <div className="flex items-center gap-2 text-[10px]">
                        <span className="flex items-center gap-1 text-amber-400 font-bold">
                          <Star className="w-2.5 h-2.5 fill-amber-400" />
                          {movie.rating}
                        </span>
                        <span className="text-slate-500 uppercase font-semibold text-[9px] bg-white/[0.04] px-1.5 py-0.2 rounded">
                          IMAX
                        </span>
                      </div>

                      {/* Specs bar (like Image 2 bottom row in rank widget) */}
                      <div className="flex items-center gap-2 text-[9px] font-mono text-slate-500">
                        <span>4DX</span>
                        <span>•</span>
                        <span>Dolby 7.1</span>
                      </div>
                    </div>

                    {/* Mini thumbnail */}
                    <img
                      src={movie.posterUrl}
                      alt={movie.title}
                      className="w-9 h-12 object-cover rounded-md border border-white/[0.08] flex-shrink-0"
                    />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
